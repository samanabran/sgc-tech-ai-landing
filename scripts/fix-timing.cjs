const fs = require('fs');
const t = JSON.parse(fs.readFileSync('./public/sgcclaw-promo-template.json'));
const layers = t.composition.scenes[0].layers;
const fps = 30;
const fr = s => Math.round(s * fps);

// Extend display duration for phrases that need more reading time
const fixes = {
  's1-tag1':    3.2,
  's1-tag2':    3.8,
  's2-p4':      3.8,
  's4-t3':      2.8,
  's7-leads':   2.8,
  's8-ready':   2.8,
  's8-contact': 3.8,
  's8-fut1':    2.8,
  's8-fut2':    2.4,
};

let changed = 0;
layers.forEach(l => {
  if (fixes[l.id] !== undefined) {
    const oldDur = (l.duration / fps).toFixed(1);
    l.duration = fr(fixes[l.id]);
    const newDur = (l.duration / fps).toFixed(1);
    console.log('  ' + l.id.padEnd(16) + oldDur.padStart(5) + 's -> ' + newDur.padStart(5) + 's  "' + (l.props.text || '').slice(0,50).replace(/\n/g,' ') + '"');
    changed++;
  }
});

fs.writeFileSync('./public/sgcclaw-promo-template.json', JSON.stringify(t, null, 2));
console.log('\nFixed', changed, 'layers.');

// Quick re-audit
console.log('\nRe-audit:');
const WORDS_PER_SEC = 3.3;
layers.filter(l => l.type === 'text').forEach(l => {
  const display = l.duration / fps;
  const words   = (l.props.text || '').trim().split(/\s+/).length;
  const needed  = Math.max(1.5, 1.2 + words * 0.28);
  const gap     = display - needed;
  if (gap < -0.2) {
    console.log('  STILL SHORT:', l.id, display.toFixed(1) + 's display /' + needed.toFixed(1) + 's needed  "' + (l.props.text || '').slice(0,50).replace(/\n/g,' ') + '"');
  }
});
console.log('  (no output above = all layers now readable)');
