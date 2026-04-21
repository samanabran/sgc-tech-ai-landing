const fs = require('fs');
const fps = 30;
const fr  = s => Math.round(s * fps);

function makeText(id, text, startS, endS, opts = {}) {
  const padS = opts.padStart ?? 0.2;
  const padE = opts.padEnd   ?? 0.3;
  const from = Math.max(0, fr(startS - padS));
  const duration = Math.max(30, fr(endS + padE) - from);
  return {
    id, type: 'text',
    position: { x: opts.x ?? 160, y: opts.y ?? 490 },
    size:     { width: opts.w ?? 1600, height: opts.h ?? 120 },
    from, duration,
    opacity: opts.opacity ?? 1,
    props: {
      text,
      fontSize:      opts.size          ?? 52,
      fontWeight:    opts.weight        ?? '300',
      color:         opts.color         ?? '#e8e8e8',
      textAlign:     opts.align         ?? 'center',
      fontFamily:   'Inter, system-ui, sans-serif',
      letterSpacing: opts.letterSpacing ?? 0.5,
    },
    animations: [
      { type: 'entrance', effect: 'fadeIn',  delay: 0, duration: 20, easing: 'easeOutCubic' },
      { type: 'exit',     effect: 'fadeOut', delay: 0, duration: 20, easing: 'easeInCubic'  },
    ]
  };
}

function makeShape(id, x, y, w, h, startS, endS, opts = {}) {
  return {
    id, type: 'shape',
    position: { x, y },
    size:     { width: w, height: h },
    from:     fr(startS),
    duration: Math.max(20, fr(endS) - fr(startS)),
    opacity: opts.opacity ?? 1,
    props: {
      shape:        opts.shape        ?? 'rectangle',
      fill:         opts.fill         ?? '#00d9ff',
      borderRadius: opts.borderRadius ?? 0,
    },
    animations: [
      { type: 'entrance', effect: opts.entrance ?? 'fadeIn', delay: 0, duration: opts.entranceDur ?? 20, easing: 'easeOutCubic' },
      { type: 'exit',     effect: 'fadeOut', delay: 0, duration: 20, easing: 'easeInCubic' }
    ]
  };
}

const TOTAL = 70;

