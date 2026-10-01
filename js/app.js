(function () {
  const $ = s => document.querySelector(s);
  const esc = window.escHTML;
  const store = {
    get(k, d) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* stockage bloqué : on garde l'état en mémoire */ } }
  };

  const state = {
    theme: 'all', tp: 'all', q: '',
    done: new Set(store.get('gl-done', [])),
    visible: [], current: -1
  };

  /* ---------- Thème clair / sombre ---------- */
  $('#theme-btn').addEventListener('click', () => {
    const root = document.documentElement;
    const dark = root.dataset.theme ? root.dataset.theme === 'dark' : matchMedia('(prefers-color-scheme: dark)').matches;
    root.dataset.theme = dark ? 'light' : 'dark';
    try { localStorage.setItem('gl-theme', root.dataset.theme); } catch (e) {}
  });

  /* ---------- Filtres ---------- */
  function chips(el, items, active, onPick) {
    el.innerHTML = items.map(([k, label, color]) =>
      `<button type="button" class="chip${k === active ? ' on' : ''}" data-k="${k}"${color ? ` style="--c:${color}"` : ''}>${color ? '<i></i>' : ''}${esc(label)}</button>`
    ).join('');
    el.onclick = e => { const b = e.target.closest('.chip'); if (b) onPick(b.dataset.k); };
  }

  function renderFilters() {
    chips($('#theme-chips'), [['all', 'Tous les thèmes']].concat(Object.entries(THEMES).map(([k, t]) => [k, t.nom, t.couleur])),
      state.theme, k => { state.theme = k; renderFilters(); renderGrid(); });
    chips($('#tp-chips'), [['all', 'Tous les TP']].concat(Object.entries(TPS)), state.tp,
      k => { state.tp = k; renderFilters(); renderGrid(); });
  }

  const norm = s => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
  const plain = html => html.replace(/<[^>]+>/g, ' ');
  const searchIndex = new Map(FICHES.map(f => [f.id, norm(f.titre + ' ' + f.resume + ' ' + plain(f.corps))]));

  /* ---------- Grille ---------- */
  function renderGrid() {
    const q = norm(state.q.trim());
    state.visible = FICHES.filter(f =>
      (state.theme === 'all' || f.theme === state.theme) &&
      (state.tp === 'all' || f.tps.includes(state.tp)) &&
      (!q || q.split(/\s+/).every(w => searchIndex.get(f.id).includes(w))));

    $('#grid').innerHTML = state.visible.map(f => {
      const t = THEMES[f.theme];
      const n = FICHES.indexOf(f) + 1;
      const badges = [f.corps.includes('class="uml"') ? 'UML' : null, f.corps.includes('class="code') ? 'Code' : null].filter(Boolean);
      return `<a class="card${state.done.has(f.id) ? ' done' : ''}" href="#f/${f.id}" style="--c:${t.couleur}">
        <div class="card-top"><span class="pill">${esc(t.nom)}</span><span class="num">${String(n).padStart(2, '0')}</span></div>
        <h3>${esc(f.titre)}</h3>
        <p>${esc(f.resume)}</p>
        <div class="card-foot">
          <span class="tps">${f.tps.map(k => esc(TPS[k].replace('TP ', ''))).join(' · ')}</span>
          <span class="badges">${badges.map(b => `<span>${b}</span>`).join('')}<span class="check" title="Maîtrisée">✓</span></span>
        </div>
      </a>`;
    }).join('');
    $('#empty').hidden = state.visible.length > 0;
    renderProgress();
  }

  function renderProgress() {
    const n = state.done.size, tot = FICHES.length;
    $('#progress-bar').style.width = (100 * n / tot) + '%';
    $('#progress-txt').textContent = `${n} / ${tot} fiches maîtrisées`;
  }

  $('#search').addEventListener('input', e => { state.q = e.target.value; renderGrid(); });

  /* ---------- Fiche ouverte ---------- */
  const modal = $('#modal');

  function openFiche(id) {
    const f = FICHES.find(x => x.id === id);
    if (!f) return;
    // Navigation précédente/suivante dans la sélection affichée, ou dans tout le paquet si la fiche n'y est pas.
    const list = state.visible.some(x => x.id === id) ? state.visible : FICHES;
    state.current = list.indexOf(f);
    state.list = list;
    const t = THEMES[f.theme];
    modal.style.setProperty('--c', t.couleur);
    $('#m-tags').innerHTML = `<span class="pill">${esc(t.nom)}</span>` + f.tps.map(k => `<span class="tp-tag">${esc(TPS[k])}</span>`).join('');
    $('#m-title').textContent = f.titre;
    $('#m-resume').textContent = f.resume;
    $('#m-body').innerHTML = f.corps;
    $('#m-body').scrollTop = 0;
    $('#m-prev').disabled = state.current <= 0;
    $('#m-next').disabled = state.current >= list.length - 1;
    renderDoneBtn(f.id);
    if (!modal.open) modal.showModal();
    modal.querySelector('.modal-card').scrollTop = 0;
  }

  function renderDoneBtn(id) {
    const b = $('#m-done');
    const done = state.done.has(id);
    b.textContent = done ? '✓ Maîtrisée' : 'Je maîtrise';
    b.classList.toggle('ok', done);
    b.onclick = () => {
      done ? state.done.delete(id) : state.done.add(id);
      store.set('gl-done', [...state.done]);
      renderDoneBtn(id);
      renderGrid();
    };
  }

  const step = d => {
    const f = state.list && state.list[state.current + d];
    if (f) location.hash = 'f/' + f.id;
  };
  $('#m-prev').onclick = () => step(-1);
  $('#m-next').onclick = () => step(1);
  $('#m-close').onclick = () => modal.close();
  modal.addEventListener('click', e => { if (e.target === modal) modal.close(); });
  modal.addEventListener('close', () => { if (location.hash.startsWith('#f/')) history.replaceState(null, '', location.pathname + location.search); });
  modal.addEventListener('keydown', e => {
    if (e.key === 'ArrowRight') step(1);
    if (e.key === 'ArrowLeft') step(-1);
  });

  /* ---------- Quiz ---------- */
  const quiz = { theme: 'all', deck: [], i: 0, ok: 0, ko: [] };
  const shuffle = a => { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };

  function quizStart(deck) {
    quiz.deck = shuffle(deck || QUIZ.filter(x => quiz.theme === 'all' || x.theme === quiz.theme));
    quiz.i = 0; quiz.ok = 0; quiz.ko = [];
    renderQuiz();
  }

  function renderQuizChips() {
    const used = new Set(QUIZ.map(x => x.theme));
    chips($('#quiz-chips'), [['all', 'Tout']].concat(Object.entries(THEMES).filter(([k]) => used.has(k)).map(([k, t]) => [k, t.nom, t.couleur])),
      quiz.theme, k => { quiz.theme = k; renderQuizChips(); quizStart(); });
  }

  function renderQuiz() {
    const flip = $('#flip');
    const wasTurned = flip.classList.contains('turned');
    flip.classList.remove('turned');
    const end = quiz.i >= quiz.deck.length;
    flip.hidden = end; $('#quiz-actions').hidden = end; $('#quiz-end').hidden = !end;
    $('#quiz-score').textContent = `✓ ${quiz.ok}   ✗ ${quiz.ko.length}`;
    if (end) {
      $('#quiz-pos').textContent = 'Terminé';
      $('#quiz-end-txt').innerHTML = `<b>${quiz.ok} / ${quiz.deck.length}</b> bonnes réponses.` + (quiz.ko.length ? ' Tu peux revoir uniquement celles que tu as ratées.' : ' Parfait 🎉');
      $('#btn-retry-ko').hidden = !quiz.ko.length;
      return;
    }
    const item = quiz.deck[quiz.i];
    flip.style.setProperty('--c', THEMES[item.theme].couleur);
    $('#quiz-pos').textContent = `Carte ${quiz.i + 1} / ${quiz.deck.length}`;
    // Si la carte précédente était retournée, on attend qu'elle se remette face cachée pour ne pas dévoiler la réponse suivante.
    const fill = () => { $('#quiz-q').textContent = item.q; $('#quiz-r').innerHTML = item.r; };
    if (wasTurned) setTimeout(fill, 150); else fill();
  }

  const turn = () => $('#flip').classList.toggle('turned');
  $('#flip').addEventListener('click', turn);
  $('#flip').addEventListener('keydown', e => { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); turn(); } });
  const answer = good => {
    if (good) quiz.ok++; else quiz.ko.push(quiz.deck[quiz.i]);
    quiz.i++; renderQuiz();
  };
  $('#btn-ok').onclick = () => answer(true);
  $('#btn-ko').onclick = () => answer(false);
  $('#btn-restart').onclick = () => quizStart();
  $('#btn-retry-ko').onclick = () => quizStart(quiz.ko.slice());

  /* ---------- Lexique ---------- */
  function renderLexique() {
    const q = norm($('#lex-search').value.trim());
    $('#lexique').innerHTML = LEXIQUE
      .filter(([m, d]) => !q || norm(m + ' ' + plain(d)).includes(q))
      .map(([m, d]) => `<div><dt>${esc(m)}</dt><dd>${d}</dd></div>`).join('');
  }
  $('#lex-search').addEventListener('input', renderLexique);

  /* ---------- Navigation par l'URL (liens partageables) ---------- */
  function route() {
    const h = location.hash.slice(1);
    const tab = h === 'quiz' ? 'quiz' : h === 'lexique' ? 'lexique' : 'fiches';
    document.querySelectorAll('.view').forEach(v => { v.hidden = v.id !== 'view-' + tab; });
    document.querySelectorAll('.tabs a').forEach(a => a.classList.toggle('on', a.dataset.tab === tab));
    if (h.startsWith('f/')) openFiche(h.slice(2));
    else if (modal.open) modal.close();
  }
  window.addEventListener('hashchange', route);

  renderFilters();
  renderGrid();
  renderQuizChips();
  quizStart();
  renderLexique();
  route();
})();
