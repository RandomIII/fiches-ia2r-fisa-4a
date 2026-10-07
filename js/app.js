(function () {
  const $ = s => document.querySelector(s);
  const esc = window.escHTML;
  const store = {
    get(k, d) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* stockage bloqué : l'état reste en mémoire */ } }
  };

  // Ancienne clé de progression (avant le passage multi-matières).
  (function migrer() {
    const old = store.get('gl-done', null);
    if (old && !store.get('done:genie-logiciel', null)) store.set('done:genie-logiciel', old);
  })();

  // ?memo-print=1 : utilisé pour générer les PDF des mémos (seules les feuilles sont imprimées).
  const PRINT_MODE = new URLSearchParams(location.search).has('memo-print');
  if (PRINT_MODE) document.body.classList.add('print-memo', 'print-all');

  let M = null;                       // matière ouverte
  let scope = null;                   // partie ouverte ('p1', ..., 'tout'), seulement si la matière a des parties
  const ui = { theme: 'all', q: '', visible: [], list: [], current: -1 };
  const doneSet = m => new Set(store.get('done:' + m.id, []));
  let done = new Set();

  const inScope = x => !scope || scope === 'tout' || (x.tps || []).includes(scope);
  const base = () => `#/${M.id}` + (scope ? '/' + scope : '');
  const partieNom = k => (M.tps && M.tps[k]) || k;

  /* ---------- Thème clair / sombre ---------- */
  $('#theme-btn').addEventListener('click', () => {
    const root = document.documentElement;
    const dark = root.dataset.theme ? root.dataset.theme === 'dark' : matchMedia('(prefers-color-scheme: dark)').matches;
    root.dataset.theme = dark ? 'light' : 'dark';
    try { localStorage.setItem('gl-theme', root.dataset.theme); } catch (e) {}
  });

  function chips(el, items, active, onPick) {
    el.innerHTML = items.map(([k, label, color]) =>
      `<button type="button" class="chip${k === active ? ' on' : ''}" data-k="${k}"${color ? ` style="--c:${color}"` : ''}>${color ? '<i></i>' : ''}${esc(label)}</button>`
    ).join('');
    el.onclick = e => { const b = e.target.closest('.chip'); if (b) onPick(b.dataset.k); };
  }

  // Formules LaTeX ($...$ et $$...$$) via KaTeX, chargé en différé : sans lui, le texte brut reste lisible.
  const math = el => {
    if (el && window.renderMathInElement) renderMathInElement(el, {
      delimiters: [{ left: '$$', right: '$$', display: true }, { left: '$', right: '$', display: false }],
      throwOnError: false
    });
  };
  window.addEventListener('load', () => {
    ['#grid', '#m-body', '#m-resume', '#qcm-card', '#lexique', '#memos', '#parties'].forEach(s => math($(s)));
    fitSheets();
  });

  const norm = s => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
  const plain = html => html.replace(/<[^>]+>/g, ' ');

  /* ================= ACCUEIL ================= */
  function renderHome() {
    const cards = MATIERES.map(m => {
      const d = doneSet(m).size, n = m.fiches.length;
      const best = store.get('qcm-best:' + m.id, null);
      const nParties = m.parties ? Object.keys(m.tps).length : 0;
      return `<a class="matiere" href="#/${m.id}" style="--c:${m.couleur}">
        <div class="mat-band"></div>
        <h2>${esc(m.nom)}</h2>
        <p class="mat-sub">${esc(m.sousTitre || '')}</p>
        <p class="mat-desc">${esc(m.description || '')}</p>
        <div class="mat-stats">
          ${nParties ? `<span><b>${nParties}</b> parties</span>` : ''}
          <span><b>${n}</b> fiches</span><span><b>${m.qcm.length}</b> questions</span>
          ${m.memos ? `<span><b>${Object.keys(m.memos).length}</b> mémo${Object.keys(m.memos).length > 1 ? 's' : ''} A4</span>` : `<span><b>${m.lexique.length}</b> mots</span>`}
        </div>
        <div class="progress small"><div class="bar"><span style="width:${n ? 100 * d / n : 0}%"></span></div><span>${d}/${n} maîtrisées${best != null ? ` · meilleur QCM ${best} %` : ''}</span></div>
      </a>`;
    }).join('');
    $('#matieres').innerHTML = cards + `<div class="matiere soon"><h2>Prochaine matière</h2><p class="mat-desc">Bientôt ici : même format, fiches + QCM + mémo + lexique.</p></div>`;
  }

  /* ================= CHOIX DE LA PARTIE ================= */
  function renderParties() {
    $('#parties-title').textContent = M.nom;
    $('#parties-desc').textContent = M.description || '';
    // Documents fournis par l'enseignant (tables...) : téléchargement direct + lien vers la fiche qui les reprend.
    $('#ressources').innerHTML = (M.ressources || []).map(r =>
      `<span class="ressource"><a class="btn ok" href="${r.href}" download>⬇ ${esc(r.titre)}</a>${r.fiche ? `<a class="btn" href="#/${M.id}/tout/f/${r.fiche}">voir la fiche</a>` : ''}</span>`).join('');
    const card = (k, titre, desc, color) => {
      const fiches = M.fiches.filter(f => k === 'tout' || (f.tps || []).includes(k));
      const qs = M.qcm.filter(x => k === 'tout' || (x.tps || []).includes(k));
      const d = fiches.filter(f => done.has(f.id)).length;
      const nMemos = k === 'tout' ? Object.keys(M.memos || {}).length : (M.memos && M.memos[k] ? 1 : 0);
      const memo = nMemos > 0;
      const href = `#/${M.id}/${k}`;
      return `<div class="partie${k === 'tout' ? ' tout' : ''}" style="--c:${color}">
        <a class="partie-main" href="${href}">
          <span class="partie-num">${k === 'tout' ? '∑' : esc((M.tpsCourt || {})[k] || k)}</span>
          <h2>${esc(titre)}</h2>
          <p class="mat-desc">${desc}</p>
        </a>
        <div class="mat-stats"><span><b>${fiches.length}</b> fiches</span><span><b>${qs.length}</b> questions</span>${memo ? `<span><b>${nMemos}</b> mémo${nMemos > 1 ? 's' : ''} A4</span>` : ''}</div>
        <div class="progress small"><div class="bar"><span style="width:${fiches.length ? 100 * d / fiches.length : 0}%"></span></div><span>${d}/${fiches.length} maîtrisées</span></div>
        <div class="partie-links">
          <a class="btn" href="${href}">Fiches</a>
          <a class="btn" href="${href}/qcm">QCM</a>
          ${memo ? `<a class="btn ok" href="${href}/memo">📄 Mémo A4</a>` : ''}
        </div>
      </div>`;
    };
    const info = M.partiesInfo || {};
    $('#parties').innerHTML = Object.keys(M.tps).map((k, i) =>
      card(k, (info[k] && info[k].titre) || partieNom(k), (info[k] && info[k].desc) || '', (info[k] && info[k].couleur) || M.couleur)
    ).join('') + card('tout', 'Toutes les parties', 'Tout le cours d’un coup : toutes les fiches, le QCM complet et les mémos de chaque partie.', M.couleur);
    math($('#parties'));
  }

  /* ================= FICHES ================= */
  let searchIndex = new Map();

  function openMatiere(m, sc) {
    if (M === m && scope === sc) return;
    const sameM = M === m;
    M = m; scope = sc;
    if (!sameM) {
      done = doneSet(m);
      searchIndex = new Map(m.fiches.map(f => [f.id, norm(f.titre + ' ' + f.resume + ' ' + plain(f.corps))]));
    }
    Object.assign(ui, { theme: 'all', tp: 'all', q: '' });
    $('#search').value = '';
    $('#lex-search').value = '';
    const sub = scope && scope !== 'tout' ? partieNom(scope) : (m.sousTitre || '');
    $('#fiches-title').textContent = m.nom + (sub ? ' — ' + sub : '');
    renderFilters(); renderGrid(); renderLexique(); renderMemos();
    qcm.theme = 'all'; qcm.type = 'all'; qcm.tp = 'all'; renderQcmChips(); qcmStart();
  }

  function renderFilters() {
    chips($('#theme-chips'), [['all', 'Tous les thèmes']].concat(Object.entries(M.themes)
      .filter(([k]) => M.fiches.some(f => f.theme === k && inScope(f))).map(([k, t]) => [k, t.nom, t.couleur])),
      ui.theme, k => { ui.theme = k; renderFilters(); renderGrid(); });
    // Les matières à parties choisissent la partie par les sous-cartes ; les autres filtrent par TP.
    const tps = !M.parties && M.tps && Object.keys(M.tps).length ? M.tps : null;
    $('#tp-chips').hidden = !tps;
    if (tps) chips($('#tp-chips'), [['all', M.filtreLabel || 'Tous les TP']].concat(Object.entries(tps)), ui.tp || 'all',
      k => { ui.tp = k; renderFilters(); renderGrid(); });
  }

  function renderGrid() {
    const q = norm(ui.q.trim());
    ui.visible = M.fiches.filter(f =>
      inScope(f) &&
      (ui.theme === 'all' || f.theme === ui.theme) &&
      (!ui.tp || ui.tp === 'all' || (f.tps || []).includes(ui.tp)) &&
      (!q || q.split(/\s+/).every(w => searchIndex.get(f.id).includes(w))));

    $('#grid').innerHTML = ui.visible.map(f => {
      const t = M.themes[f.theme];
      const n = M.fiches.indexOf(f) + 1;
      const badges = [f.corps.includes('class="uml"') ? 'UML' : null, f.corps.includes('class="plot"') ? 'Graphe' : null,
        f.corps.includes('class="code') ? 'Code' : null].filter(Boolean);
      return `<a class="card${done.has(f.id) ? ' done' : ''}" href="${base()}/f/${f.id}" style="--c:${t.couleur}">
        <div class="card-top"><span class="pill">${esc(t.nom)}</span><span class="num">${String(n).padStart(2, '0')}</span></div>
        <h3>${esc(f.titre)}</h3>
        <p>${esc(f.resume)}</p>
        <div class="card-foot">
          <span class="tps">${(f.tps || []).map(k => esc((M.tpsCourt || {})[k] || (M.tps[k] || k).replace('TP ', ''))).join(' · ')}</span>
          <span class="badges">${badges.map(b => `<span>${b}</span>`).join('')}<span class="check" title="Maîtrisée">✓</span></span>
        </div>
      </a>`;
    }).join('');
    $('#empty').hidden = ui.visible.length > 0;
    math($('#grid'));
    const all = M.fiches.filter(inScope);
    const n = all.filter(f => done.has(f.id)).length, tot = all.length;
    $('#progress-bar').style.width = (tot ? 100 * n / tot : 0) + '%';
    $('#progress-txt').textContent = `${n} / ${tot} fiches maîtrisées`;
  }

  $('#search').addEventListener('input', e => { ui.q = e.target.value; renderGrid(); });

  /* ---------- Fiche ouverte ---------- */
  const modal = $('#modal');

  function openFiche(id) {
    const f = M.fiches.find(x => x.id === id);
    if (!f) return;
    // Précédente/suivante dans la sélection affichée, sinon dans toute la matière.
    ui.list = ui.visible.includes(f) ? ui.visible : M.fiches;
    ui.current = ui.list.indexOf(f);
    const t = M.themes[f.theme];
    modal.style.setProperty('--c', t.couleur);
    $('#m-tags').innerHTML = `<span class="pill">${esc(t.nom)}</span>` + (f.tps || []).map(k => `<span class="tp-tag">${esc(M.tps[k] || k)}</span>`).join('');
    $('#m-title').textContent = f.titre;
    $('#m-resume').textContent = f.resume;
    $('#m-body').innerHTML = f.corps;
    math($('#m-resume')); math($('#m-body'));
    $('#m-prev').disabled = ui.current <= 0;
    $('#m-next').disabled = ui.current >= ui.list.length - 1;
    renderDoneBtn(f.id);
    if (!modal.open) modal.showModal();
    modal.querySelector('.modal-card').scrollTop = 0;
  }

  function renderDoneBtn(id) {
    const b = $('#m-done');
    const ok = done.has(id);
    b.textContent = ok ? '✓ Maîtrisée' : 'Je maîtrise';
    b.classList.toggle('ok', ok);
    b.onclick = () => {
      ok ? done.delete(id) : done.add(id);
      store.set('done:' + M.id, [...done]);
      renderDoneBtn(id);
      renderGrid();
    };
  }

  const step = d => { const f = ui.list[ui.current + d]; if (f) location.hash = `${base()}/f/${f.id}`; };
  $('#m-prev').onclick = () => step(-1);
  $('#m-next').onclick = () => step(1);
  // On nettoie l'URL nous-mêmes plutôt que via l'événement 'close', qui n'est pas toujours livré ;
  // sinon recliquer sur la même carte ne change pas le hash et la fiche ne se rouvre pas.
  const closeFiche = () => {
    if (modal.open) modal.close();
    if (M && /\/f\//.test(location.hash)) history.replaceState(null, '', base());
  };
  $('#m-close').onclick = closeFiche;
  modal.addEventListener('click', e => { if (e.target === modal) closeFiche(); });
  modal.addEventListener('cancel', e => { e.preventDefault(); closeFiche(); });
  modal.addEventListener('close', () => { if (M && /\/f\//.test(location.hash)) history.replaceState(null, '', base()); });
  $('#grid').addEventListener('click', e => {
    const a = e.target.closest('a.card');
    if (a && a.getAttribute('href') === location.hash) { e.preventDefault(); route(); }
  });
  modal.addEventListener('keydown', e => {
    if (e.key === 'ArrowRight') step(1);
    if (e.key === 'ArrowLeft') step(-1);
  });

  /* ================= QCM ================= */
  const qcm = { theme: 'all', type: 'all', tp: 'all', deck: [], i: 0, ok: 0, ko: [], answered: false, order: [] };
  const types = () => [['all', 'Tout'], ['pratique', '🛠 ' + (M.pratiqueLabel || 'Pratique')], ['theorie', '📖 Théorie']];
  const shuffle = a => { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const qcmPool = () => M.qcm.filter(inScope);

  function qcmStart(deck) {
    qcm.full = !deck;
    qcm.deck = shuffle((deck || qcmPool().filter(x =>
      (qcm.theme === 'all' || x.theme === qcm.theme) && (qcm.type === 'all' || x.type === qcm.type) &&
      (qcm.tp === 'all' || (x.tps || []).includes(qcm.tp)))).slice());
    qcm.i = 0; qcm.ok = 0; qcm.ko = [];
    renderQcm();
  }

  function renderQcmChips() {
    const pool = qcmPool();
    const used = new Set(pool.map(x => x.theme));
    chips($('#qcm-type-chips'), types().map(([k, l]) => [k, l + ' · ' + (k === 'all' ? pool.length : pool.filter(x => x.type === k).length)]),
      qcm.type, k => { qcm.type = k; renderQcmChips(); qcmStart(); });
    chips($('#qcm-chips'), [['all', 'Tous les thèmes']].concat(Object.entries(M.themes).filter(([k]) => used.has(k)).map(([k, t]) => [k, t.nom, t.couleur])),
      qcm.theme, k => { qcm.theme = k; renderQcmChips(); qcmStart(); });
    // Filtre par TP seulement pour les matières sans sous-cartes de parties, et si les questions sont étiquetées.
    const parTp = !M.parties && M.tps && M.qcm.some(x => x.tps);
    $('#qcm-tp-chips').hidden = !parTp;
    if (parTp) chips($('#qcm-tp-chips'), [['all', M.filtreLabel || 'Tous les TP']].concat(Object.entries(M.tps)),
      qcm.tp, k => { qcm.tp = k; renderQcmChips(); qcmStart(); });
  }

  function renderQcm() {
    const total = qcm.deck.length;
    const end = qcm.i >= total;
    $('#qcm-card').hidden = end || !total;
    $('#qcm-end').hidden = !end || !total;
    $('#qcm-score').textContent = `✓ ${qcm.ok}   ✗ ${qcm.ko.length}`;
    $('#qcm-bar').style.width = (total ? 100 * qcm.i / total : 0) + '%';
    if (!total) { $('#qcm-pos').textContent = 'Aucune question pour ce filtre.'; return; }
    if (end) return renderQcmEnd();

    const item = qcm.deck[qcm.i];
    const t = M.themes[item.theme];
    qcm.answered = false;
    $('#qcm-pos').textContent = `Question ${qcm.i + 1} / ${total}`;
    $('#qcm-card').style.setProperty('--c', t.couleur);
    $('#qcm-tags').innerHTML = `<span class="pill">${esc(t.nom)}</span><span class="type-tag ${item.type}">${item.type === 'pratique' ? '🛠 Pratique' : '📖 Théorie'}</span>`;
    $('#qcm-q').textContent = item.q;
    $('#qcm-media').innerHTML = (item.code || '') + (item.uml || '');
    // Dans les données, la bonne réponse est toujours la première : on mélange l'affichage.
    qcm.order = shuffle(item.choix.map((_, i) => i));
    $('#qcm-choix').innerHTML = qcm.order.map((ci, pos) =>
      `<li><button type="button" class="choix" data-ci="${ci}"><span class="lettre">${'ABCD'[pos]}</span><span class="txt">${item.choix[ci]}</span></button></li>`).join('');
    $('#qcm-expl').hidden = true;
    $('#qcm-next').hidden = true;
    math($('#qcm-card'));
  }

  function answer(ci) {
    if (qcm.answered) return;
    qcm.answered = true;
    const item = qcm.deck[qcm.i];
    const good = ci === 0;
    if (good) qcm.ok++; else qcm.ko.push(item);
    document.querySelectorAll('#qcm-choix .choix').forEach(b => {
      const k = +b.dataset.ci;
      b.disabled = true;
      if (k === 0) b.classList.add('bonne');
      else if (k === ci) b.classList.add('fausse');
    });
    $('#qcm-expl').innerHTML = `<strong>${good ? '✓ Bonne réponse' : '✗ Raté'}</strong>${item.expl}`;
    $('#qcm-expl').className = 'qcm-expl ' + (good ? 'ok' : 'ko');
    $('#qcm-expl').hidden = false;
    math($('#qcm-expl'));
    $('#qcm-next').hidden = false;
    $('#qcm-next').textContent = qcm.i === qcm.deck.length - 1 ? 'Voir mon score →' : 'Question suivante →';
    $('#qcm-score').textContent = `✓ ${qcm.ok}   ✗ ${qcm.ko.length}`;
    $('#qcm-next').focus({ preventScroll: true });
  }

  function renderQcmEnd() {
    const total = qcm.deck.length;
    const pct = Math.round(100 * qcm.ok / total);
    $('#qcm-pos').textContent = 'Terminé';
    $('#qcm-end-score').textContent = `${qcm.ok} / ${total} — ${pct} %`;
    $('#qcm-end-txt').textContent = pct === 100 ? 'Parfait, rien à redire 🎉'
      : pct >= 75 ? 'Très bien ! Refais tes erreurs pour viser le 100 %.'
      : pct >= 50 ? 'Pas mal. Relis les fiches des thèmes où tu as raté, puis refais tes erreurs.'
      : 'Relis les fiches correspondantes, puis retente : ça va venir.';
    $('#qcm-retry-ko').hidden = !qcm.ko.length;
    // Le meilleur score n'a de sens que sur le QCM complet, pas sur un filtre ou une reprise des erreurs.
    if (qcm.full && (!scope || scope === 'tout') && qcm.theme === 'all' && qcm.type === 'all' && qcm.tp === 'all') {
      const best = store.get('qcm-best:' + M.id, 0);
      if (pct > best) store.set('qcm-best:' + M.id, pct);
    }
  }

  $('#qcm-choix').addEventListener('click', e => { const b = e.target.closest('.choix'); if (b) answer(+b.dataset.ci); });
  $('#qcm-next').onclick = () => { qcm.i++; renderQcm(); $('#qcm-card').scrollIntoView({ block: 'nearest' }); };
  $('#qcm-restart').onclick = () => qcmStart();
  $('#qcm-retry-ko').onclick = () => qcmStart(qcm.ko.slice());
  document.addEventListener('keydown', e => {
    if ($('#view-qcm').hidden || modal.open || /input|textarea/i.test(e.target.tagName)) return;
    if (!qcm.answered && /^[1-4]$/.test(e.key)) {
      const b = document.querySelectorAll('#qcm-choix .choix')[+e.key - 1];
      if (b) answer(+b.dataset.ci);
    } else if (qcm.answered && e.key === 'Enter' && document.activeElement !== $('#qcm-next')) {
      $('#qcm-next').click();
    }
  });

  /* ================= MÉMOS A4 ================= */
  function renderMemos() {
    const memos = M.memos || {};
    const keys = Object.keys(memos).filter(k => !scope || scope === 'tout' || k === scope);
    $('#memos').innerHTML = keys.map(k => {
      const mm = memos[k];
      const pdf = `pdf/${M.id}-${k}.pdf`;
      return `<section class="memo" data-k="${k}">
        <div class="memo-head">
          <h2>${esc(mm.titre)}</h2>
          <div class="memo-actions">
            <a class="btn ok" href="${pdf}" download>⬇ Télécharger le PDF</a>
            <button class="btn" type="button" data-print="${k}">🖨 Imprimer</button>
          </div>
        </div>
        <div class="sheets">${mm.pages.map((p, i) => `<article class="sheet" style="--c:${mm.couleur || M.couleur}">
          <header class="sheet-head"><b>${esc(M.nom)}</b><span>${esc(mm.titre)}</span><em>${esc((mm.labels || [])[i] || '')}</em><span>${i ? 'verso' : 'recto'}</span></header>
          <div class="sheet-cols">${p}</div>
        </article>`).join('')}</div>
      </section>`;
    }).join('') || '<p class="empty">Pas encore de mémo pour cette matière.</p>';
    math($('#memos'));
    fitSheets();
    fitMemoText();
  }

  // Les feuilles font 210 mm de large : on les réduit à l'écran pour qu'elles tiennent dans la page.
  function fitSheets() {
    document.querySelectorAll('.sheets').forEach(s => {
      if (PRINT_MODE) { s.style.zoom = ''; return; }
      const avail = s.parentElement.clientWidth;
      const sheetW = 793.7; // 210 mm à 96 dpi
      s.style.zoom = avail && avail < sheetW ? (avail / sheetW).toFixed(3) : '';
    });
  }
  window.addEventListener('resize', fitSheets);

  // Chaque feuille prend la plus grande police qui tient dans ses 3 colonnes :
  // une colonne de trop apparaît à droite de la zone dès que le contenu déborde.
  function fitMemoText() {
    if ($('#view-memo').hidden) return;
    document.querySelectorAll('.sheet').forEach(sheet => {
      const cols = sheet.querySelector('.sheet-cols');
      const overflows = () => {
        const box = cols.getBoundingClientRect();
        const colW = box.width / 3;
        // Débordement en 4e colonne, ou bien formule / tableau / graphe plus large que sa colonne.
        return [...cols.children].some(e => e.getBoundingClientRect().right > box.right + 2) ||
          [...cols.querySelectorAll('.katex-html, table, svg, .mf')].some(e => e.getBoundingClientRect().width > colW);
      };
      let lo = 5.8, hi = (M && M.memoMaxPt) || 9.5;   // une matière peu fournie peut écrire plus gros
      for (let i = 0; i < 9; i++) {
        const mid = (lo + hi) / 2;
        sheet.style.fontSize = mid + 'pt';
        if (overflows()) hi = mid; else lo = mid;
      }
      // Marge de 3 % : les autres navigateurs calculent le texte un peu différemment.
      sheet.style.fontSize = (lo * 0.97).toFixed(2) + 'pt';
    });
  }
  const refitMemos = () => { math($('#memos')); fitMemoText(); };
  if (document.fonts) document.fonts.ready.then(refitMemos);
  window.addEventListener('load', refitMemos);

  $('#memos').addEventListener('click', e => {
    const b = e.target.closest('[data-print]');
    if (!b) return;
    document.querySelectorAll('.memo').forEach(m => m.classList.toggle('printing', m.dataset.k === b.dataset.print));
    document.body.classList.add('print-memo');
    window.print();
  });
  window.addEventListener('afterprint', () => { if (!PRINT_MODE) document.body.classList.remove('print-memo'); });

  /* ================= LEXIQUE ================= */
  function renderLexique() {
    const q = norm($('#lex-search').value.trim());
    $('#lexique').innerHTML = M.lexique
      .filter(([m, d]) => !q || norm(m + ' ' + plain(d)).includes(q))
      .map(([m, d]) => `<div><dt>${esc(m)}</dt><dd>${d}</dd></div>`).join('');
    math($('#lexique'));
  }
  $('#lex-search').addEventListener('input', renderLexique);

  /* ================= NAVIGATION ================= */
  function show(view) {
    document.querySelectorAll('.view').forEach(v => { v.hidden = v.id !== 'view-' + view; });
    document.querySelectorAll('#tabs a').forEach(a => a.classList.toggle('on', a.dataset.tab === view));
    if (view === 'memo') { fitSheets(); fitMemoText(); }
  }

  function setHeader(m) {
    $('#tabs').hidden = !m || (m.parties && !scope);
    if (m) {
      $('#tabs').style.setProperty('--c', m.couleur);
      document.querySelectorAll('#tabs a').forEach(a => {
        a.href = base() + (a.dataset.tab === 'fiches' ? '' : '/' + a.dataset.tab);
        a.hidden = a.dataset.tab === 'memo' && !m.memos;
      });
    }
    $('#brand-title').textContent = m ? m.nom : 'Fiches IA2R';
    $('#brand-sub').textContent = m ? '← Toutes les matières' : 'FISA · 4A · Polytech Nancy';
    document.title = m ? m.nom + (scope && scope !== 'tout' ? ' · ' + ((m.tpsCourt || {})[scope] || scope) : '') + ' — Fiches IA2R' : 'Fiches IA2R FISA 4A';
    // Lien retour : vers les parties si on est dans une partie, sinon vers les matières.
    document.querySelectorAll('.back').forEach(a => {
      const versParties = m && m.parties && !a.closest('#view-parties');
      a.href = versParties ? `#/${m.id}` : '#/';
      a.textContent = versParties ? `← ${m.nom} : toutes les parties` : '← Toutes les matières';
    });
  }

  function route() {
    const h = location.hash.replace(/^#\/?/, '');
    // Liens partagés avant le menu multi-matières : #f/<id>, #quiz, #lexique.
    if (/^(f\/.+|quiz|lexique)$/.test(h) && MATIERES[0]) {
      return location.replace(`#/${MATIERES[0].id}/${h === 'quiz' ? 'qcm' : h}`);
    }
    const segs = h.split('/').filter(Boolean);
    const m = MATIERES.find(x => x.id === segs[0]);
    if (!m) {
      if (modal.open) modal.close();
      M = null; scope = null;
      setHeader(null);
      renderHome(); show('home');
      return;
    }
    let rest = segs.slice(1), sc = null;
    if (m.parties) {
      if (rest[0] && (rest[0] === 'tout' || m.tps[rest[0]])) sc = rest.shift();
      else if (rest.length) sc = 'tout';                // anciens liens #/tns/qcm, #/tns/f/...
      else {                                            // #/tns : choix de la partie
        if (modal.open) modal.close();
        openMatiere(m, null);
        setHeader(m); renderParties(); show('parties');
        return;
      }
    }
    openMatiere(m, sc);
    setHeader(m);
    const [page, fid] = rest;
    const view = ['qcm', 'lexique', 'memo'].includes(page) ? page : 'fiches';
    show(view);
    if (page === 'f' && fid) openFiche(fid);
    else if (modal.open) modal.close();
  }
  window.addEventListener('hashchange', route);
  route();
})();
