/* IS89 · Martorul anonim · motorul player-ului (HTML, SCORM 2004 3rd Edition).
   Rulează: din LMS (SCORM), de pe un server static (GitHub Pages, AWS S3) sau direct de pe PC (index.html).
   Fără LMS, progresul și răspunsurile se păstrează doar în browserul de pe acest dispozitiv (localStorage). */
(function () {
  'use strict';

  var CFG = window.IS89_CONFIG;
  var VOI = window.IS89_VO || {};
  var ORDER = ['1.1', '1.2', '1.3', '1.4', '2.1', '2.2', '2.3', '2.4', '2.5', '3.1', '3.2',
    '4.1', '4.2', '4.3', '4.4', '4.5', '4.6', '4.7', '4.8', '4.9', '4.10', '5.1', '5.2', '5.3', '5.4', '5.5'];
  var LEAD = 0.2;           // elementul apare cu 0,2 s înaintea cuvântului
  var $ = function (sel, root) { return (root || document).querySelector(sel); };
  var $$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };

  function esc(s) {
    return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  // ---------- Iconițe (SVG, culoarea textului) ----------
  var ICONS = {
    menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
    play: '<path d="M8 5.5v13l11-6.5z" fill="currentColor" stroke="none"/>',
    pause: '<path d="M8 5v14M16 5v14" stroke-width="3.2"/>',
    replay: '<path d="M4.5 12a7.5 7.5 0 1 0 2.2-5.3"/><path d="M4 4.5v4.6h4.6"/>',
    skip: '<path d="M5 6l8 6-8 6z" fill="currentColor" stroke="none"/><path d="M18 6v12" stroke-width="2.6"/>',
    cc: '<rect x="2.5" y="5" width="19" height="14" rx="2.5"/><path d="M10.4 10.2a2.6 2.6 0 1 0 0 3.6M17.4 10.2a2.6 2.6 0 1 0 0 3.6"/>',
    vol: '<path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z" fill="currentColor"/><path d="M15.5 9a4.2 4.2 0 0 1 0 6M18.2 6.5a8 8 0 0 1 0 11"/>',
    voloff: '<path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z" fill="currentColor"/><path d="M16 9.5l5 5M21 9.5l-5 5"/>',
    prev: '<path d="M14.5 5l-7 7 7 7"/>',
    next: '<path d="M9.5 5l7 7-7 7"/>',
    close: '<path d="M6 6l12 12M18 6L6 18"/>',
    check: '<path d="M4.5 12.5l5 5L19.5 7"/>',
    lock: '<rect x="5" y="10.5" width="14" height="10" rx="2" fill="currentColor"/><path d="M8 10.5V8a4 4 0 0 1 8 0v2.5"/>',
    download: '<path d="M12 4v11M7 10.5l5 5 5-5M5 19.5h14"/>',
    print: '<path d="M7 9V4h10v5"/><rect x="4" y="9" width="16" height="7.5" rx="1.5"/><path d="M7 14h10v6H7z"/>',
    eye: '<path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z"/><circle cx="12" cy="12" r="3"/>',
    doc: '<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M8.5 8h7M8.5 12h7M8.5 16h4.5"/>',
    info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v6"/><circle cx="12" cy="7.6" r=".6" fill="currentColor"/>',
    alert: '<circle cx="12" cy="12" r="9"/><path d="M12 7v6"/><circle cx="12" cy="16.6" r=".6" fill="currentColor"/>',
    up: '<path d="M12 20V5M6 11l6-6 6 6"/>',
    film: '<rect x="3.5" y="4" width="17" height="16" rx="1.5"/><path d="M3.5 8.5h17M3.5 15.5h17M8 4v4.5M12 4v4.5M16 4v4.5M8 15.5V20M12 15.5V20M16 15.5V20"/>',
    exit: '<path d="M14 4h5v16h-5"/><path d="M10 8l-4 4 4 4M6 12h10"/>',
    pages: '<rect x="8" y="3" width="12.5" height="16" rx="1.5"/><path d="M5 6.5v13A1.5 1.5 0 0 0 6.5 21H16"/><path d="M11.5 8h6M11.5 11.5h6M11.5 15h3.5"/>',
    photo: '<rect x="3" y="5" width="18" height="14" rx="1.5"/><circle cx="9" cy="10" r="1.8"/><path d="M21 15.5l-5-5-8.5 8.5"/>',
    pen: '<path d="M4 20l1-5L16.5 3.5l4 4L9 19z"/><path d="M14 6l4 4"/>',
    expand: '<path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/>',
    compress: '<path d="M9 4v5H4M15 4v5h5M9 20v-5H4M15 20v-5h5"/>'
  };
  function icon(name, cls) {
    return '<svg class="ico' + (cls ? ' ' + cls : '') + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">' + (ICONS[name] || '') + '</svg>';
  }
  // Cercul de creion gras, desenat de mână (marcajul pe foaia de contact)
  function ring(w, h) {
    var rx = w / 2 - 6, ry = h / 2 - 6, cx = w / 2, cy = h / 2;
    var d = 'M ' + (cx + rx * 0.92) + ' ' + (cy - ry * 0.42) +
      ' C ' + (cx + rx * 1.06) + ' ' + (cy + ry * 0.62) + ', ' + (cx + rx * 0.25) + ' ' + (cy + ry * 1.04) + ', ' + (cx - rx * 0.38) + ' ' + (cy + ry * 0.97) +
      ' C ' + (cx - rx * 1.08) + ' ' + (cy + ry * 0.86) + ', ' + (cx - rx * 1.04) + ' ' + (cy - ry * 0.55) + ', ' + (cx - rx * 0.42) + ' ' + (cy - ry * 0.96) +
      ' C ' + (cx + rx * 0.12) + ' ' + (cy - ry * 1.12) + ', ' + (cx + rx * 0.98) + ' ' + (cy - ry * 0.9) + ', ' + (cx + rx * 1.02) + ' ' + (cy - ry * 0.12);
    return '<svg class="ring" width="' + w + '" height="' + h + '" viewBox="0 0 ' + w + ' ' + h + '" preserveAspectRatio="none" aria-hidden="true" focusable="false"><path vector-effect="non-scaling-stroke" d="' + d + '"/></svg>';
  }

  // ---------- Stare ----------
  var V = {};
  var S = { vars: V, visited: {}, seen: {}, checks: [], loc: '1.1', completed: false, history: [] };
  function resetVars() { Object.keys(CFG.vars).forEach(function (k) { V[k] = CFG.vars[k]; }); }
  resetVars();

  var prefs = { voice: true, cc: true, rate: 1 };
  try { Object.assign(prefs, JSON.parse(localStorage.getItem('IS89_prefs') || '{}')); } catch (e) { /* fără localStorage */ }
  function savePrefs() { try { localStorage.setItem('IS89_prefs', JSON.stringify(prefs)); } catch (e) { /* ignoră */ } }

  // ---------- Salvare: LMS (SCORM) sau browserul local ----------
  var lms = false, saveTimer = 0, lastCommit = 0;
  function snapshot() {
    return JSON.stringify({ v: 4, loc: S.loc, vars: V, vis: Object.keys(S.visited), seen: S.seen, chk: S.checks, done: S.completed ? 1 : 0 });
  }
  function restore(json) {
    try {
      var d = JSON.parse(json);
      if (!d || !d.vars) { return false; }
      Object.keys(CFG.vars).forEach(function (k) { if (k in d.vars) { V[k] = d.vars[k]; } });
      (d.vis || []).forEach(function (id) { S.visited[id] = true; });
      S.seen = d.seen || {}; S.checks = d.chk || []; S.loc = d.loc || '1.1'; S.completed = !!d.done;
      return true;
    } catch (e) { return false; }
  }
  function progress() {
    var n = ORDER.filter(function (id) { return S.visited[id]; }).length;
    return Math.min(1, n / ORDER.length);
  }
  function saveNow(forceCommit) {
    clearTimeout(saveTimer);
    var data = snapshot();
    if (lms) {
      SCORM.set('cmi.location', S.loc);
      SCORM.set('cmi.suspend_data', data);
      SCORM.set('cmi.progress_measure', S.completed ? '1' : progress().toFixed(2));
      if (forceCommit || Date.now() - lastCommit > 15000) { SCORM.commit(); lastCommit = Date.now(); }
    } else {
      try { localStorage.setItem(CFG.storageKey, data); } catch (e) { /* plin sau blocat */ }
    }
  }
  function save(delay) { clearTimeout(saveTimer); saveTimer = setTimeout(saveNow, delay == null ? 600 : delay); }

  function setVar(k, v) {
    V[k] = v;
    if (k === 'tPoveste_Text') { V.nPoveste_Cuvinte = countWords(v); }
    refreshBindings();
    save();
  }
  function countWords(text) {
    // Un „cuvânt” = o secvență fără spații care conține măcar o literă sau o cifră (ca în is89_numara-cuvinte.js)
    return String(text || '').split(/\s+/).filter(function (w) { return /[0-9A-Za-zÀ-ɏ]/.test(w); }).length;
  }

  // ---------- Elemente de bază ----------
  var app, stage, slideEl, ccEl, barEl, progEl, liveEl;
  var current = null;

  // Pânza de 1920 × 1080 se scalează la fereastră. Pe telefon (sau într-o fereastră îngustă) textul ar ieși prea mic:
  // atunci ecranele curg pe o singură coloană („modul telefon”: clasa .m pe <html>, css/phone.css), mărite cu zoom.
  // --z = mărirea, --vw = lățimea ecranului în pixeli „de pânză”, --vhz = înălțimea, la fel.
  var flowMode = null, lastW = 0;
  function fit(force) {
    var W = 1920, H = 1224, root = document.documentElement;
    // clientWidth/Height = fereastra de așezare (pe telefon, innerWidth poate fi mai mare, după o micșorare a paginii)
    var iw = root.clientWidth || window.innerWidth, ih = root.clientHeight || window.innerHeight;
    var s = Math.min(iw / W, ih / H);
    var ae = document.activeElement, typing = !!ae && /^(TEXTAREA|INPUT)$/.test(ae.tagName);
    // Cât timp elevul scrie, nu schimbăm așezarea (tastatura de pe ecran micșorează fereastra).
    var flow = flowMode !== null && typing ? flowMode : s < 0.5;
    if (flow !== flowMode) {
      flowMode = flow;
      root.classList.toggle('m', flow);
      if (current) { window.scrollTo(0, 0); }
    }
    if (flow) {
      var z = Math.max(0.55, Math.min(0.75, iw / 600));
      root.style.setProperty('--z', z.toFixed(4));
      root.style.setProperty('--vw', Math.floor(iw / z) + 'px');
      // înălțimea se actualizează doar la rotire sau la ecran complet (nu când apare/dispare bara browserului)
      if (force === true || iw !== lastW || !root.style.getPropertyValue('--vhz')) { root.style.setProperty('--vhz', Math.floor(ih / z) + 'px'); }
      root.classList.toggle('m-wide', iw / z >= 960);
      app.style.transform = '';
    } else {
      var x = Math.max(0, (iw - W * s) / 2), y = Math.max(0, (ih - H * s) / 2);
      app.style.transform = 'translate(' + x + 'px,' + y + 'px) scale(' + s + ')';
    }
    lastW = iw;
  }

  // ---------- Ecran complet (Android, PC, iPad; pe iPhone, Safari nu permite: acolo ajută „Adaugă pe ecranul principal”) ----------
  function fsSupported() { return !!(document.fullscreenEnabled || document.webkitFullscreenEnabled); }
  function fsActive() { return !!(document.fullscreenElement || document.webkitFullscreenElement); }
  function fsEnter() {
    var el = document.documentElement, p = null;
    try {
      if (el.requestFullscreen) { p = el.requestFullscreen({ navigationUI: 'hide' }); }
      else if (el.webkitRequestFullscreen) { el.webkitRequestFullscreen(); }
    } catch (e) { /* browserul a refuzat */ }
    if (p && p.catch) { p.catch(function () { /* browserul a refuzat */ }); }
  }
  function fsExit() {
    var p = null;
    try {
      if (document.exitFullscreen) { p = document.exitFullscreen(); }
      else if (document.webkitExitFullscreen) { document.webkitExitFullscreen(); }
    } catch (e) { /* ignoră */ }
    if (p && p.catch) { p.catch(function () { /* ignoră */ }); }
  }
  function fsToggle() { if (fsActive()) { fsExit(); } else { fsEnter(); } }
  // Pe telefon, prima atingere trece cursul pe tot ecranul (browserele cer o atingere: nu se poate la deschidere).
  function fsOnFirstTap() {
    if (!fsSupported()) { return; }
    var onTap = function (e) {
      document.removeEventListener('click', onTap, true);
      if (e.target && e.target.closest && e.target.closest('#bFull, a[href]')) { return; }   // butonul își face singur treaba; linkurile deschid altă filă
      var touch = window.matchMedia && window.matchMedia('(pointer: coarse)').matches;
      if (flowMode && touch && !fsActive()) { fsEnter(); }
    };
    document.addEventListener('click', onTap, true);
  }
  function isIphone() { return /iPhone|iPod/.test(navigator.userAgent || ''); }
  function isStandalone() {
    return navigator.standalone === true || !!(window.matchMedia && window.matchMedia('(display-mode: standalone), (display-mode: fullscreen)').matches);
  }
  function announce(msg) { liveEl.textContent = ''; setTimeout(function () { liveEl.textContent = msg; }, 60); }

  // ---------- Vocea (voice-over) și apariția elementelor pe cue-uri ----------
  var VO = {
    a: new Audio(), key: null, scope: null, idx: -1, raf: 0, state: 'idle', timers: [],
    has: function (key) { return !!VOI[key]; },
    load: function (key, scope) {
      this.stop();
      this.key = VOI[key] ? key : null; this.scope = scope; this.idx = -1; this.state = 'idle';
      if (this.key) { this.a.src = 'audio/' + key + '.mp3'; this.a.preload = 'auto'; }
      ui();
    },
    cues: function () { return this.key ? VOI[this.key].c : []; },
    play: function (fromStart) {
      var self = this;
      if (!this.key) { return; }
      if (!prefs.voice) { reveal(this.scope, 99); return; }
      if (fromStart || this.state === 'ended' || this.state === 'idle' || this.state === 'blocked') {
        hideCues(this.scope); this.idx = -1;
        try { this.a.currentTime = 0; } catch (e) { /* încă nu e încărcat */ }
        this.step(0);
      }
      this.a.playbackRate = prefs.rate;
      this.state = 'playing'; ui();
      var p = this.a.play();
      if (p && p.catch) {
        p.catch(function (err) {
          if (self.state !== 'playing') { return; }
          // Browserul nu lasă sunetul să pornească singur (fără un clic): arătăm totul și marcăm butonul ▶.
          self.state = err && err.name === 'NotAllowedError' ? 'blocked' : 'idle';
          cancelAnimationFrame(self.raf); quickReveal(self.scope); caption(''); ui();
        });
      }
      cancelAnimationFrame(this.raf);
      this.raf = requestAnimationFrame(function loop() {
        if (self.state !== 'playing') { return; }
        var t = self.a.currentTime + LEAD, c = self.cues(), i = -1;
        for (var j = 0; j < c.length; j++) { if (c[j][0] <= t) { i = j; } }
        if (i > self.idx) { self.step(i); }
        if (self.a.duration) { progEl.style.width = (100 * self.a.currentTime / self.a.duration) + '%'; }
        self.raf = requestAnimationFrame(loop);
      });
    },
    step: function (i) {
      this.idx = i;
      reveal(this.scope, i);
      var c = this.cues();
      caption(c[i] ? c[i][1] : '');
    },
    pause: function () { if (this.state === 'playing') { this.a.pause(); this.state = 'paused'; cancelAnimationFrame(this.raf); ui(); } },
    stop: function () {
      cancelAnimationFrame(this.raf);
      try { this.a.pause(); } catch (e) { /* ignoră */ }
      if (this.state === 'playing' || this.state === 'paused') { this.state = 'idle'; }
      caption(''); progEl.style.width = '0';
    },
    skip: function () { this.stop(); this.state = 'ended'; reveal(this.scope, 99); ui(); }
  };
  VO.a.addEventListener('ended', function () {
    VO.state = 'ended'; cancelAnimationFrame(VO.raf); reveal(VO.scope, 99);
    progEl.style.width = '100%';
    setTimeout(function () { if (VO.state === 'ended') { caption(''); progEl.style.width = '0'; } }, 900);
    ui();
  });
  VO.a.addEventListener('error', function () {
    if (VO.state === 'playing') { VO.state = 'idle'; cancelAnimationFrame(VO.raf); quickReveal(VO.scope); caption(''); ui(); }
  });

  function cueEls(scope) { return scope ? $$('[data-cue]', scope) : []; }
  function hideCues(scope) { cueEls(scope).forEach(function (el) { el.classList.remove('cue-in'); el.classList.add('cue-wait'); }); }
  function reveal(scope, upTo) {
    cueEls(scope).forEach(function (el) {
      if (Number(el.getAttribute('data-cue')) <= upTo && el.classList.contains('cue-wait')) {
        el.classList.remove('cue-wait'); void el.offsetWidth; el.classList.add('cue-in');
      }
    });
  }
  function quickReveal(scope) {
    var max = 0;
    cueEls(scope).forEach(function (el) { max = Math.max(max, Number(el.getAttribute('data-cue'))); });
    reveal(scope, 0);
    for (var i = 1; i <= max; i++) { (function (k) { VO.timers.push(setTimeout(function () { reveal(scope, k); }, 140 * k)); })(i); }
  }
  function revealNow(scope) { cueEls(scope).forEach(function (el) { el.classList.remove('cue-wait'); el.classList.remove('cue-in'); }); }
  function caption(text) {
    var span = $('span', ccEl);
    span.textContent = text || '';
    ccEl.classList.toggle('is-off', !prefs.cc || !text);
  }

  // Pornește vocea pentru un ecran sau un strat: prima dată cu voce, apoi totul vizibil (▶ reia vocea).
  function narrate(key, scope, first) {
    VO.timers.forEach(clearTimeout); VO.timers = [];
    VO.load(key, scope);
    if (!VO.key) { revealNow(scope); return; }
    if (first && prefs.voice) { VO.play(true); }
    else if (first) { hideCues(scope); quickReveal(scope); }
    else { revealNow(scope); }
  }

  // ---------- Bara de control ----------
  function ui() {
    if (!barEl) { return; }
    var playBtn = $('#bPlay'), has = !!VO.key;
    var playing = VO.state === 'playing';
    playBtn.innerHTML = icon(playing ? 'pause' : 'play');
    playBtn.setAttribute('aria-label', playing ? 'Pune vocea pe pauză' : 'Ascultă vocea');
    playBtn.title = playBtn.getAttribute('aria-label');
    playBtn.classList.toggle('is-attn', VO.state === 'blocked' && prefs.voice);
    ['#bPlay', '#bReplay', '#bSkip'].forEach(function (id) { $(id).disabled = !has || !prefs.voice; });
    $('#bCC').setAttribute('aria-pressed', String(prefs.cc));
    var vb = $('#bVoice');
    vb.setAttribute('aria-pressed', String(prefs.voice));
    vb.innerHTML = icon(prefs.voice ? 'vol' : 'voloff') + '<span>Voce</span>';
    var rate = String(prefs.rate).replace('.', ',') + '×';
    $('#bRate').textContent = rate; $('#bRate').setAttribute('aria-label', 'Viteza vocii ' + rate);
    $('#bRate').disabled = !prefs.voice;
    var fb = $('#bFull'), fs = fsActive();
    if (fb) {
      fb.innerHTML = icon(fs ? 'compress' : 'expand');
      fb.setAttribute('aria-pressed', String(fs));
      fb.title = fs ? 'Ieși din ecranul complet' : 'Ecran complet';
    }
  }
  function navUi() {
    var s = current; if (!s) { return; }
    var prevBtn = $('#bPrev'), nextBtn = $('#bNext');
    prevBtn.hidden = s.id === '1.1';
    nextBtn.hidden = !!s.hideNext;
    var gate = s.canNext ? s.canNext() : true;
    nextBtn.disabled = !gate || modals.length > 0;
    prevBtn.disabled = modals.length > 0;
    nextBtn.title = gate ? 'Înainte' : (s.gateMsg || 'Termină ce e pe ecran ca să continui');
    $('#bLabel').innerHTML = '<b>' + esc(s.id) + '</b>' + esc(s.title);
  }

  function buildBar() {
    barEl.innerHTML =
      '<div class="bar-progress" id="bProg" aria-hidden="true"></div>' +
      '<button class="bar-btn" id="bMenu" aria-haspopup="dialog">' + icon('menu') + '<span>Cuprins</span></button>' +
      '<p class="bar-label" id="bLabel"></p>' +
      '<div class="bar-voice" role="group" aria-label="Vocea">' +
      '<button class="bar-btn" id="bPlay"></button>' +
      '<button class="bar-btn" id="bReplay" aria-label="Ascultă din nou de la început" title="Ascultă din nou">' + icon('replay') + '</button>' +
      '<button class="bar-btn" id="bSkip" aria-label="Arată tot ecranul acum, fără să aștepți vocea" title="Arată tot acum">' + icon('skip') + '</button>' +
      '<button class="bar-btn" id="bCC" aria-label="Subtitrare" title="Subtitrare">' + icon('cc') + '</button>' +
      '<button class="bar-btn" id="bVoice" title="Pornește sau oprește vocea"></button>' +
      '<button class="bar-btn bar-rate" id="bRate" title="Viteza vocii">1×</button>' +
      '</div>' +
      '<button class="bar-btn bar-full" id="bFull" aria-label="Ecran complet"' + (fsSupported() ? '' : ' hidden') + '></button>' +
      '<div class="bar-nav"><button class="bar-btn" id="bPrev">' + icon('prev') + '<span>Înapoi</span></button>' +
      '<button class="bar-btn" id="bNext">' + '<span>Înainte</span>' + icon('next') + '</button></div>';
    progEl = $('#bProg');
    $('#bMenu').addEventListener('click', openMenu);
    $('#bPlay').addEventListener('click', function () {
      if (VO.state === 'playing') { VO.pause(); }
      else if (VO.state === 'paused') { VO.play(false); }
      else { VO.play(true); }
    });
    $('#bReplay').addEventListener('click', function () { VO.play(true); });
    $('#bSkip').addEventListener('click', function () { VO.skip(); });
    $('#bCC').addEventListener('click', function () { prefs.cc = !prefs.cc; savePrefs(); ui(); var c = VO.cues()[VO.idx]; caption(VO.state === 'playing' && c ? c[1] : ''); });
    $('#bVoice').addEventListener('click', function () {
      prefs.voice = !prefs.voice; savePrefs();
      if (!prefs.voice) { VO.skip(); } else { VO.state = 'idle'; }
      ui();
    });
    $('#bRate').addEventListener('click', function () {
      var r = [1, 1.25, 1.5, 0.85]; prefs.rate = r[(r.indexOf(prefs.rate) + 1) % r.length] || 1;
      VO.a.playbackRate = prefs.rate; savePrefs(); ui();
    });
    $('#bPrev').addEventListener('click', prev);
    $('#bNext').addEventListener('click', next);
    $('#bFull').addEventListener('click', fsToggle);
    ui();
  }

  // ---------- Navigare ----------
  var SL = {};
  function slideById(id) { return SL[id]; }

  function layoutHtml(s, inner) {
    if (s.layout === 'paper') { return inner; }
    var mod = s.mod ? '<p class="hdr-mod">' + (s.mod.n ? '<span class="num" aria-hidden="true">' + s.mod.n + '</span>' : '') + '<span>' + esc(s.mod.t) + '</span></p>' : '';
    return '<header class="hdr"><img class="hdr-logo" src="media/brand/is89-gri.png" alt="Imagine Sunet ’89" width="116" height="60">' + mod +
      '<div class="tools" id="tools"></div></header><div class="rule-dots" aria-hidden="true"></div>' +
      '<div class="body">' + inner + '</div>';
  }

  function go(id, opts) {
    var s = slideById(id);
    if (!s) { return; }
    opts = opts || {};
    VO.stop(); closeModals(true); clearMsgs();
    if (current && !opts.back && current.id !== id) { S.history.push(current.id); if (S.history.length > 60) { S.history.shift(); } }
    var first = !S.visited[id];
    current = s; S.loc = id; S.visited[id] = true;
    slideEl.className = 'slide' + (s.layout === 'paper' ? ' slide--paper' : '') + ' s-' + id.replace('.', '-');
    slideEl.setAttribute('aria-label', s.title);
    slideEl.innerHTML = layoutHtml(s, s.html());
    if (flowMode) { window.scrollTo(0, 0); }   // pe telefon, fiecare ecran începe de sus
    bindFields(slideEl); bindRadios(slideEl);
    if (s.init) { s.init(slideEl, first); }
    refreshBindings();
    navUi();
    narrate(s.key, slideEl, first);
    var h = $('h1', slideEl);
    if (h) { h.setAttribute('tabindex', '-1'); try { h.focus({ preventScroll: true }); } catch (e) { h.focus(); } }
    announce(s.title);
    saveNow(true);
  }
  function next() {
    var s = current; if (!s) { return; }
    if (s.canNext && !s.canNext()) { return; }
    var r = s.next ? s.next() : null;
    if (r && r.block) { banner(r.block); return; }
    if (!r) { var i = ORDER.indexOf(s.id); r = ORDER[i + 1]; }
    if (r) { go(r); }
  }
  function prev() {
    var s = current; if (!s) { return; }
    var r = s.prev ? s.prev() : null;
    if (!r) { r = S.history.pop(); while (r && r === s.id) { r = S.history.pop(); } }
    if (!r) { var i = ORDER.indexOf(s.id); r = ORDER[i - 1]; }
    if (r) { go(r, { back: true }); }
  }

  // ---------- Legături: câmpuri, opțiuni, afișaje ----------
  function bindFields(root) {
    $$('[data-var]', root).forEach(function (el) {
      var k = el.getAttribute('data-var');
      el.value = V[k] == null ? '' : V[k];
      var counter = el.parentNode.querySelector('.count');
      var max = Number(el.getAttribute('maxlength')) || 0;
      var upd = function () { if (counter && max) { counter.textContent = el.value.length + ' / ' + max; } };
      upd();
      el.addEventListener('input', function () { setVar(k, el.value); upd(); if (current && current.onInput) { current.onInput(k, el); } });
      el.addEventListener('change', function () { saveNow(true); });
    });
  }
  function bindRadios(root) {
    $$('input[type=radio][data-num]', root).forEach(function (r) {
      var k = r.getAttribute('data-num');
      r.checked = Number(V[k]) === Number(r.value);
      r.addEventListener('change', function () {
        if (!r.checked) { return; }
        setVar(k, Number(r.value));
        var tv = r.getAttribute('data-tvar');
        if (tv) { setVar(tv, r.getAttribute('data-text') || ''); }
        if (current && current.onChoice) { current.onChoice(k, Number(r.value)); }
        clearMsgs();
        saveNow(true);
      });
    });
  }
  function refreshBindings() {
    if (!slideEl) { return; }
    $$('[data-show]', document).forEach(function (el) {
      var k = el.getAttribute('data-show'), v = V[k];
      var empty = el.getAttribute('data-empty') || '';
      el.textContent = (v === '' || v == null) ? empty : String(v);
      el.classList.toggle('is-empty', v === '' || v == null);
    });
    $$('[data-words]', document).forEach(function (el) { el.textContent = String(V.nPoveste_Cuvinte); });
    var t = $('#tools'), sig = V.nPlan_Cale + '/' + V.nPlan_Foto;
    if (t && (t.getAttribute('data-sig') !== sig || !t.firstChild)) { t.setAttribute('data-sig', sig); t.innerHTML = toolsHtml(); wireTools(t); }
    if (current && current.onVars) { current.onVars(); }
    if (barEl) { navUi(); }
  }

  // ---------- Colțul cu instrumente: Cadrul meu, Planul meu ----------
  function chosenFrame() { return V.nPlan_Foto > 0 && Number(V.nPlan_Cale) !== 1 ? CFG.frames[V.nPlan_Foto - 1] : null; }
  function toolsHtml() {
    var f = chosenFrame(), thumb;
    if (Number(V.nPlan_Cale) === 1) { thumb = '<span class="tool-thumb tool-thumb--phrase" aria-hidden="true">m.a.</span>'; }
    else if (f) { thumb = '<span class="tool-thumb" aria-hidden="true"><img src="' + f.img + '" alt="">' + ring(70, 70) + '</span>'; }
    else { thumb = '<span class="tool-thumb tool-thumb--empty" aria-hidden="true">?</span>'; }
    return '<button class="tool" id="tFrame" aria-label="Cadrul meu: deschide fotografia sau sintagma aleasă">' + thumb + '<span>Cadrul meu</span></button>' +
      '<button class="tool" id="tPlan" aria-label="Planul meu: deschide răspunsurile tale">' + '<span class="tool-thumb" aria-hidden="true">' + icon('doc') + '</span><span>Planul meu</span></button>';
  }
  function wireTools(t) {
    $('#tFrame', t).addEventListener('click', openFrame);
    $('#tPlan', t).addEventListener('click', openPlan);
    var r = $('.ring', t); if (r) { r.classList.add('is-on'); }
  }

  // ---------- Ferestre (straturi modale) ----------
  var modals = [];
  function openModal(o) {
    var m = document.createElement('div');
    m.className = 'modal' + (o.dark ? ' modal--dark' : '') + (o.cls ? ' ' + o.cls : '');
    m.setAttribute('role', 'dialog'); m.setAttribute('aria-modal', 'true'); m.setAttribute('aria-label', o.label || '');
    // .modal-body nu contează pe pânză (display: contents); pe telefon e zona care se derulează, sub butonul de închidere.
    m.innerHTML = '<div class="modal-panel"><div class="modal-body">' + o.html + '</div><button class="modal-x" data-close aria-label="Închide">' + icon('close') + '</button></div>';
    stage.appendChild(m);
    document.documentElement.classList.add('has-modal');
    var prevFocus = document.activeElement;
    slideEl.inert = true; $$('.modal', stage).forEach(function (x) { if (x !== m) { x.inert = true; } });
    $('#bMenu').disabled = true; $('#bPrev').disabled = true; $('#bNext').disabled = true;
    var api = {
      el: m,
      close: function (silent) {
        if (!m.parentNode) { return; }
        m.parentNode.removeChild(m);
        modals = modals.filter(function (x) { return x !== api; });
        var top = modals[modals.length - 1];
        if (top) { top.el.inert = false; } else {
          slideEl.inert = false; $('#bMenu').disabled = false; $('#bPrev').disabled = false; navUi();
          document.documentElement.classList.remove('has-modal');
        }
        if (o.onClose) { o.onClose(); }
        if (!silent && prevFocus && prevFocus.focus) { try { prevFocus.focus({ preventScroll: true }); } catch (e) { /* ignoră */ } }
        if (!silent && o.vo && current) { VO.load(current.key, slideEl); }
      }
    };
    modals.push(api);
    $$('[data-close]', m).forEach(function (b) { b.addEventListener('click', function () { api.close(); }); });
    m.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { e.stopPropagation(); api.close(); }
      if (e.key === 'Tab') { trap(e, m); }
    });
    m.addEventListener('mousedown', function (e) { if (e.target === m && o.scrimClose !== false) { api.close(); } });
    if (o.vo) {
      if (current) { reveal(slideEl, 99); }
      var first = !S.seen['vo:' + o.vo];
      S.seen['vo:' + o.vo] = 1;
      narrate(o.vo, m, first);
    } else { if (current) { reveal(slideEl, 99); } VO.timers.forEach(clearTimeout); VO.stop(); if (VO.state !== 'blocked') { VO.state = 'idle'; } ui(); }
    if (o.onOpen) { o.onOpen(m, api); }
    var f = $(o.focus || 'h2, h1, [data-close]', m);
    if (f) { if (!f.hasAttribute('tabindex') && !/BUTTON|A|INPUT|TEXTAREA/.test(f.tagName)) { f.setAttribute('tabindex', '-1'); } try { f.focus({ preventScroll: true }); } catch (e) { f.focus(); } }
    return api;
  }
  function trap(e, m) {
    var f = $$('a[href], button:not([disabled]), textarea, input, [tabindex]:not([tabindex="-1"]), video[controls], iframe', m)
      .filter(function (x) { return x.offsetParent !== null || x === document.activeElement; });
    if (!f.length) { return; }
    var a = f[0], z = f[f.length - 1];
    if (e.shiftKey && document.activeElement === a) { e.preventDefault(); z.focus(); }
    else if (!e.shiftKey && document.activeElement === z) { e.preventDefault(); a.focus(); }
  }
  function closeModals(silent) { modals.slice().reverse().forEach(function (x) { x.close(silent); }); }

  // ---------- Mesaje ----------
  var msgTimer = 0;
  function clearMsgs() { clearTimeout(msgTimer); $$('.banner, .toast', stage).forEach(function (x) { x.parentNode.removeChild(x); }); }
  function banner(text, ms) {
    clearMsgs();
    var b = document.createElement('div');
    b.className = 'banner'; b.setAttribute('role', 'alert');
    b.innerHTML = icon('alert') + '<span>' + esc(text) + '</span><button class="x" aria-label="Închide mesajul">' + icon('close') + '</button>';
    $('svg', b).style.cssText = 'width:34px;height:34px;flex:none;color:#FF6B70';
    stage.appendChild(b);
    $('.x', b).addEventListener('click', clearMsgs);
    msgTimer = setTimeout(clearMsgs, ms || 7000);
    return b;
  }
  function toast(text, left) {
    clearMsgs();
    var t = document.createElement('div');
    t.className = 'toast'; t.setAttribute('role', 'status'); t.style.left = (left || 96) + 'px';
    t.innerHTML = icon('check') + '<span>' + esc(text) + '</span>';
    stage.appendChild(t);
    msgTimer = setTimeout(clearMsgs, 3200);
  }

  // ---------- Lightbox 6.1 · Cadrul meu ----------
  function openFrame() {
    var f = chosenFrame(), html;
    if (Number(V.nPlan_Cale) === 1) {
      html = '<div class="lb61"><h2 class="h1">Cadrul meu</h2><div class="lb61-grid"><div class="lb61-phrase"><p class="serif">martorul anonim</p></div>' +
        '<div><p class="lb61-name">Sintagma „martorul anonim”</p><h3 class="h3">Martorul tău</h3><p class="p" data-show="tPlan_Q3" data-empty="Încă necompletat: întrebarea 3."></p></div></div></div>';
    } else if (f) {
      html = '<div class="lb61"><h2 class="h1">Cadrul meu</h2><div class="lb61-grid"><figure class="print lb61-print"><img src="' + f.img + '" alt="' + esc(f.alt) + '"></figure>' +
        '<div><p class="lb61-name">' + esc(f.name) + '</p><h3 class="h3">Notițele tale</h3><p class="p"><b>Înainte:</b> <span data-show="tPlan_Q5_Inainte" data-empty="—"></span></p>' +
        '<p class="p"><b>După:</b> <span data-show="tPlan_Q5_Dupa" data-empty="—"></span></p></div></div></div>';
    } else {
      html = '<div class="lb61"><h2 class="h1">Cadrul meu</h2><p class="lead lb61-empty">Încă nu ai ales un cadru. Îl alegi la întrebarea 4, sau lucrezi cu sintagma.</p></div>';
    }
    openModal({ html: html, label: 'Cadrul meu', cls: 'modal-61' });
    refreshBindings();
  }

  // ---------- Planul (6.2) și exportul ----------
  function planRows() {
    var cale = Number(V.nPlan_Cale), rows = [];
    rows.push(['1. Ce mă ghidează', [['', 'tPlan_Q1'], ['De ce', 'tPlan_Q1_DeCe']]]);
    if (cale === 1 || cale === 3) {
      rows.push(['2. Sintagma și ca titlu?', [['', 'tPlan_Q2'], ['Alt titlu', 'tPlan_Q2_Titlu']]]);
      rows.push(['3. Cine ar fi putut fi martorul anonim', [['', 'tPlan_Q3'], ['Și povestea martorului și a filmului', 'tPlan_Q3_Film']]]);
    }
    if (cale === 2 || cale === 3) {
      rows.push(['4. Cadrul ales', [['', 'tPlan_Q4'], ['Ce m-a atras', 'tPlan_Q4_DeCe']]]);
      rows.push(['5. Înainte și după', [['Înainte', 'tPlan_Q5_Inainte'], ['După', 'tPlan_Q5_Dupa']]]);
    }
    rows.push(['6. Cine spune povestea', [['Naratorul', 'tPlan_Q6_Narator'], ['Persoana', 'tPlan_Q6_Persoana'], ['Despre narator', 'tPlan_Q6']]]);
    rows.push(['7. Când se povestește', [['', 'tPlan_Q7_Timp'], ['Linia timpului', 'tPlan_Q7']]]);
    rows.push(['8. Eroina sau eroul', [['', 'tPlan_Q8'], ['Cine e', 'tPlan_Q8_Cine'], ['Drumul', 'tPlan_Q8_Drum'], ['Gânduri și dileme', 'tPlan_Q8_Dileme']]]);
    rows.push(['9. Întâmplarea și firul roșu', [['Întâmplarea', 'tPlan_Q9_Intamplare'], ['Firul roșu: ce vreau, de fapt, să spun', 'tPlan_Q9_Mesaj'], ['Cu ce rămâne cititorul', 'tPlan_Q9_Cititor']]]);
    return rows;
  }
  function planHtml() {
    if (!Number(V.nPlan_Cale)) { return '<p class="lead lb62-empty">Planul se completează pe măsură ce răspunzi la cele 9 întrebări (modulul 3).</p>'; }
    return planRows().map(function (r) {
      return '<section class="pl-q"><h3 class="h3">' + esc(r[0]) + '</h3>' + r[1].map(function (x) {
        var v = String(V[x[1]] || '');
        return '<p class="pl-a">' + (x[0] ? '<span class="pl-l">' + esc(x[0]) + ':</span> ' : '') + (v ? esc(v).replace(/\n/g, '<br>') : '<i class="pl-gol">necompletat</i>') + '</p>';
      }).join('') + '</section>';
    }).join('');
  }
  function openPlan() {
    var m = openModal({
      label: 'Planul meu', cls: 'modal-62',
      html: '<div class="lb62"><h2 class="h1">Planul meu</h2><div class="lb62-grid"><div class="lb62-plan" tabindex="0" aria-label="Răspunsurile tale">' + planHtml() + '</div>' +
        '<aside class="lb62-side"><button class="btn btn--small" data-x="plan-download">' + icon('download') + 'Descarcă (.doc)</button>' +
        (canPrint() ? '<button class="btn btn--small" data-x="plan-print">' + icon('print') + 'Printează</button>' : '') +
        '<p class="small">Câmpurile goale se completează când răspunzi la întrebări.</p></aside></div></div>'
    });
    wireExports(m.el);
  }

  function docHtml(part) {
    var title = V.tPoveste_Titlu || 'Fără titlu';
    var plan = '<h2>Planul meu</h2>' + planRows().map(function (r) {
      return '<p class="q">' + esc(r[0]) + '</p>' + r[1].map(function (x) {
        var v = String(V[x[1]] || '');
        return '<p class="a">' + (x[0] ? '<b>' + esc(x[0]) + ':</b> ' : '') + (v ? esc(v).replace(/\r?\n/g, '<br>') : '<i class="gol">(necompletat)</i>') + '</p>';
      }).join('');
    }).join('');
    var brk = part === 'all' ? ' style="page-break-before:always"' : '';
    var paras = String(V.tPoveste_Text || '').split(/\r?\n/).filter(function (p) { return p.trim() !== ''; });
    var story = '<h2' + brk + '>' + esc(title) + '</h2>' + paras.map(function (p) { return '<p class="s">' + esc(p) + '</p>'; }).join('') +
      '<p class="meta">' + V.nPoveste_Cuvinte + ' de cuvinte</p>';
    var body = part === 'plan' ? plan : part === 'story' ? story : plan + story;
    return '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word"><head><meta charset="utf-8"><title>Imagine Sunet ’89. Martorul anonim</title>' +
      '<!--[if gte mso 9]><xml><w:WordDocument><w:View>Print</w:View></w:WordDocument></xml><![endif]-->' +
      '<style>body{font-family:Georgia,serif;max-width:40em;margin:2em auto;line-height:1.5;color:#231F20}h1{font-size:20pt}h2{font-size:16pt;margin-top:1.4em}' +
      '.q{font-weight:bold;margin:1em 0 .2em}.a{margin:0 0 .3em}.gol{color:#656263}.s{text-indent:1.5em;margin:0 0 .6em}.meta{color:#656263;font-size:10pt}</style></head>' +
      '<body><h1>Imagine Sunet ’89. Martorul anonim</h1><p class="meta">Generat din atelier la ' + new Date().toLocaleDateString('ro-RO') + '</p>' + body + '</body></html>';
  }
  var inViewer = !!(window.claude && typeof window.claude.use === 'function');
  var viewerDownloads = null;
  if (inViewer) { window.claude.use('downloads').then(function (d) { viewerDownloads = d; }).catch(function () { viewerDownloads = null; }); }
  function canPrint() { return !inViewer; }
  function localDate() { var d = new Date(); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); }
  function exportDoc(mode) {
    var part = mode.split('-')[0], action = mode.split('-')[1];
    var html = docHtml(part);
    if (action === 'download') {
      var name = { plan: 'Planul_meu', story: 'Povestea_mea', all: 'Planul_si_povestea_mea' }[part] + '_' + localDate() + '.doc';
      if (viewerDownloads) {
        viewerDownloads.save({ filename: name, data: '﻿' + html }).then(function () { toast('Descărcat: ' + name); })
          .catch(function (e) { banner(e && e.code === 'declined' ? 'Descărcarea a fost anulată.' : 'Descărcarea nu a pornit. Încearcă din nou.'); });
        return;
      }
      var blob = new Blob(['﻿', html], { type: 'application/msword' });
      var a = document.createElement('a');
      a.href = URL.createObjectURL(blob); a.download = name; a.style.display = 'none';
      document.body.appendChild(a); a.click();
      setTimeout(function () { URL.revokeObjectURL(a.href); a.parentNode.removeChild(a); }, 2000);
      toast('Descărcat: ' + name);
    } else {
      var f = document.createElement('iframe');
      f.setAttribute('aria-hidden', 'true'); f.style.cssText = 'position:fixed;width:0;height:0;border:0;left:-9999px';
      document.body.appendChild(f);
      f.contentDocument.open(); f.contentDocument.write(html); f.contentDocument.close();
      setTimeout(function () {
        try { f.contentWindow.focus(); f.contentWindow.print(); } catch (e) { banner('Printarea nu a pornit. Descarcă fișierul și printează-l din Word.'); }
        setTimeout(function () { if (f.parentNode) { f.parentNode.removeChild(f); } }, 4000);
      }, 350);
    }
  }
  function wireExports(root) {
    $$('[data-x]', root).forEach(function (b) { b.addEventListener('click', function () { exportDoc(b.getAttribute('data-x')); }); });
  }

  // ---------- Coloana poveștii (strat, pe 4.9 și 5.1) ----------
  function openColoana() {
    var steps = ['A fost odată…', 'În fiecare zi…', 'Până când, într-o zi…', 'Din cauza asta…', 'De aici a pornit…', 'Până când, în sfârșit…', 'Și de atunci…', 'Iar morala poveștii e…'];
    var clip = CFG.media.clip5;
    openModal({
      label: 'Coloana poveștii', cls: 'modal-col', vo: 'coloana',
      html: '<div class="col"><h2 class="h1" data-cue="0">Coloana poveștii</h2><ol class="col-list">' +
        steps.map(function (t, i) { return '<li data-cue="' + (i + 1) + '"><span class="num">' + (i + 1) + '</span><span>' + t + '</span></li>'; }).join('') +
        '</ol><p class="small" data-cue="9">Tipar folosit în lecția Pixar in a Box despre structura poveștii (story spine).</p>' +
        '<div class="btn-row col-actions">' + (clip ? '<button class="btn btn--small" data-clip="5">' + icon('film') + 'Vezi un exemplu (48 s)</button>' : '') +
        '<button class="btn btn--primary btn--small" data-close>Închide</button></div></div>',
      onOpen: function (m) { var c = $('[data-clip]', m); if (c) { c.addEventListener('click', function () { openClip(5); }); } }
    });
  }

  // ---------- Video (substituent gol până vin fișierele) ----------
  function videoSlot(src, vtt, label, w, h) {
    if (!src) {
      return '<div class="vslot" style="width:' + w + 'px;height:' + h + 'px"><span class="vslot-l">' + icon('film') + esc(label) + ' · urmează</span></div>';
    }
    return '<video class="vplayer" style="width:' + w + 'px;height:' + h + 'px" src="' + esc(src) + '" controls preload="metadata" playsinline aria-label="' + esc(label) + '">' +
      (vtt ? '<track kind="captions" srclang="ro" label="Română" src="' + esc(vtt) + '" default>' : '') + '</video>';
  }
  function openClip(n) {
    var src = CFG.media['clip' + n]; if (!src) { return; }
    openModal({
      label: 'Clip video', cls: 'modal-clip', dark: true,
      html: videoSlot(src, CFG.media['clip' + n + 'Vtt'], 'Clip video', 1280, 720) + '<div class="btn-row clip-actions"><button class="btn btn--primary" data-close>Închide</button></div>',
      onOpen: function (m) { var v = $('video', m); if (v) { v.addEventListener('play', function () { VO.stop(); }); v.play().catch(function () { /* pornește cu clic */ }); } }
    });
  }

  // ---------- Cuprins ----------
  function moduleLocked(n) {
    if (n === 4) { return !V.bPlan_Complet; }
    if (n === 5) { return !(V.nPoveste_Cuvinte > 0); }
    return false;
  }
  function openMenu() {
    var items = [['1.1', 'Start', ''], ['1.4', 'Meniul atelierului', '']].concat(CFG.modules.map(function (m) { return [m.to, m.n + '. ' + m.title, moduleLocked(m.n) ? m.locked : '']; }))
      .concat([['5.5', 'Parteneri', ''], ['5.6', 'Rezultatele atelierului ' + CFG.rezultate.an, '']]);
    var html = '<div class="menu"><h2 class="h1">Cuprins</h2><ul class="menu-list">' + items.map(function (it) {
      return '<li><button class="menu-item" data-go="' + it[0] + '"' + (it[2] ? ' aria-disabled="true"' : '') + '>' +
        '<span>' + esc(it[1]) + '</span>' + (it[2] ? '<span class="menu-lock">' + icon('lock') + esc(it[2]) + '</span>' : '') + '</button></li>';
    }).join('') + '</ul><div class="menu-foot"><button class="btn btn--small" id="mReset">' + icon('close') +
      (lms ? 'Începe de la zero' : 'Șterge răspunsurile de pe acest dispozitiv') + '</button>' +
      '<p class="small">' + (lms ? 'Răspunsurile se salvează în platforma de curs.' : 'Fără platformă de curs, răspunsurile rămân doar în acest browser. Pe un calculator folosit de mai mulți elevi, șterge-le la final, după ce descarci povestea.') + '</p>' +
      (isIphone() && !isStandalone() && !fsSupported() && !lms
        ? '<p class="small menu-ios">Pe iPhone, atelierul se deschide pe tot ecranul dacă îl adaugi pe ecranul principal: apasă butonul de partajare (pătratul cu săgeata), apoi „Adaugă pe ecranul principal”.</p>' : '') +
      '</div></div>';
    var m = openModal({ html: html, label: 'Cuprins', cls: 'modal-menu' });
    $$('[data-go]', m.el).forEach(function (b) {
      b.addEventListener('click', function () {
        if (b.getAttribute('aria-disabled') === 'true') { return; }
        m.close(true); go(b.getAttribute('data-go'));
      });
    });
    $('#mReset', m.el).addEventListener('click', function () { confirmReset(m); });
  }
  function confirmReset(menu) {
    var c = openModal({
      label: 'Ștergi răspunsurile?', cls: 'modal-confirm',
      html: '<div class="confirm"><h2 class="h2">Ștergi toate răspunsurile?</h2><p class="lead">Planul și povestea dispar' + (lms ? ' din această încercare' : ' de pe acest dispozitiv') +
        '. Dacă vrei să le păstrezi, descarcă-le întâi.</p><div class="btn-row"><button class="btn btn--small" data-x="all-download">' + icon('download') + 'Descarcă planul și povestea</button>' +
        '<button class="btn btn--primary btn--small" id="cYes">Șterge și începe de la zero</button><button class="btn btn--link" data-close>Renunță</button></div></div>'
    });
    wireExports(c.el);
    $('#cYes', c.el).addEventListener('click', function () {
      resetVars(); S.visited = {}; S.seen = {}; S.checks = []; S.history = []; S.completed = false; S.loc = '1.1';
      if (!lms) { try { localStorage.removeItem(CFG.storageKey); } catch (e) { /* ignoră */ } }
      saveNow(true);
      closeModals(true); go('1.1');
    });
  }

  // ---------- Finalizare și ieșire ----------
  function complete() {
    if (!S.completed) {
      S.completed = true;
      if (lms) { SCORM.set('cmi.completion_status', 'completed'); }
    }
    saveNow(true);
  }
  var ended = false;
  function endSession() {
    if (ended) { return; }
    ended = true; saveNow(true);
    if (lms) { SCORM.finish('suspend'); }
  }
  function exitCourse() {
    VO.stop();
    if (lms && !ended) { SCORM.set('adl.nav.request', 'suspendAll'); }
    endSession();
    var e = document.createElement('div');
    e.className = 'end';
    e.innerHTML = '<div><img src="media/brand/is89-gri.png" alt="Imagine Sunet ’89" width="420"><p class="lead" style="margin-top:48px">Atelierul s-a închis. Poți închide această fereastră.</p></div>';
    stage.appendChild(e);
    try { if (window.top && window.top !== window) { /* LMS-ul închide fereastra lui */ } else { window.close(); } } catch (err) { /* ignoră */ }
  }

  // ---------- Pornire: logo animat, reluare, primul ecran ----------
  function startCourse() {
    var saved = '';
    lms = SCORM.init(function () { /* jurnalul SCORM e tăcut în cursul real */ });
    if (lms) {
      saved = SCORM.get('cmi.suspend_data');
      var st = SCORM.get('cmi.completion_status');
      if (st !== 'completed') { SCORM.set('cmi.completion_status', 'incomplete'); }
      if (st === 'completed') { S.completed = true; }
    } else {
      try { saved = localStorage.getItem(CFG.storageKey) || ''; } catch (e) { saved = ''; }
    }
    var resumed = saved ? restore(saved) : false;
    if (resumed) { V.nPoveste_Cuvinte = countWords(V.tPoveste_Text); }
    var loc = S.loc;
    playIntro(function () {
      if (resumed && loc && loc !== '1.1' && SL[loc]) { go('1.1'); askResume(loc); }
      else { go('1.1'); }
    });
  }
  function askResume(loc) {
    var s = SL[loc];
    var m = openModal({
      label: 'Continui de unde ai rămas?', cls: 'modal-confirm', scrimClose: false,
      html: '<div class="confirm"><h2 class="h2">Continui de unde ai rămas?</h2><p class="lead">Ultimul ecran: ' + esc(s.id + ' · ' + s.title) + '. Răspunsurile tale sunt păstrate.</p>' +
        '<div class="btn-row"><button class="btn btn--primary" id="rYes">Continuă</button><button class="btn" id="rNo">De la început</button></div></div>',
      focus: '#rYes'
    });
    $('#rYes', m.el).addEventListener('click', function () { m.close(true); go(loc); });
    $('#rNo', m.el).addEventListener('click', function () { m.close(); });
  }
  function playIntro(done) {
    var box = $('#intro'), v = $('#introVideo'), finished = false;
    app.classList.add('is-intro');
    var finish = function () {
      if (finished) { return; } finished = true;
      app.classList.remove('is-intro');
      box.classList.add('is-out');
      setTimeout(function () { box.hidden = true; try { v.pause(); } catch (e) { /* ignoră */ } }, 650);
      done();
    };
    $('#skipIntro').addEventListener('click', finish);
    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) {
      v.addEventListener('loadeddata', function () { try { v.currentTime = 5.5; } catch (e) { /* ignoră */ } });
      setTimeout(finish, 2600); return;
    }
    v.addEventListener('ended', function () { setTimeout(finish, 350); });
    v.addEventListener('error', function () { setTimeout(finish, 1200); });
    var p = v.play();
    if (p && p.catch) { p.catch(function () { setTimeout(finish, 1800); }); }
    setTimeout(finish, 9000); // plasă de siguranță
  }

  // ---------- API pentru slides.js ----------
  window.P = {
    V: V, S: S, CFG: CFG, icon: icon, ring: ring, esc: esc, setVar: setVar, go: go, next: next, prev: prev,
    banner: banner, toast: toast, clearMsgs: clearMsgs, openModal: openModal, openFrame: openFrame, openPlan: openPlan,
    openColoana: openColoana, openClip: openClip, videoSlot: videoSlot, exportDoc: exportDoc, wireExports: wireExports,
    canPrint: canPrint, complete: complete, exit: exitCourse, moduleLocked: moduleLocked, countWords: countWords,
    chosenFrame: chosenFrame, narrate: narrate, VO: VO, navUi: navUi, saveNow: saveNow, reveal: reveal, refresh: refreshBindings
  };

  document.addEventListener('DOMContentLoaded', function () {
    app = $('#app'); stage = $('#stage'); slideEl = $('#slide'); ccEl = $('#cc'); barEl = $('#bar'); liveEl = $('#live');
    (window.IS89_SLIDES || []).forEach(function (s) { SL[s.id] = s; });
    fit(true); window.addEventListener('resize', function () { fit(); });
    window.addEventListener('orientationchange', function () { setTimeout(function () { fit(true); }, 250); });
    if (window.ResizeObserver) { new ResizeObserver(function () { if (document.documentElement.clientWidth !== lastW) { fit(); } }).observe(document.documentElement); }
    ['fullscreenchange', 'webkitfullscreenchange'].forEach(function (ev) { document.addEventListener(ev, function () { fit(true); ui(); }); });
    fsOnFirstTap();
    // Instalare pe ecranul principal (aplicație web): doar când cursul e găzduit (GitHub Pages, AWS), nu de pe PC (file://).
    if (/^https?:$/.test(location.protocol)) {
      var mf = document.createElement('link'); mf.rel = 'manifest'; mf.href = 'manifest.webmanifest'; document.head.appendChild(mf);
    }
    buildBar(); caption('');
    window.addEventListener('pagehide', endSession);
    window.addEventListener('beforeunload', endSession);
    document.addEventListener('visibilitychange', function () { if (document.visibilityState === 'hidden') { saveNow(true); } });
    startCourse();
  });
})();