const layers = [
  // ── PERSISTENT BACKGROUND ─────────────────────────────────────────────
  {
    id: 'bg', type: 'shape',
    position: { x: 0, y: 0 }, size: { width: 1920, height: 1080 },
    props: {
      shape: 'rectangle',
      gradient: { type: 'linear', angle: 135,
        colors: [{ offset: 0, color: '#050508' }, { offset: 1, color: '#0a0a14' }] }
    }
  },
  { id:'cl1', type:'shape', position:{x:0,y:180},  size:{width:1920,height:1}, opacity:0.07, props:{shape:'rectangle',fill:'#00d9ff'} },
  { id:'cl2', type:'shape', position:{x:0,y:540},  size:{width:1920,height:1}, opacity:0.05, props:{shape:'rectangle',fill:'#00d9ff'} },
  { id:'cl3', type:'shape', position:{x:0,y:900},  size:{width:1920,height:1}, opacity:0.05, props:{shape:'rectangle',fill:'#00d9ff'} },
  { id:'cv1', type:'shape', position:{x:300,y:0},  size:{width:1,height:1080}, opacity:0.04, props:{shape:'rectangle',fill:'#00d9ff'} },
  { id:'cv2', type:'shape', position:{x:1620,y:0}, size:{width:1,height:1080}, opacity:0.04, props:{shape:'rectangle',fill:'#00d9ff'} },

  // ── SCENE 1: INTRO 0–7.38s ────────────────────────────────────────────
  makeText('s1-meet',     'MEET',                                       0.00,  2.10, { x:360, y:340, w:1200, h:180, size:96,  weight:'700', color:'#00d9ff', align:'center', letterSpacing:16 }),
  makeText('s1-sgcclaw',  'SGC CLAW',                                   0.28,  7.10, { x:60,  y:480, w:1800, h:180, size:128, weight:'700', color:'#ffffff', align:'center', letterSpacing:10 }),
  makeText('s1-tag1',     'Not just a prediction engine.',               3.10,  4.70, { x:160, y:670, w:1600, h:70,  size:32,  weight:'300', color:'#a0c4d8', align:'center' }),
  makeText('s1-tag2',     'A centralized brain for your entire business.', 4.80, 7.30, { x:160, y:670, w:1600, h:70,  size:32,  weight:'300', color:'#a0c4d8', align:'center' }),

  // ── SCENE 2: PAIN 7.92–14.88s ─────────────────────────────────────────
  makeShape('s2-line',   160, 476, 560, 2, 7.92, 12.5, { fill:'#dc2626', opacity:0.8 }),
  makeText('s2-p1',  'Scattered data.',                                  7.92, 9.25, { x:160, y:360, w:1600, h:100, size:60, weight:'300', color:'#e0e0e0', align:'left' }),
  makeText('s2-p2',  'Slow decisions.',                                  9.30, 10.72, { x:160, y:480, w:1600, h:100, size:60, weight:'300', color:'#e0e0e0', align:'left' }),
  makeText('s2-p3',  'Manual workflows.',                               10.74, 12.50, { x:160, y:600, w:1600, h:100, size:60, weight:'300', color:'#f87171', align:'left' }),
  makeText('s2-p4',  "Your competitors aren't waiting. Neither should you.", 12.54, 14.80, { x:160, y:490, w:1600, h:100, size:44, weight:'300', color:'#e0e0e0', align:'center' }),

  // ── SCENE 3: CONNECT 15.86–27.26s ─────────────────────────────────────
  makeText('s3-head', 'SGC Claw connects across\nall your software systems.', 15.86, 18.90, { x:160, y:300, w:1600, h:160, size:46, weight:'600', color:'#00d9ff', align:'center' }),
  makeText('s3-rt',   'In real time.',                                        18.98, 20.50, { x:160, y:500, w:1600, h:80,  size:56, weight:'300', color:'#ffffff', align:'center' }),
  makeShape('s3-c1bg', 160, 340, 460, 260, 20.50, 27.10, { fill:'#00d9ff', opacity:0.12, borderRadius:14 }),
  makeText('s3-c1',   'Financial Data',                                       20.90, 26.90, { x:180, y:430, w:420, h:80,  size:28, weight:'600', color:'#ffffff', align:'center' }),
  makeShape('s3-c2bg', 730, 340, 460, 260, 21.50, 27.10, { fill:'#00d9ff', opacity:0.12, borderRadius:14 }),
  makeText('s3-c2',   'Customer Insights',                                    21.90, 26.90, { x:750, y:430, w:420, h:80,  size:28, weight:'600', color:'#ffffff', align:'center' }),
  makeShape('s3-c3bg', 1300, 340, 460, 260, 23.50, 27.10, { fill:'#00d9ff', opacity:0.12, borderRadius:14 }),
  makeText('s3-c3',   'Operational Metrics',                                  23.56, 26.90, { x:1320, y:430, w:420, h:80,  size:28, weight:'600', color:'#ffffff', align:'center' }),
  makeText('s3-apa',  'Analyzed. Predicted. Actionable.',                     25.18, 27.20, { x:160, y:720, w:1600, h:80,  size:44, weight:'300', color:'#00d9ff', align:'center' }),

  // ── SCENE 4: CAPABILITIES 1  27.84–35.66s ─────────────────────────────
  makeText('s4-head', 'In seconds, not days.',                               27.84, 30.20, { x:160, y:280, w:1600, h:100, size:68, weight:'700', color:'#ffffff', align:'center' }),
  makeShape('s4-b1', 160, 420, 460, 220, 30.24, 35.50, { fill:'#00d9ff', opacity:0.12, borderRadius:14 }),
  makeText('s4-t1',  'Generate Leads\nAutomatically',                        30.24, 35.40, { x:180, y:450, w:420, h:150, size:28, weight:'600', color:'#ffffff', align:'center' }),
  makeShape('s4-b2', 730, 420, 460, 220, 32.94, 35.50, { fill:'#00d9ff', opacity:0.12, borderRadius:14 }),
  makeText('s4-t2',  'Book Appointments',                                    32.94, 35.40, { x:750, y:500, w:420, h:80,  size:28, weight:'600', color:'#ffffff', align:'center' }),
  makeShape('s4-b3', 1300, 420, 460, 220, 34.06, 35.50, { fill:'#00d9ff', opacity:0.12, borderRadius:14 }),
  makeText('s4-t3',  'Trigger Intelligent\nWorkflows',                       34.06, 35.40, { x:1320, y:450, w:420, h:150, size:28, weight:'600', color:'#ffffff', align:'center' }),

  // ── SCENE 5: CAPABILITIES 2  36.74–46.14s ─────────────────────────────
  makeText('s5-pred', 'Predict market shifts\nbefore they happen.',           36.74, 39.50, { x:160, y:320, w:1600, h:160, size:52, weight:'300', color:'#ffffff', align:'center' }),
  makeShape('s5-bar', 680, 510, 560, 4, 37.00, 46.10, { fill:'#dc2626', opacity:0.8 }),
  makeText('s5-big',  '1,000+',                                              39.60, 45.90, { x:360, y:500, w:1200, h:180, size:128, weight:'700', color:'#00d9ff', align:'center', letterSpacing:4 }),
  makeText('s5-sub',  'Business capabilities, all working 24/7',             39.60, 45.90, { x:160, y:680, w:1600, h:70,  size:34, weight:'300', color:'#a0c4d8', align:'center' }),

  // ── SCENE 6: CLOSE  43.90–49.88s ──────────────────────────────────────
  makeText('s6-no',    'No breaks. No excuses. Just results.',               43.90, 46.10, { x:160, y:400, w:1600, h:100, size:52, weight:'300', color:'#e0e0e0', align:'center' }),
  makeText('s6-while', 'While others follow trends,',                        46.82, 48.60, { x:160, y:400, w:1600, h:80,  size:50, weight:'300', color:'#e0e0e0', align:'center' }),
  makeText('s6-you',   "you're building the future.",                        48.64, 50.80, { x:160, y:510, w:1600, h:100, size:60, weight:'700', color:'#00d9ff', align:'center' }),

  // ── SCENE 7: BRAND  51.00–56.00s ──────────────────────────────────────
  makeText('s7-adapt', "SGC Claw doesn't just adapt to AI.",                 51.00, 54.00, { x:160, y:380, w:1600, h:100, size:48, weight:'300', color:'#ffffff', align:'center' }),
  makeText('s7-leads', 'It leads the transformation.',                       54.52, 56.10, { x:160, y:500, w:1600, h:100, size:60, weight:'700', color:'#dc2626', align:'center', letterSpacing:1 }),

  // ── SCENE 8: MANIFESTO  57.26–69.04s ──────────────────────────────────
  {
    id: 's8-flash', type: 'shape',
    position: {x:0,y:0}, size:{width:1920,height:1080},
    from: fr(57.10), duration: fr(0.45), opacity: 0.9,
    props: { shape:'rectangle', fill:'#ffffff' },
    animations: [
      { type:'entrance', effect:'fadeIn',  delay:0, duration:6, easing:'linear' },
      { type:'exit',     effect:'fadeOut', delay:0, duration:6, easing:'linear' }
    ]
  },
  {
    id: 's8-bg', type: 'shape',
    position: {x:0,y:0}, size:{width:1920,height:1080},
    from: fr(57.40), duration: fr(TOTAL - 57.40),
    props: { shape:'rectangle', fill:'#000000' },
    animations: [{ type:'entrance', effect:'fadeIn', delay:0, duration:12, easing:'easeInCubic' }]
  },
  makeText('s8-ready',   'Ready to move early?',                              57.26, 59.00, { x:160, y:350, w:1600, h:100, size:64, weight:'700', color:'#ffffff', align:'center', padStart:0.1 }),
  makeText('s8-contact', 'Contact us for your specific use case.',            59.06, 61.20, { x:160, y:440, w:1600, h:80,  size:40, weight:'300', color:'#a0c4d8', align:'center' }),
  makeText('s8-fut1',    "The future isn't coming —",                         61.32, 62.65, { x:160, y:350, w:1600, h:100, size:60, weight:'300', color:'#e0e0e0', align:'center' }),
  makeText('s8-fut2',    "you're building it.",                               62.70, 63.50, { x:160, y:470, w:1600, h:100, size:72, weight:'700', color:'#dc2626', align:'center' }),
  makeText('s8-now',     'Now.',                                              64.02, 66.90, { x:160, y:340, w:1600, h:160, size:112, weight:'700', color:'#ffffff', align:'center', letterSpacing:-2 }),
  makeText('s8-brand',   'SGC Tech AI',                                       64.88, 69.00, { x:160, y:510, w:1600, h:110, size:64,  weight:'700', color:'#00d9ff', align:'center', letterSpacing:6 }),
  makeText('s8-intel',   'Intelligence Centralized.',                         67.22, 69.00, { x:160, y:630, w:1600, h:70,  size:32,  weight:'300', color:'#888888', align:'center', letterSpacing:3 }),

  // ── AUDIO ──────────────────────────────────────────────────────────────
  {
    id: 'bg-music', type: 'audio',
    position: {x:0,y:0}, size:{width:0,height:0}, from: 0,
    props: {
      src: './assets/background-music.mp3',
      volume: 0.20,
      fadeIn: 60, fadeOut: 60,
      volumeEnvelope: [
        {frame:0,    volume:0   },
        {frame:60,   volume:0.18},
        {frame:450,  volume:0.18},
        {frame:480,  volume:0.25},
        {frame:840,  volume:0.22},
        {frame:1200, volume:0.30},
        {frame:1500, volume:0.15},
        {frame:1720, volume:0.50},
        {frame:1920, volume:0.35},
        {frame:2070, volume:0   },
      ]
    }
  },
  {
    id: 'voiceover', type: 'audio',
    position: {x:0,y:0}, size:{width:0,height:0}, from: 0, duration: fr(69.5),
    props: {
      src: './assets/sgcclaw-voiceover.mp3',
      volume: 1.1,
      effects: [
        { type:'highpass',   frequency:80, Q:0.707 },
        { type:'compressor', threshold:-18, ratio:3, attack:5, release:150, knee:4 }
      ]
    }
  }
];

