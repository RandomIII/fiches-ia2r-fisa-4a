/*
 * Matière : Plans d'Expériences (DoE — Design of Experiments), T. Bastogne, Polytech Nancy.
 * Source : cours « Lecture 0 — Introduction ».
 * Les textes passent par R`...` (String.raw) pour garder le LaTeX intact : $...$ en ligne, $$...$$ centré.
 */
(function () {
  const THEMES = {
    intro:   { nom: 'Introduction',      couleur: '#3b6fd8' },
    vocab:   { nom: 'Terminologie',      couleur: '#8250df' },
    modele:  { nom: 'Modèle & erreurs',  couleur: '#0e8a9a' },
    but:     { nom: 'Objectifs',         couleur: '#d4730b' },
    methode: { nom: 'Méthode',           couleur: '#1a8a5a' }
  };

  const TPS = {};

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
${retenir(R`<p>But du DoE : tirer des conclusions <b>justes et précises</b> à partir des données, <b>en minimisant le nombre d'essais</b> $n$ (chaque essai coûte du temps et de l'argent).</p>`)}
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
${retenir(R`<p>La motivation du DoE est donc de tirer des conclusions <b>non biaisées</b> et <b>précises</b>, grâce à un <b>bon plan</b> d'expériences choisi avant de mesurer.</p>`)}
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
${retenir(R`<p>Les objectifs de Fisher, toujours valables aujourd'hui :</p>
<ul><li>détecter une relation <b>cause → effet</b> avec <b>le minimum d'essais</b> ;</li>
<li><b>éliminer</b> au maximum la variation naturelle ;</li>
<li><b>empêcher</b> la variation résiduelle de <b>biaiser</b> les effets étudiés.</li></ul>`)}
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
  ['Réponse (variable dépendante)', '$Y$', 'Caractéristique de l\'unité <b>mesurée après chaque essai</b>. Dépend des facteurs et des variables latentes.'],
  ['Effet', '—', 'Le <b>changement de la réponse</b> causé par un changement d\'un facteur.']
])}
${retenir(R`<p>On distingue l'<b>effet calculé</b> (estimé à partir des données) de l'<b>effet pratique</b> : la taille d'effet jugée <b>importante</b>, fixée <b>avant</b> les essais.</p>`)}
`
  },
  {
    id: 'unite-latente', theme: 'vocab', tps: [],
    titre: 'Essai, unité expérimentale, variable latente',
    resume: 'Sur quoi on agit (unité), ce qu\'on fait (essai), et la variable cachée qu\'on ne contrôle pas.',
    corps: R`
${idee(R`<p><b>Essai</b> (<i>run</i>) : une action où l'expérimentateur <b>change au moins une variable</b> étudiée, puis <b>observe</b> les effets.</p>`)}
${table(['Terme', 'Définition'], [
  ['Unité expérimentale', 'L\'<b>item étudié</b> sur lequel on change quelque chose ; il peut être stimulé <b>indépendamment</b> des autres.'],
  ['Sous-unité', 'Quand on découpe une unité. Les mesures sur sous-unités sont <b>corrélées</b> → à <b>moyenner</b> avant analyse, pas à traiter comme indépendantes.'],
  ['Variable latente (<i>lurking</i>, $Z$)', 'Variable que l\'on <b>ne contrôle pas</b> mais qui peut agir sur le résultat.']
])}
${retenir(R`<p>Dans un bon plan, l'effet des variables latentes doit <b>s'équilibrer</b> pour <b>ne pas fausser</b> la conclusion.</p>`)}
`
  },
  {
    id: 'replicate-repeated', theme: 'vocab', tps: [],
    titre: 'Replicate vs repeated : ne pas confondre',
    resume: 'Répéter sur des unités différentes (replicate) ≠ remesurer la même unité (repeated).',
    corps: R`
