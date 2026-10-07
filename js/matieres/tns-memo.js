/*
 * Mémos A4 recto verso de TNS, un par partie.
 * Recto = tout le cours (formules encadrées + explication courte).
 * Verso = tous les exercices des TD/TP de la partie, avec méthode et solution.
 * But : avec seulement la feuille, on fait tout le TD. Remplir les 3 colonnes sans déborder
 * (le contrôle se fait à l'écran : rien ne doit dépasser en bas de la 3e colonne).
 */
(function () {
  const M = MATIERES.find(m => m.id === 'tns');
  if (!M) return;
  const { rect, tri, sinc } = SIG;
  const PI = Math.PI, cos = Math.cos, sin = Math.sin, abs = Math.abs;

  const S = (t, h) => `<section class="ms"><h3>${t}</h3>${h}</section>`;
  const K = h => `<div class="mk">${h}</div>`;
  const F = h => `<div class="mf">${h}</div>`;
  const EX = (t, h) => `<div class="mex"><b>${t}</b> ${h}</div>`;
  const P = h => `<div class="mp"><b>Pièges.</b> ${h}</div>`;
  const small = o => plot(Object.assign({ w: 230, h: 78 }, o));

  M.memos = {

/* ================================================================ PARTIE 1 */
p1: {
  titre: 'Partie 1 — Signaux continus & Fourier',
  couleur: '#3b6fd8',
  labels: ['Cours', 'Exercices'],
  pages: [
/* ---------------------------------------------------------------- P1 recto : cours */
R`
${S('Signal : définitions et classes', R`
<p>Signal = fonction qui porte une information : $x(t)$ continu ($t\in\mathbb R$), $x(n)$ discret ($n\in\mathbb Z$), $I(m,n)$ image. Deux vues de la même info : <b>temps</b> (quand) et <b>fréquence</b> (quelles fréquences).</p>
${table(['Classe', 'Définition'], [
  ['périodique', '$x(t+T_0)=x(t)\\ \\forall t$ ; $T_0$ = plus petite période, $f_0 = 1/T_0$'],
  ['causal', '$x(t) = 0$ pour $t\\lt0$ (temps réel : pas d’entrée future)'],
  ['déterministe / aléatoire', 'formule connue / réalisation d’un bruit'],
  ['énergie', '$E = \\int|x(t)|^2dt \\lt\\infty$ (signal qui s’éteint)'],
  ['puissance', '$P = \\frac1{T_0}\\int_{T_0}|x|^2dt$ (périodique : $E=\\infty$)']
])}
<p>Ces propriétés sont <b>indépendantes</b>. Ex. : $\mathrm{rect}(t/T)$ → $E = T$ ; $e^{-at}u(t)$ → $E = \frac1{2a}$ ; $A\cos$ → $P = \frac{A^2}2$ ; constante $A$ → $P = A^2$.</p>
`)}
${S('Signaux élémentaires', R`
${table(['Signal', 'Définition', 'Remarque'], [
  [R`$\delta(t)$`, R`0 si $t\ne0$, $\int\delta=1$`, 'distribution ; flèche, hauteur = poids'],
  [R`$u(t)$`, R`1 si $t\ge0$`, R`$u' = \delta$`],
  [R`$r(t)$`, R`$t\,u(t)$`, R`$r' = u$`],
  [R`$\mathrm{rect}(t/T)$`, R`1 si $|t|\le\frac T2$`, R`largeur $T$, centrée en 0`],
  [R`$\mathrm{triang}(t)$`, R`$\max(1-|t|,0)$`, R`base $[-1,1]$, $=\mathrm{rect}*\mathrm{rect}$`],
  [R`$\mathrm{sinc}(t)$`, R`$\frac{\sin\pi t}{\pi t}$, $\mathrm{sinc}(0)=1$`, 'nul aux entiers ≠ 0'],
  [R`$\text{Ш}_{T_e}(t)$`, R`$\sum_n\delta(t-nT_e)$`, 'peigne = échantillonnage idéal']
])}
${small({ x: [-3, 3], y: [-0.35, 1.2], xl: 't', fns: [{ f: rect }, { f: tri, cls: 'c2' }, { f: sinc, cls: 'c3' }], xt: [[-1, '-1'], [1, '1'], [2, '2']], cap: 'rect (bleu) · triang (orange) · sinc (vert)' })}
${F(R`$A\cos(2\pi f_0t+\varphi)$ : $T_0 = \frac1{f_0}$, $\omega_0 = 2\pi f_0$ ; $\cos(\omega t)$ → $f_0 = \frac{\omega}{2\pi}$`)}
<p>Ex. $\cos(8000\pi t)$ → 4 kHz ; $\cos(40\pi t)$ → 20 Hz ; $3\cos(100\pi t+\frac\pi4)$ → 50 Hz.</p>
`)}
${S('Dirac : propriétés', R`
${F(R`$x(t)\delta(t-t_0) = x(t_0)\delta(t-t_0)$&emsp;$x(t)*\delta(t-t_0) = x(t-t_0)$`)}
<p>$\int x(t)\delta(t-t_0)dt = x(t_0)$ · $\delta(at) = \frac{\delta(t)}{|a|}$ · $\delta(-t)=\delta(t)$ · $\delta(t-a)*\delta(t-b) = \delta(t-a-b)$ · $\delta \xrightarrow{\mathcal F} 1$ (toutes les fréquences).</p>
`)}
${S('Opérations sur le temps', R`
${table(['Écriture', 'Effet'], [
  [R`$x(t-t_0)$, $t_0\gt0$`, R`retard : <b>droite</b> de $t_0$`], [R`$x(t+t_0)$`, R`avance : <b>gauche</b> de $t_0$`],
  [R`$x(-t)$`, 'miroir (axe vertical)'], [R`$x(t/T)$`, R`$T\gt1$ dilate, $0\lt T\lt1$ comprime`],
  [R`$x(at)$`, R`$|a|\gt1$ comprime de $|a|$`], [R`$A\,x(t)$`, R`hauteur ×$A$ ($A\lt0$ : retournée)`]
])}
${F(R`$x(at+b) = x\big(a(t-t_0)\big)$, $t_0 = -\frac ba$ : point $c$ de $x$ → $t = \frac{c-b}{a}$`)}
<p>Support $[\alpha,\beta]$ → $\left[\frac{\alpha-b}a, \frac{\beta-b}a\right]$ (réordonner si $a\lt0$ = retourné). Ordre : <b>échelle puis décalage</b>.</p>
`)}
${S('Convolution', R`
${F(R`$$(x*h)(t) = \int_{-\infty}^{+\infty}x(\tau)\,h(t-\tau)\,d\tau$$`)}
<p>Commutative, associative, distributive, neutre $\delta$. Filtre linéaire invariant : $y = x*h$ ($h$ = réponse impulsionnelle).<br>
<b>Graphique</b> : ① retourner $h$ ② glisser de $t$ ③ multiplier par $x$ ④ aire. <b>Support</b> : $[a_1+a_2,\ b_1+b_2]$ (largeurs s'additionnent). Signaux causaux : $\int_0^t$.</p>
${table(['Convolution', 'Résultat'], [
  ['$\\mathrm{rect}*\\mathrm{rect}$', '$\\mathrm{triang}$ ($1+t$ sur $[-1,0]$, $1-t$ sur $[0,1]$)'],
  ['$\\mathrm{rect}(\\frac tT)*\\mathrm{rect}(\\frac tT)$', '$T\\,\\mathrm{triang}(\\frac tT)$'],
  ['$e^{-t}u(t)*u(t)$', '$(1-e^{-t})u(t)$'],
  ['$e^{-at}u*e^{-bt}u$', '$\\frac{e^{-at}-e^{-bt}}{b-a}u(t)$'],
  ['$x*\\sum_k c_k\\delta(t-t_k)$', '$\\sum_k c_k\\,x(t-t_k)$ (copies)']
])}
`)}
${S('Dans la vraie vie', R`
<p>Le <b>la</b> du diapason : $\cos(2\pi\,440\,t)$. Le <b>secteur</b> : $325\cos(100\pi t)$ (230 V efficaces, 50 Hz). Une <b>note de guitare</b> = fondamental + harmoniques (série de Fourier) : les harmoniques font le timbre. Un <b>égaliseur</b> audio multiplie le spectre par $H(f)$. La <b>réverbération</b> d'une salle = convolution par sa réponse impulsionnelle (un clap de mains ≈ un Dirac).</p>
`)}
${S('Euler & trigo', R`
${F(R`$\cos\theta = \frac{e^{j\theta}+e^{-j\theta}}2$&emsp;$\sin\theta = \frac{e^{j\theta}-e^{-j\theta}}{2j}$`)}
<p>$\cos a\cos b = \frac12[\cos(a\!-\!b)+\cos(a\!+\!b)]$ · $\sin a\sin b = \frac12[\cos(a\!-\!b)-\cos(a\!+\!b)]$ · $\sin a\cos b = \frac12[\sin(a\!+\!b)+\sin(a\!-\!b)]$ · $\cos^2a = \frac{1+\cos2a}2$ · $\sin\theta = \cos(\theta-\frac\pi2)$ · $|e^{j\theta}| = 1$.</p>
`)}
${S('Séries de Fourier (signal périodique)', R`
${F(R`$$x(t) = A_0 + \sum_{n\ge1}A_n\cos(n\omega_0t+\varphi_n),\ \ \omega_0 = \tfrac{2\pi}{T_0}$$`)}
<p>$A_0$ = <b>valeur moyenne</b> ; $n=1$ fondamental ($f_0$) ; $n\ge2$ harmoniques ($nf_0$).<br>
<b>Coefficients</b> : $a_0 = \frac1{T_0}\!\int_{T_0}\!x$, $a_n = \frac2{T_0}\!\int_{T_0}\!x\cos n\omega_0t$, $b_n = \frac2{T_0}\!\int_{T_0}\!x\sin n\omega_0t$ ; $A_n = \sqrt{a_n^2+b_n^2}$, $\varphi_n = \mathrm{atan2}(-b_n,a_n)$.<br>
<b>Complexe</b> : $c_n = \frac1{T_0}\int_{T_0}x\,e^{-jn\omega_0t}dt$, $|c_n| = \frac{A_n}2$. <b>Parité</b> : pair → $b_n=0$ ; impair → $a_n = a_0 = 0$.<br>
<b>Parseval</b> : $P = A_0^2 + \frac12\sum A_n^2$.<br>
<b>Créneau</b> 0/1, 50 % : $A_0 = \frac12$, $A_{2m+1} = \frac2{(2m+1)\pi}$, harmoniques paires nulles.<br>
Spectre <b>unilatéral</b> : raie $A_n$ en $nf_0$ ; <b>bilatéral</b> : $\frac{A_n}2$ en $\pm nf_0$. Périodique ⟺ <b>raies</b>.</p>
`)}
${S('Transformée de Fourier', R`
${F(R`$$X(f) = \int x(t)e^{-j2\pi ft}dt \qquad x(t) = \int X(f)e^{j2\pi ft}df$$`)}
<p>$|X|$ = spectre d'amplitude, $\arg X$ = phase. $x$ réel ⇒ $|X|$ pair, phase impaire. Court en temps ⟺ large en fréquence. Dualité : $\delta\leftrightarrow1$, $\mathrm{rect}\leftrightarrow\mathrm{sinc}$.</p>
${table(['Propriété', 'Temps', 'Fréquence'], [
  ['Linéarité', '$ax+by$', '$aX+bY$'], ['Retard', '$x(t-t_0)$', '$X\\,e^{-j2\\pi ft_0}$ (|X| inchangé)'],
  ['Modulation', '$x\\,e^{j2\\pi f_0t}$', '$X(f-f_0)$'], ['Échelle', '$x(t/T)$', '$|T|X(Tf)$'],
  ['Dérivée', "$x'(t)$", '$j2\\pi f\\,X$'], ['Convolution', '$x*h$', '$X\\cdot H$ (filtrer)'],
  ['Produit', '$x\\cdot h$', '$X*H$ (échantillonner)'], ['Parseval', '$\\int|x|^2$', '$\\int|X|^2$']
])}
${table(['$x(t)$', '$X(f)$', '$x(t)$', '$X(f)$'], [
  ['$\\delta(t)$', '$1$', '$1$', '$\\delta(f)$'],
  ['$\\delta(t-t_0)$', '$e^{-j2\\pi ft_0}$', '$e^{j2\\pi f_0t}$', '$\\delta(f-f_0)$'],
  ['$\\cos2\\pi f_0t$', '$\\frac12[\\delta(f\\!-\\!f_0)\\!+\\!\\delta(f\\!+\\!f_0)]$', '$\\sin2\\pi f_0t$', '$\\frac1{2j}[\\delta(f\\!-\\!f_0)\\!-\\!\\delta(f\\!+\\!f_0)]$'],
  ['$\\mathrm{rect}(t)$', '$\\mathrm{sinc}(f)$', '$\\mathrm{sinc}(t)$', '$\\mathrm{rect}(f)$'],
  ['$\\mathrm{triang}(t)$', '$\\mathrm{sinc}^2(f)$', '$\\sum\\delta(t-kT)$', '$\\frac1T\\sum\\delta(f-\\frac nT)$'],
  ['$e^{-at}u(t)$', '$\\frac1{a+j2\\pi f}$', '$e^{-a|t|}$', '$\\frac{2a}{a^2+(2\\pi f)^2}$']
])}
${F(R`$A\cos(2\pi f_0t+\varphi) \to \frac A2e^{j\varphi}\delta(f-f_0) + \frac A2e^{-j\varphi}\delta(f+f_0)$`)}
<p><b>Modulation</b> : ×$\cos2\pi f_0t$ recopie $X$ en $\pm f_0$ avec ×$\frac12$.</p>
${plots(
  plot({ x: [-2, 2], y: [-0.3, 1.3], w: 140, h: 75, xl: 't', fns: [{ f: t => rect(t / 2) }], xt: [[-1, '-T/2'], [1, 'T/2']], cap: 'rect(t/T)' }),
  plot({ x: [-3, 3], y: [-0.5, 2.3], w: 140, h: 75, xl: 'f', fns: [{ f: f => 2 * sinc(2 * f / 2) }], xt: [[-1, '-1/T'], [1, '1/T']], yt: [[2, 'T']], cap: 'T sinc(Tf)' })
)}
`)}
${S('Symétries et valeurs utiles', R`
${table(['$x(t)$', '$X(f)$'], [['réel', '$|X|$ pair, $\\arg X$ impair'], ['réel pair', 'réel pair'], ['réel impair', 'imaginaire pur, impair'], ['retardé', 'même $|X|$, phase $-2\\pi ft_0$']])}
<p>$X(0) = \int x(t)dt$ (aire) · $x(0) = \int X(f)df$ · $\int\mathrm{sinc} = 1$ · $\int\mathrm{sinc}^2 = 1$ · durée × largeur de bande ≈ constante.</p>
`)}
${S('Systèmes linéaires invariants (filtres)', R`
<p><b>Linéaire</b> (superposition) + <b>invariant</b> (même réponse si on décale l'entrée) ⇒ entièrement décrit par $h(t)$ = réponse à $\delta$ :</p>
${F(R`$y = x*h \iff Y(f) = X(f)\,H(f)$ ; $H$ = fonction de transfert`)}
<p>$|H|$ = gain par fréquence, $\arg H$ = déphasage. <b>Causal</b> : $h(t) = 0$ pour $t\lt0$. <b>Stable</b> : $\int|h|\lt\infty$. Passe-bas idéal de coupure $f_c$ : $H = \mathrm{rect}(\frac f{2f_c})$, $h = 2f_c\,\mathrm{sinc}(2f_ct)$ (non causal). Une sinusoïde en entrée ressort sinusoïde de <b>même fréquence</b>, amplitude ×$|H(f_0)|$, phase $+\arg H(f_0)$.</p>
`)}
${S('Signal périodique = motif * peigne', R`
${F(R`$x_p = x_m * \text{Ш}_{T_0}$ ⇒ $X_p(f) = \frac1{T_0}\sum_n X_m\!\left(\frac n{T_0}\right)\delta\!\left(f-\frac n{T_0}\right)$`)}
<p>Les raies sont les <b>valeurs de la TF du motif</b> aux multiples de $f_0$ : $c_n = \frac1{T_0}X_m(nf_0)$. Ex. créneau : motif $\mathrm{rect}(\frac t{T_0/2})$ → $c_n = \frac12\mathrm{sinc}(\frac n2)$ → $A_n = \mathrm{sinc}(\frac n2)$ = $\frac2{n\pi}$ (impairs), 0 (pairs).</p>
`)}
${S('Galerie temps ↔ fréquence', R`
${plots(
  plot({ x: [-2, 2], y: [-0.2, 1.3], w: 140, h: 52, xl: 't', diracs: [{ x: 0, a: 1 }], cap: 'δ(t)' }),
  plot({ x: [-2, 2], y: [-0.2, 1.3], w: 140, h: 52, xl: 'f', fns: [{ f: () => 1 }], cap: '1 (toutes les fréquences)' }),
  plot({ x: [-2, 2], y: [-1.3, 1.3], w: 140, h: 52, xl: 't', fns: [{ f: t => cos(2 * PI * 1.5 * t) }], cap: 'cos(2πf₀t)' }),
  plot({ x: [-2, 2], y: [-0.2, 1.3], w: 140, h: 52, xl: 'f', diracs: [{ x: -1, a: 0.6 }, { x: 1, a: 0.6 }], xt: [[-1, '-f0'], [1, 'f0']], cap: '2 raies ½' }),
  plot({ x: [-2, 3], y: [-0.2, 1.3], w: 140, h: 52, xl: 't', fns: [{ f: t => (t >= 0 ? Math.exp(-1.5 * t) : 0) }], cap: 'e^(−at) u(t)' }),
  plot({ x: [-3, 3], y: [-0.2, 1.3], w: 140, h: 52, xl: 'f', fns: [{ f: f => 1 / Math.sqrt(1 + 4 * f * f) }], cap: '|X| = 1/√(a²+4π²f²)' })
)}
`)}
${S('Astuce : dériver pour calculer une TF', R`
<p>Un signal fait de morceaux droits devient, une fois dérivé, des portes ; dérivé deux fois, des Dirac. Or $x' \to j2\pi f X$ :</p>
${F(R`$X(f) = \dfrac{\mathcal F\{x''\}}{(j2\pi f)^2}$&emsp;ex. $\mathrm{triang}'' = \delta(t+1) - 2\delta(t) + \delta(t-1)$`)}
<p>→ $\mathcal F = e^{j2\pi f} - 2 + e^{-j2\pi f} = 2\cos2\pi f - 2 = -4\sin^2\pi f$ → $X = \frac{-4\sin^2\pi f}{-4\pi^2f^2} = \mathrm{sinc}^2(f)$ ✓. Porte : $\mathrm{rect}' = \delta(t+\frac12) - \delta(t-\frac12)$.</p>
`)}
${S('Somme de sinusoïdes', R`
<p>Période commune : $f_0 = \mathrm{PGCD}$ des fréquences ($80$ et $120$ Hz → $f_0 = 40$ Hz, $T_0 = 25$ ms). Si le rapport des fréquences est irrationnel → <b>pas</b> périodique. Bande $B$ = la plus haute.</p>
`)}
`,
/* ---------------------------------------------------------------- P1 verso : exercices */
R`
${S('TD 1 — Ex. 1 : tracer des portes', R`
${K(R`<b>Méthode</b> : écrire chaque porte sous la forme $A\,\mathrm{rect}\big(\frac{t-t_0}{T}\big)$ → hauteur $A$, centre $t_0$, largeur $T$.`)}
<p>(a) $\mathrm{rect}(\frac t2)$ : centre 0, largeur 2 → $[-1,1]$, hauteur 1.<br>
(b) $\mathrm{rect}(\frac t2-1) = \mathrm{rect}(\frac{t-2}2)$ : centre 2, largeur 2 → $[1,3]$.<br>
(c) $-2\,\mathrm{rect}(\frac{2t+1}2) = -2\,\mathrm{rect}(t+\frac12)$ : centre $-\frac12$, largeur 1 → $[-1,0]$, hauteur $-2$.</p>
${EX('(d)', R`$\mathrm{rect}(\frac t2)*[\delta(t+1)-\delta(t)+2\delta(t-1)-\delta(t-\frac32)]$. Distributivité + $x*\delta(t-a) = x(t-a)$ : 4 portes de largeur 2 → $+1$ sur $[-2,0]$, $-1$ sur $[-1,1]$, $+2$ sur $[0,2]$, $-1$ sur $[\frac12,\frac52]$. Additionner intervalle par intervalle :`)}
${table(['$t$', '[−2,−1]', '[−1,0]', '[0,½]', '[½,1]', '[1,2]', '[2,5/2]'], [['$y$', '1', '0', '1', '0', '1', '−1']])}
${small({ x: [-2.6, 3], y: [-1.4, 1.5], xl: 't', fns: [{ f: t => rect((t + 1) / 2) - rect(t / 2) + 2 * rect((t - 1) / 2) - rect((t - 1.5) / 2) }], xt: [[-2, '-2'], [-1, '-1'], [1, '1'], [2, '2']] })}
`)}
${S('TD 1 — Ex. 2 : transformer x(t) (vit sur [0, 2])', R`
${K(R`<b>Méthode</b> : pour $x(at+b)$, chaque point $c$ de $x$ va en $t = \frac{c-b}a$. Faire un <b>tableau</b> avec les points caractéristiques de $x$ ($0, 1, 2$) et leurs nouvelles positions, puis relier. Si $a\lt0$ l'ordre s'inverse (retournement). Le facteur devant multiplie la hauteur.`)}
${table(['Signal', 'points 0 · 1 · 2 →', 'support'], [
  ['$x(t+1)$', '$-1 \\cdot 0 \\cdot 1$', '$[-1,1]$'],
  ['$x(t-1)$', '$1 \\cdot 2 \\cdot 3$', '$[1,3]$'],
  ['$x(-t+1)$', '$1 \\cdot 0 \\cdot -1$ (retourné)', '$[-1,1]$'],
  ['$x(\\frac32t)$', '$0 \\cdot \\frac23 \\cdot \\frac43$', '$[0,\\frac43]$'],
  ['$x(\\frac32t+1)$', '$-\\frac23 \\cdot 0 \\cdot \\frac23$', '$[-\\frac23,\\frac23]$'],
  ['$2x(-\\frac32(t-1))$', '$1 \\cdot \\frac13 \\cdot -\\frac13$, ×2', '$[-\\frac13,1]$']
])}
<p>Vérif rapide : la valeur $x(0)$ doit se retrouver au point où l'argument vaut 0.</p>
`)}
${S('TD 1 — Ex. 3 : x(t) = cos(40πt) cos(200πt)', R`
<p><b>Tracé</b> sur $[0;0{,}1]$ s : porteuse 100 Hz (période 10 ms, 10 oscillations) dans l'enveloppe $\pm\cos(40\pi t)$ (20 Hz, période 50 ms ; s'annule en 12,5 / 37,5 / 62,5 / 87,5 ms).</p>
${EX('Méthode 1 (trigo)', R`$\cos a\cos b = \frac12[\cos(a-b)+\cos(a+b)]$ ⇒ $x = \frac12\cos(2\pi\,80t) + \frac12\cos(2\pi\,120t)$, puis paire du cos :`)}
${F(R`$X(f) = \frac14[\delta(f-80)+\delta(f+80)+\delta(f-120)+\delta(f+120)]$`)}
${EX('Méthode 2 (produit → convolution)', R`$X = \frac12[\delta(f\!-\!20)+\delta(f\!+\!20)] * \frac12[\delta(f\!-\!100)+\delta(f\!+\!100)]$ ; $\delta(f-a)*\delta(f-b) = \delta(f-a-b)$ → raies en $\pm100\pm20$ = $\pm80, \pm120$, poids $\frac14$.`)}
${small({ x: [-150, 150], y: [-0.05, 0.36], xl: 'f (Hz)', diracs: [-120, -80, 80, 120].map(x => ({ x, a: 0.25, l: '¼' })), xt: [[-120, '-120'], [-80, '-80'], [80, '80'], [120, '120']], cap: 'Spectre d’amplitude : 4 raies de ¼' })}
`)}
${S('Exos types : TF', R`
${EX('Par la définition (rect)', R`$\int_{-1/2}^{1/2}e^{-j2\pi ft}dt = \left[\frac{e^{-j2\pi ft}}{-j2\pi f}\right]_{-1/2}^{1/2} = \frac{e^{j\pi f}-e^{-j\pi f}}{j2\pi f} = \frac{\sin\pi f}{\pi f}$.`)}
${EX('Par la définition (exp)', R`$\int_0^\infty e^{-(a+j2\pi f)t}dt = \frac1{a+j2\pi f}$ ; $|X| = \frac1{\sqrt{a^2+4\pi^2f^2}}$, $\arg X = -\arctan\frac{2\pi f}a$.`)}
${K(R`<b>Par les propriétés</b> : reconnaître une paire connue, puis appliquer échelle / retard / modulation / linéarité.`)}
${table(['$x(t)$', '$X(f)$', 'propriété'], [
  ['$2\\mathrm{rect}(\\frac{t-1}3)$', '$6\\,\\mathrm{sinc}(3f)e^{-j2\\pi f}$', 'échelle + retard'],
  ['$\\mathrm{rect}(t)\\cos2\\pi f_0t$', '$\\frac12[\\mathrm{sinc}(f\\!-\\!f_0)+\\mathrm{sinc}(f\\!+\\!f_0)]$', 'modulation'],
  ['$\\cos^2(2\\pi f_0t)$', '$\\frac12\\delta(f)+\\frac14[\\delta(f\\!\\mp\\!2f_0)]$', '$\\cos^2 = \\frac{1+\\cos2a}2$'],
  ['$1+\\cos(2\\pi10t)$', '$\\delta(f)+\\frac12[\\delta(f\\!\\mp\\!10)]$', 'linéarité'],
  ['$\\mathrm{triang}(t/T)$', '$T\\,\\mathrm{sinc}^2(Tf)$', 'échelle'],
  ['$\\sin(2\\pi f_0t)$', 'raies $\\frac12$ en $\\pm f_0$, phase $\\mp\\frac\\pi2$', 'Euler']
])}
${K(R`<b>Tracer un spectre</b> : Dirac → flèches (hauteur = |poids|) ; fonction continue → courbe de $|X(f)|$ ; phase à part. Toujours les deux côtés ($f\lt0$) en bilatéral.`)}
`)}
${S('Exos types : convolution & séries', R`
${EX('rect * rect', R`$t\le-1$ : 0 ; $-1\le t\le0$ : recouvrement $[-\frac12, t+\frac12]$ → $1+t$ ; $0\le t\le1$ : $1-t$ ; $t\ge1$ : 0 → $\mathrm{triang}(t)$.`)}
${EX('Causal', R`$e^{-t}u(t)*u(t) = \int_0^te^{-\tau}d\tau = 1-e^{-t}$ pour $t\ge0$.`)}
${EX('Créneau (série)', R`pair, $\pm\frac{T_0}4$ autour de 0 : $a_n = \frac2{T_0}\int_{-T_0/4}^{T_0/4}\cos(n\omega_0t)dt = \frac{2}{n\pi}\sin\frac{n\pi}2$ → $0$ ($n$ pair), $\pm\frac2{n\pi}$ ($n$ impair) ; $a_0 = \frac12$.`)}
${EX('Énergie', R`$x = e^{-2t}u(t)$ : $E = \int_0^\infty e^{-4t}dt = \frac14$.`)}
`)}
${S('Exos types : transformer un signal donné par un graphe', R`
<p>Exemple : $x$ = rampe de 0 à 1 sur $[0,1]$ puis 1 sur $[1,2]$.</p>
${plots(
  plot({ x: [-2.5, 3], y: [-0.2, 1.3], w: 140, h: 70, xl: 't', fns: [{ f: t => (t < 0 || t > 2 ? 0 : t < 1 ? t : 1) }], xt: [[1, '1'], [2, '2']], cap: 'x(t)' }),
  plot({ x: [-2.5, 3], y: [-0.2, 1.3], w: 140, h: 70, xl: 't', fns: [{ f: t => { const u = -t + 1; return u < 0 || u > 2 ? 0 : u < 1 ? u : 1; } }], xt: [[-1, '-1'], [1, '1']], cap: 'x(−t+1)' })
)}
${plots(
  plot({ x: [-2.5, 3], y: [-0.2, 1.3], w: 140, h: 70, xl: 't', fns: [{ f: t => { const u = 2 * t; return u < 0 || u > 2 ? 0 : u < 1 ? u : 1; } }], xt: [[0.5, '½'], [1, '1']], cap: 'x(2t) : comprimé' }),
  plot({ x: [-2.5, 3], y: [-0.2, 1.3], w: 140, h: 70, xl: 't', fns: [{ f: t => { const u = t / 2 + 1; return u < 0 || u > 2 ? 0 : u < 1 ? u : 1; } }], xt: [[-2, '-2'], [2, '2']], cap: 'x(t/2+1) : dilaté, [−2,2]' })
)}
`)}
${S('Exos types : convolutions et TF « astucieuses »', R`
${EX('rect(t) * rect(t/2)', R`largeurs 1 et 2 → support $[-\frac32,\frac32]$ ; <b>trapèze</b> : plateau de hauteur 1 sur $[-\frac12,\frac12]$, rampes sur $[-\frac32,-\frac12]$ et $[\frac12,\frac32]$.`)}
${EX('TF du triangle', R`$\mathrm{triang} = \mathrm{rect}*\mathrm{rect}$ → $\mathrm{sinc}\cdot\mathrm{sinc} = \mathrm{sinc}^2(f)$ (convolution → produit).`)}
${EX('Spectre → signal', R`raies $\frac32$ en $\pm200$ Hz et $\delta(f)$ ×2 → $x(t) = 2 + 3\cos(2\pi\,200t)$ (hauteur bilatérale ×2 = amplitude).`)}
${EX('Parseval', R`$E(\mathrm{sinc}) = \int\mathrm{sinc}^2 = \int\mathrm{rect}^2 = 1$.`)}
${EX('Sortie d’un filtre', R`$x = \cos(2\pi\,50t)$ dans $H(f) = \frac{1}{1+jf/50}$ : $|H(50)| = \frac1{\sqrt2}$, $\arg = -\frac\pi4$ → $y = 0{,}71\cos(2\pi\,50t - \frac\pi4)$.`)}
${EX('Trapèze', R`$\mathrm{rect}(t)*\mathrm{rect}(\frac t2) \to \mathrm{sinc}(f)\cdot2\,\mathrm{sinc}(2f)$.`)}
${EX('Exponentielle bilatérale', R`$e^{-|t|} \to \frac{2}{1+4\pi^2f^2}$ (paire avec $a = 1$).`)}
`)}
${S('Exo type : convolution porte × exponentielle', R`
<p>$x = u(t) - u(t-2)$ (porte $[0,2]$), $h = e^{-t}u(t)$, $y = \int_0^{?}e^{-(t-\tau)}d\tau$ :</p>
<ul><li>$t\lt0$ : $y = 0$ (pas de recouvrement)</li>
<li>$0\le t\le2$ : $y = \int_0^te^{-(t-\tau)}d\tau = 1 - e^{-t}$ (charge)</li>
<li>$t\gt2$ : $y = \int_0^2e^{-(t-\tau)}d\tau = e^{-(t-2)} - e^{-t}$ (décharge)</li></ul>
${small({ x: [-0.5, 6], y: [-0.1, 1.15], h: 62, xl: 't', fns: [{ f: t => (t >= 0 && t <= 2 ? 1 : 0), cls: 'muted', dash: true }, { f: t => (t < 0 ? 0 : t <= 2 ? 1 - Math.exp(-t) : Math.exp(-(t - 2)) - Math.exp(-t)) }], xt: [[2, '2']], cap: 'Sortie d’un filtre RC à une porte : charge puis décharge' })}
`)}
${S('Exo type : série de Fourier donnée', R`
<p>$x = 1 + 2\cos(2\pi\,50t) + \cos(2\pi\,150t + \frac\pi3)$ : $f_0 = 50$ Hz ; $A_0 = 1$, $A_1 = 2$, $A_2 = 0$, $A_3 = 1$ ($\varphi_3 = \frac\pi3$).<br>
Unilatéral : raies 1, 2, 1 en 0, 50, 150 Hz. Bilatéral : 1 en 0 ; 1 en $\pm50$ ; $\frac12$ en $\pm150$ (phases $\pm\frac\pi3$).<br>
Puissance (Parseval) : $P = 1 + \frac{2^2 + 1^2}{2} = 3{,}5$.</p>
`)}
${S('Exo type : signal modulé', R`
<p>$x = \mathrm{rect}(\frac tT)\cos(2\pi f_0t)$ (impulsion radar / salve) : produit → convolution avec les 2 raies → $X = \frac T2[\mathrm{sinc}(T(f-f_0)) + \mathrm{sinc}(T(f+f_0))]$ : deux sinc centrés en $\pm f_0$, largeur du lobe principal $\frac2T$.</p>
${small({ x: [-6, 6], y: [-0.3, 1.2], h: 60, xl: 'f', fns: [{ f: f => abs(sinc(f - 3) + sinc(f + 3)) }], xt: [[-3, '-f0'], [3, 'f0']], cap: '|X(f)| : la salve recopie le sinc en ±f₀' })}
<p><b>Parité</b> : tout signal $= x_p + x_i$ avec $x_p = \frac{x(t)+x(-t)}2$, $x_i = \frac{x(t)-x(-t)}2$ ; la TF de $x_p$ est réelle, celle de $x_i$ imaginaire.</p>
`)}
${S('Méthode générale', R`
${K(R`<b>Rédaction</b> : ① nommer la propriété ou la paire utilisée ② écrire le résultat avec les bonnes unités ③ vérifier : $X(0)$ = aire, symétries, support.`)}
`)}
${P(R`$x(2t+1)$ décale de $\frac12$, pas de 1 · $\cos(100\pi t)$ → 50 Hz · $x\cdot\delta(t-t_0)$ (prélève) ≠ $x*\delta(t-t_0)$ (décale) · bilatéral = $\frac A2$ de chaque côté · $\mathrm{rect}(t/T)$ a une largeur $T$ · un retard ne change pas $|X|$.`)}
`
  ]
},

/* ================================================================ PARTIE 2 */
p2: {
  titre: 'Partie 2 — Échantillonnage & interpolation',
  couleur: '#d4730b',
  labels: ['Cours', 'Exercices'],
  pages: [
/* ---------------------------------------------------------------- P2 recto : cours */
R`
${S('Échantillonnage idéal', R`
<p>Prélever $x(t)$ tous les $T_e$ ; $f_e = 1/T_e$. Modèle : multiplication par un peigne de Dirac.</p>
${F(R`$$x_e(t) = x(t)\,\text{Ш}_{T_e}(t) = \sum_n x(nT_e)\,\delta(t-nT_e)$$`)}
<p>TF du peigne : $\text{Ш}_{T_e} \to f_e\sum_k\delta(f-kf_e)$. Produit ↔ convolution :</p>
${F(R`$$X_e(f) = f_e\sum_{k=-\infty}^{+\infty}X(f-kf_e)$$`)}
${K(R`<b>Échantillonner = périodiser le spectre</b> : copies de $X$ centrées en $kf_e$, ×$f_e$. Un cos $A\cos2\pi f_0t$ donne des raies de poids $f_e\frac A2$ en $\pm f_0+kf_e$.`)}
${small({ x: [-3.2, 3.2], y: [-0.1, 1.2], xl: 'f', fns: [{ f: f => [-2, -1, 0, 1, 2].reduce((s, k) => s + tri((f - 2.2 * k) / 0.8), 0) }], xt: [[-2.2, '-fe'], [-0.8, '-B'], [0.8, 'B'], [2.2, 'fe']], cap: 'Copies séparées si fe > 2B' })}
`)}
${S('Théorème de Shannon–Nyquist', R`
${F(R`Si $X(f) = 0$ pour $|f|\gt B$ : reconstruction exacte $\iff f_e \gt 2B$`)}
<p>$B$ = fréquence <b>maximale</b> (pas la principale). $f_e/2$ = <b>fréquence de Nyquist</b> = plus haute fréquence représentable. Inégalité <b>stricte</b> ($f_e = 2f_0$ : on peut tomber sur les zéros du cos). Nb d'échantillons par période $= f_e/f_0$, il en faut <b>> 2</b>.</p>
${table(['Signal', '$B$', '$f_e$ min'], [['voix', '3,4 kHz', '> 6,8 (8 kHz)'], ['audio', '20 kHz', '> 40 (CD 44,1)'], ['$\\cos(8000\\pi t)$', '4 kHz', '> 8 kHz']])}
`)}
${S('Repliement spectral (aliasing)', R`
<p>Si $f_e \le 2B$ : les copies se chevauchent ; une fréquence haute se fait passer pour une basse (mêmes échantillons).</p>
${F(R`$f_a = |f_0 - kf_e|$, $k$ = entier le plus proche de $f_0/f_e$, $f_a \in [0, \frac{f_e}2]$`)}
<p><b>Accordéon</b> : plier l'axe des $f$ en zigzag entre 0 et $f_e/2$ : $f\in[0,\frac{f_e}2]$ → $f$ ; $[\frac{f_e}2, f_e]$ → $f_e-f$ ; $[f_e, \frac{3f_e}2]$ → $f-f_e$…<br>
<b>Phase</b> : si $f_a = f_e - f_0$, $\cos(2\pi f_0t+\varphi)$ devient $\cos(2\pi f_at-\varphi)$.<br>
<b>Irréversible</b> : après coup, on ne sait plus quelle était la vraie fréquence.</p>
${small({ x: [0, 1], y: [-1.3, 1.3], xl: 't (ms)', fns: [{ f: t => cos(2 * PI * 4 * t), cls: 'muted' }, { f: t => cos(2 * PI * t), cls: 'c2' }], diracs: [0, 0.2, 0.4, 0.6, 0.8, 1].map(x => ({ x, a: cos(2 * PI * 4 * x) })), xt: [[0.2, '.2'], [0.4, '.4'], [0.6, '.6'], [0.8, '.8']], cap: '4 kHz (gris) et 1 kHz (orange), fe = 5 kHz : mêmes impulsions' })}
`)}
${S('Filtre anti-repliement', R`
<p><b>Passe-bas analogique AVANT l'échantillonneur</b>, coupure $f_c \lt f_e/2$. Après, trop tard : les composantes repliées sont dans la bande utile. <b>Décimer</b> par $M$ (1 éch. sur $M$) → $f_e' = f_e/M$ : filtrer d'abord sous $\frac{f_e}{2M}$. Les fréquences coupées <b>ne reviennent pas</b> à l'interpolation.</p>
`)}
${S('Reconstruction : interpolateur de Shannon', R`
${F(R`$$x(t) = \sum_n x(nT_e)\,\mathrm{sinc}\Big(\frac{t-nT_e}{T_e}\Big) \qquad H(f) = T_e\,\mathrm{rect}\Big(\frac f{f_e}\Big)$$`)}
<p>Temps : un sinc par échantillon (vaut 1 en $nT_e$, 0 aux autres) → somme lisse. Fréquence : <b>passe-bas idéal</b> gain $T_e$, coupure $\pm\frac{f_e}2$ : garde la copie centrale ; $T_e\cdot f_e = 1$ → amplitude d'origine. Si repliement, il reconstruit la <b>fréquence repliée</b>. <b>Non causal</b>, durée <b>infinie</b> → irréalisable.</p>
${small({ x: [-3, 3], y: [-0.4, 1.25], xl: 't/Te', fns: [{ f: t => 0.8 * sinc(t + 1), cls: 'muted', dash: true }, { f: t => sinc(t), cls: 'muted', dash: true }, { f: t => 0.5 * sinc(t - 1), cls: 'muted', dash: true }, { f: t => 0.8 * sinc(t + 1) + sinc(t) + 0.5 * sinc(t - 1) }], diracs: [{ x: -1, a: 0.8 }, { x: 0, a: 1 }, { x: 1, a: 0.5 }], xt: [[-1, '-1'], [1, '1'], [2, '2']] })}
`)}
${S('Bloqueur d’ordre zéro (BOZ)', R`
<p>Maintient chaque échantillon pendant $T_e$ → <b>escalier</b>. Réalisable (CNA), passe par les échantillons, erreur ≠ 0 qui diminue quand $f_e$ augmente. Réponse : $h = \mathrm{rect}(\frac{t-T_e/2}{T_e})$, $|H(f)| = T_e|\mathrm{sinc}(fT_e)|$ (atténue un peu les hautes fréquences).</p>
`)}
${S('Chaîne complète', R`
${table(['Bloc', 'Rôle'], [
  ['anti-repliement', 'limiter la bande sous $f_e/2$'], ['échantillonneur', 'prélever tous les $T_e$'],
  ['traitement numérique', 'sur la suite $x(n) = x(nT_e)$'], ['interpolateur', 'Shannon (idéal) ou BOZ (réel) → signal continu']
])}
`)}
${S('Dans la vraie vie', R`
<p>Au cinéma (24 images/s), les <b>roues semblent tourner lentement ou à l'envers</b>, les pales d'hélicoptère paraissent immobiles : c'est du <b>repliement</b> temporel. Le <b>téléphone</b> échantillonne la voix à 8 kHz (bande ≤ 4 kHz : voix « étouffée »). L'audio <b>hi-res</b> monte à 96 kHz. Le <b>moiré</b> sur une photo de chemise rayée = repliement spatial.</p>
`)}
${S('Son numérique', R`
${F(R`Débit $= f_e\times\text{bits}\times\text{canaux}$ ; taille (octets) = débit × durée / 8`)}
<p>CD : $44\,100\times16\times2 = 1411{,}2$ kbit/s (mono : 705,6) ; 16 bits → $2^{16} = 65\,536$ niveaux ; 1 min ≈ 10,6 Mo. <b>MP3</b> : compression <b>avec perte</b> (retire l'inaudible), <b>même $f_e$</b>, débit 128–320 kbit/s, pertes sur attaques / percussions / aigus.</p>
`)}
${S('Matlab (TP 3)', MAT`
  t=(0:1/Fe:duree)'; x=cos(2*pi*f0*t);
  stem(t*1e3,x,'filled')        % impulsions
  N=length(x); X=abs(fft(x))/N; X=X(1:N/2+1);
  X(2:end-1)=2*X(2:end-1); f=(0:N/2)'*Fe/N;
  y=x(1:M:end);                 % décimation, Fe/M
  xf=lowpass(x,fc,Fe0);         % anti-repliement
  r=resample(y,M,1);            % retour à Fe0
  xb=interp1(te,xe,t,'previous'); % BOZ
  xs=xs+xe(k)*sinc((t-te(k))/Te); % Shannon
`)}
${S('Que voit-on selon fe ? (sinusoïde f₀)', R`
${table(['Cas', 'Fréquence observée', 'Remarque'], [
  ['$f_e \\gt 2f_0$', '$f_0$', 'Shannon OK'],
  ['$f_e = 2f_0$', 'ambigu', 'peut tomber sur les zéros'],
  ['$f_0 \\lt f_e \\lt 2f_0$', '$f_e - f_0$', 'phase inversée'],
  ['$f_e \\lt f_0$', '$|f_0 - kf_e|$', '$k$ = arrondi de $f_0/f_e$'],
  ['$f_e = f_0$', '0 (constante)', 'même point à chaque période']
])}
<p>Valeurs échantillonnées : $x(n) = \cos(2\pi\frac{f_0}{f_e}n)$ ; deux $f_0$ donnent les mêmes valeurs si $\frac{f_0}{f_e}$ diffèrent d'un entier ou sont opposés.</p>
`)}
${S('Spectre large échantillonné', R`
<p>① dessiner $X(f)$ (support $[-B,B]$) ; ② recopier en $\pm f_e, \pm2f_e$… ; ③ <b>additionner</b> là où ça se chevauche ; ④ le reconstruit = ce qu'il y a dans $[-\frac{f_e}2,\frac{f_e}2]$. Chevauchement si $f_e - B \lt B$. Ex. triangle $B = 3$ kHz : $f_e = 8$ kHz OK ; $f_e = 5$ kHz → copies qui se recouvrent sur $[2,3]$ kHz.</p>
<p><b>Filtre réel</b> : il faut une bande de transition → marge ($f_e$ CD = 44,1 kHz pour 20 kHz : 2,05 kHz de marge). <b>Interpolation linéaire</b> (relier les points) : entre BOZ et Shannon.</p>
`)}
${S('Quantification (à savoir)', R`
<p>Chaque échantillon est arrondi sur $b$ bits : $2^b$ niveaux, pas $q = \frac{\text{plage}}{2^b}$, erreur $\le\frac q2$. RSB ≈ $6{,}02\,b + 1{,}76$ dB (16 bits ≈ 98 dB). Échantillonner discrétise le <b>temps</b>, quantifier discrétise l'<b>amplitude</b>.</p>
`)}
${S('Changer de fréquence d’échantillonnage', R`
${table(['Opération', 'Effet', 'Précaution'], [
  ['décimation ×M', '$f_e \\to f_e/M$, Nyquist $f_e/2M$', 'passe-bas <b>avant</b>'],
  ['interpolation ×M', '$f_e \\to Mf_e$', 'passe-bas <b>après</b> (supprime les copies)'],
  ['fréquence normalisée', '$\\nu = f/f_e$, Nyquist ↔ $\\nu = \\frac12$', 'lien avec la partie 3']
])}
`)}
${S('Spectre et temps : la même histoire', R`
${plots(
  plot({ x: [-3.2, 3.2], y: [-0.1, 1.3], w: 140, h: 72, xl: 'f', fns: [{ f: f => [-1, 0, 1].reduce((s, k) => s + tri((f - 2.4 * k) / 0.9), 0) }], xt: [[2.4, 'fe']], cap: 'fe > 2B ✓' }),
  plot({ x: [-3.2, 3.2], y: [-0.1, 1.3], w: 140, h: 72, xl: 'f', bands: [{ a: 0.35, b: 0.95, cls: 'ko' }, { a: -0.95, b: -0.35, cls: 'ko' }], fns: [{ f: f => [-2, -1, 0, 1, 2].reduce((s, k) => s + tri((f - 1.3 * k) / 0.95), 0) }], xt: [[1.3, 'fe']], cap: 'fe < 2B : chevauchement ✗' })
)}
${plot({ x: [0, 8], y: [-1.3, 1.3], w: 230, h: 70, xl: 't', fns: [{ f: t => sin(2 * PI * t / 8 * 1.5), cls: 'muted', dash: true }, { f: t => sin(2 * PI * Math.floor(t) / 8 * 1.5) }], stems: [{ n: [0, 1, 2, 3, 4, 5, 6, 7], v: [0, 1, 2, 3, 4, 5, 6, 7].map(n => sin(2 * PI * n / 8 * 1.5)) }], xt: [[1, 'Te']], cap: 'BOZ : paliers de durée Te' })}
`)}
`,
/* ---------------------------------------------------------------- P2 verso : exercices */
R`
${S('Méthode générale « échantillonner puis reconstruire »', K(R`
① <b>fréquences</b> du signal : lire $f_0$ dans $\cos(2\pi f_0t)$ ou mesurer la période.<br>
② <b>spectre</b> $X(f)$ : raies $\frac A2$ en $\pm f_0$.<br>
③ <b>Shannon</b> : $f_e \gt 2f_{max}$ ?<br>
④ <b>spectre échantillonné</b> : raies de poids $f_e\frac A2$ en $\pm f_0 + kf_e$ (lister pour $k = 0, \pm1, \pm2$).<br>
⑤ <b>reconstruction</b> : garder les raies dans $]-\frac{f_e}2, \frac{f_e}2[$, ×$T_e$ → signal reconstruit.<br>
⑥ si une raie gardée n'est pas $\pm f_0$ : <b>repliement</b>, $f_a = |f_0 - kf_e|$.`))}
${S('TD 2 — Ex. 1 : x(t) = cos(8000πt)', R`
<p><b>1.</b> $8000\pi = 2\pi\cdot4000$ → $f_0 = 4$ kHz, $T_0 = 0{,}25$ ms.<br>
<b>2.</b> $X(f) = \frac12[\delta(f-4000) + \delta(f+4000)]$.<br>
<b>3.</b> $x$ : cosinus d'amplitude 1, période 0,25 ms. $X$ : deux flèches $\frac12$ en $\pm4$ kHz.</p>
${EX('4. fe = 10 kHz', R`$T_e = 0{,}1$ ms (2,5 éch./période). Impulsions de poids $\cos(2\pi\,0{,}4n)$ : $1;\ -0{,}81;\ 0{,}31;\ 0{,}31;\ -0{,}81;\ 1\ldots$<br>$X_e(f) = 5000\sum_k[\delta(f-4000-10^4k) + \delta(f+4000-10^4k)]$ : raies de poids 5000 en $\pm4, \pm6, \pm14, \pm16\ldots$ kHz.`)}
${EX('5. Shannon (fe = 10 kHz)', R`passe-bas $]-5, 5[$ kHz garde $\pm4$ kHz ; ×$T_e$ : $5000\times10^{-4} = \frac12$ → $\hat x(t) = \cos(8000\pi t)$ : <b>reconstruction exacte</b> ($10 \gt 2\times4$).`)}
${EX('6. fe = 5 kHz', R`$5 \lt 8$ : repliement. Raies (poids 2500) en $\pm4 + 5k$ : $\pm1, \pm4, \pm6, \pm9, \pm11\ldots$ kHz. Passe-bas $]-2{,}5;\ 2{,}5[$ garde $\pm1$ kHz → $\hat x(t) = \cos(2000\pi t)$ : on entend <b>1 kHz</b> au lieu de 4.`)}
${small({ x: [-12, 12], y: [-0.1, 1.25], xl: 'f (kHz)', bands: [{ a: -2.5, b: 2.5 }], diracs: [-11, -9, -6, -4, -1, 1, 4, 6, 9, 11].map(x => ({ x, a: 1, cls: abs(x) === 1 ? 'c3' : '' })), xt: [[-5, '-5'], [5, '5'], [10, '10']], cap: 'fe = 5 kHz : la bande gardée contient ±1 kHz (vert)' })}
`)}
${S('TD 2 — Ex. 2 : signal lu sur une figure', R`
${K(R`① <b>période</b> $T$ sur l'axe (µs) → $f_0 = 1/T$ (200 µs → 5 kHz ; 100 µs → 10 kHz) ;<br>② <b>amplitude</b> $A$ = valeur max ;<br>③ <b>phase</b> : $x(0) = A\cos\varphi$ (max en 0 → $\varphi = 0$ ; 0 en montant → $-\frac\pi2$) ;<br>④ $x(t) = A\cos(2\pi f_0t+\varphi)$, $X(f) = \frac A2e^{j\varphi}\delta(f-f_0)+\frac A2e^{-j\varphi}\delta(f+f_0)$ ;<br>⑤ <b>placer les impulsions</b> : $T_e$ = 50 µs (20 kHz) ou 125 µs (8 kHz), poids $x(nT_e)$ ;<br>⑥ reconstruit : $x(t)$ si $f_e\gt2f_0$, sinon $A\cos(2\pi f_at - \varphi)$ avec $f_a = |f_0 - f_e|$.`)}
${EX('Exemple', R`$f_0 = 5$ kHz : à 20 kHz (4 éch./période) → exact ; à 8 kHz ($\lt10$) → replié à $|5-8| = 3$ kHz, phase inversée.`)}
`)}
${S('Repliement : table de calcul', R`
${table(['$f_0$', '$f_e$', '$f_e/2$', 'observé', 'calcul'], [
  ['4', '10', '5', '4', 'k = 0'], ['4', '8', '4', '4 (limite)', '= fe/2'], ['4', '6', '3', '<b>2</b>', '|4−6|'], ['4', '5', '2,5', '<b>1</b>', '|4−5|'],
  ['3,5', '5', '2,5', '<b>1,5</b>', '|3,5−5|'], ['4,5', '5', '2,5', '<b>0,5</b>', '|4,5−5|'], ['3,5', '6', '3', '<b>2,5</b>', '|3,5−6|'],
  ['4,2', '6', '3', '<b>1,8</b>', '|4,2−6|'], ['1', '1,8', '0,9', '<b>0,8</b>', '|1−1,8|'], ['1,2', '2', '1', '<b>0,8</b>', '|1,2−2|'], ['9', '4', '2', '<b>1</b>', '|9−2·4|']
])}
<p>(fréquences en kHz)</p>
`)}
${S('TP 3 — réponses', R`
<p><b>Ex. 1A</b> : $T_e = 1/F_e$ = 0,1 ms ; 2,5 impulsions/période à 10 kHz (OK) ; 8 kHz : 2 (limite) ; 6 kHz : 1,5 → ressemble à 2 kHz.<br>
<b>Ex. 1B</b> (5 kHz) : 4 kHz et 1 kHz passent par les mêmes Dirac ; observée : 1 kHz ($\le F_e/2$). 3,5 kHz → 1,5 ; 4,5 kHz → 0,5 kHz.<br>
<b>Ex. 1C</b> : s2 (5 kHz) sonne plus grave = 1 kHz.</p>
${table(['$F_e$', '$F_e/2$', 'pic f₁ = 1k', 'pic f₂ = 3,5k', '4,2 kHz'], [['10 000', '5 000', '1 000', '3 500', '4 200'], ['6 000', '3 000', '1 000', '<b>2 500</b>', '<b>1 800</b>'], ['5 000', '2 500', '1 000', '<b>1 500</b>', '<b>800</b>']])}
<p>Amplitudes inchangées (1 et 0,6).<br>
<b>Ex. 3</b> (grillons, $M=2$) : sans filtre → sifflements/artefacts (repliés) ; avec ${c`lowpass`} → plus sourd mais propre. Le filtre doit être <b>avant</b> ${c`(1:M:end)`} ; après ${c`resample`}, les aigus coupés ne reviennent pas.<br>
<b>Ex. 4</b> ($f_0 = 1$ kHz) : Shannon et BOZ passent par les impulsions ; BOZ = constant pendant $T_e$. $F_e = 8000$ : erreur Shannon ≈ 0, BOZ grande. $F_e = 2500$ ($\gt2000$) : Shannon OK au centre. $F_e = 1800$ : fréquence apparente $|1000-1800| = 800$ Hz.<br>
<b>Ex. 4 suite</b> ($700 + 0{,}5\cos1200$ Hz) : 4 kHz → tout OK ; 2 kHz → 1200 se replie à <b>800 Hz</b> ; filtrer 1,2 kHz avant (coupure < 1 kHz) → ne reste que 700 Hz. Chaîne : entrée → anti-repliement → impulsions pondérées → interpolateur → sortie.<br>
<b>Ex. 5</b> : WAV CD = 1411,2 kbit/s ; 30 s → $1411{,}2\times30/8 \approx 5{,}3$ Mo (+ en-tête). MP3 Q10 / Q90 : bien plus petit, même $F_e$ = 44,1 kHz ; Q10 plus dégradé (aigus, attaques).</p>
`)}
${S('Exos types', R`
${EX('fe minimale', R`$x = \cos(2\pi\,700t) + \sin(2\pi\,1500t)$ → $B = 1{,}5$ kHz → $f_e \gt 3$ kHz.`)}
${EX('Produit', R`$\cos(2\pi\,1000t)\cos(2\pi\,3000t)$ = composantes 2 et 4 kHz → $B = 4$ kHz → $f_e\gt8$ kHz (piège : pas 6 !).`)}
${EX('Anti-repliement', R`$f_e = 8$ kHz → coupure < 4 kHz.`)}
`)}
${S('TD 2-1 : les impulsions dans le temps', R`
${plots(
  plot({ x: [0, 0.5], y: [-1.3, 1.3], w: 140, h: 72, xl: 't (ms)', fns: [{ f: t => cos(2 * PI * 4 * t), cls: 'muted' }], diracs: [0, 0.1, 0.2, 0.3, 0.4, 0.5].map(x => ({ x, a: cos(2 * PI * 4 * x) })), xt: [[0.25, '0,25']], cap: 'fe = 10 kHz : 2,5 éch./période' }),
  plot({ x: [0, 0.8], y: [-1.3, 1.3], w: 140, h: 72, xl: 't (ms)', fns: [{ f: t => cos(2 * PI * 4 * t), cls: 'muted' }, { f: t => cos(2 * PI * t), cls: 'c3' }], diracs: [0, 0.2, 0.4, 0.6, 0.8].map(x => ({ x, a: cos(2 * PI * 4 * x) })), xt: [[0.4, '0,4']], cap: 'fe = 5 kHz : vu comme 1 kHz (vert)' })
)}
<p>Valeurs à 5 kHz : $\cos(2\pi\,0{,}8n) = 1;\ 0{,}31;\ -0{,}81;\ -0{,}81;\ 0{,}31;\ 1$ (= $\cos(2\pi\,0{,}2n)$ : mêmes valeurs qu'un cos à 1 kHz).</p>
`)}
${S('Exos types : plusieurs composantes, sinus, phase', R`
${EX('Deux cos', R`$x = \cos(2\pi\,3000t) + \cos(2\pi\,7000t)$, $f_e = 8$ kHz : 3 kHz OK ; 7 kHz → $|7-8| = 1$ kHz. Reconstruit : $\cos(2\pi\,3000t) + \cos(2\pi\,1000t)$.`)}
${EX('Sinus replié', R`$\sin(2\pi\,6000t)$ à $f_e = 8$ kHz : $\sin(2\pi\frac68n) = \sin(2\pi n - 2\pi\frac28n) = -\sin(2\pi\frac28n)$ → reconstruit $-\sin(2\pi\,2000t)$ (signe inversé).`)}
${EX('Avec phase', R`$\cos(2\pi\,4000t + \frac\pi3)$ à 5 kHz → $\cos(2\pi\,1000t - \frac\pi3)$.`)}
${EX('Nombre de points', R`${c`t = 0:1/Fe:duree`} : $N = \frac{\text{durée}}{T_e} + 1$ (2 ms à 10 kHz → 21 points). ${c`(0:N-1)/Fe`} : exactement $N$.`)}
${EX('Taille de fichier', R`3 min stéréo 16 bits 44,1 kHz : $1411{,}2\text{ k}\times180/8 \approx 31{,}8$ Mo. Mono 8 kHz 8 bits : 64 kbit/s → 480 ko/min.`)}
`)}
${S('Exo type : concevoir une chaîne d’acquisition', R`
<p>Signal utile 0–15 kHz, du bruit au-delà. ① $B = 15$ kHz → $f_e \gt 30$ kHz ; ② marge pour un filtre réel → $f_e = 44{,}1$ ou 48 kHz ; ③ anti-repliement analogique : coupure entre 15 et $f_e/2$ (ex. 18 kHz) ; ④ reconstruction : CNA (BOZ) + passe-bas de lissage à $f_e/2$.</p>
${small({ x: [-22, 22], y: [-0.1, 0.65], h: 60, xl: 'f (kHz)', vlines: [-5, 5], diracs: [-16, -14, -6, -4, 4, 6, 14, 16].map(x => ({ x, a: 0.5, cls: abs(x) === 4 ? 'c3' : '' })), xt: [[-10, '-10'], [-5, '-5'], [5, '5'], [10, '10']], cap: 'TD 2-1, fe = 10 kHz : la copie centrale ±4 (vert) est seule dans ]−5, 5['})}
`)}
${S('Questions de cours fréquentes', R`
<p><b>Pourquoi 44,1 kHz ?</b> oreille ≤ 20 kHz → $f_e\gt40$ kHz + marge pour un filtre anti-repliement réalisable.<br>
<b>Pourquoi le BOZ ?</b> Shannon est non causal et infini ; le BOZ est réalisable (CNA).<br>
<b>Pourquoi filtrer avant ?</b> après échantillonnage, le repliement est déjà mélangé au signal.<br>
<b>Téléphone</b> : 8 kHz × 8 bits × 1 = 64 kbit/s.</p>
`)}
${P(R`$B$ = fréquence <b>max</b> (après développement des produits) · inégalité stricte · filtre <b>avant</b> l'échantillonneur · poids des raies de $X_e$ ×$f_e$ · MP3 ne baisse pas $f_e$ · la phase s'inverse quand $f_a = f_e - f_0$.`)}
`
  ]
},

/* ================================================================ PARTIE 3 */
p3: {
  titre: 'Partie 3 — Signaux discrets, TFtd/TFD & filtres',
  couleur: '#1a8a5a',
  labels: ['Cours', 'Exercices'],
  pages: [
/* ---------------------------------------------------------------- P3 recto : cours */
R`
${S('Suites (signaux à temps discret)', R`
<p>$x : \mathbb Z\to\mathbb R$ ; $x(n) = x_a(nT_e)$ ou suite intrinsèque. Rien entre deux indices. Notation $\{\ldots,2,\underset\uparrow{-1},3\}$ (flèche = $n=0$).</p>
${table(['Suite', 'Définition'], [['$\\delta(n)$', '1 en $n=0$, 0 ailleurs (vraie valeur 1)'], ['$u(n)$', '1 si $n\\ge0$'], ['$r(n)$', '$n\\,u(n)$'], ['$a^nu(n)$', '$|a|\\lt1$ décroît, $|a|\\gt1$ explose, $a\\lt0$ alterne']])}
${F(R`$x(n) = \sum_k x(k)\,\delta(n-k)$&emsp;$x(n)\delta(n-n_0) = x(n_0)\delta(n-n_0)$`)}
`)}
${S('Énergie, puissance, séries géométriques', R`
${F(R`$\sum_{k=0}^{N-1}q^k = \frac{1-q^N}{1-q}$&emsp;$\sum_{k=0}^{\infty}q^k = \frac1{1-q}$&emsp;$\sum_{k=1}^{\infty}q^k = \frac q{1-q}$ ($|q|\lt1$)`)}
<p>$E = \sum|x(n)|^2$ ; $P = \lim\frac1{2N+1}\sum_{-N}^N|x|^2$ ; périodique : $P = \frac1{N_0}\sum_0^{N_0-1}|x|^2$, $E = \infty$.<br>$a^nu(n)$ : $E = \frac1{1-|a|^2}$ ; $a^{|n|}$ : $E = \frac{1+a^2}{1-a^2}$.</p>
`)}
${S('Opérations', R`
${table(['Écriture', 'Effet'], [['$x(n-n_0)$', 'droite de $n_0$'], ['$x(n+n_0)$', 'gauche'], ['$x(-n)$', 'miroir autour de 0'], ['$x(-n+k)$', '$= x(-(n-k))$ : miroir puis droite de $k$'], ['$x(2n)$', 'garde les indices pairs (perte)']])}
<p><b>Tableau</b> : $n$ | indice calculé | valeur lue dans $x$. Vérif : $x(0)$ arrive là où l'indice vaut 0.</p>
`)}
${S('Convolution discrète', R`
${F(R`$y(n) = (x*h)(n) = \sum_k x(k)\,h(n-k)$`)}
<p>Chaque $x(k)$ envoie $x(k)\cdot h(n-k)$ (copie décalée) ; sommer par colonne. Longueur $N+M-1$, début = somme des débuts. $x*\delta(n-n_0) = x(n-n_0)$ ; $a^nu*u = \frac{1-a^{n+1}}{1-a}u(n)$.</p>
`)}
${S('Sinusoïde discrète', R`
${F(R`$\cos(2\pi\nu_0n)$, $\nu_0 = \frac{f_0}{f_e}$ : périodique $\iff \nu_0 = \frac pq$ (irréductible), $N_0 = q$`)}
<p>$\nu_0$ et $\nu_0 + 1$ donnent la <b>même suite</b> (repliement). $\cos(\Omega n)$ : $\nu_0 = \Omega/2\pi$ ; $\cos(0{,}5n)$ apériodique.</p>
`)}
${S('TFtd (spectre d’une suite)', R`
<p>Notation $\theta = 2\pi f/f_e = 2\pi\nu$.</p>
${F(R`$$X(f) = \sum_n x(n)e^{-jn\theta} \qquad x(n) = \frac1{f_e}\int_{-f_e/2}^{f_e/2}X(f)e^{jn\theta}df$$`)}
<p>Continue, <b>périodique de période $f_e$</b> (1 en $\nu$, $2\pi$ en $\omega$) : tracer sur $[-\frac{f_e}2,\frac{f_e}2]$. Discret en temps ⟺ périodique en fréquence.</p>
${table(['$x(n)$', '$X$', '$x(n)$', '$X$'], [
  ['$\\delta(n)$', '$1$', '$\\delta(n-n_0)$', '$e^{-jn_0\\theta}$'],
  ['$a^nu(n)$', '$\\frac1{1-ae^{-j\\theta}}$', '$a^{|n|}$', '$\\frac{1-a^2}{1-2a\\cos\\theta+a^2}$'],
  ['$x(n-n_0)$', '$Xe^{-jn_0\\theta}$', '$x*h$', '$XH$']
])}
`)}
${S('TFD et FFT', R`
${F(R`$X[k] = \sum_{n=0}^{N-1}x[n]e^{-j2\pi nk/N}$, \ $f_k = k\frac{f_e}N$, \ $\Delta f = \frac{f_e}N = \frac1{NT_e}$`)}
<p>TFD = TFtd d'un bloc de $N$ points échantillonnée sur $N$ fréquences. Temps <b>et</b> fréquence discrets et périodiques ($N$). $k\gt\frac N2$ ↔ fréquences négatives. $f_e$ fixe la bande, $N$ (durée $NT_e$) la résolution. <b>FFT</b> = même résultat, $\frac N2\log_2N$ opérations au lieu de $N^2$ (1024 pts : 5 120 vs $10^6$, ×205). Matlab : ${c`X(k+1)`} ↔ $kF_e/N$.</p>
${table(['Outil', 'Temps', 'Fréquence'], [['Série F.', 'continu périodique', 'raies'], ['TF', 'continu', 'continue'], ['TFtd', 'discret', 'continue périodique'], ['TFD', 'discret N pts', 'discrète N pts']])}
<p><b>Périodique dans un domaine ⟺ discret dans l'autre.</b></p>
`)}
${S('Dans la vraie vie', R`
<p><b>Moyenne glissante</b> d'un cours de bourse = passe-bas (lisse les variations). <b>Différence</b> $x(n) - x(n-1)$ = détection de variations (contours dans une image). <b>Écho</b> : $y(n) = x(n) + a\,x(n-D)$ (RIF) ; <b>réverbération</b> : $y(n) = x(n) + a\,y(n-D)$ (RII, stable si $|a|\lt1$). <b>Shazam</b>, les accordeurs et les égaliseurs utilisent la <b>FFT</b> ; JPEG et MP3 une transformée proche (DCT).</p>
`)}
${S('Filtres numériques', R`
${F(R`$y(n) = \sum_{k=0}^Mb_kx(n-k) - \sum_{k=1}^Na_ky(n-k)$&emsp;$H(z) = \frac{\sum b_kz^{-k}}{1+\sum a_kz^{-k}}$`)}
<p><b>$h(n)$</b> = sortie pour $\delta(n)$, caractérise tout : $y = x*h$. <b>Indicielle</b> $s(n) = \sum_{k\le n}h(k)$ → limite $H(1)$.<br>
<b>Transformée en Z</b> $X(z) = \sum x(n)z^{-n}$ : $x(n-k)\to z^{-k}X$, $x*h\to XH$, $\delta\to1$, $u\to\frac1{1-z^{-1}}$, $a^nu\to\frac1{1-az^{-1}} = \frac z{z-a}$.<br>
<b>Pôles</b> = racines du dénominateur, <b>zéros</b> = du numérateur (écrire en puissances positives de $z$).</p>
${F(R`$H(f) = H(z)\big|_{z = e^{j\theta}}$&emsp;<b>stable</b> (causal) $\iff$ tous les pôles $|p_i|\lt1$`)}
<p>Zéros : aucun rôle pour la stabilité ; zéro sur le cercle en $e^{j\theta_0}$ → $|H(f_0)| = 0$. Pôle près du cercle → pic de gain, réponse lente. $f = 0 \leftrightarrow z = 1$ ; $f = \frac{f_e}2 \leftrightarrow z = -1$.</p>
${table(['', 'RIF', 'RII'], [['équation', 'que des $x$', '$y$ passés (récursif)'], ['$h(n)$', 'finie = les $b_k$', 'infinie'], ['stabilité', 'toujours', 'pôles dans le cercle'], ['phase', 'peut être linéaire', 'non linéaire'], ['coût', 'beaucoup de coef.', 'peu de coef.']])}
${K(R`<b>Type</b> : comparer $|H(0)|$ et $|H(\frac{f_e}2)|$ (bas : grand/petit ; haut : petit/grand ; bande : petits aux deux bouts). <b>Coupure</b> −3 dB : $|H(f_c)| = \frac{|H|_{max}}{\sqrt2}$. <b>Astuce</b> : $1+e^{-j\theta} = 2e^{-j\theta/2}\cos\frac\theta2$ ; $1-e^{-j\theta} = 2je^{-j\theta/2}\sin\frac\theta2$.`)}
${K(R`<b>Lire $|H|$ sur le plan des pôles/zéros</b> : $|H(e^{j\theta})| = |K|\dfrac{\prod \text{dist(point du cercle, zéros)}}{\prod \text{dist(point du cercle, pôles)}}$. Le point $e^{j\theta}$ parcourt le cercle de $z=1$ ($f=0$) à $z=-1$ ($\frac{f_e}2$) : près d'un zéro → creux, près d'un pôle → bosse.`)}
<p><b>RIF symétrique</b> ($b_k = b_{M-k}$) → phase linéaire $-\frac M2\theta$ (retard de $\frac M2$ échantillons, aucune distorsion).</p>
${plots(
  plot({ x: [-0.55, 0.55], y: [-0.1, 2.3], w: 140, h: 75, xl: 'f/fe', fns: [{ f: v => 1 / Math.sqrt(1 - cos(2 * PI * v) + 0.25) }, { f: v => 1 / Math.sqrt(1 + cos(2 * PI * v) + 0.25), cls: 'c2' }], xt: [[-0.5, '-½'], [0.5, '½']], yt: [[2, '2']], cap: 'RII a = 0,5 / −0,5' }),
  plot({ x: [-0.5, 7.5], y: [-1.1, 1.2], w: 140, h: 75, xl: 'n', stems: [{ n: [0, 1, 2, 3, 4, 5, 6, 7], v: [0, 1, 2, 3, 4, 5, 6, 7].map(n => Math.pow(-0.7, n)) }], cap: '(−0,7)ⁿ u(n) : alterne' })
)}
`)}
${S('Table Z (unilatérale)', R`
${table(['$x(n)$', '$X(z)$', 'ROC'], [
  ['$\\delta(n-i)$', '$z^{-i}$', '$z\\ne0$'], ['$u(n)$', '$\\frac{z}{z-1}$', '$|z|\\gt1$'], ['$n\\,u(n)$', '$\\frac{z}{(z-1)^2}$', '$|z|\\gt1$'],
  ['$a^nu(n)$', '$\\frac{z}{z-a}$', '$|z|\\gt|a|$'], ['$na^nu(n)$', '$\\frac{az}{(z-a)^2}$', '$|z|\\gt|a|$'],
  ['$\\cos(\\omega_0n)u$', '$\\frac{z(z-\\cos\\omega_0)}{z^2-2z\\cos\\omega_0+1}$', '$|z|\\gt1$'],
  ['$\\sin(\\omega_0n)u$', '$\\frac{z\\sin\\omega_0}{z^2-2z\\cos\\omega_0+1}$', '$|z|\\gt1$']
])}
<p>$x(n-1) \to z^{-1}X + x(-1)$ (au repos : $z^{-1}X$) · $nx(n) \to -z\frac{dX}{dz}$ · $\sum_0^nx(k) \to \frac{X}{1-z^{-1}}$ · <b>valeur initiale</b> $x(0) = \lim_{z\to\infty}X$ · <b>valeur finale</b> $\lim x(n) = \lim_{z\to1}(z-1)X(z)$. ROC : sans pôle ; durée finie → tout le plan.</p>
`)}
${S('Systèmes discrets : propriétés', R`
${table(['Propriété', 'Condition sur $h(n)$ / $H(z)$'], [
  ['linéaire invariant', '$y = x*h$'], ['causal', '$h(n) = 0$ pour $n\\lt0$ (n’utilise pas $x(n+1)$…)'],
  ['stable', '$\\sum|h(n)|\\lt\\infty$ ⟺ pôles dans le cercle (causal)'], ['RIF', '$h$ de longueur finie']
])}
<p><b>Région de convergence</b> : causal → $|z| \gt \max|p_i|$ ; stable ⟺ elle contient le cercle unité.<br>
<b>Inverser $H(z)$</b> : éléments simples $\frac{A}{1-p_1z^{-1}} + \frac{B}{1-p_2z^{-1}}$ → $h(n) = (A\,p_1^n + B\,p_2^n)\,u(n)$. Un $z^{-1}$ au numérateur = décalage de 1.</p>
${F(R`Moyenne glissante sur $M$ points : $H(f) = \frac1M\frac{\sin(M\theta/2)}{\sin(\theta/2)}e^{-j\frac{M-1}2\theta}$, zéros en $f = k\frac{f_e}M$`)}
${table(['Gabarit', 'Où mettre zéros / pôles'], [
  ['passe-bas', 'zéro en $z=-1$, pôle près de $z=1$'], ['passe-haut', 'zéro en $z=1$, pôle près de $z=-1$'],
  ['passe-bande $f_0$', 'pôles près de $e^{\\pm j\\theta_0}$'], ['coupe-bande $f_0$', 'zéros sur $e^{\\pm j\\theta_0}$']
])}
${plots(
  plot({ x: [-2.5, 4.5], y: [-0.3, 1.3], w: 140, h: 55, xl: 'n', stems: [{ n: [-2, -1, 0, 1, 2, 3, 4], v: [0, 0, 1, 0, 0, 0, 0] }], cap: 'δ(n)' }),
  plot({ x: [-2.5, 4.5], y: [-0.3, 1.3], w: 140, h: 55, xl: 'n', stems: [{ n: [-2, -1, 0, 1, 2, 3, 4], v: [0, 0, 1, 1, 1, 1, 1] }], cap: 'u(n)' })
)}
`)}
${S('Variables de fréquence', R`
${table(['$f$ (Hz)', '$\\nu = f/f_e$', '$\\theta = 2\\pi\\nu$', '$z = e^{j\\theta}$'], [
  ['0', '0', '0', '1'], ['$f_e/4$', '1/4', '$\\pi/2$', '$j$'], ['$f_e/2$ (Nyquist)', '1/2', '$\\pi$', '$-1$'], ['$f_e$ (= 0)', '1', '$2\\pi$', '1']
])}
<p><b>Propriétés TFtd</b> : linéarité ; retard → $e^{-jn_0\theta}$ ; modulation $x(n)e^{jn\theta_0} \to X(\theta-\theta_0)$ ; $x*h \to XH$ ; Parseval $\sum|x(n)|^2 = \frac1{f_e}\int_{-f_e/2}^{f_e/2}|X|^2df$ ; $x$ réel → $|X|$ pair.</p>
${small({ x: [-0.55, 0.55], y: [-0.2, 2.8], h: 62, xl: 'f/fe', fns: [{ f: v => 1 / Math.sqrt(1 - 1.2 * cos(2 * PI * v) + 0.36) }], xt: [[-0.5, '-½'], [0.5, '½']], yt: [[2.5, '2,5']], cap: '|TFtd| de 0,6ⁿu(n) : 1/(1−a) en 0, 1/(1+a) en fe/2' })}
`)}
${S('Synthèse d’un RIF (idée)', R`
<p>Passe-bas idéal discret de coupure $\nu_c$ : $h(n) = 2\nu_c\,\mathrm{sinc}(2\nu_cn)$, infini et non causal → on le <b>tronque</b> à $M+1$ points (fenêtre) et on le <b>retarde</b> de $\frac M2$ → RIF causal à phase linéaire. Plus $M$ est grand, plus la coupure est raide.</p>
`)}
${S('TFtd ↔ TF, et la TFD en pratique', R`
<p>Si $x(n) = x_a(nT_e)$ : la TFtd est le spectre du signal échantillonné, $X(f) = f_e\sum_kX_a(f-kf_e)$ (copies de la partie 2). <b>Zero-padding</b> (ajouter des zéros) : trace plus de points de la même TFtd, n'améliore <b>pas</b> la résolution (seule la durée $NT_e$ compte). Un cos dont la fréquence ne tombe pas pile sur une case $kf_e/N$ « s'étale » sur les cases voisines.</p>
`)}
`,
/* ---------------------------------------------------------------- P3 verso : exercices */
R`
${S('TD 3 — Ex. 1 & 2 : retourner, décaler, compresser', R`
${K(R`<b>Méthode tableau</b> : pour chaque $n$, calculer l'indice ($-n$, $-n+2$, $2n$), lire la valeur dans $x$ (0 hors support). $x(-n+2)$ : la valeur $x(0)$ (flèche) arrive en $n = 2$, $x(1)$ en $n = 1$, $x(2)$ en $n = 0$…`)}
${EX('Exemple', R`$x = \{\underset\uparrow1, 2, 3, 4\}$ ($n = 0..3$) :`)}
${table(['$n$', '−3', '−2', '−1', '0', '1', '2', '3'], [['$x(n)$', '0', '0', '0', '1', '2', '3', '4'], ['$x(-n)$', '4', '3', '2', '1', '0', '0', '0'], ['$x(-n+2)$', '0', '0', '4', '3', '2', '1', '0'], ['$x(2n)$', '0', '0', '0', '1', '3', '0', '0']])}
<p><b>Ex. 2</b> $y(n) = x(2n)$ : $y(0) = x(0)$, $y(1) = x(2)$, $y(-1) = x(-2)$… on ne garde que les indices <b>pairs</b> de la figure, ramenés à $n/2$ (le graphe est 2× plus étroit, les impairs disparaissent).</p>
`)}
${S('TD 3 — Ex. 3 : x(n) = |n| sur [−3, 3]', R`
${table(['$n$', '−4', '−3', '−2', '−1', '0', '1', '2', '3', '4'], [
  ['$x(n)$', '0', '3', '2', '1', '0', '1', '2', '3', '0'], ['$x(n\\!-\\!1)$', '0', '0', '3', '2', '1', '0', '1', '2', '3'], ['$x(n\\!+\\!1)$', '3', '2', '1', '0', '1', '2', '3', '0', '0'],
  ['moy.', '1', '5/3', '2', '1', '2/3', '1', '2', '5/3', '1'], ['max', '3', '3', '3', '2', '1', '2', '3', '3', '3'], ['$\\sum_{k\\le n}$', '0', '3', '5', '6', '6', '7', '9', '12', '12']
])}
<p>4. moy. $= \frac13[x(n\!+\!1)+x(n)+x(n\!-\!1)]$ (lisse : passe-bas) ; 5. $\max$ des 3 voisins ; 6. somme cumulée (reste à 12 pour $n\ge3$). Nul ailleurs (sauf la somme).<br>
$x(n) = 3\delta(n\!+\!3)+2\delta(n\!+\!2)+\delta(n\!+\!1)+\delta(n\!-\!1)+2\delta(n\!-\!2)+3\delta(n\!-\!3)$.</p>
`)}
${S('TD 3 — Ex. 4 & 5 : TFtd', R`
${EX('4.1', R`$\delta(n-1)+\delta(n+1) \to e^{-j\theta}+e^{j\theta} = 2\cos\theta$ ; $|Y_1| = 2|\cos\frac{2\pi f}{f_e}|$ : 2 en $0$ et $\pm\frac{f_e}2$, 0 en $\pm\frac{f_e}4$.`)}
${EX('4.2', R`$\delta(n-2)-\delta(n+2) \to e^{-j2\theta}-e^{j2\theta} = -2j\sin2\theta$ ; $|Y_2| = 2|\sin\frac{4\pi f}{f_e}|$ : 0 en $0, \pm\frac{f_e}4, \pm\frac{f_e}2$ ; max 2 en $\pm\frac{f_e}8, \pm\frac{3f_e}8$.`)}
${small({ x: [-0.55, 0.55], y: [-0.1, 2.3], xl: 'f/fe', fns: [{ f: v => 2 * abs(cos(2 * PI * v)) }, { f: v => 2 * abs(sin(4 * PI * v)), cls: 'c2' }], xt: [[-0.5, '-½'], [-0.25, '-¼'], [0.25, '¼'], [0.5, '½']], cap: '|Y₁| (vert) et |Y₂| (orange) sur une période' })}
${EX('5. a^|n|', R`(pic en $n=0$, décroît des 2 côtés ; alterne si $a\lt0$). Couper en $n\ge0$ et $n\lt0$ :<br>$X = \sum_{n\ge0}(ae^{-j\theta})^n + \sum_{n\ge1}(ae^{j\theta})^n = \frac1{1-ae^{-j\theta}} + \frac{ae^{j\theta}}{1-ae^{j\theta}}$. Réduire au même dénominateur $(1-ae^{-j\theta})(1-ae^{j\theta}) = 1-2a\cos\theta+a^2$ :`)}
${F(R`$X(f) = \dfrac{1-a^2}{1-2a\cos(2\pi f/f_e)+a^2}$, réel ; $X(0) = \frac{1+a}{1-a}$, $X(\frac{f_e}2) = \frac{1-a}{1+a}$`)}
${MAT`
  f=linspace(-fe/2,fe/2,1000); th=2*pi*f/fe;
  X=(1-a^2)./(1-2*a*cos(th)+a^2); plot(f,X)
`}
`)}
${S('TD 4 — Ex. 1 : pôles en 0 (×2), zéros en ±1', R`
<p>(a) cercle unité, × double en 0, ○ en $+1$ et $-1$. (b) $H(z) = \frac{(z-1)(z+1)}{z^2} = 1 - z^{-2}$. (c) $y(n) = x(n) - x(n-2)$. (d) pas de $y$ passé → <b>RIF</b>, $h = \{\underset\uparrow1, 0, -1\}$. (e) pôles en 0 → <b>stable</b>.<br>
Bonus : $H(f) = 1-e^{-2j\theta} = 2je^{-j\theta}\sin\theta$, $|H| = 2|\sin\frac{2\pi f}{f_e}|$ : nul en 0 et $\frac{f_e}2$, max en $\frac{f_e}4$ → <b>passe-bande</b>. Indicielle : $s = \{\underset\uparrow1, 1, 0, 0\ldots\}$.</p>
${small({ x: [-0.55, 0.55], y: [-0.1, 2.3], h: 58, xl: 'f/fe', fns: [{ f: v => 2 * abs(sin(2 * PI * v)) }], xt: [[-0.5, '-½'], [-0.25, '-¼'], [0.25, '¼'], [0.5, '½']], yt: [[2, '2']], cap: 'Ex. 1 : passe-bande centré sur fe/4' })}
`)}
${S('TD 4 — Ex. 2 : y = ½x(n) + ½x(n−1)', R`
<p>(a) $H(z) = \frac12(1+z^{-1}) = \frac{z+1}{2z}$. (b) $h = \{\underset\uparrow{\frac12}, \frac12\}$. (c) $s = \{\underset\uparrow{\frac12}, 1, 1, \ldots\}$.<br>
(d) $H(f) = \frac12(1+e^{-j\theta}) = e^{-j\theta/2}\cos\frac\theta2$ : $|H| = \cos\frac{\pi f}{f_e}$ (1 en 0, 0 en $\frac{f_e}2$), phase $-\frac{\pi f}{f_e}$ <b>linéaire</b>.<br>
(e) <b>passe-bas</b> ; $\cos\frac{\pi f_c}{f_e} = \frac1{\sqrt2}$ → $f_c = \frac{f_e}4$.</p>
`)}
${S('TD 4 — Ex. 3 : y = ½x(n) − ½x(n−1)', R`
<p>(a) $H = \frac12(1-z^{-1}) = \frac{z-1}{2z}$. (b) $h = \{\underset\uparrow{\frac12}, -\frac12\}$. (c) $s = \{\underset\uparrow{\frac12}, 0, 0\ldots\}$.<br>
(d) $H(f) = je^{-j\theta/2}\sin\frac\theta2$ : $|H| = |\sin\frac{\pi f}{f_e}|$ (0 en 0, 1 en $\frac{f_e}2$) ; phase $\frac\pi2 - \frac{\pi f}{f_e}$ ($f\gt0$), $-\frac\pi2-\frac{\pi f}{f_e}$ ($f\lt0$).<br>
(e) <b>passe-haut</b>, $f_c = \frac{f_e}4$.</p>
${small({ x: [-0.55, 0.55], y: [-0.1, 1.2], xl: 'f/fe', hlines: [Math.SQRT1_2], fns: [{ f: v => abs(cos(PI * v)) }, { f: v => abs(sin(PI * v)), cls: 'c2' }], xt: [[-0.5, '-½'], [-0.25, '-¼'], [0.25, '¼'], [0.5, '½']], cap: 'Ex. 2 passe-bas (vert) · Ex. 3 passe-haut (orange) · se croisent à 0,71 en fe/4' })}
`)}
${S('TD 4 — Ex. 4 : y = a·y(n−1) + x(n)', R`
<p>(a) $Y = az^{-1}Y + X$ → $H(z) = \frac1{1-az^{-1}} = \frac z{z-a}$ : pôle $a$, zéro 0 → stable $\iff |a|\lt1$.<br>
(b) $h(0) = 1$, $h(1) = a$, $h(2) = a^2$… → $h(n) = a^nu(n)$ (RII).<br>
(c) $s(n) = \sum_{k=0}^na^k = \frac{1-a^{n+1}}{1-a}$ → $\frac1{1-a}$.<br>
(d) $H(f) = \frac1{1-ae^{-j\theta}}$, $|H| = \frac1{\sqrt{1-2a\cos\theta+a^2}}$, $\arg H = -\arctan\frac{a\sin\theta}{1-a\cos\theta}$.<br>
(e) $|H(0)| = \frac1{1-a}$, $|H(\frac{f_e}2)| = \frac1{1+a}$ → $0\lt a\lt1$ <b>passe-bas</b>, $-1\lt a\lt0$ <b>passe-haut</b>.</p>
${F(R`$|H(f_c)|^2 = \frac12|H(0)|^2 \iff \cos\theta_c = \frac{4a-1-a^2}{2a}$, \ $f_c = \frac{f_e\theta_c}{2\pi}$ \ ($a = 0{,}5$ : $f_c \approx 0{,}115f_e$)`)}
${plots(
  plot({ x: [-1.5, 1.5], y: [-1.3, 1.3], w: 120, h: 110, equal: true, fns: [{ fx: t => cos(t), fy: t => sin(t), t: [0, 2 * PI], cls: 'muted' }], pts: [{ x: 0, y: 0, k: 'pole', l: '×2' }, { x: 1, y: 0, k: 'zero' }, { x: -1, y: 0, k: 'zero' }], cap: 'Ex. 1' }),
  plot({ x: [-1.5, 1.5], y: [-1.3, 1.3], w: 120, h: 110, equal: true, fns: [{ fx: t => cos(t), fy: t => sin(t), t: [0, 2 * PI], cls: 'muted' }], pts: [{ x: 0.6, y: 0, k: 'pole', l: 'a' }, { x: 0, y: 0, k: 'zero' }], cap: 'Ex. 4 (a = 0,6)' })
)}
`)}
${S('Exos types', R`
${EX('Convolution', R`$\{\underset\uparrow1,-1,2\}*\{\underset\uparrow2,1\}$ : $y_0 = 2$, $y_1 = 1-2 = -1$, $y_2 = -1+4 = 3$, $y_3 = 2$ → $\{\underset\uparrow2,-1,3,2\}$.`)}
${EX('Période', R`$f_0 = 3$ kHz, $f_e = 8$ kHz → $\nu_0 = \frac38$ → $N_0 = 8$. $\cos(\frac{\pi}{3}n)$ → $\nu_0 = \frac16$ → 6.`)}
${EX('TFD', R`$f_e = 1$ kHz, $N = 500$ → $\Delta f = 2$ Hz, durée 0,5 s. Résolution 1 Hz → observer 1 s. Pic Matlab indice 51 ($N = F_e$) → 50 Hz.`)}
${EX('Stabilité', R`$y = 1{,}2y(n-1)+x(n)$ → pôle 1,2 → instable ; $h = 1{,}2^n$ explose.`)}
`)}
${S('Exos types : TFD à la main et filtres', R`
${table(['$x[n]$ ($N=4$)', '$X[k]$', 'pourquoi'], [
  ['$\\{1,0,0,0\\}$ (δ)', '$\\{1,1,1,1\\}$', 'δ → toutes les fréquences'],
  ['$\\{1,1,1,1\\}$', '$\\{4,0,0,0\\}$', 'constante → seulement $k=0$'],
  ['$\\{1,-1,1,-1\\}$', '$\\{0,0,4,0\\}$', 'alterne = $f_e/2$ → $k = N/2$'],
  ['$\\{0,1,0,0\\}$', '$\\{1,-j,-1,j\\}$', 'retard → $e^{-j2\\pi k/4}$']
])}
${EX('RII + RIF', R`$y = 0{,}5y(n\!-\!1)+x(n)+x(n\!-\!1)$ : $H = \frac{1+z^{-1}}{1-0{,}5z^{-1}}$ ; pôle 0,5 (stable), zéro $-1$ (tue $\frac{f_e}2$ → passe-bas) ; $h(0) = 1$, $h(n) = 1{,}5\cdot0{,}5^{n-1}$ pour $n\ge1$ ; $H(1) = \frac{2}{0{,}5} = 4$.`)}
${EX('Lire le type', R`zéros en $\pm j$ ($\theta = \pm\frac\pi2$) → coupe $\frac{f_e}4$ : <b>coupe-bande</b> (réjecteur) ; pôle en $0{,}9$ → bosse en $f = 0$ : passe-bas.`)}
${small({ x: [-0.5, 6.5], y: [-0.2, 2.2], xl: 'n', stems: [{ n: [0, 1, 2, 3, 4, 5, 6], v: [0, 1, 2, 3, 4, 5, 6].map(n => (1 - Math.pow(0.5, n + 1)) / 0.5) }], hlines: [2], cap: 'Indicielle TD 4-4 (a = 0,5) → 1/(1−a) = 2' })}
`)}
${S('Exos types : énergie, ordre 2, inverse', R`
${EX('Énergie / puissance', R`$(-0{,}5)^nu(n)$ : $E = \frac1{1-0{,}25} = \frac43$. $\cos(\frac\pi2n) = \{1,0,-1,0\}$ périodique $N_0 = 4$ : $P = \frac{1+0+1+0}4 = \frac12$.`)}
${EX('Ordre 2', R`$y = x(n) + 0{,}25\,y(n\!-\!2)$ : $H = \frac1{1-0{,}25z^{-2}}$, pôles $\pm0{,}5$ → stable. Éléments simples : $\frac12\big[\frac1{1-0{,}5z^{-1}} + \frac1{1+0{,}5z^{-1}}\big]$ → $h(n) = \frac12[0{,}5^n + (-0{,}5)^n]$ = $0{,}5^n$ si $n$ pair, 0 sinon.`)}
${EX('h depuis H(z)', R`$H = \frac{1-z^{-1}}{1-0{,}8z^{-1}}$ → $h = 0{,}8^nu(n) - 0{,}8^{n-1}u(n-1)$ : $h(0) = 1$, $h(n\ge1) = -0{,}2\cdot0{,}8^{n-1}$. Zéro en 1 → passe-haut ; pôle 0,8 → stable.`)}
${EX('TFtd d’une porte', R`$\{1, \underset\uparrow1, 1\}$ → $e^{j\theta} + 1 + e^{-j\theta} = 1 + 2\cos\theta$ (s'annule en $\theta = \pm\frac{2\pi}3$ : $f = \pm\frac{f_e}3$).`)}
${EX('Convolution avec u', R`$a^nu(n)*u(n) = \sum_{k=0}^na^k = \frac{1-a^{n+1}}{1-a}$ = réponse indicielle du RII.`)}
`)}
${P(R`simplifier $\nu_0$ avant $N_0$ · $x(-n+2)$ : miroir <b>puis</b> droite · zéros ≠ stabilité · RIF toujours stable · TFtd périodique ($f_e$) · Matlab indexe à 1.`)}
`
  ]
}
  };
})();
