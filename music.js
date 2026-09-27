/* Background music for every SYSTEM ERROR page.
   - loops bgm.mp3
   - starts on the first tap / key press (browsers block sound before that)
   - carries on from where it was when you move between pages
   - pauses while the tab is hidden
   - on/off is remembered. Click sounds have their own switch and are not affected. */
(function(){
  'use strict';
  const base = document.currentScript ? document.currentScript.src.replace(/[^/]*$/, '') : '';
  const VOL = .22;
  const KEY_ON = 'skz.music', KEY_POS = 'skz.music.pos';
  const ls = {
    get(k){ try{ return localStorage.getItem(k); }catch(e){ return null; } },
    set(k, v){ try{ localStorage.setItem(k, v); }catch(e){} }
  };

  let on = ls.get(KEY_ON) !== '0';
  const audio = new Audio(base + 'bgm.mp3');
  audio.loop = true; audio.preload = 'auto'; audio.volume = 0;
  const listeners = [];
  let fadeTimer = null, resumed = false;

  function fadeTo(v, ms, done){
    clearInterval(fadeTimer);
    const from = audio.volume, t0 = performance.now();
    fadeTimer = setInterval(() => {
      const k = Math.min(1, (performance.now() - t0) / ms);
      audio.volume = Math.max(0, Math.min(1, from + (v - from) * k));
      if(k >= 1){ clearInterval(fadeTimer); done && done(); }
    }, 40);
  }
  function seekToSaved(){
    if(resumed) return; resumed = true;
    try{
      const s = JSON.parse(ls.get(KEY_POS) || 'null');
      // only continue if we left a moment ago (moving between pages), not from an old visit
      if(s && Date.now() - s.at < 20000 && audio.duration && s.t < audio.duration) audio.currentTime = s.t;
    }catch(e){}
  }
  function tryPlay(){                       // resolves true once sound is actually playing
    if(!on || document.hidden) return Promise.resolve(false);
    const p = audio.play();
    if(!p || !p.then) return Promise.resolve(false);
    return p.then(() => { seekToSaved(); fadeTo(VOL, 700); return true; }).catch(() => false);
  }
  function savePos(){ if(!audio.paused) ls.set(KEY_POS, JSON.stringify({ t:audio.currentTime, at:Date.now() })); }

  audio.addEventListener('loadedmetadata', () => { if(!audio.paused) seekToSaved(); });
  setInterval(savePos, 1000);
  addEventListener('pagehide', savePos);
  document.addEventListener('visibilitychange', () => {
    if(document.hidden){ savePos(); audio.pause(); }
    else if(on && started) tryPlay();
  });

  // browsers only allow sound after a tap or key press
  let started = false;
  function unlock(){
    started = true;
    tryPlay().then(ok => { if(ok) ['pointerdown','keydown','touchstart'].forEach(n => removeEventListener(n, unlock, true)); });
  }
  ['pointerdown','keydown','touchstart'].forEach(n => addEventListener(n, unlock, true));
  // works straight away if the browser already trusts the page (e.g. it was allowed on the last one)
  tryPlay();

  const api = {
    isOn(){ return on; },
    setOn(v){
      on = !!v; ls.set(KEY_ON, on ? '1' : '0');
      if(on){ started = true; tryPlay(); }
      else fadeTo(0, 250, () => audio.pause());
      listeners.forEach(fn => fn(on));
    },
    toggle(){ api.setOn(!on); return on; },
    onChange(fn){ listeners.push(fn); },
    playing(){ return !audio.paused; },
    time(){ return audio.currentTime; }
  };
  window.SKZMusic = api;

  /* small toggle button. The hub draws its own, so it can opt out with window.SKZ_MUSIC_NO_UI = true */
  function mountButton(){
    if(window.SKZ_MUSIC_NO_UI) return;
    const b = document.createElement('button');
    b.type = 'button';
    b.setAttribute('aria-label', 'Music');
    const paint = () => { b.textContent = on ? '♪ ON' : '♪ OFF'; b.setAttribute('aria-pressed', on ? 'false' : 'true'); };
    b.addEventListener('click', ev => { ev.stopPropagation(); api.toggle(); });
    b.addEventListener('pointerdown', ev => ev.stopPropagation());
    api.onChange(paint); paint();
    const st = 'font-family:"Press Start 2P","Courier New",monospace;color:#a3aed6;background:rgba(7,11,26,.88);border:0;cursor:pointer;box-shadow:0 0 0 2px #3a4674;';
    const hudMenu = document.querySelector('.hud .menu');
    if(hudMenu){                                    // inside the game HUD, next to Menu
      b.className = 'menu';
      b.style.cssText = 'cursor:pointer;border:0;';
      hudMenu.parentNode.insertBefore(b, hudMenu);
    }else{                                          // other pages: small corner button
      b.className = 'skz-music';
      b.style.cssText = st + 'position:fixed;right:12px;bottom:12px;z-index:9999;font-size:9px;padding:9px 10px;';
      document.body.appendChild(b);
    }
  }
  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mountButton); else mountButton();
})();