${table(['Type', 'Ce que c\'est', 'Traitement'], [
  ['<b>Replicate runs</b>', 'Mêmes réglages des facteurs, mais <b>unités expérimentales différentes</b>.', 'Vraies répétitions : servent à estimer la variance de l\'erreur.'],
  ['<b>Repeated runs</b>', 'Plusieurs mesures de la <b>même unité</b> lors d\'un essai.', '<b>À moyenner</b> — ce n\'est <b>pas</b> plusieurs réponses séparées.']
])}
${piege(R`<p>Traiter des <i>repeated</i> comme des réponses indépendantes fait croire à tort qu'on a plus d'information → variance sous-estimée.</p>`)}
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
${table(['Terme', 'Sens'], [
  ['$\\hat{y}$', 'Partie de la réponse <b>expliquée</b> par le modèle $M(\\cdot)$.'],
  ['$E$', 'L\'<b>erreur</b> (ce que le modèle n\'explique pas).'],
  ['$p$', 'Les <b>paramètres</b> du modèle (inconnus, à estimer).']
])}
${retenir(R`<p>Deux sources de hasard : <b>$V$</b> = bruit de <b>mesure</b>, et <b>$B$</b> = incertitude sur les <b>paramètres</b> du modèle.</p>`)}
`
  },
  {
    id: 'moindres-carres', theme: 'modele', tps: [],
    titre: 'Estimer les paramètres : moindres carrés',
    resume: 'Les paramètres sont inconnus : on les estime par moindres carrés ordinaires (OLS).',
    corps: R`
${idee(R`<p>Les paramètres $p$ sont <b>inconnus</b> : on les <b>estime</b> à partir des mesures de $u$ et $Y$ faites pendant les essais.</p>`)}
${methode(R`<p>Dans ce cours on utilise les <b>moindres carrés ordinaires</b> (<i>ordinary least squares</i>), dont la solution est :</p>
$$\hat{p} = \left( X^\top X \right)^{-1} X^\top Y$$
<p>où $X$ est la matrice construite à partir du plan (les réglages des facteurs).</p>`)}
`
  },
  {
    id: 'erreur-biais-aleatoire', theme: 'modele', tps: [],
    titre: 'Erreur expérimentale : biais vs aléatoire',
    resume: 'L\'écart à la moyenne long terme se sépare en une part systématique (biais) et une part aléatoire.',
    corps: R`
${idee(R`<p>L'<b>erreur expérimentale</b> est l'écart entre la réponse <b>observée</b> à un essai et la <b>moyenne sur le long terme</b> de tous les essais aux mêmes réglages. Elle n'est jamais nulle, car les variables de fond la font varier d'un essai à l'autre. On la modélise par :</p>
$$E \sim \mathcal{N}(0, \sigma^2)$$`)}
${table(['Type d\'erreur', 'Comportement', 'Formule'], [
  ['<b>Biais</b> (<i>bias</i>)', 'Reste <b>constant</b> ou varie de façon <b>systématique</b> sur les essais.', '$\\text{biais} = \\mathbb{E}\\{E\\}$'],
  ['<b>Aléatoire</b> (<i>random</i>)', 'Change de façon <b>imprévisible</b>, de <b>moyenne nulle</b>.', '$\\sigma^2 = \\text{Var}\\{E\\}$']
])}
${retenir(R`<p>La <b>variance</b> de l'erreur aléatoire s'obtient en incluant des <b>replicate runs</b> dans le plan.</p>`)}
`
  },

  /* ===================================================== OBJECTIFS */
  {
    id: 'deux-objectifs', theme: 'but', tps: [],
    titre: 'Les deux objectifs d\'un plan',
    resume: 'Maximiser l\'info en minimisant n : soit précision des paramètres, soit précision de la prédiction.',
    corps: R`
