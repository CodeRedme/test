/* Shared helpers for the SYSTEM ERROR world pages. Loaded before each game's own script. */
window.SKZ = (function(){
  'use strict';
  const q = new URLSearchParams(location.search);
  const IDS = ['bangchan','leeknow','changbin','hyunjin','han','felix','seungmin','in'];
  const NAMES = { bangchan:'BANG CHAN', leeknow:'LEE KNOW', changbin:'CHANGBIN', hyunjin:'HYUNJIN', han:'HAN', felix:'FELIX', seungmin:'SEUNGMIN', in:'I.N' };
  const me = IDS.includes(q.get('char')) ? q.get('char') : null;
  const debug = q.get('debug') === '1';

  document.addEventListener('dragstart', e => e.preventDefault());   // no ghost-image dragging while aiming
  const WORLD_SHEET = { ate:5, doit:7, hop:6, karma:6 };
  const portrait = (world, id) => `chars-w${WORLD_SHEET[world] || 1}-${id}.webp`;

  /* fit a 9:16 stage inside the window; 1em inside the stage = 10 game units */
  function fit(stage){
    const w = Math.min(window.innerWidth, window.innerHeight * 9 / 16);
    stage.style.width = w + 'px';
    stage.style.height = (w * 16 / 9) + 'px';
    stage.style.fontSize = (w / 36) + 'px';
  }

  /* ---- sound (square-wave blips, no files). Follows the hub's mute setting ---- */
  let ac = null;
  let muted = false;
  try{ muted = !!JSON.parse(localStorage.getItem('skz.hub') || '{}').muted; }catch(e){}
  function beep(freq, dur, vol, type){
    if(muted) return;
    try{
      ac = ac || new (window.AudioContext || window.webkitAudioContext)();
      if(ac.state === 'suspended') ac.resume();
      const o = ac.createOscillator(), g = ac.createGain();
      o.type = type || 'square'; o.frequency.value = freq;
      g.gain.setValueAtTime(vol || .06, ac.currentTime);
      g.gain.exponentialRampToValueAtTime(.0001, ac.currentTime + (dur || .06));
      o.connect(g); g.connect(ac.destination);
      o.start(); o.stop(ac.currentTime + (dur || .06));
    }catch(e){}
  }
  const seq = notes => notes.forEach(([f, t, d]) => setTimeout(() => beep(f, d || .09), t));
  const sfx = {
    tap(){ beep(660, .04); },
    good(){ seq([[587,0],[880,70,.1]]); },
    bad(){ beep(150, .22, .06, 'sawtooth'); },
    win(){ seq([[523,0],[659,90],[784,180],[1047,270,.18]]); },
    lose(){ seq([[392,0,.12],[311,130,.12],[233,260,.25]]); },
    thud(){ beep(110, .1, .07, 'triangle'); }
  };

  /* ---- SYSTEM points: the shared wallet spent to unlock worlds in the hub ---- */
  const REWARD = 50;   // points banked every time the SYSTEM meter fills up
  const points = {
    get(){ try{ return Math.max(0, +localStorage.getItem('skz.points') || 0); }catch(e){ return 0; } },
    add(n){ const v = Math.max(0, this.get() + n); try{ localStorage.setItem('skz.points', String(v)); }catch(e){} return v; },
    spend(n){ if(this.get() < n) return false; this.add(-n); return true; }
  };

  /* ---- SYSTEM meter shared by the KARMA games. Every full lap banks REWARD points
     and the meter rolls back over, so it's a repeatable earn loop, not a one-off. ---- */
  const meter = {
    getRaw(){ try{ return Math.max(0, +localStorage.getItem('skz.meter') || 0); }catch(e){ return 0; } },
    get(){ return this.getRaw() % 100; },
    add(n){
      let raw = this.getRaw() + Math.max(0, n);
      const laps = Math.floor(raw / 100);
      raw = raw % 100;
      try{ localStorage.setItem('skz.meter', String(raw)); }catch(e){}
      const earned = laps * REWARD;
      if(earned > 0) points.add(earned);
      return { value:raw, earned };
    }
  };
  function meterUI(stage){
    const m = document.createElement('div');
    m.className = 'meter';
    m.innerHTML = '<i></i><b>SYSTEM</b>';
    stage.appendChild(m);
    const fill = m.querySelector('i');
    const api = { refresh(){ fill.style.height = meter.get() + '%'; } };
    api.refresh();
    return api;
  }
  /* a short "+50 PTS" banner across the top of the stage when the meter fills */
  function pointsBanner(stage, earned){
    if(!earned) return;
    const b = document.createElement('div');
    b.className = 'pts-banner';
    b.textContent = 'SYSTEM RESTORED · +' + earned + ' PTS';
    stage.appendChild(b);
    beep(660, .08); setTimeout(() => beep(988, .12), 90);
    setTimeout(() => b.remove(), 2200);
  }

  /* ---- overlay panel ---- */
  function overlay(stage, o){
    hideOverlay(stage);
    const ov = document.createElement('div');
    ov.className = 'overlay';
    const p = document.createElement('div');
    p.className = 'panel';
    if(o.title){ const h = document.createElement('h2'); h.textContent = o.title; p.appendChild(h); }
    (o.lines || []).forEach(t => { const el = document.createElement('p'); el.textContent = t; p.appendChild(el); });
    if(o.stars != null){ const el = document.createElement('p'); el.className = 'stars'; el.setAttribute('aria-label', o.stars + ' of 3 stars'); el.textContent = '★'.repeat(o.stars) + '☆'.repeat(3 - o.stars); p.appendChild(el); }
    const row = document.createElement('div'); row.className = 'btns';
    (o.buttons || []).forEach((b, i) => {
      const el = document.createElement(b.href ? 'a' : 'button');
      el.className = 'btn' + (b.primary ? ' primary' : '') + (b.small ? ' small' : '');
      el.textContent = b.label;
      if(b.href) el.href = b.href; else el.addEventListener('click', () => { sfx.tap(); b.fn && b.fn(); });
      row.appendChild(el);
      if(i === 0) setTimeout(() => el.focus({ preventScroll:true }), 30);
    });
    p.appendChild(row);
    ov.appendChild(p);
    stage.appendChild(ov);
    return ov;
  }
  function hideOverlay(stage){ stage.querySelectorAll('.overlay').forEach(n => n.remove()); }

  /* floating text at game coords (360x640 space) */
  function popText(stage, text, x, y, color){
    const el = document.createElement('div');
    el.className = 'pop'; el.textContent = text;
    el.style.left = (x / 360 * 100) + '%'; el.style.top = (y / 640 * 100) + '%';
    if(color) el.style.color = color;
    stage.appendChild(el);
    setTimeout(() => el.remove(), 850);
  }

  function shake(stage){ stage.classList.remove('shake'); void stage.offsetWidth; stage.classList.add('shake'); }

  /* ---------- pixel-spark burst at a game coordinate (360x640 space) ---------- */
  function burst(stage, x, y, o){
    o = o || {};
    const n = o.count || 12, color = o.color || 'var(--accent)', size = o.size || 1;
    const wrap = document.createElement('div');
    wrap.className = 'burst';
    wrap.style.left = (x / 360 * 100) + '%';
    wrap.style.top = (y / 640 * 100) + '%';
    for(let i = 0; i < n; i++){
      const s = document.createElement('i');
      const a = (Math.PI * 2 * i) / n + (Math.random() - .5) * .6;
      const d = (28 + Math.random() * 34) * size;
      s.style.setProperty('--dx', (Math.cos(a) * d).toFixed(1) + 'px');
      s.style.setProperty('--dy', (Math.sin(a) * d).toFixed(1) + 'px');
      s.style.width = s.style.height = (.5 * size) + 'em';
      s.style.marginLeft = s.style.marginTop = (-.25 * size) + 'em';
      s.style.background = color;
      wrap.appendChild(s);
    }
    stage.appendChild(wrap);
    setTimeout(() => wrap.remove(), 550);
  }

  /* ---------- results / grade screen, shared by every stage-based world ----------
     Pass either { grade:'S' } directly, or { score, maxScore } to have the letter
     worked out automatically. stats is an optional list of {label, value} rows. */
  function gradeFor(score, maxScore){
    if(!maxScore) return 'C';
    const pct = Math.max(0, Math.min(1, score / maxScore));
    return pct >= .95 ? 'S' : pct >= .85 ? 'A' : pct >= .7 ? 'B' : pct >= .5 ? 'C' : 'D';
  }
  function results(stage, o){
    hideOverlay(stage);
    const grade = o.grade || gradeFor(o.score, o.maxScore);
    const ov = document.createElement('div');
    ov.className = 'overlay';
    const p = document.createElement('div');
    p.className = 'panel results';
    const h = document.createElement('h2'); h.textContent = o.title || 'STAGE CLEAR'; p.appendChild(h);
    const g = document.createElement('div'); g.className = 'grade'; g.dataset.grade = grade; g.textContent = grade; p.appendChild(g);
    if(o.stats && o.stats.length){
      const t = document.createElement('div'); t.className = 'statrows';
      o.stats.forEach(row => {
        const r = document.createElement('div'); r.className = 'statrow';
        r.innerHTML = `<span>${row.label}</span><b>${row.value}</b>`;
        t.appendChild(r);
      });
      p.appendChild(t);
    }
    if(o.earned){ const e = document.createElement('p'); e.className = 'earned'; e.textContent = '+' + o.earned + ' SYSTEM PTS'; p.appendChild(e); }
    const row = document.createElement('div'); row.className = 'btns';
    (o.buttons || []).forEach((b, i) => {
      const el = document.createElement(b.href ? 'a' : 'button');
      el.className = 'btn' + (b.primary ? ' primary' : '') + (b.small ? ' small' : '');
      el.textContent = b.label;
      if(b.href) el.href = b.href; else el.addEventListener('click', () => { sfx.tap(); b.fn && b.fn(); });
      row.appendChild(el);
      if(i === 0) setTimeout(() => el.focus({ preventScroll:true }), 30);
    });
    p.appendChild(row);
    ov.appendChild(p);
    stage.appendChild(ov);
    const bad = grade === 'D' || grade === 'C';
    seq(bad ? [[311,0,.14],[233,140,.22]] : [[523,0],[659,90],[784,180],[grade==='S'?1318:1047,270,.22]]);
    return ov;
  }

  /* 60fps-normalised loop that pauses when the tab is hidden */
  function loop(fn){
    let last = performance.now(), on = true;
    function frame(t){
      if(!on) return;
      const dt = Math.min(.05, (t - last) / 1000); last = t;
      if(!document.hidden) fn(dt);
      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
    return { stop(){ on = false; } };
  }

  return { q, IDS, NAMES, me, debug, portrait, fit, beep, sfx, points, meter, meterUI, pointsBanner, overlay, results, hideOverlay, popText, shake, burst, loop };
})();
