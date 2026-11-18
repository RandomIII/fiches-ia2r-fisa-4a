/*
 * Mémo A4 recto verso de Plans d'Expériences (DoE), cours « Lecture 0 — Introduction ».
 * Lecture 0 n'a pas d'exercices : recto = tout le cours, verso = méthode + fil rouge concret
 * (impression 3D) + mini-glossaire. But : réviser l'intro sur une seule feuille.
 */
(function () {
  const M = MATIERES.find(m => m.id === 'plans-experiences');
  if (!M) return;

  const S = (t, h) => `<section class="ms"><h3>${t}</h3>${h}</section>`;
  const K = h => `<div class="mk">${h}</div>`;
  const F = h => `<div class="mf">${h}</div>`;
  const P = h => `<div class="mp"><b>Pièges.</b> ${h}</div>`;

  // Schéma compact du modèle Y = ŷ + E (currentColor → s'adapte clair/sombre).
  const SCHEMA = R`
<figure class="fig"><svg viewBox="0 0 520 150" role="img" aria-label="Facteurs vers système réel et modèle ; l'écart des réponses est l'erreur" style="width:100%;height:auto">
  <style>.g-b{fill:none;stroke:currentColor;stroke-width:1.5}.g-t{fill:currentColor;font:600 12px Inter,sans-serif}.g-l{stroke:currentColor;stroke-width:1.3;fill:none;marker-end:url(#m-ar)}.g-a{fill:#c0392b;font:700 12px Inter,sans-serif}</style>
  <defs><marker id="m-ar" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 z" fill="currentColor"/></marker></defs>
  <text x="6" y="52" class="g-t">u</text><text x="6" y="116" class="g-t">u</text>
  <line x1="20" y1="48" x2="70" y2="48" class="g-l"/><line x1="20" y1="112" x2="70" y2="112" class="g-l"/>
  <rect x="72" y="30" width="140" height="36" rx="5" class="g-b"/><text x="92" y="52" class="g-t">Système réel</text>
  <rect x="72" y="96" width="140" height="36" rx="5" class="g-b"/><text x="92" y="118" class="g-t">Modèle M(p,u)</text>
  <line x1="212" y1="48" x2="300" y2="48" class="g-l"/><text x="246" y="40" class="g-a">Y</text>
  <line x1="212" y1="112" x2="300" y2="112" class="g-l"/><text x="244" y="104" class="g-a">ŷ</text>
  <circle cx="318" cy="80" r="18" class="g-b"/><text x="311" y="85" class="g-t">−</text>
  <line x1="300" y1="48" x2="312" y2="66" class="g-l"/><line x1="300" y1="112" x2="312" y2="94" class="g-l"/>
  <line x1="336" y1="80" x2="440" y2="80" class="g-l"/><text x="454" y="76" class="g-a">E</text><text x="446" y="94" class="g-t" style="opacity:.7">résidus</text>
</svg></figure>`;

  M.memos = {

/* ================================================================ MÉMO UNIQUE */
intro: {
  titre: 'Introduction aux plans d\'expériences',
  couleur: '#c0392b',
  maxPt: 13,   // mémo d'intro peu dense : on autorise un texte plus gros pour remplir la feuille
  labels: ['Cours', 'Méthode & fil rouge'],
  pages: [
/* ---------------------------------------------------------------- RECTO : cours */
R`
${S('Un plan d\'expériences (DoE), c\'est quoi ?', R`
<p>Un <b>plan d'expériences</b> (<i>Design of Experiments</i>) est un <b>tableau</b> préparé <b>à l'avance</b> : une <b>colonne par facteur</b> à tester, une <b>ligne par essai</b> à réaliser.</p>
${K(R`But : <b>maximum d'information</b> avec un <b>minimum d'essais</b> $n$ → conclusions <b>justes et précises</b>. « Pas de plan, pas de chocolat ! »`)}
<p><b>Fil rouge (repris partout)</b> : régler une <b>imprimante 3D</b> pour une pièce la plus <b>résistante</b> possible.</p>
`)}
${S('Statistiques & origines', R`
<p>La <b>statistique</b> répond à une <b>question posée d'avance</b>. Danger : des données mal recueillies <b>mentent</b> (confusions, biais). <b>R. A. Fisher</b> (essais agricoles, 1926-35) : détecter <b>cause → effet</b> au moindre coût en <b>randomisant</b> les parcelles.</p>
`)}
${S('Vocabulaire clé', R`
${table(['Terme', 'Déf.', 'En 3D'], [
  ['Facteur $U$', 'réglé, à niveaux fixés', 'temp., vitesse, remplissage'],
  ['Réponse $Y$', 'mesurée après l\'essai', 'résistance (N)'],
  ['Effet', 'variation de $Y$ due à un facteur', '+18 N si temp. 200→220'],
  ['Unité', 'item sur lequel on agit', 'une éprouvette'],
  ['Latente $Z$', 'non contrôlée, influente', 'humidité, usure buse']
])}
<p><b>Effet calculé</b> (des données) vs <b>effet pratique</b> (seuil jugé important, fixé avant). <b>Sous-unité</b> : unité découpée → mesures corrélées, à moyenner.</p>
`)}
${S('Répétitions : à ne pas confondre', R`
${table(['Type', 'Ce que c\'est', 'Traitement'], [
  ['<b>Replicate</b>', '3 éprouvettes, mêmes réglages', 'estime la variance de l\'erreur'],
  ['<b>Repeated</b>', '3 mesures de la même éprouvette', '<b>à moyenner</b> (1 seule réponse)']
])}
`)}
${S('Le modèle derrière tout DoE', R`
${F(R`$$Y = \hat{y} + E \qquad \hat{y} = M(p,u)$$`)}
${SCHEMA}
<p>$\hat y$ = part <b>expliquée</b>, $E$ = <b>erreur</b>, $p$ = <b>paramètres</b>. En 3D : $\hat y = p_0 + p_1\text{temp} + p_2\text{vit} + p_3\text{rempl}$, chaque $p_i$ = un effet. Deux hasards : <b>$V$</b> bruit de mesure, <b>$B$</b> incertitude des paramètres.</p>
`)}
${S('Estimer les paramètres : OLS', R`
${F(R`$$\hat{p} = \left(X^\top X\right)^{-1} X^\top Y$$`)}
<p>$X$ = tableau des réglages du plan, $Y$ = réponses mesurées. <b>Moindres carrés ordinaires</b> : minimise la somme des écarts². Un logiciel (R, Python, Minitab) le fait en une ligne.</p>
`)}
${S('Calculer un effet (exemple chiffré)', R`
<p>Facteur à <b>2 niveaux</b> : $\text{effet} = \overline{Y}_{\text{haut}} - \overline{Y}_{\text{bas}}$ (on moyenne sur tous les autres réglages).</p>
${table(['Temp.', 'Résistances mesurées', 'Moyenne'], [
  ['200 °C', '82 · 88 N', '85 N'],
  ['220 °C', '104 · 100 N', '102 N']
])}
${K(R`Effet température $= 102 - 85 = \mathbf{+17\ N}$. Au-dessus du seuil pratique (+10 N) → <b>la température compte</b>.`)}
`)}
${S('Coder les niveaux (−1 / +1)', R`
<p>On code le niveau <b>bas = −1</b>, <b>haut = +1</b>. L'effet d'un facteur $= \overline{Y}_{+1} - \overline{Y}_{-1}$ : niveaux symétriques → effets simples à calculer et <b>comparables</b> entre facteurs.</p>
${table(['Facteur', '−1', '+1'], [
  ['Température', '200 °C', '220 °C'],
  ['Remplissage', '20 %', '60 %']
])}
`)}
${S('Erreur expérimentale', R`
<p>Écart réponse observée − moyenne long terme (mêmes réglages). Jamais nulle. Modèle $E \sim \mathcal{N}(0,\sigma^2)$.</p>
${table(['Type', 'Comportement', 'En 3D / action'], [
  ['<b>Biais</b> $\\mathbb{E}\\{E\\}$', 'systématique', 'machine +5 N → <b>étalonner</b>'],
  ['<b>Aléatoire</b> $\\sigma^2$', 'moyenne nulle', 'dispersion → <b>répéter</b>']
])}
`)}
${S('Objectifs & applications', R`
${F(R`$\text{Var}(\hat{p})$ (bons <b>paramètres</b>)&emsp;ou&emsp;$\text{Var}(\hat{y})$ (bonne <b>prédiction</b>)`)}
${table(['Application', 'On examine', 'Formalisation'], [
  ['① Screening', '$B$', '$H_0: B=0$ vs $H_1: B\\neq0$'],
  ['② Optimisation', '$\\hat{y}$', '$u^\\star = \\arg\\min_{u} f_w(y-\\hat{y})$']
])}
<p>En 3D : ① « la vitesse compte-t-elle ? » puis ② « quel réglage maximise la résistance ? ».</p>
`)}
${S('Le DoE dans la vraie vie', R`
${table(['Domaine', 'Facteurs → réponse'], [
  ['Agronomie (Fisher)', 'engrais, variété → rendement'],
  ['Chimie / procédé', 'temp., pression, catalyseur → rendement'],
  ['Pharma', 'doses d\'un mélange → efficacité'],
  ['Qualité (Taguchi)', 'réglages → robustesse du produit'],
  ['Web (A/B test)', 'couleur d\'un bouton → taux de clic']
])}
`)}`,
/* ---------------------------------------------------------------- VERSO : méthode + fil rouge */
R`
${S('La démarche scientifique', R`
${table(['#', 'Étape'], [
  ['1', '<b>Observer</b> l\'état de la nature'],
  ['2', '<b>Conjecturer</b> le mécanisme (hypothèse)'],
  ['3', '<b>Concevoir</b> les expériences & <b>collecter</b>'],
  ['4', '<b>Analyser</b> → confirmer (= connaissance) ou rejeter (retour à 2)']
])}
${K(R`Avantage de l'<b>expérimentation</b> sur l'<b>observation</b> : concevoir pour <b>minimiser les effets confondants</b>.`)}
`)}
${S('Planifier un plan : les 11 étapes', R`
${table(['#', 'Étape', 'Détail'], [
  ['1', 'Objectifs', 'screening ou cause-effet ?'],
  ['2', 'Unités', 'l\'item qu\'on change → éclaire l\'erreur'],
  ['3', 'Réponse', 'utile et <b>mesurable</b>'],
  ['4', 'Variables', 'indépendantes & latentes — <b>Ishikawa (5M)</b>'],
  ['5', 'Essais pilotes', 'vérifier contrôle & mesure'],
  ['6', 'Diagramme de flux', 'standardiser chaque essai'],
  ['7', 'Choisir le plan', 'd\'abord choisir le modèle'],
  ['8', 'Replicates', 'assez pour détecter un effet'],
  ['9', 'Randomiser', 'conditions → unités, au hasard'],
  ['10', 'Méthode d\'analyse', 'décrire le plan d\'analyse'],
  ['11', 'Planning & budget', 'diagramme de <b>Gantt</b>']
])}
${P(R`Causes n°1 d'échec : <b>ne pas savoir mesurer</b> la réponse, ou <b>ne pas contrôler</b> les facteurs → essais pilotes (étape 5).`)}
`)}
${S('Randomiser : pourquoi c\'est vital', R`
<p>Imprimer d'abord tout à 200 °C puis tout à 220 °C : la <b>buse s'use</b> et l'atelier <b>chauffe</b> → l'effet « température » se <b>confond</b> avec ces dérives (variables latentes). Tirer l'<b>ordre au hasard</b> les répartit → plus de biais systématique. C'est l'idée clé de Fisher.</p>
`)}
${S('Confusion (confounding) : l\'ennemi', R`
<p>Si on change <b>deux facteurs ensemble</b> à chaque essai (temp. <b>et</b> remplissage), et que la pièce est plus solide, on ne sait <b>pas lequel</b> a agi : leurs effets sont <b>confondus</b>.</p>
${P(R`Un bon plan fait varier les facteurs de façon <b>indépendante</b> (et randomise l'ordre) pour <b>séparer</b> les effets. C'est toute la différence avec « bricoler un réglage à la fois, au hasard ».`)}
`)}
${S('Même méthode, autre domaine : A/B test web', R`
${table(['Notion', 'Sur un site web'], [
  ['Facteur $U$', 'couleur du bouton (vert / bleu)'],
  ['Réponse $Y$', 'taux de clic (%)'],
  ['Unité', 'un visiteur'],
  ['Latente $Z$', 'heure, jour, type d\'appareil'],
  ['Replicate', 'des milliers de visiteurs par version'],
  ['Randomisation', 'chaque visiteur tiré au hasard vers une version'],
  ['Screening', 'la couleur change-t-elle le taux de clic ?']
])}
${K(R`Exactement les mêmes notions que l'impression 3D, dans un tout autre métier : c'est ça, la force du DoE.`)}
`)}
${S('Fil rouge : toutes les notions en 3D', R`
${table(['Notion', 'Dans l\'exemple'], [
  ['Réponse $Y$', 'résistance à la traction (N)'],
  ['Facteurs $U$', 'température, vitesse, remplissage'],
  ['Latentes $Z$', 'humidité filament, usure buse, chaleur atelier'],
  ['Replicate / repeated', '3 éprouvettes / 3 mesures d\'une même'],
  ['Biais / aléatoire', 'machine +5 N / dispersion entre pièces'],
  ['Screening → optim.', 'figer la vitesse, puis viser 220 °C & rempl. 60 %']
])}
${K(R`Résultat type : « remplissage et température comptent, pas la vitesse → optimum <b>220 °C, 60 %</b> », en une poignée d'essais.`)}
`)}
${S('4 réflexes à retenir', R`
${table(['Réflexe', 'Pourquoi'], [
  ['Randomiser l\'ordre', 'neutralise les dérives (usure, chaleur…)'],
  ['Replicates (unités ≠)', 'donnent la variance de l\'erreur'],
  ['Moyenner les repeated', 'même unité = 1 seule réponse'],
  ['Biais → étalonner ; aléa → répéter', 'deux erreurs, deux remèdes']
])}
`)}
${S('Mini-glossaire', R`
<p><b>DoE</b> plan d'expériences · <b>Facteur $U$</b> entrée réglée · <b>Réponse $Y$</b> sortie mesurée · <b>Effet</b> variation de $Y$ · <b>Unité</b> item étudié · <b>Latente $Z$</b> non contrôlée · <b>Replicate</b> répétition sur unité ≠ · <b>Repeated</b> remesure d'une même unité · <b>OLS</b> $(X^\top X)^{-1}X^\top Y$ · <b>Screening</b> facteurs qui comptent · <b>Randomisation</b> ordre tiré au sort.</p>
`)}
`
  ]
}

  };
})();