const template = {
  name: 'SGC TECH AI — sgcclaw Promo v4 (VO-rebuilt)',
  description: 'Video rebuilt entirely from Whisper transcript of actual voiceover. Every text element timed to actual speech.',
  version: '4.0.0',
  inputs: [],
  output: { type: 'video', width: 1920, height: 1080, fps: 30, duration: TOTAL },
  composition: {
    scenes: [{ id: 'main', startFrame: 0, endFrame: fr(TOTAL), layers }]
  }
};

fs.writeFileSync('public/sgcclaw-promo-template.json', JSON.stringify(template, null, 2));

// Verify no layer exceeds total duration
let issues = 0;
layers.filter(l => l.from !== undefined).forEach(l => {
  const end = (l.from + (l.duration||0)) / 30;
  if (end > TOTAL + 0.1) { console.error('OVERFLOW:', l.id, end.toFixed(1)+'s'); issues++; }
});

console.log(`Template written. ${layers.length} layers, ${issues} overflow issues.`);
console.log('Scenes:');
const labels = {
  's1':'INTRO 0–7.4s', 's2':'PAIN 7.9–14.9s', 's3':'CONNECT 15.9–27.3s',
  's4':'CAP1 27.8–35.7s', 's5':'CAP2 36.7–46.1s', 's6':'CLOSE 43.9–49.9s',
  's7':'BRAND 51–56s', 's8':'MANIFESTO 57.3–69s'
};
Object.entries(labels).forEach(([k,v]) => console.log(' ', k, '→', v));
