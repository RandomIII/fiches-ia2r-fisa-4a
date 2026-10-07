/*
 * Petits graphes de signaux en SVG : courbes, impulsions de Dirac (flèches),
 * suites à temps discret (bâtons), points (pôles/zéros).
 * Les fiches décrivent les données ; les échelles et les axes sont calculés ici.
 */
(function () {
  const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const r2 = v => Math.round(v * 100) / 100;

  window.plot = function (o) {
    const W = o.w || 360, H = o.h || 170;
    const ml = 30, mr = 18, mt = 16, mb = 24;
    const [x0, x1] = o.x;
    let [y0, y1] = o.y;
    // equal : même échelle sur les deux axes (sinon le cercle unité devient une ellipse)
    if (o.equal) {
      const half = (x1 - x0) * (H - mt - mb) / (W - ml - mr) / 2, mid = (y0 + y1) / 2;
      y0 = mid - half; y1 = mid + half;
    }
    const X = v => ml + (v - x0) / (x1 - x0) * (W - ml - mr);
    const Y = v => H - mb - (v - y0) / (y1 - y0) * (H - mt - mb);
    const ax = Math.min(Math.max(0, y0), y1), ay = Math.min(Math.max(0, x0), x1);
    let s = '';

    // Axes avec flèches
    s += `<line class="p-axis" x1="${X(x0)}" y1="${Y(ax)}" x2="${X(x1) + 8}" y2="${Y(ax)}"/>`;
    s += `<polygon class="p-axhead" points="${X(x1) + 12},${Y(ax)} ${X(x1) + 5},${Y(ax) - 3.5} ${X(x1) + 5},${Y(ax) + 3.5}"/>`;
    s += `<line class="p-axis" x1="${X(ay)}" y1="${Y(y0)}" x2="${X(ay)}" y2="${Y(y1) - 8}"/>`;
    s += `<polygon class="p-axhead" points="${X(ay)},${Y(y1) - 12} ${X(ay) - 3.5},${Y(y1) - 5} ${X(ay) + 3.5},${Y(y1) - 5}"/>`;
    if (o.xl) s += `<text class="p-lbl" x="${X(x1) + 12}" y="${Y(ax) - 6}" text-anchor="end">${esc(o.xl)}</text>`;
    if (o.yl) s += `<text class="p-lbl" x="${X(ay) + 6}" y="${Y(y1) - 3}">${esc(o.yl)}</text>`;

    (o.xt || []).forEach(t => {
      const [v, l] = Array.isArray(t) ? t : [t, String(t)];
      s += `<line class="p-tick" x1="${X(v)}" y1="${Y(ax) - 3}" x2="${X(v)}" y2="${Y(ax) + 3}"/>`;
      s += `<text class="p-tl" x="${X(v)}" y="${Y(ax) + 14}" text-anchor="middle">${esc(l)}</text>`;
    });
    (o.yt || []).forEach(t => {
      const [v, l] = Array.isArray(t) ? t : [t, String(t)];
      s += `<line class="p-tick" x1="${X(ay) - 3}" y1="${Y(v)}" x2="${X(ay) + 3}" y2="${Y(v)}"/>`;
      s += `<text class="p-tl" x="${X(ay) - 5}" y="${Y(v) + 4}" text-anchor="end">${esc(l)}</text>`;
    });

    // Repères pointillés (ex. fe/2, cercle unité...)
    (o.vlines || []).forEach(v => {
      s += `<line class="p-guide" x1="${X(v)}" y1="${Y(y0)}" x2="${X(v)}" y2="${Y(y1)}"/>`;
    });
    (o.hlines || []).forEach(v => {
      s += `<line class="p-guide" x1="${X(x0)}" y1="${Y(v)}" x2="${X(x1)}" y2="${Y(v)}"/>`;
    });
    // Zones colorées [a, b] sur l'axe des x
    (o.bands || []).forEach(b => {
      s += `<rect class="p-band ${b.cls || ''}" x="${X(b.a)}" y="${Y(y1)}" width="${X(b.b) - X(b.a)}" height="${Y(y0) - Y(y1)}"/>`;
    });

    // Courbes y = f(x), ou paramétriques {fx, fy, t:[a,b]}
    (o.fns || []).forEach((c, i) => {
      const n = c.n || 600;
      const pts = [];
      for (let k = 0; k <= n; k++) {
        let px, py;
        if (c.fx) { const t = c.t[0] + (c.t[1] - c.t[0]) * k / n; px = c.fx(t); py = c.fy(t); }
        else { px = x0 + (x1 - x0) * k / n; py = c.f(px); }
        if (!isFinite(py)) continue;
        py = Math.max(y0 - (y1 - y0), Math.min(y1 + (y1 - y0), py));
        pts.push(r2(X(px)) + ',' + r2(Y(py)));
      }
      s += `<polyline class="p-curve ${c.cls || (i ? 'c' + (i + 1) : '')}${c.dash ? ' p-dash' : ''}" points="${pts.join(' ')}"/>`;
    });

    // Diracs : flèches de hauteur = poids
    (o.diracs || []).forEach(d => {
      const top = Y(d.a), base = Y(0), up = d.a >= 0 ? -1 : 1;
      s += `<line class="p-dirac ${d.cls || ''}" x1="${X(d.x)}" y1="${base}" x2="${X(d.x)}" y2="${top}"/>`;
      s += `<polygon class="p-dhead ${d.cls || ''}" points="${X(d.x)},${top} ${X(d.x) - 4},${top - up * 8} ${X(d.x) + 4},${top - up * 8}"/>`;
      if (d.l) s += `<text class="p-tl p-dl" x="${X(d.x)}" y="${top + up * 5}" text-anchor="middle">${esc(d.l)}</text>`;
    });

    // Suites discrètes : bâtons terminés par un rond
    (o.stems || []).forEach(st => {
      const cls = st.cls || '';
      st.n.forEach((n, k) => {
        const v = st.v[k];
        s += `<line class="p-stem ${cls}" x1="${X(n)}" y1="${Y(0)}" x2="${X(n)}" y2="${Y(v)}"/>`;
        s += `<circle class="p-dot ${cls}" cx="${X(n)}" cy="${Y(v)}" r="3.2"/>`;
      });
    });

    // Points : pôles (×) et zéros (○)
    (o.pts || []).forEach(p => {
      const cx = X(p.x), cy = Y(p.y);
      if (p.k === 'pole') s += `<path class="p-pole" d="M${cx - 5},${cy - 5}L${cx + 5},${cy + 5}M${cx + 5},${cy - 5}L${cx - 5},${cy + 5}"/>`;
      else s += `<circle class="p-zero" cx="${cx}" cy="${cy}" r="5"/>`;
      if (p.l) s += `<text class="p-tl" x="${cx + (p.dx || 8)}" y="${cy - 7}">${esc(p.l)}</text>`;
    });

    (o.texts || []).forEach(t => {
      s += `<text class="p-tl ${t.cls || ''}" x="${X(t.x)}" y="${Y(t.y)}" text-anchor="${t.a || 'middle'}">${esc(t.t)}</text>`;
    });

    const svg = `<svg class="plot-svg" viewBox="0 0 ${W} ${H}" width="${W}" role="img" aria-label="${esc(o.alt || o.yl || 'graphe')}">${s}</svg>`;
    return o.raw ? svg : `<figure class="plot">${svg}${o.cap ? `<figcaption>${o.cap}</figcaption>` : ''}</figure>`;
  };

  // Plusieurs graphes côte à côte (ils passent les uns sous les autres sur mobile).
  window.plots = (...figs) => `<div class="plots">${figs.join('')}</div>`;

  // Fonctions usuelles
  window.SIG = {
    rect: t => (Math.abs(t) <= 0.5 ? 1 : 0),
    tri: t => Math.max(1 - Math.abs(t), 0),
    u: t => (t >= 0 ? 1 : 0),
    sinc: t => (Math.abs(t) < 1e-9 ? 1 : Math.sin(Math.PI * t) / (Math.PI * t))
  };
})();
