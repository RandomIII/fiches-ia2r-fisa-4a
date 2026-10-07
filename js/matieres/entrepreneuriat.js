/*
 * Matière : Entrepreneuriat & gestion (d'après les notes de cours manuscrites).
 * Trois parties : stratégie & décision, marketing, créer & piloter une entreprise.
 */
(function () {
  const THEMES = {
    couts:     { nom: 'Coûts & décision',     couleur: '#3b6fd8' },
    swot:      { nom: 'SWOT & stratégie',     couleur: '#8250df' },
    mkt:       { nom: 'Marketing',            couleur: '#d4730b' },
    conso:     { nom: 'Consommateur',         couleur: '#b83280' },
    juridique: { nom: 'Statuts & impôts',     couleur: '#1a8a5a' },
    finance:   { nom: 'Indicateurs financiers', couleur: '#0e8a9a' },
    projet:    { nom: 'Projet start-up',      couleur: '#cf3a3a' }
  };
  const TPS = {
    p1: 'Partie 1 · Stratégie & décision',
    p2: 'Partie 2 · Marketing',
    p3: 'Partie 3 · Créer & piloter'
  };
  const TPS_COURT = { p1: 'Partie 1', p2: 'Partie 2', p3: 'Partie 3' };

  // Coût total des deux options du cours : sous-traiter à 45 €/pièce, ou investir 300 k€ et produire à 20 €/pièce.
  const makeOrBuyPlot = cap => plot({ x: [0, 22000], y: [0, 1000000], w: 380, h: 190, xl: 'Q (pièces/an)', yl: 'coût total (€)',
    fns: [{ f: q => 45 * q, cls: 'c2' }, { f: q => 300000 + 20 * q, cls: 'c1' }], vlines: [12000],
    xt: [[12000, '12 000'], [20000, '20 000']], yt: [[300000, '300 k'], [540000, '540 k'], [900000, '900 k']],
    texts: [{ x: 6000, y: 420000, t: 'interne', cls: '' }, { x: 17000, y: 640000, t: 'sous-traitance' }], cap });

  const FICHES = [

/* ============================================================ PARTIE 1 */
{
  id: 'couts', theme: 'couts', tps: ['p1'],
  titre: 'Coûts fixes et coûts variables',
  resume: 'Fixes : on les paie même sans rien produire. Variables : ils grossissent avec chaque pièce fabriquée.',
  corps: R`
${table(['', 'Coûts fixes (CF)', 'Coûts variables (CV)'], [
  ['Définition', '<b>indépendants</b> du volume produit : on les paie même si production = 0', '<b>proportionnels</b> au volume fabriqué'],
  ['Exemples', 'salaires d’encadrement, loyer des bâtiments (bureaux), énergie des bureaux, assurances, amortissement d’une machine', 'matières premières, énergie consommée par les machines, usure des outils, sous-traitance à la pièce'],
  ['Formule', '$CF$ (constante)', '$CV = c_v \\times Q$ ($c_v$ = coût par pièce)']
])}
$$\text{Coût total} = CF + c_v\,Q$$
${idee(R`<p>Distinguer les deux sert à <b>comparer des options</b> : une option avec un gros coût fixe (acheter une machine) devient rentable seulement si on produit beaucoup, car son coût fixe est alors réparti sur beaucoup de pièces.</p>`)}
${piege(R`<p>L'énergie peut être <b>fixe</b> (chauffage des bureaux) ou <b>variable</b> (électricité des machines) : regarde si elle dépend du nombre de pièces.</p>`)}
`},

{
  id: 'make-or-buy', theme: 'couts', tps: ['p1'],
  titre: 'Faire ou faire faire : le seuil d’indifférence',
  resume: 'Q* = CF / (CVext − CVint) : le volume où sous-traiter et internaliser coûtent pareil.',
  corps: R`
${idee(R`<p><b>Seuil d'indifférence</b> $Q^*$ : le volume <b>annuel</b> exact pour lequel sous-traiter ou internaliser revient au <b>même coût global</b>.</p>`)}
$$\underbrace{c_{ext}\,Q}_{\text{sous-traitance}} = \underbrace{CF + c_{int}\,Q}_{\text{interne}} \quad\Longrightarrow\quad Q^* = \frac{CF}{CV_{ext} - CV_{int}}$$
${methode(R`<p><b>Exemple du cours</b> : option A = sous-traitance à 45 €/pièce ; option B = interne, machine à 300 k€ puis 20 €/pièce.</p>
$$Q^* = \frac{300\,000}{45 - 20} = 12\,000 \text{ pièces/an}$$
<ul><li>Volume prévu <b>&lt; 12 000</b> → <b>A (sous-traiter)</b> : la machine ne serait pas assez utilisée.</li><li>Volume prévu <b>&gt; 12 000</b> → <b>B (internaliser)</b> : chaque pièce économise 25 €, ce qui rembourse la machine.</li></ul>`)}
${makeOrBuyPlot('Les deux droites se croisent en Q* = 12 000 (coût 540 k€)')}
${retenir(R`<p>Le dénominateur $CV_{ext} - CV_{int}$ = <b>économie par pièce</b> en internalisant. $Q^*$ = nombre de pièces qu'il faut fabriquer pour que ces économies remboursent le coût fixe.</p>`)}
`},

{
  id: 'grille-arbitrage', theme: 'couts', tps: ['p1'],
  titre: 'La grille d’arbitrage (hors calcul)',
  resume: 'Le calcul ne suffit pas : flexibilité, qualité/délais, dépendance et cœur de métier pèsent aussi.',
  corps: R`
${idee(R`<p>Le seuil $Q^*$ donne la réponse <b>financière</b>. Avant de décider, on vérifie 4 critères <b>qualitatifs</b> :</p>`)}
${table(['Critère', 'Question à se poser', 'Penche vers…'], [
  ['1. Flexibilité & risque de volume', 'Le marché peut-il baisser ? Si le volume chute sous Q*, la machine coûte trop cher.', 'marché incertain → <b>sous-traiter</b>'],
  ['2. Qualité, tolérance & délais', 'Le sous-traitant tient-il les tolérances et les délais ?', 'exigences fortes → <b>internaliser</b>'],
  ['3. Dépendance (fournisseurs)', 'Que se passe-t-il si le fournisseur augmente ses prix ou fait faillite ?', 'fournisseur unique → <b>internaliser</b> ou en trouver un 2e'],
  ['4. Cœur de métier', 'Cette pièce fait-elle notre différence ?', 'cœur de métier → <b>internaliser</b> ; accessoire → sous-traiter']
])}
${retenir(R`<p>Réponse type : « Le calcul donne X, mais compte tenu de [critère], je recommande… ». C'est cette nuance qui est attendue.</p>`)}
`},

{
  id: 'swot', theme: 'swot', tps: ['p1'],
  titre: 'Le SWOT : diagnostic rapide',
  resume: 'Forces et faiblesses (internes, tu contrôles), opportunités et menaces (externes, tu subis).',
  corps: R`
${idee(R`<p>Pourquoi un ingénieur a besoin d'un SWOT : pour un <b>diagnostic rapide</b> qui répond à « <i>Est-ce que le produit a une chance de trouver sa place sur le marché ?</i> ». Utile pour une start-up, une décision de lancer un produit (R&D), un appel d'offres.</p>`)}
${table(['', 'Positif (+)', 'Négatif (−)'], [
  ['<b>Interne</b> (tu contrôles)', '<b>S — Strengths / Forces</b><br>ce que tu fais mieux que les autres ; une ressource rare (brevet, techno, expertise)', '<b>W — Weaknesses / Faiblesses</b><br>ce qui te manque en interne ; un maillon faible de ta chaîne de valeur'],
  ['<b>Externe</b> (tu subis)', '<b>O — Opportunities / Opportunités</b><br>une tendance qui joue en ta faveur ; un changement réglementaire favorable', '<b>T — Threats / Menaces</b><br>un concurrent ou une techno qui te menace ; risques macro (coûts, réglementation)']
])}
${retenir(R`<p><b>Le test interne / externe</b> : « Est-ce que je peux le changer par une décision ? » Oui → Force ou Faiblesse. Non → Opportunité ou Menace.</p>`)}
`},

{
  id: 'swot-cases', theme: 'swot', tps: ['p1'],
  titre: 'Bien remplir chaque case du SWOT',
  resume: 'Une force qu’on copie en 3 mois n’est qu’un atout ; une faiblesse se corrige ; une menace ne se maîtrise pas mais s’anticipe.',
  corps: R`
${table(['Case', 'Définition précise', 'Exemple'], [
  ['<b>Forces</b>', 'atouts <b>internes</b> qui donnent un <b>avantage concurrentiel</b>. Test : un concurrent peut-il copier ça en quelques mois ? Si oui, c’est un <i>atout</i>, pas vraiment une force.', 'BlaBlaCar : sa communauté d’utilisateurs (effet réseau difficile à copier)'],
  ['<b>Faiblesses</b>', 'aspects internes qui désavantagent le projet. Pas une fatalité : un <b>manque identifié</b>, donc ce sur quoi tu peux agir <b>en premier</b>.', 'Deezer face à Spotify (moins de moyens, moins de notoriété)'],
  ['<b>Opportunités</b>', 'tendances <b>externes</b> que le projet peut saisir <b>sans les avoir créées</b>. Question : « qu’est-ce qui change dans le monde, indépendamment de moi, et qui joue en ma faveur ? »', 'Doctolib et la numérisation de la santé'],
  ['<b>Menaces</b>', 'facteurs externes qui peuvent nuire <b>même si tu ne fais rien de mal</b>. Ce n’est pas ta faute… mais les ignorer, oui.', 'Revolut / Qonto (néobanques) pour les banques classiques']
])}
${piege(R`<p>Classer un élément <b>externe</b> en force est l'erreur la plus fréquente. « Le marché du bio est en croissance » n'est pas une force du restaurant : c'est une <b>opportunité</b>. Et l'emplacement choisi par l'entreprise est <b>interne</b> (force ou faiblesse), pas une menace.</p>`)}
`},

{
  id: 'swot-croisement', theme: 'swot', tps: ['p1'],
  titre: 'Du SWOT à la stratégie : le croisement',
  resume: 'Brainstormer, classer par impact, puis croiser un item interne avec un externe pour en tirer une action.',
  corps: R`
<h4>Marche à suivre</h4>
<ol><li><b>Brainstorming</b> : lister tous les items, sans les classer.</li><li><b>Classer</b> : trier par impact.</li><li><b>Croisement</b> : prendre un item de chaque côté (un interne + un externe) et poser une question précise pour en tirer une <b>action</b>.</li></ol>
<p>→ diagnostic → <b>stratégie claire</b>.</p>
${table(['Croisement', 'Nom', 'Question'], [
  ['<b>SO</b>', 'Attaquer', 'Comment mobiliser cette <b>force</b> pour saisir cette <b>opportunité</b> ?'],
  ['<b>ST</b>', 'Défendre', 'Comment mobiliser cette <b>force</b> pour neutraliser cette <b>menace</b> ?'],
  ['<b>WO</b>', 'Renforcer', 'Quelle <b>faiblesse</b> corriger en priorité pour pouvoir saisir cette <b>opportunité</b> ?'],
  ['<b>WT</b>', 'Sécuriser', 'Comment limiter les dégâts si cette <b>faiblesse</b> rencontre cette <b>menace</b> ?']
])}
${retenir(R`<p>Une bonne action est <b>concrète</b> (un verbe, un moyen, un délai) et cite explicitement les deux items croisés.</p>`)}
`},

{
  id: 'cas-bornes', theme: 'swot', tps: ['p1'],
  titre: 'Étude de cas : bornes de recharge ultra-rapide',
  resume: 'Une start-up installe des bornes sur des parkings de centres commerciaux périurbains, avec les commerçants.',
  corps: R`
${table(['Forces', 'Faiblesses'], [[
  '• borne ultra-rapide<br>• partenariats signés avec des centres commerciaux',
  '• financement : investissement massif<br>• pas d’image de marque face à Tesla<br>• dépendance à un seul fournisseur'
]])}
${table(['Opportunités', 'Menaces'], [[
  '• obligation UE d’installer des bornes dans les grands parkings d’ici 2027<br>• parc électrique en France : +25 %/an<br>• subventions publiques',
  '• volatilité du prix de l’électricité (fragilise le modèle)<br>• pénurie de semi-conducteurs (retarde les livraisons)<br>• Tesla ouvre ses Superchargeurs aux autres marques'
]])}
${table(['Croisement', 'Interne', 'Externe', 'Action'], [
  ['SO Attaquer', 'partenariats déjà signés', 'obligation UE', 'accélérer le déploiement sur les emplacements négociés avant que la réglementation n’y attire les concurrents'],
  ['ST Défendre', 'charge ultra-rapide', 'Superchargeurs ouverts', 'vendre la <b>vitesse</b> supérieure plutôt que rivaliser sur la notoriété'],
  ['WO Renforcer', 'aucune notoriété', 'subventions', 'financer des campagnes marketing avec une partie des subventions, plutôt que compter sur le bouche-à-oreille'],
  ['WT Sécuriser', 'un seul fournisseur', 'risque de pénurie', 'qualifier un 2e fournisseur avant de signer de nouveaux contrats']
])}
`},

{
  id: 'cas-restaurant', theme: 'swot', tps: ['p1'],
  titre: 'Étude de cas : restaurant 100 % bio à Nancy',
  resume: 'Hyper-centre de Nancy, spécialité « tout est bio » : un SWOT corrigé, avec les pièges de classement.',
  corps: R`
${table(['Forces (interne +)', 'Faiblesses (interne −)'], [[
  '• équipe / employés compétents<br>• concept clair et différenciant « tout est bio »<br>• emplacement très passant (si on le juge bon)',
  '• coûts fixes élevés (loyer hyper-centre)<br>• coûts variables élevés (matières premières bio)<br>• trésorerie et capital de départ faibles'
]])}
${table(['Opportunités (externe +)', 'Menaces (externe −)'], [[
  '• marché du bio en croissance<br>• peu de concurrence directe<br>• aides publiques',
  '• hausse du prix des produits bio<br>• crise économique (moins de sorties au restaurant)<br>• arrivée d’une chaîne concurrente'
]])}
${piege(R`<p>« Marché du bio en pleine croissance » est une <b>opportunité</b>, pas une force. « Emplacement pas stratégique » est une <b>faiblesse</b> (c'est un choix de l'entreprise), pas une menace.</p>`)}
<p><b>Croisements possibles</b> : SO = utiliser le concept 100 % bio pour capter la demande croissante (menu du midi pour les bureaux du centre). WT = coûts bio élevés × hausse des prix bio → contrats annuels avec des producteurs locaux pour fixer les prix.</p>
`},

/* ============================================================ PARTIE 2 */
{
  id: 'mkt-def', theme: 'mkt', tps: ['p2'],
  titre: 'Le marketing n’est pas la pub',
  resume: 'Le marketing = toutes les décisions qui font qu’un produit rencontre un besoin réel. La pub n’en est que la dernière brique.',
  corps: R`
${idee(R`<p><b>Marketing (MKT)</b> : ensemble des décisions qui font qu'un produit rencontre un <b>besoin réel</b>. La publicité n'est que la <b>dernière brique</b>.</p>
<p>Pour un ingénieur qui conçoit un produit, le marketing répond à une question qui <b>précède</b> la question technique :</p>`)}
<div class="box b-retenir"><strong>La question</strong><p>À <b>qui</b> ce produit rend-il service, et <b>pourquoi</b> ce client le choisirait-il plutôt qu'une autre alternative ?</p></div>
${retenir(R`<p>Concevoir d'abord la techno puis « chercher des clients » est l'erreur classique : on définit le besoin et la cible <b>avant</b>.</p>`)}
`},

{
  id: 'mkt-types', theme: 'mkt', tps: ['p2'],
  titre: 'Les types de marketing',
  resume: 'Digital, B2B, B2C, contenu, influence, relationnel : un même produit en combine souvent plusieurs.',
  corps: R`
${table(['Type', 'Principe', 'Exemple'], [
  ['<b>Digital</b>', 'publicité et présence sur les canaux numériques (réseaux sociaux, mails…)', 'Spotify : pubs sur les réseaux + mails de playlists personnalisées'],
  ['<b>B2B</b>', 'une entreprise vend à une entreprise', 'Salesforce vend des CRM aux équipes commerciales'],
  ['<b>B2C</b>', 'une entreprise s’adresse directement au consommateur particulier', 'Zara : réseaux sociaux, site et boutiques'],
  ['<b>Contenu</b>', 'créer du contenu utile pour attirer une audience <b>avant</b> de vendre', 'tutoriels, blog, vidéos'],
  ['<b>Influence</b>', 's’appuyer sur des créateurs pour toucher leur communauté', 'partenariats avec des influenceurs'],
  ['<b>Relationnel</b>', 's’appuyer sur les clients existants au lieu d’en chercher de nouveaux', 'programmes de fidélité']
])}
${retenir(R`<p>Un même produit combine souvent <b>plusieurs types en parallèle</b> (Spotify : digital + B2C + relationnel).</p>`)}
`},

{
  id: 'mkt-4p', theme: 'mkt', tps: ['p2'],
  titre: 'Les 4P du marketing mix',
  resume: 'Produit, Prix, Place (distribution), Promotion : 4 décisions qui doivent être cohérentes entre elles.',
  corps: R`
${idee(R`<p>Les 4P sont le <b>cadre de référence</b> pour construire une offre cohérente : 4 décisions qui doivent <b>s'aligner</b> entre elles.</p>`)}
${table(['P', 'Question', 'Exemple'], [
  ['<b>Produit</b>', 'Que vend-on réellement ? (fonctionnalités, promesse)', 'iPhone : se différencie par son intégration à l’écosystème Apple (iCloud, Watch, Mac)'],
  ['<b>Prix</b> (price)', 'Quel signal de positionnement envoie le prix ?', 'Tesla premium · Primark volume · Spotify freemium'],
  ['<b>Distribution</b> (place)', 'Comment le produit arrive-t-il jusqu’au client ?', 'Louis Vuitton exclusif (ses boutiques) · vente directe D2C'],
  ['<b>Promotion</b>', 'Comment le fait-on connaître ? (pub, relations publiques…)', 'Red Bull expérientiel · pubs pilotées par l’IA (Google Ads, Meta Ads)']
])}
${piege(R`<p>Incohérence typique : un produit premium vendu en promotion permanente dans des hypermarchés. Le prix et la distribution contredisent la promesse du produit.</p>`)}
`},

{
  id: 'mkt-prix-distrib', theme: 'mkt', tps: ['p2'],
  titre: 'Prix et distribution : les stratégies',
  resume: 'Le prix n’est pas un coût à couvrir mais un signal. La distribution peut être exclusive, directe, large…',
  corps: R`
<h4>Prix : un signal de positionnement</h4>
${table(['Stratégie', 'Idée', 'Exemple'], [
  ['Premium', 'prix élevé = qualité, statut, innovation', 'Tesla, Apple'],
  ['Volume (prix bas)', 'petite marge × énormément de ventes', 'Primark'],
  ['Freemium', 'gratuit de base, payant pour les options', 'Spotify Free / Premium']
])}
<h4>Distribution : par où passe le produit</h4>
${table(['Mode', 'Idée', 'Exemple'], [
  ['Exclusive', 'peu de points de vente, contrôlés par la marque', 'Louis Vuitton (ses seules boutiques)'],
  ['Directe (D2C)', 'la marque vend sans intermédiaire', 'site de la marque, Tesla'],
  ['Large / intensive', 'partout où le client passe', 'boissons, produits de grande consommation']
])}
${retenir(R`<p>Le prix ne se fixe pas seulement « coût + marge » : il dit au client <b>quel genre de produit</b> il achète.</p>`)}
`},

{
  id: 'stp', theme: 'mkt', tps: ['p2'],
  titre: 'Segmentation, ciblage, positionnement',
  resume: '« Plaire à tout le monde, c’est plaire à n’importe qui. » On découpe le marché, on choisit qui viser, on décide comment être perçu.',
  corps: R`
${table(['Étape', 'Ce qu’on fait'], [
  ['<b>A. Segmenter</b>', 'diviser le marché en <b>groupes homogènes</b> selon des critères géographiques, démographiques, psychographiques et comportementaux'],
  ['<b>B. Cibler</b>', 'choisir le ou les segments à servir'],
  ['<b>C. Positionner</b>', 'décider comment le produit doit être <b>perçu face à la concurrence</b> : prix, qualité, innovation, valeurs']
])}
<h4>Les 3 stratégies de ciblage</h4>
${table(['Ciblage', 'Principe', 'Exemple'], [
  ['Indifférencié', 'un seul produit pour tous', 'Coca-Cola'],
  ['Différencié', 'une offre adaptée à chaque segment', 'L’Oréal Paris / Lancôme / La Roche-Posay'],
  ['Niche', 'se concentrer sur un segment étroit et spécifique', 'Rolex']
])}
${retenir(R`<p>Segmentation = <b>analyse</b> du marché. Ciblage = <b>choix</b>. Positionnement = <b>image</b> voulue.</p>`)}
`},

{
  id: 'conso', theme: 'conso', tps: ['p2'],
  titre: 'Le comportement du consommateur',
  resume: 'Pourquoi on achète : 4 familles de facteurs, culturels, sociaux, personnels et psychologiques.',
  corps: R`
${table(['Facteurs', 'Ce que c’est', 'Exemple'], [
  ['<b>Culturels</b>', 'normes et valeurs d’une société', 'McDonald’s adapte ses menus en Inde (options végétariennes)'],
  ['<b>Sociaux</b>', 'famille, groupes d’appartenance, réseaux', 'Starbucks : communauté Instagram où les clients se recommandent des boissons'],
  ['<b>Personnels</b>', 'âge, profession, style de vie', 'GoPro cible un style de vie actif'],
  ['<b>Psychologiques</b>', 'motivation, perception, croyances', 'Apple a construit une perception de simplicité et d’innovation qui justifie son prix']
])}
${retenir(R`<p>Pour classer un exemple, demande-toi <b>d'où vient</b> l'influence : la société (culturel), les autres (social), la situation de la personne (personnel), ou sa tête (psychologique).</p>`)}
`},

/* ============================================================ PARTIE 3 */
{
  id: 'statuts', theme: 'juridique', tps: ['p3'],
  titre: 'Choisir un statut juridique',
  resume: 'Micro-entreprise (EI), SAS/SASU, SARL/EURL : responsabilité, impôts, charges sociales, dividendes.',
  corps: R`
${table(['', 'Micro / EI', 'SAS / SASU', 'SARL / EURL'], [
  ['Création', 'à son nom propre, sans statuts (≈ 30 min)', 'statuts + capital social', 'statuts + capital social'],
  ['Responsabilité', '<b>illimitée</b>', 'limitée aux apports', 'limitée aux apports'],
  ['Impôt', 'IR', 'IR (5 ans max) ou IS', 'IR (5 ans max) ou IS'],
  ['Plafond de CA', '≈ 200 k€ (vente) · ≈ 80 k€ (prestations)', '—', '—'],
  ['Charges sociales', '≈ 25 % du CA', '≈ 80–90 % (dirigeant assimilé salarié)', '≈ 45 % (dirigeant non salarié)'],
  ['Dividendes', '—', '≈ 31 % (IR + CSG/CRDS)', '≈ 31 %']
])}
${methode(R`<p><b>Choisir</b> : petite activité test, seul → <b>micro</b>. Projet à investisseurs, plusieurs associés, besoin de souplesse → <b>SAS</b> (SASU seul). Dirigeant qui veut payer moins de charges sur sa rémunération → <b>SARL/EURL</b>.</p>`)}
<p>Infos sur une entreprise existante : <b>pappers.fr</b>, <b>societe.com</b>.</p>
${piege(R`<p>Responsabilité <b>illimitée</b> = en cas de dettes, les créanciers peuvent saisir les <b>biens personnels</b> de l'entrepreneur.</p>`)}
`},

{
  id: 'impots', theme: 'juridique', tps: ['p3'],
  titre: 'IR, IS et calcul de l’impôt sur les sociétés',
  resume: 'IS : 15 % jusqu’à 42 500 € de bénéfice, 25 % au-delà. Au choix IR ou IS pendant 5 ans en société.',
  corps: R`
${table(['', 'IR (impôt sur le revenu)', 'IS (impôt sur les sociétés)'], [
  ['Qui paie', 'l’entrepreneur, sur sa déclaration perso', 'la société, sur son bénéfice'],
  ['Pour qui', 'micro / EI ; sociétés sur option (5 ans max)', 'SAS, SARL… par défaut']
])}
$$\text{IS} = 15\,\% \times \min(B, 42\,500) + 25\,\% \times \max(B - 42\,500,\ 0)$$
${methode(R`<p>Bénéfice $B = 60\,000$ € : $0{,}15\times42\,500 + 0{,}25\times17\,500 = 6\,375 + 4\,375 = 10\,750$ €.</p>`)}
<p>CA inférieur à <b>37 500 €</b> : exonération (franchise, d'après le cours).<br>Les <b>dividendes</b> versés aux associés sont ensuite taxés à ≈ 31 %.</p>
`},

{
  id: 'indicateurs', theme: 'finance', tps: ['p3'],
  titre: 'Du chiffre d’affaires au résultat net',
  resume: 'CA → marge brute → EBE → résultat net. Et la trésorerie, c’est autre chose : l’argent réellement en banque.',
  corps: R`
${table(['Indicateur', 'Définition', 'On enlève…'], [
  ['<b>CA</b> (chiffre d’affaires)', 'tout ce qui est facturé aux clients', '—'],
  ['<b>Marge brute</b>', 'ce qu’il reste une fois payé le coût direct des produits (marchandises)', 'achats / coût des produits'],
  ['<b>EBE</b> (excédent brut d’exploitation)', 'ce qu’il reste après les coûts de fonctionnement', 'salaires, loyers, charges courantes'],
  ['<b>Résultat net</b>', 'ce qu’il reste vraiment à la fin → revient aux actionnaires (dividendes)', 'amortissements, intérêts, impôts'],
  ['<b>Trésorerie</b>', 'l’argent réellement disponible à la banque à l’instant T (cash)', '— (ce n’est pas un résultat)']
])}
$$\text{taux de marge} = \frac{\text{marge}}{\text{CA}} \qquad \text{taux d'EBE} = \frac{\text{EBE}}{\text{CA}}$$
${table(['Rassurant', 'Inquiétant'], [['trésorerie stable ou en hausse ; EBE positif et en hausse', 'trésorerie qui baisse malgré un résultat positif ; marge qui se dégrade']])}
${piege(R`<p>Une entreprise peut être <b>rentable</b> (résultat > 0) et pourtant <b>manquer de cash</b> : ses clients paient tard (voir BFR).</p>`)}
`},

{
  id: 'bfr', theme: 'finance', tps: ['p3'],
  titre: 'Le BFR (besoin en fonds de roulement)',
  resume: 'L’argent bloqué parce que les clients paient après qu’on a payé les fournisseurs. BFR = créances clients − dettes fournisseurs.',
  corps: R`
${idee(R`<p>Le <b>BFR</b> mesure le <b>décalage de trésorerie</b> créé par le cycle d'exploitation : une entreprise paie souvent ses fournisseurs <b>avant</b> d'être payée par ses clients, et doit <b>financer</b> ce décalage.</p>`)}
$$\text{BFR} = \text{créances clients} - \text{dettes fournisseurs} \quad (+\ \text{stocks})$$
${methode(R`<p><b>Exemple du cours</b> : CA = 100 k€/mois, clients payés à <b>60 jours</b> → 2 mois de ventes en attente en permanence = <b>200 k€</b> de créances. Fournisseurs : 60 k€ payés à 30 jours = <b>60 k€</b> de dettes.</p>
$$\text{BFR} = 200 - 60 = 140 \text{ k€}$$
<p><b>Créances</b> = CA mensuel × (délai client en jours / 30). <b>Dettes</b> = achats mensuels × (délai fournisseur / 30).</p>`)}
${retenir(R`<p>Réduire le BFR : faire payer les clients <b>plus vite</b> (acomptes, délais courts), payer les fournisseurs <b>plus tard</b>, réduire les stocks. Un BFR qui grossit avec la croissance du CA peut asphyxier une entreprise rentable.</p>`)}
`},

{
  id: 'burn-rate', theme: 'finance', tps: ['p3'],
  titre: 'Burn rate et runway',
  resume: 'Le rythme auquel une start-up pas encore rentable brûle sa trésorerie, en €/mois. Runway = trésorerie / burn rate.',
  corps: R`
${idee(R`<p><b>Burn rate</b> (terme très utilisé dans les start-ups) : le rythme auquel une entreprise <b>pas encore rentable</b> consomme sa trésorerie disponible, exprimé en <b>€/mois</b>.</p>`)}
$$\text{runway (mois)} = \frac{\text{trésorerie disponible}}{\text{burn rate}}$$
${methode(R`<p>Trésorerie 1,2 M€, burn rate 150 k€/mois → runway = 8 mois avant d'être à sec (il faut lever des fonds ou devenir rentable avant).</p>`)}
${retenir(R`<p>« Les investisseurs regardent surtout notre burn rate, pas notre résultat comptable » : pour une entreprise pas encore rentable, ce qui compte est de savoir <b>combien de temps</b> il lui reste avant de manquer de cash.</p>`)}
`},

{
  id: 'lire-sante', theme: 'finance', tps: ['p3'],
  titre: 'Décoder les phrases de dirigeants',
  resume: 'Traduire « la marge se tasse de 3 points », « EBE de 18 % », « trésorerie asséchée par le BFR »…',
  corps: R`
${table(['Phrase', 'Ce que ça veut dire'], [
  ['« Le CA est en hausse de 12 %, mais la marge brute se tasse de 3 points. »', 'l’entreprise vend plus, mais gagne relativement moins sur chaque vente'],
  ['« On tourne avec un EBE de 18 %, ce qui est confortable pour le secteur. »', 'bonne rentabilité opérationnelle comparée aux entreprises du même secteur'],
  ['« Le résultat net est positif, mais notre trésorerie s’est asséchée cet hiver à cause du BFR. »', 'elle gagne de l’argent, mais son cash a fondu : elle a payé ses fournisseurs avant d’être payée par ses clients'],
  ['« Les investisseurs regardent notre burn rate, pas notre résultat. »', 'pas encore rentable : la question est combien de mois de cash il reste']
])}
${piege(R`<p>« 3 <b>points</b> » ≠ 3 % : une marge qui passe de 40 % à 37 % perd 3 points (soit 7,5 % de sa valeur).</p>`)}
`},

{
  id: 'technova-mecanova', theme: 'finance', tps: ['p3'],
  titre: 'Étude : TechNova contre MecaNova',
  resume: 'Une start-up qui grossit vite et perd de l’argent, face à une PME stable et rentable.',
  corps: R`
${table(['', 'TechNova (3 ans)', 'MecaNova (10 ans)'], [
  ['Marge brute', '4 800 000 € (60 %)', '2 400 000 € (57 %)'],
  ['Résultat net', '−900 000 €', '480 000 € (11 %)'],
  ['Trésorerie', '1 200 000 € (−60 % en 1 an)', '900 000 € (stable)']
])}
${methode(R`<p><b>TechNova</b> : forte croissance et <b>bonne marge brute</b> (le produit se vend bien), mais l'EBE négatif montre que les coûts de fonctionnement dépassent la marge (recrutements, marketing). Trésorerie passée d'environ 3 M€ à 1,2 M€ en un an → burn ≈ 1,8 M€/an = 150 k€/mois → <b>runway ≈ 8 mois</b> : il faut lever des fonds ou réduire les coûts.<br>
<b>MecaNova</b> : croissance faible mais <b>très rentable</b> (EBE 31 %), trésorerie stable : entreprise solide, peu de croissance.</p>`)}
${retenir(R`<p>Investisseur « croissance » → TechNova (potentiel, mais risque de manquer de cash). Banquier / investisseur prudent → MecaNova.</p>`)}
`},

{
  id: 'livrables', theme: 'projet', tps: ['p3'],
  titre: 'Le projet : livrables attendus',
  resume: 'Concept et cible, statut juridique, SWOT, 4P, fidélisation, lettre aux investisseurs.',
  corps: R`
<h4>Compte rendu d'équipe</h4>
<ol><li><b>Définir le concept</b> : à qui il s'adresse, quel besoin du client, quel statut juridique et pourquoi.</li>
<li><b>SWOT</b> (avec croisements et actions).</li>
<li><b>4P marketing</b> cohérents.</li>
<li><b>Stratégie de fidélisation</b> du client.</li>
<li><b>Lettre aux investisseurs</b> pour qu'ils investissent dans la start-up.</li></ol>
<p>Plus un <b>compte rendu par poste</b> (individuel).</p>
${methode(R`<p><b>Fidéliser</b> : programme de fidélité, abonnement, service après-vente, communauté (marketing relationnel), personnalisation.<br>
<b>Lettre aux investisseurs</b> : problème → solution → marché (taille, croissance) → avantage concurrentiel (forces du SWOT) → modèle économique (4P, prix) → équipe → chiffres clés (CA visé, burn rate, runway) → montant demandé et usage.</p>`)}
`}
  ];

  /* ============================================================ QCM (bonne réponse en premier) */
  const QCM = [
/* ---------- pratique ---------- */
{ theme: 'couts', type: 'pratique', tps: ['p1'], q: 'Sous-traitance : 45 €/pièce. Interne : machine à 300 000 € puis 20 €/pièce. Seuil d’indifférence ?',
  choix: ['12 000 pièces/an', '6 667 pièces/an', '4 615 pièces/an', '15 000 pièces/an'],
  expl: R`$Q^* = \frac{300\,000}{45 - 20} = 12\,000$. Les autres valeurs divisent par 45 ou par 65.` },
{ theme: 'couts', type: 'pratique', tps: ['p1'], q: 'Même cas (seuil 12 000). Le volume prévu est de 8 000 pièces/an. Que choisir ?',
  choix: ['Sous-traiter', 'Internaliser', 'Les deux coûtent pareil', 'Impossible à dire sans le prix de vente'],
  expl: R`Sous le seuil, la machine n'est pas assez utilisée : sous-traiter = $8000\times45 = 360$ k€ contre $300 + 8000\times20 = 460$ k€ en interne.` },
{ theme: 'couts', type: 'pratique', tps: ['p1'], q: 'CF = 150 000 €, coût sous-traitance 30 €/pièce, coût interne 18 €/pièce. Seuil ?',
  choix: ['12 500 pièces', '5 000 pièces', '8 333 pièces', '3 125 pièces'],
  expl: R`$\frac{150\,000}{30 - 18} = \frac{150\,000}{12} = 12\,500$.` },
{ theme: 'couts', type: 'pratique', tps: ['p1'], q: 'Cas du cours, volume 20 000 pièces/an. Combien économise-t-on en internalisant ?',
  choix: ['200 000 €', '500 000 €', '300 000 €', '0 €'],
  expl: R`Sous-traitance : $20\,000\times45 = 900$ k€. Interne : $300 + 20\,000\times20/1000 = 700$ k€. Écart 200 k€ = $(20\,000 - 12\,000)\times25$.` },
{ theme: 'couts', type: 'pratique', tps: ['p1'], q: 'Le loyer de l’usine est un coût…',
  choix: ['Fixe', 'Variable', 'Ni l’un ni l’autre', 'Semi-variable par définition'],
  expl: 'Il est payé même si l’usine ne produit rien.' },
{ theme: 'couts', type: 'pratique', tps: ['p1'], q: 'Les matières premières utilisées pour chaque pièce sont un coût…',
  choix: ['Variable', 'Fixe', 'Exceptionnel', 'D’investissement'],
  expl: 'Elles augmentent proportionnellement au nombre de pièces fabriquées.' },
{ theme: 'swot', type: 'pratique', tps: ['p1'], q: 'Une start-up possède un brevet sur sa technologie de recharge. Dans le SWOT, c’est…',
  choix: ['Une force', 'Une opportunité', 'Une faiblesse', 'Une menace'],
  expl: 'Interne (elle le détient) et positif, difficile à copier : une vraie force.' },
{ theme: 'swot', type: 'pratique', tps: ['p1'], q: 'L’UE impose des bornes de recharge dans les grands parkings d’ici 2027. Pour une start-up de bornes, c’est…',
  choix: ['Une opportunité', 'Une force', 'Une menace', 'Une faiblesse'],
  expl: 'Externe (elle ne l’a pas créée) et favorable : opportunité.' },
{ theme: 'swot', type: 'pratique', tps: ['p1'], q: 'DroneAgri : 3 ingénieurs, 0 commercial. Le manque de commercial est…',
  choix: ['Une faiblesse', 'Une menace', 'Une opportunité', 'Ce n’est pas un élément du SWOT'],
  expl: 'Interne (l’entreprise peut recruter) et négatif.' },
{ theme: 'swot', type: 'pratique', tps: ['p1'], q: 'Restaurant bio : « le marché du bio est en pleine croissance ». C’est…',
  choix: ['Une opportunité', 'Une force', 'Une faiblesse', 'Une menace'],
  expl: 'C’est une tendance externe que le restaurant n’a pas créée. Piège classique : ce n’est pas une force.' },
{ theme: 'swot', type: 'pratique', tps: ['p1'], q: '« Utiliser nos partenariats déjà signés pour profiter de l’obligation réglementaire UE » est un croisement…',
  choix: ['SO (attaquer)', 'ST (défendre)', 'WO (renforcer)', 'WT (sécuriser)'],
  expl: 'Une force (partenariats) mobilisée pour saisir une opportunité (réglementation).' },
{ theme: 'swot', type: 'pratique', tps: ['p1'], q: '« Qualifier un 2e fournisseur avant de signer, face au risque de pénurie de composants » est un croisement…',
  choix: ['WT (sécuriser)', 'SO (attaquer)', 'ST (défendre)', 'WO (renforcer)'],
  expl: 'Faiblesse (dépendance à un fournisseur) × menace (pénurie) → limiter les dégâts.' },
{ theme: 'mkt', type: 'pratique', tps: ['p2'], q: 'L’Oréal Paris, Lancôme et La Roche-Posay appartiennent au même groupe. Quelle stratégie de ciblage ?',
  choix: ['Différenciée', 'Indifférenciée', 'Niche', 'Freemium'],
  expl: 'Une offre adaptée à chaque segment (grand public, luxe, dermatologie).' },
{ theme: 'mkt', type: 'pratique', tps: ['p2'], q: 'Rolex se concentre sur un segment étroit et très spécifique. Ciblage…',
  choix: ['Niche', 'Différencié', 'Indifférencié', 'B2B'],
  expl: 'Un segment étroit servi de façon très spécifique.' },
{ theme: 'mkt', type: 'pratique', tps: ['p2'], q: 'Spotify propose une version gratuite et une version payante sans pub. Quelle stratégie de prix ?',
  choix: ['Freemium', 'Premium', 'Prix de volume', 'Distribution exclusive'],
  expl: 'Gratuit de base, payant pour les options.' },
{ theme: 'mkt', type: 'pratique', tps: ['p2'], q: 'Louis Vuitton ne vend que dans ses propres boutiques. Quel P du marketing mix est concerné ?',
  choix: ['Place (distribution exclusive)', 'Prix', 'Produit', 'Promotion'],
  expl: 'C’est la façon dont le produit arrive au client : une distribution exclusive.' },
{ theme: 'mkt', type: 'pratique', tps: ['p2'], q: 'Salesforce vend un CRM aux équipes commerciales d’autres entreprises. Type de marketing ?',
  choix: ['B2B', 'B2C', 'Influence', 'Indifférencié'],
  expl: 'Business to Business : une entreprise vend à une entreprise.' },
{ theme: 'conso', type: 'pratique', tps: ['p2'], q: 'McDonald’s propose des menus végétariens en Inde. Quel facteur d’achat est pris en compte ?',
  choix: ['Culturel', 'Social', 'Personnel', 'Psychologique'],
  expl: 'Les normes et valeurs de la société (habitudes alimentaires).' },
{ theme: 'conso', type: 'pratique', tps: ['p2'], q: 'GoPro cible les personnes au style de vie actif. Facteur…',
  choix: ['Personnel', 'Culturel', 'Social', 'Psychologique'],
  expl: 'Âge, profession, style de vie : facteurs personnels.' },
{ theme: 'finance', type: 'pratique', tps: ['p3'], q: 'Créances clients en attente : 200 k€. Dettes fournisseurs : 60 k€. BFR ?',
  choix: ['140 k€', '260 k€', '60 k€', '200 k€'],
  expl: R`BFR = créances − dettes = $200 - 60 = 140$ k€.` },
{ theme: 'finance', type: 'pratique', tps: ['p3'], q: 'CA de 90 k€/mois, clients payés à 60 jours, dettes fournisseurs 50 k€. BFR ?',
  choix: ['130 k€', '40 k€', '180 k€', '230 k€'],
  expl: R`Créances = $90\times2 = 180$ k€ ; BFR = $180 - 50 = 130$ k€.` },
{ theme: 'finance', type: 'pratique', tps: ['p3'], q: 'Trésorerie 1,2 M€, burn rate 150 k€/mois. Runway ?',
  choix: ['8 mois', '12 mois', '18 mois', '1,8 mois'],
  expl: R`$1\,200 / 150 = 8$ mois avant d'être à court de cash.` },
{ theme: 'finance', type: 'pratique', tps: ['p3'], q: 'MecaNova : CA 4,2 M€, EBE 1,3 M€. Taux d’EBE ?',
  choix: ['≈ 31 %', '≈ 57 %', '≈ 11 %', '≈ 3 %'],
  expl: R`$1{,}3 / 4{,}2 \approx 0{,}31$. 57 % est le taux de marge brute, 11 % le taux de résultat net.` },
{ theme: 'juridique', type: 'pratique', tps: ['p3'], q: 'Bénéfice d’une SAS : 60 000 €. Impôt sur les sociétés ?',
  choix: ['10 750 €', '9 000 €', '15 000 €', '6 375 €'],
  expl: R`$15\,\%\times42\,500 + 25\,\%\times17\,500 = 6\,375 + 4\,375 = 10\,750$ €.` },
{ theme: 'juridique', type: 'pratique', tps: ['p3'], q: 'Une fondatrice seule veut protéger ses biens personnels, accueillir des investisseurs plus tard et être assimilée salariée. Statut ?',
  choix: ['SASU', 'Micro-entreprise', 'EURL', 'Entreprise individuelle'],
  expl: 'Responsabilité limitée, souplesse pour faire entrer des investisseurs (en devenant SAS), dirigeant assimilé salarié.' },
{ theme: 'finance', type: 'pratique', tps: ['p3'], q: '« Le résultat net est positif, mais la trésorerie s’est asséchée à cause du BFR. » Cela veut dire…',
  choix: ['L’entreprise gagne de l’argent mais attend d’être payée par ses clients après avoir payé ses fournisseurs', 'L’entreprise perd de l’argent', 'Les impôts ont absorbé tout le résultat', 'Le CA a baissé'],
  expl: 'Rentable sur le papier, mais le cash est bloqué dans les créances clients.' },

/* ---------- théorie ---------- */
{ theme: 'couts', type: 'theorie', tps: ['p1'], q: 'Qu’est-ce que le seuil d’indifférence ?',
  choix: ['Le volume annuel pour lequel sous-traiter et internaliser coûtent le même prix', 'Le volume à partir duquel l’entreprise est rentable', 'Le prix de vente minimum', 'Le coût fixe de la machine'],
  expl: R`$Q^* = CF/(CV_{ext} - CV_{int})$. Ne pas confondre avec le seuil de rentabilité.` },
{ theme: 'couts', type: 'theorie', tps: ['p1'], q: 'Pourquoi utiliser une grille d’arbitrage en plus du calcul du seuil ?',
  choix: ['Pour intégrer des critères non chiffrés : flexibilité, qualité/délais, dépendance, cœur de métier', 'Pour recalculer le seuil plus précisément', 'Parce que le calcul est souvent faux', 'Pour fixer le prix de vente'],
  expl: 'Un calcul favorable peut être contredit par un marché incertain ou une dépendance dangereuse.' },
{ theme: 'swot', type: 'theorie', tps: ['p1'], q: 'Quelle est la différence entre les facteurs internes et externes d’un SWOT ?',
  choix: ['Internes = ce que l’entreprise contrôle ; externes = ce qu’elle subit', 'Internes = positifs ; externes = négatifs', 'Internes = passés ; externes = futurs', 'Internes = chiffrés ; externes = qualitatifs'],
  expl: 'Forces et faiblesses sont internes ; opportunités et menaces sont externes.' },
{ theme: 'swot', type: 'theorie', tps: ['p1'], q: 'Quel test permet de savoir si une force en est vraiment une ?',
  choix: ['Un concurrent peut-il la copier en quelques mois ? Si oui, ce n’est qu’un atout', 'Est-ce qu’elle coûte cher ?', 'Est-ce qu’elle est chiffrable ?', 'Est-ce qu’elle vient du marché ?'],
  expl: 'Une vraie force donne un avantage concurrentiel durable.' },
{ theme: 'swot', type: 'theorie', tps: ['p1'], q: 'Pourquoi dit-on qu’une faiblesse n’est pas une fatalité ?',
  choix: ['C’est un manque identifié en interne, donc une chose sur laquelle on peut agir en premier', 'Parce qu’elle disparaît toute seule', 'Parce qu’elle est externe', 'Parce qu’elle n’a pas d’impact'],
  expl: 'Comme elle est interne, une décision peut la corriger (recruter, se former, financer…).' },
{ theme: 'swot', type: 'theorie', tps: ['p1'], q: 'À quoi sert le croisement SO / ST / WO / WT ?',
  choix: ['À transformer le diagnostic en actions concrètes', 'À classer les items par ordre alphabétique', 'À calculer un score', 'À remplacer le brainstorming'],
  expl: 'On croise un item interne et un item externe pour en tirer une décision.' },
{ theme: 'swot', type: 'theorie', tps: ['p1'], q: 'Une menace, selon le cours, c’est…',
  choix: ['Un facteur externe qui peut nuire même si l’entreprise ne fait rien de mal', 'Une erreur de gestion de l’entreprise', 'Une faiblesse interne grave', 'Un concurrent moins bon'],
  expl: 'Ce n’est pas ta faute, mais l’ignorer, si.' },
{ theme: 'mkt', type: 'theorie', tps: ['p2'], q: 'Quelle définition du marketing donne le cours ?',
  choix: ['L’ensemble des décisions qui font qu’un produit rencontre un besoin réel', 'La publicité', 'La vente en magasin', 'La fixation du prix uniquement'],
  expl: 'La publicité n’est que la dernière brique.' },
{ theme: 'mkt', type: 'theorie', tps: ['p2'], q: 'Quelle question le marketing pose-t-il avant la question technique ?',
  choix: ['À qui ce produit rend-il service, et pourquoi ce client le choisirait-il plutôt qu’une alternative ?', 'Combien coûte le produit à fabriquer ?', 'Quelle technologie utiliser ?', 'Quel statut juridique choisir ?'],
  expl: 'On part du besoin et de la cible, pas de la technologie.' },
{ theme: 'mkt', type: 'theorie', tps: ['p2'], q: 'Pourquoi segmenter le marché ?',
  choix: ['Parce que « plaire à tout le monde, c’est plaire à n’importe qui »', 'Pour baisser les prix', 'Pour éviter de faire de la pub', 'Pour choisir un statut juridique'],
  expl: 'On découpe en groupes homogènes pour adapter l’offre.' },
{ theme: 'mkt', type: 'theorie', tps: ['p2'], q: 'Qu’est-ce que le positionnement ?',
  choix: ['La façon dont le produit doit être perçu face à la concurrence (prix, qualité, innovation, valeurs)', 'L’emplacement en rayon', 'Le choix du segment visé', 'Le classement Google'],
  expl: 'Segmentation = analyse ; ciblage = choix ; positionnement = image voulue.' },
{ theme: 'mkt', type: 'theorie', tps: ['p2'], q: 'Que signifie « le prix est un signal » ?',
  choix: ['Le prix dit au client quel genre de produit il achète (premium, volume…)', 'Le prix doit juste couvrir les coûts', 'Le prix change tous les jours', 'Le prix est fixé par l’État'],
  expl: 'Le prix n’est pas seulement un coût à couvrir : c’est un élément de positionnement.' },
{ theme: 'mkt', type: 'theorie', tps: ['p2'], q: 'Pourquoi les 4P doivent-ils être cohérents ?',
  choix: ['Parce qu’une décision qui contredit les autres brouille la promesse faite au client', 'Parce que la loi l’impose', 'Pour simplifier la comptabilité', 'Ils sont indépendants, ils n’ont pas à l’être'],
  expl: 'Un produit premium vendu en promotion dans des discounters perd sa crédibilité.' },
{ theme: 'mkt', type: 'theorie', tps: ['p2'], q: 'Le marketing relationnel consiste à…',
  choix: ['S’appuyer sur les clients existants plutôt que d’en chercher de nouveaux', 'Payer des influenceurs', 'Vendre à d’autres entreprises', 'Créer du contenu gratuit'],
  expl: 'Fidélisation, programmes de fidélité, communauté.' },
{ theme: 'juridique', type: 'theorie', tps: ['p3'], q: 'Que signifie « responsabilité illimitée » (entreprise individuelle) ?',
  choix: ['En cas de dettes, les biens personnels de l’entrepreneur peuvent être saisis', 'L’entreprise peut faire un CA illimité', 'L’entrepreneur n’a aucun impôt', 'Il peut embaucher sans limite'],
  expl: 'Dans une SAS ou une SARL, la responsabilité est limitée aux apports.' },
{ theme: 'finance', type: 'theorie', tps: ['p3'], q: 'Quelle est la différence entre résultat net et trésorerie ?',
  choix: ['Le résultat est ce que l’entreprise a gagné sur la période ; la trésorerie est l’argent réellement en banque à un instant donné', 'C’est la même chose', 'La trésorerie inclut les impôts, pas le résultat', 'Le résultat est toujours plus grand'],
  expl: 'Les décalages de paiement (BFR) les font diverger.' },
{ theme: 'finance', type: 'theorie', tps: ['p3'], q: 'Pourquoi une entreprise a-t-elle un BFR ?',
  choix: ['Elle paie souvent ses fournisseurs avant d’être payée par ses clients', 'Parce qu’elle fait des pertes', 'À cause des impôts', 'Parce qu’elle emprunte'],
  expl: 'Il faut financer ce décalage de trésorerie.' },
{ theme: 'finance', type: 'theorie', tps: ['p3'], q: 'Qu’est-ce que le burn rate ?',
  choix: ['Le rythme, en €/mois, auquel une entreprise pas encore rentable consomme sa trésorerie', 'Le taux de marge brute', 'Le taux d’impôt', 'La vitesse de croissance du CA'],
  expl: 'Runway = trésorerie / burn rate.' },
{ theme: 'finance', type: 'theorie', tps: ['p3'], q: 'Quel signal est inquiétant selon le cours ?',
  choix: ['Une trésorerie qui baisse malgré un résultat positif', 'Un EBE positif en hausse', 'Une trésorerie stable', 'Un CA en hausse avec une marge stable'],
  expl: 'Autre signal inquiétant : une marge qui se dégrade.' },
{ theme: 'finance', type: 'theorie', tps: ['p3'], q: 'L’EBE, c’est…',
  choix: ['Ce qu’il reste après avoir payé les coûts de fonctionnement', 'Tout ce qui est facturé aux clients', 'L’argent sur le compte en banque', 'Ce qui revient aux actionnaires'],
  expl: 'Excédent brut d’exploitation : mesure la rentabilité de l’activité courante.' }
  ];

  const LEXIQUE = [
    ['Burn rate', 'Trésorerie consommée par mois par une entreprise pas encore rentable.'],
    ['Ciblage', 'Choix du ou des segments de marché à servir (indifférencié, différencié, niche).'],
    ['Cœur de métier', 'Activité qui fait la différence de l’entreprise ; on évite de la sous-traiter.'],
    ['Créances clients', 'Sommes facturées mais pas encore encaissées.'],
    ['Croisement SWOT', 'Associer un item interne et un externe (SO, ST, WO, WT) pour en tirer une action.'],
    ['Dettes fournisseurs', 'Achats reçus mais pas encore payés.'],
    ['Dividendes', 'Part du résultat net versée aux actionnaires (taxée ≈ 31 %).'],
    ['Faiblesse', 'Élément interne qui désavantage le projet, sur lequel on peut agir.'],
    ['Force', 'Atout interne qui donne un avantage concurrentiel difficile à copier.'],
    ['Freemium', 'Version gratuite de base + options payantes (Spotify).'],
    ['Grille d’arbitrage', 'Critères qualitatifs du « faire ou faire faire » : flexibilité, qualité/délais, dépendance, cœur de métier.'],
    ['Make or buy', 'Faire (internaliser) ou faire faire (sous-traiter).'],
    ['Marge brute', 'CA moins le coût direct des produits vendus.'],
    ['Marketing mix (4P)', 'Produit, Prix, Place (distribution), Promotion.'],
    ['Menace', 'Facteur externe qui peut nuire au projet, même sans faute de sa part.'],
    ['Niche', 'Ciblage d’un segment étroit et très spécifique (Rolex).'],
    ['Opportunité', 'Tendance externe favorable que le projet peut saisir sans l’avoir créée.'],
    ['Positionnement', 'Image voulue du produit face à la concurrence (prix, qualité, innovation, valeurs).'],
    ['Responsabilité limitée', 'Les associés ne perdent au plus que leurs apports.'],
    ['Résultat net', 'Ce qu’il reste à la fin, après toutes les charges et impôts ; revient aux actionnaires.'],
    ['Runway', 'Nombre de mois avant d’être à court de trésorerie = trésorerie / burn rate.'],
    ['Segmentation', 'Découpage du marché en groupes homogènes (géographiques, démographiques, psychographiques, comportementaux).'],
    ['Trésorerie', 'Argent réellement disponible en banque à un instant donné.']
  ];

  /*
   * Abréviations : [forme développée, définition courte].
   * Elles alimentent le lexique et les info-bulles affichées au survol partout dans la matière.
   */
  const ABREV = {
    'B2B': ['Business to Business', 'une entreprise vend à d’autres entreprises (ex. Salesforce).'],
    'B2C': ['Business to Consumer', 'une entreprise vend directement à des particuliers (ex. Zara).'],
    'BFR': ['Besoin en fonds de roulement', 'argent bloqué par le décalage entre paiement des fournisseurs et encaissement des clients = créances clients − dettes fournisseurs.'],
    'CA': ['Chiffre d’affaires', 'tout ce qui est facturé aux clients sur la période.'],
    'CF': ['Coûts fixes', 'coûts payés même si la production est nulle (loyer, encadrement, assurances, machine).'],
    'CV': ['Coûts variables', 'coûts proportionnels au volume produit (matières, énergie des machines).'],
    'CVext': ['Coût variable externe', 'coût par pièce si on sous-traite (ex. 45 €/pièce).'],
    'CVint': ['Coût variable interne', 'coût par pièce si on fabrique soi-même (ex. 20 €/pièce).'],
    'Q*': ['Seuil d’indifférence', 'volume annuel où sous-traiter et internaliser coûtent pareil : Q* = CF / (CVext − CVint).'],
    'CR': ['Compte rendu', 'document de synthèse rendu en fin de projet (par équipe ou par poste).'],
    'CRM': ['Customer Relationship Management', 'logiciel de gestion de la relation client (fichier clients, suivi commercial).'],
    'CSG': ['Contribution sociale généralisée', 'prélèvement social sur les revenus, dont les dividendes.'],
    'CRDS': ['Contribution au remboursement de la dette sociale', 'autre prélèvement social, payé avec la CSG.'],
    'D2C': ['Direct to Consumer', 'la marque vend directement au client, sans intermédiaire.'],
    'EBE': ['Excédent brut d’exploitation', 'ce qu’il reste après les coûts de fonctionnement (salaires, loyers) : la rentabilité de l’activité courante.'],
    'EI': ['Entreprise individuelle', 'entreprise au nom propre de l’entrepreneur (dont la micro-entreprise) ; responsabilité illimitée.'],
    'EURL': ['Entreprise unipersonnelle à responsabilité limitée', 'SARL à un seul associé ; dirigeant non salarié, charges ≈ 45 %.'],
    'IA': ['Intelligence artificielle', 'ici : publicité ciblée et optimisée automatiquement (Google Ads, Meta Ads).'],
    'IR': ['Impôt sur le revenu', 'payé par l’entrepreneur sur ses revenus personnels.'],
    'IS': ['Impôt sur les sociétés', 'payé par la société sur son bénéfice : 15 % jusqu’à 42 500 €, 25 % au-delà.'],
    'k€': ['Kilo-euros', 'milliers d’euros (300 k€ = 300 000 €).'],
    'M€': ['Millions d’euros', '1,2 M€ = 1 200 000 €.'],
    'MKT': ['Marketing', 'ensemble des décisions qui font qu’un produit rencontre un besoin réel.'],
    'PME': ['Petite ou moyenne entreprise', 'entreprise de moins de 250 salariés.'],
    'R&D': ['Recherche et développement', 'activité de conception de nouveaux produits ou technologies.'],
    'RH': ['Ressources humaines', 'service qui gère le personnel (recrutement, paie, formation).'],
    'SARL': ['Société à responsabilité limitée', 'société de 2 associés ou plus ; responsabilité limitée aux apports ; gérant non salarié.'],
    'SAS': ['Société par actions simplifiée', 'statut souple, apprécié des investisseurs ; responsabilité limitée ; dirigeant assimilé salarié (charges ≈ 80–90 %).'],
    'SASU': ['Société par actions simplifiée unipersonnelle', 'SAS à un seul associé.'],
    'SO': ['Strengths × Opportunities', 'croisement « attaquer » : utiliser une force pour saisir une opportunité.'],
    'ST': ['Strengths × Threats', 'croisement « défendre » : utiliser une force pour neutraliser une menace.'],
    'SWOT': ['Strengths, Weaknesses, Opportunities, Threats', 'Forces, Faiblesses (internes), Opportunités, Menaces (externes).'],
    'UE': ['Union européenne', 'ici : source de réglementations (ex. obligation de bornes de recharge d’ici 2027).'],
    'WO': ['Weaknesses × Opportunities', 'croisement « renforcer » : corriger une faiblesse pour saisir une opportunité.'],
    'WT': ['Weaknesses × Threats', 'croisement « sécuriser » : limiter les dégâts quand une faiblesse rencontre une menace.']
  };
  // Lexique final : mots du cours + abréviations (« CA — Chiffre d’affaires »), triés.
  const LEXIQUE_COMPLET = LEXIQUE
    .concat(Object.entries(ABREV).map(([k, [dev, def]]) => [`${k} — ${dev}`, def.charAt(0).toUpperCase() + def.slice(1)]))
    .sort((a, b) => a[0].localeCompare(b[0], 'fr', { sensitivity: 'base' }));

  MATIERES.push({
    id: 'entrepreneuriat',
    nom: 'Entrepreneuriat & gestion',
    sousTitre: 'Stratégie · Marketing · Finance',
    description: 'Coûts et « faire ou faire faire », SWOT et stratégie, marketing (4P, segmentation, consommateur), statuts juridiques et indicateurs financiers (BFR, burn rate) — d’après les notes de cours.',
    couleur: '#cf3a3a',
    filtreLabel: 'Toutes les parties',
    parties: true,
    partiesInfo: {
      p1: { titre: 'Stratégie & décision', couleur: '#3b6fd8', desc: 'Coûts fixes et variables, faire ou faire faire (seuil d’indifférence), grille d’arbitrage, SWOT et croisements, études de cas.' },
      p2: { titre: 'Marketing', couleur: '#d4730b', desc: 'Marketing ≠ pub, types de marketing, 4P, segmentation / ciblage / positionnement, comportement du consommateur.' },
      p3: { titre: 'Créer & piloter', couleur: '#1a8a5a', desc: 'Statuts juridiques, IR/IS, du CA au résultat net, trésorerie, BFR, burn rate, livrables du projet.' }
    },
    pratiqueLabel: 'Pratique (calculs, cas, classement)',
    memoMaxPt: 12,
    themes: THEMES, tps: TPS, tpsCourt: TPS_COURT, fiches: FICHES, qcm: QCM, lexique: LEXIQUE_COMPLET,
    abreviations: ABREV,
    makeOrBuyPlot
  });
})();
