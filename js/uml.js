/*
 * Mini moteur de diagrammes de classes UML en SVG.
 * Les fiches décrivent les boîtes et les relations ; tout le reste
 * (taille des boîtes, tracé des flèches, cadrage) est calculé ici pour
 * ne jamais avoir à placer une pointe de flèche à la main.
 */
(function () {
  const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const LH = 16, CW = 7.3, NW = 8.6;

  function measure(c) {
    const attrs = c.attrs || [], meths = c.methods || [];
    const strip = s => s.replace(/^[_\/]+/, '');
    const memberW = Math.max(0, ...attrs.concat(meths).map(s => strip(s).length * CW)) + 22;
    const nameW = c.name.length * NW + 26;
    const stW = c.stereo ? (c.stereo.length + 2) * 6.8 + 20 : 0;
    const w = c.w || Math.ceil(Math.max(memberW, nameW, stW, c.compact ? 70 : 100));
    const head = c.stereo ? 40 : 28;
    const h = c.compact ? head
      : head + (attrs.length ? attrs.length * LH + 10 : 10) + (meths.length ? meths.length * LH + 10 : 10);
    const x = c.x != null ? c.x : c.cx - w / 2;
    return Object.assign({}, c, { attrs, meths, w, h, head, x });
  }

  // Préfixes : "_" = souligné (static), "/" = italique (abstrait).
  function member(t, x, y) {
    let cls = 'u-mem';
    while (/^[_\/]/.test(t)) { cls += t[0] === '_' ? ' u-static' : ' u-abs'; t = t.slice(1); }
    return `<text class="${cls}" x="${x}" y="${y}">${esc(t)}</text>`;
  }

  function drawClass(b) {
    const cx = b.x + b.w / 2;
    let s = `<g class="u-cls${b.hl ? ' u-hl' : ''}${b.ghost ? ' u-ghost' : ''}">`;
    s += `<rect class="u-box" x="${b.x}" y="${b.y}" width="${b.w}" height="${b.h}" rx="4"/>`;
    if (b.stereo) s += `<text class="u-stereo" x="${cx}" y="${b.y + 15}" text-anchor="middle">«${esc(b.stereo)}»</text>`;
    const nameCls = 'u-name' + (b.abstract ? ' u-abs' : '') + (b.obj ? ' u-static' : '');
    s += `<text class="${nameCls}" x="${cx}" y="${b.y + (b.stereo ? 31 : 19)}" text-anchor="middle">${esc(b.name)}</text>`;
    if (!b.compact) {
      let y = b.y + b.head;
      s += `<line class="u-sep" x1="${b.x}" y1="${y}" x2="${b.x + b.w}" y2="${y}"/>`;
      b.attrs.forEach((a, i) => { s += member(a, b.x + 10, y + 17 + i * LH); });
      y += b.attrs.length ? b.attrs.length * LH + 10 : 10;
      s += `<line class="u-sep" x1="${b.x}" y1="${y}" x2="${b.x + b.w}" y2="${y}"/>`;
      b.meths.forEach((m, i) => { s += member(m, b.x + 10, y + 17 + i * LH); });
    }
    return s + '</g>';
  }

  function anchor(b, side, off) {
    off = off || 0;
    switch (side) {
      case 'top': return { x: b.x + b.w / 2 + off, y: b.y };
      case 'bottom': return { x: b.x + b.w / 2 + off, y: b.y + b.h };
      case 'left': return { x: b.x, y: b.y + b.h / 2 + off };
      default: return { x: b.x + b.w, y: b.y + b.h / 2 + off };
    }
  }

  function autoSides(A, B) {
    if (B.y >= A.y + A.h) return ['bottom', 'top'];
    if (B.y + B.h <= A.y) return ['top', 'bottom'];
    return B.x > A.x ? ['right', 'left'] : ['left', 'right'];
  }

  const isV = s => s === 'top' || s === 'bottom';
  const unit = (a, b) => { const dx = b.x - a.x, dy = b.y - a.y, l = Math.hypot(dx, dy) || 1; return { x: dx / l, y: dy / l }; };

  function route(p1, p2, fs, ts, r) {
    if (isV(fs) && isV(ts)) {
      if (Math.abs(p1.x - p2.x) < 1) return [p1, p2];
      const my = r.mid != null ? r.mid : (p1.y + p2.y) / 2;
      return [p1, { x: p1.x, y: my }, { x: p2.x, y: my }, p2];
    }
    if (!isV(fs) && !isV(ts)) {
      if (Math.abs(p1.y - p2.y) < 1) return [p1, p2];
      const mx = r.mid != null ? r.mid : (p1.x + p2.x) / 2;
      return [p1, { x: mx, y: p1.y }, { x: mx, y: p2.y }, p2];
    }
    return !isV(fs) ? [p1, { x: p2.x, y: p1.y }, p2] : [p1, { x: p1.x, y: p2.y }, p2];
  }

  function head(type, tip, d) {
    const px = -d.y, py = d.x;
    const bx = tip.x - d.x * 13, by = tip.y - d.y * 13;
    if (type === 'extends' || type === 'implements') {
      return `<polygon class="u-tri" points="${tip.x},${tip.y} ${bx + px * 7},${by + py * 7} ${bx - px * 7},${by - py * 7}"/>`;
    }
    if (type === 'assoc' || type === 'dep' || type === 'compoNav' || type === 'aggrNav') {
      const ax = tip.x - d.x * 11, ay = tip.y - d.y * 11;
      return `<polyline class="u-open" points="${ax + px * 6},${ay + py * 6} ${tip.x},${tip.y} ${ax - px * 6},${ay - py * 6}"/>`;
    }
    return '';
  }

  function diamond(type, p, e) {
    const px = -e.y, py = e.x;
    const m = { x: p.x + e.x * 9, y: p.y + e.y * 9 }, f = { x: p.x + e.x * 18, y: p.y + e.y * 18 };
    const cls = type.startsWith('compo') ? 'u-dia-full' : 'u-dia';
    return `<polygon class="${cls}" points="${p.x},${p.y} ${m.x + px * 6},${m.y + py * 6} ${f.x},${f.y} ${m.x - px * 6},${m.y - py * 6}"/>`;
  }

  function endLabel(p, dir, text, side, ext) {
    const s = side || 1;
    const per = { x: -dir.y * s, y: dir.x * s };
    let x = p.x + dir.x * 18 + per.x * 8, y = p.y + dir.y * 18 + per.y * 8;
    let a = 'middle';
    if (Math.abs(dir.y) > 0.5) { a = per.x > 0 ? 'start' : 'end'; y += 4; }
    else { y += per.y > 0 ? 11 : -3; }
    track(ext, x, y, text, a);
    return `<text class="u-mult" x="${x}" y="${y}" text-anchor="${a}">${esc(text)}</text>`;
  }

  function track(ext, x, y, text, a) {
    const w = String(text).length * 7;
    const x0 = a === 'start' ? x : a === 'end' ? x - w : x - w / 2;
    ext.minX = Math.min(ext.minX, x0); ext.maxX = Math.max(ext.maxX, x0 + w);
    ext.minY = Math.min(ext.minY, y - 12); ext.maxY = Math.max(ext.maxY, y + 4);
  }

  function drawRel(r, boxes, ext) {
    const A = boxes[r.from], B = boxes[r.to];
    const auto = autoSides(A, B);
    const fs = r.fs || auto[0], ts = r.ts || auto[1];
    const p1 = anchor(A, fs, r.fo), p2 = anchor(B, ts, r.too);
    const pts = route(p1, p2, fs, ts, r);
    const dashed = r.type === 'implements' || r.type === 'dep';
    let s = `<g class="u-rel">`;
    s += `<polyline class="u-line${dashed ? ' u-dash' : ''}" points="${pts.map(p => p.x + ',' + p.y).join(' ')}"/>`;
    const dEnd = unit(pts[pts.length - 2], p2);
    s += head(r.type, p2, dEnd);
    if (r.type.startsWith('compo') || r.type.startsWith('aggr')) s += diamond(r.type, p1, unit(p1, pts[1]));
    if (r.m1) s += endLabel(p1, unit(p1, pts[1]), r.m1, r.m1s, ext);
    if (r.m2) s += endLabel(p2, { x: -dEnd.x, y: -dEnd.y }, r.m2, r.m2s, ext);
    if (r.label) {
      let best = 0, bl = -1;
      for (let i = 0; i < pts.length - 1; i++) {
        const l = Math.hypot(pts[i + 1].x - pts[i].x, pts[i + 1].y - pts[i].y);
        if (l > bl) { bl = l; best = i; }
      }
      const a = pts[best], b = pts[best + 1];
      let x = (a.x + b.x) / 2 + (r.ldx || 0), y = (a.y + b.y) / 2 + (r.ldy || 0), anc = 'middle';
      if (Math.abs(a.x - b.x) < 1) { x += 7; y += 4; anc = 'start'; } else { y -= 8; }
      track(ext, x, y, r.label, anc);
      s += `<text class="u-label" x="${x}" y="${y}" text-anchor="${anc}">${esc(r.label)}</text>`;
    }
    pts.forEach(p => {
      ext.minX = Math.min(ext.minX, p.x); ext.maxX = Math.max(ext.maxX, p.x);
      ext.minY = Math.min(ext.minY, p.y); ext.maxY = Math.max(ext.maxY, p.y);
    });
    return s + '</g>';
  }

  window.uml = function (spec) {
    const boxes = {};
    const ext = { minX: Infinity, minY: Infinity, maxX: -Infinity, maxY: -Infinity };
    let body = '';
    (spec.classes || []).forEach(c => {
      const b = measure(c);
      boxes[c.id || c.name] = b;
      ext.minX = Math.min(ext.minX, b.x); ext.maxX = Math.max(ext.maxX, b.x + b.w);
      ext.minY = Math.min(ext.minY, b.y); ext.maxY = Math.max(ext.maxY, b.y + b.h);
    });
    let rels = '';
    (spec.rels || []).forEach(r => { rels += drawRel(r, boxes, ext); });
    Object.values(boxes).forEach(b => { body += drawClass(b); });
    (spec.texts || []).forEach(t => {
      track(ext, t.x, t.y, t.t, t.anchor || 'start');
      body += `<text class="u-note ${t.cls || ''}" x="${t.x}" y="${t.y}" text-anchor="${t.anchor || 'start'}">${esc(t.t)}</text>`;
    });
    const pad = 12;
    const vx = Math.floor(ext.minX - pad), vy = Math.floor(ext.minY - pad);
    const W = Math.ceil(ext.maxX - ext.minX + pad * 2), H = Math.ceil(ext.maxY - ext.minY + pad * 2);
    const svg = `<svg class="uml-svg" viewBox="${vx} ${vy} ${W} ${H}" width="${W}" role="img" aria-label="${esc(spec.alt || 'Diagramme de classes UML')}">${rels}${body}</svg>`;
    return `<figure class="uml">${svg}${spec.caption ? `<figcaption>${spec.caption}</figcaption>` : ''}</figure>`;
  };
})();
