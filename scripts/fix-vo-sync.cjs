// Fix layers: exit after narrator finishes + hold time by phrase length
// Short phrase (<=5 words)  = 0.6s hold
// Medium phrase (6-9 words) = 0.8s hold
// Long phrase  (10+ words)  = 1.2s hold
const fs = require('fs');
const t = JSON.parse(fs.readFileSync('./public/sgcclaw-promo-template.json'));
const layers = t.composition.scenes[0].layers;
const fps = 30;
const fr = s => Math.round(s * fps);

function hold(text) {
  const words = text.trim().split(/\s+/).length;
  if (words <= 5)  return 0.6;
  if (words <= 9)  return 0.8;
  return 1.2;
}

// layerId -> actual VO end time from Whisper transcript
const fixes = [
  { id: 's1-meet',   voEnd:  2.54 },
  { id: 's2-p1',     voEnd:  9.25 },
  { id: 's2-p2',     voEnd: 10.72 },
  { id: 's3-head',   voEnd: 18.98 },
  { id: 's3-rt',     voEnd: 20.52 },
  { id: 's3-c3',     voEnd: 27.26 },
  { id: 's4-head',   voEnd: 32.16 },
  { id: 's4-t2',     voEnd: 35.66 },
  { id: 's6-no',     voEnd: 46.14 },
  { id: 's6-while',  voEnd: 48.64 },
  { id: 's7-adapt',  voEnd: 54.04 },
  { id: 's8-brand',  voEnd: 66.30 },
  { id: 's8-intel',  voEnd: 69.04 },
];

let changed = 0;
fixes.forEach(fix => {
  const l = layers.find(x => x.id === fix.id);
  if (!l) { console.warn('NOT FOUND:', fix.id); return; }
  const text = (l.props.text || '').replace(/\n/g, ' ');
  const h = hold(text);
  const newEnd = fix.voEnd + h;
  const newDuration = Math.max(30, fr(newEnd) - l.from);
  const oldEndS = ((l.from + l.duration) / fps).toFixed(2);
  l.duration = newDuration;
  const newEndS = ((l.from + newDuration) / fps).toFixed(2);
  changed++;
  const words = text.trim().split(/\s+/).length;
  console.log(
    fix.id.padEnd(16),
    (oldEndS + 's').padStart(8), '->', (newEndS + 's').padStart(8),
    ('(+' + h + 's hold, ' + words + 'w)').padStart(18),
    '"' + text.slice(0, 45) + '"'
  );
});

fs.writeFileSync('./public/sgcclaw-promo-template.json', JSON.stringify(t, null, 2));
console.log('\nFixed', changed, 'layers with proportional hold times.');
