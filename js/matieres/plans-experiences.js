/*
 * Matière : Plans d'Expériences (DoE — Design of Experiments), T. Bastogne, Polytech Nancy.
 * Source : cours « Lecture 0 — Introduction ».
 * Fil rouge concret repris dans les fiches : impression 3D — maximiser la résistance d'une pièce.
 * Les textes passent par R`...` (String.raw) pour garder le LaTeX intact : $...$ en ligne, $$...$$ centré.
 */
(function () {
  const THEMES = {
    intro:   { nom: 'Introduction',      couleur: '#3b6fd8' },
    vocab:   { nom: 'Terminologie',      couleur: '#8250df' },
    modele:  { nom: 'Modèle & erreurs',  couleur: '#0e8a9a' },
    but:     { nom: 'Objectifs',         couleur: '#d4730b' },
    methode: { nom: 'Méthode',           couleur: '#1a8a5a' },
    exemple: { nom: 'Fil rouge',         couleur: '#b83280' }
  };

  const TPS = {};

  // Petit encadré « exemple concret », réutilisé partout.
  const ex = t => `<div class="box b-tp"><strong>Concrètement</strong>${t}</div>`;

  // Schéma SVG du modèle Y = ŷ + E (currentColor s'adapte au thème clair/sombre).
  const SCHEMA_MODELE = R`
<figure class="fig"><svg viewBox="0 0 560 190" role="img" aria-label="Schéma du modèle : facteurs vers système et modèle, comparaison des réponses donnant les résidus" style="width:100%;height:auto">
  <style>
    .dg-box{fill:none;stroke:currentColor;stroke-width:1.6}
    .dg-t{fill:currentColor;font:600 13px Inter,sans-serif}
    .dg-s{fill:currentColor;font:12px Inter,sans-serif;opacity:.75}
    .dg-l{stroke:currentColor;stroke-width:1.4;fill:none;marker-end:url(#pe-ar)}
    .dg-a{fill:#b83280;font:700 13px Inter,sans-serif}
  </style>
  <defs><marker id="pe-ar" markerWidth="9" markerHeight="9" refX="7" refY="3" orient="auto"><path d="M0,0 L7,3 L0,6 z" fill="currentColor"/></marker></defs>
  <text x="14" y="62" class="dg-t">facteurs</text><text x="14" y="78" class="dg-s">u</text>
  <text x="14" y="140" class="dg-t">facteurs</text><text x="14" y="156" class="dg-s">u</text>
  <line x1="62" y1="66" x2="128" y2="66" class="dg-l"/>
  <line x1="62" y1="144" x2="128" y2="144" class="dg-l"/>
  <rect x="130" y="44" width="150" height="44" rx="6" class="dg-box"/>
  <text x="150" y="70" class="dg-t">Système réel</text>
  <rect x="130" y="122" width="150" height="44" rx="6" class="dg-box"/>
  <text x="150" y="148" class="dg-t">Modèle M(p,u)</text>
  <line x1="280" y1="66" x2="360" y2="66" class="dg-l"/><text x="300" y="58" class="dg-a">Y</text>
  <line x1="280" y1="144" x2="360" y2="144" class="dg-l"/><text x="296" y="138" class="dg-a">ŷ</text>
  <circle cx="378" cy="105" r="20" class="dg-box"/><text x="371" y="110" class="dg-t">−</text>
  <line x1="360" y1="66" x2="372" y2="90" class="dg-l"/>
  <line x1="360" y1="144" x2="372" y2="120" class="dg-l"/>
  <line x1="398" y1="105" x2="470" y2="105" class="dg-l"/>
  <text x="486" y="101" class="dg-a">E</text><text x="474" y="120" class="dg-s">résidus</text>
</svg><figcaption>Le plan compare la réponse mesurée $Y$ et la réponse du modèle $\hat y$ : l'écart est l'erreur $E$.</figcaption></figure>`;

  // Schéma SVG du cycle de vie (boucle avec retour « invalidation »).
  const SCHEMA_CYCLE = R`
<figure class="fig"><svg viewBox="0 0 560 150" role="img" aria-label="Cycle de vie d'un plan d'expériences, de la question à la réponse, avec retour en cas d'invalidation" style="width:100%;height:auto">
  <style>
    .cy-box{fill:none;stroke:currentColor;stroke-width:1.6}
    .cy-t{fill:currentColor;font:600 12px Inter,sans-serif}
    .cy-l{stroke:currentColor;stroke-width:1.4;fill:none;marker-end:url(#pe-ar2)}
    .cy-d{stroke:#b83280;stroke-width:1.4;fill:none;stroke-dasharray:5 4;marker-end:url(#pe-ar3)}
    .cy-a{fill:#b83280;font:700 11px Inter,sans-serif}
  </style>
  <defs>
    <marker id="pe-ar2" markerWidth="9" markerHeight="9" refX="7" refY="3" orient="auto"><path d="M0,0 L7,3 L0,6 z" fill="currentColor"/></marker>
    <marker id="pe-ar3" markerWidth="9" markerHeight="9" refX="7" refY="3" orient="auto"><path d="M0,0 L7,3 L0,6 z" fill="#b83280"/></marker>
  </defs>
  ${['Question ?', 'Spécification', 'Conception', 'Expérimentation', 'Réponse'].map((s, i) => {
    const x = 8 + i * 112;
    return `<rect x="${x}" y="52" width="98" height="38" rx="6" class="cy-box"/><text x="${x + 49}" y="75" text-anchor="middle" class="cy-t">${s}</text>` +
      (i < 4 ? `<line x1="${x + 98}" y1="71" x2="${x + 112}" y2="71" class="cy-l"/>` : '');
  }).join('')}
  <path d="M 395 52 C 360 18, 120 18, 90 50" class="cy-d"/>
  <text x="200" y="26" class="cy-a">invalidation → on reboucle</text>
</svg></figure>`;

  const FICHES = [

  /* ===================================================== INTRODUCTION */
  {
    id: 'doe-cest-quoi', theme: 'intro', tps: [],
    titre: 'Un plan d\'expériences, c\'est quoi ?',
    resume: 'Un tableau : les colonnes sont les facteurs à tester, les lignes sont les expériences à faire.',
    corps: R`
${idee(R`<p>Un <b>plan d'expériences</b> (<i>Design of Experiments</i>, DoE) est un <b>tableau</b> :</p>
<ul><li>une <b>colonne par facteur</b> à tester (ce qu'on fait varier) ;</li>
<li>une <b>ligne par expérience</b> (ou <i>essai</i>) à réaliser.</li></ul>
<p>On le prépare <b>à l'avance</b>, avant de toucher à la moindre manip.</p>`)}
${ex(R`<p><b>Fil rouge — impression 3D.</b> On veut une pièce plastique la plus <b>résistante</b> possible. Trois réglages à tester : température de la buse, vitesse, taux de remplissage. Le plan tient en quelques lignes :</p>
${table(['Essai', 'Temp. (°C)', 'Vitesse (mm/s)', 'Remplissage'], [
  ['1', '200', '40', '20 %'], ['2', '220', '40', '60 %'], ['3', '200', '60', '60 %'], ['4', '220', '60', '20 %']
])}
<p>4 impressions bien choisies au lieu de tester « au hasard » pendant des jours.</p>`)}
${retenir(R`<p>But du DoE : tirer des conclusions <b>justes et précises</b>, <b>en minimisant le nombre d'essais</b> $n$ (chaque essai coûte du temps et de la matière).</p>`)}
${piege(R`<p>« Pas de plan, pas de chocolat ! » — sans plan construit à l'avance, les données risquent de ne rien prouver.</p>`)}
`
  },
  {
    id: 'stats-mensonge', theme: 'intro', tps: [],
    titre: 'Les statistiques et le piège des données',
    resume: 'Les statistiques répondent à une question ; mais des données mal recueillies peuvent mentir.',
    corps: R`
${idee(R`<p>La <b>statistique</b> est la science qui consiste à <b>recueillir et analyser</b> des données pour répondre à une <b>question posée d'avance</b>.</p>`)}
${piege(R`<p>Le problème : <b>les données peuvent mentir</b>. Mal recueillies, elles introduisent des <b>confusions</b> (effets mélangés) et <b>biaisent</b> les conclusions.</p>`)}
${ex(R`<p>En 3D : si on augmente la température <b>en même temps</b> que le remplissage d'un essai à l'autre, et que la pièce est plus solide, on ne sait pas <b>lequel des deux</b> a agi : les deux effets sont <b>confondus</b>. Un bon plan les sépare.</p>`)}
${retenir(R`<p>Motivation du DoE : des conclusions <b>non biaisées</b> et <b>précises</b>, grâce à un <b>bon plan</b> choisi avant de mesurer.</p>`)}
`
  },
  {
    id: 'fisher', theme: 'intro', tps: [],
    titre: 'Les origines : R. A. Fisher',
    resume: 'Les méthodes modernes viennent des essais agricoles de Fisher (années 1920-30).',
    corps: R`
${idee(R`<p>Les méthodes modernes de plans d'expériences viennent des travaux de <b>R. A. Fisher</b> sur les <b>expériences agricoles</b> :</p>
<ul><li><i>The Arrangement of Field Experiments</i> (1926) ;</li>
<li><i>The Design of Experiments</i> (1935).</li></ul>`)}
${ex(R`<p>Problème de Fisher : comparer des <b>engrais</b> sur des parcelles de champ. Mais le sol n'est pas homogène (un coin plus humide, mieux exposé…). Sa trouvaille : <b>répartir et randomiser</b> les traitements sur les parcelles pour que ces différences de terrain <b>s'équilibrent</b> au lieu de fausser la comparaison.</p>`)}
${retenir(R`<p>Objectifs de Fisher, toujours valables :</p>
<ul><li>détecter <b>cause → effet</b> avec <b>le minimum d'essais</b> ;</li>
<li><b>éliminer</b> au maximum la variation naturelle ;</li>
<li><b>empêcher</b> la variation résiduelle de <b>biaiser</b> les effets.</li></ul>`)}
`
  },

  /* ===================================================== TERMINOLOGIE */
  {
    id: 'facteur-reponse-effet', theme: 'vocab', tps: [],
    titre: 'Facteur, réponse, effet',
    resume: 'Les 3 mots de base : ce qu\'on règle (facteur), ce qu\'on mesure (réponse), ce qui change (effet).',
    corps: R`
${table(['Terme', 'Noté', 'Définition'], [
  ['Facteur (variable indépendante)', '$U$', 'Variable qu\'on <b>contrôle</b> à des niveaux fixés, qu\'on fait varier <b>systématiquement</b> d\'un essai à l\'autre.'],
  ['Réponse (variable dépendante)', '$Y$', 'Caractéristique de l\'unité <b>mesurée après chaque essai</b>.'],
  ['Effet', '—', 'Le <b>changement de la réponse</b> causé par un changement d\'un facteur.']
])}
${ex(R`<p>En 3D : <b>facteurs</b> = température, vitesse, remplissage. <b>Réponse</b> = résistance à la traction (en N). <b>Effet</b> de la température = « +18 N quand on passe de 200 à 220 °C ».</p>`)}
${retenir(R`<p>On distingue l'<b>effet calculé</b> (estimé des données) de l'<b>effet pratique</b> : la taille d'effet jugée <b>importante</b>, fixée <b>avant</b> les essais (ex. « +10 N, en-dessous ça ne vaut pas le coup »).</p>`)}
`
  },
  {
    id: 'unite-latente', theme: 'vocab', tps: [],
    titre: 'Essai, unité expérimentale, variable latente',
    resume: 'Sur quoi on agit (unité), ce qu\'on fait (essai), et la variable cachée qu\'on ne contrôle pas.',
    corps: R`
${idee(R`<p><b>Essai</b> (<i>run</i>) : une action où l'expérimentateur <b>change au moins une variable</b> étudiée, puis <b>observe</b> les effets.</p>`)}
${table(['Terme', 'Définition'], [
  ['Unité expérimentale', 'L\'<b>item étudié</b> sur lequel on change quelque chose ; stimulable <b>indépendamment</b> des autres.'],
  ['Sous-unité', 'Quand on découpe une unité. Mesures <b>corrélées</b> → à <b>moyenner</b> avant analyse.'],
  ['Variable latente (<i>lurking</i>, $Z$)', 'Variable <b>non contrôlée</b> qui peut agir sur le résultat.']
])}
${ex(R`<p>En 3D : l'<b>unité</b> = une éprouvette imprimée. Une <b>sous-unité</b> = un morceau découpé dedans pour un 2ᵉ test. Les <b>variables latentes</b> : humidité du filament (le PLA boit l'eau de l'air), température de l'atelier, usure de la buse — on ne les règle pas, mais elles jouent.</p>`)}
${retenir(R`<p>Dans un bon plan, l'effet des variables latentes doit <b>s'équilibrer</b> (grâce à la randomisation) pour <b>ne pas fausser</b> la conclusion.</p>`)}
`
  },
  {
    id: 'replicate-repeated', theme: 'vocab', tps: [],
    titre: 'Replicate vs repeated : ne pas confondre',
    resume: 'Répéter sur des unités différentes (replicate) ≠ remesurer la même unité (repeated).',
    corps: R`
${table(['Type', 'Ce que c\'est', 'Traitement'], [
  ['<b>Replicate runs</b>', 'Mêmes réglages, mais <b>unités expérimentales différentes</b>.', 'Vraies répétitions : estiment la variance de l\'erreur.'],
  ['<b>Repeated runs</b>', 'Plusieurs mesures de la <b>même unité</b> lors d\'un essai.', '<b>À moyenner</b> — ce n\'est <b>pas</b> plusieurs réponses séparées.']
])}
${ex(R`<p>En 3D : imprimer <b>3 éprouvettes</b> aux mêmes réglages = 3 <b>replicates</b> (3 unités → on voit la dispersion réelle). Passer <b>3 fois</b> la <b>même</b> éprouvette dans la machine de traction = 3 <b>repeated</b> → on les <b>moyenne</b> en une seule valeur.</p>`)}
${piege(R`<p>Compter des <i>repeated</i> comme 3 essais indépendants fait croire qu'on a plus d'information qu'en vrai → variance <b>sous-estimée</b>, conclusions trop sûres.</p>`)}
`
  },

  /* ===================================================== MODÈLE & ERREURS */
  {
    id: 'modele-y', theme: 'modele', tps: [],
    titre: 'Le modèle derrière tout DoE',
    resume: 'Toute réponse se décompose : partie expliquée par le modèle + erreur.',
    corps: R`
${idee(R`<p>Derrière chaque plan il y a un <b>modèle</b> reliant les entrées (facteurs) $u$ à la sortie (réponse) $Y$. Dans tout ce cours il s'écrit :</p>
$$Y = \hat{y} + E \qquad \hat{y} = M(p, u)$$`)}
${SCHEMA_MODELE}
${table(['Terme', 'Sens'], [
  ['$\\hat{y}$', 'Partie de la réponse <b>expliquée</b> par le modèle $M(\\cdot)$.'],
  ['$E$', 'L\'<b>erreur</b> (ce que le modèle n\'explique pas).'],
  ['$p$', 'Les <b>paramètres</b> du modèle (inconnus, à estimer).']
])}
${ex(R`<p>En 3D on pose un modèle simple : $\hat y = p_0 + p_1\,\text{temp} + p_2\,\text{vitesse} + p_3\,\text{rempl.}$ Chaque $p_i$ est l'<b>effet</b> d'un facteur. $E$ = tout le reste (humidité, usure, hasard).</p>`)}
${retenir(R`<p>Deux sources de hasard : <b>$V$</b> = bruit de <b>mesure</b> (la machine de traction), et <b>$B$</b> = incertitude sur les <b>paramètres</b> du modèle.</p>`)}
`
  },
  {
    id: 'moindres-carres', theme: 'modele', tps: [],
    titre: 'Estimer les paramètres : moindres carrés',
    resume: 'Les paramètres sont inconnus : on les estime par moindres carrés ordinaires (OLS).',
    corps: R`
${idee(R`<p>Les paramètres $p$ sont <b>inconnus</b> : on les <b>estime</b> à partir des mesures de $u$ et $Y$ faites pendant les essais.</p>`)}
${methode(R`<p>Dans ce cours on utilise les <b>moindres carrés ordinaires</b> (<i>ordinary least squares</i>), qui minimisent la somme des écarts² entre mesures et modèle. Solution :</p>
$$\hat{p} = \left( X^\top X \right)^{-1} X^\top Y$$
<p>où $X$ est la matrice construite à partir du plan (les réglages des facteurs) et $Y$ le vecteur des réponses mesurées.</p>`)}
${ex(R`<p>En 3D : $Y$ = les résistances mesurées des 4 essais, $X$ = le tableau des réglages. Le calcul sort les $\hat p_i$, donc l'<b>effet chiffré</b> de chaque facteur. C'est ce que fait un logiciel (R, Minitab, Python) en une ligne.</p>`)}
`
  },
  {
    id: 'erreur-biais-aleatoire', theme: 'modele', tps: [],
    titre: 'Erreur expérimentale : biais vs aléatoire',
    resume: 'L\'écart à la moyenne long terme se sépare en une part systématique (biais) et une part aléatoire.',
    corps: R`
${idee(R`<p>L'<b>erreur expérimentale</b> est l'écart entre la réponse <b>observée</b> à un essai et la <b>moyenne sur le long terme</b> aux mêmes réglages. Jamais nulle (les variables de fond la font varier). On la modélise par :</p>
$$E \sim \mathcal{N}(0, \sigma^2)$$`)}
${table(['Type d\'erreur', 'Comportement', 'Formule'], [
  ['<b>Biais</b> (<i>bias</i>)', 'Reste <b>constant</b> ou varie de façon <b>systématique</b>.', '$\\text{biais} = \\mathbb{E}\\{E\\}$'],
  ['<b>Aléatoire</b> (<i>random</i>)', 'Change de façon <b>imprévisible</b>, de <b>moyenne nulle</b>.', '$\\sigma^2 = \\text{Var}\\{E\\}$']
])}
${ex(R`<p>En 3D : une machine de traction mal étalonnée qui lit toujours <b>+5 N</b> = <b>biais</b> (fausse toutes les mesures du même côté). Les petites différences inévitables d'une éprouvette à l'autre = erreur <b>aléatoire</b>. On repère l'ampleur de l'aléatoire avec des <b>replicates</b>.</p>`)}
${piege(R`<p>On corrige un <b>biais</b> en étalonnant / changeant la méthode ; on ne le réduit <b>pas</b> en répétant. À l'inverse, répéter réduit l'incertitude <b>aléatoire</b>.</p>`)}
`
  },

  /* ===================================================== OBJECTIFS */
  {
    id: 'deux-objectifs', theme: 'but', tps: [],
    titre: 'Les deux objectifs d\'un plan',
    resume: 'Maximiser l\'info en minimisant n : soit précision des paramètres, soit précision de la prédiction.',
    corps: R`
${idee(R`<p>Un plan vise le <b>maximum d'information</b> en <b>minimisant $n$</b> (le nombre d'essais). Selon l'application, deux objectifs :</p>`)}
${table(['Objectif', 'On minimise', 'Pour…'], [
  ['Précision des <b>paramètres</b>', '$\\text{Var}(\\hat{p})$', 'bien estimer les coefficients (effets).'],
  ['Précision de la <b>prédiction</b>', '$\\text{Var}(\\hat{y})$', 'bien prédire la réponse à un réglage.']
])}
${ex(R`<p>En 3D : si la question est « <b>quel facteur compte</b> ? » on veut des $\hat p_i$ précis → minimiser $\text{Var}(\hat p)$. Si c'est « <b>quelle résistance</b> pour tel réglage ? » on veut une bonne prédiction → minimiser $\text{Var}(\hat y)$.</p>`)}
`
  },
  {
    id: 'deux-applications', theme: 'but', tps: [],
    titre: 'Deux applications : screening et optimisation',
    resume: 'Trouver les facteurs qui comptent (test d\'hypothèse) ou régler pour optimiser la réponse.',
    corps: R`
${table(['Application', 'On examine', 'Formalisation'], [
  ['① Identifier les <b>sources de variabilité</b> (<i>screening</i>)', 'le coefficient $B$', '$\\begin{cases} H_0 : B = 0 \\\\ H_1 : B \\neq 0 \\end{cases}$'],
  ['② Relation <b>cause → effet</b> pour l\'<b>optimisation</b>', 'la réponse $\\hat{y}$', '$u^\\star = \\arg\\min\\limits_{u \\in U} f_w\\big(y - \\hat{y}(b, u)\\big)$']
])}
${ex(R`<p>En 3D, dans l'ordre : ① <b>screening</b> — « la <b>vitesse</b> a-t-elle un effet, ou est-ce négligeable ? » (on teste $B=0$). Si non, on la fige. ② <b>optimisation</b> — parmi les facteurs qui comptent, trouver le réglage $u^\star$ qui <b>maximise</b> la résistance.</p>`)}
${retenir(R`<p>① = « <b>quels facteurs comptent ?</b> » ; ② = « <b>quel réglage est le meilleur ?</b> ». On fait souvent ① avant ② pour ne pas gaspiller d'essais sur des facteurs inutiles.</p>`)}
`
  },
  {
    id: 'demarche-scientifique', theme: 'but', tps: [],
    titre: 'La démarche scientifique du DoE',
    resume: 'Observer → conjecturer → expérimenter → analyser, en boucle jusqu\'à la connaissance.',
    corps: R`
${methode(R`<ol><li><b>Observer</b> l'état de la nature.</li>
<li><b>Conjecturer</b> (hypothèse) sur le mécanisme.</li>
<li><b>Concevoir</b> les expériences et <b>collecter</b> les données.</li>
<li><b>Analyser</b> pour <b>confirmer ou rejeter</b>.<br>→ confirmée = <b>connaissance</b> ; sinon, <b>retour à l'étape 2</b>.</li></ol>`)}
${ex(R`<p>En 3D : on <b>observe</b> que certaines pièces cassent vite → on <b>conjecture</b> « plus chaud = mieux soudé = plus solide » → on <b>conçoit</b> le plan et on imprime → on <b>analyse</b> : si confirmé, on tient une règle ; sinon, nouvelle hypothèse (peut-être c'est le remplissage, pas la température).</p>`)}
${retenir(R`<p>Avantage de l'<b>expérimentation</b> sur la simple <b>observation</b> : on conçoit les essais pour <b>minimiser les effets confondants</b> → conclusions plus précises.</p>`)}
`
  },

  /* ===================================================== MÉTHODE */
  {
    id: 'planifier-11-etapes', theme: 'methode', tps: [],
    titre: 'Planifier un plan : les 11 étapes',
    resume: 'La check-list complète, des objectifs au budget, pour construire un plan qui marche.',
    corps: R`
${methode(R`<ol>
<li><b>Définir les objectifs</b> : screening ou relation cause-effet (prédiction, optimisation, mélange) ?</li>
<li><b>Identifier les unités expérimentales</b> : l'item sur lequel on change quelque chose.</li>
<li><b>Définir une réponse</b> utile et <b>mesurable</b>.</li>
<li><b>Lister les variables</b> indépendantes et latentes (diagramme d'<b>Ishikawa</b>, les <b>5M</b>).</li>
<li><b>Essais pilotes</b> : vérifier qu'on contrôle les facteurs et qu'on sait mesurer.</li>
<li><b>Diagramme de flux</b> de la procédure de chaque essai.</li>
<li><b>Choisir le plan</b> adapté aux objectifs (choisir d'abord le modèle d'analyse).</li>
<li><b>Nombre de replicates</b> : assez pour détecter un effet d'intérêt pratique.</li>
<li><b>Randomiser</b> l'affectation des conditions aux unités.</li>
<li><b>Décrire la méthode d'analyse</b> des données.</li>
<li><b>Planning & budget</b> (diagramme de <b>Gantt</b>).</li>
</ol>`)}
${piege(R`<p>Causes n°1 d'échec : <b>ne pas savoir mesurer</b> la réponse précisément, ou <b>ne pas contrôler</b> les niveaux des facteurs. D'où les essais pilotes (étape 5).</p>`)}
`
  },
  {
    id: 'randomisation', theme: 'methode', tps: [],
    titre: 'Randomiser : pourquoi c\'est vital',
    resume: 'Tirer l\'ordre des essais au hasard neutralise les variables cachées qui dérivent dans le temps.',
    corps: R`
${idee(R`<p><b>Randomiser</b> = affecter <b>au hasard</b> l'ordre des essais (et l'affectation des conditions aux unités), au lieu de les faire dans un ordre « bien rangé ».</p>`)}
${ex(R`<p>En 3D : si on imprime <b>d'abord</b> tous les essais à 200 °C le matin, <b>puis</b> ceux à 220 °C l'après-midi, la <b>buse s'use</b> et l'<b>atelier se réchauffe</b> au fil de la journée. L'effet « température » se retrouve <b>confondu</b> avec l'usure et l'heure (des variables latentes). En tirant l'ordre au hasard, ces dérives se <b>répartissent</b> sur tous les réglages et ne biaisent plus la comparaison.</p>`)}
${retenir(R`<p>La randomisation transforme une variable latente <b>systématique</b> (donc dangereuse) en simple <b>bruit aléatoire</b> (gérable). C'est l'idée clé de Fisher.</p>`)}
`
  },
  {
    id: 'cycle-de-vie', theme: 'methode', tps: [],
    titre: 'Le cycle de vie d\'un DoE',
    resume: 'Une boucle : question → spécification → conception → expérimentation → réponse (ou invalidation).',
    corps: R`
${idee(R`<p>Un plan suit un cycle, qui <b>reboucle</b> si les résultats invalident l'hypothèse :</p>`)}
${SCHEMA_CYCLE}
${retenir(R`<p>Même logique que la démarche scientifique : on ne « tire » jamais le plan une fois pour toutes, on <b>itère</b> (souvent : un screening large, puis un plan d'optimisation ciblé).</p>`)}
`
  },

  /* ===================================================== FIL ROUGE */
  {
    id: 'fil-rouge-3d', theme: 'exemple', tps: [],
    titre: 'Fil rouge : un plan complet (impression 3D)',
    resume: 'Un seul exemple qui fait passer toutes les notions, des facteurs à l\'optimisation.',
    corps: R`
${idee(R`<p><b>Objectif</b> : régler une imprimante 3D pour obtenir la pièce la plus <b>résistante</b> possible — et d'abord savoir <b>quels réglages comptent</b>.</p>`)}
${table(['Notion', 'Dans l\'exemple'], [
  ['Réponse $Y$', 'résistance à la traction (N), mesurée sur chaque éprouvette'],
  ['Facteurs $U$', 'température buse, vitesse, taux de remplissage (2 niveaux chacun)'],
  ['Unité', 'une éprouvette imprimée'],
  ['Variables latentes $Z$', 'humidité du filament, température de l\'atelier, usure de la buse'],
  ['Modèle', '$\\hat y = p_0 + p_1\\text{temp} + p_2\\text{vit} + p_3\\text{rempl}$'],
  ['Effet', 'chaque $\\hat p_i$ : de combien $Y$ bouge quand le facteur change'],
  ['Replicate', '3 éprouvettes par réglage → variance de l\'erreur'],
  ['Repeated', '3 mesures de la même éprouvette → à moyenner'],
  ['Biais / aléatoire', 'machine décalée de +5 N / dispersion entre éprouvettes'],
  ['Randomisation', 'ordre d\'impression tiré au hasard → neutralise l\'usure'],
  ['Screening ①', 'tester $H_0$ : « la vitesse n\'a aucun effet »'],
  ['Optimisation ②', '$u^\\star$ = réglage qui maximise la résistance']
])}
${methode(R`<p><b>Déroulé (les 11 étapes, condensées).</b> ① But : d'abord screening, puis optimisation. ② Unité : l'éprouvette. ③ Réponse : résistance en N (mesurable). ④ Variables : 3 facteurs + latentes listées à l'Ishikawa. ⑤ Pilote : vérifier que la machine de traction mesure bien. ⑥-⑦ Choisir un plan à 2 niveaux. ⑧ 3 replicates. ⑨ Ordre d'impression <b>randomisé</b>. ⑩ Analyse par moindres carrés. ⑪ Gantt sur 2 semaines.</p>`)}
${retenir(R`<p>Résultat type : « le <b>remplissage</b> et la <b>température</b> ont un effet net, la <b>vitesse</b> non (on la fige au plus rapide pour gagner du temps) ; l'optimum est <b>220 °C, remplissage 60 %</b> ». On a répondu aux deux questions avec une poignée d'essais.</p>`)}
`
  }
  ];

  // La bonne réponse est TOUJOURS la première de "choix" (l'ordre est mélangé à l'affichage).
  const QCM = [
    { theme: 'intro', type: 'theorie', q: 'Qu\'est-ce qu\'un plan d\'expériences (DoE) ?',
      choix: ['Un tableau : colonnes = facteurs à tester, lignes = expériences à réaliser', 'Une seule expérience très précise', 'Un graphique de la réponse en fonction du temps', 'La moyenne de toutes les mesures'],
      expl: 'Le DoE est un tableau préparé à l\'avance : une colonne par facteur, une ligne par essai.' },
    { theme: 'intro', type: 'theorie', q: 'Quel est le but principal d\'un plan d\'expériences ?',
      choix: ['Un maximum d\'information avec un minimum d\'essais', 'Faire le plus d\'essais possible', 'Supprimer toute mesure', 'Prouver une hypothèse déjà connue'],
      expl: 'On cherche des conclusions justes et précises en minimisant n, car chaque essai coûte.' },
    { theme: 'intro', type: 'theorie', q: 'De quels travaux viennent les méthodes modernes de DoE ?',
      choix: ['Les expériences agricoles de R. A. Fisher', 'La mécanique quantique', 'Les travaux de Newton en optique', 'La théorie de l\'information de Shannon'],
      expl: 'Fisher, années 1920-30 : comparer des engrais sur des parcelles en randomisant.' },
    { theme: 'vocab', type: 'theorie', q: 'Dans l\'exemple de l\'impression 3D, la résistance de la pièce mesurée après impression est…',
      choix: ['la réponse (variable dépendante Y)', 'un facteur (variable indépendante U)', 'une variable latente Z', 'un biais'],
      expl: 'La réponse Y est ce qu\'on mesure ; les facteurs (température, vitesse…) sont ce qu\'on règle.' },
    { theme: 'vocab', type: 'theorie', q: 'Toujours en 3D : l\'humidité du filament, qu\'on ne contrôle pas mais qui agit, est…',
      choix: ['une variable latente (lurking, Z)', 'un facteur contrôlé', 'la réponse', 'un replicate'],
      expl: 'Non contrôlée mais influente : c\'est une variable latente ; un bon plan équilibre son effet.' },
    { theme: 'vocab', type: 'theorie', q: 'Imprimer 3 éprouvettes aux mêmes réglages, c\'est…',
      choix: ['3 replicates (3 unités différentes) → variance de l\'erreur', '3 repeated (même unité) → à moyenner', 'un seul essai', 'un biais systématique'],
      expl: 'Unités différentes = replicates. Remesurer la MÊME éprouvette 3 fois = repeated (à moyenner).' },
    { theme: 'vocab', type: 'theorie', q: 'Que doit-on faire de mesures « repeated » (même unité remesurée) ?',
      choix: ['Les moyenner, pas les traiter comme des réponses séparées', 'Les compter comme autant d\'essais indépendants', 'Les ignorer', 'Les additionner'],
      expl: 'Les traiter comme indépendantes sous-estimerait la variance de l\'erreur.' },
    { theme: 'modele', type: 'pratique', q: 'Comment s\'écrit le modèle de base du DoE ?',
      choix: ['$Y = \\hat{y} + E$ avec $\\hat{y} = M(p,u)$', '$Y = \\hat{y} \\times E$', '$Y = E - \\hat{y}$', '$\\hat{y} = Y + E$'],
      expl: 'La réponse = partie expliquée par le modèle (ŷ) + erreur (E).' },
    { theme: 'modele', type: 'pratique', q: 'Quelle est la solution des moindres carrés ordinaires (OLS) ?',
      choix: ['$\\hat{p} = (X^\\top X)^{-1} X^\\top Y$', '$\\hat{p} = X^\\top Y$', '$\\hat{p} = (X X^\\top) Y$', '$\\hat{p} = X^{-1} Y^\\top$'],
      expl: 'Formule classique de l\'estimateur OLS des paramètres p du modèle.' },
    { theme: 'modele', type: 'theorie', q: 'Une machine de traction mal étalonnée qui lit toujours +5 N introduit…',
      choix: ['un biais (erreur systématique, E{E} ≠ 0)', 'une erreur aléatoire de moyenne nulle', 'une variable latente', 'un replicate'],
      expl: 'Un décalage constant = biais ; on le corrige en étalonnant, pas en répétant.' },
    { theme: 'modele', type: 'theorie', q: 'Comment réduit-on l\'incertitude aléatoire (pas le biais) ?',
      choix: ['En ajoutant des replicates', 'En étalonnant l\'appareil', 'En changeant d\'hypothèse', 'En supprimant un facteur'],
      expl: 'Répéter (replicates) réduit l\'aléatoire ; l\'étalonnage corrige le biais.' },
    { theme: 'but', type: 'theorie', q: 'Pour identifier les facteurs qui comptent (screening), que teste-t-on ?',
      choix: ['Si un coefficient B est nul : H₀ : B = 0 contre H₁ : B ≠ 0', 'La valeur maximale de la réponse', 'Le nombre d\'unités', 'La durée de chaque essai'],
      expl: 'On examine le coefficient B du modèle par un test d\'hypothèse.' },
    { theme: 'but', type: 'theorie', q: 'Chercher le réglage u* qui maximise la résistance, c\'est…',
      choix: ['de l\'optimisation (relation cause-effet)', 'du screening', 'un calcul de biais', 'une randomisation'],
      expl: 'Optimisation : on examine la réponse ŷ pour trouver le meilleur réglage u*.' },
    { theme: 'but', type: 'theorie', q: 'Quel est l\'avantage de l\'expérimentation sur la simple observation ?',
      choix: ['Concevoir les essais pour minimiser les effets confondants', 'Elle ne demande aucune mesure', 'Elle est toujours moins chère', 'Elle évite d\'avoir une hypothèse'],
      expl: 'En concevant le plan, on réduit les confusions → conclusions plus précises.' },
    { theme: 'methode', type: 'theorie', q: 'Pourquoi imprimer les éprouvettes dans un ordre aléatoire ?',
      choix: ['Pour que les dérives (usure buse, chaleur de l\'atelier) ne se confondent pas avec un facteur', 'Pour aller plus vite', 'Pour économiser du filament', 'Pour éviter de mesurer la réponse'],
      expl: 'La randomisation répartit les variables latentes qui dérivent dans le temps → plus de biais systématique.' },
    { theme: 'methode', type: 'theorie', q: 'À quoi servent les essais pilotes (étape 5) ?',
      choix: ['Vérifier qu\'on contrôle les facteurs et qu\'on sait mesurer la réponse', 'Publier les résultats', 'Remplacer l\'analyse', 'Choisir la couleur du rapport'],
      expl: 'Ne pas savoir mesurer la réponse ou contrôler les facteurs est la cause n°1 d\'échec.' },
    { theme: 'methode', type: 'theorie', q: 'Quel outil aide à lister les variables qui influencent la réponse ?',
      choix: ['Le diagramme cause-effet d\'Ishikawa (5M)', 'Le diagramme de Gantt', 'La transformée de Fourier', 'Un histogramme'],
      expl: 'Ishikawa (5M) organise les causes ; le Gantt sert au planning/budget (étape 11).' }
  ];

  const LEXIQUE = [
    ['DoE', 'Design of Experiments — plan d\'expériences : tableau organisant les essais à réaliser.'],
    ['Facteur', 'Variable d\'entrée contrôlée (U), que l\'on fait varier à des niveaux fixés (ex. température buse).'],
    ['Réponse', 'Variable de sortie (Y) mesurée après chaque essai (ex. résistance de la pièce).'],
    ['Effet', 'Changement de la réponse causé par un changement d\'un facteur.'],
    ['Essai (run)', 'Une expérience : on change au moins un facteur et on observe la réponse.'],
    ['Unité expérimentale', 'L\'item sur lequel on agit, stimulable indépendamment (ex. une éprouvette).'],
    ['Variable latente', 'Variable non contrôlée (lurking, Z) pouvant fausser le résultat (ex. humidité du filament).'],
    ['Replicate', 'Essai répété aux mêmes réglages mais sur une unité différente ; sert à estimer la variance.'],
    ['Repeated', 'Plusieurs mesures de la même unité lors d\'un essai ; à moyenner.'],
    ['Biais', 'Erreur systématique (constante ou régulière) : biais = E{E}. Se corrige par étalonnage.'],
    ['Erreur aléatoire', 'Erreur imprévisible de moyenne nulle, de variance σ². Se réduit en répétant.'],
    ['OLS', 'Ordinary Least Squares — moindres carrés ordinaires : p̂ = (XᵀX)⁻¹XᵀY.'],
    ['Screening', 'Étude visant à repérer quels facteurs comptent vraiment (test B = 0 ?).'],
    ['Optimisation', 'Chercher le réglage u* qui optimise la réponse (relation cause-effet).'],
    ['Ishikawa (5M)', 'Diagramme cause-effet servant à lister les variables influentes.'],
    ['Randomisation', 'Affectation au hasard de l\'ordre des essais, pour neutraliser les variables latentes.']
  ];

  MATIERES.push({
    id: 'plans-experiences', nom: 'Plans d\'Expériences',
    sousTitre: 'DoE — Design of Experiments',
    description: 'Introduction aux plans d\'expériences : vocabulaire, modèle, objectifs et méthode, avec un fil rouge concret (impression 3D). Cours T. Bastogne.',
    couleur: '#c0392b',
    themes: THEMES, tps: TPS, fiches: FICHES, qcm: QCM, lexique: LEXIQUE
  });
})();
