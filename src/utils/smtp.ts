/**
 * Minimal SMTP-over-TLS (implicit SSL, port 465) client for Cloudflare Workers.
 * Uses cloudflare:sockets for raw TCP with TLS.
 * Sends HTML emails via Zoho SMTP (smtppro.zoho.com:465).
 * 
 * In local dev: exports a no-op stub that logs instead of throwing.
 */

export interface SmtpConfig {
  host: string
  port: number
  user: string    // SMTP username (= from address)
  pass: string    // SMTP app password
  fromName?: string
}

export interface EmailMessage {
  to: string | string[]
  subject: string
  html: string
  text?: string
}

// Check if we're in Cloudflare Workers runtime
const inCloudflare = typeof globalThis.cloudflare !== 'undefined'

// Lazy-loaded import for cloudflare:sockets (only in CF Workers)
let cfSockets: typeof import('cloudflare:sockets') | null = null

async function getCfSockets() {
  if (!cfSockets) {
    try {
      // @ts-ignore — only exists in Workers
      cfSockets = await import('cloudflare:sockets')
    } catch {
      // Return a mock that throws for local dev
      cfSockets = { 
        connect: () => { throw new Error('cloudflare:sockets not available in local dev') }
      } as typeof import('cloudflare:sockets')
    }
  }
  return cfSockets
}

/** Send an HTML email via Zoho SMTP over TLS (port 465) */
export async function sendEmail(config: SmtpConfig, msg: EmailMessage): Promise<void> {
  // Local dev: log instead of throwing
  if (!inCloudflare) {
    const toList = Array.isArray(msg.to) ? msg.to : [msg.to]
    console.log('[SMTP STUB] Would send email:')
    console.log('  To:', toList.join(', '))
    console.log('  Subject:', msg.subject)
    console.log('  (Email sending disabled in local dev)')
    return
  }

  // Cloudflare Workers: real SMTP
  const { connect } = await getCfSockets()

  const toList = Array.isArray(msg.to) ? msg.to : [msg.to]
  const fromDisplay = config.fromName
    ? `"${config.fromName}" <${config.user}>`
    : config.user

  // Build MIME multipart/alternative message
  const boundary = `----=_Part_${Date.now().toString(36)}_${Math.random().toString(36).slice(2)}`
  const subjectB64 = `=?utf-8?B?${btoa(unescape(encodeURIComponent(msg.subject)))}?=`
  const plainText = msg.text || msg.html.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim()

  const mimeLines = [
    `From: ${fromDisplay}`,
    `To: ${toList.join(', ')}`,
    `Subject: ${subjectB64}`,
    `MIME-Version: 1.0`,
    `Content-Type: multipart/alternative; boundary="${boundary}"`,
    ``,
    `--${boundary}`,
    `Content-Type: text/plain; charset=utf-8`,
    `Content-Transfer-Encoding: base64`,
    ``,
    btoa(unescape(encodeURIComponent(plainText))),
    ``,
    `--${boundary}`,
    `Content-Type: text/html; charset=utf-8`,
    `Content-Transfer-Encoding: base64`,
    ``,
    btoa(unescape(encodeURIComponent(msg.html))),
    ``,
    `--${boundary}--`,
  ]

  // Dot-stuffing
  const mimeBody = mimeLines
    .map(line => (line === '.' ? '..' : line.startsWith('.') ? '.' + line : line))
    .join('\r\n')

  // @ts-ignore
  const socket = connect(
    { hostname: config.host, port: config.port },
    { secureTransport: 'on' }
  )

  const enc = new TextEncoder()
  const dec = new TextDecoder()
  let buf = ''

  const reader = socket.readable.getReader()
  const writer = socket.writable.getWriter()

  async function readResponse(): Promise<{ code: number; text: string }> {
    const lines: string[] = []
    while (true) {
      let nlIdx = buf.indexOf('\n')
      while (nlIdx < 0) {
        const { value, done } = await reader.read()
        if (done) throw new Error('SMTP: connection closed')
        buf += dec.decode(value)
        nlIdx = buf.indexOf('\n')
      }
      const line = buf.slice(0, nlIdx).replace(/\r$/, '')
      buf = buf.slice(nlIdx + 1)
      lines.push(line)
      if (line.length < 4 || line[3] === ' ') {
        return { code: parseInt(line.slice(0, 3), 10), text: lines.join('\n') }
      }
    }
  }

  async function cmd(command: string) {
    await writer.write(enc.encode(command + '\r\n'))
    return readResponse()
  }

  async function expect(command: string, expectedCode: number) {
    const resp = await cmd(command)
    if (resp.code !== expectedCode) {
      throw new Error(`SMTP: expected ${expectedCode}, got ${resp.code}`)
    }
  }

  try {
    await readResponse() // greeting
    await expect(`EHLO ${config.host}`, 250)
    await cmd('AUTH LOGIN')
    await cmd(btoa(config.user))
    await cmd(btoa(config.pass))
    await expect(`MAIL FROM:<${config.user}>`, 250)
    for (const to of toList) {
      await expect(`RCPT TO:<${to}>`, 250)
    }
    await expect('DATA', 354)
    await writer.write(enc.encode(mimeBody + '\r\n.\r\n'))
    const result = await readResponse()
    if (result.code !== 250) throw new Error(`SMTP rejected: ${result.text}`)
    await writer.write(enc.encode('QUIT\r\n'))
  } finally {
    try { await writer.close() } catch { /* ignore */ }
    try { await socket.close() } catch { /* ignore */ }
  }
}