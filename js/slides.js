/* IS89 · Martorul anonim · ecranele cursului (texte din IS89_MartorulAnonim_RO_v0.3.1_import.pptx,
   triggere și ramificare din ghidul de legătură v0.3.1). data-cue="N" = elementul apare când vocea ajunge la cue-ul N
   (vezi audio/vo.js). Textele se pot corecta aici; dacă se schimbă un text citit de voce, se regenerează și vocea. */
(function () {
  'use strict';
  var C = window.IS89_CONFIG;
  function I(n) { return window.P.icon(n); }
  function e(s) { return window.P.esc(s); }
  function V() { return window.P.V; }
  var REQ = '\u00a0<span class="req" aria-hidden="true">*</span><span class="sr-only">(obligatoriu)</span>';

  // ---------- Componente refolosite ----------
  function field(o) {
    var id = 'f_' + o.v;
    var ctl = o.single
      ? '<input type="text" id="' + id + '" data-var="' + o.v + '" maxlength="' + (o.max || 100) + '" autocomplete="off"' + (o.req ? ' aria-required="true"' : '') + '>'
      : '<textarea id="' + id + '" data-var="' + o.v + '" maxlength="' + (o.max || 400) + '" style="height:' + (o.h || 180) + 'px"' + (o.req ? ' aria-required="true"' : '') + '></textarea>';
    return '<div class="field"' + (o.cue != null ? ' data-cue="' + o.cue + '"' : '') + '><label for="' + id + '">' + o.label + (o.req ? REQ : '') + '</label>' + ctl +
      (o.single ? '' : '<span class="count" aria-hidden="true"></span>') + '</div>';
  }
  function radios(o) {
    return '<fieldset class="opts' + (o.stack ? ' opts--stack' : '') + '"' + (o.cue != null ? ' data-cue="' + o.cue + '"' : '') + '>' +
      '<legend class="' + (o.legendCls || 'sr-only') + '">' + o.legend + '</legend>' +
      o.items.map(function (it) {
        return '<label class="opt"><input type="radio" name="' + o.name + '" value="' + it[0] + '" data-num="' + o.num + '"' +
          (o.tvar ? ' data-tvar="' + o.tvar + '" data-text="' + e(it[2] || it[1]) + '"' : '') + '><span>' + e(it[1]) + '</span></label>';
      }).join('') + '</fieldset>';
  }
  function qhead(n) {
    var dots = '';
    for (var i = 1; i <= 9; i++) { dots += '<i class="' + (i < n ? 'is-past' : i === n ? 'is-now' : '') + '"></i>'; }
    return '<div class="qhead" data-cue="0"><span class="num qnum" aria-hidden="true">' + n + '</span>' +
      '<div class="qmeta"><p class="qcount">Întrebarea ' + n + ' din 9</p><span class="qdots" aria-hidden="true">' + dots + '</span></div></div>';
  }
  function qfoot() { return '<p class="q-foot small"><span class="req" aria-hidden="true">*</span> obligatoriu · Răspunsurile se salvează automat.</p>'; }
  function tip(text, cue) { return '<div class="tip"' + (cue != null ? ' data-cue="' + cue + '"' : '') + '>' + I('info') + '<p>' + text + '</p></div>'; }
  function filmStrip(cls, cue) {
    return '<div class="film ' + (cls || '') + '"' + (cue != null ? ' data-cue="' + cue + '"' : '') + ' aria-hidden="true"><div class="film-row">' +
      C.frames.map(function (f, i) {
        return '<div class="film-frame"><img class="develop" style="--d:' + (i * 220) + 'ms" src="' + f.img + '" alt=""><span class="film-edge num">' + f.n + '</span></div>';
      }).join('') + '</div></div>';
  }
  function clipBtn(n, label, cue) {
    if (!C.media['clip' + n]) { return ''; } // fără fișier video: butonul nu apare (spațiul rămâne gol)
    return '<button class="btn btn--small clip-btn" data-clip="' + n + '"' + (cue != null ? ' data-cue="' + cue + '"' : '') + '>' + I('film') + label + '</button>';
  }
  function wireClips(root) {
    Array.prototype.forEach.call(root.querySelectorAll('[data-clip]'), function (b) {
      b.addEventListener('click', function () { window.P.openClip(Number(b.getAttribute('data-clip'))); });
    });
  }
  function on(root, sel, fn) { var el = root.querySelector(sel); if (el) { el.addEventListener('click', fn); } return el; }
  function frameCard(cls) {
    var v = V(), f = window.P.chosenFrame();
    if (Number(v.nPlan_Cale) === 1) {
      return '<span class="' + cls + '-phrase serif">martorul anonim</span><span class="' + cls + '-cap">Sintagma „martorul anonim” · clic pentru a mări</span>';
    }
    if (f) {
      return '<span class="print ' + cls + '-print"><img src="' + f.img + '" alt="">' + window.P.ring(300, 210) + '</span><span class="' + cls + '-cap">' + e(f.name) + ' · clic pentru a mări</span>';
    }
    return '<span class="' + cls + '-empty">Încă nu ai ales un cadru (întrebarea 4) sau sintagma (întrebarea 1).</span>';
  }
  var MOD = {
    start: { t: 'Pornește aici' },
    m1: { n: 1, t: 'Înțelege invitația' },
    m2: { n: 2, t: 'Alege punctul de plecare' },
    m3: { n: 3, t: 'Răspunde la întrebări' },
    m4: { n: 4, t: 'Scrie povestea' },
    m5: { n: 5, t: 'Povestea mea' }
  };
  var PARTS = {
    inceput: ['Început', 'Începutul', ['Începutul ne pune în scenă: unde suntem, când, cine e acolo.', 'Ajunge o imagine clară și o întrebare care ne face să citim mai departe.']],
    miez: ['Miez', 'Miezul', ['Miezul e derularea întâmplării. Ceva se schimbă, se complică sau se rupe.', 'Aici eroul alege, ezită, greșește.']],
    final: ['Final', 'Finalul', ['Finalul arată ce rămâne după întâmplare. Nu trebuie să explice tot.', 'Trebuie să lase cititorului un gând despre acel decembrie.']],
    ritm: ['Ritm', 'Ritmul', ['Orice poveste are un ritm. Peste unele lucruri treci repede.', 'Pe altele insiști, ca la încetinitor, cu mai multe detalii.']]
  };
  var PROMPTS31 = ['Ce vezi? Ce detaliu observi abia a doua oară?', 'Ce s-ar auzi în acest cadru?', 'Ce s-a întâmplat cu un minut înainte?', 'Ce s-a întâmplat imediat după fotografie?'];
  var VIDS = [
    { t: 'Introducere în storytelling', src: 'Pixar in a Box · Khan Academy Labs · 2017',
      d: 'Deschide seria The Art of Storytelling: de la o idee brută la personaj, structură și storyboard.', you: '<b>Pentru tine:</b> și tu pornești de la o idee brută.',
      aria: 'Introducere în storytelling, Pixar in a Box' },
    { t: 'Structura poveștii', src: 'Pixar in a Box · Khan Academy Labs · 2017 · cca 4 min',
      d: 'Lecția despre structură: coloana poveștii (8 pași) și cele trei acte.', you: '<b>Pentru tine:</b> scheletul poveștii, înainte de primul rând.',
      aria: 'Structura poveștii, Pixar in a Box' },
    { t: '10 reguli de povestire', src: 'Pixar · YouTube',
      d: 'Zece reguli de povestire de la Pixar, pe scurt.', you: '<b>Ce urmărești:</b> două reguli pe care le aplici direct.',
      aria: '10 reguli de povestire, Pixar' }
  ];
  var VIDS22 = [
    { k: 'a', url: 'web22a', th: 'Pixar in a Box', site: 'Khan Academy', t: 'Structura poveștii, pas cu pas', src: 'Pixar in a Box · Khan Academy',
      you: '<b>Pentru punctele 1, 3 și 4:</b> coloana poveștii, tema (ideea care leagă toate întâmplările, adică firul roșu) și cele trei acte: început, miez, final.',
      how: 'Începi cu „Story spine”, apoi „Theme” și „Act 1–3”.', aria: 'Structura poveștii, Pixar in a Box, pe Khan Academy' },
    { k: 'b', url: 'web22b', th: 'TED-Ed', site: 'YouTube', t: 'Cum încetinești timpul, în scris și în film', src: 'TED-Ed · Aaron Sitze',
      you: '<b>Pentru punctul 2:</b> cum desfaci un moment în detalii, ca la încetinitor.', how: '',
      aria: 'Cum încetinești timpul, TED-Ed' }
  ];
  function webCards22() {
    var S = window.P.S;
    return '<div class="g22-web">' + VIDS22.map(function (v) {
      var url = C.media[v.url], seen = S.seen['v22:' + v.k] ? ' is-seen' : '';
      if (!url) { return ''; }
      return '<article class="vcard vcard--g22"><div class="vthumb" aria-hidden="true">' + I('film') + '<span>' + v.th + '</span></div>' +
        '<h2 class="h3">' + v.t + '</h2><p class="small">' + v.src + '</p><p class="p">' + v.you + '</p>' + (v.how ? '<p class="small">' + v.how + '</p>' : '') +
        '<a class="btn btn--small vcard-go' + seen + '" data-v22="' + v.k + '" href="' + e(url) + '" target="_blank" rel="noopener noreferrer">' + I('play') + 'Urmărește pe ' + v.site +
        '<span class="sr-only">: ' + e(v.aria) + ' (se deschide într-o filă nouă)</span><span class="mark vcard-m" aria-hidden="true">' + I('check') + 'Văzut</span></a></article>';
    }).join('') + '</div><p class="small muted g22-note">Videoclipurile sunt în engleză și se deschid într-o filă nouă. Atelierul rămâne deschis aici.</p>';
  }
  var CHECKS = ['Are un început, un miez și un final.', 'Am încetinit ritmul în cel puțin un moment-cheie.', 'Se înțelege cine povestește și când se petrece totul.',
    'Eroina sau eroul meu are o dorință sau o dilemă.', 'Firul roșu se simte de la primul la ultimul paragraf.', 'Povestea are titlu și cel mult 1000 de cuvinte.'];

  function overLimit() { return V().nPoveste_Cuvinte > C.wordLimit; }
  function limitMsg() { return 'Ai ' + V().nPoveste_Cuvinte + ' de cuvinte. Limita e ' + C.wordLimit + '. Taie ce nu duce firul roșu mai departe.'; }

  // ---------- 5.6 · Rezultatele atelierului: poveștile elevilor (cititor) și fotografiile (lightbox) ----------
  // js/rezultate.js se încarcă abia când se deschide 5.6, cu <script> (merge și deschis direct de pe PC).
  var RZ = (function () {
    var loading = false, waiters = [];
    function each(root, sel, fn) { Array.prototype.forEach.call(root.querySelectorAll(sel), fn); }
    function data() { return window.IS89_REZULTATE || null; }
    function load(cb) {
      if (data()) { cb(); return; }
      waiters.push(cb);
      if (loading) { return; }
      loading = true;
      var s = document.createElement('script');
      s.src = C.rezultate.date;
      s.onload = s.onerror = function () { loading = false; var w = waiters; waiters = []; w.forEach(function (f) { f(); }); };
      document.head.appendChild(s);
    }
    function names() { return C.rezultate.arataNumele !== false; }
    function who(s) { return names() ? s.autor : ''; }
    function words(n) { var r = n % 100; return n + ((n && r === 0) || r >= 20 ? ' de cuvinte' : ' cuvinte'); }
    function isRead(s) { return !!window.P.S.seen['rz:' + s.id]; }
    function langAttr(s) { return s.lang && s.lang !== 'ro' ? ' lang="' + e(s.lang) + '"' : ''; }

    function item(s, i) {
      var w = who(s);
      return '<li><button class="rz-item' + (isRead(s) ? ' is-read' : '') + '" data-i="' + i + '">' +
        (w ? '<span class="rz-who">' + e(w) + '<span class="sr-only">, </span></span>' : '') +
        '<span class="rz-tl"><span class="rz-title serif">' + e(s.titlu) + '</span>' +
        '<span class="rz-done"><span class="sr-only">, </span>' + I('check') + 'citită</span></span>' +
        '<span class="sr-only">: </span><span class="rz-inc serif"' + langAttr(s) + '>' + e(s.inc) + '</span></button></li>';
    }
    function stories(L) {
      if (!names()) { return '<ul class="rz-list">' + L.map(item).join('') + '</ul>'; }
      var signed = [], unsigned = [];
      L.forEach(function (s, i) { (s.autor ? signed : unsigned).push(item(s, i)); });
      return (signed.length ? '<h3 class="rz-group">Semnate <span class="num">' + signed.length + '</span></h3><ul class="rz-list">' + signed.join('') + '</ul>' : '') +
        (unsigned.length ? '<h3 class="rz-group">Fără semnătură <span class="num">' + unsigned.length + '</span></h3><ul class="rz-list">' + unsigned.join('') + '</ul>' : '');
    }
    function sheet(G) {
      return '<ul class="rz-sheet">' + G.map(function (g, i) {
        return '<li><button class="rz-frame" data-g="' + i + '" aria-label="' + e('Mărește fotografia ' + (i + 1) + ': ' + g.cap) + '">' +
          '<img src="' + e(g.mic) + '" alt="" width="480" height="320" decoding="async"><span class="rz-fn num" aria-hidden="true">' + (i + 1) + '</span>' +
          window.P.ring(270, 190) + '</button></li>';
      }).join('') + '</ul>';
    }
    function render(r) {
      var body = r.querySelector('#rzBody'), d = data();
      if (!body || window.P.S.loc !== '5.6') { return; }   // elevul a plecat de pe ecran până s-au încărcat datele
      body.removeAttribute('aria-busy');
      if (!d) {
        body.innerHTML = tip('Lucrările nu s-au încărcat. Spune-i profesorului: lipsește fișierul ' + e(C.rezultate.date) + ' din pachetul cursului.');
        return;
      }
      body.innerHTML =
        '<section class="rz-stories" aria-labelledby="rzSt"><h2 class="rz-h" id="rzSt">Poveștile <span class="num">' + d.povesti.length + '</span></h2>' +
        '<div class="rz-scroll">' + stories(d.povesti) + '</div></section>' +
        '<section class="rz-photos" aria-labelledby="rzPh"><h2 class="rz-h" id="rzPh">Fotografii din atelier <span class="num">' + d.galerie.length + '</span></h2>' +
        sheet(d.galerie) + '</section>';
      each(body, '.rz-item', function (b) { b.addEventListener('click', function () { openStory(Number(b.getAttribute('data-i'))); }); });
      each(body, '.rz-frame', function (b) { b.addEventListener('click', function () { openPhoto(Number(b.getAttribute('data-g'))); }); });
    }
    function marks() {
      var d = data(); if (!d) { return; }
      each(document, '#slide .rz-item', function (b) { b.classList.toggle('is-read', isRead(d.povesti[Number(b.getAttribute('data-i'))])); });
    }

    // Cititorul: o poveste pe ecran, cu povestea anterioară / următoare
    function openStory(i) {
      var L = data().povesti, k = i, root;
      function show(n, say) {
        k = n;
        var s = L[k], w = who(s), t = root.querySelector('.rd-text');
        root.setAttribute('aria-label', s.titlu + (w ? ', de ' + w : ''));
        root.querySelector('.rd-head').innerHTML = (w ? '<p class="rd-who">' + e(w) + '</p>' : '') +
          '<h2 class="rd-title serif" id="rdTitle" tabindex="-1">' + e(s.titlu) + '</h2>' +
          (s.sub ? '<p class="rd-sub serif">' + e(s.sub) + '</p>' : '') +
          '<p class="rd-meta small">' + words(s.cuv) + (s.lang === 'en' ? ' · în limba engleză' : '') + '</p>';
        t.innerHTML = s.p.map(function (p) { return p === '✦' ? '<hr class="rd-scene">' : '<p>' + e(p) + '</p>'; }).join('');
        if (s.lang && s.lang !== 'ro') { t.setAttribute('lang', s.lang); } else { t.removeAttribute('lang'); }
        t.scrollTop = 0;
        root.querySelector('.rd-pos').textContent = (k + 1) + ' din ' + L.length;
        root.querySelector('[data-rd="-1"]').disabled = k === 0;
        root.querySelector('[data-rd="1"]').disabled = k === L.length - 1;
        window.P.S.seen['rz:' + s.id] = 1; window.P.saveNow();
        if (say) { root.querySelector('.rd-live').textContent = 'Povestea ' + (k + 1) + ' din ' + L.length + ': ' + (w ? w + ', ' : '') + s.titlu; }
      }
      window.P.openModal({
        label: 'Povestea', cls: 'modal-rd', focus: '#rdTitle',
        html: '<article class="rd"><header class="rd-head"></header>' +
          '<div class="rd-text serif" tabindex="0" role="region" aria-label="Textul poveștii"></div>' +
          '<footer class="rd-nav"><button class="btn btn--small" data-rd="-1">' + I('prev') + '<span class="rd-l">Povestea anterioară</span></button>' +
          '<p class="rd-pos small" aria-hidden="true"></p>' +
          '<button class="btn btn--small" data-rd="1"><span class="rd-l">Povestea următoare</span>' + I('next') + '</button></footer>' +
          '<p class="sr-only rd-live" aria-live="polite"></p></article>',
        onOpen: function (el) {
          root = el; show(i, false);
          each(el, '[data-rd]', function (b) {
            b.addEventListener('click', function () {
              var d = Number(b.getAttribute('data-rd')), n = k + d;
              if (n < 0 || n >= L.length) { return; }
              show(n, true);
              if (b.disabled) { el.querySelector('[data-rd="' + (-d) + '"]').focus(); }
            });
          });
        },
        onClose: marks
      });
    }

    // Lightbox: fotografia mare, cu săgeți (butoane sau tastele ← →)
    function openPhoto(i) {
      var G = data().galerie, k = i, root;
      function show(n, say) {
        k = n;
        var g = G[k], img = root.querySelector('.lb-img img');
        img.src = g.src; img.alt = g.alt; img.width = g.w; img.height = g.h;
        root.querySelector('.lb-n').textContent = 'Fotografia ' + (k + 1) + ' din ' + G.length;
        root.querySelector('.lb-t').textContent = g.cap;
        root.querySelector('[data-lb="-1"]').disabled = k === 0;
        root.querySelector('[data-lb="1"]').disabled = k === G.length - 1;
        if (say) { root.querySelector('.lb-live').textContent = 'Fotografia ' + (k + 1) + ' din ' + G.length + ': ' + g.alt; }
      }
      function step(d) {
        var n = k + d;
        if (n < 0 || n >= G.length) { return; }
        show(n, true);
        var b = root.querySelector('[data-lb="' + d + '"]');
        if (b.disabled && document.activeElement === b) { root.querySelector('[data-lb="' + (-d) + '"]').focus(); }
      }
      window.P.openModal({
        label: 'Fotografii din atelier', cls: 'modal-lb', dark: true, focus: '.lb',
        html: '<figure class="lb"><div class="lb-img"><img src="" alt=""></div>' +
          '<figcaption class="lb-cap"><span class="lb-n"></span><span class="lb-t"></span></figcaption></figure>' +
          '<button class="lb-arrow lb-arrow--prev" data-lb="-1" aria-label="Fotografia anterioară">' + I('prev') + '</button>' +
          '<button class="lb-arrow lb-arrow--next" data-lb="1" aria-label="Fotografia următoare">' + I('next') + '</button>' +
          '<p class="sr-only lb-live" aria-live="polite"></p>',
        onOpen: function (el) {
          root = el; show(i, false);
          each(el, '[data-lb]', function (b) { b.addEventListener('click', function () { step(Number(b.getAttribute('data-lb'))); }); });
          el.addEventListener('keydown', function (ev) {
            if (ev.key === 'ArrowLeft') { ev.preventDefault(); step(-1); }
            if (ev.key === 'ArrowRight') { ev.preventDefault(); step(1); }
          });
        }
      });
    }
    return { load: load, render: render, openStory: openStory, openPhoto: openPhoto };
  })();

  window.IS89_SLIDES = [
    // ================= 01 Pornește aici =================
    {
      id: '1.1', key: '1-1', title: 'Start', layout: 'paper',
      html: function () {
        return '<div class="t11">' +
          '<img class="t11-logo" data-cue="0" src="media/brand/is89-cyan.png" alt="Imagine Sunet ’89">' +
          '<div class="t11-copy">' +
          '<p class="t11-label" data-cue="1">Atelier de scriere · decembrie 1989</p>' +
          '<h1 class="t11-title" data-cue="0">Martorul anonim</h1>' +
          '<p class="t11-sub serif" data-cue="2">Patru cadre de pe un film. O sintagmă. Povestea ta, de cel mult 1000 de cuvinte.</p>' +
          '<button class="btn btn--primary t11-go" id="b11" data-cue="3">Începe</button></div>' +
          filmStrip('t11-film', 2) +
          '<footer class="t11-foot" data-cue="3"><p class="small">Fotografii: martor anonim, decembrie 1989</p>' +
          '<div class="logos"><img class="logo-cp" src="media/brand/finantat-cp.png" alt="Finanțat de Municipiul Timișoara prin Centrul de Proiecte">' +
          '<img class="logo-tehno" src="media/brand/tehnoarte.svg" alt="Tehnoarte"></div></footer></div>';
      },
      init: function (r) { on(r, '#b11', function () { window.P.go('1.2'); }); }
    },
    {
      id: '1.2', key: '1-2', title: 'Notă de conținut', mod: MOD.start,
      html: function () {
        return '<h1 class="h1" data-cue="0">Înainte să începi</h1><div class="mid"><div class="g12"><div class="g12-l">' +
          '<section class="block" data-cue="1"><h2 class="h3">Despre fotografii</h2><p class="p">Fotografiile din acest atelier sunt din decembrie 1989. Unele arată militari, arme și o persoană căzută pe stradă.</p></section>' +
          '<section class="block" data-cue="2"><h2 class="h3">Ai grijă de tine</h2><p class="p">Poți lua o pauză oricând. Dacă ceva te tulbură, vorbește cu profesorul tău sau cu cineva în care ai încredere.</p></section></div>' +
          '<blockquote class="quote g12-q" data-cue="3"><p>Scrie cu respect: în spatele fiecărui cadru au fost oameni reali.</p></blockquote></div></div>' +
          '<div class="actions" data-cue="4"><button class="btn btn--primary" id="b12">Am înțeles</button></div>';
      },
      init: function (r) { on(r, '#b12', function () { window.P.go('1.3'); }); }
    },
    {
      id: '1.3', key: '1-3', title: 'Cum lucrezi', mod: MOD.start,
      html: function () {
        var st = [['Planul', 'Răspunzi la 9 întrebări, câte una pe ecran. Răspunsurile intră în „Planul meu”.'],
          ['Cadrul', 'Alegi o fotografie sau sintagma. O găsești oricând în colț, la „Cadrul meu”.'],
          ['Povestea', 'Scrii povestea în atelier, în cel mult 1000 de cuvinte. Contorul te ajută.'],
          ['Salvarea', 'Răspunsurile se salvează singure. Descarcă sau printează planul și povestea oricând.']];
        return '<h1 class="h1" data-cue="0">Cum lucrezi în atelier</h1>' +
          '<p class="corner-hint" data-cue="5">' + I('up') + 'Instrumentele tale sunt mereu în colț</p>' +
          '<ol class="steps">' + st.map(function (s, i) {
            return '<li class="step" data-cue="' + (i + 1) + '"><span class="num step-n" aria-hidden="true">' + (i + 1) + '</span><div><h2 class="h3">' + s[0] + '</h2><p class="p">' + s[1] + '</p></div></li>';
          }).join('') + '</ol>' +
          tip('Sfat: pentru poveste, folosește un laptop sau o tabletă cu tastatură.', 6).replace('class="tip"', 'class="tip t13"') +
          '<div class="actions" data-cue="6">' + clipBtn(1, 'Vezi cum funcționează (35 s)') + '<button class="btn btn--primary" id="b13">Mergi la meniu</button></div>';
      },
      init: function (r) { on(r, '#b13', function () { window.P.go('1.4'); }); wireClips(r); }
    },
    {
      id: '1.4', key: '1-4', title: 'Meniul atelierului', mod: MOD.start,
      html: function () {
        var v = V();
        return '<h1 class="h1" data-cue="0">Meniul atelierului</h1><p class="lead muted m14-sub" data-cue="0">Recomandăm ordinea 1 → 5. Cadrul și planul tău rămân mereu în colț.</p>' +
          '<ol class="tiles">' + C.modules.map(function (m) {
            var locked = window.P.moduleLocked(m.n);
            var done = (m.n === 3 && v.bPlan_Complet) || (m.n === 5 && v.bPoveste_Gata);
            var state = locked ? '<span class="tile-lock">' + I('lock') + '<span>' + m.locked + '</span></span>'
              : done ? '<span class="mark tile-done">' + I('check') + 'Gata</span>' : '';
            return '<li data-cue="' + m.n + '"><button class="tile' + (locked ? ' is-locked' : '') + (done ? ' is-done' : '') + '" data-n="' + m.n + '"' + (locked ? ' aria-disabled="true"' : '') + '>' +
              '<span class="num tile-n" aria-hidden="true">' + m.n + '</span><span class="tile-t"><span class="sr-only">Modulul ' + m.n + ': </span>' + e(m.title) + '</span><span class="tile-d">' + e(m.desc) + '</span>' + state + '</button></li>';
          }).join('') + '</ol>';
      },
      init: function (r) {
        Array.prototype.forEach.call(r.querySelectorAll('.tile'), function (b) {
          b.addEventListener('click', function () {
            var m = C.modules[Number(b.getAttribute('data-n')) - 1];
            if (window.P.moduleLocked(m.n)) { window.P.banner('Modulul ' + m.n + ': ' + m.locked.toLowerCase() + '.'); return; }
            window.P.go(m.to);
          });
        });
      },
      next: function () { return '2.1'; }
    },

    // ================= 02 Înțelege invitația =================
    {
      id: '2.1', key: '2-1', title: 'Invitația', mod: MOD.m1,
      html: function () {
        return '<h1 class="h1" data-cue="0">Invitația pentru povestea ta</h1><div class="mid">' +
          '<blockquote class="quote inv" data-cue="1"><p>Imaginează-ți o poveste despre sau trimițând la acel decembrie: decembrie 1989, revoluția.</p></blockquote>' +
          '<div class="facts">' +
          '<section class="block" data-cue="2"><h2 class="h3">Punctul de plecare</h2><p class="p">Sintagma „martorul anonim” sau unul dintre cele patru cadre de pe film.</p></section>' +
          '<section class="block" data-cue="3"><h2 class="h3">Lungimea</h2><p class="p">Cel mult 1000 de cuvinte, cam două pagini.</p></section>' +
          '<section class="block" data-cue="4"><h2 class="h3">Perioada</h2><p class="p">Atelier: septembrie–octombrie 2026.</p><p class="p">Termenul de predare îl afli de la profesorul tău.</p></section></div></div>' +
          (C.media.invitatiePdf ? '<div class="actions actions--left" data-cue="4"><a class="btn" href="' + e(C.media.invitatiePdf) + '" target="_blank" rel="noopener">' + I('doc') + 'Deschide invitația (PDF)</a></div>' : '');
      }
    },
    {
      id: '2.2', key: '2-2', title: 'Video: cum construiești o poveste', mod: MOD.m1,
      html: function () {
        var w = ['Începutul, miezul, finalul', 'Ritmul: repede și ca la încetinitor', 'Coloana poveștii', 'Firul roșu'];
        return '<h1 class="h1" data-cue="0">Cum construiești o poveste</h1><div class="g22">' +
          '<div class="g22-v" data-cue="0">' + (C.media.web22a || C.media.web22b ? webCards22()
            : window.P.videoSlot('', '', 'Video: cum construiești o poveste', 1120, 630)) + '</div>' +
          '<aside class="g22-side"><h2 class="h3" data-cue="1">Ce urmărești</h2><ol class="watch">' +
          w.map(function (t, i) { return '<li data-cue="' + (i + 2) + '"><span class="num" aria-hidden="true">' + (i + 1) + '</span><span>' + t + '</span></li>'; }).join('') + '</ol>' +
          '</aside></div>';
      },
      init: function (r) {
        var v = r.querySelector('video');
        if (v) { v.addEventListener('play', function () { window.P.VO.skip(); }); }
        Array.prototype.forEach.call(r.querySelectorAll('a[data-v22]'), function (a) {
          a.addEventListener('click', function () {
            window.P.S.seen['v22:' + a.getAttribute('data-v22')] = 1; a.classList.add('is-seen'); window.P.saveNow(true);
          });
        });
      }
    },
    {
      id: '2.3', key: '2-3', title: 'Povestea și povestitul', mod: MOD.m1,
      gateMsg: 'Deschide toate cele patru părți ca să continui.',
      html: function () {
        function btn(k, extra) {
          return '<button class="part' + (extra || '') + '" data-p="' + k + '" aria-pressed="false">' +
            (k === 'ritm' ? '<span class="part-t">Ritm</span><span class="rhythm" aria-hidden="true"><span>repede</span><i class="rh rh--dense"></i><span>încet</span><i class="rh rh--sparse"></i></span>'
              : '<span class="part-t">' + PARTS[k][0] + '</span>') +
            '<span class="mark part-m">' + I('check') + 'Văzut</span></button>';
        }
        return '<h1 class="h1" data-cue="0">Povestea și povestitul</h1>' +
          '<div class="arc" data-cue="1" role="group" aria-label="Părțile poveștii">' + btn('inceput') + '<span class="arc-link" aria-hidden="true"></span>' + btn('miez') +
          '<span class="arc-link" aria-hidden="true"></span>' + btn('final') + '</div>' +
          '<div class="arc-ritm" data-cue="1">' + btn('ritm', ' part--ritm') + '</div>' +
          '<p class="small i23" data-cue="2">Selectează fiecare parte ca să afli ce face. Apoi poți merge mai departe.</p>' +
          '<section class="panel23" id="panel23" aria-live="polite"></section>';
      },
      init: function (r) {
        var S = window.P.S;
        function marks() {
          Array.prototype.forEach.call(r.querySelectorAll('.part'), function (b) { b.classList.toggle('is-seen', !!S.seen['p23:' + b.getAttribute('data-p')]); });
        }
        marks();
        Array.prototype.forEach.call(r.querySelectorAll('.part'), function (b) {
          b.addEventListener('click', function () {
            var k = b.getAttribute('data-p'), p = PARTS[k], first = !S.seen['p23:' + k];
            S.seen['p23:' + k] = 1;
            Array.prototype.forEach.call(r.querySelectorAll('.part'), function (x) { x.setAttribute('aria-pressed', String(x === b)); });
            var panel = r.querySelector('#panel23');
            panel.innerHTML = '<h2 class="h2" data-cue="0">' + p[1] + '</h2><p class="lead"><span data-cue="0">' + p[2][0] + '</span> <span data-cue="1">' + p[2][1] + '</span></p>' +
              (k === 'ritm' ? clipBtn(2, 'Vezi diferența (35 s)', 1) : '');
            wireClips(panel);
            window.P.reveal(r, 99);
            window.P.narrate('2-3_' + k, panel, first);
            marks();
            if (['inceput', 'miez', 'final', 'ritm'].every(function (x) { return S.seen['p23:' + x]; })) { window.P.setVar('bL2_PartiVazute', true); }
            window.P.saveNow(true);
          });
        });
      },
      canNext: function () { return !!V().bL2_PartiVazute; }
    },
    {
      id: '2.4', key: '2-4', title: 'Încearcă: încetinește momentul', mod: MOD.m1,
      html: function () {
        function opt(L, t, cue) {
          return '<label class="optl" data-cue="' + cue + '"><input type="radio" name="v24" value="' + L + '"><span class="radio" aria-hidden="true"></span>' +
            '<span class="letter" aria-hidden="true">' + L + '.</span><span class="txt"><span class="sr-only">Varianta ' + L + ': </span>' + t + '</span></label>';
        }
        return '<h1 class="h1" data-cue="0">Încearcă: încetinește momentul</h1><fieldset class="q24"><legend class="h2 q24-q" data-cue="1">Care variantă încetinește momentul?</legend>' +
          opt('A', 'A deschis ușa și a ieșit în stradă.', 2) +
          opt('B', 'A pus mâna pe clanța rece. A ascultat. Din stradă nu se auzea nimic, nici măcar câinii. A numărat până la trei și a deschis.', 3) +
          '</fieldset><div class="fb24" id="fb24"></div><div class="actions" data-cue="4"><button class="btn btn--primary" id="b24" disabled>Verifică</button></div>';
      },
      init: function (r) {
        var b = r.querySelector('#b24');
        Array.prototype.forEach.call(r.querySelectorAll('input[name=v24]'), function (x) {
          x.addEventListener('change', function () { b.disabled = false; });
        });
        b.addEventListener('click', function () {
          var sel = r.querySelector('input[name=v24]:checked'); if (!sel) { return; }
          var ok = sel.value === 'B', fb = r.querySelector('#fb24');
          fb.innerHTML = ok
            ? '<div class="feedback feedback--ok" role="status"><span class="badge" aria-hidden="true">' + I('check') + '</span><div><h2 class="h3" data-cue="0">Corect</h2><p class="p">' +
              '<span data-cue="1">Varianta B desface gestul în pași mici și adaugă un sunet și o senzație. Așa îi arăți cititorului că momentul contează.</span> ' +
              '<span data-cue="2">Păstrează încetinirea pentru momentele-cheie; restul poate curge repede.</span></p></div></div>'
            : '<div class="feedback feedback--no" role="status"><span class="badge" aria-hidden="true">' + I('close') + '</span><div><h2 class="h3" data-cue="0">Nu chiar</h2><p class="p">' +
              '<span data-cue="1">Varianta A trece repede peste moment: e bună pentru legături între scene.</span> ' +
              '<span data-cue="2">Dacă momentul contează, desfă-l în detalii: ce simte, ce aude, unde ezită personajul. Varianta B face asta.</span></p></div></div>';
          window.P.reveal(r, 99);
          window.P.narrate(ok ? '2-4_corect' : '2-4_gresit', fb, true);
        });
      }
    },
    {
      id: '2.5', key: '2-5', title: 'Învață de la Pixar', mod: MOD.m1,
      html: function () {
        var S = window.P.S;
        return '<h1 class="h1" data-cue="0">Învață de la Pixar</h1><p class="lead muted g25-intro" data-cue="0">Despre storytelling făcut cu meșteșug: trei videoclipuri opționale, în engleză, cu subtitrare.</p>' +
          '<div class="vids">' + VIDS.map(function (v, i) {
            var url = C.media['web' + (i + 1)], seen = S.seen['v25:' + (i + 1)] ? ' is-seen' : '';
            var go = url
              ? '<a class="btn btn--small vcard-go' + seen + '" data-v="' + (i + 1) + '" href="' + e(url) + '" target="_blank" rel="noopener noreferrer">' + I('play') + 'Urmărește pe YouTube' +
                '<span class="sr-only">: ' + e(v.aria) + ' (se deschide într-o filă nouă)</span><span class="mark vcard-m" aria-hidden="true">' + I('check') + 'Văzut</span></a>'
              : '<button class="btn btn--small vcard-go" disabled>Link indisponibil</button>';
            return '<article class="vcard" data-cue="' + (i + 1) + '"><div class="vthumb" aria-hidden="true">' + I('film') + '<span>' + (i < 2 ? 'Pixar in a Box' : 'Pixar') + '</span></div>' +
              '<h2 class="h3">' + v.t + '</h2><p class="small">' + v.src + '</p><p class="p">' + v.d + '</p><p class="p">' + v.you + '</p>' + go + '</article>';
          }).join('') + '</div>' +
          '<p class="small muted g25-note" data-cue="3">Videoclipurile se deschid pe YouTube, într-o filă nouă. Atelierul rămâne deschis aici.</p>';
      },
      init: function (r) {
        Array.prototype.forEach.call(r.querySelectorAll('a.vcard-go'), function (a) {
          a.addEventListener('click', function () {
            var n = Number(a.getAttribute('data-v'));
            window.P.S.seen['v25:' + n] = 1; a.classList.add('is-seen'); window.P.saveNow(true);
          });
        });
      }
    },

    // ================= 03 Alege punctul de plecare =================
    {
      id: '3.1', key: '3-1', title: 'Cele patru cadre', mod: MOD.m2,
      gateMsg: 'Deschide toate cele patru cadre ca să continui.',
      html: function () {
        return '<h1 class="h1" data-cue="0">Cele patru cadre de pe film</h1><p class="lead muted" data-cue="1">Deschide fiecare cadru. Privește, ascultă, imaginează.</p>' +
          '<div class="film f31" data-cue="0"><div class="film-row">' + C.frames.map(function (f, i) {
            return '<button class="film-frame f31-b" data-n="' + f.n + '" aria-label="Deschide cadrul ' + f.n + ': ' + e(f.alt) + '"><img class="develop" style="--d:' + (i * 260) + 'ms" src="' + f.img + '" alt="">' +
              '<span class="film-edge num" aria-hidden="true">' + f.n + '</span><span class="mark f31-m" aria-hidden="true">' + I('check') + 'Văzut</span></button>';
          }).join('') + '</div></div>' +
          '<div class="f31-foot"><p class="f31-prog" data-cue="2" id="prog31" aria-live="polite"></p>' + clipBtn(3, 'Vezi un exemplu (40 s)', 2) + '</div>';
      },
      init: function (r) {
        var S = window.P.S;
        function upd() {
          var n = 0;
          Array.prototype.forEach.call(r.querySelectorAll('.f31-b'), function (b) {
            var k = Number(b.getAttribute('data-n')), seen = !!S.seen['c31:' + k]; b.classList.toggle('is-seen', seen); if (seen) { n++; }
            b.setAttribute('aria-label', 'Deschide cadrul ' + k + ': ' + C.frames[k - 1].alt + (seen ? ' Văzut.' : ''));
          });
          if (n === 4) { window.P.setVar('bL3_CadreVazute', true); }
          r.querySelector('#prog31').textContent = V().bL3_CadreVazute ? 'Ai deschis toate cele patru cadre. Poți merge mai departe.'
            : 'Deschide toate cele patru cadre ca să continui. Ai deschis ' + n + ' din 4.';
        }
        upd(); wireClips(r);
        Array.prototype.forEach.call(r.querySelectorAll('.f31-b'), function (b) {
          b.addEventListener('click', function () {
            var f = C.frames[Number(b.getAttribute('data-n')) - 1];
            window.P.openModal({
              label: 'Cadrul ' + f.n, cls: 'modal-frame', dark: true, vo: '3-1_cadru' + f.n,
              html: '<div class="fd"><figure class="fd-fig" data-cue="0"><img class="develop" src="' + f.img + '" alt="Cadrul ' + f.n + '"></figure><div class="fd-side">' +
                '<h2 class="h2" data-cue="0">Cadrul ' + f.n + '</h2><p class="p fd-desc" data-cue="0">' + e(f.alt) + '</p>' +
                '<section class="fd-prompts" data-cue="1"><h3 class="h3">Privește. Ascultă. Imaginează.</h3><ul>' + PROMPTS31.map(function (q) { return '<li>' + q + '</li>'; }).join('') + '</ul></section>' +
                '<button class="btn btn--primary fd-close" data-close>Închide</button></div></div>',
              onClose: function () { S.seen['c31:' + f.n] = 1; upd(); window.P.saveNow(true); }
            });
          });
        });
      },
      canNext: function () { return !!V().bL3_CadreVazute; }
    },
    {
      id: '3.2', key: '3-2', title: 'Martorul anonim', mod: MOD.m2,
      html: function () {
        var who = ['Cel care a fotografiat?', 'Un trecător sau un vecin?', 'Un copil la fereastră?', 'Un obiect care „a văzut” totul?', 'Ce a văzut și n-a spus nimănui?'];
        return '<h1 class="h1" data-cue="0">Sintagma: martorul anonim</h1><div class="g32"><div class="g32-l">' +
          '<p class="phrase serif" data-cue="0" aria-hidden="true">martorul anonim</p>' +
          '<p class="lead" data-cue="1">Invitația vorbește despre un martor fără nume și despre un film pierdut și regăsit.</p>' +
          tip('Sugestie: întreabă pe cineva din familie ce își amintește din acel decembrie. În poveste, poți schimba numele.', 8) + '</div>' +
          '<aside class="g32-r"><h2 class="h3" data-cue="2">Cine ar fi putut fi martorul?</h2><ul class="who">' +
          who.map(function (t, i) { return '<li data-cue="' + (i + 3) + '">' + t + '</li>'; }).join('') + '</ul>' + clipBtn(4, 'Vezi clipul (28 s)', 7) + '</aside></div>';
      },
      init: function (r) { wireClips(r); }
    },

    // ================= 04 Răspunde la întrebări =================
    {
      id: '4.1', key: '4-1', title: 'Ce te ghidează', mod: MOD.m3,
      html: function () {
        return '<div class="q"><div class="q-l">' + qhead(1) +
          '<h1 class="h2 qtext" data-cue="0">Ce te ghidează: sintagma „martorul anonim” sau o fotografie?' + REQ + '</h1>' +
          radios({ name: 'q1', num: 'nPlan_Cale', tvar: 'tPlan_Q1', cue: 1, stack: true, legend: 'Ce te ghidează',
            items: [[1, 'Sintagma „martorul anonim”'], [2, 'O fotografie'], [3, 'Amândouă', 'Amândouă: sintagma și o fotografie']] }) +
          '<p class="p muted q-hint" data-cue="2">Alegerea ta deschide întrebările potrivite: 2–3 pentru sintagmă, 4–5 pentru fotografie.</p></div>' +
          '<div class="q-r">' + field({ v: 'tPlan_Q1_DeCe', label: 'De ce? (1–3 propoziții, opțional)', h: 520, cue: 3 }) + '</div></div>' + qfoot();
      },
      next: function () {
        var c = Number(V().nPlan_Cale);
        if (!c) { return { block: 'Alege o variantă ca să continui.' }; }
        return c === 2 ? '4.4' : '4.2';
      },
      prev: function () { return '3.2'; }
    },
    {
      id: '4.2', key: '4-2', title: 'Sintagma ca titlu', mod: MOD.m3,
      html: function () {
        return '<div class="q"><div class="q-l">' + qhead(2) + '<p class="q-for small" data-cue="0">Pentru cine pornește de la sintagmă</p>' +
          '<h1 class="h2 qtext" data-cue="0">Folosești sintagma „martorul anonim” și ca titlu?' + REQ + '</h1>' +
          radios({ name: 'q2', num: 'nPlan_Titlu', tvar: 'tPlan_Q2', cue: 1, legend: 'Sintagma ca titlu', items: [[1, 'Da'], [2, 'Nu'], [3, 'Încă nu știu']] }) + '</div>' +
          '<div class="q-r">' + field({ v: 'tPlan_Q2_Titlu', label: 'Alt titlu la care te gândești (opțional)', single: true, max: 100, cue: 2 }) +
          tip('Dacă alegi „Da”, titlul „Martorul anonim” apare deja completat în atelierul de scris. Îl poți schimba oricând.', 3) + '</div></div>' + qfoot();
      },
      onChoice: function (k, val) {
        if (k !== 'nPlan_Titlu') { return; }
        var v = V();
        if (val === 1 && !String(v.tPoveste_Titlu).trim()) { window.P.setVar('tPoveste_Titlu', 'Martorul anonim'); }
        if (val === 2 && v.tPoveste_Titlu === 'Martorul anonim') { window.P.setVar('tPoveste_Titlu', ''); }
      },
      next: function () { return Number(V().nPlan_Titlu) ? '4.3' : { block: 'Alege o variantă ca să continui.' }; },
      prev: function () { return '4.1'; }
    },
    {
      id: '4.3', key: '4-3', title: 'Cine e martorul', mod: MOD.m3,
      html: function () {
        return '<div class="q"><div class="q-l">' + qhead(3) +
          '<h1 class="h2 qtext" data-cue="0">Cine ar fi putut fi martorul anonim?' + REQ + '</h1>' +
          '<p class="lead muted q-help" data-cue="1">Cine a văzut? De unde? Ce a ales să nu spună?</p>' +
          radios({ name: 'q3', num: 'nPlan_Film', tvar: 'tPlan_Q3_Film', cue: 3, legendCls: 'q-legend',
            legend: 'Vrei să vorbești și despre povestea martorului și a filmului pierdut și regăsit? (opțional)', items: [[1, 'Da'], [2, 'Nu'], [3, 'Poate']] }) + '</div>' +
          '<div class="q-r">' + field({ v: 'tPlan_Q3', label: 'Martorul meu…', req: true, h: 640, cue: 2 }) + '</div></div>' + qfoot();
      },
      next: function () {
        var v = V();
        if (!String(v.tPlan_Q3).trim()) { return { block: 'Scrie cine ar fi putut fi martorul ca să continui.' }; }
        return Number(v.nPlan_Cale) === 1 ? '4.6' : '4.4';
      },
      prev: function () { return '4.2'; }
    },
    {
      id: '4.4', key: '4-4', title: 'Care fotografie', mod: MOD.m3,
      html: function () {
        return '<div class="q"><div class="q-l">' + qhead(4) + '<h1 class="h2 qtext" data-cue="0">Care dintre cele patru cadre?' + REQ + '</h1>' +
          '<fieldset class="picks" data-cue="1"><legend class="sr-only">Alege cadrul</legend>' + C.frames.map(function (f, i) {
            return '<label class="pick" style="--d:' + (i * 160) + 'ms"><input type="radio" name="q4" value="' + f.n + '" data-num="nPlan_Foto" data-tvar="tPlan_Q4" data-text="' + e(f.name) + '">' +
              '<span class="print pick-print"><img class="develop" style="--d:' + (i * 160) + 'ms" src="' + f.img + '" alt="">' + window.P.ring(470, 290) + '</span>' +
              '<span class="pick-cap">Cadrul ' + f.n + '<span class="sr-only">: ' + e(f.alt) + '</span></span><span class="mark pick-m" aria-hidden="true">' + I('check') + 'Ales</span></label>';
          }).join('') + '</fieldset></div>' +
          '<div class="q-r q-r--low">' + field({ v: 'tPlan_Q4_DeCe', label: 'Ce te-a atras la el? (opțional)', h: 330, cue: 2 }) +
          '<p class="q-up small" data-cue="3">' + I('up') + 'Cadrul ales apare în colț, la „Cadrul meu”.</p></div></div>';
      },
      next: function () { return Number(V().nPlan_Foto) ? '4.5' : { block: 'Alege un cadru ca să continui.' }; },
      prev: function () { return Number(V().nPlan_Cale) === 3 ? '4.3' : '4.1'; }
    },
    {
      id: '4.5', key: '4-5', title: 'Înainte și după', mod: MOD.m3,
      html: function () {
        var f = window.P.chosenFrame() || C.frames[Math.max(0, Number(V().nPlan_Foto) - 1)];
        return '<div class="q45-top">' + qhead(5) + '<h1 class="h2 qtext" data-cue="0">Ce s-ar fi putut întâmpla înainte de cadru? Dar după?' + REQ + '</h1></div>' +
          '<div class="trip">' + field({ v: 'tPlan_Q5_Inainte', label: 'Înainte…', h: 470, cue: 2 }) +
          '<span class="trip-arrow" aria-hidden="true">' + I('next') + '</span>' +
          '<figure class="trip-mid" data-cue="1"><span class="print trip-print">' + (Number(V().nPlan_Foto) ? '<img class="develop" src="' + f.img + '" alt="' + e(f.alt) + '">' : '') + '</span>' +
          '<figcaption class="cap" data-show="tPlan_Q4" data-empty="Cadrul ales"></figcaption></figure>' +
          '<span class="trip-arrow" aria-hidden="true">' + I('next') + '</span>' +
          field({ v: 'tPlan_Q5_Dupa', label: 'După…', h: 470, cue: 3 }) + '</div>' + qfoot();
      },
      next: function () {
        var v = V();
        if (!String(v.tPlan_Q5_Inainte).trim() && !String(v.tPlan_Q5_Dupa).trim()) { return { block: 'Scrie ce s-a întâmplat înainte sau după cadru ca să continui.' }; }
        return '4.6';
      },
      prev: function () { return '4.4'; }
    },
    {
      id: '4.6', key: '4-6', title: 'Cine povestește', mod: MOD.m3,
      html: function () {
        return '<div class="q"><div class="q-l">' + qhead(6) + '<h1 class="h2 qtext" data-cue="0">Cine alege să spună povestea?' + REQ + '</h1>' +
          radios({ name: 'q6n', num: 'nPlan_Narator', tvar: 'tPlan_Q6_Narator', cue: 1, legendCls: 'q-legend', legend: 'Naratorul' + REQ,
            items: [[1, 'Eu'], [2, 'Un personaj'], [3, 'Un personaj din fotografie'], [4, 'Un personaj implicat în scenă, dar nevăzut'], [5, 'Altcineva']] }) +
          radios({ name: 'q6p', num: 'nPlan_Persoana', tvar: 'tPlan_Q6_Persoana', cue: 2, legendCls: 'q-legend', legend: 'Persoana' + REQ,
            items: [[1, 'Persoana I (eu)'], [3, 'Persoana a III-a (ea, el)']] }) + '</div>' +
          '<div class="q-r">' + field({ v: 'tPlan_Q6', label: 'Cine anume? Descrie-l în 1–2 propoziții (opțional)', h: 600, cue: 3 }) + '</div></div>' + qfoot();
      },
      next: function () {
        var v = V();
        if (!Number(v.nPlan_Narator) || !Number(v.nPlan_Persoana)) { return { block: 'Alege naratorul și persoana ca să continui.' }; }
        return '4.7';
      },
      prev: function () { return Number(V().nPlan_Cale) === 1 ? '4.3' : '4.5'; }
    },
    {
      id: '4.7', key: '4-7', title: 'Când se povestește', mod: MOD.m3,
      html: function () {
        return '<div class="q"><div class="q-l">' + qhead(7) + '<h1 class="h2 qtext" data-cue="0">Când se povestește povestea? Care e linia ei de timp?' + REQ + '</h1>' +
          radios({ name: 'q7', num: 'nPlan_Timp', tvar: 'tPlan_Q7_Timp', cue: 1, legend: 'Când se povestește',
            items: [[1, 'Atunci (decembrie 1989)'], [2, 'Acum'], [3, 'Înainte de atunci'], [4, 'Mai multe planuri de timp']] }) +
          '<div class="tline" data-cue="1" aria-hidden="true"><span class="tl-dot"></span><span class="tl-dot tl-dot--89"></span><span class="tl-dot"></span>' +
          '<span class="tl-l">înainte</span><span class="tl-l tl-l--89">decembrie 1989</span><span class="tl-l">acum</span></div></div>' +
          '<div class="q-r">' + field({ v: 'tPlan_Q7', label: 'Descrie linia timpului: de unde pornești și unde ajungi? (opțional)', h: 560, cue: 2 }) + '</div></div>' + qfoot();
      },
      next: function () { return Number(V().nPlan_Timp) ? '4.8' : { block: 'Alege o variantă ca să continui.' }; },
      prev: function () { return '4.6'; }
    },
    {
      id: '4.8', key: '4-8', title: 'Eroina sau eroul', mod: MOD.m3,
      html: function () {
        return '<div class="q"><div class="q-l">' + qhead(8) + '<h1 class="h2 qtext" data-cue="0">Ai o eroină sau un erou al poveștii?' + REQ + '</h1>' +
          radios({ name: 'q8', num: 'nPlan_Erou', tvar: 'tPlan_Q8', cue: 0, legend: 'Eroina sau eroul', items: [[1, 'Da'], [2, 'Nu'], [3, 'Încă nu știu']] }) +
          tip('Un erou nu trebuie să fie viteaz. Poate fi cineva care ezită, se teme sau alege greu.', 1) + '</div>' +
          '<div class="q-r q-r--3">' + field({ v: 'tPlan_Q8_Cine', label: 'Cine e?', h: 150, cue: 2 }) + field({ v: 'tPlan_Q8_Drum', label: 'Ce drum parcurge?', h: 150, cue: 3 }) +
          field({ v: 'tPlan_Q8_Dileme', label: 'Ce gânduri și ce dileme are?', h: 150, cue: 4 }) + '</div></div>' + qfoot();
      },
      next: function () { return Number(V().nPlan_Erou) ? '4.9' : { block: 'Alege o variantă ca să continui.' }; },
      prev: function () { return '4.7'; }
    },
    {
      id: '4.9', key: '4-9', title: 'Firul roșu', mod: MOD.m3,
      html: function () {
        return '<div class="q"><div class="q-l">' + qhead(9) + '<h1 class="h2 qtext" data-cue="0">Care e întâmplarea pe care o povestești? Care e firul roșu?' + REQ + '</h1>' +
          tip('Firul roșu e ideea care trece prin toată povestea. Dacă tai o scenă și firul nu se rupe, scena poate lipsi.', 1) +
          '<div class="q-help-btn" data-cue="5"><button class="btn" id="b49">' + I('info') + 'Ajutor: coloana poveștii</button></div></div>' +
          '<div class="q-r q-r--3">' + field({ v: 'tPlan_Q9_Intamplare', label: 'Întâmplarea, în 1–2 propoziții', req: true, h: 150, cue: 2 }) +
          field({ v: 'tPlan_Q9_Mesaj', label: 'Ce vrei, de fapt, să spui?', req: true, h: 150, cue: 3 }) +
          field({ v: 'tPlan_Q9_Cititor', label: 'Cu ce rămâne cititorul despre acel decembrie?', h: 150, cue: 4 }) + '</div></div>' + qfoot();
      },
      init: function (r) { on(r, '#b49', window.P.openColoana); },
      next: function () {
        var v = V();
        if (!String(v.tPlan_Q9_Intamplare).trim() || !String(v.tPlan_Q9_Mesaj).trim()) { return { block: 'Scrie întâmplarea și ce vrei, de fapt, să spui, ca să continui.' }; }
        window.P.setVar('bPlan_Complet', true);
        return '4.10';
      },
      prev: function () { return '4.8'; }
    },
    {
      id: '4.10', key: '4-10', title: 'Planul tău e gata', mod: MOD.m3,
      html: function () {
        var pr = window.P.canPrint();
        return '<div class="g410"><div class="g410-l"><h1 class="h1" data-cue="0">Planul tău e gata</h1>' +
          '<p class="lead" data-cue="1">Ai răspuns la întrebările de dinainte de a porni. Planul e salvat în curs. Îl găsești oricând în colț, la „Planul meu”.</p>' +
          '<div class="btn-row g410-btns" data-cue="2"><button class="btn" id="b410v">' + I('eye') + 'Vezi planul</button>' +
          '<button class="btn" data-x="plan-download">' + I('download') + 'Descarcă planul (.doc)</button>' +
          (pr ? '<button class="btn" data-x="plan-print">' + I('print') + 'Printează planul</button>' : '') + '</div>' +
          tip('Sfat: descarcă planul. Fișierul e copia ta, orice s-ar întâmpla cu cursul.', 3) +
          '<div class="g410-go" data-cue="4"><button class="btn btn--primary" id="b410s">' + I('pen') + 'Scrie povestea</button></div></div>' +
          '<div class="sheet-mini" data-cue="1" aria-hidden="true"><p class="sheet-mini-h">Planul meu</p><div class="sheet-mini-body" id="mini410"></div></div></div>';
      },
      init: function (r) {
        on(r, '#b410v', window.P.openPlan); on(r, '#b410s', function () { window.P.go('5.1'); });
        window.P.wireExports(r);
        var v = V(), rows = [['Ce mă ghidează', v.tPlan_Q1], ['Martorul', v.tPlan_Q3], ['Cadrul', v.tPlan_Q4], ['Naratorul', v.tPlan_Q6_Narator], ['Când', v.tPlan_Q7_Timp],
          ['Eroul', v.tPlan_Q8_Cine || v.tPlan_Q8], ['Întâmplarea', v.tPlan_Q9_Intamplare], ['Firul roșu', v.tPlan_Q9_Mesaj]];
        r.querySelector('#mini410').innerHTML = rows.filter(function (x) { return x[1]; }).map(function (x) {
          return '<p><b>' + e(x[0]) + '</b><span>' + e(String(x[1]).slice(0, 120)) + '</span></p>';
        }).join('');
      },
      next: function () { return '5.1'; }
    },

    // ================= 05 Scrie povestea =================
    {
      id: '5.1', key: '5-1', title: 'Atelierul de scris', mod: MOD.m4,
      html: function () {
        return '<h1 class="h1 w51-h" data-cue="0">Atelierul de scris</h1><div class="w51">' +
          '<div class="sheet" data-cue="1"><label class="sheet-lbl" for="inTitlu">Titlul poveștii</label>' +
          '<input type="text" id="inTitlu" class="sheet-title" data-var="tPoveste_Titlu" maxlength="100" autocomplete="off">' +
          '<label class="sr-only" for="inPoveste">Povestea ta. Cel mult 1000 de cuvinte.</label>' +
          '<textarea id="inPoveste" class="sheet-text" data-var="tPoveste_Text" maxlength="10000" aria-describedby="cnt51" placeholder="Scrie aici povestea ta…"></textarea></div>' +
          '<div class="w51-foot"><p class="counter" id="cnt51" data-cue="2"><span class="num counter-n" data-words>0</span><span class="counter-l"> / 1000 de cuvinte</span></p>' +
          '<button class="btn btn--small" id="b51s" data-cue="2">' + I('check') + 'Salvează</button></div>' +
          '<aside class="w51-side"><button class="mini" id="b51f" data-cue="3">' + frameCard('mini') + '</button>' +
          '<section class="thread" data-cue="3"><h2 class="h3">Firul tău roșu</h2><p class="serif thread-t" data-show="tPlan_Q9_Mesaj" data-empty="Îl scrii la întrebarea 9."></p></section>' +
          '<button class="btn btn--small" id="b51c" data-cue="4">' + I('info') + 'Ajutor: coloana poveștii</button></aside></div>';
      },
      init: function (r) {
        on(r, '#b51f', window.P.openFrame); on(r, '#b51c', window.P.openColoana);
        on(r, '#b51s', function () { window.P.saveNow(true); window.P.toast('Salvat · ' + V().nPoveste_Cuvinte + ' de cuvinte', 1000); });
        this.onVars();
      },
      onVars: function () {
        var c = document.querySelector('#cnt51'); if (c) { c.classList.toggle('is-over', overLimit()); }
      },
      onInput: function (k) {
        if (k !== 'tPoveste_Text') { return; }
        var b = document.querySelector('.banner');
        if (overLimit()) { if (b) { b.querySelector('span').textContent = limitMsg(); } else { window.P.banner(limitMsg(), 600000); } }
        else if (b) { window.P.clearMsgs(); }
      },
      next: function () {
        var n = V().nPoveste_Cuvinte;
        if (!n) { return { block: 'Povestea e încă goală. Scrie primul paragraf, apoi continuă.' }; }
        if (overLimit()) { return { block: limitMsg() }; }
        return '5.2';
      }
    },
    {
      id: '5.2', key: '5-2', title: 'Verifică-ți povestea', mod: MOD.m4,
      html: function () {
        var S = window.P.S;
        return '<h1 class="h1" data-cue="0">Verifică-ți povestea</h1><div class="g52"><div>' +
          '<p class="lead muted" data-cue="1">Bifează ce e adevărat pentru povestea ta. Ce nu poți bifa încă, repari în atelier.</p><ul class="checks">' +
          CHECKS.map(function (t, i) {
            return '<li data-cue="' + (i + 2) + '"><label class="chk"><input type="checkbox" data-i="' + i + '"' + (S.checks[i] ? ' checked' : '') + '><span class="chk-box" aria-hidden="true">' + I('check') + '</span><span>' + t + '</span></label></li>';
          }).join('') + '</ul></div>' +
          '<aside class="g52-r"><section class="block len" data-cue="1"><h2 class="h3">Lungimea</h2><p class="p"><span class="num len-n" data-words>0</span> de cuvinte din 1000</p></section>' +
          '<button class="btn btn--small" id="b52" data-cue="1">' + I('prev') + 'Înapoi la atelier</button><div id="ok52" aria-live="polite"></div></aside></div>';
      },
      init: function (r) {
        var S = window.P.S;
        function upd() {
          var all = CHECKS.every(function (x, i) { return S.checks[i]; });
          r.querySelector('#ok52').innerHTML = all ? '<div class="feedback feedback--ok ok52"><span class="badge" aria-hidden="true">' + I('check') + '</span><div><h2 class="h3">Arată bine</h2><p class="p">Mergi mai departe la „Povestea mea”.</p></div></div>' : '';
        }
        Array.prototype.forEach.call(r.querySelectorAll('.chk input'), function (x) {
          x.addEventListener('change', function () { S.checks[Number(x.getAttribute('data-i'))] = x.checked; upd(); window.P.saveNow(true); });
        });
        on(r, '#b52', function () { window.P.go('5.1'); });
        upd();
      },
      next: function () { return '5.3'; }
    },
    {
      id: '5.3', key: '5-3', title: 'Povestea mea', mod: MOD.m5, hideNext: true,
      html: function () {
        var pr = window.P.canPrint();
        return '<h1 class="h1 w51-h" data-cue="0">Povestea mea</h1><div class="w53">' +
          '<div class="sheet" data-cue="0"><p class="sheet-title sheet-title--view" data-show="tPoveste_Titlu" data-empty="Fără titlu"></p>' +
          '<label class="sr-only" for="inFinal">Povestea ta. Poți face corecturi.</label>' +
          '<textarea id="inFinal" class="sheet-text" data-var="tPoveste_Text" maxlength="10000" aria-describedby="cnt53" data-cue="1"></textarea></div>' +
          '<aside class="w53-side"><p class="counter" id="cnt53" data-cue="2"><span class="num counter-n" data-words>0</span><span class="counter-l"> / 1000 de cuvinte</span></p>' +
          '<div class="w53-btns" data-cue="2"><button class="btn btn--small" data-x="story-download">' + I('download') + 'Descarcă povestea (.doc)</button>' +
          (pr ? '<button class="btn btn--small" data-x="story-print">' + I('print') + 'Printează povestea</button>' : '') +
          '<button class="btn btn--small" data-x="all-download">' + I('download') + 'Descarcă planul și povestea</button>' +
          '<button class="btn btn--link" id="b53a">Înapoi la atelier</button></div>' +
          '<button class="btn btn--primary w53-done" id="b53" data-cue="3" aria-label="Am terminat. Marchează atelierul ca încheiat">' + I('check') + 'Am terminat</button></aside></div>';
      },
      init: function (r) {
        window.P.wireExports(r);
        on(r, '#b53a', function () { window.P.go('5.1'); });
        on(r, '#b53', function () {
          var n = V().nPoveste_Cuvinte;
          if (!n) { window.P.banner('Povestea e goală. Scrie-o în atelier, apoi revino aici.'); return; }
          if (overLimit()) { window.P.banner(limitMsg()); return; }
          window.P.setVar('bPoveste_Gata', true);
          window.P.complete();
          window.P.go('5.4');
        });
        this.onVars();
      },
      onVars: function () { var c = document.querySelector('#cnt53'); if (c) { c.classList.toggle('is-over', overLimit()); } }
    },
    {
      id: '5.4', key: '5-4', title: 'Final', layout: 'paper',
      html: function () {
        return '<div class="fin"><h1 class="fin-t" data-cue="0">Povestea ta e gata.</h1>' +
          '<p class="fin-msg serif" data-cue="1">Mulțumim că ai privit cu atenție. Acum și tu ești un martor: povestea ta duce mai departe acel decembrie.</p>' +
          '<div class="fin-cols"><section class="block" data-cue="1"><h2 class="h3">Cum o trimiți</h2><p class="p">Trimite profesorului tău fișierul descărcat sau varianta printată, până la termenul anunțat în clasă.</p></section>' +
          '<section class="block" data-cue="2"><h2 class="h3">Ai descărcat povestea?</h2><p class="p">Fișierul descărcat e copia ta sigură.</p>' +
          '<div class="btn-row fin-btns"><button class="btn" data-x="all-download" aria-label="Descarcă tot: planul și povestea, ca document Word">' + I('download') + 'Descarcă tot</button>' +
          '<button class="btn btn--primary" id="b54">Mai departe</button></div></section></div></div>' + filmStrip('fin-film', 2);
      },
      init: function (r) { window.P.wireExports(r); on(r, '#b54', function () { window.P.go('5.5'); }); },
      next: function () { return '5.5'; },
      prev: function () { return '5.3'; }
    },
    {
      id: '5.5', key: '5-5', title: 'Parteneri', layout: 'paper', hideNext: true,
      html: function () {
        return '<div class="cr"><h1 class="sr-only">Parteneri</h1>' +
          '<img class="cr-is89" src="media/brand/is89-manifest.png" alt="Imagine Sunet ’89 · Manifest">' +
          '<div class="cr-side"><img class="cr-cp" src="media/brand/finantat-cp.png" alt="Finanțat de Municipiul Timișoara prin Centrul de Proiecte">' +
          '<div class="cr-tehno"><img src="media/brand/tehnoarte.svg" alt="Tehnoarte"><a href="https://www.tehnoarte.com" target="_blank" rel="noopener">www.tehnoarte.com</a></div></div>' +
          '<button class="rz-go" id="b55r"><span class="rz-go-ico">' + I('pages') + '</span>' +
          '<span class="rz-go-t"><span class="rz-go-h">Rezultatele atelierului ' + e(C.rezultate.an) + '</span>' +
          '<span class="rz-go-s">Lucrările elevilor: poveștile scrise în atelier și fotografii</span></span>' + I('next') + '</button>' +
          '<div class="cr-notes small"><p class="cr-made">E-learning realizat de LEETUCATION SRL</p>' +
          '<p>Atelierul de scriere „Martorul anonim” · versiunea ' + e(C.version) + '</p>' +
          '<p>Fotografii: martor anonim, decembrie 1989</p>' +
          '<p>Vocea: generată cu inteligență artificială, în Vyond.</p></div>' +
          '<button class="btn btn--primary cr-exit" id="b55">' + I('exit') + 'Ieși din atelier</button></div>';
      },
      init: function (r) { on(r, '#b55', window.P.exit); on(r, '#b55r', function () { window.P.go('5.6'); }); },
      prev: function () { return '5.4'; }
    },
    {
      // În afara drumului cursului (nu intră în progres): se deschide din 5.5 sau din Cuprins.
      id: '5.6', key: '5-6', title: 'Rezultatele atelierului ' + C.rezultate.an, layout: 'paper', hideNext: true,
      html: function () {
        return '<div class="rz"><h1 class="h1 rz-h1">Rezultatele atelierului ' + e(C.rezultate.an) + '</h1>' +
          '<p class="lead rz-lead">Lucrările elevilor din atelierul de scriere „Martorul anonim”. Alege o poveste ca s-o citești sau o fotografie ca s-o mărești.</p>' +
          '<div class="rz-body" id="rzBody" aria-busy="true"><p class="lead rz-wait">Se încarcă lucrările…</p></div></div>';
      },
      init: function (r) { RZ.load(function () { RZ.render(r); }); },
      prev: function () { return '5.5'; }
    }
  ];
})();