${idee(R`<p>Un plan est construit pour avoir le <b>maximum d'information</b> en <b>minimisant $n$</b> (le nombre d'essais). Selon l'application, deux objectifs précis :</p>`)}
${table(['Objectif', 'On minimise', 'Pour…'], [
  ['Précision des <b>paramètres</b>', '$\\text{Var}(\\hat{p})$', 'bien estimer les coefficients du modèle.'],
  ['Précision de la <b>prédiction</b>', '$\\text{Var}(\\hat{y})$', 'bien prédire la réponse.']
])}
`
  },
  {
    id: 'deux-applications', theme: 'but', tps: [],
    titre: 'Deux applications : screening et optimisation',
    resume: 'Trouver les facteurs qui comptent (test d\'hypothèse) ou régler pour optimiser la réponse.',
    corps: R`
${table(['Application', 'On examine', 'Formalisation'], [
  ['① Identifier les <b>sources de variabilité</b> (<i>screening</i>)', 'le coefficient $B$ du modèle', '$\\begin{cases} H_0 : B = 0 \\\\ H_1 : B \\neq 0 \\end{cases}$'],
  ['② Relation <b>cause → effet</b> pour l\'<b>optimisation</b>', 'la réponse $\\hat{y}$', '$u^\\star = \\arg\\min\\limits_{u \\in U} f_w\\big(y - \\hat{y}(b, u)\\big)$']
])}
${retenir(R`<p>① = « <b>quels facteurs comptent ?</b> » (on teste si $B$ est nul). ② = « <b>quel réglage donne la meilleure réponse ?</b> » (on cherche le $u$ optimal).</p>`)}
`
  },
  {
    id: 'demarche-scientifique', theme: 'but', tps: [],
    titre: 'La démarche scientifique du DoE',
    resume: 'Observer → conjecturer → expérimenter → analyser, en boucle jusqu\'à la connaissance.',
    corps: R`
