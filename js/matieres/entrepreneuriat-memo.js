/*
 * Mémos A4 recto verso d'Entrepreneuriat & gestion, un par partie.
 * Recto = tout le cours de la partie ; verso = tous les exercices / études de cas corrigés.
 */
(function () {
  const M = MATIERES.find(m => m.id === 'entrepreneuriat');
  if (!M) return;

  const S = (t, h) => `<section class="ms"><h3>${t}</h3>${h}</section>`;
  const K = h => `<div class="mk">${h}</div>`;
  const F = h => `<div class="mf">${h}</div>`;
  const EX = (t, h) => `<div class="mex"><b>${t}</b> ${h}</div>`;
  const P = h => `<div class="mp"><b>Pièges.</b> ${h}</div>`;
  const ABBR = (...keys) => S('Abréviations', `<p>${keys.map(k => `<b>${k}</b> ${M.abreviations[k][0].toLowerCase()}`).join(' · ')}</p>`);
  const swot = (s, w, o, t) => table(['<b>Forces</b> (interne +)', '<b>Faiblesses</b> (interne −)'], [[s, w]]) + table(['<b>Opportunités</b> (externe +)', '<b>Menaces</b> (externe −)'], [[o, t]]);

  M.memos = {

/* ================================================================ PARTIE 1 */
p1: {
  titre: 'Partie 1 — Stratégie & décision',
  couleur: '#3b6fd8',
  labels: ['Cours', 'Exercices'],
  pages: [
R`
${S('Coûts fixes et variables', R`
${table(['', 'Coûts fixes (CF)', 'Coûts variables (CV)'], [
  ['Définition', 'indépendants du volume : payés même si production = 0', 'proportionnels au volume fabriqué'],
  ['Exemples', 'salaires d’encadrement, loyer, énergie des bureaux, assurances, machine (investissement)', 'matières premières, énergie des machines, usure des outils, sous-traitance à la pièce']
])}
${F(R`Coût total $= CF + c_v \times Q$&emsp;($c_v$ = coût variable par pièce)`)}
<p>Un gros coût fixe ne devient rentable que si on produit <b>beaucoup</b> : il est alors réparti sur beaucoup de pièces.</p>
`)}
${S('Faire ou faire faire (make or buy)', R`
<p>Option A : <b>sous-traiter</b> (pas de coût fixe, coût par pièce élevé). Option B : <b>internaliser</b> (investir, puis coût par pièce plus faible).</p>
${F(R`Seuil d'indifférence : $Q^* = \dfrac{CF}{CV_{ext} - CV_{int}}$`)}
<p>$Q^*$ = volume <b>annuel</b> où les deux options coûtent pareil. $CV_{ext} - CV_{int}$ = économie par pièce en internalisant ; $Q^*$ = nombre de pièces pour rembourser l'investissement.</p>
${K(R`Volume prévu $\lt Q^*$ → <b>sous-traiter</b> ; volume prévu $\gt Q^*$ → <b>internaliser</b>.<br>Cours : $\frac{300\,000}{45-20} = 12\,000$ pièces/an.`)}
${M.makeOrBuyPlot('Coût total des deux options ; croisement en Q* = 12 000')}
`)}
${S('Grille d’arbitrage (hors calcul)', R`
${table(['Critère', 'Question', 'Penche vers'], [
  ['1. Flexibilité & risque de volume', 'le marché peut-il baisser sous Q* ?', 'incertain → sous-traiter'],
  ['2. Qualité, tolérance, délais', 'le sous-traitant tient-il les exigences ?', 'exigeant → internaliser'],
  ['3. Dépendance fournisseurs', 'et s’il augmente ses prix / fait faillite ?', 'risque → internaliser ou 2e fournisseur'],
  ['4. Cœur de métier', 'est-ce ce qui nous différencie ?', 'oui → internaliser']
])}
<p>Conclusion type : « Le calcul donne …, mais compte tenu de [critère], je recommande … ».</p>
`)}
${S('SWOT : le principe', R`
<p>Pourquoi un ingénieur en a besoin : <b>diagnostic rapide</b> → « le produit a-t-il une chance de trouver sa place sur le marché ? ». Utile pour une start-up, une décision de lancer un produit (R&D), un appel d'offres.</p>
${table(['', 'Positif', 'Négatif'], [
  ['<b>Interne</b> (tu contrôles)', '<b>S</b> Strengths / Forces', '<b>W</b> Weaknesses / Faiblesses'],
  ['<b>Externe</b> (tu subis)', '<b>O</b> Opportunities / Opportunités', '<b>T</b> Threats / Menaces']
])}
${K(R`<b>Test</b> : « puis-je le changer par une décision ? » → oui = interne (S/W) ; non = externe (O/T).`)}
`)}
${S('Remplir chaque case', R`
${table(['Case', 'Définition', 'Exemple'], [
  ['<b>Forces</b>', 'ce que tu fais mieux ; ressource rare (brevet, techno, expertise). Test : copiable en quelques mois ? → simple atout', 'BlaBlaCar (communauté)'],
  ['<b>Faiblesses</b>', 'ce qui te manque en interne ; maillon faible de la chaîne de valeur. Pas une fatalité : on agit dessus en 1er', 'Deezer vs Spotify'],
  ['<b>Opportunités</b>', 'tendance externe favorable, saisie sans l’avoir créée ; changement réglementaire favorable', 'Doctolib, Céline Dion'],
  ['<b>Menaces</b>', 'concurrent, techno, risques macro (coûts, réglementation) ; pas ta faute, mais l’ignorer oui', 'Revolut / Qonto pour les banques']
])}
`)}
${ABBR('CF', 'CV', 'CVext', 'CVint', 'Q*', 'SWOT', 'SO', 'ST', 'WO', 'WT', 'R&D', 'UE', 'k€')}
${S('Marche à suivre et croisements', R`
<ol><li><b>Brainstorming</b> : tout lister sans classer.</li><li><b>Classer</b> par impact.</li><li><b>Croiser</b> un interne + un externe → une question → une <b>action</b>. Diagnostic → stratégie claire.</li></ol>
${table(['', 'Nom', 'Question'], [
  ['<b>SO</b>', 'Attaquer', 'mobiliser cette force pour saisir cette opportunité ?'],
  ['<b>ST</b>', 'Défendre', 'mobiliser cette force pour neutraliser cette menace ?'],
  ['<b>WO</b>', 'Renforcer', 'quelle faiblesse corriger pour saisir cette opportunité ?'],
  ['<b>WT</b>', 'Sécuriser', 'limiter les dégâts si cette faiblesse rencontre cette menace ?']
])}
${K(R`Une bonne action = un <b>verbe</b> + un <b>moyen</b> (+ un délai), et cite les 2 items croisés.`)}
`)}
`,
R`
${S('Exo : faire ou faire faire', R`
${EX('Énoncé type', R`sous-traitance 45 €/pièce ; interne : machine 300 k€ + 20 €/pièce.`)}
<p>① écrire les deux coûts totaux : $C_A = 45Q$, $C_B = 300\,000 + 20Q$ ; ② égaler : $45Q = 300\,000 + 20Q$ → $Q^* = 12\,000$ ; ③ comparer au volume prévu ; ④ nuancer avec la grille.</p>
${table(['Volume', 'Sous-traiter', 'Interne', 'Choix'], [
  ['8 000', '360 k€', '460 k€', 'sous-traiter (−100 k€)'], ['12 000', '540 k€', '540 k€', 'indifférent'], ['20 000', '900 k€', '700 k€', 'interne (−200 k€)']
])}
${EX('Variante', R`CF 150 k€, 30 €/pièce dehors, 18 €/pièce dedans → $Q^* = 150\,000/12 = 12\,500$.`)}
${EX('Variante inverse', R`on veut un seuil à 10 000 avec un écart de 25 €/pièce → investissement max = $10\,000\times25 = 250$ k€.`)}
${EX('Classer les coûts', R`loyer, salaire du directeur, assurance → <b>fixes</b> ; matière, électricité des machines, emballage par pièce → <b>variables</b>.`)}
`)}
${S('Étude de cas : bornes de recharge ultra-rapide', R`
<p>Start-up, parkings de centres commerciaux périurbains, partenariat avec des commerçants locaux.</p>
${swot('• borne ultra-rapide<br>• partenariats signés', '• investissement massif, financement<br>• pas d’image de marque face à Tesla<br>• un seul fournisseur', '• obligation UE de bornes d’ici 2027<br>• parc électrique +25 %/an<br>• subventions', '• prix de l’électricité volatils<br>• pénurie de semi-conducteurs<br>• Tesla ouvre ses Superchargeurs')}
${table(['', 'Interne', 'Externe', 'Action'], [
  ['SO', 'partenariats signés', 'obligation UE', 'déployer vite sur les sites négociés avant les concurrents'],
  ['ST', 'charge ultra-rapide', 'Superchargeurs Tesla', 'vendre la vitesse, pas la notoriété'],
  ['WO', 'pas de notoriété', 'subventions', 'financer des campagnes marketing'],
  ['WT', '1 seul fournisseur', 'pénurie', 'qualifier un 2e fournisseur avant de signer']
])}
`)}
${S('Étude de cas : DroneAgri (corrigé proposé)', R`
<p>Drones autonomes qui analysent des exploitations agricoles moyennes. Équipe : 3 ingénieurs, 0 commercial. Demandé : SWOT (≥ 2 items/case) + une stratégie SO + une WT.</p>
${swot('• expertise technique forte (drones autonomes, analyse d’images)<br>• solution clé en main (vol + diagnostic)', '• aucun commercial, pas de réseau agricole<br>• petite équipe, pas de notoriété<br>• financement limité', '• agriculture de précision en croissance<br>• pression pour réduire engrais, pesticides et eau<br>• aides à l’innovation agricole<br>• manque de main-d’œuvre agricole', '• réglementation des drones (vols hors vue)<br>• concurrents (gros fabricants, imagerie satellite)<br>• budgets serrés des exploitations, prix agricoles volatils<br>• météo')}
${EX('SO (attaquer)', R`expertise drone × réduction des intrants → offre « diagnostic pour réduire engrais et pesticides » vendue avec un <b>retour sur investissement chiffré</b> pour l'agriculteur.`)}
${EX('WT (sécuriser)', R`0 commercial × budgets serrés → passer par des <b>coopératives agricoles</b> et distributeurs de matériel (ils ont le réseau) et proposer un <b>abonnement / location</b> plutôt qu'un achat.`)}
${EX('Bonus WO', R`pas de commercial × croissance du marché → recruter un profil agro-commercial, financé par une aide à l'innovation.`)}
`)}
${S('Étude de cas : restaurant bio, Nancy (corrigé)', R`
${swot('• équipe compétente<br>• concept clair « 100 % bio »', '• loyer élevé (hyper-centre)<br>• matières bio chères<br>• trésorerie / capital faibles', '• marché du bio en croissance<br>• peu de concurrence<br>• aides publiques', '• hausse des prix du bio<br>• crise économique<br>• arrivée d’une chaîne')}
<p>SO : capter la demande bio avec une formule midi pour les bureaux du centre. WT : contrats annuels avec des producteurs locaux pour bloquer les prix.</p>
`)}
${P(R`classer une tendance du marché en <b>force</b> (c'est une opportunité) · classer l'emplacement choisi en <b>menace</b> (c'est interne) · action vague (« communiquer plus ») · oublier de comparer le volume prévu à $Q^*$ · inverser le choix (sous le seuil on sous-traite).`)}
`
  ]
},

/* ================================================================ PARTIE 2 */
p2: {
  titre: 'Partie 2 — Marketing',
  couleur: '#d4730b',
  labels: ['Cours', 'Exercices'],
  pages: [
R`
${S('Le marketing n’est pas la pub', R`
${F(R`<b>Marketing</b> = ensemble des décisions qui font qu'un produit rencontre un <b>besoin réel</b>. La pub n'est que la <b>dernière brique</b>.`)}
<p>Question qui <b>précède</b> la question technique pour un ingénieur : <b>à qui</b> ce produit rend-il service, et <b>pourquoi</b> ce client le choisirait-il plutôt qu'une autre alternative ?</p>
`)}
${S('Types de marketing', R`
${table(['Type', 'Principe', 'Exemple'], [
  ['Digital', 'pub et présence sur les canaux numériques', 'Spotify : réseaux + mails de playlists perso'],
  ['B2B', 'entreprise → entreprise', 'Salesforce (CRM)'],
  ['B2C', 'entreprise → particulier', 'Zara (réseaux, site, boutiques)'],
  ['Contenu', 'créer du contenu utile pour attirer avant de vendre', 'tutos, blog'],
  ['Influence', 's’appuyer sur des créateurs et leur communauté', 'influenceurs'],
  ['Relationnel', 's’appuyer sur les clients existants', 'fidélité, communauté']
])}
<p>Un même produit combine souvent <b>plusieurs types en parallèle</b>.</p>
`)}
${S('Les 4P (marketing mix)', R`
<p>Cadre de référence : 4 décisions qui doivent <b>s'aligner</b> pour une offre cohérente.</p>
${table(['P', 'Question', 'Exemples'], [
  ['<b>Produit</b>', 'que vend-on réellement ? (fonctions, promesse)', 'iPhone : intégration à l’écosystème Apple'],
  ['<b>Prix</b>', 'quel signal ? (pas juste un coût à couvrir)', 'premium Tesla · volume Primark · freemium Spotify'],
  ['<b>Place</b> (distribution)', 'comment le produit arrive au client ?', 'exclusive Louis Vuitton · directe (D2C)'],
  ['<b>Promotion</b>', 'comment le faire connaître ?', 'expérientiel Red Bull · pub pilotée par l’IA (Google / Meta Ads)']
])}
`)}
${S('Segmentation · ciblage · positionnement', R`
${F(R`« Plaire à tout le monde, c'est plaire à n'importe qui. »`)}
<p><b>A. Segmenter</b> : diviser le marché en groupes <b>homogènes</b> selon des critères <b>géographiques</b> (pays, ville), <b>démographiques</b> (âge, revenu), <b>psychographiques</b> (valeurs, style de vie), <b>comportementaux</b> (usage, fidélité).<br>
<b>B. Cibler</b> : choisir le(s) segment(s).</p>
${table(['Ciblage', 'Principe', 'Exemple'], [['Indifférencié', 'un seul produit pour tous', 'Coca-Cola'], ['Différencié', 'une offre par segment', 'L’Oréal / Lancôme / La Roche-Posay'], ['Niche', 'segment étroit et spécifique', 'Rolex']])}
<p><b>C. Positionner</b> : comment le produit doit être <b>perçu face à la concurrence</b> (prix, qualité, innovation, valeurs).</p>
${K(R`<b>Phrase de positionnement</b> : « Pour [cible], [produit] est le seul [catégorie] qui [bénéfice clé], contrairement à [concurrent]. »<br><b>Carte perceptive</b> : placer les concurrents sur 2 axes (ex. prix × qualité perçue) et viser une case libre et désirable.`)}
`)}
${ABBR('MKT', 'B2B', 'B2C', 'D2C', 'CRM', 'IA')}
${S('Comportement du consommateur', R`
<p>Pourquoi on achète : 4 familles de facteurs.</p>
${table(['Facteurs', 'Contenu', 'Exemple'], [
  ['<b>Culturels</b>', 'normes et valeurs d’une société', 'McDo végétarien en Inde'],
  ['<b>Sociaux</b>', 'famille, groupes, réseaux', 'communauté Starbucks sur Instagram'],
  ['<b>Personnels</b>', 'âge, profession, style de vie', 'GoPro (vie active)'],
  ['<b>Psychologiques</b>', 'motivation, perception, croyances', 'Apple : simplicité et innovation qui justifient le prix']
])}
`)}
`,
R`
${S('Méthode : construire un marketing cohérent', K(R`
① <b>Besoin</b> : quel problème réel, pour qui ?<br>
② <b>Segmenter</b> (4 critères) puis <b>cibler</b> (indifférencié / différencié / niche) ;<br>
③ <b>Positionner</b> : une phrase « pour [cible], [produit] est le seul qui [bénéfice], contrairement à [concurrent] » ;<br>
④ <b>4P</b> alignés sur ce positionnement ;<br>
⑤ <b>Types de marketing</b> adaptés à la cible (B2B → relationnel, salons ; B2C → digital, influence) ;<br>
⑥ <b>Fidélisation</b>.`))}
${S('Exo corrigé : 4P de DroneAgri', R`
${table(['P', 'Proposition'], [
  ['Produit', 'diagnostic par drone + rapport clé en main (cartes de besoin en eau, engrais) ; promesse : économiser des intrants'],
  ['Prix', 'abonnement par hectare et par saison (signal « service », pas « gadget ») ; essai gratuit d’une parcelle'],
  ['Place', 'via les coopératives agricoles et distributeurs de matériel (réseau existant) + vente directe aux grandes exploitations'],
  ['Promotion', 'démonstrations sur salons agricoles, témoignages d’agriculteurs, contenu (économies chiffrées)']
])}
<p>Cible : <b>niche</b> (exploitations moyennes en grandes cultures) ; marketing <b>B2B</b> + contenu + relationnel.</p>
`)}
${S('Exo corrigé : 4P des bornes de recharge', R`
<p>Produit : recharge ultra-rapide pendant les courses. Prix : au kWh, abonnement pour les habitués, réduction chez les commerçants partenaires. Place : parkings de centres commerciaux. Promotion : signalétique sur les parkings, appli, partenariats commerçants (« rechargez pendant vos achats »), pub digitale géolocalisée.</p>
`)}
${S('Exo : classer des exemples', R`
${table(['Situation', 'Réponse'], [
  ['Coca-Cola vend la même boisson partout', 'ciblage indifférencié'],
  ['Une marque propose une gamme jeune, une premium et une santé', 'ciblage différencié'],
  ['Montres à 10 000 € pour collectionneurs', 'niche (+ prix premium)'],
  ['Netflix gratuit avec pub, payant sans pub', 'prix freemium'],
  ['Vente uniquement sur le site de la marque', 'distribution directe (D2C)'],
  ['Red Bull sponsorise des sports extrêmes', 'promotion expérientielle'],
  ['Achat d’un SUV pour montrer sa réussite', 'facteur psychologique (perception / statut)'],
  ['Achat recommandé par ses amis', 'facteur social'],
  ['Menus adaptés aux interdits alimentaires locaux', 'facteur culturel'],
  ['Matériel bébé acheté à 30 ans', 'facteur personnel (âge, étape de vie)'],
  ['Logiciel vendu aux services RH', 'B2B'],
  ['Newsletter de recettes d’une marque de cuisine', 'marketing de contenu']
])}
`)}
${S('Exo : fidéliser le client (livrable)', R`
<p>Programme de points / parrainage ; abonnement ; service après-vente réactif ; communauté (réseaux, événements) ; personnalisation (recommandations) ; contenus exclusifs. Toujours relier à la cible : B2B → suivi personnalisé, contrat annuel ; B2C → points, communauté.</p>
`)}
${S('Exo : segmenter un marché (vélos électriques)', R`
<p>Géographique : urbain / rural. Démographique : 25–40 ans actifs / seniors. Psychographique : écologistes / sportifs. Comportemental : trajet domicile-travail quotidien / loisir le week-end. → cible possible : actifs urbains qui font des trajets quotidiens (vélo léger, antivol, abonnement d'entretien).</p>
`)}
${P(R`confondre marketing et pub · 4P incohérents (premium vendu en promo permanente) · confondre segmentation (analyse), ciblage (choix) et positionnement (image) · « social » (les autres) ≠ « culturel » (la société) · un prix bas n'est pas forcément « volume » s'il n'y a pas de gros volumes.`)}
`
  ]
},

/* ================================================================ PARTIE 3 */
p3: {
  titre: 'Partie 3 — Créer & piloter',
  couleur: '#1a8a5a',
  labels: ['Cours', 'Exercices'],
  pages: [
R`
${ABBR('CA', 'EBE', 'BFR', 'IS', 'IR', 'EI', 'SAS', 'SASU', 'SARL', 'EURL', 'CSG', 'CRDS', 'PME', 'CR', 'k€', 'M€')}
${S('Statuts juridiques', R`
${table(['', 'Micro / EI', 'SAS / SASU', 'SARL / EURL'], [
  ['Création', 'à son nom, sans statuts (≈ 30 min)', 'statuts + capital social', 'statuts + capital'],
  ['Responsabilité', '<b>illimitée</b> (biens perso)', 'limitée aux apports', 'limitée aux apports'],
  ['Impôt', 'IR', 'IR (5 ans) ou IS', 'IR (5 ans) ou IS'],
  ['Plafond CA', '≈ 200 k€ vente · ≈ 80 k€ presta', '—', '—'],
  ['Charges', '≈ 25 % du CA', '≈ 80–90 % (assimilé salarié)', '≈ 45 % (non salarié)'],
  ['Dividendes', '—', '≈ 31 %', '≈ 31 %']
])}
<p>Consulter une entreprise : <b>pappers.fr</b>, <b>societe.com</b>.</p>
`)}
${S('Impôts', R`
${F(R`IS $= 15\,\%\times\min(B, 42\,500) + 25\,\%\times(B - 42\,500)^+$`)}
<p>IR : payé par l'entrepreneur sur ses revenus. IS : payé par la société sur son bénéfice. En société, option IR possible 5 ans. CA &lt; 37 500 € : exonération (franchise). Dividendes taxés ≈ 31 %.</p>
`)}
${S('Du CA au résultat', R`
${table(['Indicateur', 'Définition'], [
  ['<b>CA</b>', 'tout ce qui est facturé aux clients'],
  ['<b>Marge brute</b>', 'CA − coût direct des produits (marchandises)'],
  ['<b>EBE</b>', 'ce qu’il reste après les coûts de fonctionnement (salaires, loyers…)'],
  ['<b>Résultat net</b>', 'ce qu’il reste vraiment à la fin → actionnaires (dividendes)'],
  ['<b>Trésorerie</b>', 'argent réellement en banque à l’instant T (cash-flow)']
])}
${F(R`taux $= \dfrac{\text{indicateur}}{\text{CA}}$ ; une baisse de 40 % à 37 % = « −3 <b>points</b> »`)}
${table(['Rassurant', 'Inquiétant'], [['trésorerie stable ou ↗ ; EBE positif et ↗', 'trésorerie ↘ malgré un résultat positif ; marge qui se dégrade']])}
`)}
${S('BFR (besoin en fonds de roulement)', R`
<p>Décalage de trésorerie du cycle d'exploitation : on paie souvent les fournisseurs <b>avant</b> d'être payé par les clients, et il faut financer ce décalage.</p>
${F(R`BFR = créances clients − dettes fournisseurs (+ stocks)`)}
<p>Créances = CA mensuel × délai client (mois). Dettes = achats mensuels × délai fournisseur (mois).<br>
Cours : CA 100 k€/mois à 60 j → 200 k€ ; fournisseurs 60 k€ à 30 j → 60 k€ ; <b>BFR = 140 k€</b>.<br>
Réduire : clients payés plus vite (acomptes), fournisseurs payés plus tard, moins de stock.</p>
`)}
${S('Burn rate et runway', R`
${F(R`runway (mois) $= \dfrac{\text{trésorerie}}{\text{burn rate (€/mois)}}$`)}
<p>Burn rate : rythme auquel une entreprise <b>pas encore rentable</b> consomme sa trésorerie. Les investisseurs le regardent plus que le résultat comptable : il dit combien de temps il reste avant de manquer de cash.</p>
`)}
${S('Décoder les phrases', R`
<p>« CA +12 %, marge brute −3 points » → vend plus mais gagne moins par vente. « EBE de 18 %, confortable pour le secteur » → bonne rentabilité vs concurrents. « Résultat positif mais trésorerie asséchée par le BFR » → rentable mais cash bloqué (clients pas encore payés, fournisseurs déjà payés). « Investisseurs → burn rate » → pas rentable, la question est le temps restant.</p>
`)}
${S('Complément : seuil de rentabilité', R`
${F(R`Seuil (en quantité) $= \dfrac{CF}{\text{prix} - c_v}$`)}
${F(R`Seuil (en CA) $= \dfrac{CF}{\text{taux de marge sur CV}}$`)}
<p>Volume à partir duquel l'entreprise ne perd plus d'argent (marge sur coûts variables = coûts fixes). Ne pas confondre avec le seuil d'indifférence (comparaison de 2 options de coût).</p>
`)}
${S('Livrables du projet', R`
<p>CR d'équipe : <b>concept</b> (pour qui, quel besoin, quel statut et pourquoi) · <b>SWOT</b> · <b>4P</b> · <b>fidélisation</b> · <b>lettre aux investisseurs</b>. + CR par poste.</p>
`)}
`,
R`
${S('Exo : TechNova contre MecaNova', R`
${table(['', 'TechNova (3 ans)', 'MecaNova (10 ans)'], [
  ['CA', '8 M€ (+45 %)', '4,2 M€ (+3 %)'], ['Marge brute', '4,8 M€ → <b>60 %</b>', '2,4 M€ → <b>57 %</b>'],
  ['EBE', '−0,2 M€ → <b>−2,5 %</b>', '1,3 M€ → <b>31 %</b>'], ['Résultat net', '−0,9 M€ → <b>−11 %</b>', '0,48 M€ → <b>11 %</b>'],
  ['Trésorerie', '1,2 M€ (−60 % en 1 an)', '0,9 M€ stable']
])}
<p><b>Calcul du runway</b> : −60 % en 1 an → trésorerie initiale $= 1{,}2/0{,}4 = 3$ M€ ; consommé 1,8 M€/an = <b>150 k€/mois</b> → runway $= 1\,200/150 = $ <b>8 mois</b>.<br>
<b>Analyse</b> : TechNova vend bien (croissance, marge brute 60 %) mais ses frais de fonctionnement dépassent la marge → lever des fonds sous 8 mois ou réduire les coûts. MecaNova croît peu mais est très rentable et stable.<br>
<b>Conclusion</b> : investisseur « croissance » → TechNova (risque) ; banquier / prudent → MecaNova.</p>
`)}
${S('Exo : BFR', R`
${EX('Cours', R`CA 100 k€/mois, clients à 60 j → $100\times2 = 200$ k€ ; fournisseurs 60 k€ à 30 j → 60 k€ → BFR = <b>140 k€</b>.`)}
${EX('Clients à 30 j', R`créances 100 k€ → BFR = 40 k€ : on libère <b>100 k€</b> de trésorerie.`)}
${EX('CA +50 %', R`150 k€/mois à 60 j → 300 k€ ; fournisseurs 90 k€ → BFR = 210 k€ : la croissance <b>consomme</b> du cash (+70 k€ à financer).`)}
${EX('Autre', R`CA 90 k€/mois à 60 j, dettes 50 k€ → $180 - 50 = 130$ k€.`)}
`)}
${S('Exo : impôt sur les sociétés', R`
${table(['Bénéfice $B$', 'Calcul', 'IS'], [
  ['30 000 €', '15 % × 30 000', '4 500 €'],
  ['42 500 €', '15 % × 42 500', '6 375 €'],
  ['60 000 €', '6 375 + 25 % × 17 500', '10 750 €'],
  ['100 000 €', '6 375 + 25 % × 57 500', '20 750 €']
])}
`)}
${S('Exo : choisir un statut', R`
${table(['Situation', 'Statut', 'Pourquoi'], [
  ['étudiant qui teste une activité de freelance', 'micro-entreprise', 'création en 30 min, charges ≈ 25 % du CA, simple'],
  ['3 associés, levée de fonds prévue', 'SAS', 'responsabilité limitée, souple pour faire entrer des investisseurs'],
  ['fondatrice seule, veut être assimilée salariée', 'SASU', 'protection sociale du régime général'],
  ['artisan seul, veut limiter les charges sur sa rémunération', 'EURL', 'charges ≈ 45 % au lieu de 80–90 %'],
  ['activité risquée (dettes possibles)', 'pas d’EI', 'responsabilité illimitée = biens perso exposés']
])}
`)}
${S('Exo : compte de résultat pas à pas', R`
<p>CA 500 k€, achats de marchandises 200 k€, salaires + loyers 180 k€, amortissements 40 k€.</p>
${table(['Étape', 'Calcul', 'Montant', 'Taux'], [
  ['Marge brute', '500 − 200', '300 k€', '60 %'], ['EBE', '300 − 180', '120 k€', '24 %'],
  ['Résultat avant impôt', '120 − 40', '80 k€', '16 %'], ['IS', '6 375 + 25 % × 37 500', '15,75 k€', ''],
  ['<b>Résultat net</b>', '80 − 15,75', '<b>64,25 k€</b>', '12,9 %']
])}
`)}
${S('Exo : seuil de rentabilité', R`
<p>CF 120 k€, prix 50 €, coût variable 30 € → marge unitaire 20 € → seuil = $120\,000/20 = 6\,000$ unités, soit un CA de 300 k€. Au-delà, chaque unité rapporte 20 €.</p>
`)}
${S('Exo : runway et décision', R`
<p>Trésorerie 600 k€, burn 75 k€/mois → 8 mois. Une levée prend ≈ 6 mois → la lancer <b>maintenant</b>. Pour gagner du temps : réduire le burn (recrutements gelés), accélérer l'encaissement clients (baisse du BFR).</p>
`)}
${S('Exo : lettre aux investisseurs (plan)', R`
<ol><li><b>Problème</b> (besoin réel, chiffré)</li><li><b>Solution</b> et produit</li><li><b>Marché</b> : taille, croissance (opportunités du SWOT)</li><li><b>Avantage concurrentiel</b> (forces du SWOT)</li><li><b>Modèle économique</b> (4P, prix)</li><li><b>Équipe</b></li><li><b>Chiffres</b> : CA visé, marge, burn rate, runway</li><li><b>Montant demandé</b> et usage des fonds</li></ol>
`)}
${P(R`résultat ≠ trésorerie · BFR = créances − dettes (pas l'inverse) · « points » ≠ % · IS par tranches (pas 25 % sur tout) · micro = responsabilité illimitée · le taux se calcule toujours sur le CA.`)}
`
  ]
}
  };
})();
