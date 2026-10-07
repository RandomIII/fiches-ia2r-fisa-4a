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

  let M = null;                       // matière ouverte
  const ui = { theme: 'all', tp: 'all', q: '', visible: [], list: [], current: -1 };
  const doneSet = m => new Set(store.get('done:' + m.id, []));
  let done = new Set();

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
  window.addEventListener('load', () => ['#grid', '#m-body', '#m-resume', '#qcm-card', '#lexique'].forEach(s => math($(s))));

  const norm = s => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
  const plain = html => html.replace(/<[^>]+>/g, ' ');

  /* ================= ACCUEIL ================= */
  function renderHome() {
    const cards = MATIERES.map(m => {
      const d = doneSet(m).size, n = m.fiches.length;
      const best = store.get('qcm-best:' + m.id, null);
      return `<a class="matiere" href="#/${m.id}" style="--c:${m.couleur}">
        <div class="mat-band"></div>
        <h2>${esc(m.nom)}</h2>
        <p class="mat-sub">${esc(m.sousTitre || '')}</p>
        <p class="mat-desc">${esc(m.description || '')}</p>
        <div class="mat-stats">
          <span><b>${n}</b> fiches</span><span><b>${m.qcm.length}</b> questions</span><span><b>${m.lexique.length}</b> mots</span>
        </div>
        <div class="progress small"><div class="bar"><span style="width:${n ? 100 * d / n : 0}%"></span></div><span>${d}/${n} maîtrisées${best != null ? ` · meilleur QCM ${best} %` : ''}</span></div>
      </a>`;
    }).join('');
    $('#matieres').innerHTML = cards + `<div class="matiere soon"><h2>Prochaine matière</h2><p class="mat-desc">Bientôt ici : même format, fiches + QCM + lexique.</p></div>`;
  }

  /* ================= FICHES ================= */
  let searchIndex = new Map();

  function openMatiere(m) {
    if (M === m) return;
    M = m;
    done = doneSet(m);
    Object.assign(ui, { theme: 'all', tp: 'all', q: '' });
    $('#search').value = '';
    $('#lex-search').value = '';
    searchIndex = new Map(m.fiches.map(f => [f.id, norm(f.titre + ' ' + f.resume + ' ' + plain(f.corps))]));
    $('#fiches-title').textContent = m.nom + (m.sousTitre ? ' — ' + m.sousTitre : '');
    renderFilters(); renderGrid(); renderLexique();
    qcm.theme = 'all'; qcm.type = 'all'; qcm.tp = 'all'; renderQcmChips(); qcmStart();
  }

  function renderFilters() {
    chips($('#theme-chips'), [['all', 'Tous les thèmes']].concat(Object.entries(M.themes).map(([k, t]) => [k, t.nom, t.couleur])),
      ui.theme, k => { ui.theme = k; renderFilters(); renderGrid(); });
    const tps = M.tps && Object.keys(M.tps).length ? M.tps : null;
    $('#tp-chips').hidden = !tps;
    if (tps) chips($('#tp-chips'), [['all', M.filtreLabel || 'Tous les TP']].concat(Object.entries(tps)), ui.tp,
      k => { ui.tp = k; renderFilters(); renderGrid(); });
  }

  function renderGrid() {
    const q = norm(ui.q.trim());
    ui.visible = M.fiches.filter(f =>
      (ui.theme === 'all' || f.theme === ui.theme) &&
      (ui.tp === 'all' || (f.tps || []).includes(ui.tp)) &&
      (!q || q.split(/\s+/).every(w => searchIndex.get(f.id).includes(w))));

    $('#grid').innerHTML = ui.visible.map(f => {
      const t = M.themes[f.theme];
      const n = M.fiches.indexOf(f) + 1;
      const badges = [f.corps.includes('class="uml"') ? 'UML' : null, f.corps.includes('class="code') ? 'Code' : null].filter(Boolean);
      return `<a class="card${done.has(f.id) ? ' done' : ''}" href="#/${M.id}/f/${f.id}" style="--c:${t.couleur}">
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
    const n = done.size, tot = M.fiches.length;
    $('#progress-bar').style.width = (100 * n / tot) + '%';
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

  const step = d => { const f = ui.list[ui.current + d]; if (f) location.hash = `#/${M.id}/f/${f.id}`; };
  $('#m-prev').onclick = () => step(-1);
  $('#m-next').onclick = () => step(1);
  // On nettoie l'URL nous-mêmes plutôt que via l'événement 'close', qui n'est pas toujours livré ;
  // sinon recliquer sur la même carte ne change pas le hash et la fiche ne se rouvre pas.
  const closeFiche = () => {
    if (modal.open) modal.close();
    if (M && /\/f\//.test(location.hash)) history.replaceState(null, '', `#/${M.id}`);
  };
  $('#m-close').onclick = closeFiche;
  modal.addEventListener('click', e => { if (e.target === modal) closeFiche(); });
  modal.addEventListener('cancel', e => { e.preventDefault(); closeFiche(); });
  modal.addEventListener('close', () => { if (M && /\/f\//.test(location.hash)) history.replaceState(null, '', `#/${M.id}`); });
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

  function qcmStart(deck) {
    qcm.full = !deck;
    qcm.deck = shuffle((deck || M.qcm.filter(x =>
      (qcm.theme === 'all' || x.theme === qcm.theme) && (qcm.type === 'all' || x.type === qcm.type) &&
      (qcm.tp === 'all' || (x.tps || []).includes(qcm.tp)))).slice());
    qcm.i = 0; qcm.ok = 0; qcm.ko = [];
    renderQcm();
  }

  function renderQcmChips() {
    const used = new Set(M.qcm.map(x => x.theme));
    chips($('#qcm-type-chips'), types().map(([k, l]) => [k, l + ' · ' + (k === 'all' ? M.qcm.length : M.qcm.filter(x => x.type === k).length)]),
      qcm.type, k => { qcm.type = k; renderQcmChips(); qcmStart(); });
    chips($('#qcm-chips'), [['all', 'Tous les thèmes']].concat(Object.entries(M.themes).filter(([k]) => used.has(k)).map(([k, t]) => [k, t.nom, t.couleur])),
      qcm.theme, k => { qcm.theme = k; renderQcmChips(); qcmStart(); });
    // Filtre par partie / TP seulement si les questions de la matière en sont étiquetées.
    const parTp = M.tps && M.qcm.some(x => x.tps);
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
    if (qcm.full && qcm.theme === 'all' && qcm.type === 'all' && qcm.tp === 'all') {
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
  }

  function route() {
    let h = location.hash.replace(/^#\/?/, '');
    // Liens partagés avant le menu multi-matières : #f/<id>, #quiz, #lexique.
    const legacy = h.match(/^(f\/.+|quiz|lexique)$/);
    if (legacy && MATIERES[0]) {
      const rest = h === 'quiz' ? 'qcm' : h;
      return location.replace(`#/${MATIERES[0].id}/${rest}`);
    }
    const [mid, page, fid] = h.split('/');
    const m = MATIERES.find(x => x.id === mid);
    if (!m) {
      if (modal.open) modal.close();
      M = null;
      $('#tabs').hidden = true;
      $('#brand-title').textContent = 'Révisions';
      $('#brand-sub').textContent = 'Polytech 4A';
      document.title = 'Révisions Polytech 4A';
      renderHome(); show('home');
      return;
    }
    openMatiere(m);
    $('#tabs').hidden = false;
    $('#tabs').style.setProperty('--c', m.couleur);
    document.querySelectorAll('#tabs a').forEach(a => { a.href = `#/${m.id}` + (a.dataset.tab === 'fiches' ? '' : '/' + a.dataset.tab); });
    $('#brand-title').textContent = m.nom;
    $('#brand-sub').textContent = '← Toutes les matières';
    document.title = m.nom + ' — Révisions';
    const view = page === 'qcm' ? 'qcm' : page === 'lexique' ? 'lexique' : 'fiches';
    show(view);
    if (page === 'f' && fid) openFiche(fid);
    else if (modal.open) modal.close();
  }
  window.addEventListener('hashchange', route);
  route();
})();
