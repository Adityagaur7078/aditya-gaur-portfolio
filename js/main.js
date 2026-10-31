(function () {
  var $ = function (s, c) { return (c || document).querySelector(s) }, $$ = function (s, c) { return [].slice.call((c || document).querySelectorAll(s)) };
  var html = document.documentElement, btn = $('#rm'), ld = $('#ld'), ctx = null, first = true;
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  try { var sv = localStorage.getItem('rm'); if (sv !== null) reduce = sv === '1' } catch (e) { }
  var fine = matchMedia('(pointer:fine)').matches, sT = 0;
  $$('.big').forEach(function (h) { var t = h.textContent; h.setAttribute('aria-label', t); h.textContent = ''; t.split(' ').forEach(function (w, i, a) { var o = document.createElement('span'); o.className = 'w'; o.setAttribute('aria-hidden', 'true'); var s = document.createElement('span'); s.textContent = w; o.appendChild(s); h.appendChild(o); if (i < a.length - 1) h.appendChild(document.createTextNode(' ')) }) });
  $$('[data-split]').forEach(function (el) { var t = el.textContent; el.textContent = ''; t.split('').forEach(function (ch) { var s = document.createElement('span'); s.className = 'c'; s.textContent = ch === ' ' ? '\u00a0' : ch; el.appendChild(s) }) });
  function hideLd() { ld.style.display = 'none' } setTimeout(hideLd, 9000);

  /* ================= CINEMATIC BACKGROUND: dot field + light + sand trail ================= */
  var bc = $('#bgc'), bx = bc && bc.getContext && bc.getContext('2d'), bgOk = !!bx, bgRaf = 0, bgLast = 0, BW = 0, BH = 0, bdpr = 1, SPC = 32, GP = [], SP = [], mp = { x: -999, y: -999, sx: -999, sy: -999, act: 0, seen: 0, ex: 0, ey: 0 };
  var LV = ['#22222a', '#3a3a44', '#55555f', '#7a7a86', '#a6a6b0', '#d8d8de'], SC = ['#ffffff', '#c4c4cc', '#8a8a94'];
  function bgSize() {
    if (!bgOk) return; bdpr = Math.min(devicePixelRatio || 1, 1.5); BW = innerWidth; BH = innerHeight; bc.width = Math.round(BW * bdpr); bc.height = Math.round(BH * bdpr);
    SPC = BW < 700 ? 34 : 30; GP = []; for (var y = SPC / 2; y < BH + SPC; y += SPC)for (var x = SPC / 2; x < BW + SPC; x += SPC)GP.push(x, y); bgDraw(performance.now());
  }
  function glow(x, y, r, c0) { var g = bx.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, c0); g.addColorStop(1, 'rgba(0,0,0,0)'); bx.fillStyle = g; bx.fillRect(x - r, y - r, r * 2, r * 2) }
  function bgDraw(t) {
    if (!bgOk) return; var x = bx, i, s = sT;
    x.setTransform(bdpr, 0, 0, bdpr, 0, 0); x.fillStyle = '#030304'; x.fillRect(0, 0, BW, BH);
    glow(BW * (.18 + .64 * s) + Math.sin(t * .0003) * BW * .05, BH * .12 + Math.cos(t * .00025) * BH * .04, BW * .6, 'rgba(255,255,255,0.064)'); glow(BW * (.92 - .55 * s) + Math.cos(t * .00028) * BW * .05, BH * .98 + Math.sin(t * .00022) * BH * .03, BW * .55, 'rgba(255,255,255,0.048)');
    if (!reduce) { mp.sx += (mp.x - mp.sx) * .2; mp.sy += (mp.y - mp.sy) * .2 }
    var on = !reduce && mp.x > -900, R = Math.min(230, BW * .3), R2 = R * R;
    if (on) { glow(mp.sx, mp.sy, R * 1.5, 'rgba(255,255,255,0.052)') }
    var P = [new Path2D(), new Path2D(), new Path2D(), new Path2D(), new Path2D(), new Path2D()];
    for (i = 0; i < GP.length; i += 2) {
      var px0 = GP[i], py0 = GP[i + 1], dx = px0 - mp.sx, dy = py0 - mp.sy, f = 0, ox = 0, oy = 0;
      if (on) { var d2 = dx * dx + dy * dy; if (d2 < R2) { var d = Math.sqrt(d2) || 1; f = 1 - d / R; f *= f; ox = dx / d * f * 16; oy = dy / d * f * 16 } }
      var w = reduce ? 0 : .5 + .5 * Math.sin(px0 * .011 + py0 * .008 + t * .0007), r = .75 + .28 * w + f * 2.7, lv = f < .02 ? 0 : Math.min(5, 1 + Math.floor(f * 5.2));
      if (lv === 0 && w > .82) lv = 1;
      var X = px0 + ox, Y = py0 + oy; P[lv].moveTo(X + r, Y); P[lv].arc(X, Y, r, 0, 6.283);
    }
    for (i = 0; i < 6; i++) { x.fillStyle = LV[i]; x.fill(P[i]) }
    // sand trail
    var dt = Math.min(.05, (t - bgLast) / 1000 || .016);
    for (i = SP.length - 1; i >= 0; i--) { var p = SP[i]; p.l -= dt; if (p.l <= 0) { SP.splice(i, 1); continue } p.vx *= .965; p.vy = p.vy * .965 + .02; p.x += p.vx; p.y += p.vy; x.globalAlpha = Math.min(1, p.l / p.m * 1.4); x.fillStyle = p.c; x.beginPath(); x.arc(p.x, p.y, p.r, 0, 6.283); x.fill() }
    x.globalAlpha = 1;
  }
  function emit(n, vx, vy) { for (var k = 0; k < n && SP.length < 260; k++) { var a = Math.random() * 6.283, sp = Math.random() * 1.6; SP.push({ x: mp.x + (Math.random() - .5) * 8, y: mp.y + (Math.random() - .5) * 8, vx: vx * .12 + Math.cos(a) * sp, vy: vy * .12 + Math.sin(a) * sp - .3, l: 0, m: 0, r: .7 + Math.random() * 1.5, c: SC[Math.random() * 3 | 0] }); var p = SP[SP.length - 1]; p.m = p.l = .8 + Math.random() * 1.1 } }
  function bgLoop(t) {
    bgRaf = requestAnimationFrame(bgLoop);
    var busy = SP.length > 0 || mp.x > -900; if (!busy && t - bgLast < 50) return;
    bgDraw(t); bgLast = t;
  }
  function startBg() { if (bgOk && !reduce && !bgRaf) bgRaf = requestAnimationFrame(bgLoop) }
  function stopBg() { if (bgRaf) { cancelAnimationFrame(bgRaf); bgRaf = 0 } }
  document.addEventListener('pointerdown', function (e) {
    if (reduce || !bgOk) return;
    mp.x = e.clientX; mp.y = e.clientY; mp.sx = mp.x; mp.sy = mp.y; mp.seen = 1; emit(6, 0, -1);
  });
  ['pointerup', 'pointercancel'].forEach(function (ev) { document.addEventListener(ev, function () { mp.x = mp.y = -999 }) });
  document.addEventListener('pointermove', function (e) {
    if (reduce || !bgOk || e.pointerType === 'touch') return;
    var vx = e.clientX - mp.x, vy = e.clientY - mp.y; if (!mp.seen) { mp.sx = e.clientX; mp.sy = e.clientY; mp.seen = 1; vx = vy = 0 }
    mp.x = e.clientX; mp.y = e.clientY; var sp = Math.hypot(vx, vy); if (sp > 2) emit(Math.min(5, 1 + (sp / 9 | 0)), vx, vy);
  }, { passive: true });
  document.addEventListener('pointerout', function (e) { if (!e.relatedTarget) { mp.x = mp.y = -999 } });
  if (bgOk) bgSize();

  /* ================= DOT PORTRAIT ================= */
  var cv = $('#dots'), cx = cv && cv.getContext && cv.getContext('2d'), S0 = { a: 1, p: 0 }, PD = PD = window.PORTRAIT_DOTS, GD = null, ready = false, W = 0, H = 0, dpr = 1, px = -9999, py = -9999, loop = 0, N = 0, settle = 0, idleDrawn = false, ft = 16, lite = false, cache = null;
  var COL = ['#6b6b6b', '#939393', '#bdbdbd', '#e2e2e2', '#ffffff', '#bdbdbd', '#939393', '#e2e2e2'], HX, HY, NX, RR, RA, RC, SG, SX, SY, OX, OY, VX, VY, BK, CC, XS, YS, RS, CS;
  function ease(x) { return x * x * (3 - 2 * x) }
  function layout() {
    if (!ready || !cx) return; var hero = $('.hero'), pt = $('.pt'); if (!hero.offsetWidth) return;
    W = hero.clientWidth; H = hero.clientHeight; dpr = Math.min(devicePixelRatio || 1, 1.5); cv.width = W * dpr; cv.height = H * dpr;
    var sz = pt.offsetWidth, ox = pt.offsetLeft + sz / 2, oy = pt.offsetTop + sz / 2, gw = PD.w, gh = PD.h, cs = sz / Math.max(gw, gh), st = Math.max(1, Math.round((W < 700 ? 3.5 : 3) / cs)), L = [], x, y;
    for (y = 0; y < gh; y += st)for (x = 0; x < gw; x += st) { var v = GD[y * gw + x]; if (v) L.push([x, y, v]) }
    N = L.length; HX = new Float32Array(N); HY = new Float32Array(N); NX = new Float32Array(N); RR = new Float32Array(N); RA = new Float32Array(N); RC = new Float32Array(N); SG = new Float32Array(N); SX = new Float32Array(N); SY = new Float32Array(N); OX = new Float32Array(N); OY = new Float32Array(N); VX = new Float32Array(N); VY = new Float32Array(N); BK = new Uint8Array(N); CC = new Uint8Array(N); XS = new Float32Array(N); YS = new Float32Array(N); RS = new Float32Array(N); CS = new Uint8Array(N);
    for (var i = 0; i < N; i++) { var c = L[i], K = (c[2] - 10) / 245; HX[i] = ox + (c[0] - gw / 2) * cs; HY[i] = oy + (c[1] - gh / 2) * cs; NX[i] = c[0] / gw; RR[i] = cs * st * .5 * (.34 + .78 * K); RA[i] = Math.random(); RC[i] = Math.random(); SG[i] = c[0] < gw / 2 ? -1 : 1; SX[i] = (Math.random() - .5) * W; SY[i] = (Math.random() - .5) * H; BK[i] = K < .3 ? 0 : K < .5 ? 1 : K < .68 ? 2 : K < .84 ? 3 : 4; var r = RC[i]; CC[i] = r < .5 ? 5 : r < .85 ? 6 : 7 }
    hero.classList.add('ok'); buildCache(); idleDrawn = false;
  }
  function buildCache() {
    cache = document.createElement('canvas'); cache.width = cv.width; cache.height = cv.height; var c = cache.getContext('2d'); c.setTransform(dpr, 0, 0, dpr, 0, 0);
    for (var b = 0; b < 5; b++) { c.fillStyle = COL[b]; c.beginPath(); for (var i = 0; i < N; i++) { if (BK[i] !== b) continue; var r = RR[i]; c.moveTo(HX[i] + r, HY[i]); c.arc(HX[i], HY[i], r, 0, 6.283) } c.fill() }
  }
  function drawDyn(t, live) {
    var a = S0.a, p = S0.p, fa = 1 - a, fa2 = fa * fa, sa = Math.sqrt(a), R = Math.max(70, Math.min(130, W * .09)), R2 = R * R, step = lite ? 2 : 1, rs = lite ? 1.35 : 1, maxOff = 0, i, c;
    cx.setTransform(dpr, 0, 0, dpr, 0, 0); cx.clearRect(0, 0, W, H); if (p >= .999) return 0;
    for (i = 0; i < N; i += step) {
      var q = Math.min(1, Math.max(0, p * 1.9 - (NX[i] * .7 + RA[i] * .2))); q = ease(q);
      var x = HX[i] + SX[i] * fa2, y = HY[i] + SY[i] * fa2;
      if (q > 0) { x += SG[i] * q * q * W * (.22 + RC[i] * .8) + Math.sin(t * .0012 + RA[i] * 6.28 + q * 5) * q * 44; y += q * H * (.08 + RA[i] * .45) + q * q * H * .3 + Math.cos(t * .0014 + RC[i] * 6.28) * q * 32 }
      if (live || settle > 0) {
        var dx = x + OX[i] - px, dy = y + OY[i] - py, d2 = dx * dx + dy * dy;
        if (live && d2 < R2 && d2 > 1) { var d = Math.sqrt(d2), f = (1 - d / R) * 2.4; VX[i] += dx / d * f; VY[i] += dy / d * f }
        VX[i] -= OX[i] * .06; VY[i] -= OY[i] * .06; VX[i] *= .86; VY[i] *= .86; OX[i] += VX[i]; OY[i] += VY[i]; x += OX[i]; y += OY[i];
        var mo = Math.abs(OX[i]) + Math.abs(OY[i]) + Math.abs(VX[i]) + Math.abs(VY[i]); if (mo > maxOff) maxOff = mo;
      }
      var r = RR[i] * rs * sa * (1 - ease(Math.min(1, Math.max(0, (q - .55) / .45))));
      XS[i] = x; YS[i] = y; RS[i] = r; CS[i] = BK[i];
    }
    for (c = 0; c < 8; c++) { cx.fillStyle = COL[c]; cx.beginPath(); for (i = 0; i < N; i += step) { if (CS[i] !== c || RS[i] < .25) continue; cx.moveTo(XS[i] + RS[i], YS[i]); cx.arc(XS[i], YS[i], RS[i], 0, 6.283) } cx.fill() }
    return maxOff;
  }
  function inBox() { var pt = $('.pt'), m = 90; return px > pt.offsetLeft - m && px < pt.offsetLeft + pt.offsetWidth + m && py > pt.offsetTop - m && py < pt.offsetTop + pt.offsetHeight + m }
  function draw(t, live) {
    if (!ready || !cx) return;
    var moving = S0.a < .999 || S0.p > .0005 || (live && inBox()) || settle > 0;
    if (!moving) { if (!idleDrawn) { cx.setTransform(1, 0, 0, 1, 0, 0); cx.clearRect(0, 0, cv.width, cv.height); cx.drawImage(cache, 0, 0); idleDrawn = true } return }
    idleDrawn = false; var t0 = performance.now(), mo = drawDyn(t, live && inBox());
    if (live && inBox()) settle = 60; else if (settle > 0 && mo < .15) settle = 0; else if (settle > 0) settle--;
    var dtm = performance.now() - t0; ft += (dtm - ft) * .1; if (ft > 14 && !lite) lite = true; else if (ft < 6 && lite) lite = false;
  }
  function frame(t) { loop = requestAnimationFrame(frame); draw(t, px > -9000) }
  function stopLoop() { if (loop) { cancelAnimationFrame(loop); loop = 0 } }
  function drawStatic() { S0.a = 1; S0.p = 0; idleDrawn = false; settle = 0; draw(0, false) }
  (function () { if (!cx) return; try { var s = atob(PD.d), u = new Uint8Array(s.length); for (var i = 0; i < s.length; i++)u[i] = s.charCodeAt(i); GD = u } catch (e) { return } ready = true; layout(); drawStatic() })();
  var rsT; addEventListener('load', function () { layout(); if (!loop) drawStatic() });
  addEventListener('resize', function () { clearTimeout(rsT); rsT = setTimeout(function () { layout(); if (!loop) drawStatic(); bgSize(); moveInd() }, 150) });

  /* ================= LOADER: dots assemble the AG monogram, then burst ================= */
  function runLoader(done) {
    var c = $('#ldc'); if (!c || !c.getContext) { done(); return }
    var x = c.getContext('2d'), w = c.width = innerWidth, h = c.height = innerHeight, fs = Math.min(w * .46, h * .42, 400), off = document.createElement('canvas');
    off.width = Math.ceil(fs * 1.75); off.height = Math.ceil(fs * 1.05); var o = off.getContext('2d');
    o.fillStyle = '#fff'; o.font = '700 ' + fs + 'px "Space Grotesk",system-ui,sans-serif'; o.textAlign = 'center'; o.textBaseline = 'middle'; o.fillText('AG', off.width / 2, off.height / 2 + fs * .04);
    var d = o.getImageData(0, 0, off.width, off.height).data, st = Math.max(4, Math.round(fs / 50)), P = [], ox = (w - off.width) / 2, oy = (h - off.height) / 2, mx = w / 2, my = h / 2;
    for (var y = 0; y < off.height; y += st)for (var xx = 0; xx < off.width; xx += st) { if (d[(y * off.width + xx) * 4 + 3] > 140) { var a = Math.random() * 6.283, R = Math.max(w, h) * (.55 + Math.random() * .5); P.push({ tx: ox + xx, ty: oy + y, sx: mx + Math.cos(a) * R, sy: my + Math.sin(a) * R, dl: Math.random() * .6, r: 1.1 + Math.random() * 1.4, sw: (Math.random() - .5) * 2, bd: Math.random() }) } }
    var TC = 1.75, TB = 2.3, TE = 3.1, t0 = performance.now(), fired = false, raf = 0;
    function ez(v) { v = Math.min(1, Math.max(0, v)); return 1 - Math.pow(1 - v, 3) }
    function fire() { if (!fired) { fired = true; done() } }
    function frame(now) {
      var t = (now - t0) / 1000; x.clearRect(0, 0, w, h);
      var ba = t > TB ? Math.max(0, 1 - (t - TB) / (TE - TB)) : 1; x.globalAlpha = ba; x.fillStyle = '#fff';
      for (var i = 0; i < P.length; i++) {
        var p = P[i], e = ez((t - p.dl) / (TC - .6)), jx = e < 1 ? Math.sin(t * 3 + p.bd * 9) * (1 - e) * 34 * p.sw : Math.sin(t * 5 + p.bd * 20) * .7, jy = e < 1 ? Math.cos(t * 2.6 + p.bd * 7) * (1 - e) * 34 * p.sw : Math.cos(t * 4 + p.bd * 18) * .7;
        var px = p.sx + (p.tx - p.sx) * e + jx, py = p.sy + (p.ty - p.sy) * e + jy;
        if (t > TB) { var bb = (t - TB) / (TE - TB); bb *= bb; px += (p.tx - mx) * bb * 3.4 + p.sw * 70 * bb; py += (p.ty - my) * bb * 3.4 + (p.bd - .5) * 140 * bb }
        x.fillRect(px, py, p.r * 1.5, p.r * 1.5)
      }
      if (t >= TB - .15) fire();
      if (t < TE) raf = requestAnimationFrame(frame); else { c.style.display = 'none' }
    }
    raf = requestAnimationFrame(frame);
    $('#ld').addEventListener('click', function () { t0 = Math.min(t0, performance.now() - TB * 1000) }, { once: true });
    setTimeout(fire, 5200);
  }

  /* ================= SHARED EFFECTS ================= */
  function pointerFx(withHero) {
    if (!fine) return function () { };
    var hd = $('.hero'), off = [];
    var spt = function (e) { var c = e.target.closest && e.target.closest('.sg div'); if (c) { var r = c.getBoundingClientRect(); c.style.setProperty('--x', (e.clientX - r.left) + 'px'); c.style.setProperty('--y', (e.clientY - r.top) + 'px') } };
    document.addEventListener('pointermove', spt); off.push(function () { document.removeEventListener('pointermove', spt) });
    return function () { off.forEach(function (f) { f() }) };
  }
  function footFx() {
    gsap.from('.wm .c', { yPercent: 112, duration: 1.2, stagger: .045, ease: 'power4.out', scrollTrigger: { trigger: 'footer', start: 'top 88%' } });
    gsap.fromTo('.wm', { y: -70 }, { y: 0, ease: 'none', scrollTrigger: { trigger: 'footer', start: 'top bottom', end: 'bottom bottom', scrub: true } });
  }
  function reveal(root) {
    var els = $$('[data-rv]', root); gsap.set(els, { opacity: 0, y: 50 });
    $$('.sv li,.ap li', root).forEach(function (el, i) { gsap.set(el, { x: i % 2 ? 60 : -60, y: 0 }) });
    ScrollTrigger.batch(els, { start: 'top 90%', onEnter: function (b) { gsap.to(b, { opacity: 1, x: 0, y: 0, duration: .9, stagger: .12, ease: 'power3.out', overwrite: true }) } });
  }

  /* ================= HERO: letters and sand follow the scroll position directly ================= */
  var heroL = -1, heroF = -1;
  function heroScroll() {
    if (!$('.scene').classList.contains('pin')) return;
    var e = Math.min(1, Math.max(0, scrollY / (innerHeight * 1.7))) * 3;
    var L = Math.min(1, e / 1.8), lp = L * L, F = Math.min(1, e / .9);
    if (lp > 0 || heroL > 0) {
      $$('.hn .l:first-child .c').forEach(function (c, i) { c.style.transform = lp > 0 ? 'translateX(' + (-innerWidth * (.55 + i * .1) * lp) + 'px)' : '' });
      $$('.hn .l:last-child .c').forEach(function (c, i) { c.style.transform = lp > 0 ? 'translateX(' + (innerWidth * (.55 + i * .1) * lp) + 'px)' : '' });
    }
    if (F > 0 || heroF > 0) {
      ['.hc', '.sc'].forEach(function (sel) { var el = $(sel); el.style.opacity = F > 0 ? 1 - F : ''; el.style.transform = F > 0 ? 'translateY(' + (-50 * F) + 'px)' : '' });
    }
    heroL = lp; heroF = F;
    S0.p = Math.min(1, Math.max(0, (e - .2) / 2.8));
  }
  function resetHero() {
    $$('.hn .c').forEach(function (c) { c.style.transform = '' });
    ['.hc', '.sc'].forEach(function (sel) { var el = $(sel); if (el) { el.style.opacity = ''; el.style.transform = '' } });
    heroL = -1; heroF = -1;
  }

  /* ================= HOME CHOREOGRAPHY ================= */
  function build() {
    if (reduce || !window.gsap || !window.ScrollTrigger) { hideLd(); return }
    gsap.registerPlugin(ScrollTrigger);
    var S = $('.scene'), V = views.home;
    ctx = gsap.context(function () {
      var mob = innerWidth <= 700; S.classList.add('pin'); layout();
      var tl = gsap.timeline({ defaults: { ease: 'power4.out' }, paused: first });
      if (first) { ld.style.display = 'block'; tl.to('#ld .lt', { opacity: 0, duration: .3 }).to('#ld .lh.t', { yPercent: -100, duration: 1.15, ease: 'power4.inOut' }, '<').to('#ld .lh.b', { yPercent: 100, duration: 1.15, ease: 'power4.inOut', onComplete: hideLd }, '<') }
      tl.from('.hn .c', { yPercent: 115, duration: 1.1, stagger: .06 }, first ? '-=.5' : 0)
        .fromTo(S0, { a: 0 }, { a: 1, duration: 2.8, ease: 'power3.out' }, '<.1')
        .from('.tl span,.cta .btn,.sc > *', { opacity: 0, y: 20, stagger: .1, duration: .7 }, '-=1.8');
      if (!first) tl.progress(1);
      if (first) { first = false; runLoader(function () { tl.play() }) }
      ScrollTrigger.create({ trigger: S, start: 'top top', end: mob ? '+=120%' : '+=170%', pin: true, invalidateOnRefresh: true, onUpdate: heroScroll, onRefresh: heroScroll });
      heroScroll();
      $$('.big', V).forEach(function (hd) { gsap.from($$('.w>span', hd), { yPercent: 115, duration: 1, stagger: .08, ease: 'power4.out', scrollTrigger: { trigger: hd, start: 'top 88%' } }) });
      $$('section.s', V).forEach(function (s) { gsap.fromTo(s, { '--ln': 0 }, { '--ln': 1, ease: 'none', scrollTrigger: { trigger: s, start: 'top 92%', end: 'top 50%', scrub: true } }) });
      reveal(V);
      $$('.wk', V).forEach(function (p) {
        var fr = $('.frame', p), inf = $$('.info > *', p);
        gsap.timeline({ scrollTrigger: { trigger: p, start: 'top 74%' }, defaults: { ease: 'power3.out' } }).from(fr, { clipPath: 'inset(100% 0 0 0)', duration: 1.1, ease: 'power3.inOut' }).from(inf, { opacity: 0, y: 24, stagger: .07, duration: .7 }, '-=.6');
      });
      $$('.band div', V).forEach(function (r) { var dd = +r.dataset.b; gsap.fromTo(r, { x: dd < 0 ? 0 : -innerWidth * .5 }, { x: dd < 0 ? -innerWidth * .5 : 0, ease: 'none', scrollTrigger: { trigger: r.parentNode, start: 'top bottom', end: 'bottom top', scrub: .6 } }) });
      gsap.fromTo('.rp', { rotation: innerWidth > 900 ? 7 : 0, y: 50 }, { rotation: innerWidth > 900 ? 1.5 : 0, y: 0, ease: 'none', scrollTrigger: { trigger: '.rp', start: 'top 95%', end: 'top 40%', scrub: true } });
      footFx();
      return pointerFx(true);
    });
    if (cx && !loop) loop = requestAnimationFrame(frame);
  }

  /* ================= CASE-STUDY CHOREOGRAPHY ================= */
  function buildCase() {
    if (reduce || !window.gsap || !window.ScrollTrigger) return;
    gsap.registerPlugin(ScrollTrigger); var V = views[view];
    ctx = gsap.context(function () {
      gsap.from($$('.ct .c', V), { yPercent: 115, duration: .7, stagger: .03, ease: 'power4.out' });
      gsap.set($$('[data-rv]', V), { opacity: 1, y: 0, x: 0 });
      $$('.cb>h2', V).forEach(function (h) { gsap.from(h, { opacity: 0, x: -20, duration: .6, ease: 'power2.out', scrollTrigger: { trigger: h, start: 'top 92%' } }) });
      footFx();
      return pointerFx(false);
    });
  }
  function teardown() {
    stopLoop(); px = py = -9999;
    if (window.gsap) { gsap.set('.hn .c,.hc,.hr,.sc,.tl span,.cta .btn', { clearProps: 'all' }) }
    resetHero();
    if (ctx) { ctx.revert(); ctx = null }
    $('.scene').classList.remove('pin'); hideLd();
    if (ready) { layout(); drawStatic() }
  }
  function paint() { teardown(); if (view === 'home') build(); else buildCase() }
  function setRM(v, save) {
    reduce = v; html.classList.toggle('rm', v); if (btn) btn.setAttribute('aria-pressed', String(v));
    if (save) { try { localStorage.setItem('rm', v ? '1' : '0') } catch (e) { } }
    paint();
    if (bgOk) { stopBg(); SP.length = 0; bgDraw(performance.now()); if (!reduce) startBg() }
  }
  if (btn) btn.addEventListener('click', function () { setRM(!reduce, true) });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { window.ScrollTrigger && ScrollTrigger.refresh(); moveInd() });

  /* ================= NAVBAR, PROGRESS, MENU ================= */
  var hdr = $('#hd'), bar = $('#bar'), cnt = $('#cnt'), tk = 0;
  function prog() { tk = 0; var h = html.scrollHeight - innerHeight, p = h > 0 ? Math.min(1, scrollY / h) : 0; sT = p; bar.style.transform = 'scaleX(' + p + ')'; cnt.textContent = 'Scroll ' + ('0' + Math.round(p * 100)).slice(-2) + ' / 100'; hdr.classList.toggle('hs', scrollY > 40) }
  addEventListener('scroll', function () { if (!tk) tk = requestAnimationFrame(prog) }, { passive: true }); prog();
  var pill = $('.pill'), ind = $('.ind'), plinks = $$('a', pill), curA = null;
  function moveInd() { }

  var links = $$('.pill a,#menu a.l');
  function setCur(id) { links.forEach(function (a) { var on = a.getAttribute('href') === '#' + id; on ? a.setAttribute('aria-current', 'true') : a.removeAttribute('aria-current'); if (on && a.parentNode === pill) curA = a }); moveInd() }
  var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting && view === 'home') setCur(e.target.id) }) }, { rootMargin: '-45% 0px -50% 0px' });
  $$('#main section[id]').forEach(function (s) { io.observe(s) });
  var menu = $('#menu'), mb = $('#mb');
  function openM() { menu.removeAttribute('inert'); menu.classList.add('open'); mb.setAttribute('aria-expanded', 'true'); mb.textContent = 'Close'; document.body.style.overflow = 'hidden'; setTimeout(function () { $('a', menu).focus() }, 80) }
  function closeM(f) { menu.classList.remove('open'); menu.setAttribute('inert', ''); mb.setAttribute('aria-expanded', 'false'); mb.textContent = 'Menu'; document.body.style.overflow = ''; if (f !== false) mb.focus() }
  mb.addEventListener('click', function () { menu.classList.contains('open') ? closeM() : openM() });
  $$('a', menu).forEach(function (a) { a.addEventListener('click', function () { closeM(false) }) });
  document.addEventListener('keydown', function (e) {
    if (!menu.classList.contains('open')) return;
    if (e.key === 'Escape') { closeM(); return }
    if (e.key === 'Tab') {
      var f = $$('a', menu).concat([mb]), i = f.indexOf(document.activeElement);
      if (e.shiftKey && i <= 0) { e.preventDefault(); f[f.length - 1].focus() } else if (!e.shiftKey && i === f.length - 1) { e.preventDefault(); f[0].focus() }
    }
  });
  addEventListener('resize', function () { if (innerWidth > 1199 && menu.classList.contains('open')) closeM(false) });
  function clock() { try { $('#tm').textContent = new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit' }).format(new Date()) } catch (e) { } } clock(); setInterval(clock, 30000);

  /* ================= SMOOTH SCROLL: eased wheel movement on desktop ================= */
  var sm = { target: 0, cur: 0, run: 0 };
  function smoothLoop() {
    sm.cur += (sm.target - sm.cur) * .1;
    if (Math.abs(sm.target - sm.cur) < .5) { sm.cur = sm.target; sm.run = 0; window.scrollTo({ top: sm.cur, behavior: 'instant' }); return }
    window.scrollTo({ top: sm.cur, behavior: 'instant' });
    sm.run = requestAnimationFrame(smoothLoop);
  }
  addEventListener('wheel', function (e) {
    if (!fine || reduce || html.classList.contains('rm') || e.ctrlKey || e.deltaMode !== 0) return;
    if (e.target.closest && e.target.closest('#menu,dialog,.tk,iframe,textarea,input,select')) return;
    e.preventDefault();
    var max = html.scrollHeight - innerHeight;
    if (!sm.run) { sm.cur = scrollY; sm.target = scrollY }
    sm.target = Math.max(0, Math.min(max, sm.target + e.deltaY));
    if (!sm.run) sm.run = requestAnimationFrame(smoothLoop);
  }, { passive: false });
  ['keydown', 'touchstart', 'mousedown'].forEach(function (ev) { addEventListener(ev, function () { if (sm.run) { cancelAnimationFrame(sm.run); sm.run = 0 } sm.target = sm.cur = scrollY }, { passive: true }) });

  /* ================= TOP LINKS: logo, Home and Back to top always go to the very top ================= */
  function toTop() {
    history.replaceState(null, '', location.pathname + location.search);
    if (view !== 'home') { go('home'); return }
    window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
    if (menu.classList.contains('open')) closeM(false);
  }
  $$('a[href="#home"]').forEach(function (a) { a.addEventListener('click', function (e) { e.preventDefault(); toTop() }) });

  /* ================= ROUTES: home + two case-study pages (#work-gati, #work-biteloop) ================= */
  var views = { 'home': $('#main') }, view = 'home';
  var TITLES = { 'home': 'Aditya Gaur — Full-Stack Developer', 'work-gati': 'GATI case study — Aditya Gaur', 'work-biteloop': 'BiteLoop case study — Aditya Gaur' };
  function wantView() { var h = location.hash.slice(1); return views[h] ? h : null }
  function jump(y) { html.style.scrollBehavior = 'auto'; scrollTo(0, y); html.style.scrollBehavior = '' }
  function applyView(v, anchor) {
    teardown(); view = v;
    Object.keys(views).forEach(function (k) { views[k].hidden = (k !== v) });
    html.setAttribute('data-view', v); document.title = TITLES[v]; jump(0);
    if (v === 'home') { build(); var el = anchor && document.getElementById(anchor); if (window.ScrollTrigger) ScrollTrigger.refresh(); if (el) jump(el.getBoundingClientRect().top + scrollY - 82) }
    else { buildCase(); setCur('projects') }
    if (bgOk && reduce) bgDraw(performance.now());
  }
  var wipe = $('#wipe');
  function go(v, anchor) {
    if (reduce || !wipe.animate) { applyView(v, anchor); return }
    var e = 'cubic-bezier(.76,0,.24,1)', a = wipe.animate([{ transform: 'translateY(100%)' }, { transform: 'translateY(0)' }], { duration: 200, easing: e, fill: 'forwards' });
    a.onfinish = function () { applyView(v, anchor); var b = wipe.animate([{ transform: 'translateY(0)' }, { transform: 'translateY(-100%)' }], { duration: 260, easing: e, fill: 'forwards' }); b.onfinish = function () { wipe.getAnimations().forEach(function (x) { x.cancel() }) } };
  }
  addEventListener('hashchange', function () { var v = wantView(), h = location.hash.slice(1); if (v) { if (v !== view) go(v) } else if (view !== 'home') go('home', h) });

  /* ================= RESUME: view + download ================= */
  var RESUME_URL = "assets/resume/Aditya-Gaur-Resume.pdf";
  function resumeHref() {
    if (typeof RB !== 'undefined' && RB) { var bin = atob(RB), u = new Uint8Array(bin.length); for (var i = 0; i < bin.length; i++)u[i] = bin.charCodeAt(i); return URL.createObjectURL(new Blob([u], { type: 'application/pdf' })) }
    return RESUME_URL;
  }
  $('#resume-pdf').src = resumeHref() + '#toolbar=1&navpanes=0';
  $$('.dlb').forEach(function (bt) {
    bt.addEventListener('click', function () {
      var msg = bt.closest('section,dialog').querySelector('.dlm'); msg.textContent = '';
      try { var a = document.createElement('a'); a.href = RESUME_URL; a.download = 'Aditya-Gaur-Resume.pdf'; document.body.appendChild(a); a.click(); a.remove(); msg.textContent = 'Resume download started.' }
      catch (e) { msg.textContent = 'Download is unavailable here. Email me and I will send it.' }
    })
  });

  /* FRESH START: a page refresh always opens at the top */
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  (function () {
    if (location.hash) history.replaceState(null, '', location.pathname + location.search);
    function resetScroll() {
      window.scrollTo(0, 0);
      requestAnimationFrame(function () { window.scrollTo(0, 0) });
    }
    resetScroll();
    addEventListener('load', resetScroll);
    addEventListener('pageshow', resetScroll);
  })();

  /* ================= START ================= */
  (function () {
    var v0 = wantView(); if (v0) { view = v0; Object.keys(views).forEach(function (k) { views[k].hidden = (k !== v0) }); html.setAttribute('data-view', v0); document.title = TITLES[v0]; first = false }
    setRM(reduce, false); if (v0) setCur('projects')
  })();
})();