${methode(R`<ol><li><b>Observer</b> l'état de la nature.</li>
<li><b>Conjecturer</b> (formuler une hypothèse) sur le mécanisme observé.</li>
<li><b>Concevoir</b> les expériences et <b>collecter</b> les données.</li>
<li><b>Analyser</b> pour <b>confirmer ou rejeter</b> la conjecture.<br>→ confirmée = <b>connaissance</b> ; sinon, <b>retour à l'étape 2</b>.</li></ol>`)}
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
<li><b>Définir les objectifs</b> : identifier des sources de variabilité (<i>screening</i>) ou déterminer une relation cause-effet (prédiction, optimisation, mélange) ?</li>
<li><b>Identifier les unités expérimentales</b> : l'item sur lequel on change quelque chose (aide à comprendre l'erreur expérimentale).</li>
<li><b>Définir une réponse</b> utile et <b>mesurable</b> après chaque essai.</li>
<li><b>Lister les variables</b> indépendantes et latentes (outil : diagramme cause-effet d'<b>Ishikawa</b>, les <b>5M</b>).</li>
<li><b>Essais pilotes</b> : vérifier qu'on contrôle bien les facteurs et qu'on sait mesurer la réponse. Sinon, retour aux étapes 2-4.</li>
<li><b>Diagramme de flux</b> de la procédure de chaque essai (pour standardiser).</li>
<li><b>Choisir le plan</b> adapté aux objectifs (d'abord choisir le modèle d'analyse).</li>
<li><b>Nombre de replicates</b> : assez pour détecter avec une forte probabilité un effet d'intérêt pratique.</li>
<li><b>Randomiser</b> l'affectation des conditions aux unités.</li>
<li><b>Décrire la méthode d'analyse</b> des données (le plan d'analyse).</li>
<li><b>Planning & budget</b> des ressources (outil : diagramme de <b>Gantt</b>).</li>
</ol>`)}
${piege(R`<p>Les causes n°1 d'échec d'un plan : <b>ne pas savoir mesurer</b> la réponse précisément, ou <b>ne pas contrôler</b> les niveaux des facteurs. D'où l'importance des essais pilotes (étape 5).</p>`)}
`
  },
  {
    id: 'cycle-de-vie', theme: 'methode', tps: [],
    titre: 'Le cycle de vie d\'un DoE',
    resume: 'Une boucle : question → spécification → conception → expérimentation → réponse (ou invalidation).',
    corps: R`
${idee(R`<p>Un plan suit un cycle, qui peut <b>reboucler</b> si les résultats invalident l'hypothèse :</p>
<p style="text-align:center"><b>Question ?</b> → Spécification → Conception → Expérimentation → <b>Réponse</b></p>
<p>Une <b>invalidation</b> à l'expérimentation renvoie en arrière (nouvelle question / nouvelle spécification).</p>`)}
${retenir(R`<p>C'est la même logique que la démarche scientifique : on ne « tire » jamais le plan une fois pour toutes, on <b>itère</b>.</p>`)}
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
      expl: 'Fisher, dans les années 1920-30, pour détecter cause→effet avec le minimum d\'essais.' },
    { theme: 'vocab', type: 'theorie', q: 'Dans un plan, qu\'est-ce qu\'un facteur (variable indépendante) ?',
      choix: ['Une variable qu\'on contrôle et fait varier à des niveaux fixés', 'La caractéristique mesurée après chaque essai', 'Une variable qu\'on ne peut pas contrôler', 'L\'erreur de mesure'],
      expl: 'Le facteur (U) est contrôlé et changé systématiquement ; la réponse (Y) est ce qu\'on mesure.' },
    { theme: 'vocab', type: 'theorie', q: 'Qu\'est-ce qu\'une variable latente (lurking variable) ?',
      choix: ['Une variable non contrôlée qui peut fausser le résultat', 'Un facteur qu\'on règle précisément', 'La réponse du système', 'Un paramètre du modèle'],
      expl: 'Notée Z : non contrôlable ; un bon plan équilibre son effet pour ne pas biaiser la conclusion.' },
    { theme: 'vocab', type: 'theorie', q: 'Quelle est la différence entre « replicate » et « repeated » runs ?',
      choix: ['Replicate = mêmes réglages sur des unités différentes ; repeated = remesures de la même unité', 'C\'est exactement la même chose', 'Replicate = une seule mesure ; repeated = deux facteurs', 'Repeated sert à estimer la variance, replicate non'],
      expl: 'Les repeated se moyennent (même unité) ; les replicate (unités différentes) estiment la variance.' },
    { theme: 'vocab', type: 'theorie', q: 'Que doit-on faire des mesures « repeated » d\'une même unité ?',
      choix: ['Les moyenner, pas les traiter comme des réponses séparées', 'Les compter comme autant d\'essais indépendants', 'Les ignorer complètement', 'Les additionner'],
      expl: 'Les traiter comme indépendantes sous-estimerait la variance de l\'erreur.' },
    { theme: 'modele', type: 'pratique', q: 'Comment s\'écrit le modèle de base du DoE ?',
      choix: ['$Y = \\hat{y} + E$ avec $\\hat{y} = M(p,u)$', '$Y = \\hat{y} \\times E$', '$Y = E - \\hat{y}$', '$\\hat{y} = Y + E$'],
      expl: 'La réponse = partie expliquée par le modèle (ŷ) + erreur (E).' },
    { theme: 'modele', type: 'pratique', q: 'Quelle est la solution des moindres carrés ordinaires (OLS) ?',
      choix: ['$\\hat{p} = (X^\\top X)^{-1} X^\\top Y$', '$\\hat{p} = X^\\top Y$', '$\\hat{p} = (X X^\\top) Y$', '$\\hat{p} = X^{-1} Y^\\top$'],
      expl: 'Formule classique de l\'estimateur OLS des paramètres p du modèle.' },
    { theme: 'modele', type: 'theorie', q: 'Quelle est la différence entre erreur de biais et erreur aléatoire ?',
      choix: ['Le biais est systématique (E{E}) ; l\'aléatoire change de façon imprévisible et de moyenne nulle', 'Le biais est aléatoire, l\'aléatoire est constant', 'Les deux sont toujours nulles', 'Le biais n\'existe que pour les replicates'],
      expl: 'biais = E{E} ; l\'erreur aléatoire a une moyenne nulle et une variance σ² = Var{E}.' },
    { theme: 'but', type: 'theorie', q: 'Pour identifier les sources de variabilité (screening), que teste-t-on ?',
      choix: ['Si un coefficient B est nul : H₀ : B = 0 contre H₁ : B ≠ 0', 'La valeur maximale de la réponse', 'Le nombre d\'unités expérimentales', 'La durée de chaque essai'],
      expl: 'On examine le coefficient B du modèle par un test d\'hypothèse.' },
    { theme: 'but', type: 'theorie', q: 'Quel est l\'avantage de l\'expérimentation par rapport à la simple observation ?',
      choix: ['Concevoir les essais pour minimiser les effets confondants', 'Elle ne demande aucune mesure', 'Elle est toujours moins chère', 'Elle évite d\'avoir une hypothèse'],
      expl: 'En concevant le plan, on réduit les confusions → conclusions plus précises.' },
    { theme: 'methode', type: 'theorie', q: 'À quoi servent les essais pilotes (étape 5 de la planification) ?',
      choix: ['Vérifier qu\'on contrôle les facteurs et qu\'on sait mesurer la réponse', 'Publier les résultats finaux', 'Remplacer l\'analyse des données', 'Choisir la couleur du rapport'],
      expl: 'Ne pas savoir mesurer la réponse ou contrôler les facteurs est la cause n°1 d\'échec.' },
    { theme: 'methode', type: 'theorie', q: 'Quel outil aide à lister les variables qui influencent la réponse ?',
      choix: ['Le diagramme cause-effet d\'Ishikawa (5M)', 'Le diagramme de Gantt', 'La transformée de Fourier', 'Un histogramme'],
      expl: 'Ishikawa (5M) organise les causes ; le Gantt sert au planning/budget (étape 11).' }
  ];

  const LEXIQUE = [
    ['DoE', 'Design of Experiments — plan d\'expériences : tableau organisant les essais à réaliser.'],
    ['Facteur', 'Variable d\'entrée contrôlée (U), que l\'on fait varier à des niveaux fixés d\'un essai à l\'autre.'],
    ['Réponse', 'Variable de sortie (Y) mesurée après chaque essai ; ce qu\'on cherche à expliquer.'],
    ['Effet', 'Changement de la réponse causé par un changement d\'un facteur.'],
    ['Essai (run)', 'Une expérience : on change au moins un facteur et on observe la réponse.'],
    ['Unité expérimentale', 'L\'item sur lequel on agit, stimulable indépendamment des autres.'],
    ['Variable latente', 'Variable non contrôlée (lurking, Z) pouvant fausser le résultat.'],
    ['Replicate', 'Essai répété aux mêmes réglages mais sur une unité différente ; sert à estimer la variance.'],
    ['Repeated', 'Plusieurs mesures de la même unité lors d\'un essai ; à moyenner.'],
    ['Biais', 'Erreur systématique (constante ou régulière) : biais = E{E}.'],
    ['Erreur aléatoire', 'Erreur imprévisible de moyenne nulle, de variance σ².'],
    ['OLS', 'Ordinary Least Squares — moindres carrés ordinaires : p̂ = (XᵀX)⁻¹XᵀY.'],
    ['Screening', 'Étude visant à repérer quels facteurs comptent vraiment (test B = 0 ?).'],
    ['Ishikawa (5M)', 'Diagramme cause-effet servant à lister les variables influentes.'],
    ['Randomisation', 'Affectation au hasard des conditions aux unités, pour neutraliser les variables latentes.']
  ];

  MATIERES.push({
    id: 'plans-experiences', nom: 'Plans d\'Expériences',
    sousTitre: 'DoE — Design of Experiments',
    description: 'Introduction aux plans d\'expériences : vocabulaire, modèle, objectifs et méthode (cours T. Bastogne).',
    couleur: '#c0392b',
    themes: THEMES, tps: TPS, fiches: FICHES, qcm: QCM, lexique: LEXIQUE
  });
})();
