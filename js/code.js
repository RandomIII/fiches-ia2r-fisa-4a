/* Blocs de code Java colorés, sans dépendance externe pour que le site marche hors ligne. */
(function () {
  const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

  const KW = 'public|private|protected|class|interface|extends|implements|abstract|static|final|void|int|boolean|long|double|char|new|return|if|else|for|while|do|try|catch|finally|throw|throws|this|super|null|true|false|import|package|instanceof|transient|enum|var';
  const RE = new RegExp(
    '(\\/\\/[^\\n]*|\\/\\*[\\s\\S]*?\\*\\/)' +          // 1 commentaire
    '|("(?:\\\\.|[^"\\\\])*"|\'(?:\\\\.|[^\'\\\\])*\')' + // 2 chaîne
    '|(@\\w+)' +                                         // 3 annotation
    '|\\b(\\d+[Ll]?)\\b' +                               // 4 nombre
    '|\\b(' + KW + ')\\b' +                              // 5 mot-clé
    '|\\b([A-Z]\\w*)\\b',                                // 6 type
    'g');
  const CLS = [null, 'c-com', 'c-str', 'c-ann', 'c-num', 'c-kw', 'c-type'];

  function highlight(src) {
    let out = '', last = 0, m;
    RE.lastIndex = 0;
    while ((m = RE.exec(src))) {
      out += esc(src.slice(last, m.index));
      const g = CLS.findIndex((_, i) => i > 0 && m[i] !== undefined);
      out += `<span class="${CLS[g]}">${esc(m[0])}</span>`;
      last = RE.lastIndex;
    }
    return out + esc(src.slice(last));
  }

  function dedent(s) {
    const lines = s.replace(/^\s*\n/, '').replace(/\s+$/, '').split('\n');
    const ind = Math.min(...lines.filter(l => l.trim()).map(l => l.match(/^ */)[0].length));
    return lines.map(l => l.slice(ind)).join('\n');
  }

  function block(src, opts) {
    const o = opts || {};
    const txt = dedent(src);
    const body = o.plain ? esc(txt) : highlight(txt);
    const title = o.title ? `<div class="code-title">${esc(o.title)}</div>` : '';
    return `<div class="code${o.plain ? ' code-out' : ''}">${title}<pre><code>${body}</code></pre></div>`;
  }

  // J`...` : code Java ; F('Fichier.java')`...` : avec un nom de fichier ;
  // O`...` : sortie console ; c`...` : bout de code dans une phrase.
  window.J = (s, ...v) => block(String.raw(s, ...v));
  window.F = title => (s, ...v) => block(String.raw(s, ...v), { title });
  window.O = (s, ...v) => block(String.raw(s, ...v), { plain: true, title: 'Console' });
  window.c = (s, ...v) => `<code>${esc(String.raw(s, ...v))}</code>`;
  window.escHTML = esc;
})();
