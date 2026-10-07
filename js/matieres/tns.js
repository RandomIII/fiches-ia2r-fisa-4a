/*
 * Matière : Traitement numérique du signal (S. Miron, Polytech Nancy 4A).
 * Les textes passent par R`...` (String.raw) pour garder le LaTeX intact : $...$ en ligne, $$...$$ centré.
 * Dans les formules, écrire \lt et \gt au lieu de < et > (sinon le HTML les prend pour des balises).
 */
(function () {
  const THEMES = {
    signaux:  { nom: 'Signaux & opérations', couleur: '#3b6fd8' },
    fourier:  { nom: 'Fourier',              couleur: '#8250df' },
    echant:   { nom: 'Échantillonnage',      couleur: '#d4730b' },
    discret:  { nom: 'Temps discret',        couleur: '#1a8a5a' },
    tfd:      { nom: 'TFtd · TFD · FFT',     couleur: '#0e8a9a' },
    filtres:  { nom: 'Filtres numériques',   couleur: '#cf3a3a' },
    matlab:   { nom: 'Matlab',               couleur: '#b83280' }
  };

  const TPS = {
    p1: 'Partie 1 · Continu & Fourier',
    p2: 'Partie 2 · Échantillonnage',
    p3: 'Partie 3 · Discret & filtres'
  };
  const TPS_COURT = { p1: 'Partie 1', p2: 'Partie 2', p3: 'Partie 3' };
  const { rect, tri, u, sinc } = SIG;
  const PI = Math.PI, cos = Math.cos, sin = Math.sin, abs = Math.abs;

  const FICHES = [

/* ============================================================ PARTIE 1 */
{
  id: 'intro', theme: 'signaux', tps: ['p1'],
  titre: 'Le traitement du signal en une image',
  resume: 'Un capteur donne un signal, on le numérise, on le traite, on en tire une information.',
  corps: R`
${idee(R`<p>Un <b>signal</b> est une grandeur qui varie (tension, son, image…) et qui <b>porte une information</b>. Mathématiquement, c'est une fonction : $x(t)$ pour un signal continu ($t \in \mathbb{R}$), $x(n)$ pour un signal discret ($n \in \mathbb{Z}$), $I(m,n)$ pour une image.</p>`)}
<h4>La chaîne complète</h4>
<p><b>Phénomène physique</b> → <b>capteur</b> (signal analogique) → <b>conversion analogique-numérique</b> → <b>analyse / filtrage numérique</b> → <b>information, décision</b>.</p>
<h4>Deux façons de regarder le même signal</h4>
${table(['Domaine', 'Ce qu’on voit', 'Outil'], [
  ['<b>Temps</b>', 'la forme d’onde : <i>quand</i> les choses arrivent', R`$x(t)$`],
  ['<b>Fréquence</b>', 'le spectre : <i>à quelles fréquences</i> le signal vibre', R`$X(f)$`]
])}
<p>C'est <b>la même information</b>, vue sous deux angles. Tout le cours consiste à passer de l'un à l'autre.</p>
${retenir(R`<p>Le traitement du signal sert à <b>analyser</b> (détecter, mesurer), <b>transformer</b> (filtrer, compresser) et <b>transmettre</b> (coder, moduler) des signaux.</p>`)}
`},

{
  id: 'classification', theme: 'signaux', tps: ['p1'],
  titre: 'Classer un signal',
  resume: 'Continu ou discret, périodique ou non, déterministe ou aléatoire, causal ou non : 4 questions indépendantes.',
  corps: R`
${table(['Question', 'Oui', 'Non'], [
  ['Défini pour tout $t$ réel ?', '<b>continu</b> $x(t)$', '<b>discret</b> $x(n)$ (seulement aux entiers)'],
  ['Se répète à l’identique ?', R`<b>périodique</b> : $x(t+T_0)=x(t)$ pour tout $t$`, '<b>apériodique</b>'],
  ['Prévisible par une formule ?', '<b>déterministe</b> (une sinusoïde)', '<b>aléatoire</b> (un bruit)'],
  ['Nul avant $t=0$ ?', R`<b>causal</b> : $x(t)=0$ pour $t \lt 0$`, '<b>non causal</b>']
])}
<p>Pour un signal périodique, $T_0$ est la <b>période fondamentale</b> (la plus petite) et $f_0 = 1/T_0$ la <b>fréquence fondamentale</b>.</p>
${plots(
  plot({ x: [-2.5, 3.5], y: [-1.4, 1.4], xl: 't', yl: 'x(t)', fns: [{ f: t => sin(2 * PI * t) }], xt: [[1, 'T0']], cap: 'Périodique' }),
  plot({ x: [-2.5, 3.5], y: [-0.4, 1.4], xl: 't', yl: 'x(t)', fns: [{ f: t => u(t) * Math.exp(-t) }], cap: 'Causal (nul pour t < 0)' })
)}
${retenir(R`<p>Ces 4 propriétés sont <b>indépendantes</b> : un signal peut être continu, déterministe, apériodique et causal à la fois.</p>`)}
${piege(R`<p>Pour un <b>système temps réel</b>, « causal » veut dire aussi : la sortie n'utilise <b>pas d'entrées futures</b> (qu'on ne connaît pas encore).</p>`)}
`},

{
  id: 'sinusoide', theme: 'signaux', tps: ['p1'],
  titre: 'La sinusoïde',
  resume: 'x(t) = A cos(2πf₀t + φ) : amplitude, fréquence, phase. Le signal périodique de base.',
  corps: R`
$$x(t) = A\cos(2\pi f_0 t + \varphi), \qquad T_0 = \frac{1}{f_0}, \qquad \omega_0 = 2\pi f_0$$
${table(['Paramètre', 'Sens', 'Unité'], [
  ['$A$', 'amplitude (hauteur max)', 'unité mesurée (V, Pa…)'],
  ['$f_0$', 'fréquence : nombre de périodes par seconde', 'Hz'],
  ['$T_0 = 1/f_0$', 'période : durée d’une oscillation', 's'],
  [R`$\varphi$`, 'phase à l’origine : décalage de la courbe', 'rad'],
  [R`$\omega_0 = 2\pi f_0$`, 'pulsation', 'rad/s']
])}
${plot({ x: [-0.3, 2.3], y: [-1.5, 1.5], xl: 't', yl: 'x(t)', fns: [{ f: t => cos(2 * PI * t - 0.6) }], xt: [[1, 'T0'], [2, '2T0']], yt: [[1, 'A'], [-1, '-A']] })}
${methode(R`<p><b>Lire la fréquence dans une formule</b> : mettre l'argument sous la forme $2\pi f_0 t$.<br>
Exemple : $\cos(8000\pi t) = \cos(2\pi \cdot 4000\, t)$ → $f_0 = 4$ kHz.<br>
Exemple : $\cos(40\pi t)$ → $f_0 = 20$ Hz.</p>`)}
${piege(R`<p>Ne pas confondre $f_0$ (en Hz) et $\omega_0$ (en rad/s). Dans $\cos(100\pi t)$, la fréquence est <b>50 Hz</b>, pas 100 ni $100\pi$.</p>`)}
`},

{
  id: 'dirac', theme: 'signaux', tps: ['p1', 'p2'],
  titre: 'L’impulsion de Dirac δ(t)',
  resume: 'Une impulsion infiniment brève d’aire 1. Elle « prélève » une valeur et décale un signal.',
  corps: R`
${idee(R`<p>$\delta(t)$ est nulle partout sauf en $t=0$, et son <b>aire vaut 1</b> : $\int_{-\infty}^{+\infty}\delta(t)\,dt = 1$. Ce n'est pas une vraie fonction mais une <b>distribution</b>. Physiquement : une impulsion très brève d'aire 1. On la dessine par une <b>flèche</b> dont la hauteur indique le poids.</p>`)}
${plot({ x: [-2, 3], y: [-0.2, 1.4], xl: 't', diracs: [{ x: 0, a: 1, l: '1' }, { x: 2, a: 0.6, l: '0,6', cls: 'c2' }], cap: 'δ(t) et 0,6·δ(t − 2)' })}
<h4>Les 3 propriétés à savoir par cœur</h4>
${table(['Propriété', 'Formule', 'En clair'], [
  ['Prélèvement', R`$x(t)\,\delta(t-t_0) = x(t_0)\,\delta(t-t_0)$`, 'multiplier par un Dirac garde la valeur à cet instant'],
  ['Décalage', R`$x(t) * \delta(t-t_0) = x(t-t_0)$`, 'convoluer par un Dirac décale le signal'],
  ['Spectre', R`$\delta(t) \;\xrightarrow{\mathcal F}\; 1$`, 'une impulsion contient toutes les fréquences']
])}
<h4>Le peigne de Dirac</h4>
$$\text{Ш}_{T_e}(t) = \sum_{n=-\infty}^{+\infty}\delta(t - nT_e)$$
<p>Une suite de Dirac espacés de $T_e$. C'est le modèle de l'<b>échantillonnage idéal</b> (partie 2).</p>
${plot({ x: [-2.6, 3.6], y: [-0.2, 1.4], xl: 't', diracs: [-2, -1, 0, 1, 2, 3].map(x => ({ x, a: 1 })), xt: [[1, 'Te']], cap: 'Peigne de Dirac de période Te' })}
`},

{
  id: 'signaux-usuels', theme: 'signaux', tps: ['p1'],
  titre: 'Échelon, rampe, porte, sinus cardinal',
  resume: 'Les briques de base : u(t), r(t), rect(t), sinc(t), triang(t).',
  corps: R`
${table(['Signal', 'Définition'], [
  ['Échelon $u(t)$', '$1$ si $t \\ge 0$, $0$ sinon'],
  ['Rampe $r(t)$', '$t\\,u(t)$'],
  ['Porte $\\mathrm{rect}(t)$', '$1$ si $|t| \\le 1/2$, $0$ sinon (largeur 1, centrée en 0)'],
  ['Triangle $\\mathrm{triang}(t)$', '$\\max(1-|t|,\\,0)$ (base de largeur 2)'],
  ['Sinus cardinal', R`$\mathrm{sinc}(t) = \dfrac{\sin(\pi t)}{\pi t}$, avec $\mathrm{sinc}(0)=1$`]
])}
${plots(
  plot({ x: [-2, 2], y: [-0.3, 1.4], xl: 't', yl: 'u(t)', fns: [{ f: u }], cap: 'Échelon' }),
  plot({ x: [-2, 2], y: [-0.3, 1.4], xl: 't', yl: 'rect(t)', fns: [{ f: rect }], xt: [[-0.5, '-1/2'], [0.5, '1/2']], cap: 'Porte' }),
  plot({ x: [-2, 2], y: [-0.3, 1.4], xl: 't', yl: 'triang(t)', fns: [{ f: tri }], xt: [[-1, '-1'], [1, '1']], cap: 'Triangle' }),
  plot({ x: [-4.5, 4.5], y: [-0.4, 1.3], xl: 't', yl: 'sinc(t)', fns: [{ f: sinc }], xt: [[-2, '-2'], [-1, '-1'], [1, '1'], [2, '2']], cap: 'Sinus cardinal' })
)}
${retenir(R`<ul><li>$\mathrm{sinc}$ s'annule à tous les <b>entiers non nuls</b> ($\pm1, \pm2, \dots$).</li>
<li>$\mathrm{rect}(t/T)$ est une porte de <b>largeur $T$</b>, centrée en 0.</li>
<li>$\mathrm{rect} * \mathrm{rect} = \mathrm{triang}$ (voir la fiche convolution).</li></ul>`)}
`},

{
  id: 'decalage-echelle', theme: 'signaux', tps: ['p1'],
  titre: 'Décaler, retourner, dilater un signal',
  resume: 'x(t − t₀) va à droite, x(t/T) s’étire si T > 1. Pour x(at + b) : d’abord l’échelle, puis le décalage.',
  corps: R`
${table(['Opération', 'Effet sur la courbe'], [
  ['$x(t-t_0)$, $t_0 \\gt 0$', '<b>retard</b> : décalée vers la <b>droite</b> de $t_0$'],
  ['$x(t+t_0)$', '<b>avance</b> : décalée vers la <b>gauche</b>'],
  ['$x(-t)$', '<b>retournement</b> : miroir par rapport à l’axe vertical'],
  ['$x(t/T)$, $T \\gt 1$', '<b>dilatée</b> (plus large) : support $[-T, T]$ si celui de $x$ est $[-1,1]$'],
  ['$x(t/T)$, $0 \\lt T \\lt 1$', '<b>comprimée</b> (plus étroite)'],
  ['$A\\,x(t)$', 'hauteur multipliée par $A$ (retournée si $A \\lt 0$)']
])}
${methode(R`<p>Pour $x(at+b)$ : <b>factoriser</b> pour écrire $x\!\left(a\,(t - t_0)\right)$ avec $t_0 = -b/a$.</p>
<ol><li>Tracer $x(at)$ (échelle, et retournement si $a \lt 0$).</li><li>Décaler le résultat de $t_0$.</li></ol>
<p><b>Vérification rapide</b> : un point caractéristique de $x$ en $t=c$ se retrouve là où $at+b = c$, soit $t = (c-b)/a$.</p>`)}
<h4>Exemple</h4>
<p>$-2\,\mathrm{rect}\!\left(\frac{2t+1}{2}\right) = -2\,\mathrm{rect}(t + \tfrac12)$ : porte de largeur 1 centrée en $-\tfrac12$ (support $[-1, 0]$), hauteur $-2$.</p>
${plots(
  plot({ x: [-2.5, 2.5], y: [-2.4, 1.4], xl: 't', fns: [{ f: rect, cls: 'muted' }, { f: t => -2 * rect(t + 0.5) }], xt: [[-1, '-1'], [1, '1']], yt: [[-2, '-2']], cap: 'rect(t) (gris) → −2 rect(t + 1/2)' }),
  plot({ x: [-3, 4], y: [-0.3, 1.4], xl: 't', fns: [{ f: t => rect(t / 2), cls: 'muted' }, { f: t => rect((t - 2) / 2) }], xt: [[-1, '-1'], [1, '1'], [3, '3']], cap: 'rect(t/2) → rect(t/2 − 1) = rect((t − 2)/2)' })
)}
${piege(R`<p>$x(2t+1)$ n'est <b>pas</b> « $x(2t)$ décalé de 1 » mais de $\tfrac12$ vers la gauche, car $2t+1 = 2(t+\tfrac12)$. Toujours factoriser !</p>`)}
${enTD(R`<p>TD 1, ex. 2 : $x$ vit sur $[0,2]$. Alors $x(-t+1)$ vit là où $0 \le -t+1 \le 2$, soit $t \in [-1, 1]$, et la courbe est retournée.</p>`)}
`},

{
  id: 'convolution', theme: 'signaux', tps: ['p1'],
  titre: 'Le produit de convolution',
  resume: 'Retourner, glisser, multiplier, intégrer. C’est ce que fait un filtre à un signal.',
  corps: R`
$$(x*h)(t) = \int_{-\infty}^{+\infty} x(\tau)\,h(t-\tau)\,d\tau$$
${idee(R`<p>La convolution « mélange » deux signaux : pour chaque instant $t$, on fait glisser $h$ retourné sur $x$ et on mesure la <b>surface commune</b> (l'intégrale du produit). C'est exactement ce que fait un <b>système linéaire invariant</b> (un filtre) de réponse impulsionnelle $h$ : $y = x * h$.</p>`)}
${methode(R`<ol><li><b>Retourner</b> $h(\tau)$ → $h(-\tau)$.</li><li><b>Glisser</b> de $t$ → $h(t-\tau)$.</li><li><b>Multiplier</b> par $x(\tau)$.</li><li><b>Intégrer</b> (surface) → valeur de $(x*h)(t)$. Recommencer pour chaque $t$.</li></ol>`)}
${plot({ x: [-2, 2], y: [-0.2, 1.4], xl: 't', fns: [{ f: rect, cls: 'muted', dash: true }, { f: tri }], xt: [[-1, '-1'], [-0.5, '-1/2'], [0.5, '1/2'], [1, '1']], cap: 'rect * rect = triang : la surface commune croît puis décroît' })}
${table(['Propriété', 'Formule'], [
  ['Commutative', '$x*h = h*x$'],
  ['Associative', '$x*(h*g) = (x*h)*g$'],
  ['Distributive', '$x*(h+g) = x*h + x*g$'],
  ['Élément neutre', R`$x*\delta = x$`],
  ['Décalage', R`$x(t)*\delta(t-t_0) = x(t-t_0)$`]
])}
${retenir(R`<p>La largeur du résultat = <b>somme des largeurs</b> (porte de largeur 1 * porte de largeur 1 → triangle de base 2).<br>Convolution en temps ⟺ <b>produit</b> en fréquence (fiche propriétés de la TF).</p>`)}
${enTD(R`<p>TD 1, ex. 1(d) : $\mathrm{rect}(t/2) * [\delta(t+1) - \delta(t) + 2\delta(t-1) - \delta(t-\tfrac32)]$. Par distributivité, c'est une <b>somme de portes décalées</b> : $\mathrm{rect}(\tfrac{t+1}{2}) - \mathrm{rect}(\tfrac{t}{2}) + 2\,\mathrm{rect}(\tfrac{t-1}{2}) - \mathrm{rect}(\tfrac{t-3/2}{2})$. On les trace puis on les additionne.</p>`)}
`},

{
  id: 'series-fourier', theme: 'fourier', tps: ['p1'],
  titre: 'Série de Fourier d’un signal périodique',
  resume: 'Tout signal périodique = une constante + des cosinus aux fréquences f₀, 2f₀, 3f₀… → un spectre de raies.',
  corps: R`
$$x(t) = A_0 + \sum_{n=1}^{\infty} A_n \cos(n\omega_0 t + \varphi_n), \qquad \omega_0 = 2\pi f_0 = \frac{2\pi}{T_0}$$
${table(['Terme', 'Nom', 'Sens'], [
  ['$A_0$', 'composante continue', 'la <b>valeur moyenne</b> du signal'],
  ['$A_1\\cos(\\omega_0 t + \\varphi_1)$', 'fondamental', 'à la fréquence $f_0$ du signal'],
  ['$A_n\\cos(n\\omega_0 t + \\varphi_n)$', 'harmonique de rang $n$', 'à la fréquence $n f_0$']
])}
<h4>Exemple : le créneau (rapport cyclique 50 %)</h4>
$$x(t) = \frac12 + \frac{2}{\pi}\sum_{m=0}^{\infty} \frac{(-1)^m}{2m+1}\cos\big((2m+1)\omega_0 t\big)$$
<p>$A_0 = \tfrac12$, harmoniques <b>paires nulles</b>, harmoniques impaires $A_{2m+1} = \frac{2}{(2m+1)\pi}$ (phase $0$ ou $\pi$ selon le signe).</p>
${plots(
  plot({ x: [-1.2, 1.2], y: [-0.3, 1.4], xl: 't/T0', fns: [{ f: t => (abs(((t % 1) + 1) % 1 - 0.5) > 0.25 ? 1 : 0), cls: 'muted' }, { f: t => 0.5 + 2 / PI * (cos(2 * PI * t) - cos(6 * PI * t) / 3 + cos(10 * PI * t) / 5 - cos(14 * PI * t) / 7) }], xt: [[-1, '-1'], [1, '1']], cap: 'Créneau et somme des 4 premières harmoniques' }),
  plot({ x: [-0.3, 7.6], y: [-0.1, 0.8], xl: 'f', yl: 'An', stems: [{ n: [0, 1, 3, 5, 7], v: [0.5, 2 / PI, 2 / (3 * PI), 2 / (5 * PI), 2 / (7 * PI)] }], xt: [[1, 'f0'], [3, '3f0'], [5, '5f0'], [7, '7f0']], yt: [[0.5, '1/2'], [2 / PI, '2/π']], cap: 'Spectre unilatéral d’amplitude : des raies' })
)}
${retenir(R`<p>Signal <b>périodique</b> en temps ⟺ spectre <b>discret</b> (des raies aux multiples de $f_0$). Plus le signal a des « coins », plus il faut d'harmoniques pour le reconstruire.</p>`)}
`},

{
  id: 'tf', theme: 'fourier', tps: ['p1'],
  titre: 'Transformée de Fourier (TF)',
  resume: 'X(f) dit « combien » de chaque fréquence f contient un signal apériodique. Spectre continu.',
  corps: R`
$$X(f) = \int_{-\infty}^{+\infty} x(t)\,e^{-j2\pi f t}\,dt \qquad\qquad x(t) = \int_{-\infty}^{+\infty} X(f)\,e^{j2\pi f t}\,df$$
${idee(R`<p>Pour un signal <b>non périodique</b>, il n'y a plus de raies isolées : le spectre devient une <b>fonction continue</b> de $f$. $X(f)$ est un nombre <b>complexe</b> : son module dit l'importance de la fréquence $f$, son argument dit son décalage (sa phase).</p>`)}
${table(['Tracé', 'Formule'], [
  ['Spectre bilatéral d’<b>amplitude</b>', '$|X(f)|$ en fonction de $f \\in \\mathbb{R}$'],
  ['Spectre bilatéral de <b>phase</b>', '$\\arg X(f)$ en fonction de $f$']
])}
${plots(
  plot({ x: [-2, 2], y: [-0.3, 1.4], xl: 't', yl: 'rect(t)', fns: [{ f: rect }], xt: [[-0.5, '-1/2'], [0.5, '1/2']] }),
  plot({ x: [-4.5, 4.5], y: [-0.4, 1.3], xl: 'f', yl: 'X(f) = sinc(f)', fns: [{ f: sinc }], xt: [[-1, '-1'], [1, '1'], [2, '2']] })
)}
${retenir(R`<ul><li>Pour un signal <b>réel</b>, $|X(f)|$ est <b>pair</b> et $\arg X(f)$ est <b>impaire</b> : la moitié $f \lt 0$ est le miroir de $f \gt 0$.</li>
<li>« Bilatéral » = on trace aussi les fréquences négatives.</li>
<li>Signal <b>court</b> en temps ⟺ spectre <b>large</b> (et inversement).</li></ul>`)}
`},

{
  id: 'tf-proprietes', theme: 'fourier', tps: ['p1', 'p2'],
  titre: 'Propriétés de la TF',
  resume: 'Retard → phase, modulation → décalage du spectre, convolution ↔ produit. Le tableau qui sert partout.',
  corps: R`
${table(['Propriété', 'Temps', 'Fréquence', 'À retenir'], [
  ['Linéarité', '$a\\,x(t) + b\\,y(t)$', '$a\\,X(f) + b\\,Y(f)$', 'la TF d’une somme = somme des TF'],
  ['Retard', '$x(t-t_0)$', '$X(f)\\,e^{-j2\\pi f t_0}$', '|X| inchangé, seule la phase bouge'],
  ['Modulation', '$x(t)\\,e^{j2\\pi f_0 t}$', '$X(f-f_0)$', 'le spectre est décalé de $f_0$'],
  ['Échelle', '$x(t/T)$', '$|T|\\,X(Tf)$', 'dilater en temps = comprimer en fréquence'],
  ['Dérivation', '$\\frac{dx}{dt}$', '$j2\\pi f\\,X(f)$', 'renforce les hautes fréquences'],
  ['Convolution', '$x(t) * h(t)$', '$X(f)\\,H(f)$', '<b>filtrer = multiplier le spectre</b>'],
  ['Produit', '$x(t)\\,h(t)$', '$X(f) * H(f)$', 'échantillonner = convoluer le spectre'],
  ['Parseval', '$\\int |x(t)|^2 dt$', '$\\int |X(f)|^2 df$', 'même énergie dans les deux domaines']
])}
${methode(R`<p><b>TF de $\mathrm{rect}(t/T)$ :</b> échelle avec $X(f)=\mathrm{sinc}(f)$ → $T\,\mathrm{sinc}(Tf)$. Une porte de largeur $T$ donne un sinc dont le premier zéro est en $1/T$.</p>`)}
${retenir(R`<p>Les deux lignes les plus utiles du cours : <b>convolution ↔ produit</b> et <b>produit ↔ convolution</b>. Toute la partie 2 (échantillonnage) en découle.</p>`)}
`},

{
  id: 'tf-paires', theme: 'fourier', tps: ['p1', 'p2', 'p3'],
  titre: 'Les paires de TF à connaître',
  resume: 'δ ↔ 1, rect ↔ sinc, cos ↔ deux Dirac, exponentielle ↔ 1/(a + j2πf)…',
  corps: R`
${table(['Signal $x(t)$', 'TF $X(f)$'], [
  ['$\\delta(t)$', '$1$'],
  ['$1$', '$\\delta(f)$'],
  ['$\\delta(t-t_0)$', '$e^{-j2\\pi f t_0}$'],
  ['$e^{j2\\pi f_0 t}$', '$\\delta(f-f_0)$'],
  ['$\\cos(2\\pi f_0 t)$', '$\\frac12[\\delta(f-f_0) + \\delta(f+f_0)]$'],
  ['$\\sin(2\\pi f_0 t)$', '$\\frac{1}{2j}[\\delta(f-f_0) - \\delta(f+f_0)]$'],
  ['$\\mathrm{rect}(t)$', '$\\mathrm{sinc}(f)$'],
  ['$\\mathrm{sinc}(t)$', '$\\mathrm{rect}(f)$'],
  ['$\\mathrm{triang}(t)$', '$\\mathrm{sinc}^2(f)$'],
  ['$e^{-at}u(t)$, $a\\gt0$', '$\\dfrac{1}{a + j2\\pi f}$'],
  ['$e^{-a|t|}$, $a\\gt0$', '$\\dfrac{2a}{a^2 + (2\\pi f)^2}$'],
  ['$\\sum_k \\delta(t-kT)$', '$\\frac1T\\sum_n \\delta(f - \\frac nT)$']
])}
${retenir(R`<p>Logique de <b>dualité</b> : $\delta \leftrightarrow 1$ et $1 \leftrightarrow \delta$ ; $\mathrm{rect} \leftrightarrow \mathrm{sinc}$ et $\mathrm{sinc} \leftrightarrow \mathrm{rect}$. Un peigne donne un peigne (de période inverse).</p>`)}
<p>Convention du cours : $\mathrm{sinc}(x) = \dfrac{\sin(\pi x)}{\pi x}$, $\mathrm{rect}(t) = 1$ pour $|t| \le \frac12$, $\mathrm{triang}(t) = \max(1-|t|, 0)$.</p>
<p><a class="btn" href="pdf/tables/table-TF.pdf" download>⬇ Table officielle des TF (PDF)</a></p>
`},

{
  id: 'spectre-sinus', theme: 'fourier', tps: ['p1'],
  titre: 'Spectre d’une sinusoïde et d’un produit de cosinus',
  resume: 'Un cosinus = deux raies en ±f₀ de hauteur A/2. Un produit de cosinus = somme et différence des fréquences.',
  corps: R`
$$x(t) = A\cos(2\pi f_0 t + \varphi) \;\xrightarrow{\mathcal F}\; X(f) = \frac A2 e^{j\varphi}\delta(f-f_0) + \frac A2 e^{-j\varphi}\delta(f+f_0)$$
${plot({ x: [-2, 2], y: [-0.2, 1.3], xl: 'f', yl: '|X(f)|', diracs: [{ x: -1, a: 0.6, l: 'A/2' }, { x: 1, a: 0.6, l: 'A/2' }], xt: [[-1, '-f0'], [1, 'f0']] })}
<h4>Produit de deux cosinus (TD 1, ex. 3)</h4>
<p>$x(t) = \cos(40\pi t)\cos(200\pi t)$ : fréquences $20$ Hz et $100$ Hz.</p>
${methode(R`<p><b>Méthode 1 (trigo)</b> : $\cos a \cos b = \frac12[\cos(a-b) + \cos(a+b)]$<br>
$x(t) = \frac12\cos(2\pi\,80\,t) + \frac12\cos(2\pi\,120\,t)$ → 4 raies de hauteur $\frac14$ en $\pm 80$ et $\pm120$ Hz.</p>
<p><b>Méthode 2 (propriété produit → convolution)</b> : $X = \frac12[\delta(f-20)+\delta(f+20)] * \frac12[\delta(f-100)+\delta(f+100)]$. Convoluer par un Dirac décale : chaque raie à $\pm100$ est recopiée en $\pm 20$ autour → mêmes 4 raies.</p>`)}
${plot({ x: [-150, 150], y: [-0.05, 0.4], w: 400, xl: 'f (Hz)', yl: '|X(f)|', diracs: [-120, -80, 80, 120].map(x => ({ x, a: 0.25, l: '1/4' })), xt: [[-120, '-120'], [-80, '-80'], [80, '80'], [120, '120']] })}
${retenir(R`<p>Multiplier par $\cos(2\pi f_0 t)$ (<b>modulation</b>) recopie le spectre en $\pm f_0$ avec un facteur $\frac12$.</p>`)}
`},

/* ============================================================ PARTIE 2 */
{
  id: 'echantillonnage', theme: 'echant', tps: ['p2'],
  titre: 'Échantillonner : ce qui se passe en temps et en fréquence',
  resume: 'En temps : multiplier par un peigne de Dirac. En fréquence : recopier le spectre tous les fe.',
  corps: R`
${idee(R`<p><b>Échantillonner</b> = relever la valeur du signal toutes les $T_e$ secondes ($f_e = 1/T_e$ = fréquence d'échantillonnage).</p>`)}
<h4>Dans le temps : produit par un peigne</h4>
$$x_e(t) = x(t)\cdot \text{Ш}_{T_e}(t) = \sum_n x(nT_e)\,\delta(t-nT_e)$$
<h4>En fréquence : convolution par un peigne</h4>
$$X_e(f) = X(f) * \Big(f_e\sum_k \delta(f-kf_e)\Big) = f_e\sum_{k=-\infty}^{+\infty} X(f - kf_e)$$
${plots(
  plot({ x: [-1.4, 1.4], y: [-1.3, 1.4], xl: 't', fns: [{ f: t => cos(2 * PI * 0.8 * t) * Math.exp(-t * t), cls: 'muted', dash: true }], diracs: [-1.2, -0.9, -0.6, -0.3, 0, 0.3, 0.6, 0.9, 1.2].map(x => ({ x, a: cos(2 * PI * 0.8 * x) * Math.exp(-x * x) })), cap: 'xe(t) : des Dirac pondérés par x(nTe)' }),
  plot({ x: [-3.2, 3.2], y: [-0.1, 1.3], xl: 'f', fns: [{ f: f => [-2, -1, 0, 1, 2].reduce((s, k) => s + tri((f - 2.2 * k) / 0.8), 0) }], xt: [[-2.2, '-fe'], [0, '0'], [2.2, 'fe']], cap: 'Xe(f) : le spectre recopié tous les fe' })
)}
${retenir(R`<p><b>Échantillonner en temps = périodiser en fréquence</b> (période $f_e$). C'est la propriété « produit ↔ convolution » de la TF appliquée au peigne.</p>`)}
`},

{
  id: 'shannon', theme: 'echant', tps: ['p2'],
  titre: 'Théorème de Shannon–Nyquist',
  resume: 'Pour pouvoir tout reconstruire : fe > 2B, avec B la plus haute fréquence du signal.',
  corps: R`
${idee(R`<p>Si le signal ne contient aucune fréquence au-delà de $B$ ($X(f) = 0$ pour $|f| \gt B$), on peut le <b>reconstruire exactement</b> à partir de ses échantillons à condition que</p>
$$f_e \gt 2B$$
<p>$f_e/2$ s'appelle la <b>fréquence de Nyquist</b> : c'est la plus haute fréquence représentable.</p>`)}
${plots(
  plot({ x: [-3, 3], y: [-0.1, 1.3], xl: 'f', fns: [{ f: f => [-1, 0, 1].reduce((s, k) => s + tri((f - 2.4 * k) / 0.9), 0) }], xt: [[-0.9, '-B'], [0.9, 'B'], [2.4, 'fe']], cap: 'fe > 2B : copies séparées ✓' }),
  plot({ x: [-3, 3], y: [-0.1, 1.3], xl: 'f', bands: [{ a: 0.35, b: 0.95, cls: 'ko' }, { a: -0.95, b: -0.35, cls: 'ko' }], fns: [{ f: f => [-2, -1, 0, 1, 2].reduce((s, k) => s + tri((f - 1.3 * k) / 0.95), 0) }, { f: f => tri(f / 0.95), cls: 'muted', dash: true }], xt: [[1.3, 'fe']], cap: 'fe < 2B : les copies se chevauchent ✗' })
)}
${table(['Exemple', 'B', 'fe minimale'], [
  ['Voix téléphone', '≈ 3,4 kHz', '> 6,8 kHz (on prend 8 kHz)'],
  ['Musique (oreille)', '≈ 20 kHz', '> 40 kHz (CD : 44,1 kHz)'],
  ['$\\cos(2\\pi\\,4000\\,t)$', '4 kHz', '> 8 kHz']
])}
${piege(R`<p>C'est une inégalité <b>stricte</b>. Et $B$ est la fréquence <b>maximale</b> du signal, pas sa fréquence « principale » : un signal à 1 kHz qui a une harmonique à 3,5 kHz a $B = 3{,}5$ kHz.</p>`)}
`},

{
  id: 'repliement', theme: 'echant', tps: ['p2'],
  titre: 'Le repliement spectral (aliasing)',
  resume: 'Si fe ≤ 2f₀, une sinusoïde à f₀ se fait passer pour une autre, plus basse. Calcul : |f₀ − k·fe|.',
  corps: R`
${idee(R`<p>Sous-échantillonnée, une sinusoïde rapide passe par <b>exactement les mêmes points</b> qu'une sinusoïde plus lente. Après coup, impossible de savoir laquelle était la vraie : on « entend » la mauvaise.</p>`)}
${plot({ x: [0, 1], y: [-1.4, 1.4], w: 420, xl: 't (ms)', fns: [{ f: t => cos(2 * PI * 4 * t), cls: 'muted' }, { f: t => cos(2 * PI * 1 * t), cls: 'c2' }], diracs: [0, 0.2, 0.4, 0.6, 0.8, 1].map(x => ({ x, a: cos(2 * PI * 4 * x) })), xt: [[0.2, '0,2'], [0.4, '0,4'], [0.6, '0,6'], [0.8, '0,8']], cap: '4 kHz (gris) et 1 kHz (orange) échantillonnés à 5 kHz : mêmes impulsions' })}
${methode(R`<p><b>Fréquence apparente</b> d'une sinusoïde à $f_0$ échantillonnée à $f_e$ :</p>
$$f_a = |f_0 - k f_e| \quad\text{avec } k \text{ l'entier le plus proche de } f_0/f_e$$
<p>Le résultat tombe toujours dans $[0, f_e/2]$. Si $f_0 \lt f_e/2$, alors $k=0$ et rien ne change.</p>`)}
${table(['$f_0$', '$f_e$', '$f_e/2$', 'Fréquence observée'], [
  ['4 kHz', '10 kHz', '5 kHz', '4 kHz (pas de repliement)'],
  ['4 kHz', '5 kHz', '2,5 kHz', '|4 − 5| = <b>1 kHz</b>'],
  ['3,5 kHz', '5 kHz', '2,5 kHz', '<b>1,5 kHz</b>'],
  ['4,5 kHz', '5 kHz', '2,5 kHz', '<b>0,5 kHz</b>'],
  ['3,5 kHz', '6 kHz', '3 kHz', '<b>2,5 kHz</b>'],
  ['4,2 kHz', '6 kHz', '3 kHz', '<b>1,8 kHz</b>'],
  ['1 kHz', '1,8 kHz', '0,9 kHz', '<b>800 Hz</b>']
])}
${retenir(R`<p>Une fois le repliement produit, l'information est <b>perdue</b> : aucun traitement ne peut séparer la vraie composante de la fausse. Il faut l'empêcher <b>avant</b> (filtre anti-repliement).</p>`)}
`},

{
  id: 'anti-repliement', theme: 'echant', tps: ['p2'],
  titre: 'Le filtre anti-repliement',
  resume: 'Un passe-bas analogique AVANT l’échantillonneur, qui coupe tout ce qui dépasse fe/2.',
  corps: R`
${idee(R`<p>On ne contrôle pas toujours le contenu du signal (bruit, harmoniques…). Pour garantir Shannon, on place un <b>filtre passe-bas analogique</b> juste avant l'échantillonneur : il limite la bande à $B \lt f_e/2$.</p>`)}
<p><b>Chaîne :</b> $x_a(t)$ → <b>filtre anti-repliement</b> → $x(t)$ à bande limitée → <b>échantillonneur</b> → $x_e(t)$</p>
${plots(
  plot({ x: [-3, 3], y: [-0.1, 1.3], xl: 'f', vlines: [-1.2, 1.2], fns: [{ f: f => 0.9 * Math.exp(-f * f / 3) }], xt: [[-1.2, '-fe/2'], [1.2, 'fe/2']], cap: 'Avant : du contenu au-delà de fe/2' }),
  plot({ x: [-3, 3], y: [-0.1, 1.3], xl: 'f', vlines: [-1.2, 1.2], fns: [{ f: f => (abs(f) < 1.2 ? 0.9 * Math.exp(-f * f / 3) : 0) }], xt: [[-1.2, '-fe/2'], [1.2, 'fe/2']], cap: 'Après filtrage : plus rien au-delà' })
)}
${piege(R`<p>Le filtre doit être <b>avant</b> l'échantillonnage. Après, les composantes trop hautes sont déjà repliées <b>dans</b> la bande utile, mélangées au vrai signal : un filtre ne peut plus les distinguer.</p>`)}
${enTD(R`<p>TP 3, ex. 3 (grillons) : décimer par 2 avec ${c`x(1:2:end)`} sans filtre fait apparaître des sons parasites. Avec ${c`lowpass`} <b>puis</b> décimation, le son est juste plus « sourd » (les aigus coupés), mais sans artefact. Et après ${c`resample`}, les aigus supprimés <b>ne reviennent pas</b>.</p>`)}
`},

{
  id: 'interpolation-shannon', theme: 'echant', tps: ['p2'],
  titre: 'Reconstruire : l’interpolateur idéal de Shannon',
  resume: 'Chaque échantillon devient un sinc ; leur somme redonne le signal exact. Un passe-bas idéal, irréalisable.',
  corps: R`
$$x(t) = x_e(t) * h(t), \quad h(t) = \mathrm{sinc}\!\left(\frac{t}{T_e}\right) \quad\Longrightarrow\quad x(t) = \sum_n x(nT_e)\,\mathrm{sinc}\!\left(\frac{t - nT_e}{T_e}\right)$$
${idee(R`<p>En fréquence, $h$ est un <b>passe-bas idéal</b> de gain $T_e$ et de coupure $f_e/2$ : il garde la copie centrale du spectre et efface toutes les autres. Si Shannon est respecté, la copie centrale <b>est</b> le spectre d'origine → reconstruction parfaite.</p>`)}
${plot({ x: [-3.5, 3.5], y: [-0.5, 1.3], w: 420, xl: 't/Te', fns: [
  { f: t => 0.8 * sinc(t + 1), cls: 'muted', dash: true }, { f: t => 1 * sinc(t), cls: 'muted', dash: true }, { f: t => 0.5 * sinc(t - 1), cls: 'muted', dash: true },
  { f: t => 0.8 * sinc(t + 1) + sinc(t) + 0.5 * sinc(t - 1) }
], diracs: [{ x: -1, a: 0.8 }, { x: 0, a: 1 }, { x: 1, a: 0.5 }], xt: [[-1, '-1'], [1, '1'], [2, '2']], cap: 'Trois sinc pondérés (pointillés) et leur somme' })}
${table(['Avantage', 'Inconvénient'], [
  ['reconstruction <b>exacte</b> si $f_e \\gt 2B$', '<b>non causal</b> (utilise les échantillons futurs) et de <b>durée infinie</b> → irréalisable']
])}
${enTD(R`<p>TD 2, ex. 1 : $x(t)=\cos(8000\pi t)$, $f_0 = 4$ kHz.<br>
• $f_e = 10$ kHz : copies en $\pm4, \pm6, \pm14\ldots$ kHz ; le passe-bas ($\pm5$ kHz) garde $\pm4$ kHz → on retrouve $\cos(8000\pi t)$.<br>
• $f_e = 5$ kHz : copies en $\pm1, \pm4, \pm6\ldots$ kHz ; le passe-bas ($\pm2{,}5$ kHz) garde $\pm1$ kHz → on obtient $\cos(2000\pi t)$ : <b>repliement</b>.</p>`)}
`},

{
  id: 'boz', theme: 'echant', tps: ['p2'],
  titre: 'Le bloqueur d’ordre zéro (BOZ)',
  resume: 'Tenir chaque valeur pendant Te : une courbe en escalier. Simple, réalisable, approximatif.',
  corps: R`
${idee(R`<p>L'interpolateur de Shannon est irréalisable. En pratique (convertisseur numérique-analogique), on utilise souvent le <b>BOZ</b> : il <b>maintient</b> la valeur de chaque échantillon jusqu'au suivant.</p>`)}
${plot({ x: [0, 8], y: [-1.4, 1.4], w: 420, xl: 't', fns: [{ f: t => sin(2 * PI * t / 8 * 1.5), cls: 'muted', dash: true }, { f: t => sin(2 * PI * Math.floor(t) / 8 * 1.5) }], stems: [{ n: [0, 1, 2, 3, 4, 5, 6, 7], v: [0, 1, 2, 3, 4, 5, 6, 7].map(n => sin(2 * PI * n / 8 * 1.5)) }], xt: [[1, 'Te'], [2, '2Te']], cap: 'Sortie du BOZ : des paliers de durée Te' })}
${table(['', 'Shannon', 'BOZ'], [
  ['Forme', 'courbe lisse (somme de sinc)', 'escalier'],
  ['Passe par les échantillons ?', 'oui', 'oui (au début de chaque palier)'],
  ['Réalisable ?', 'non (non causal, infini)', '<b>oui</b>, très simple'],
  ['Erreur', 'nulle si $f_e \\gt 2B$', 'non nulle, diminue quand $f_e$ augmente']
])}
${enTD(R`<p>TP 3, ex. 4 : en Matlab, ${c`interp1(t_e, x_e, t, 'previous')`} fait un BOZ ; la somme de ${c`x_e(k)*sinc((t-t_e(k))/Te)`} fait Shannon. L'erreur de Shannon est quasi nulle, celle du BOZ non.</p>`)}
`},

{
  id: 'chaine-audio', theme: 'echant', tps: ['p2'],
  titre: 'Toute la chaîne, et le son numérique',
  resume: 'Anti-repliement → échantillonnage → interpolation. Débit d’un WAV CD : 1411,2 kbit/s.',
  corps: R`
<p>$x_a(t)$ → <b>anti-repliement</b> → <b>échantillonneur</b> ($f_e$) → <b>traitement numérique</b> → <b>interpolation</b> (Shannon ou BOZ) → $\hat x(t)$</p>
${table(['Bloc', 'Rôle'], [
  ['Anti-repliement', 'limiter la bande à moins de $f_e/2$ avant d’échantillonner'],
  ['Échantillonnage', 'prélever une valeur toutes les $T_e$ secondes'],
  ['Interpolation', 'retrouver un signal continu à partir des impulsions pondérées']
])}
<h4>Qualité CD et débit</h4>
$$D_{\text{WAV}} = f_e \times \text{bits} \times \text{canaux} = 44\,100 \times 16 \times 2 = 1\,411\,200 \text{ bit/s} = 1411{,}2 \text{ kbit/s}$$
<ul><li>16 bits → $2^{16} = 65\,536$ niveaux d'amplitude par échantillon.</li>
<li>Taille d'un fichier = débit × durée ÷ 8 (en octets) : 1 min de CD ≈ 10,6 Mo.</li></ul>
${table(['', 'WAV (PCM)', 'MP3'], [
  ['Compression', 'aucune', '<b>avec perte</b> : retire ce qui est jugé peu audible'],
  ['$f_e$', '44,1 kHz', '<b>la même</b> (44,1 kHz)'],
  ['Débit', '1411,2 kbit/s', 'bien plus faible (ex. 128–320 kbit/s)'],
  ['Pertes audibles ?', 'non', 'parfois : attaques, percussions, aigus']
])}
${retenir(R`<p>Le MP3 est plus petit <b>non pas</b> parce qu'il échantillonne moins vite, mais parce que son codeur garde moins de données par seconde.</p>`)}
`},

{
  id: 'matlab', theme: 'matlab', tps: ['p2', 'p3'],
  titre: 'Matlab : les commandes du TP',
  resume: 'Vecteur temps, stem, fft et son axe des fréquences, décimation, lowpass, resample, interp1.',
  corps: R`
${MAT`
  Fe = 10000; duree = 2e-3;
  t = (0:1/Fe:duree)';          % instants n*Te (vecteur colonne)
  x = cos(2*pi*4000*t);
  stem(t*1000, x, 'filled')     % impulsions (signal échantillonné)
  plot(t_ref*1000, x_ref, 'k--')% courbe "continue" de référence (Fe_ref très grande)
`}
<h4>Spectre d'amplitude unilatéral avec la FFT</h4>
${MAT`
  N = length(x);
  X = abs(fft(x))/N;            % module, normalisé par N
  X = X(1:N/2+1);               % garder 0 ... Fe/2
  X(2:end-1) = 2*X(2:end-1);    % replier les fréquences négatives (sauf 0 et Fe/2)
  f = (0:N/2)'*Fe/N;            % axe : pas de Fe/N
  plot(f, X)                    % un cos d'amplitude A donne un pic de hauteur A
`}
<h4>Changer de fréquence d'échantillonnage</h4>
${MAT`
  M = 2;  Fe = Fe0/M;
  sans_filtre = x(1:M:end);             % 1 échantillon sur M : décimation brute
  xf = lowpass(x, fc, Fe0);             % anti-repliement (fc < Fe/2)
  avec_filtre = xf(1:M:end);
  y = resample(avec_filtre, M, 1);      % remonter à Fe0 (interpolation)
  x_boz = interp1(t_e, x_e, t, 'previous');  % bloqueur d'ordre zéro
  soundsc(x, Fe)                        % écouter (à la bonne Fe !)
`}
${piege(R`<p>Matlab indexe à partir de <b>1</b> : ${c`X(1)`} correspond à $f=0$, et ${c`X(k+1)`} à $f = k\,F_e/N$.</p>`)}
`},

/* ============================================================ PARTIE 3 */
{
  id: 'suite', theme: 'discret', tps: ['p3'],
  titre: 'Du signal échantillonné à la suite x(n)',
  resume: 'On garde les poids des Dirac, on oublie Te : x(n) = xa(nTe). Entre deux indices, rien n’est défini.',
  corps: R`
$$x_e(t) = \sum_{n\in\mathbb{Z}} x(n)\,\delta(t-nT_e) \qquad\longrightarrow\qquad x(n) = x_a(nT_e)$$
${idee(R`<p>Un <b>signal à temps discret</b> est une <b>suite</b> $x : \mathbb{Z} \to \mathbb{R}$ ou $\mathbb{C}$. Il vient d'un échantillonnage, ou bien il est discret par nature (données journalières, pixels…).</p>`)}
${plot({ x: [-3.6, 6.6], y: [-1.3, 1.4], w: 420, xl: 'n', yl: 'x(n)', stems: [{ n: [-3, -2, -1, 0, 1, 2, 3, 4, 5, 6], v: [-0.4, 0.3, 1, 0.6, 0.2, -0.5, -1, -0.3, 0.5, 0.8] }], xt: [-2, 2, 4, 6] })}
<h4>Deux écritures</h4>
<ul><li><b>Graphe en bâtons</b> (ci-dessus).</li>
<li><b>Liste</b> avec une flèche sous la valeur d'indice $n=0$ : $x(n) = \{\ldots, -1, 0, \underset{\uparrow}{1}, 2/3, 1/3, 0, \ldots\}$.</li></ul>
${piege(R`<p>Relier les sommets aide l'œil, mais <b>ne rend pas</b> le signal continu : $x(1{,}5)$ n'existe pas.</p>`)}
`},

{
  id: 'suites-usuelles', theme: 'discret', tps: ['p3'],
  titre: 'Les suites élémentaires',
  resume: 'Kronecker δ(n), échelon u(n), rampe r(n), exponentielle aⁿu(n).',
  corps: R`
${table(['Suite', 'Définition'], [
  ['Impulsion de Kronecker $\\delta(n)$', '$1$ si $n=0$, $0$ sinon (une <b>vraie</b> valeur 1, pas une distribution)'],
  ['Échelon $u(n)$', '$1$ si $n \\ge 0$, $0$ sinon'],
  ['Rampe $r(n)$', '$n\\,u(n)$'],
  ['Exponentielle causale', '$a^n u(n)$']
])}
${plots(
  plot({ x: [-3.5, 4.5], y: [-0.3, 1.4], xl: 'n', yl: 'δ(n)', stems: [{ n: [-3, -2, -1, 0, 1, 2, 3, 4], v: [0, 0, 0, 1, 0, 0, 0, 0] }] }),
  plot({ x: [-3.5, 4.5], y: [-0.3, 1.4], xl: 'n', yl: 'u(n)', stems: [{ n: [-3, -2, -1, 0, 1, 2, 3, 4], v: [0, 0, 0, 1, 1, 1, 1, 1] }] })
)}
${plots(
  plot({ x: [-0.5, 7.5], y: [-0.2, 1.3], xl: 'n', yl: '0,7ⁿ u(n)', stems: [{ n: [0, 1, 2, 3, 4, 5, 6, 7], v: [0, 1, 2, 3, 4, 5, 6, 7].map(n => Math.pow(0.7, n)) }], cap: '0 < a < 1 : décroît' }),
  plot({ x: [-0.5, 7.5], y: [-1.2, 1.3], xl: 'n', yl: '(−0,7)ⁿ u(n)', stems: [{ n: [0, 1, 2, 3, 4, 5, 6, 7], v: [0, 1, 2, 3, 4, 5, 6, 7].map(n => Math.pow(-0.7, n)) }], cap: 'a < 0 : le signe alterne' })
)}
${retenir(R`<p>Pour $a^n u(n)$ : <b>le signe de $a$</b> dit si ça alterne, <b>$|a|$</b> dit si ça décroît ($|a| \lt 1$) ou explose ($|a| \gt 1$). On reverra ça pour la stabilité des filtres.</p>`)}
`},

{
  id: 'energie-puissance', theme: 'discret', tps: ['p3'],
  titre: 'Énergie et puissance d’une suite',
  resume: 'Énergie = somme des |x(n)|². Finie pour un signal qui s’éteint, infinie pour un signal périodique (qui a une puissance).',
  corps: R`
$$E_x = \sum_{n=-\infty}^{+\infty} |x(n)|^2 \qquad\qquad P_x = \lim_{N\to\infty}\frac{1}{2N+1}\sum_{n=-N}^{N}|x(n)|^2$$
${table(['Type', 'Énergie', 'Puissance', 'Exemple'], [
  ['Signal d’<b>énergie</b>', 'finie', 'nulle', '$a^n u(n)$, $|a| \\lt 1$'],
  ['Signal de <b>puissance</b>', 'infinie', 'finie', 'sinusoïde, signal périodique']
])}
${methode(R`<p><b>Énergie de $a^n u(n)$</b> ($|a| \lt 1$) : série géométrique de raison $|a|^2$ :</p>
$$E_x = \sum_{n=0}^{\infty} |a|^{2n} = \frac{1}{1-|a|^2}$$
<p>Ex. $a = 0{,}5$ → $E = \frac{1}{1-0{,}25} = \frac43$.</p>
<p><b>Puissance d'un signal périodique</b> de période $N_0$ : moyenne sur une période, $P_x = \frac{1}{N_0}\sum_{n=0}^{N_0-1}|x(n)|^2$.</p>`)}
${retenir(R`<p>Rappel utile : $\sum_{k=0}^{\infty} q^k = \frac{1}{1-q}$ si $|q| \lt 1$.</p>`)}
`},

{
  id: 'sinus-discrete', theme: 'discret', tps: ['p3'],
  titre: 'Sinusoïde discrète : périodique ou pas ?',
  resume: 'x(n) = cos(2πν₀n) est périodique seulement si ν₀ = f₀/fe est une fraction p/q. Période = q.',
  corps: R`
$$x(n) = A\cos(2\pi\nu_0 n + \varphi), \qquad \nu_0 = \frac{f_0}{f_e} \text{ (fréquence normalisée, en cycles/échantillon)}$$
${idee(R`<p>Il faut un nombre <b>entier</b> d'échantillons $N_0$ pour faire un nombre entier $m$ de tours : $2\pi\nu_0 N_0 = 2\pi m$, donc $\nu_0 = m/N_0$ doit être <b>rationnel</b>.</p>`)}
${methode(R`<ol><li>Calculer $\nu_0$ (si on a $\cos(\Omega n)$, alors $\nu_0 = \Omega/2\pi$).</li><li>L'écrire en fraction <b>irréductible</b> $p/q$.</li><li>Période fondamentale : $N_0 = q$.</li></ol>`)}
${table(['Signal', '$\\nu_0$', 'Période $N_0$'], [
  ['$\\cos(2\\pi\\,\\tfrac{2}{6}\\,n)$', '$2/6 = 1/3$', '<b>3</b> (pas 6 !)'],
  ['$\\cos(\\tfrac{\\pi}{4}n)$', '$1/8$', '8'],
  ['$\\cos(2\\pi\\,\\tfrac38\\,n)$', '$3/8$', '8'],
  ['$\\cos(0{,}5\\,n)$', '$\\frac{0{,}5}{2\\pi}$ irrationnel', '<b>apériodique</b>']
])}
${plot({ x: [-0.5, 9.5], y: [-1.3, 1.4], w: 400, xl: 'n', fns: [{ f: t => cos(2 * PI * t / 3), cls: 'muted', dash: true }], stems: [{ n: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], v: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => cos(2 * PI * n / 3)) }], xt: [3, 6, 9], cap: 'ν₀ = 1/3 : le motif se répète tous les 3 échantillons' })}
${piege(R`<p>Contrairement au continu, une sinusoïde discrète n'est <b>pas toujours</b> périodique. Et deux $\nu_0$ qui diffèrent d'un entier donnent <b>la même suite</b> (c'est le repliement vu côté discret).</p>`)}
`},

{
  id: 'operations-suites', theme: 'discret', tps: ['p3'],
  titre: 'Décaler, retourner, compresser une suite',
  resume: 'x(n − 2) à droite, x(−n) en miroir, x(2n) ne garde que les indices pairs.',
  corps: R`
${table(['Opération', 'Effet'], [
  ['$x(n-n_0)$', '<b>retard</b> : décalage de $n_0$ vers la droite'],
  ['$x(n+n_0)$', '<b>avance</b> : décalage vers la gauche'],
  ['$x(-n)$', '<b>retournement</b> autour de $n=0$'],
  ['$x(-n+2) = x(-(n-2))$', 'retourner, <b>puis</b> décaler de 2 vers la droite'],
  ['$x(2n)$', '<b>compression</b> : ne garde que les valeurs d’indice pair (les impairs sont perdus)']
])}
${plots(
  plot({ x: [-4.5, 4.5], y: [-0.3, 4.5], xl: 'n', yl: 'x(n)', stems: [{ n: [-1, 0, 1, 2, 3], v: [1, 2, 4, 3, 1] }], xt: [-2, 2, 4] }),
  plot({ x: [-4.5, 4.5], y: [-0.3, 4.5], xl: 'n', yl: 'x(n−2)', stems: [{ n: [1, 2, 3, 4], v: [1, 2, 4, 3] }], xt: [-2, 2, 4] }),
  plot({ x: [-4.5, 4.5], y: [-0.3, 4.5], xl: 'n', yl: 'x(−n)', stems: [{ n: [1, 0, -1, -2, -3], v: [1, 2, 4, 3, 1] }], xt: [-2, 2, 4] }),
  plot({ x: [-4.5, 4.5], y: [-0.3, 4.5], xl: 'n', yl: 'x(2n)', stems: [{ n: [0, 1], v: [2, 3] }, { n: [-1], v: [0] }], xt: [-2, 2, 4] })
)}
<p>Toute suite est une <b>somme d'impulsions décalées</b> : $x(n) = \sum_k x(k)\,\delta(n-k)$. Ex. $\{0, 2, \underset{\uparrow}{-1}, 3, 0\} = 2\delta(n+1) - \delta(n) + 3\delta(n-1)$.</p>
${enTD(R`<p>TD 3, ex. 3 avec $x(n) = |n|$ pour $-3\le n\le3$ ($\{3,2,1,\underset{\uparrow}{0},1,2,3\}$) :<br>
• moyenne glissante $\frac13[x(n+1)+x(n)+x(n-1)]$ : en $n=0$ : $\frac{1+0+1}{3} = \frac23$ ; en $n=\pm1$ : $1$ ; en $n=\pm2$ : $2$ ; en $n=\pm3$ : $\frac53$ ; en $n=\pm4$ : $1$.<br>
• somme cumulée $\sum_{k\le n} x(k)$ : $3, 5, 6, 6, 7, 9, 12$ puis $12$ pour toujours.<br>
• $x(n) = 3\delta(n+3) + 2\delta(n+2) + \delta(n+1) + \delta(n-1) + 2\delta(n-2) + 3\delta(n-3)$.</p>`)}
`},

{
  id: 'convolution-discrete', theme: 'discret', tps: ['p3'],
  titre: 'Convolution discrète',
  resume: 'y(n) = Σ x(k) h(n − k). Une somme au lieu d’une intégrale. Longueur du résultat : N + M − 1.',
  corps: R`
$$y(n) = (x*h)(n) = \sum_{k=-\infty}^{+\infty} x(k)\,h(n-k)$$
${methode(R`<p><b>Méthode du tableau</b> (suites finies) : chaque valeur de $x$ « envoie » une copie de $h$ décalée et multipliée ; on additionne colonne par colonne.</p>
<p>Ex. $x = \{\underset{\uparrow}{1}, 2, 3\}$, $h = \{\underset{\uparrow}{1}, 1\}$ :</p>`)}
${table(['', '$n=0$', '$n=1$', '$n=2$', '$n=3$'], [
  ['$1\\cdot h(n)$', '1', '1', '', ''],
  ['$2\\cdot h(n-1)$', '', '2', '2', ''],
  ['$3\\cdot h(n-2)$', '', '', '3', '3'],
  ['<b>$y(n)$</b>', '<b>1</b>', '<b>3</b>', '<b>5</b>', '<b>3</b>']
])}
${retenir(R`<ul><li>Longueur : $N + M - 1$ (ici $3 + 2 - 1 = 4$).</li><li>$x(n) * \delta(n-n_0) = x(n-n_0)$ : convoluer par un Kronecker décale.</li><li>La sortie d'un filtre est $y = x * h$, avec $h$ sa réponse impulsionnelle.</li></ul>`)}
`},

{
  id: 'tftd', theme: 'tfd', tps: ['p3'],
  titre: 'TFtd : la transformée de Fourier à temps discret',
  resume: 'Le spectre d’une suite. Continu en fréquence, et périodique de période fe.',
  corps: R`
$$X(f) = \sum_{n=-\infty}^{+\infty} x(n)\,e^{-j2\pi n f/f_e} \qquad\qquad x(n) = \frac{1}{f_e}\int_{-f_e/2}^{f_e/2} X(f)\,e^{j2\pi n f/f_e}\,df$$
${idee(R`<p>Même idée que la TF, mais avec une <b>somme</b> sur les échantillons. Comme $e^{-j2\pi n (f+f_e)/f_e} = e^{-j2\pi n f/f_e}$, le spectre est <b>périodique de période $f_e$</b> : on le trace sur $[-f_e/2, f_e/2]$.</p>`)}
${table(['Variable', 'Unité', 'Période du spectre'], [
  ['$f$', 'Hz', '$f_e$'],
  ['$\\nu = f/f_e$', 'cycles / échantillon', '1'],
  ['$\\omega = 2\\pi\\nu$', 'rad / échantillon', '$2\\pi$']
])}
${plots(
  plot({ x: [-0.5, 8.5], y: [-0.2, 1.3], xl: 'n', yl: '0,6ⁿ u(n)', stems: [{ n: [0, 1, 2, 3, 4, 5, 6, 7, 8], v: [0, 1, 2, 3, 4, 5, 6, 7, 8].map(n => Math.pow(0.6, n)) }] }),
  plot({ x: [-1.6, 1.6], y: [-0.2, 2.9], xl: 'f/fe', yl: '|X(f)|', fns: [{ f: v => 1 / Math.sqrt(1 - 1.2 * cos(2 * PI * v) + 0.36) }], xt: [[-1, '-1'], [-0.5, '-1/2'], [0.5, '1/2'], [1, '1']], yt: [[2.5, '2,5']], cap: 'Périodique de période fe' })
)}
<h4>Paires utiles</h4>
${table(['$x(n)$', '$X(f)$'], [
  ['$\\delta(n)$', '$1$'],
  ['$\\delta(n-n_0)$', '$e^{-j2\\pi n_0 f/f_e}$'],
  ['$a^n u(n)$, $|a|\\lt1$', '$\\dfrac{1}{1-a\\,e^{-j2\\pi f/f_e}}$'],
  ['$a^{|n|}$, $|a|\\lt1$', '$\\dfrac{1-a^2}{1-2a\\cos(2\\pi f/f_e)+a^2}$'],
  ['$x(n-n_0)$', '$X(f)\\,e^{-j2\\pi n_0 f/f_e}$'],
  ['$(x*h)(n)$', '$X(f)\\,H(f)$']
])}
${enTD(R`<p>TD 3, ex. 4 : $\delta(n-1)+\delta(n+1) \to e^{-j2\pi f/f_e} + e^{j2\pi f/f_e} = 2\cos(2\pi f/f_e)$.<br>
$\delta(n-2)-\delta(n+2) \to e^{-j4\pi f/f_e} - e^{j4\pi f/f_e} = -2j\sin(4\pi f/f_e)$, donc $|Y_2| = 2|\sin(4\pi f/f_e)|$.</p>`)}
${retenir(R`<p><b>Discret en temps ⟹ périodique en fréquence.</b> (Et périodique en temps ⟹ discret en fréquence : les séries de Fourier.)</p>`)}
`},

{
  id: 'tfd', theme: 'tfd', tps: ['p3'],
  titre: 'TFD : N échantillons → N valeurs de spectre',
  resume: 'On calcule la TFtd sur une grille de N fréquences espacées de Δf = fe/N. Tout devient discret et périodique.',
  corps: R`
${idee(R`<p>Un ordinateur ne stocke qu'un nombre fini de valeurs. On prend un bloc de $N$ échantillons, et on évalue sa TFtd en $N$ fréquences régulièrement espacées sur une période :</p>`)}
$$f_k = k\,\frac{f_e}{N}, \qquad \Delta f = \frac{f_e}{N} = \frac{1}{NT_e}, \qquad k = 0, \ldots, N-1$$
$$X[k] = \sum_{n=0}^{N-1} x[n]\,e^{-j2\pi nk/N} \qquad\qquad x[n] = \frac1N\sum_{k=0}^{N-1} X[k]\,e^{j2\pi nk/N}$$
${table(['Choix', 'Ce que ça fixe'], [
  ['$f_e$', 'la bande observable $[-f_e/2, f_e/2]$ (Nyquist)'],
  ['$N$', 'la durée observée $NT_e$ et la <b>résolution</b> $\\Delta f = f_e/N$']
])}
${methode(R`<p><b>Résolution voulue → durée d'observation</b> : $\Delta f = \frac{1}{NT_e}$. Pour distinguer deux fréquences à 1 Hz d'écart, il faut observer <b>au moins 1 s</b> de signal, quelle que soit $f_e$.</p>
<p>Ex. $f_e = 1$ kHz, $N = 500$ → $\Delta f = 2$ Hz, durée 0,5 s.</p>`)}
${retenir(R`<ul><li>Dans la TFD, <b>temps et fréquence sont tous les deux discrets et périodiques</b> : $x[n+N] = x[n]$, $X[k+N] = X[k]$.</li>
<li>$k = N$ ne donne pas de valeur nouvelle : $X[N] = X[0]$.</li>
<li>Les indices $k \gt N/2$ correspondent aux fréquences négatives.</li></ul>`)}
`},

{
  id: 'fft', theme: 'tfd', tps: ['p3'],
  titre: 'FFT : la même TFD, en beaucoup plus rapide',
  resume: 'Mêmes coefficients X[k], mais (N/2)·log₂N multiplications au lieu de N².',
  corps: R`
${idee(R`<p>La <b>FFT</b> (Fast Fourier Transform) n'est <b>pas</b> une nouvelle transformée : c'est un <b>algorithme</b> qui calcule exactement la TFD, en coupant le problème en deux (indices pairs / impairs) récursivement. Il faut $N = 2^m$ pour la version radix 2.</p>`)}
${table(['$N = 1024 = 2^{10}$', 'Multiplications complexes'], [
  ['TFD directe : $N^2$', '1 048 576'],
  ['FFT radix 2 : $\\frac N2 \\log_2 N$', '5 120'],
  ['Gain', '≈ <b>205 fois</b> moins']
])}
<p>Étapes : séparer pairs/impairs → deux TFD de taille $N/2$ → recombiner ; puis recommencer sur chaque moitié.</p>
${retenir(R`<p>Dans Matlab, ${c`fft(x)`} renvoie la TFD (non normalisée). Pour lire une amplitude, diviser par $N$ (voir fiche Matlab).</p>`)}
`},

{
  id: 'quatre-tf', theme: 'tfd', tps: ['p1', 'p3'],
  titre: 'Les 4 transformées de Fourier côte à côte',
  resume: 'Périodique dans un domaine ⟺ discret dans l’autre. Le tableau qui résume tout le cours.',
  corps: R`
${table(['Outil', 'Temps', 'Fréquence', 'Analyse'], [
  ['Série de Fourier', 'continu, <b>périodique</b>', '<b>raies</b> en $nf_0$', '$A_n, \\varphi_n$'],
  ['TF', 'continu, apériodique', 'continue', '$\\int x(t)e^{-j2\\pi ft}dt$'],
  ['TFtd', '<b>discret</b>, apériodique', 'continue, <b>périodique</b> ($f_e$)', '$\\sum_n x(n)e^{-j2\\pi nf/f_e}$'],
  ['TFD', '<b>discret</b>, N points', '<b>discrète</b>, N points', '$\\sum_{n=0}^{N-1} x(n)e^{-j2\\pi nk/N}$']
])}
${retenir(R`<p><b>Périodicité dans un domaine ⟺ discrétisation dans l'autre.</b></p>
<ul><li>périodique en temps → raies en fréquence (séries de Fourier) ;</li><li>discret en temps → périodique en fréquence (TFtd) ;</li><li>les deux → TFD.</li></ul>`)}
<h4>Du signal analogique à la TFD</h4>
<p>$x_a(t)$ → filtrer puis échantillonner à $f_e$ → $x(n)$ → observer $N$ points → <b>FFT</b> → $X[k]$</p>
`},

{
  id: 'equation-differences', theme: 'filtres', tps: ['p3'],
  titre: 'Filtre numérique : équation aux différences et réponse impulsionnelle',
  resume: 'y(n) se calcule avec les entrées actuelles/passées (et les sorties passées). h(n) = la sortie quand on envoie δ(n).',
  corps: R`
$$y(n) = \sum_{k=0}^{M} b_k\, x(n-k) \;-\; \sum_{k=1}^{N} a_k\, y(n-k)$$
${idee(R`<p>Un filtre numérique est une <b>recette de calcul</b> : la sortie à l'instant $n$ est une combinaison des entrées (actuelle et passées) et, éventuellement, des <b>sorties passées</b> (rétroaction, ou récursivité).</p>`)}
<h4>Réponse impulsionnelle $h(n)$</h4>
<p>C'est la sortie quand l'entrée est $\delta(n)$. Elle <b>caractérise tout le filtre</b> : pour n'importe quelle entrée, $y = x * h$.</p>
<h4>Réponse indicielle $s(n)$</h4>
<p>C'est la sortie quand l'entrée est l'échelon $u(n)$ : $s(n) = \sum_{k=-\infty}^{n} h(k)$ (somme cumulée de $h$).</p>
${methode(R`<p><b>Calculer $h(n)$ à la main</b> : poser $x(n)=\delta(n)$, partir de $y(n)=0$ pour $n\lt0$ (filtre causal), et dérouler l'équation pour $n = 0, 1, 2, \ldots$</p>
<p>Ex. $y(n) = \frac12x(n)+\frac12x(n-1)$ : $h(0)=\frac12$, $h(1)=\frac12$, puis $0$. → $h = \{\underset{\uparrow}{\tfrac12}, \tfrac12\}$.</p>`)}
`},

{
  id: 'transformee-z', theme: 'filtres', tps: ['p3'],
  titre: 'Transformée en Z et fonction de transfert H(z)',
  resume: 'Un retard d’un échantillon devient z⁻¹. H(z) = Y(z)/X(z) se lit directement sur l’équation aux différences.',
  corps: R`
$$X(z) = \sum_{n=-\infty}^{+\infty} x(n)\,z^{-n}$$
${table(['Temps', 'Z'], [
  ['$x(n-k)$', '$z^{-k}X(z)$ : <b>un retard = $z^{-1}$</b>'],
  ['$(x*h)(n)$', '$X(z)H(z)$'],
  ['$\\delta(n)$', '$1$'],
  ['$a^n u(n)$', '$\\dfrac{1}{1-az^{-1}} = \\dfrac{z}{z-a}$']
])}
${methode(R`<p><b>De l'équation à $H(z)$</b> : passer chaque terme en Z ($x(n-k) \to z^{-k}X$, $y(n-k) \to z^{-k}Y$), regrouper, diviser :</p>
$$H(z) = \frac{Y(z)}{X(z)} = \frac{\sum_k b_k z^{-k}}{1 + \sum_k a_k z^{-k}}$$
<p>Ex. $y(n) = a\,y(n-1) + x(n)$ → $Y = az^{-1}Y + X$ → $H(z) = \dfrac{1}{1-az^{-1}} = \dfrac{z}{z-a}$.</p>`)}
<h4>Réponse fréquentielle</h4>
<p>On remplace $z$ par $e^{j2\pi f/f_e}$ (le cercle unité) : $H(f) = H(z)\big|_{z = e^{j2\pi f/f_e}}$. C'est la TFtd de $h(n)$. On trace $|H(f)|$ (gain) et $\arg H(f)$ (phase) sur $[-f_e/2, f_e/2]$.</p>
${retenir(R`<p><b>Pôles</b> = racines du dénominateur, <b>zéros</b> = racines du numérateur (écrire $H$ en puissances positives de $z$ pour les lire).</p>`)}
`},

{
  id: 'table-tz', theme: 'filtres', tps: ['p3'],
  titre: 'Table des transformées en Z (unilatérales)',
  resume: 'Les paires δ, u, n·u, aⁿu, cos, sin avec leur région de convergence, et les propriétés (retards, valeurs initiale et finale).',
  corps: R`
<p>Transformée en Z <b>unilatérale</b> : $X(z) = \sum_{n=0}^{+\infty}x(n)\,z^{-n}$.</p>
${table(['Signal $x(n)$', '$X(z)$', 'ROC'], [
  ['$\\delta(n)$', '$1$', 'tout $z$'],
  ['$\\delta(n-i)$', '$z^{-i}$', '$z \\ne 0$'],
  ['$u(n)$', '$\\dfrac{z}{z-1} = \\dfrac{1}{1-z^{-1}}$', '$|z|\\gt1$'],
  ['$n\\,u(n)$', '$\\dfrac{z}{(z-1)^2}$', '$|z|\\gt1$'],
  ['$n^2u(n)$', '$\\dfrac{z(z+1)}{(z-1)^3}$', '$|z|\\gt1$'],
  ['$a^nu(n)$', '$\\dfrac{z}{z-a} = \\dfrac{1}{1-az^{-1}}$', '$|z|\\gt|a|$'],
  ['$n\\,a^nu(n)$', '$\\dfrac{az}{(z-a)^2}$', '$|z|\\gt|a|$'],
  ['$n^2a^nu(n)$', '$\\dfrac{az(z+a)}{(z-a)^3}$', '$|z|\\gt|a|$'],
  ['$\\cos(\\omega_0n)\\,u(n)$', '$\\dfrac{z(z-\\cos\\omega_0)}{z^2-2\\cos(\\omega_0)z+1}$', '$|z|\\gt1$'],
  ['$\\sin(\\omega_0n)\\,u(n)$', '$\\dfrac{\\sin(\\omega_0)\\,z}{z^2-2\\cos(\\omega_0)z+1}$', '$|z|\\gt1$']
])}
${idee(R`<p><b>ROC</b> (région de convergence) : les $z$ pour lesquels la somme converge, c'est-à-dire $\sum|x(n)z^{-n}| \lt \infty$.<br>
• signal de <b>durée finie</b> → ROC = tout le plan (sauf peut-être $z = 0$ ou $\infty$) ;<br>
• la ROC ne contient <b>aucun pôle</b> ;<br>
• causal stable ⟺ la ROC contient le cercle unité ⟺ pôles dans le cercle.</p>`)}
<h4>Propriétés</h4>
${table(['Propriété', 'Signal', 'Transformée en Z'], [
  ['Linéarité', '$ax(n)+by(n)$', '$aX(z)+bY(z)$'],
  ['Retard de 1', '$x(n-1)$', '$z^{-1}X(z) + x(-1)$'],
  ['Retard de 2', '$x(n-2)$', '$z^{-2}X(z) + x(-2) + z^{-1}x(-1)$'],
  ['Retard de $i$', '$x(n-i)$', '$z^{-i}X(z) + x(-i) + z^{-1}x(-i+1) + \\dots + z^{-i+1}x(-1)$'],
  ['Convolution', '$y(n) = \\sum_k h(k)e(n-k)$', '$Y(z) = H(z)E(z)$'],
  ['Dérivation', '$n\\,x(n)$', '$-z\\,\\dfrac{dX(z)}{dz}$'],
  ['Accumulation', '$\\sum_{k=0}^{n}x(k)$', '$\\dfrac{X(z)}{1-z^{-1}}$'],
  ['Valeur initiale', '$x(0)$ (si $x(n) = 0$ pour $n\\lt0$)', '$\\lim_{z\\to+\\infty}X(z)$'],
  ['Valeur finale', '$\\lim_{n\\to+\\infty}x(n)$', '$\\lim_{z\\to1}(z-1)X(z)$ (si elle existe)']
])}
${retenir(R`<p>Avec un filtre <b>au repos</b> ($x(-1) = x(-2) = \dots = 0$, cas des TD), un retard est simplement une multiplication par $z^{-1}$.<br>
<b>Valeur finale</b> : réponse indicielle de $H$ → $\lim s(n) = \lim_{z\to1}(z-1)\,H(z)\frac{z}{z-1} = H(1)$ (le gain en continu).</p>`)}
<h4>Séries géométriques</h4>
$$\sum_{n=0}^{N}q^n = \frac{1-q^{N+1}}{1-q}\ (q\ne1),\qquad \sum_{n=0}^{N}1 = N+1,\qquad \sum_{n=0}^{+\infty}q^n = \frac{1}{1-q}\ (|q|\lt1)$$
${methode(R`<p><b>Inverser $H(z)$</b> : écrire en éléments simples $\frac{A z}{z-p_1} + \frac{B z}{z-p_2}$ (diviser $H(z)/z$ puis multiplier par $z$), puis lire la table : $h(n) = (A\,p_1^n + B\,p_2^n)\,u(n)$.</p>`)}
<p><a class="btn" href="pdf/tables/table-TZ.pdf" download>⬇ Table officielle des transformées en Z (PDF)</a></p>
`},

{
  id: 'stabilite', theme: 'filtres', tps: ['p3'],
  titre: 'Pôles, zéros et stabilité',
  resume: 'Un filtre causal est stable si tous ses pôles sont strictement à l’intérieur du cercle unité.',
  corps: R`
${idee(R`<p><b>Stable</b> (EBSB) = une entrée bornée donne toujours une sortie bornée. Équivalent : $\sum_n |h(n)| \lt \infty$.</p>`)}
$$\text{filtre causal stable} \iff \text{tous les pôles vérifient } |p_i| \lt 1$$
${plots(
  plot({ x: [-1.6, 1.6], y: [-1.4, 1.4], w: 250, h: 230, xl: 'Re', yl: 'Im', equal: true, fns: [{ fx: t => cos(t), fy: t => sin(t), t: [0, 2 * PI], cls: 'muted' }], pts: [{ x: 0.6, y: 0, k: 'pole', l: '0,6' }, { x: 0, y: 0, k: 'zero' }], cap: 'Pôle en 0,6 : stable ✓' }),
  plot({ x: [-1.6, 1.6], y: [-1.4, 1.4], w: 250, h: 230, xl: 'Re', yl: 'Im', equal: true, fns: [{ fx: t => cos(t), fy: t => sin(t), t: [0, 2 * PI], cls: 'muted' }], pts: [{ x: 1.2, y: 0, k: 'pole', l: '1,2', dx: -8 }, { x: 0, y: 0, k: 'zero' }], cap: 'Pôle en 1,2 : instable ✗' })
)}
<p>Notation : <b>×</b> = pôle, <b>○</b> = zéro. Le cercle gris est le cercle unité $|z| = 1$.</p>
${enTD(R`<p>TD 4, ex. 1 : deux pôles en $0$, zéros en $\pm1$ → $H(z) = \dfrac{(z-1)(z+1)}{z^2} = 1 - z^{-2}$ → $y(n) = x(n) - x(n-2)$. Pas de $y$ passé à droite : <b>RIF</b>. Pôles en 0 → <b>stable</b>. $|H(f)| = 2|\sin(2\pi f/f_e)|$ : nul en $0$ et $f_e/2$, maximal en $f_e/4$ → <b>passe-bande</b>.</p>`)}
${retenir(R`<p>Un zéro <b>sur</b> le cercle unité en $e^{j2\pi f_0/f_e}$ annule complètement la fréquence $f_0$. Un pôle <b>proche</b> du cercle crée un pic de gain près de la fréquence correspondante.</p>`)}
`},

{
  id: 'rif-rii', theme: 'filtres', tps: ['p3'],
  titre: 'RIF ou RII ?',
  resume: 'RIF : pas de rétroaction, h finie, toujours stable. RII : rétroaction, h infinie, stabilité à vérifier.',
  corps: R`
${table(['', 'RIF (FIR)', 'RII (IIR)'], [
  ['Nom', 'Réponse Impulsionnelle <b>Finie</b>', 'Réponse Impulsionnelle <b>Infinie</b>'],
  ['Équation', '$y(n)$ ne dépend que des $x$', '$y(n)$ dépend aussi des $y$ passés (<b>récursif</b>)'],
  ['$H(z)$', 'polynôme en $z^{-1}$ (pôles en 0)', 'fraction avec vrais pôles'],
  ['Stabilité', '<b>toujours stable</b>', 'à vérifier : pôles dans le cercle unité'],
  ['Phase', 'peut être <b>linéaire</b> (pas de distorsion)', 'non linéaire en général'],
  ['Coût', 'beaucoup de coefficients pour un filtre raide', 'peu de coefficients']
])}
${methode(R`<p><b>Reconnaître le type</b> : regarder l'équation aux différences. S'il y a un terme $y(n-k)$ à droite du signe égal → <b>RII</b>. Sinon → <b>RIF</b>, et $h(n)$ = la liste des coefficients $b_k$.</p>`)}
${J`
  y(n) = 0.5 x(n) + 0.5 x(n-1)     -> RIF, h = {0.5, 0.5}
  y(n) = 0.9 y(n-1) + x(n)         -> RII, h(n) = 0.9^n u(n)
`}
`},

{
  id: 'filtre-moyenneur', theme: 'filtres', tps: ['p3'],
  titre: 'Exemple RIF : le moyenneur y = ½x(n) + ½x(n−1)',
  resume: 'Moyenne de deux échantillons : un passe-bas de coupure fe/4, à phase linéaire.',
  corps: R`
${table(['Étape', 'Résultat'], [
  ['$H(z)$', '$\\frac12(1+z^{-1}) = \\dfrac{z+1}{2z}$ : zéro en $-1$, pôle en $0$'],
  ['$h(n)$', '$\\{\\underset{\\uparrow}{\\tfrac12}, \\tfrac12\\}$'],
  ['Réponse indicielle', '$s(0)=\\frac12$, puis $s(n)=1$ pour $n\\ge1$'],
  ['$H(f)$', '$\\frac12(1+e^{-j2\\pi f/f_e}) = e^{-j\\pi f/f_e}\\cos(\\pi f/f_e)$'],
  ['Gain', '$|H(f)| = \\cos(\\pi f/f_e)$ sur $[-f_e/2, f_e/2]$ : 1 en 0, 0 en $f_e/2$'],
  ['Phase', '$-\\pi f/f_e$ : <b>linéaire</b> (un simple retard d’une demi-période)'],
  ['Type', '<b>passe-bas</b>, coupure à −3 dB : $\\cos(\\pi f_c/f_e) = \\frac{1}{\\sqrt2}$ → $f_c = f_e/4$']
])}
${plots(
  plot({ x: [-0.6, 0.6], y: [-0.1, 1.25], xl: 'f/fe', yl: '|H(f)|', fns: [{ f: v => abs(cos(PI * v)) }], hlines: [Math.SQRT1_2], vlines: [-0.25, 0.25], xt: [[-0.5, '-1/2'], [-0.25, '-1/4'], [0.25, '1/4'], [0.5, '1/2']], yt: [[1, '1'], [Math.SQRT1_2, '0,71']], cap: 'Passe-bas' }),
  plot({ x: [-0.5, 4.5], y: [-0.2, 1.3], xl: 'n', yl: 's(n)', stems: [{ n: [0, 1, 2, 3, 4], v: [0.5, 1, 1, 1, 1] }], cap: 'Réponse indicielle' })
)}
${methode(R`<p><b>Astuce de l'angle moitié</b> : $1 + e^{-j\theta} = e^{-j\theta/2}(e^{j\theta/2}+e^{-j\theta/2}) = 2e^{-j\theta/2}\cos(\theta/2)$. Même idée avec un $-$ : $1 - e^{-j\theta} = 2j\,e^{-j\theta/2}\sin(\theta/2)$.</p>`)}
`},

{
  id: 'filtre-difference', theme: 'filtres', tps: ['p3'],
  titre: 'Exemple RIF : la différence y = ½x(n) − ½x(n−1)',
  resume: 'Mesure la variation entre deux échantillons : un passe-haut de coupure fe/4.',
  corps: R`
${table(['Étape', 'Résultat'], [
  ['$H(z)$', '$\\frac12(1-z^{-1}) = \\dfrac{z-1}{2z}$ : zéro en $+1$ (donc en $f=0$)'],
  ['$h(n)$', '$\\{\\underset{\\uparrow}{\\tfrac12}, -\\tfrac12\\}$'],
  ['Réponse indicielle', '$s(0)=\\frac12$, puis $s(n)=0$ : la sortie s’annule quand l’entrée ne bouge plus'],
  ['$H(f)$', '$j\\,e^{-j\\pi f/f_e}\\sin(\\pi f/f_e)$'],
  ['Gain', '$|H(f)| = |\\sin(\\pi f/f_e)|$ : 0 en 0, 1 en $\\pm f_e/2$'],
  ['Phase', '$\\frac\\pi2 - \\pi f/f_e$ pour $f\\gt0$, $-\\frac\\pi2 - \\pi f/f_e$ pour $f\\lt0$'],
  ['Type', '<b>passe-haut</b>, $f_c = f_e/4$']
])}
${plots(
  plot({ x: [-0.6, 0.6], y: [-0.1, 1.25], xl: 'f/fe', yl: '|H(f)|', fns: [{ f: v => abs(sin(PI * v)) }], hlines: [Math.SQRT1_2], vlines: [-0.25, 0.25], xt: [[-0.5, '-1/2'], [-0.25, '-1/4'], [0.25, '1/4'], [0.5, '1/2']], yt: [[1, '1']], cap: 'Passe-haut' }),
  plot({ x: [-0.5, 4.5], y: [-0.2, 1.3], xl: 'n', yl: 's(n)', stems: [{ n: [0, 1, 2, 3, 4], v: [0.5, 0, 0, 0, 0] }], cap: 'Réponse indicielle' })
)}
${retenir(R`<p>Zéro en $z = 1$ → tue le continu ($f=0$) → passe-haut. Zéro en $z=-1$ → tue $f_e/2$ → passe-bas.</p>`)}
`},

{
  id: 'filtre-rii', theme: 'filtres', tps: ['p3'],
  titre: 'Exemple RII : y(n) = a·y(n−1) + x(n)',
  resume: 'Un seul pôle en a. Stable si |a| < 1. h(n) = aⁿu(n). Passe-bas si a > 0, passe-haut si a < 0.',
  corps: R`
${table(['Étape', 'Résultat'], [
  ['$H(z)$', '$\\dfrac{1}{1-az^{-1}} = \\dfrac{z}{z-a}$ : pôle en $a$, zéro en 0'],
  ['Stabilité', '$|a| \\lt 1$'],
  ['$h(n)$', '$a^n u(n)$ : infinie → <b>RII</b>'],
  ['Réponse indicielle', '$s(n) = \\sum_{k=0}^{n} a^k = \\dfrac{1-a^{n+1}}{1-a}$ → tend vers $\\dfrac{1}{1-a}$'],
  ['$H(f)$', '$\\dfrac{1}{1-a\\,e^{-j2\\pi f/f_e}}$'],
  ['Gain', '$|H(f)| = \\dfrac{1}{\\sqrt{1-2a\\cos(2\\pi f/f_e)+a^2}}$ : $\\frac{1}{1-a}$ en 0, $\\frac{1}{1+a}$ en $f_e/2$'],
  ['Phase', '$-\\arctan\\dfrac{a\\sin(2\\pi f/f_e)}{1-a\\cos(2\\pi f/f_e)}$'],
  ['Type', '$0\\lt a\\lt1$ : <b>passe-bas</b> ; $-1\\lt a\\lt0$ : <b>passe-haut</b>']
])}
${plots(
  plot({ x: [-0.6, 0.6], y: [-0.2, 2.4], xl: 'f/fe', yl: '|H(f)|', fns: [{ f: v => 1 / Math.sqrt(1 - cos(2 * PI * v) + 0.25) }, { f: v => 1 / Math.sqrt(1 + cos(2 * PI * v) + 0.25), cls: 'c2' }], xt: [[-0.5, '-1/2'], [0.5, '1/2']], yt: [[2, '2']], cap: 'a = 0,5 : passe-bas · a = −0,5 (orange) : passe-haut' }),
  plot({ x: [-0.5, 7.5], y: [-0.2, 2.2], xl: 'n', yl: 's(n)', stems: [{ n: [0, 1, 2, 3, 4, 5, 6, 7], v: [0, 1, 2, 3, 4, 5, 6, 7].map(n => (1 - Math.pow(0.5, n + 1)) / 0.5) }], hlines: [2], cap: 'Réponse indicielle (a = 0,5) → 2' })
)}
${methode(R`<p><b>Fréquence de coupure</b> ($0 \lt a \lt 1$) : chercher $|H(f_c)|^2 = \frac12|H(0)|^2$ :</p>
$$1 - 2a\cos\theta_c + a^2 = 2(1-a)^2 \iff \cos\theta_c = \frac{4a - 1 - a^2}{2a}, \qquad f_c = \frac{f_e\,\theta_c}{2\pi}$$
<p>Ex. $a = 0{,}5$ : $\cos\theta_c = 0{,}75$ → $\theta_c \approx 0{,}72$ rad → $f_c \approx 0{,}115\,f_e$.</p>`)}
${retenir(R`<p>Plus $a$ est proche de 1, plus le pôle est proche du cercle unité : gain énorme en basse fréquence, coupure très basse, et réponse très lente.</p>`)}
`}
  ];

  /* ============================================================ QCM
   * La bonne réponse est toujours la PREMIÈRE de "choix" (mélangé à l'affichage).
   */
  const QCM = [

/* ---------- Partie 1 · pratique ---------- */
{ theme: 'signaux', type: 'pratique', tps: ['p1'],
  q: R`Quelle est la fréquence de $x(t) = 3\cos(100\pi t + \pi/4)$ ?`,
  choix: ['50 Hz', '100 Hz', R`$100\pi$ Hz`, '3 Hz'],
  expl: R`$100\pi t = 2\pi \cdot 50\, t$ → $f_0 = 50$ Hz. L'amplitude (3) et la phase ($\pi/4$) ne changent pas la fréquence.` },

{ theme: 'signaux', type: 'pratique', tps: ['p1'],
  q: R`Quel est le support de $\mathrm{rect}\!\left(\frac{t-2}{4}\right)$ ?`,
  choix: [R`$[0, 4]$`, R`$[-2, 2]$`, R`$[1{,}5;\ 2{,}5]$`, R`$[2, 6]$`],
  expl: R`Porte de <b>largeur 4</b> centrée en <b>2</b> : $\left|\frac{t-2}{4}\right| \le \frac12 \iff |t-2| \le 2 \iff t \in [0,4]$.` },

{ theme: 'signaux', type: 'pratique', tps: ['p1'],
  q: R`$x(t)$ est nul en dehors de $[0, 2]$. Où vit $x(2t+1)$ ?`,
  choix: [R`$[-\tfrac12, \tfrac12]$`, R`$[1, 5]$`, R`$[-1, 1]$`, R`$[\tfrac12, \tfrac32]$`],
  expl: R`Il faut $0 \le 2t+1 \le 2$, soit $-\frac12 \le t \le \frac12$. Autre lecture : $x(2(t+\frac12))$ = compression par 2 puis décalage de $\frac12$ vers la gauche.` },

{ theme: 'signaux', type: 'pratique', tps: ['p1'],
  q: 'Dans quel sens se déplace x(t + 3) par rapport à x(t) ?',
  choix: ['De 3 vers la gauche (avance)', 'De 3 vers la droite (retard)', 'Il est dilaté d’un facteur 3', 'Il est retourné'],
  expl: R`Ce qui se passait en $t=0$ se passe maintenant en $t=-3$ : la courbe part à <b>gauche</b>. $x(t-t_0)$ avec $t_0 \gt 0$ va à droite.` },

{ theme: 'signaux', type: 'pratique', tps: ['p1'],
  q: R`Que vaut $\mathrm{rect}(t) * \mathrm{rect}(t)$ ?`,
  choix: [R`$\mathrm{triang}(t)$, de support $[-1, 1]$`, R`$\mathrm{rect}(t)$`, R`$\mathrm{rect}(t/2)$`, R`$\mathrm{sinc}^2(t)$`],
  expl: 'La surface commune de deux portes qui glissent l’une sur l’autre croît linéairement puis décroît : un triangle. Largeur = somme des largeurs = 2.' },

{ theme: 'signaux', type: 'pratique', tps: ['p1'],
  q: R`Que vaut $x(t) * \delta(t-3)$ ?`,
  choix: [R`$x(t-3)$`, R`$x(3)\,\delta(t-3)$`, R`$x(t+3)$`, R`$3\,x(t)$`],
  expl: R`Convoluer par un Dirac décalé <b>décale</b> le signal. Ne pas confondre avec le <b>produit</b> $x(t)\delta(t-3) = x(3)\delta(t-3)$.` },

{ theme: 'signaux', type: 'pratique', tps: ['p1'],
  q: R`Que vaut $\cos(t)\,\delta(t - \pi)$ ?`,
  choix: [R`$-\delta(t-\pi)$`, R`$\delta(t-\pi)$`, R`$\cos(t-\pi)$`, '0'],
  expl: R`Propriété de prélèvement : $x(t)\delta(t-t_0) = x(t_0)\delta(t-t_0)$, et $\cos(\pi) = -1$.` },

{ theme: 'fourier', type: 'pratique', tps: ['p1'],
  q: R`Quelle est la TF de $\mathrm{rect}(t/2)$ ?`,
  choix: [R`$2\,\mathrm{sinc}(2f)$`, R`$\mathrm{sinc}(f/2)$`, R`$\frac12\mathrm{sinc}(2f)$`, R`$\mathrm{rect}(2f)$`],
  expl: R`Propriété d'échelle : $x(t/T) \to |T|X(Tf)$ avec $X = \mathrm{sinc}$ et $T = 2$.` },

{ theme: 'fourier', type: 'pratique', tps: ['p1'],
  q: R`Quelle est la TF de $e^{-2t}u(t)$ ?`,
  choix: [R`$\dfrac{1}{2 + j2\pi f}$`, R`$\dfrac{4}{4 + (2\pi f)^2}$`, R`$\dfrac{1}{2 - j2\pi f}$`, R`$e^{-2f}$`],
  expl: R`Paire du cours : $e^{-at}u(t) \to \frac{1}{a + j2\pi f}$, ici $a = 2$. La forme $\frac{2a}{a^2+(2\pi f)^2}$ est celle de $e^{-a|t|}$ (bilatérale).` },

{ theme: 'fourier', type: 'pratique', tps: ['p1'],
  q: R`$x(t)$ a pour TF $X(f)$. Quelle est la TF de $x(t-1)$ ?`,
  choix: [R`$X(f)\,e^{-j2\pi f}$`, R`$X(f-1)$`, R`$X(f)\,e^{j2\pi f}$`, R`$X(f) - 1$`],
  expl: 'Un retard ne change pas le module du spectre, seulement la phase (qui devient linéaire en f).' },

{ theme: 'fourier', type: 'pratique', tps: ['p1'],
  q: R`Quelles raies contient le spectre de $x(t) = \cos(40\pi t)\cos(200\pi t)$ ?`,
  choix: [R`$\pm 80$ Hz et $\pm 120$ Hz, de hauteur $\frac14$`, R`$\pm 20$ Hz et $\pm 100$ Hz, de hauteur $\frac12$`, R`$\pm 20$ Hz et $\pm 100$ Hz, de hauteur $\frac14$`, R`$\pm 120$ Hz seulement, de hauteur $\frac12$`],
  expl: R`$\cos a\cos b = \frac12[\cos(a-b)+\cos(a+b)]$ : composantes à $100-20=80$ et $100+20=120$ Hz, d'amplitude $\frac12$, chacune donnant deux raies de $\frac14$.` },

{ theme: 'fourier', type: 'pratique', tps: ['p1'],
  q: 'Dans la série de Fourier d’un créneau à 50 % (valeurs 0 et 1), quelles harmoniques sont présentes ?',
  choix: [R`La composante continue $\frac12$ et les harmoniques <b>impaires</b> seulement`, 'Toutes les harmoniques, avec la même amplitude', 'Seulement les harmoniques paires', 'Seulement le fondamental'],
  expl: R`$A_0 = \frac12$, $A_{2m} = 0$, $A_{2m+1} = \frac{2}{(2m+1)\pi}$ : les raies impaires décroissent en $1/n$.` },

/* ---------- Partie 1 · théorie ---------- */
{ theme: 'signaux', type: 'theorie', tps: ['p1'],
  q: 'Pourquoi représenter un signal à la fois en temps et en fréquence ?',
  choix: ['Ce sont deux points de vue sur la même information : quand les choses arrivent, et à quelles fréquences', 'Parce que le spectre contient plus d’information que le signal', 'Parce qu’un ordinateur ne peut stocker que des spectres', 'Pour doubler la précision des mesures'],
  expl: 'La TF est réversible : aucune information n’est gagnée ni perdue. Certains traitements (filtrage) sont juste beaucoup plus simples à comprendre en fréquence.' },

{ theme: 'signaux', type: 'theorie', tps: ['p1'],
  q: 'Qu’est-ce qu’un signal causal ?',
  choix: [R`Un signal nul pour $t \lt 0$`, 'Un signal périodique', 'Un signal qui n’a pas de bruit', 'Un signal à énergie finie'],
  expl: 'La causalité concerne le support. Pour un système temps réel, elle signifie aussi qu’on n’utilise pas d’entrées futures.' },

{ theme: 'signaux', type: 'theorie', tps: ['p1'],
  q: 'Pourquoi dit-on que δ(t) n’est pas une fonction « classique » ?',
  choix: ['Elle est nulle partout sauf en 0 et pourtant son aire vaut 1 : c’est une distribution', 'Parce qu’elle est périodique', 'Parce qu’elle n’a pas de transformée de Fourier', 'Parce qu’elle vaut 1 en t = 0'],
  expl: 'Aucune vraie fonction ne peut avoir une aire de 1 en étant nulle presque partout. On la voit comme la limite d’impulsions de plus en plus brèves d’aire 1.' },

{ theme: 'fourier', type: 'theorie', tps: ['p1'],
  q: 'Pourquoi la propriété « convolution ↔ produit » est-elle si importante ?',
  choix: ['Filtrer (convoluer par h) revient à multiplier le spectre par H(f) : très simple à interpréter', 'Parce qu’elle rend la convolution commutative', 'Parce qu’elle supprime le bruit', 'Parce qu’elle permet de calculer la phase'],
  expl: R`On voit immédiatement qu'un filtre garde les fréquences où $|H(f)|$ est grand et coupe celles où il est petit.` },

{ theme: 'fourier', type: 'theorie', tps: ['p1'],
  q: 'Que se passe-t-il pour le spectre quand on comprime un signal dans le temps ?',
  choix: ['Il s’étale vers les hautes fréquences', 'Il se comprime aussi', 'Il ne change pas', 'Il se décale vers les fréquences négatives'],
  expl: R`$x(t/T) \to |T|X(Tf)$ : si $T \lt 1$, $X(Tf)$ est plus large. Un événement bref contient des fréquences élevées.` },

{ theme: 'fourier', type: 'theorie', tps: ['p1'],
  q: 'Spectre d’un signal périodique et d’un signal apériodique : quelle différence ?',
  choix: ['Périodique → des raies (spectre discret) ; apériodique → spectre continu', 'Périodique → spectre continu ; apériodique → raies', 'Les deux sont continus', 'Les deux sont des raies'],
  expl: 'Périodicité dans un domaine ⟺ discrétisation dans l’autre. Les raies sont aux multiples de la fréquence fondamentale.' },

{ theme: 'fourier', type: 'theorie', tps: ['p1'],
  q: 'Pour un signal réel, quelle symétrie a le spectre d’amplitude |X(f)| ?',
  choix: ['Il est pair : la partie f < 0 est le miroir de f > 0', 'Il est impair', 'Il est nul pour f < 0', 'Aucune symétrie particulière'],
  expl: R`Pour $x$ réel, $X(-f) = \overline{X(f)}$ : même module, phase opposée. C'est pour ça qu'on peut se contenter d'un spectre unilatéral.` },

/* ---------- Partie 2 · pratique ---------- */
{ theme: 'echant', type: 'pratique', tps: ['p2'],
  q: 'Une sinusoïde à 4 kHz est échantillonnée à 5 kHz. Quelle fréquence observe-t-on ?',
  choix: ['1 kHz', '4 kHz', '9 kHz', '2,5 kHz'],
  expl: R`$f_e/2 = 2{,}5$ kHz $\lt 4$ kHz → repliement : $|4 - 5| = 1$ kHz.` },

{ theme: 'echant', type: 'pratique', tps: ['p2'],
  q: 'Une composante à 3,5 kHz est échantillonnée à 6 kHz. Où apparaît-elle sur le spectre ?',
  choix: ['2,5 kHz', '3,5 kHz', '0,5 kHz', '9,5 kHz'],
  expl: R`$f_e/2 = 3$ kHz $\lt 3{,}5$ kHz : $|3{,}5 - 6| = 2{,}5$ kHz.` },

{ theme: 'echant', type: 'pratique', tps: ['p2'],
  q: 'f₀ = 1 kHz, fe = 1,8 kHz. Quelle fréquence apparente a la sinusoïde reconstruite ?',
  choix: ['800 Hz', '1 kHz', '1,8 kHz', '2,8 kHz'],
  expl: R`$f_e \lt 2f_0$ → repliement à $|1000 - 1800| = 800$ Hz (TP 3, ex. 4).` },

{ theme: 'echant', type: 'pratique', tps: ['p2'],
  q: 'Un signal audio contient des fréquences jusqu’à 20 kHz. Quelle fréquence d’échantillonnage minimale ?',
  choix: ['Strictement plus de 40 kHz', '20 kHz', 'Exactement 40 kHz suffit toujours', '10 kHz'],
  expl: R`Shannon : $f_e \gt 2B$. C'est pour ça que le CD est à 44,1 kHz (avec une marge pour le filtre anti-repliement).` },

{ theme: 'echant', type: 'pratique', tps: ['p2'],
  q: R`$x(t) = \cos(2\pi\,700\,t) + 0{,}5\cos(2\pi\,1200\,t)$ est échantillonné à 2 kHz. Que voit-on ?`,
  choix: ['700 Hz intact, et 1200 Hz replié à 800 Hz', 'Les deux composantes intactes', '700 Hz replié à 1300 Hz', 'Les deux repliées'],
  expl: R`$f_e/2 = 1$ kHz. 700 Hz est en dessous : rien ne change. 1200 Hz est au-dessus : $|1200 - 2000| = 800$ Hz.` },

{ theme: 'echant', type: 'pratique', tps: ['p2'],
  q: R`$\cos(8000\pi t)$ est échantillonné à 10 kHz puis reconstruit par Shannon. Qu'obtient-on ?`,
  choix: [R`$\cos(8000\pi t)$`, R`$\cos(2000\pi t)$`, R`$\cos(12000\pi t)$`, 'Rien : le signal est perdu'],
  expl: R`$f_0 = 4$ kHz $\lt f_e/2 = 5$ kHz : Shannon est respecté, reconstruction exacte.` },

{ theme: 'echant', type: 'pratique', tps: ['p2'],
  q: R`Même signal $\cos(8000\pi t)$, mais échantillonné à 5 kHz puis reconstruit par Shannon ?`,
  choix: [R`$\cos(2000\pi t)$`, R`$\cos(8000\pi t)$`, R`$\cos(10000\pi t)$`, R`$\cos(8000\pi t) + \cos(2000\pi t)$`],
  expl: R`Le passe-bas idéal garde $[-2{,}5;\ 2{,}5]$ kHz, où se trouve la copie repliée à $\pm1$ kHz : on reconstruit une sinusoïde à 1 kHz.` },

{ theme: 'echant', type: 'pratique', tps: ['p2'],
  q: 'Quel est le débit d’un WAV qualité CD (44,1 kHz, 16 bits, stéréo) ?',
  choix: ['1411,2 kbit/s', '705,6 kbit/s', '44,1 kbit/s', '128 kbit/s'],
  expl: R`$44\,100 \times 16 \times 2 = 1\,411\,200$ bit/s. 705,6 kbit/s serait le mono.` },

{ theme: 'matlab', type: 'pratique', tps: ['p2'],
  q: 'Fe0 = 44,1 kHz. Après y = x(1:2:end), quelle est la nouvelle fréquence de Nyquist ?',
  code: MAT`
    M = 2; Fe = Fe0/M;
    y = x(1:M:end);
  `,
  choix: ['11,025 kHz', '22,05 kHz', '44,1 kHz', '88,2 kHz'],
  expl: R`On garde un échantillon sur 2 : $F_e = 22{,}05$ kHz, donc Nyquist $= F_e/2 = 11{,}025$ kHz. Tout ce qui dépasse dans le son d'origine se replie, d'où le ${c`lowpass`} avant.` },

{ theme: 'matlab', type: 'pratique', tps: ['p2'],
  q: 'Lequel de ces codes réduit correctement Fe par 2 ?',
  choix: [c`y = lowpass(x, fc, Fe0); y = y(1:2:end);` + ' avec fc < Fe0/4', c`y = x(1:2:end); y = lowpass(y, fc, Fe0/2);`, c`y = x(1:2:end);`, c`y = resample(x(1:2:end), 1, 2);`],
  expl: 'Le filtre anti-repliement doit être appliqué <b>avant</b> la décimation, avec une coupure sous la nouvelle fréquence de Nyquist (Fe0/4). Après coup, les composantes repliées sont mélangées au signal utile.' },

{ theme: 'matlab', type: 'pratique', tps: ['p2', 'p3'],
  q: 'Fe = 1000 Hz, N = 1000 points. Le pic de abs(fft(x)) est à l’indice Matlab 51. Quelle fréquence ?',
  choix: ['50 Hz', '51 Hz', '51 kHz', '25 Hz'],
  expl: R`L'indice Matlab $k+1$ correspond à $f = k\,F_e/N$. Ici $k = 50$ et $F_e/N = 1$ Hz → 50 Hz.` },

/* ---------- Partie 2 · théorie ---------- */
{ theme: 'echant', type: 'theorie', tps: ['p2'],
  q: 'Que fait l’échantillonnage au spectre du signal ?',
  choix: ['Il le recopie périodiquement, tous les fe', 'Il le coupe au-dessus de fe', 'Il le décale de fe', 'Rien, le spectre ne change pas'],
  expl: R`Produit par un peigne en temps ⟺ convolution par un peigne en fréquence : $X_e(f) = f_e\sum_k X(f-kf_e)$.` },

{ theme: 'echant', type: 'theorie', tps: ['p2'],
  q: 'Pourquoi le filtre anti-repliement doit-il être placé AVANT l’échantillonneur ?',
  choix: ['Après, les composantes trop hautes sont déjà repliées dans la bande utile et ne peuvent plus être séparées', 'Parce qu’un filtre numérique n’existe pas', 'Pour diminuer la fréquence d’échantillonnage', 'Pour éviter le bloqueur d’ordre zéro'],
  expl: 'Le repliement est irréversible : une composante repliée tombe à la même fréquence qu’un vrai contenu du signal.' },

{ theme: 'echant', type: 'theorie', tps: ['p2'],
  q: 'Pourquoi l’interpolateur de Shannon est-il irréalisable en pratique ?',
  choix: ['Son noyau sinc est non causal et de durée infinie', 'Parce qu’il ne passe pas par les échantillons', 'Parce qu’il ne marche que si fe < 2B', 'Parce qu’il introduit du repliement'],
  expl: 'Il faudrait connaître tous les échantillons, passés et futurs. On l’approche (BOZ, filtres de reconstruction réels).' },

{ theme: 'echant', type: 'theorie', tps: ['p2'],
  q: 'Que fait un bloqueur d’ordre zéro ?',
  choix: ['Il maintient chaque échantillon constant pendant Te (sortie en escalier)', 'Il relie les échantillons par des droites', 'Il somme des sinus cardinaux', 'Il met à zéro un échantillon sur deux'],
  expl: R`Simple et réalisable, mais approximatif. En Matlab : ${c`interp1(t_e, x_e, t, 'previous')`}.` },

{ theme: 'echant', type: 'theorie', tps: ['p2'],
  q: 'Qu’est-ce que la fréquence de Nyquist ?',
  choix: ['fe / 2 : la plus haute fréquence représentable sans repliement', 'La fréquence la plus haute du signal', '2 × fe', 'La fréquence de coupure du BOZ'],
  expl: R`Toute composante au-delà de $f_e/2$ se replie dans $[0, f_e/2]$.` },

{ theme: 'echant', type: 'theorie', tps: ['p2'],
  q: 'Pourquoi un MP3 est-il plus petit qu’un WAV à la même fe ?',
  choix: ['Son codeur supprime de l’information jugée peu audible (compression avec perte)', 'Il échantillonne à une fréquence plus basse', 'Il utilise moins de bits par échantillon sans rien perdre', 'Il est toujours en mono'],
  expl: 'La fréquence d’échantillonnage reste 44,1 kHz ; c’est le débit (données par seconde) qui diminue.' },

/* ---------- Partie 3 · pratique ---------- */
{ theme: 'discret', type: 'pratique', tps: ['p3'],
  q: R`Quelle est la période de $x(n) = \cos\!\left(2\pi\,\frac{3}{8}\,n\right)$ ?`,
  choix: ['8', '3', '8/3', 'Elle n’est pas périodique'],
  expl: R`$\nu_0 = 3/8$, fraction irréductible → $N_0 = 8$ (3 tours complets en 8 échantillons).` },

{ theme: 'discret', type: 'pratique', tps: ['p3'],
  q: R`Quelle est la période de $x(n) = \cos\!\left(2\pi\,\frac{2}{6}\,n\right)$ ?`,
  choix: ['3', '6', '2', '12'],
  expl: R`$\frac26 = \frac13$ : il faut simplifier avant de lire la période. $N_0 = 3$.` },

{ theme: 'discret', type: 'pratique', tps: ['p3'],
  q: R`$x(n) = \cos(0{,}5\,n)$ est-il périodique ?`,
  choix: [R`Non : $\nu_0 = \frac{0{,}5}{2\pi}$ est irrationnel`, R`Oui, de période $4\pi$`, 'Oui, de période 2', 'Oui, de période 4'],
  expl: R`$4\pi$ n'est pas un entier : aucun nombre entier d'échantillons ne fait un nombre entier de tours.` },

{ theme: 'discret', type: 'pratique', tps: ['p3'],
  q: R`Quelle est l'énergie de $x(n) = 0{,}5^n\,u(n)$ ?`,
  choix: [R`$\frac43$`, '2', R`$\frac12$`, 'Infinie'],
  expl: R`$E = \sum_{n\ge0} 0{,}25^n = \frac{1}{1-0{,}25} = \frac43$.` },

{ theme: 'discret', type: 'pratique', tps: ['p3'],
  q: R`$x = \{\underset{\uparrow}{1}, 2, 3\}$ et $h = \{\underset{\uparrow}{1}, 1\}$. Que vaut $x * h$ ?`,
  choix: [R`$\{\underset{\uparrow}{1}, 3, 5, 3\}$`, R`$\{\underset{\uparrow}{1}, 2, 3\}$`, R`$\{\underset{\uparrow}{2}, 5\}$`, R`$\{\underset{\uparrow}{1}, 3, 5\}$`],
  expl: R`$y(n) = x(n) + x(n-1)$ : $1$, $2+1$, $3+2$, $3$. Longueur $3+2-1 = 4$.` },

{ theme: 'discret', type: 'pratique', tps: ['p3'],
  q: R`Comment obtenir $x(-n+2)$ à partir de $x(n)$ ?`,
  choix: ['Retourner, puis décaler de 2 vers la droite', 'Décaler de 2 vers la droite, puis retourner', 'Retourner, puis décaler de 2 vers la gauche', 'Décaler de 2 vers la gauche seulement'],
  expl: R`$x(-n+2) = x(-(n-2))$ : c'est $x(-n)$ retardé de 2. Vérification : la valeur $x(0)$ se retrouve en $n = 2$.` },

{ theme: 'discret', type: 'pratique', tps: ['p3'],
  q: R`$x = \{\ldots, 0, \underset{\uparrow}{1}, 2, 3, 4, 0, \ldots\}$ (de $n=0$ à $3$). Que vaut $y(n) = x(2n)$ ?`,
  choix: [R`$\{\underset{\uparrow}{1}, 3\}$`, R`$\{\underset{\uparrow}{1}, 2, 3, 4\}$`, R`$\{\underset{\uparrow}{2}, 4\}$`, R`$\{\underset{\uparrow}{1}, 1, 2, 2, 3, 3, 4, 4\}$`],
  expl: R`$y(0) = x(0) = 1$, $y(1) = x(2) = 3$, $y(2) = x(4) = 0$. Les valeurs d'indice impair sont perdues.` },

{ theme: 'tfd', type: 'pratique', tps: ['p3'],
  q: R`Quelle est la TFtd de $\delta(n-1) + \delta(n+1)$ ?`,
  choix: [R`$2\cos(2\pi f/f_e)$`, R`$2j\sin(2\pi f/f_e)$`, R`$2$`, R`$e^{-j2\pi f/f_e}$`],
  expl: R`$e^{-j2\pi f/f_e} + e^{+j2\pi f/f_e} = 2\cos(2\pi f/f_e)$ (formule d'Euler).` },

{ theme: 'tfd', type: 'pratique', tps: ['p3'],
  q: 'fe = 1 kHz, N = 500 points. Quel est l’écart entre deux cases de la TFD ?',
  choix: ['2 Hz', '0,5 Hz', '500 Hz', '1 Hz'],
  expl: R`$\Delta f = f_e/N = 1000/500 = 2$ Hz (et la durée observée est $NT_e = 0{,}5$ s).` },

{ theme: 'tfd', type: 'pratique', tps: ['p3'],
  q: 'On veut distinguer deux fréquences séparées de 1 Hz avec une TFD, à fe = 8 kHz. Combien de temps observer ?',
  choix: ['Au moins 1 s (N ≥ 8000)', '1 ms', '0,125 s', 'Ça dépend seulement de fe'],
  expl: R`$\Delta f = \frac{1}{NT_e}$ = 1 / (durée observée). Résolution de 1 Hz → 1 s, soit $N = 8000$ points.` },

{ theme: 'tfd', type: 'pratique', tps: ['p3'],
  q: 'Pour N = 1024, combien de multiplications complexes fait une FFT radix 2 ?',
  choix: ['5 120', '1 048 576', '1 024', '10 240'],
  expl: R`$\frac N2\log_2 N = 512 \times 10 = 5120$, contre $N^2 \approx 10^6$ pour la TFD directe.` },

{ theme: 'filtres', type: 'pratique', tps: ['p3'],
  q: R`Quelle est la fonction de transfert de $y(n) = \frac12x(n) + \frac12x(n-1)$ ?`,
  choix: [R`$H(z) = \frac12(1 + z^{-1})$`, R`$H(z) = \frac12(1 - z^{-1})$`, R`$H(z) = \dfrac{1}{1 - \frac12 z^{-1}}$`, R`$H(z) = \frac12 + z$`],
  expl: R`Un retard d'un échantillon devient $z^{-1}$ : $Y = \frac12X + \frac12z^{-1}X$.` },

{ theme: 'filtres', type: 'pratique', tps: ['p3'],
  q: R`Quelle est la réponse impulsionnelle de $y(n) = a\,y(n-1) + x(n)$ ?`,
  choix: [R`$a^n u(n)$`, R`$\delta(n) + a\,\delta(n-1)$`, R`$a\,\delta(n-1)$`, R`$(1-a)^n u(n)$`],
  expl: R`Avec $x = \delta$ : $h(0) = 1$, $h(1) = a$, $h(2) = a^2$… Elle ne s'arrête jamais : filtre RII.` },

{ theme: 'filtres', type: 'pratique', tps: ['p3'],
  q: R`Le filtre $y(n) = 1{,}2\,y(n-1) + x(n)$ est-il stable ?`,
  choix: [R`Non : pôle en $1{,}2$, hors du cercle unité`, 'Oui, comme tous les filtres numériques', 'Oui, car le coefficient de x(n) vaut 1', 'On ne peut pas savoir sans simuler'],
  expl: R`$H(z) = \frac{z}{z-1{,}2}$ ; $h(n) = 1{,}2^n u(n)$ explose.` },

{ theme: 'filtres', type: 'pratique', tps: ['p3'],
  q: 'Ce filtre est-il stable ?',
  uml: plot({ x: [-1.6, 1.6], y: [-1.4, 1.4], w: 240, h: 220, xl: 'Re', yl: 'Im', equal: true, fns: [{ fx: t => cos(t), fy: t => sin(t), t: [0, 2 * PI], cls: 'muted' }], pts: [{ x: 0.5, y: 0.6, k: 'pole' }, { x: 0.5, y: -0.6, k: 'pole' }, { x: -1, y: 0, k: 'zero' }], cap: '× pôles, ○ zéro, cercle unité en gris' }),
  choix: ['Oui : les deux pôles sont à l’intérieur du cercle unité', 'Non : il y a un zéro sur le cercle unité', 'Non : les pôles sont complexes', 'On ne peut rien dire sans l’équation'],
  expl: R`$|0{,}5 \pm 0{,}6j| = \sqrt{0{,}61} \approx 0{,}78 \lt 1$. La position des <b>zéros</b> n'a aucun rôle dans la stabilité.` },

{ theme: 'filtres', type: 'pratique', tps: ['p3'],
  q: 'Deux pôles en z = 0 et deux zéros en z = ±1. Quelle équation aux différences ?',
  choix: [R`$y(n) = x(n) - x(n-2)$`, R`$y(n) = x(n) + x(n-2)$`, R`$y(n) = y(n-2) + x(n)$`, R`$y(n) = x(n) - x(n-1)$`],
  expl: R`$H(z) = \frac{(z-1)(z+1)}{z^2} = 1 - z^{-2}$. C'est un RIF (TD 4, ex. 1).` },

{ theme: 'filtres', type: 'pratique', tps: ['p3'],
  q: 'Quel type de filtre a ce gain ?',
  uml: plot({ x: [-0.6, 0.6], y: [-0.1, 1.25], xl: 'f/fe', yl: '|H(f)|', fns: [{ f: v => abs(cos(PI * v)) }], xt: [[-0.5, '-1/2'], [0.5, '1/2']], yt: [[1, '1']] }),
  choix: [R`Passe-bas, coupure à $f_e/4$`, 'Passe-haut', 'Passe-bande', R`Passe-bas, coupure à $f_e/2$`],
  expl: R`$|H| = \cos(\pi f/f_e)$ : 1 en 0, 0 en $f_e/2$. À −3 dB, $\cos(\pi f_c/f_e) = \frac{1}{\sqrt2}$ → $f_c = f_e/4$ (moyenneur à 2 points).` },

{ theme: 'filtres', type: 'pratique', tps: ['p3'],
  q: R`Quelle est la réponse indicielle de $y(n) = \frac12x(n) - \frac12x(n-1)$ ?`,
  choix: [R`$\frac12$ en $n = 0$, puis $0$`, R`$\frac12$ en $n=0$, puis $1$`, R`$1$ pour tout $n \ge 0$`, R`$\frac12$ pour tout $n\ge0$`],
  expl: R`Avec $x = u$ : $s(0) = \frac12$, puis $\frac12 - \frac12 = 0$. Un passe-haut « oublie » une entrée constante.` },

{ theme: 'filtres', type: 'pratique', tps: ['p3'],
  q: R`Pour $y(n) = 0{,}5\,y(n-1) + x(n)$, vers quoi tend la réponse indicielle ?`,
  choix: ['2', '0,5', '1', 'Elle diverge'],
  expl: R`$s(n) \to \frac{1}{1-a} = \frac{1}{0{,}5} = 2$ : c'est aussi le gain en $f = 0$, $H(1) = 2$.` },

/* ---------- Partie 3 · théorie ---------- */
{ theme: 'tfd', type: 'theorie', tps: ['p3'],
  q: 'Pourquoi le spectre (TFtd) d’un signal discret est-il périodique de période fe ?',
  choix: [R`Parce que $e^{-j2\pi n(f+f_e)/f_e} = e^{-j2\pi nf/f_e}$ pour tout entier $n$`, 'Parce que le signal discret est périodique', 'Parce que la FFT l’impose', 'Ce n’est vrai que pour les signaux réels'],
  expl: R`$e^{-j2\pi n} = 1$ pour $n$ entier. C'est la même chose que « échantillonner = périodiser le spectre ».` },

{ theme: 'tfd', type: 'theorie', tps: ['p3'],
  q: 'Quel lien entre TFtd et TFD ?',
  choix: [R`La TFD = la TFtd d'un bloc de $N$ points, évaluée en $N$ fréquences $k f_e/N$`, 'Aucun, ce sont deux outils indépendants', 'La TFtd est un algorithme rapide pour la TFD', 'La TFD est la TFtd d’un signal continu'],
  expl: 'La TFD échantillonne le spectre continu de la TFtd sur une grille, ce qui rend le signal implicitement périodique en temps.' },

{ theme: 'tfd', type: 'theorie', tps: ['p3'],
  q: 'La FFT donne-t-elle le même résultat que la TFD ?',
  choix: ['Oui, exactement : c’est juste un algorithme plus rapide', 'Non, c’est une approximation', 'Seulement si N est impair', 'Non, elle donne la TFtd continue'],
  expl: R`Mêmes coefficients $X[k]$, en $\frac N2\log_2N$ opérations au lieu de $N^2$ (il faut $N = 2^m$ pour le radix 2).` },

{ theme: 'tfd', type: 'theorie', tps: ['p1', 'p3'],
  q: 'Quelle est la règle qui relie les 4 transformées de Fourier ?',
  choix: ['Périodique dans un domaine ⟺ discret dans l’autre', 'Continu dans un domaine ⟺ continu dans l’autre', 'Toutes donnent un spectre continu', 'Toutes donnent un spectre périodique'],
  expl: 'Série de Fourier : périodique → raies. TFtd : discret → périodique. TFD : les deux.' },

{ theme: 'discret', type: 'theorie', tps: ['p3'],
  q: 'Signal d’énergie ou de puissance : où classer une sinusoïde discrète ?',
  choix: ['Puissance : énergie infinie mais puissance moyenne finie', 'Énergie : énergie finie, puissance nulle', 'Ni l’un ni l’autre', 'Les deux à la fois'],
  expl: 'Un signal périodique non nul ne s’éteint jamais : la somme des carrés diverge, mais la moyenne par échantillon reste finie.' },

{ theme: 'filtres', type: 'theorie', tps: ['p3'],
  q: 'Pourquoi un filtre RIF est-il toujours stable ?',
  choix: ['Sa réponse impulsionnelle est finie, donc Σ|h(n)| est fini (pôles tous en 0)', 'Parce que ses coefficients sont inférieurs à 1', 'Parce qu’il a une phase linéaire', 'Ce n’est pas vrai'],
  expl: 'Une somme finie de valeurs finies est finie. En Z, le dénominateur est une puissance de z : tous les pôles sont en 0, à l’intérieur du cercle unité.' },

{ theme: 'filtres', type: 'theorie', tps: ['p3'],
  q: 'Comment reconnaître un RII sur son équation aux différences ?',
  choix: ['Il y a des sorties passées y(n − k) à droite du signe égal', 'Il y a plus de 3 coefficients', 'Les coefficients sont négatifs', 'L’entrée x(n) n’apparaît pas'],
  expl: 'La rétroaction (récursivité) rend la réponse impulsionnelle infinie.' },

{ theme: 'filtres', type: 'theorie', tps: ['p3'],
  q: 'Quel est le critère de stabilité d’un filtre causal ?',
  choix: ['Tous les pôles de H(z) sont strictement à l’intérieur du cercle unité', 'Tous les zéros sont dans le cercle unité', 'Le gain en f = 0 vaut 1', 'L’équation n’a pas de terme y(n − k)'],
  expl: R`Équivalent à $\sum|h(n)| \lt \infty$. Les zéros n'interviennent pas dans la stabilité.` },

{ theme: 'filtres', type: 'theorie', tps: ['p3'],
  q: 'Comment obtient-on la réponse fréquentielle H(f) à partir de H(z) ?',
  choix: [R`On remplace $z$ par $e^{j2\pi f/f_e}$ (on parcourt le cercle unité)`, R`On remplace $z$ par $f$`, R`On remplace $z$ par $j2\pi f$`, 'On calcule la dérivée de H(z)'],
  expl: R`C'est la TFtd de $h(n)$. Parcourir le cercle de $f = 0$ ($z = 1$) à $f = f_e/2$ ($z = -1$).` },

{ theme: 'filtres', type: 'theorie', tps: ['p3'],
  q: 'Quel est l’intérêt principal d’un RIF par rapport à un RII ?',
  choix: ['Il est toujours stable et peut avoir une phase linéaire', 'Il demande moins de coefficients', 'Il coupe plus raide à ordre égal', 'Il n’a pas besoin d’échantillonnage'],
  expl: 'En contrepartie, un RIF demande souvent beaucoup plus de coefficients qu’un RII pour une même raideur de coupure.' },

{ theme: 'filtres', type: 'theorie', tps: ['p3'],
  q: R`Que devient un retard d'un échantillon, $x(n-1)$, dans le domaine Z ?`,
  choix: [R`$z^{-1}X(z)$`, R`$zX(z)$`, R`$X(z) - 1$`, R`$X(z-1)$`],
  expl: R`C'est la règle qui permet de passer directement de l'équation aux différences à $H(z)$.` },

/* ---------- Théorie complémentaire (équilibre pratique / théorie) ---------- */
{ theme: 'fourier', type: 'theorie', tps: ['p1'],
  q: R`Que représente $A_0$ dans la série de Fourier d'un signal périodique ?`,
  choix: ['La valeur moyenne du signal (composante continue)', 'L’amplitude du fondamental', 'La valeur maximale du signal', 'La phase à l’origine'],
  expl: R`$A_0$ est la raie en $f = 0$. Le fondamental est le terme de rang 1, à $f_0$.` },

{ theme: 'fourier', type: 'theorie', tps: ['p1'],
  q: 'Que dit l’égalité de Parseval ?',
  choix: ['L’énergie d’un signal est la même calculée en temps ou en fréquence', 'La TF d’un produit est un produit', 'Le spectre d’un signal réel est pair', 'Un signal court a un spectre large'],
  expl: R`$\int |x(t)|^2dt = \int |X(f)|^2 df$ : on peut mesurer l'énergie là où c'est le plus simple.` },

{ theme: 'fourier', type: 'theorie', tps: ['p1'],
  q: 'Qu’arrive-t-il au spectre d’un signal qu’on retarde ?',
  choix: ['Son module ne change pas, seule sa phase change (linéairement en f)', 'Il est décalé en fréquence', 'Il est dilaté', 'Il est multiplié par le retard'],
  expl: R`$x(t-t_0) \to X(f)e^{-j2\pi f t_0}$ et $|e^{-j2\pi f t_0}| = 1$. Ne pas confondre avec la modulation, qui décale le spectre.` },

{ theme: 'fourier', type: 'theorie', tps: ['p1'],
  q: 'Pourquoi un cosinus réel donne-t-il deux raies, en +f₀ et −f₀ ?',
  choix: [R`Parce que $\cos\theta = \frac12(e^{j\theta} + e^{-j\theta})$ : deux exponentielles complexes de fréquences opposées`, 'Parce que le cosinus est périodique', 'C’est une erreur de calcul classique', 'Parce que le spectre est toujours symétrique pour tout signal'],
  expl: 'Chaque exponentielle complexe donne une seule raie. Le spectre bilatéral montre les deux ; le spectre unilatéral les regroupe en une raie de hauteur A.' },

{ theme: 'fourier', type: 'theorie', tps: ['p1'],
  q: 'Que fait au spectre la multiplication par cos(2πf₀t) (modulation) ?',
  choix: ['Elle recopie le spectre autour de +f₀ et −f₀, avec un facteur 1/2', 'Elle le décale seulement vers +f₀', 'Elle le comprime d’un facteur f₀', 'Elle ne change que la phase'],
  expl: R`Produit en temps ⟺ convolution en fréquence avec $\frac12[\delta(f-f_0)+\delta(f+f_0)]$.` },

{ theme: 'echant', type: 'theorie', tps: ['p2'],
  q: 'Que modélise le peigne de Dirac dans le cours ?',
  choix: ['L’échantillonnage idéal : prélever le signal tous les Te', 'Un filtre passe-bas idéal', 'Un bruit blanc', 'Le bloqueur d’ordre zéro'],
  expl: R`$x_e(t) = x(t)\cdot\text{Ш}_{T_e}(t)$. Sa TF est aussi un peigne, ce qui explique la recopie du spectre.` },

{ theme: 'echant', type: 'theorie', tps: ['p2'],
  q: 'Vu en fréquence, que fait l’interpolateur idéal de Shannon ?',
  choix: ['C’est un passe-bas idéal de coupure fe/2 qui garde la copie centrale du spectre', 'Il recopie le spectre tous les fe', 'Il décale le spectre de fe/2', 'Il supprime la composante continue'],
  expl: R`Gain $T_e$ sur $[-f_e/2, f_e/2]$, zéro ailleurs. Si Shannon est respecté, la copie centrale est exactement $X(f)$.` },

{ theme: 'echant', type: 'theorie', tps: ['p2'],
  q: 'Après un repliement, peut-on retrouver la fréquence d’origine en analysant le spectre ?',
  choix: ['Non, sans information supplémentaire c’est impossible', 'Oui, avec une FFT plus longue', 'Oui, avec un interpolateur de Shannon', 'Oui, en augmentant fe après coup'],
  expl: 'Plusieurs fréquences d’origine donnent exactement les mêmes échantillons. L’information est perdue au moment de l’échantillonnage.' },

{ theme: 'echant', type: 'theorie', tps: ['p2'],
  q: 'Dans fe > 2B, que désigne B ?',
  choix: ['La plus haute fréquence présente dans le signal', 'La fréquence où le spectre est maximal', 'La largeur du filtre de reconstruction', 'La fréquence fondamentale'],
  expl: 'Un signal à 1 kHz avec une harmonique à 3,5 kHz a B = 3,5 kHz : c’est elle qui impose fe > 7 kHz.' },

{ theme: 'discret', type: 'theorie', tps: ['p3'],
  q: 'Quelle différence entre l’impulsion de Kronecker δ(n) et le Dirac δ(t) ?',
  choix: ['δ(n) vaut vraiment 1 en n = 0 ; δ(t) est une distribution d’aire 1', 'Aucune, c’est la même chose', 'δ(n) a une aire infinie', 'δ(t) n’existe qu’en discret'],
  expl: 'Le Kronecker est une suite ordinaire, sans difficulté mathématique.' },

{ theme: 'discret', type: 'theorie', tps: ['p3'],
  q: 'Qu’a de particulier une sinusoïde discrète par rapport à une sinusoïde continue ?',
  choix: ['Elle n’est périodique que si f₀/fe est rationnel', 'Elle est toujours périodique', 'Elle n’a pas de fréquence', 'Elle ne peut pas être négative'],
  expl: R`Il faut un nombre entier d'échantillons par nombre entier de tours. $\cos(0{,}5n)$ n'est jamais périodique.` },

{ theme: 'filtres', type: 'theorie', tps: ['p3'],
  q: 'Pourquoi la réponse impulsionnelle h(n) caractérise-t-elle entièrement un filtre (linéaire invariant) ?',
  choix: ['Toute entrée est une somme d’impulsions décalées, donc la sortie est y = x * h', 'Parce qu’elle donne la stabilité', 'Parce qu’elle est toujours finie', 'Parce qu’elle est égale à H(z)'],
  expl: R`$x(n) = \sum_k x(k)\delta(n-k)$ ; par linéarité et invariance, $y(n) = \sum_k x(k)h(n-k)$.` },

{ theme: 'tfd', type: 'theorie', tps: ['p3'],
  q: 'Dans une TFD, que fixe le nombre de points N (à fe donnée) ?',
  choix: [R`La durée observée $NT_e$ et la résolution $\Delta f = f_e/N$`, 'La bande observable [−fe/2, fe/2]', 'La fréquence de Nyquist', 'Le nombre d’harmoniques du signal'],
  expl: R`C'est $f_e$ qui fixe la bande ; $N$ fixe la finesse de la grille en fréquence.` },

{ theme: 'tfd', type: 'theorie', tps: ['p3'],
  q: 'Dans le résultat d’une TFD de N points, que représentent les indices k > N/2 ?',
  choix: ['Les fréquences négatives (la périodicité du spectre les ramène là)', 'Des fréquences supérieures à fe', 'Du bruit numérique', 'Rien, ce sont des zéros'],
  expl: R`$X[k] = X[k-N]$ : la case $k$ correspond aussi à la fréquence $(k-N)f_e/N \lt 0$.` },

{ theme: 'tfd', type: 'theorie', tps: ['p3'],
  q: 'Pourquoi utilise-t-on la TFD plutôt que la TFtd sur ordinateur ?',
  choix: ['La TFtd est une fonction continue de f sur une suite infinie ; la TFD ne demande que N valeurs finies', 'La TFD est plus précise', 'La TFtd n’existe pas pour les signaux réels', 'La TFD ne présente pas de repliement'],
  expl: 'Un ordinateur ne manipule que des vecteurs finis : on observe N points et on calcule N valeurs de spectre.' },

{ theme: 'filtres', type: 'theorie', tps: ['p3'],
  q: 'Quel effet a un zéro placé sur le cercle unité en z = e^{j2πf₀/fe} ?',
  choix: ['Il annule complètement la fréquence f₀ en sortie', 'Il rend le filtre instable', 'Il amplifie fortement f₀', 'Aucun effet sur le gain'],
  expl: R`$|H(f_0)| = 0$. Ex. zéro en $z = 1$ → $f = 0$ supprimé (passe-haut) ; zéro en $z = -1$ → $f_e/2$ supprimé (passe-bas).` },

{ theme: 'filtres', type: 'theorie', tps: ['p3'],
  q: 'Que se passe-t-il quand un pôle se rapproche du cercle unité (tout en restant dedans) ?',
  choix: ['Le gain devient très grand près de la fréquence correspondante, et la réponse devient lente', 'Le filtre devient RIF', 'Le gain s’annule à cette fréquence', 'Rien de visible'],
  expl: R`Pour $y(n) = a\,y(n-1)+x(n)$ avec $a \to 1$ : $H(0) = \frac{1}{1-a}$ explose et $a^n$ décroît très lentement.` },

{ theme: 'filtres', type: 'theorie', tps: ['p3'],
  q: 'Qu’est-ce que la réponse indicielle d’un filtre ?',
  choix: ['La sortie quand l’entrée est l’échelon u(n) : la somme cumulée de h(n)', 'La sortie quand l’entrée est δ(n)', 'Le module de H(f)', 'La liste des pôles'],
  expl: R`$s(n) = \sum_{k \le n} h(k)$. Sa limite est le gain en continu $H(1)$, si le filtre est stable.` }
  ];

  const LEXIQUE = [
    ['Aliasing', 'Voir repliement spectral.'],
    ['Amplitude', R`Hauteur maximale d'une sinusoïde ($A$ dans $A\cos(2\pi f_0t+\varphi)$).`],
    ['Bloqueur d’ordre zéro (BOZ)', 'Interpolateur qui maintient chaque échantillon pendant Te : sortie en escalier.'],
    ['Causal', R`Signal nul pour $t \lt 0$ ; système qui n'utilise pas d'entrées futures.`],
    ['Cercle unité', R`Les $z$ de module 1 dans le plan complexe. Pôles à l'intérieur = filtre causal stable.`],
    ['Composante continue', R`Valeur moyenne d'un signal ($A_0$ dans la série de Fourier), raie en $f = 0$.`],
    ['Convolution', R`Opération $x*h$ qui donne la sortie d'un filtre de réponse impulsionnelle $h$.`],
    ['Dirac δ(t)', 'Impulsion infiniment brève d’aire 1 (une distribution). Dessinée par une flèche.'],
    ['Échantillonnage', 'Relever la valeur d’un signal toutes les Te secondes.'],
    ['Énergie', R`$\sum |x(n)|^2$ (ou $\int |x(t)|^2dt$). Finie pour un signal qui s'éteint.`],
    ['Équation aux différences', 'Formule qui calcule y(n) à partir des entrées et sorties précédentes.'],
    ['Fe, Te', R`Fréquence et période d'échantillonnage : $f_e = 1/T_e$.`],
    ['FFT', 'Algorithme rapide qui calcule exactement la TFD.'],
    ['Filtre anti-repliement', 'Passe-bas analogique placé avant l’échantillonneur pour couper au-delà de fe/2.'],
    ['Fonction de transfert H(z)', 'Rapport Y(z)/X(z) : décrit complètement un filtre numérique.'],
    ['Fréquence normalisée ν', R`$\nu = f/f_e$, en cycles par échantillon. Le spectre est périodique de période 1.`],
    ['Fréquence de Nyquist', R`$f_e/2$ : la plus haute fréquence représentable sans repliement.`],
    ['Harmonique', R`Composante à $n f_0$ dans la série de Fourier d'un signal périodique.`],
    ['Interpolation', 'Reconstruire un signal continu à partir de ses échantillons.'],
    ['Kronecker δ(n)', 'Suite qui vaut 1 en n = 0 et 0 ailleurs.'],
    ['Passe-bas / passe-haut / passe-bande', 'Filtre qui garde respectivement les basses, les hautes, ou une bande de fréquences.'],
    ['Peigne de Dirac', 'Suite de Dirac régulièrement espacés : modèle de l’échantillonnage idéal.'],
    ['Phase', R`Décalage d'une sinusoïde ($\varphi$) ; argument d'un spectre complexe.`],
    ['Pôle', 'Racine du dénominateur de H(z). Décide de la stabilité.'],
    ['Puissance moyenne', 'Énergie moyenne par unité de temps. Finie et non nulle pour un signal périodique.'],
    ['Réponse fréquentielle', R`$H(f)$ : gain et déphasage du filtre à chaque fréquence.`],
    ['Réponse impulsionnelle', 'Sortie du filtre quand l’entrée est δ(n). Notée h(n).'],
    ['Réponse indicielle', 'Sortie du filtre quand l’entrée est l’échelon u(n).'],
    ['Repliement spectral', 'Si fe ≤ 2B, les copies du spectre se chevauchent : une fréquence se fait passer pour une autre.'],
    ['Résolution fréquentielle', R`Écart entre deux cases de la TFD : $\Delta f = f_e/N = 1/(NT_e)$.`],
    ['RIF', 'Filtre à Réponse Impulsionnelle Finie : sans rétroaction, toujours stable.'],
    ['RII', 'Filtre à Réponse Impulsionnelle Infinie : récursif, stabilité à vérifier.'],
    ['Série de Fourier', 'Écriture d’un signal périodique comme somme de cosinus aux multiples de f₀.'],
    ['Shannon (théorème)', R`Reconstruction exacte possible si $f_e \gt 2B$.`],
    ['Sinus cardinal', R`$\mathrm{sinc}(t) = \frac{\sin \pi t}{\pi t}$ ; TF de la porte.`],
    ['Spectre', 'Représentation d’un signal en fonction de la fréquence (amplitude et phase).'],
    ['Stabilité', 'Toute entrée bornée donne une sortie bornée.'],
    ['TF', 'Transformée de Fourier d’un signal continu apériodique : spectre continu.'],
    ['TFD', 'Transformée de Fourier discrète : N échantillons → N valeurs de spectre.'],
    ['TFtd', 'Transformée de Fourier à temps discret : spectre continu et périodique (période fe) d’une suite.'],
    ['Transformée en Z', R`$X(z) = \sum x(n)z^{-n}$. Un retard devient une multiplication par $z^{-1}$.`],
    ['Zéro', 'Racine du numérateur de H(z). Un zéro sur le cercle unité annule une fréquence.']
  ];

  MATIERES.push({
    id: 'tns',
    nom: 'Traitement numérique du signal',
    sousTitre: 'TNS · Signaux & filtres',
    description: 'Signaux continus et Fourier, échantillonnage et repliement, signaux discrets, TFtd/TFD/FFT et filtres RIF/RII — d’après le cours de S. Miron, les TD 1 à 4 et le TP 3.',
    couleur: '#0e8a9a',
    filtreLabel: 'Toutes les parties',
    ressources: [
      { titre: 'Table des TF (PDF)', href: 'pdf/tables/table-TF.pdf', fiche: 'tf-paires' },
      { titre: 'Table des transformées en Z (PDF)', href: 'pdf/tables/table-TZ.pdf', fiche: 'table-tz' }
    ],
    parties: true,
    partiesInfo: {
      p1: { titre: 'Signaux continus & Fourier', couleur: '#3b6fd8', desc: 'Signaux de base, décalage et échelle, convolution, séries de Fourier, transformée de Fourier et ses propriétés. Cours 1 · TD 1.' },
      p2: { titre: 'Échantillonnage & interpolation', couleur: '#d4730b', desc: 'Peigne de Dirac, Shannon, repliement, anti-repliement, interpolateur de Shannon, BOZ, son numérique. Cours 2 · TD 2 · TP 3.' },
      p3: { titre: 'Signaux discrets, TFtd/TFD & filtres', couleur: '#1a8a5a', desc: 'Suites, opérations, convolution discrète, TFtd, TFD, FFT, H(z), stabilité, filtres RIF et RII. Cours 3 · TD 3 · TD 4.' }
    },
    pratiqueLabel: 'Pratique (calculs, graphes, Matlab)',
    themes: THEMES, tps: TPS, tpsCourt: TPS_COURT, fiches: FICHES, qcm: QCM, lexique: LEXIQUE
  });
})();
