// Animated circuit-board background — uses <defs> gradients and stroke-dashoffset
// for a subtle "current flowing" feel without JS.

export const CircuitBg = () => (
  <svg class="circuit-bg" viewBox="0 0 1440 800" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
    <defs>
      <linearGradient id="cGrad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#00d9ff" stop-opacity="0.6" />
        <stop offset="100%" stop-color="#0047ff" stop-opacity="0.2" />
      </linearGradient>
      <filter id="cGlow">
        <feGaussianBlur stdDeviation="1.5" result="b" />
        <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
      </filter>
    </defs>

    <g stroke="url(#cGrad)" stroke-width="1" fill="none" filter="url(#cGlow)">
      {/* horizontal lanes */}
      <path d="M0 120 L200 120 L240 160 L600 160 L640 200 L900 200 L940 160 L1440 160" />
      <path d="M0 280 L180 280 L220 240 L520 240 L560 280 L820 280 L860 320 L1440 320" />
      <path d="M0 440 L120 440 L160 400 L440 400 L480 440 L760 440 L800 480 L1440 480" />
      <path d="M0 600 L220 600 L260 560 L580 560 L620 600 L920 600 L960 640 L1440 640" />

      {/* vertical traces */}
      <path d="M300 0 L300 80 L340 120 L340 320 L300 360 L300 800" />
      <path d="M720 0 L720 60 L760 100 L760 420 L720 460 L720 800" />
      <path d="M1140 0 L1140 100 L1100 140 L1100 380 L1140 420 L1140 800" />

      {/* diagonal feeders */}
      <path d="M0 720 L80 640 L280 640 L340 700" />
      <path d="M1360 80 L1280 160 L1080 160" />
    </g>

    {/* circuit nodes */}
    <g fill="#00d9ff">
      <circle cx="200" cy="120" r="3" />
      <circle cx="600" cy="160" r="3" />
      <circle cx="900" cy="200" r="3" />
      <circle cx="180" cy="280" r="3" />
      <circle cx="520" cy="240" r="3" />
      <circle cx="820" cy="280" r="3" />
      <circle cx="440" cy="400" r="3" />
      <circle cx="760" cy="440" r="3" />
      <circle cx="300" cy="360" r="3" />
      <circle cx="720" cy="460" r="3" />
      <circle cx="1100" cy="380" r="3" />
    </g>

    {/* CSS-driven pulses to avoid SMIL animations */}
    <g class="circuit-pulses">
      <circle class="circuit-pulse one" cx="640" cy="200" r="3" fill="#00d9ff" />
      <circle class="circuit-pulse two" cx="760" cy="440" r="3" fill="#00d9ff" />
      <circle class="circuit-pulse three" cx="720" cy="460" r="2.5" fill="#00d9ff" />
    </g>
  </svg>
)
