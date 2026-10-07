/*
 * Matière : Génie Logiciel (Java & UML).
 * Pour ajouter une matière, copier js/matieres/_modele.js (voir README).
 */
(function () {
  const THEMES = {
    bases:       { nom: 'Bases POO',               couleur: '#3b6fd8' },
    uml:         { nom: 'UML',                     couleur: '#8250df' },
    heritage:    { nom: 'Héritage & interfaces',   couleur: '#1a8a5a' },
    collections: { nom: 'Collections',             couleur: '#d4730b' },
    exceptions:  { nom: 'Exceptions',              couleur: '#cf3a3a' },
    io:          { nom: 'Fichiers & sérialisation', couleur: '#0e8a9a' },
    conception:  { nom: 'Bien concevoir',          couleur: '#b83280' }
  };

  const TPS = {
    tele:   'TP Télécommande',
    coll:   'TP Collections',
    hotel:  'TP Hôtel Paradis',
    serial: 'TP Sérialisation'
  };



  const FICHES = [

  /* ===================================================== BASES POO */
  {
    id: 'classe-objet', theme: 'bases', tps: ['tele'],
    titre: 'Classe, objet, instance',
    resume: 'Une classe est un moule. Un objet est un gâteau fait avec ce moule.',
    corps: `
  ${idee(`<p>Une <b>classe</b> décrit un type de chose : ce qu'elle <b>sait</b> (ses <b>attributs</b>, = ses variables) et ce qu'elle <b>sait faire</b> (ses <b>méthodes</b>, = ses fonctions).</p>
  <p>Un <b>objet</b> (ou <b>instance</b>) est un exemplaire concret fabriqué avec ${c`new`}. Chaque objet a ses propres valeurs : allumer la lampe 1 ne touche pas la lampe 2.</p>`)}
  ${uml({ alt: 'Classe Lampe', classes: [
    { name: 'Lampe', x: 0, y: 0, attrs: ['- nom : String', '- allume : boolean'], methods: ['+ Lampe(nom : String)', '+ allumer() : void', '+ eteindre() : void', '+ toString() : String'] }
  ], caption: 'Une classe en UML : nom / attributs / méthodes' })}
  ${F('Lampe.java')`
    public class Lampe {
        private String nom;        // attribut
        private boolean allume;    // attribut

        public Lampe(String nom) { // constructeur
            this.nom = nom;
            this.allume = false;   // une lampe neuve est éteinte
        }

        public void allumer()  { this.allume = true; }
        public void eteindre() { this.allume = false; }
    }
  `}
  ${J`
    Lampe l1 = new Lampe("Lampe1");  // 1er objet
    Lampe l2 = new Lampe("Lampe2");  // 2e objet, indépendant
    l1.allumer();                    // seule l1 est allumée
  `}
  ${retenir(`<ul><li>Classe = description, écrite une fois.</li><li>Objet = exemplaire créé avec ${c`new`}, autant qu'on veut.</li><li>On appelle une méthode sur un objet avec le point : ${c`l1.allumer()`}.</li></ul>`)}
  `},

  {
    id: 'constructeur', theme: 'bases', tps: ['hotel', 'tele'],
    titre: 'Constructeur, this et super',
    resume: 'Le constructeur prépare l’objet à sa naissance. this = moi-même, super = ma classe mère.',
    corps: `
  ${idee(`<p>Le <b>constructeur</b> est la méthode appelée automatiquement par ${c`new`}. Il porte <b>le même nom que la classe</b> et n'a <b>pas de type de retour</b> (même pas ${c`void`}). Son rôle : donner une valeur de départ aux attributs.</p>
  <ul><li>${c`this`} = « l'objet sur lequel je travaille ». ${c`this.nom = nom`} veut dire : mon attribut ${c`nom`} reçoit le paramètre ${c`nom`}.</li>
  <li>${c`super(...)`} = appeler le constructeur de la classe mère. Doit être <b>la première ligne</b>.</li></ul>`)}
  ${F('Chambre.java / ChambreDouble.java')`
    public abstract class Chambre {
        private int no;
        private int nblits;

        public Chambre(int nblits) {
            this.no = 0;            // pas encore de numéro
            this.nblits = nblits;
        }
    }

    public class ChambreDouble extends Chambre {
        public ChambreDouble() {
            super(2);               // "je suis une Chambre à 2 lits"
        }
    }
  `}
  ${piege(`<p>Si la classe mère n'a <b>pas</b> de constructeur sans paramètre (c'est le cas de ${c`Chambre(int nblits)`}), la classe fille est <b>obligée</b> d'appeler ${c`super(...)`} avec les bons paramètres. Sinon : erreur de compilation.</p>`)}
  ${retenir(`<p>Pas de constructeur écrit ? Java en fournit un vide par défaut. Dès que tu en écris un, celui par défaut disparaît.</p>`)}
  `},

  {
    id: 'encapsulation', theme: 'bases', tps: ['coll', 'hotel'],
    titre: 'Encapsulation : private + getters/setters',
    resume: 'On cache les attributs (private) et on donne des méthodes pour y accéder. On garde le contrôle.',
    corps: `
  ${idee(`<p><b>Encapsuler</b> = mettre les données dans une boîte fermée. Les attributs sont ${c`private`} : personne dehors ne peut les modifier n'importe comment. Pour lire ou changer une valeur, on passe par des méthodes publiques : un <b>getter</b> (lire) et un <b>setter</b> (modifier).</p>
  <p>Avantage : on peut changer l'intérieur de la classe sans casser le code des autres, et vérifier les valeurs dans le setter.</p>`)}
  ${J`
    public class Money {
        private int montant;          // invisible de l'extérieur
        private String devise;

        public int getMontant()    { return this.montant; }   // getter
        public String getDevise()  { return this.devise; }    // getter
    }
  `}
  ${table(['Mot-clé Java', 'Symbole UML', 'Qui peut y accéder ?'], [
    [c`public`, '<b>+</b>', 'tout le monde'],
    [c`protected`, '<b>#</b>', 'la classe, ses filles, et son package'],
    ['(rien)', '<b>~</b>', 'les classes du même package'],
    [c`private`, '<b>−</b>', 'seulement la classe elle-même']
  ])}
  ${retenir(`<p>Règle simple : <b>attributs en private, méthodes utiles en public</b>. ${c`Money`} n'a pas de setter : un montant ne change pas, ${c`add`} renvoie un <i>nouveau</i> Money.</p>`)}
  `},

  {
    id: 'static', theme: 'bases', tps: ['hotel'],
    titre: 'static : partagé par toute la classe',
    resume: 'Un attribut static existe en un seul exemplaire, commun à tous les objets. Souligné en UML.',
    corps: `
  ${idee(`<p>Un attribut normal : chaque objet a le sien. Un attribut ${c`static`} : <b>un seul pour toute la classe</b>, partagé par tous les objets. C'est comme un tableau affiché dans le couloir, que tout le monde voit et modifie.</p>
  <p>Une méthode ${c`static`} s'appelle sur la classe, sans objet : ${c`Hotel.charger("aujourdhui")`}, ${c`Integer.parseInt("42")`}, ${c`Collections.sort(liste)`}.</p>`)}
  ${J`
    public class Hotel {
        private static int nbc = 0;   // nombre total de chambres, partagé

        public void ajouterChambre(Chambre c) {
            if (c.getNo() == 0) {
                nbc++;                // le compteur est commun
                c.setNo(nbc);         // => numéros 1, 2, 3...
            }
            ...
        }

        public static Hotel charger(String nom) { ... } // pas besoin d'un Hotel pour l'appeler
    }
  `}
  ${uml({ alt: 'Hotel avec attribut static', classes: [
    { name: 'Hotel', x: 0, y: 0, attrs: ['_- nbc : int'], methods: ['+ ajouterChambre(c : Chambre) : void', '_+ charger(nom : String) : Hotel'] }
  ], caption: 'En UML, ce qui est static est <u>souligné</u>' })}
  ${piege(`<p>Un attribut static <b>n'est pas sauvegardé</b> par la sérialisation (il appartient à la classe, pas à l'objet). Voir la fiche « transient, static et serialVersionUID ».</p>`)}
  `},

  {
    id: 'tostring-equals', theme: 'bases', tps: ['coll'],
    titre: 'toString, equals et hashCode',
    resume: 'Trois méthodes héritées d’Object qu’on redéfinit presque toujours : afficher, comparer, ranger.',
    corps: `
  ${idee(`<p>Toute classe Java hérite de ${c`Object`}, qui fournit déjà ces méthodes… mais avec un comportement inutile. On les <b>redéfinit</b> :</p>
  <ul><li>${c`toString()`} : le texte lisible de l'objet. ${c`System.out.println(m)`} l'appelle tout seul.</li>
  <li>${c`equals(Object o)`} : « ont-ils le <b>même contenu</b> ? ». À ne pas confondre avec ${c`==`} qui teste « est-ce <b>le même objet</b> en mémoire ? ».</li>
  <li>${c`hashCode()`} : un numéro calculé à partir du contenu, qui sert à ranger l'objet dans un ${c`HashSet`} / ${c`HashMap`}.</li></ul>`)}
  ${F('Money.java')`
    @Override
    public String toString() {
        return this.montant + " " + this.devise;     // "100 EUR"
    }

    @Override
    public boolean equals(Object ob) {
        if (!(ob instanceof Money))                   // pas un Money ? pas égal
            return false;
        Money m = (Money) ob;                         // cast : on sait que c'est un Money
        return this.montant == m.getMontant()
            && this.devise.equals(m.getDevise());     // String : equals, pas ==
    }

    @Override
    public int hashCode() {
        return this.montant * 31 + this.devise.hashCode();
    }
  `}
  ${J`
    Money a = new Money(10, "EUR");
    Money b = new Money(10, "EUR");
    a == b        // false : deux objets différents
    a.equals(b)   // true  : même contenu
  `}
  ${retenir(`<p><b>Contrat :</b> si ${c`a.equals(b)`} est vrai, alors ${c`a.hashCode() == b.hashCode()`}. Redéfinir ${c`equals`} sans ${c`hashCode`} casse les ${c`HashSet`} (des doublons apparaissent).</p>`)}
  ${piege(`<p>Écrire ${c`equals(Money m)`} au lieu de ${c`equals(Object o)`} crée une <b>surcharge</b>, pas une redéfinition : les collections Java ne l'appelleront jamais. Le paramètre doit être ${c`Object`}. ${c`@Override`} t'avertit de l'erreur.</p>`)}
  `},

  {
    id: 'override-overload', theme: 'heritage', tps: ['tele', 'hotel'],
    titre: 'Redéfinition vs surcharge',
    resume: 'Redéfinir = remplacer une méthode héritée (même signature). Surcharger = même nom, autres paramètres.',
    corps: `
  ${idee(`<p>La <b>signature</b> d'une méthode = son nom + la liste des types de ses paramètres.</p>
  <ul><li><b>Redéfinition</b> (<i>override</i>) : une classe fille réécrit une méthode de sa mère avec <b>exactement la même signature</b>. Le nouveau code remplace l'ancien.</li>
  <li><b>Surcharge</b> (<i>overload</i>) : plusieurs méthodes avec <b>le même nom</b> mais <b>des paramètres différents</b>. Java choisit selon les arguments.</li></ul>`)}
  ${J`
    // Redéfinition : Lampe remplace le toString hérité d'Object
    @Override
    public String toString() { return nom + ":" + (allume ? "on" : "off"); }

    // Surcharge : même nom, paramètres différents
    public void ajouter(Lampe l) { ... }
    public void ajouter(Lampe l, int position) { ... }
  `}
  ${table(['', 'Redéfinition', 'Surcharge'], [
    ['Où ?', 'classe fille', 'même classe (ou fille)'],
    ['Signature', 'identique', 'différente'],
    ['Choix fait…', 'à l’exécution (vrai type de l’objet)', 'à la compilation (types des arguments)'],
    ['Exemple', c`toString()`, c`println(int)` + ' / ' + c`println(String)`]
  ])}
  ${retenir(`<p>Mets toujours ${c`@Override`} : si tu te trompes dans la signature, le compilateur le signale au lieu de créer une surcharge par erreur.</p>`)}
  `},

  /* ===================================================== UML */
  {
    id: 'uml-lire', theme: 'uml', tps: ['hotel'],
    titre: 'Lire une classe en UML',
    resume: 'Une boîte en 3 étages : nom, attributs, méthodes. + − # pour la visibilité, souligné = static, italique = abstrait.',
    corps: `
  ${idee(`<p>Un <b>diagramme de classes</b> est le plan du programme : on y voit les classes et leurs liens, sans le code. On le dessine <b>avant</b> de coder pour réfléchir à l'organisation.</p>`)}
  ${uml({ alt: 'Exemples de boîtes UML', classes: [
    { id: 'H', name: 'Hotel', x: 0, y: 0, attrs: ['- libres : ArrayList<Chambre>', '_- nbc : int'], methods: ['+ Hotel()', '+ reserverChambre(type : String) : int', '_+ charger(nom : String) : Hotel'] },
    { id: 'C', name: 'Chambre', abstract: true, x: 330, y: 0, attrs: ['- no : int', '- nblits : int'], methods: ['+ getNo() : int', '/+ typeChambre() : String'] },
    { id: 'D', name: 'Douche', stereo: 'interface', x: 330, y: 150 }
  ] })}
  ${table(['Ce que tu vois', 'Ce que ça veut dire'], [
    ['1<sup>er</sup> étage', 'le nom de la classe'],
    ['2<sup>e</sup> étage', 'les attributs : <code>visibilité nom : Type</code>'],
    ['3<sup>e</sup> étage', 'les méthodes : <code>visibilité nom(param : Type) : TypeRetour</code>'],
    ['<b>+ − # ~</b>', 'public, private, protected, package'],
    ['<u>souligné</u>', c`static`],
    ['<i>italique</i>', c`abstract` + ' (classe ou méthode)'],
    ['«interface»', 'c’est une interface, pas une classe']
  ])}
  ${retenir(`<p>En UML le type s'écrit <b>après</b> le nom (${c`no : int`}), alors qu'en Java il est avant (${c`int no`}).</p>`)}
  `},

  {
    id: 'uml-fleches', theme: 'uml', tps: ['tele', 'hotel'],
    titre: 'Les 6 flèches UML à connaître',
    resume: 'Héritage, réalisation, association, dépendance, agrégation, composition : la forme du trait et de la pointe dit tout.',
    corps: `
  ${idee(`<p>Deux choses à regarder : le <b>trait</b> (plein ou pointillé) et la <b>pointe</b> (triangle vide, flèche ouverte, losange).</p>`)}
  <div class="fleches">
  <div><h5>Héritage — « est un »</h5>
  ${uml({ classes: [{ id: 'A', name: 'ChambreDouble', compact: true, x: 0, y: 0 }, { id: 'B', name: 'Chambre', compact: true, x: 200, y: 0 }], rels: [{ type: 'extends', from: 'A', to: 'B' }] })}
  <p>Trait <b>plein</b> + <b>triangle vide</b> vers la mère. Java : ${c`extends`}.</p></div>
  <div><h5>Réalisation — « respecte le contrat »</h5>
  ${uml({ classes: [{ id: 'A', name: 'Lampe', compact: true, x: 0, y: 6 }, { id: 'B', name: 'Appareil', stereo: 'interface', compact: true, x: 160, y: 0 }], rels: [{ type: 'implements', from: 'A', to: 'B' }] })}
  <p>Trait <b>pointillé</b> + <b>triangle vide</b> vers l'interface. Java : ${c`implements`}.</p></div>
  <div><h5>Association — « connaît »</h5>
  ${uml({ classes: [{ id: 'A', name: 'Telecommande', compact: true, x: 0, y: 0 }, { id: 'B', name: 'Lampe', compact: true, x: 250, y: 0 }], rels: [{ type: 'assoc', from: 'A', to: 'B', m2: '0..*', m2s: -1, label: 'lampes' }] })}
  <p>Trait <b>plein</b> + <b>flèche ouverte</b>. Java : un <b>attribut</b> du type de l'autre classe.</p></div>
  <div><h5>Dépendance — « utilise en passant »</h5>
  ${uml({ classes: [{ id: 'A', name: 'MoneyList', compact: true, x: 0, y: 0 }, { id: 'B', name: 'DeviseComparator', compact: true, x: 200, y: 0 }], rels: [{ type: 'dep', from: 'A', to: 'B' }] })}
  <p>Trait <b>pointillé</b> + <b>flèche ouverte</b>. Java : utilisé dans une méthode (variable locale, paramètre, ${c`new`}), mais pas gardé en attribut.</p></div>
  <div><h5>Agrégation — « contient, sans posséder »</h5>
  ${uml({ classes: [{ id: 'A', name: 'Telecommande', compact: true, x: 0, y: 0 }, { id: 'B', name: 'Lampe', compact: true, x: 230, y: 0 }], rels: [{ type: 'aggrNav', from: 'A', to: 'B', m2: '0..*' }] })}
  <p><b>Losange vide</b> côté « tout ». La partie peut vivre sans le tout : les lampes existent même sans télécommande.</p></div>
  <div><h5>Composition — « est fait de »</h5>
  ${uml({ classes: [{ id: 'A', name: 'Maison', compact: true, x: 0, y: 0 }, { id: 'B', name: 'Piece', compact: true, x: 200, y: 0 }], rels: [{ type: 'compo', from: 'A', to: 'B', m2: '1..*' }] })}
  <p><b>Losange plein</b> côté « tout ». Si le tout disparaît, les parties disparaissent aussi.</p></div>
  </div>
  ${retenir(`<p><b>Triangle vide = « est un » / « respecte »</b> (héritage, interface). <b>Flèche ouverte = « connaît »</b>. <b>Pointillé = lien plus faible</b> (interface ou simple utilisation).</p>`)}
  `},

  {
    id: 'association', theme: 'uml', tps: ['tele'],
    titre: 'Association, multiplicité, navigabilité',
    resume: 'Un attribut qui pointe vers une autre classe = une association. Le sens de la flèche dit qui dépend de qui.',
    corps: `
  ${idee(`<p>Quand une classe garde un objet d'une autre classe dans un <b>attribut</b>, il y a une <b>association</b>. En UML, on dessine une flèche au lieu (ou en plus) d'écrire l'attribut dans la boîte.</p>`)}
  ${uml({ alt: 'Telecommande vers Lampe', classes: [
    { id: 'T', name: 'Telecommande', x: 0, y: 0, methods: ['+ ajouterLampe(l : Lampe) : void', '+ activerLampe(i : int) : void'] },
    { id: 'L', name: 'Lampe', x: 380, y: 0, attrs: ['- nom : String', '- allume : boolean'], methods: ['+ allumer() : void'] }
  ], rels: [{ type: 'assoc', from: 'T', to: 'L', m1: '1', m2: '0..*', label: 'lampes' }] })}
  ${J`
    public class Telecommande {
        private List<Lampe> lampes;   // <- c'est ça, la flèche "lampes 0..*"
    }
  `}
  <h4>Multiplicité = combien ?</h4>
  ${table(['Écriture', 'Sens'], [
    ['<b>1</b>', 'exactement un'], ['<b>0..1</b>', 'zéro ou un (optionnel)'],
    ['<b>*</b> ou <b>0..*</b>', 'autant qu’on veut, même aucun → une liste'], ['<b>1..*</b>', 'au moins un']
  ])}
  <h4>Navigabilité = le sens de la flèche</h4>
  <p>${c`Telecommande → Lampe`} : la télécommande <b>connaît</b> les lampes, mais une lampe ne sait pas qu'elle est pilotée. Donc <b>Telecommande dépend de Lampe</b>.</p>
  ${tonTP(`<p><b>Question 7 :</b> les flèches partent de ${c`Telecommande`} vers ${c`Lampe`} et ${c`Hifi`}. Conséquence : si ${c`Hifi`} change (ex. ${c`allumer`} devient ${c`augmenterSon`}), il faut <b>modifier Telecommande</b>. Le code qui est au départ de la flèche subit les changements de la classe pointée.</p>`)}
  `},

  /* ===================================================== TÉLÉCOMMANDE */
  {
    id: 'tele-v0', theme: 'conception', tps: ['tele'],
    titre: 'TP Télécommande — V0 : que des lampes',
    resume: 'Une télécommande qui garde une liste de lampes et les allume par numéro.',
    corps: `
  ${idee(`<p>Point de départ : la ${c`Telecommande`} contient une ${c`List<Lampe>`}. L'utilisateur tape un numéro qui commence à <b>1</b>, alors qu'une liste Java commence à <b>0</b> → on fait ${c`get(indice - 1)`}.</p>`)}
  ${uml({ alt: 'UML V0', classes: [
    { id: 'T', name: 'Telecommande', x: 0, y: 0, methods: ['+ Telecommande()', '+ ajouterLampe(l : Lampe) : void', '+ activerLampe(indiceLampe : int) : void', '+ desactiverLampe(indiceLampe : int) : void', '+ activerTout() : void', '+ toString() : String'] },
    { id: 'L', name: 'Lampe', x: 430, y: 10, attrs: ['- nom : String', '- allume : boolean'], methods: ['+ Lampe(nom : String)', '+ allumer() : void', '+ eteindre() : void', '+ toString() : String'] }
  ], rels: [{ type: 'assoc', from: 'T', to: 'L', m2: '0..*', label: 'lampes' }] })}
  ${F('Telecommande.java (V0)')`
    public class Telecommande {
        private List<Lampe> lampes;

        public Telecommande() {
            this.lampes = new ArrayList<Lampe>();   // aucune lampe au départ
        }

        public void ajouterLampe(Lampe l) { this.lampes.add(l); }

        public void activerLampe(int indiceLampe) {
            if (indiceLampe >= 1 && indiceLampe <= lampes.size())  // numéro valide ?
                lampes.get(indiceLampe - 1).allumer();
        }

        public void activerTout() {
            for (Lampe l : lampes)      // "pour chaque lampe l de la liste"
                l.allumer();
        }
    }
  `}
  ${retenir(`<p>Ça marche… mais la télécommande ne connaît <b>que</b> ${c`Lampe`}. Que se passe-t-il quand on veut ajouter autre chose ? → fiche suivante.</p>`)}
  `},

  {
    id: 'tele-copier-coller', theme: 'conception', tps: ['tele'],
    titre: 'TP Télécommande — le piège du copier-coller',
    resume: 'Ajouter la Hifi en recopiant le code des lampes : ça marche, mais chaque nouvel appareil double le travail et les bugs.',
    corps: `
  ${idee(`<p>Solution naïve pour gérer la ${c`Hifi`} : une deuxième liste et trois méthodes recopiées.</p>`)}
  ${uml({ alt: 'UML avec Hifi en copier-coller', classes: [
    { id: 'T', name: 'Telecommande', cx: 260, y: 0, methods: ['+ ajouterLampe(l : Lampe)', '+ activerLampe(i : int)', '+ desactiverLampe(i : int)', '+ ajouterHifi(h : Hifi)', '+ activerHifi(i : int)', '+ desactiverHifi(i : int)', '+ activerTout()'] },
    { id: 'L', name: 'Lampe', cx: 90, y: 230, methods: ['+ allumer()', '+ eteindre()'] },
    { id: 'H', name: 'Hifi', cx: 430, y: 230, attrs: ['- son : int'], methods: ['+ allumer()', '+ eteindre()'] }
  ], rels: [
    { type: 'assoc', from: 'T', fs: 'bottom', fo: -40, to: 'L', m2: '0..*', label: 'lampes' },
    { type: 'assoc', from: 'T', fs: 'bottom', fo: 40, to: 'H', m2: '0..*', m2s: -1, label: 'hifis' }
  ] })}
  ${J`
    private List<Lampe> lampes;
    private List<Hifi> hifis;          // copie

    public void activerLampe(int i) {
        if (i >= 1 && i <= lampes.size()) lampes.get(i - 1).allumer();
    }
    public void activerHifi(int i) {   // copie quasi identique
        if (i >= 1 && i <= hifis.size()) hifis.get(i - 1).allumer();
    }
    // + ajouterHifi, desactiverHifi, une boucle de plus dans activerTout et toString...
  `}
  ${tonTP(`<ul>
  <li><b>Q4 :</b> environ une vingtaine de lignes ajoutées/modifiées, toutes dans ${c`Telecommande`}.</li>
  <li><b>Q5 :</b> avec une ${c`Television`}, encore une flèche, une liste et 3 méthodes.</li>
  <li><b>Q6 :</b> oui, c'est du copier-coller. Un bug dans ${c`activerLampe`} est recopié dans chaque version ; changer la numérotation oblige à modifier toutes les copies. Ce n'est <b>pas maintenable</b>.</li>
  <li><b>Q7 :</b> ${c`Telecommande`} dépend de <b>toutes</b> les classes concrètes : si ${c`Hifi`} renomme ses méthodes, il faut retoucher la télécommande.</li></ul>`)}
  ${retenir(`<p>Le copier-coller est un signal d'alarme : il y a du code à <b>factoriser</b> (= mettre en commun à un seul endroit).</p>`)}
  `},

  {
    id: 'interface', theme: 'heritage', tps: ['tele'],
    titre: 'Interface : un contrat',
    resume: 'Une interface liste des méthodes promises, sans leur code. Une classe qui l’implémente s’engage à les écrire.',
    corps: `
  ${idee(`<p>Une <b>interface</b> est un <b>contrat</b> : « tout ce qui est un ${c`Appareil`} sait ${c`allumer()`} et ${c`eteindre()`} ». Elle dit <b>quoi</b>, pas <b>comment</b>.</p>
  <p>Une classe qui écrit ${c`implements Appareil`} <b>signe le contrat</b> : elle doit fournir le code de toutes les méthodes, sinon ça ne compile pas.</p>`)}
  ${F('Appareil.java')`
    public interface Appareil {
        void allumer();      // pas de corps : juste la promesse
        void eteindre();
    }
  `}
  ${F('Lampe.java / Hifi.java')`
    public class Lampe implements Appareil {
        public void allumer()  { this.allume = true; }
        public void eteindre() { this.allume = false; }
    }

    public class Hifi implements Appareil {
        public void allumer()  { son = Math.min(son + 10, 100); }  // sa façon à elle
        public void eteindre() { son = 0; }
    }
  `}
  ${uml({ alt: 'Lampe et Hifi implémentent Appareil', classes: [
    { id: 'A', name: 'Appareil', stereo: 'interface', cx: 200, y: 0, methods: ['+ allumer() : void', '+ eteindre() : void'] },
    { id: 'L', name: 'Lampe', cx: 90, y: 150, compact: true },
    { id: 'H', name: 'Hifi', cx: 310, y: 150, compact: true }
  ], rels: [{ type: 'implements', from: 'L', to: 'A' }, { type: 'implements', from: 'H', to: 'A' }] })}
  ${retenir(`<ul><li>On ne peut pas faire ${c`new Appareil()`} : une interface n'est pas un objet.</li>
  <li>Mais on peut écrire ${c`Appareil a = new Lampe("x");`} : une Lampe <b>est</b> un Appareil.</li>
  <li>Une classe peut implémenter <b>plusieurs</b> interfaces : ${c`implements A, B`}.</li></ul>`)}
  `},

  {
    id: 'tele-v1', theme: 'conception', tps: ['tele'],
    titre: 'TP Télécommande — V1 : la bonne conception',
    resume: 'La télécommande ne connaît plus que l’interface Appareil. Ajouter un appareil = 1 classe, 0 ligne modifiée.',
    corps: `
  ${idee(`<p>On remplace ${c`List<Lampe>`} + ${c`List<Hifi>`} par <b>une seule</b> ${c`List<Appareil>`}. La télécommande ne sait plus quels appareils elle pilote : elle sait juste qu'ils respectent le contrat ${c`Appareil`}.</p>`)}
  ${uml({ alt: 'UML V1', classes: [
    { id: 'T', name: 'Telecommande', x: 0, y: 0, methods: ['+ ajouterAppareil(a : Appareil) : void', '+ activerAppareil(i : int) : void', '+ desactiverAppareil(i : int) : void', '+ activerTout() : void'] },
    { id: 'A', name: 'Appareil', stereo: 'interface', cx: 560, y: 0, methods: ['+ allumer() : void', '+ eteindre() : void', '+ toString() : String'] },
    { id: 'L', name: 'Lampe', cx: 380, y: 190, attrs: ['- nom : String', '- allume : boolean'], methods: ['+ allumer()', '+ eteindre()'] },
    { id: 'H', name: 'Hifi', cx: 560, y: 190, attrs: ['- son : int'], methods: ['+ allumer()', '+ eteindre()'] },
    { id: 'V', name: 'Television', cx: 740, y: 190, hl: true, attrs: ['- chaine : int'], methods: ['+ allumer()', '+ eteindre()'] }
  ], rels: [
    { type: 'assoc', from: 'T', to: 'A', m2: '0..*', label: 'appareils', fs: 'right', ts: 'left' },
    { type: 'implements', from: 'L', to: 'A', mid: 160 },
    { type: 'implements', from: 'H', to: 'A', mid: 160 },
    { type: 'implements', from: 'V', to: 'A', mid: 160 }
  ], caption: 'Television (en couleur) s’ajoute sans toucher Telecommande' })}
  ${F('Telecommande.java (V1)')`
    public class Telecommande {
        private List<Appareil> appareils = new ArrayList<Appareil>();

        public void ajouterAppareil(Appareil a) { appareils.add(a); }

        public void activerAppareil(int i) {
            if (i >= 1 && i <= appareils.size())
                appareils.get(i - 1).allumer();   // Lampe ? Hifi ? peu importe
        }
    }
  `}
  ${tonTP(`<ul><li><b>Q8 :</b> la flèche pointe maintenant vers une <b>interface</b>, qui ne bouge pas. Les classes concrètes peuvent changer leur code interne sans toucher la télécommande.</li>
  <li><b>Q9 :</b> pour ajouter ${c`Television`} : créer ${c`class Television implements Appareil`}, écrire ${c`allumer`}/${c`eteindre`}, puis ${c`t.ajouterAppareil(new Television())`} dans le main. <b>Zéro</b> ligne changée dans ${c`Telecommande`}.</li></ul>`)}
  ${retenir(`<p>C'est le principe <b>ouvert/fermé</b> : le code est <b>ouvert</b> aux ajouts (nouvelles classes) mais <b>fermé</b> aux modifications (on ne retouche pas ce qui marche).</p>`)}
  `},

  {
    id: 'polymorphisme', theme: 'heritage', tps: ['tele', 'hotel'],
    titre: 'Polymorphisme',
    resume: 'Un même appel, a.allumer(), fait des choses différentes selon le vrai type de l’objet.',
    corps: `
  ${idee(`<p><b>Poly-morphisme</b> = « plusieurs formes ». Une variable de type ${c`Appareil`} peut contenir une ${c`Lampe`}, une ${c`Hifi`}… Quand on appelle ${c`a.allumer()`}, Java regarde <b>à l'exécution</b> quel est le <b>vrai</b> objet et lance <b>sa</b> version de la méthode. C'est la <b>liaison dynamique</b>.</p>`)}
  ${J`
    List<Appareil> appareils = new ArrayList<>();
    appareils.add(new Lampe("Salon"));
    appareils.add(new Hifi());

    for (Appareil a : appareils)
        a.allumer();        // Lampe.allumer() puis Hifi.allumer()

    System.out.println(appareils);
  `}
  ${O`
    [Salon:on, Hifi:10]
  `}
  ${table(['', 'Type déclaré', 'Type réel'], [
    ['Exemple', c`Appareil a`, c`= new Lampe(...)`],
    ['Décide…', 'quelles méthodes on a le droit d’appeler (compilation)', 'quel code est vraiment exécuté (exécution)']
  ])}
  ${tonTP(`<p>Dans l'hôtel, ${c`Chambre.toString()`} appelle ${c`typeChambre()`} : pour une ${c`ChambreDouble`} ça donne « Deux Personnes », pour un ${c`Appartement`} « Famille ». Même code, résultat différent.</p>`)}
  `},

  /* ===================================================== HÉRITAGE (HÔTEL) */
  {
    id: 'heritage', theme: 'heritage', tps: ['hotel'],
    titre: 'Héritage : extends',
    resume: '« ChambreDouble est une Chambre » : la fille récupère tout ce qu’a la mère et peut ajouter ou modifier.',
    corps: `
  ${idee(`<p>Avec ${c`class B extends A`}, la classe <b>B</b> (fille) <b>hérite</b> de <b>A</b> (mère) : elle récupère ses attributs et ses méthodes. Elle peut en <b>ajouter</b> et en <b>redéfinir</b>. On l'utilise quand on peut dire « B <b>est un</b> A ».</p>`)}
  ${uml({ alt: 'Hiérarchie des chambres', classes: [
    { id: 'C', name: 'Chambre', abstract: true, cx: 250, y: 0, attrs: ['- no : int', '- nblits : int'], methods: ['+ Chambre(nblits : int)', '+ getNo() : int', '+ setNo(n : int) : void', '/+ typeChambre() : String', '+ toString() : String'] },
    { id: 'D', name: 'ChambreDouble', cx: 110, y: 220, methods: ['+ ChambreDouble()', '+ typeChambre() : String'] },
    { id: 'A', name: 'Appartement', cx: 390, y: 220, methods: ['+ Appartement()', '+ typeChambre() : String'] },
    { id: 'DD', name: 'ChambreDoubleDouche', cx: 110, y: 340, compact: true },
    { id: 'AD', name: 'AppartementDouche', cx: 390, y: 340, compact: true }
  ], rels: [
    { type: 'extends', from: 'D', to: 'C' }, { type: 'extends', from: 'A', to: 'C' },
    { type: 'extends', from: 'DD', to: 'D' }, { type: 'extends', from: 'AD', to: 'A' }
  ] })}
  ${J`
    public class Appartement extends Chambre {
        public Appartement() { super(4); }          // 4 lits
        @Override
        public String typeChambre() { return "Famille"; }
    }

    public class AppartementDouche extends Appartement implements Douche { }
    // vide ! tout est hérité d'Appartement
  `}
  ${retenir(`<ul><li>Java : <b>une seule</b> classe mère (pas d'héritage multiple de classes).</li>
  <li>Les attributs ${c`private`} de la mère sont hérités mais <b>pas accessibles directement</b> : on passe par ${c`getNo()`}.</li>
  <li>Toute classe hérite au final d'${c`Object`}.</li></ul>`)}
  `},

  {
    id: 'abstraite', theme: 'heritage', tps: ['hotel'],
    titre: 'Classe abstraite',
    resume: 'Une classe incomplète : on ne peut pas l’instancier. Ses méthodes abstraites doivent être écrites par les filles.',
    corps: `
  ${idee(`<p>« Une chambre » tout court n'existe pas dans l'hôtel : il y a des chambres doubles, des appartements… Donc ${c`Chambre`} est <b>abstraite</b> : on ne peut pas faire ${c`new Chambre(2)`}.</p>
  <p>Une <b>méthode abstraite</b> est déclarée sans code. Chaque classe fille <b>doit</b> l'écrire (sinon elle doit être abstraite elle aussi).</p>`)}
  ${F('Chambre.java')`
    public abstract class Chambre {
        ...
        public abstract String typeChambre();   // pas de corps, juste ;

        @Override
        public String toString() {               // écrite UNE fois, ici
            String douche = (this instanceof Douche) ? "avec douche" : "sans douche";
            return "Chambre " + no + " de type " + typeChambre()
                 + " avec " + nblits + " lit(s), " + douche;
        }
    }
  `}
  ${O`
    Chambre 1 de type Deux Personnes avec 2 lit(s), sans douche
  `}
  ${tonTP(`<p>Le sujet interdit de redéfinir ${c`toString()`} dans les filles. L'astuce : ${c`toString()`} est écrite dans la mère et appelle ${c`typeChambre()`}, qui, elle, est différente dans chaque fille (polymorphisme). La mère fixe le <b>squelette</b>, les filles remplissent les <b>trous</b>.</p>`)}
  ${retenir(`<p>Une classe abstraite peut avoir des attributs, des constructeurs et des méthodes normales. C'est ce qui la distingue d'une interface.</p>`)}
  `},

  {
    id: 'interface-vs-abstraite', theme: 'heritage', tps: ['tele', 'hotel'],
    titre: 'Interface, classe abstraite ou héritage simple ?',
    resume: 'Le tableau pour choisir : partager du code → classe (abstraite). Partager un contrat → interface.',
    corps: `
  ${table(['', 'Interface', 'Classe abstraite', 'Classe normale'], [
    ['Mot-clé', c`implements`, c`extends`, c`extends`],
    ['Combien ?', 'plusieurs', 'une seule', 'une seule'],
    ['Attributs', 'non (seulement des constantes)', 'oui', 'oui'],
    ['Méthodes avec code', 'non (sauf ' + c`default` + ', Java 8+)', 'oui', 'oui'],
    [c`new` + ' possible ?', 'non', 'non', 'oui'],
    ['Idée', '« sait faire »', '« est un, en partie »', '« est un »'],
    ['Flèche UML', 'pointillé + triangle', 'plein + triangle', 'plein + triangle']
  ])}
  <h4>Comment choisir ?</h4>
  <ul>
  <li>Des classes très différentes qui doivent juste <b>répondre aux mêmes ordres</b> → <b>interface</b> (${c`Appareil`}, ${c`Comparable`}, ${c`Serializable`}).</li>
  <li>Des classes proches qui <b>partagent des attributs et du code</b>, mais dont la mère n'a pas de sens seule → <b>classe abstraite</b> (${c`Chambre`}).</li>
  <li>On veut une capacité en plus, en <b>option</b> → <b>interface</b> en plus de l'héritage (${c`ChambreDouble`} + ${c`Douche`}).</li>
  </ul>
  ${retenir(`<p>On peut combiner : ${c`class ChambreDoubleDouche extends ChambreDouble implements Douche`}. Toujours ${c`extends`} <b>avant</b> ${c`implements`}.</p>`)}
  `},

  {
    id: 'marqueur', theme: 'heritage', tps: ['hotel', 'serial'],
    titre: 'Interface marqueur et instanceof',
    resume: 'Une interface vide sert d’étiquette. instanceof permet de tester si un objet porte l’étiquette.',
    corps: `
  ${idee(`<p>Une <b>interface marqueur</b> ne contient aucune méthode : elle sert juste à <b>coller une étiquette</b> sur une classe. ${c`Douche`} veut dire « cette chambre a une douche ».</p>
  <p>${c`x instanceof T`} répond ${c`true`} si l'objet ${c`x`} est un ${c`T`} (sa classe, une classe mère ou une interface qu'il implémente).</p>`)}
  ${J`
    public interface Douche { }        // vide !

    public class ChambreDoubleDouche extends ChambreDouble implements Douche { }

    // dans Chambre.toString() :
    String douche = (this instanceof Douche) ? "avec douche" : "sans douche";
  `}
  ${uml({ alt: 'Interface marqueur Douche', classes: [
    { id: 'D', name: 'ChambreDouble', cx: 100, y: 0, compact: true },
    { id: 'I', name: 'Douche', stereo: 'interface', cx: 320, y: -6, compact: true },
    { id: 'DD', name: 'ChambreDoubleDouche', cx: 210, y: 110, compact: true }
  ], rels: [
    { type: 'extends', from: 'DD', to: 'D', fo: -50 },
    { type: 'implements', from: 'DD', to: 'I', fo: 50 }
  ] })}
  ${retenir(`<p>${c`Serializable`} est aussi une interface marqueur : elle ne demande aucune méthode, elle dit juste « Java a le droit de sauvegarder cet objet ».</p>`)}
  ${piege(`<p>${c`(a ? b : c)`} est l'<b>opérateur ternaire</b> : « si a alors b sinon c », en une ligne.</p>`)}
  `},

  {
    id: 'hotel-uml', theme: 'uml', tps: ['hotel', 'serial'],
    titre: 'TP Hôtel — le diagramme complet',
    resume: 'Héritage, interfaces et associations réunis dans un seul diagramme.',
    corps: `
  ${uml({ alt: 'Diagramme complet de l’hôtel', classes: [
    { id: 'S', name: 'Serializable', stereo: 'interface', cx: 527, y: 0, compact: true },
    { id: 'H', name: 'Hotel', x: -80, y: 108, attrs: ['_- nbc : int'], methods: ['+ Hotel()', '+ ajouterChambre(c : Chambre) : void', '+ reserverChambre(type : String) : int', '+ libererChambre(n : int) : boolean', '+ sauvegarder(nom : String) : void', '_+ charger(nom : String) : Hotel'] },
    { id: 'C', name: 'Chambre', abstract: true, cx: 527, y: 100, attrs: ['- no : int', '- nblits : int'], methods: ['+ Chambre(nblits : int)', '+ getNo() : int', '+ setNo(n : int) : void', '/+ typeChambre() : String', '+ toString() : String'] },
    { id: 'D', name: 'ChambreDouble', cx: 420, y: 300, methods: ['+ typeChambre() : String'] },
    { id: 'A', name: 'Appartement', cx: 650, y: 300, methods: ['+ typeChambre() : String'] },
    { id: 'Dc', name: 'Douche', stereo: 'interface', cx: 860, y: 290, compact: true },
    { id: 'DD', name: 'ChambreDoubleDouche', cx: 420, y: 410, compact: true },
    { id: 'AD', name: 'AppartementDouche', cx: 650, y: 410, compact: true }
  ], rels: [
    { type: 'implements', from: 'C', to: 'S' },
    { type: 'implements', from: 'H', fs: 'top', to: 'S', ts: 'left' },
    { type: 'extends', from: 'Dc', fs: 'top', to: 'S', ts: 'right' },
    { type: 'assoc', from: 'H', to: 'C', fs: 'right', ts: 'left', fo: -16, too: -16, m2: '0..*', label: 'libres' },
    { type: 'assoc', from: 'H', to: 'C', fs: 'right', ts: 'left', fo: 16, too: 16, m2: '0..*', m2s: -1, label: 'reservees' },
    { type: 'extends', from: 'D', to: 'C' }, { type: 'extends', from: 'A', to: 'C' },
    { type: 'extends', from: 'DD', to: 'D' }, { type: 'extends', from: 'AD', to: 'A' },
    { type: 'implements', from: 'DD', fs: 'bottom', to: 'Dc', ts: 'bottom', mid: 480 },
    { type: 'implements', from: 'AD', fs: 'bottom', to: 'Dc', ts: 'bottom', mid: 480 }
  ] })}
  <h4>Comment le lire</h4>
  <ul>
  <li>${c`Hotel`} a <b>deux listes</b> de chambres (deux associations) : ${c`libres`} et ${c`reservees`}.</li>
  <li>${c`Chambre`} est <b>abstraite</b> (en italique) avec une méthode abstraite ${c`typeChambre()`}.</li>
  <li>${c`ChambreDoubleDouche`} <b>hérite</b> de ${c`ChambreDouble`} <b>et implémente</b> ${c`Douche`}.</li>
  <li>${c`Douche`} <b>étend</b> ${c`Serializable`} : entre deux interfaces, c'est ${c`extends`} (trait plein).</li>
  <li>${c`Hotel`} et ${c`Chambre`} implémentent ${c`Serializable`} pour pouvoir être sauvegardés. Les filles en héritent automatiquement.</li>
  </ul>
  ${retenir(`<p>Interface → interface : ${c`extends`}. Classe → interface : ${c`implements`}. Classe → classe : ${c`extends`}.</p>`)}
  `},

  {
    id: 'anonyme', theme: 'heritage', tps: ['hotel'],
    titre: 'Classe anonyme',
    resume: 'Une sous-classe sans nom, créée sur place, pour un cas unique (la suite présidentielle).',
    corps: `
  ${idee(`<p>Il n'y a qu'<b>une</b> suite présidentielle : créer un fichier ${c`SuitePresidentielle.java`} serait exagéré. Une <b>classe anonyme</b> crée une sous-classe <b>sans nom</b> et son unique objet <b>en même temps</b>, directement dans le code.</p>`)}
  ${F('Main.java')`
    Appartement suite = new Appartement() {     // "un Appartement, mais..."
        @Override
        public String toString() {               // ...qui s'affiche autrement
            return "Suite presidentielle " + getNo();
        }
    };                                           // <- ne pas oublier le ;
    hotel.ajouterChambre(suite);
  `}
  ${O`
    Suite presidentielle 4
  `}
  <h4>La syntaxe à reconnaître</h4>
  <p>${c`new TypeParent(args) { ... redéfinitions ... };`} — les accolades juste après ${c`new X()`} signalent une classe anonyme.</p>
  ${retenir(`<ul><li>Elle hérite de la classe (ou implémente l'interface) écrite après ${c`new`}.</li>
  <li>Elle peut redéfinir des méthodes, mais n'a pas de constructeur à elle.</li>
  <li>Usage classique : un ${c`Comparator`} écrit sur place (aujourd'hui souvent remplacé par une lambda).</li></ul>`)}
  ${J`
    Collections.sort(list, new Comparator<Money>() {
        public int compare(Money a, Money b) {
            return a.getDevise().compareTo(b.getDevise());
        }
    });
  `}
  `},

  {
    id: 'hotel-logique', theme: 'collections', tps: ['hotel'],
    titre: 'TP Hôtel — réserver et libérer',
    resume: 'Déplacer une chambre d’une liste à l’autre : chercher, retirer de libres, ajouter à reservees.',
    corps: `
  ${idee(`<p>Une chambre est toujours dans <b>une seule</b> des deux listes. Réserver = la passer de ${c`libres`} à ${c`reservees`}. Libérer = l'inverse.</p>`)}
  ${F('Hotel.java')`
    public void ajouterChambre(Chambre c) {
        if (c.getNo() == 0) {          // pas encore de numéro
            nbc++;
            c.setNo(nbc);              // prochain numéro libre
        }
        inserer(libres, c);            // rangée à côté des chambres du même type
    }

    public int reserverChambre(String type) {
        for (int i = 0; i < libres.size(); i++) {
            Chambre c = libres.get(i);
            if (c.typeChambre().equals(type)) {   // la 1re du bon type
                libres.remove(i);
                reservees.add(c);
                return c.getNo();
            }
        }
        return 0;                      // plus de place
    }

    public boolean libererChambre(int n) {
        for (int i = 0; i < reservees.size(); i++) {
            if (reservees.get(i).getNo() == n) {
                inserer(libres, reservees.remove(i));  // remove renvoie l'élément retiré
                return true;
            }
        }
        return false;                  // n n'était pas réservée
    }
  `}
  ${piege(`<p>Retirer un élément d'une liste <b>pendant</b> qu'on la parcourt décale tous les indices. Ici c'est sans risque car on fait ${c`return`} juste après. Avec un ${c`for (Chambre c : libres)`}, un ${c`remove`} provoque une ${c`ConcurrentModificationException`}.</p>`)}
  ${retenir(`<p>Comparer des ${c`String`} : toujours ${c`.equals(...)`}, jamais ${c`==`}.</p>`)}
  `},

  /* ===================================================== COLLECTIONS */
  {
    id: 'list', theme: 'collections', tps: ['coll', 'tele', 'hotel'],
    titre: 'List et ArrayList',
    resume: 'Une liste ordonnée qui grandit toute seule. On déclare avec List (le contrat), on crée avec ArrayList.',
    corps: `
  ${idee(`<p>${c`List`} est une <b>interface</b> : elle décrit ce qu'une liste sait faire. ${c`ArrayList`} est une <b>classe</b> qui le fait concrètement (un tableau qui s'agrandit tout seul). Le type entre ${c`< >`} dit ce qu'on range dedans.</p>`)}
  ${J`
    List<Money> list = new ArrayList<>();   // déclaré List, créé ArrayList

    list.add(new Money(10, "EUR"));         // ajoute à la fin
    Money m = list.get(0);                  // lit la case 0 (la 1re)
    list.set(0, new Money(20, "EUR"));      // remplace la case 0
    list.remove(0);                         // retire la case 0
    int n = list.size();                    // nombre d'éléments
    boolean vide = list.isEmpty();
    boolean dedans = list.contains(m);      // utilise equals !

    for (Money x : list) { ... }            // parcourir tout
  `}
  ${uml({ alt: 'List et ArrayList', classes: [
    { id: 'L', name: 'List<E>', stereo: 'interface', cx: 120, y: 0, methods: ['+ add(e : E) : boolean', '+ get(i : int) : E', '+ size() : int'] },
    { id: 'A', name: 'ArrayList<E>', cx: 120, y: 160, compact: true },
    { id: 'M', name: 'MoneyList', cx: 420, y: 30, compact: true }
  ], rels: [{ type: 'implements', from: 'A', to: 'L' }, { type: 'assoc', from: 'M', to: 'L', label: 'list', fs: 'left', ts: 'right' }] })}
  ${retenir(`<ul><li>Indices de <b>0</b> à <b>size() - 1</b>.</li>
  <li>Déclarer avec l'interface (${c`List`}) : on peut changer pour une ${c`LinkedList`} en modifiant <b>un seul mot</b>. C'est « programmer vers l'interface ».</li></ul>`)}
  ${piege(`<p>${c`get(size())`} → ${c`IndexOutOfBoundsException`}. Le dernier élément est à ${c`size() - 1`}.</p>`)}
  `},

  {
    id: 'generiques', theme: 'collections', tps: ['coll'],
    titre: 'Les génériques <T>',
    resume: 'Le type entre chevrons dit ce que contient la collection. Le compilateur vérifie à ta place.',
    corps: `
  ${idee(`<p>${c`List<Money>`} se lit « liste de Money ». Le ${c`<Money>`} est un <b>paramètre de type</b> : la même classe ${c`ArrayList`} sert pour des ${c`Money`}, des ${c`String`}, des ${c`Chambre`}…</p>`)}
  ${J`
    List<Money> list = new ArrayList<>();  // <> vide : Java devine "Money"
    list.add(new Money(5, "USD"));         // ok
    list.add("bonjour");                   // ERREUR de compilation : pas un Money
    Money m = list.get(0);                 // pas besoin de cast
  `}
  ${retenir(`<ul><li>On ne met pas de type primitif : ${c`List<Integer>`}, pas ${c`List<int>`}.</li>
  <li>Les interfaces aussi sont génériques : ${c`Comparable<Money>`}, ${c`Comparator<Money>`} → la méthode reçoit directement un ${c`Money`}.</li>
  <li>En UML on écrit ${c`List<E>`} ou ${c`ArrayList<E>`}, E pour « élément ».</li></ul>`)}
  `},

  {
    id: 'moneylist', theme: 'collections', tps: ['coll'],
    titre: 'TP Collections — MoneyList.ajouterSomme',
    resume: 'Si la devise existe déjà, on cumule. Sinon on ajoute. Une seule entrée par devise.',
    corps: `
  ${idee(`<p>On veut un « porte-monnaie » : au plus <b>un</b> Money par devise. Logique :</p>
  <ol><li>Parcourir la liste.</li><li>Si un élément a la <b>même devise</b> que ${c`m`} : remplacer cet élément par la somme, puis s'arrêter.</li><li>Si on a tout parcouru sans trouver : ajouter ${c`m`} à la fin.</li></ol>`)}
  ${F('MoneyList.java')`
    public void ajouterSomme(Money m) throws DeviseException {
        for (int i = 0; i < list.size(); i++) {
            Money courant = list.get(i);
            if (courant.getDevise().equals(m.getDevise())) {
                list.set(i, courant.add(m));   // add renvoie un NOUVEAU Money
                return;                        // trouvé : on s'arrête
            }
        }
        list.add(m);                           // devise nouvelle
    }
  `}
  ${J`
    MoneyList ml = new MoneyList();
    ml.ajouterSomme(new Money(10, "EUR"));
    ml.ajouterSomme(new Money(5, "USD"));
    ml.ajouterSomme(new Money(7, "EUR"));
    System.out.println(ml);
  `}
  ${O`
    [17 EUR, 5 USD]
  `}
  ${piege(`<p>${c`courant.add(m)`} ne modifie pas ${c`courant`} : il renvoie un nouvel objet. Sans ${c`list.set(...)`}, le résultat est perdu.</p>`)}
  ${retenir(`<p>Pour ${c`equals`} de ${c`MoneyList`} : même taille + ${c`containsAll`} → égalité <b>sans tenir compte de l'ordre</b> (une liste triée reste le même porte-monnaie).</p>`)}
  `},

  {
    id: 'comparable', theme: 'collections', tps: ['coll'],
    titre: 'Comparable : l’ordre naturel',
    resume: 'La classe sait se comparer elle-même avec compareTo. Collections.sort(list) l’utilise.',
    corps: `
  ${idee(`<p>Pour trier, Java doit savoir dire si un objet est « avant » ou « après » un autre. Avec ${c`Comparable<T>`}, c'est l'objet lui-même qui sait se comparer : c'est son <b>ordre naturel</b> (un seul possible par classe).</p>
  <p>${c`a.compareTo(b)`} renvoie :</p>
  <ul><li><b>négatif</b> → a avant b</li><li><b>0</b> → à égalité</li><li><b>positif</b> → a après b</li></ul>`)}
  ${F('Money.java')`
    public class Money implements Comparable<Money> {
        ...
        @Override
        public int compareTo(Money m) {
            return Integer.compare(this.montant, m.getMontant());
        }
    }

    // dans MoneyList
    public void triMontant() {
        Collections.sort(list);    // utilise compareTo
    }
  `}
  ${uml({ alt: 'Money implémente Comparable', classes: [
    { id: 'C', name: 'Comparable<T>', stereo: 'interface', cx: 120, y: 0, methods: ['+ compareTo(o : T) : int'] },
    { id: 'M', name: 'Money', cx: 120, y: 130, compact: true }
  ], rels: [{ type: 'implements', from: 'M', to: 'C', label: 'T = Money' }] })}
  ${piege(`<p>Éviter ${c`return this.montant - m.montant;`} : avec de très grands nombres la soustraction <b>déborde</b> et le signe devient faux. ${c`Integer.compare(a, b)`} est toujours juste.</p>`)}
  ${retenir(`<p>Pour comparer des ${c`String`} dans l'ordre alphabétique : ${c`s1.compareTo(s2)`} (${c`String`} est déjà ${c`Comparable`}).</p>`)}
  `},

  {
    id: 'comparator', theme: 'collections', tps: ['coll'],
    titre: 'Comparator : un ordre en plus',
    resume: 'Une classe à part qui compare deux objets. Permet d’avoir autant d’ordres de tri qu’on veut.',
    corps: `
  ${idee(`<p>L'ordre naturel de ${c`Money`} est déjà pris (le montant). Pour trier <b>aussi</b> par devise, on crée un <b>comparateur externe</b> : une classe qui implémente ${c`Comparator<Money>`} et sa méthode ${c`compare(o1, o2)`}.</p>`)}
  ${F('DeviseComparator.java')`
    public class DeviseComparator implements Comparator<Money> {
        @Override
        public int compare(Money o1, Money o2) {
            return o1.getDevise().compareTo(o2.getDevise());  // ordre alphabétique
        }
    }

    // dans MoneyList
    public void triDevise() {
        Collections.sort(list, new DeviseComparator());
    }
  `}
  ${uml({ alt: 'Comparable et Comparator', classes: [
    { id: 'Ca', name: 'Comparable<T>', stereo: 'interface', cx: 130, y: 0, methods: ['+ compareTo(o : T) : int'] },
    { id: 'Co', name: 'Comparator<T>', stereo: 'interface', cx: 470, y: 0, methods: ['+ compare(o1 : T, o2 : T) : int'] },
    { id: 'M', name: 'Money', cx: 130, y: 140, compact: true },
    { id: 'DC', name: 'DeviseComparator', cx: 470, y: 140, compact: true },
    { id: 'ML', name: 'MoneyList', cx: 300, y: 240, methods: ['+ triMontant() : void', '+ triDevise() : void'] }
  ], rels: [
    { type: 'implements', from: 'M', to: 'Ca' }, { type: 'implements', from: 'DC', to: 'Co' },
    { type: 'assoc', from: 'ML', to: 'M', fs: 'left', ts: 'bottom', m2: '0..*', label: 'list' },
    { type: 'dep', from: 'ML', to: 'DC', fs: 'right', ts: 'bottom', label: '«utilise»' }
  ] })}
  ${table(['', 'Comparable', 'Comparator'], [
    ['Package', c`java.lang`, c`java.util`],
    ['Méthode', c`compareTo(T o)`, c`compare(T o1, T o2)`],
    ['Où ?', 'dans la classe elle-même', 'dans une classe à part'],
    ['Combien d’ordres ?', 'un seul (naturel)', 'autant qu’on veut'],
    ['Tri', c`Collections.sort(list)`, c`Collections.sort(list, comp)`]
  ])}
  ${retenir(`<p>Version courte moderne (même résultat) : ${c`list.sort(Comparator.comparing(Money::getDevise));`}</p>`)}
  `},

  {
    id: 'set', theme: 'collections', tps: ['coll'],
    titre: 'Set : un ensemble sans doublons',
    resume: 'HashSet (rapide, pas d’ordre), TreeSet (trié), LinkedHashSet (ordre d’arrivée). Ajouter un doublon ne fait rien.',
    corps: `
  ${idee(`<p>Un ${c`Set`} est comme un ensemble en maths : chaque élément y est <b>au plus une fois</b>. ${c`add`} d'un élément déjà présent ne fait rien (et renvoie ${c`false`}). Parfait pour les IP « au plus une seule fois ».</p>`)}
  ${table(['Classe', 'Ordre de parcours', 'Pour savoir si doublon, utilise…'], [
    [c`HashSet`, 'aucun ordre garanti', c`hashCode()` + ' + ' + c`equals()`],
    [c`LinkedHashSet`, 'ordre d’insertion', c`hashCode()` + ' + ' + c`equals()`],
    [c`TreeSet`, '<b>trié</b>', c`compareTo()` + ' (ou un Comparator)']
  ])}
  ${uml({ alt: 'Hiérarchie Set simplifiée', classes: [
    { id: 'S', name: 'Set<E>', stereo: 'interface', cx: 260, y: 0, compact: true },
    { id: 'H', name: 'HashSet<E>', cx: 90, y: 110, compact: true },
    { id: 'L', name: 'LinkedHashSet<E>', cx: 270, y: 110, compact: true },
    { id: 'T', name: 'TreeSet<E>', cx: 450, y: 110, compact: true }
  ], rels: [{ type: 'implements', from: 'H', to: 'S' }, { type: 'implements', from: 'L', to: 'S' }, { type: 'implements', from: 'T', to: 'S' }], caption: 'Vue simplifiée (en vrai LinkedHashSet hérite de HashSet)' })}
  ${F('ListeIP.java')`
    private Set<AdresseIP> ips;

    public ListeIP(boolean trie) {
        if (trie) this.ips = new TreeSet<>();   // trié
        else      this.ips = new HashSet<>();   // rapide, sans ordre
    }
  `}
  ${tonTP(`<ul><li><b>3.1 :</b> un ${c`HashSet<String>`}. Pour des ${c`String`}, rien à adapter. Pour une classe à toi : redéfinir ${c`equals`} <b>et</b> ${c`hashCode`}.</li>
  <li><b>3.3 :</b> l'attribut est déclaré ${c`Set`} ; le constructeur choisit la classe concrète. Le reste du code ne change pas : c'est du polymorphisme.</li></ul>`)}
  `},

  {
    id: 'adresse-ip', theme: 'collections', tps: ['coll'],
    titre: 'TP Collections — trier des IP correctement',
    resume: 'En texte, "64…" passe après "192…". La classe AdresseIP compare nombre par nombre.',
    corps: `
  ${idee(`<p>Les ${c`String`} se comparent <b>caractère par caractère</b> : ${c`'6'`} > ${c`'1'`}, donc ${c`"64.233.166.94"`} arrive après ${c`"192.114.51.21"`}. Faux pour des IP ! Il faut comparer les 4 nombres un par un, <b>comme des entiers</b>.</p>
  <p>Solution : une classe intermédiaire ${c`AdresseIP`} qui implémente ${c`Comparable`}.</p>`)}
  ${F('AdresseIP.java')`
    public class AdresseIP implements Comparable<AdresseIP> {
        private String ip;

        @Override
        public int compareTo(AdresseIP autre) {
            String[] a = this.ip.split("\\.");     // "64.233.166.94" -> ["64","233","166","94"]
            String[] b = autre.ip.split("\\.");
            for (int i = 0; i < 4; i++) {
                int x = Integer.parseInt(a[i]);    // texte -> nombre
                int y = Integer.parseInt(b[i]);
                if (x != y) return Integer.compare(x, y);
            }
            return 0;                              // les 4 nombres sont égaux
        }

        @Override public boolean equals(Object o) { ... }  // pour HashSet
        @Override public int hashCode() { return ip.hashCode(); }
    }
  `}
  ${uml({ alt: 'ListeIP et AdresseIP', classes: [
    { id: 'L', name: 'ListeIP', x: 0, y: 0, methods: ['+ ListeIP(trie : boolean)', '+ chargerFichier(name : String) : void', '+ toString() : String'] },
    { id: 'A', name: 'AdresseIP', x: 400, y: 0, attrs: ['- ip : String'], methods: ['+ compareTo(a : AdresseIP) : int', '+ equals(o : Object) : boolean', '+ hashCode() : int'] },
    { id: 'C', name: 'Comparable<AdresseIP>', stereo: 'interface', cx: 517, y: 170, compact: true }
  ], rels: [{ type: 'assoc', from: 'L', to: 'A', fs: 'right', ts: 'left', m2: '0..*', label: 'ips' }, { type: 'implements', from: 'A', to: 'C' }] })}
  ${retenir(`<p>Une classe qui va dans un ${c`HashSet`} a besoin de ${c`equals`}+${c`hashCode`} ; dans un ${c`TreeSet`}, de ${c`compareTo`}. ${c`AdresseIP`} a les trois → elle marche dans les deux cas.</p>`)}
  `},

  /* ===================================================== EXCEPTIONS */
  {
    id: 'exceptions', theme: 'exceptions', tps: ['coll', 'serial'],
    titre: 'Exceptions : le principe',
    resume: 'Une erreur qui « remonte » les appels jusqu’à ce que quelqu’un l’attrape avec try/catch.',
    corps: `
  ${idee(`<p>Une <b>exception</b> est un objet qui signale un problème. Quand elle est <b>lancée</b> (${c`throw`}), la méthode s'arrête net et l'exception <b>remonte</b> vers la méthode appelante, puis la suivante… jusqu'à un ${c`try/catch`} qui l'<b>attrape</b>. Si personne ne l'attrape, le programme plante.</p>`)}
  ${table(['Mot', 'Rôle'], [
    [c`throw new X(...)`, '<b>lancer</b> une exception (dans le code)'],
    [c`throws X`, '<b>prévenir</b> dans la signature : « cette méthode peut lancer X »'],
    [c`try { } catch (X e) { }`, '<b>essayer</b> du code et <b>attraper</b> l’erreur'],
    [c`finally { }`, 'code exécuté <b>toujours</b>, erreur ou pas']
  ])}
  ${uml({ alt: 'Hiérarchie des exceptions', classes: [
    { id: 'T', name: 'Throwable', cx: 400, y: 0, compact: true },
    { id: 'Er', name: 'Error', cx: 190, y: 75, compact: true },
    { id: 'E', name: 'Exception', cx: 520, y: 75, compact: true },
    { id: 'IO', name: 'IOException', cx: 300, y: 150, compact: true },
    { id: 'DE', name: 'DeviseException', cx: 520, y: 150, compact: true, hl: true },
    { id: 'R', name: 'RuntimeException', cx: 760, y: 150, compact: true },
    { id: 'N', name: 'NullPointerException', cx: 640, y: 225, compact: true },
    { id: 'IX', name: 'IndexOutOfBoundsException', cx: 890, y: 225, compact: true }
  ], rels: [
    { type: 'extends', from: 'Er', to: 'T' }, { type: 'extends', from: 'E', to: 'T' },
    { type: 'extends', from: 'IO', to: 'E' }, { type: 'extends', from: 'DE', to: 'E' }, { type: 'extends', from: 'R', to: 'E' },
    { type: 'extends', from: 'N', to: 'R' }, { type: 'extends', from: 'IX', to: 'R' }
  ], caption: 'En couleur : l’exception créée dans le TP' })}
  ${table(['', 'Vérifiée (checked)', 'Non vérifiée (unchecked)'], [
    ['Hérite de', c`Exception`, c`RuntimeException`],
    ['Obligé de la traiter ?', '<b>oui</b> : ' + c`try/catch` + ' ou ' + c`throws`, 'non'],
    ['Cause typique', 'problème extérieur (fichier, données)', 'bug du programmeur'],
    ['Exemples', c`IOException` + ', ' + c`DeviseException`, c`NullPointerException`]
  ])}
  `},

  {
    id: 'devise-exception', theme: 'exceptions', tps: ['coll'],
    titre: 'Créer son exception : DeviseException',
    resume: 'On hérite d’Exception, on la lance dans add si les devises diffèrent, on l’attrape dans le main.',
    corps: `
  ${idee(`<p>Additionner 10 EUR et 5 USD n'a pas de sens sans taux de change. Plutôt que de renvoyer un résultat faux, ${c`add`} <b>lance</b> une ${c`DeviseException`}.</p>`)}
  ${F('DeviseException.java')`
    public class DeviseException extends Exception {     // checked
        public DeviseException(String d1, String d2) {
            super("devises incompatibles : " + d1 + " et " + d2);  // le message
        }
    }
  `}
  ${F('Money.java')`
    public Money add(Money m) throws DeviseException {   // je préviens
        if (!this.devise.equals(m.getDevise()))
            throw new DeviseException(this.devise, m.getDevise());  // je lance
        return new Money(this.montant + m.getMontant(), this.devise);
    }
  `}
  ${F('Main.java')`
    try {
        Money total = new Money(10, "EUR").add(new Money(5, "USD"));
        System.out.println(total);                // jamais atteint
    } catch (DeviseException e) {
        System.out.println("Erreur : " + e.getMessage());
    }
  `}
  ${O`
    Erreur : devises incompatibles : EUR et USD
  `}
  ${retenir(`<p>${c`ajouterSomme`} appelle ${c`add`} sans attraper l'exception → elle doit aussi déclarer ${c`throws DeviseException`}. L'exception « traverse » ${c`ajouterSomme`} pour arriver au main.</p>`)}
  `},

  /* ===================================================== FICHIERS & SÉRIALISATION */
  {
    id: 'lire-fichier', theme: 'io', tps: ['coll'],
    titre: 'Lire un fichier texte ligne par ligne',
    resume: 'BufferedReader + readLine() jusqu’à null. try-with-resources ferme le fichier tout seul.',
    corps: `
  ${idee(`<p>${c`FileReader`} ouvre le fichier, ${c`BufferedReader`} ajoute la lecture <b>ligne par ligne</b>. ${c`readLine()`} renvoie la ligne suivante, ou ${c`null`} quand le fichier est fini.</p>`)}
  ${F('ListeIP.java')`
    public void chargerFichier(String name) {
        try (BufferedReader reader = new BufferedReader(new FileReader(name))) {
            String ligne;
            while ((ligne = reader.readLine()) != null) {   // lire tant qu'il y a des lignes
                if (ligne.isBlank()) continue;              // sauter les lignes vides
                String[] parts = ligne.split(" ");          // "64.233.166.94 ajout_..."
                ips.add(new AdresseIP(parts[0]));           // la 1re partie = l'IP
            }
        } catch (IOException e) {                            // fichier absent, illisible...
            System.err.println("Erreur : " + e.getMessage());
        }
    }
  `}
  ${idee(`<p><b>try-with-resources</b> : ce qu'on ouvre entre les parenthèses du ${c`try ( ... )`} est <b>fermé automatiquement</b> à la fin, même en cas d'erreur. Plus besoin d'un ${c`finally { reader.close(); }`}.</p>`)}
  ${piege(`<p>${c`split`} prend une <b>expression régulière</b>. Le point ${c`.`} y veut dire « n'importe quel caractère » ! Pour couper sur un vrai point : ${c`split("\\.")`}.</p>`)}
  `},

  {
    id: 'flux', theme: 'io', tps: ['serial', 'hotel'],
    titre: 'Les flux (streams) d’entrée / sortie',
    resume: 'Un flux est un tuyau d’octets. On emboîte des tuyaux pour ajouter des capacités.',
    corps: `
  ${idee(`<p>Un <b>flux</b> (<i>stream</i>) est un tuyau dans lequel circulent des données, octet par octet. <b>Input</b> = on lit (entrée), <b>Output</b> = on écrit (sortie).</p>
  <p>On <b>emboîte</b> les flux comme des poupées russes : chacun ajoute une capacité à celui qu'il entoure (c'est le patron <b>Décorateur</b>).</p>`)}
  ${uml({ alt: 'Chaîne de flux pour écrire un objet', classes: [
    { id: 'O', name: 'hotel : Hotel', obj: true, compact: true, x: 0, y: 0 },
    { id: 'OOS', name: 'ObjectOutputStream', compact: true, x: 230, y: 0 },
    { id: 'FOS', name: 'FileOutputStream', compact: true, x: 500, y: 0 },
    { id: 'F', name: 'fichier', stereo: 'disque', compact: true, x: 740, y: -6 }
  ], rels: [
    { type: 'dep', from: 'O', to: 'OOS', label: 'writeObject' },
    { type: 'dep', from: 'OOS', to: 'FOS', label: 'octets' },
    { type: 'dep', from: 'FOS', to: 'F', label: 'écrit' }
  ], caption: 'ObjectOutputStream transforme l’objet en octets, FileOutputStream les écrit dans le fichier' })}
  ${J`
    ObjectOutputStream oos = new ObjectOutputStream(new FileOutputStream("aujourdhui"));
    //                       ^ sait écrire des objets  ^ sait écrire dans un fichier
  `}
  ${table(['', 'Octets (binaire)', 'Caractères (texte)'], [
    ['Lire', c`InputStream` + ' → ' + c`FileInputStream` + ', ' + c`ObjectInputStream`, c`Reader` + ' → ' + c`FileReader` + ', ' + c`BufferedReader`],
    ['Écrire', c`OutputStream` + ' → ' + c`FileOutputStream` + ', ' + c`ObjectOutputStream`, c`Writer` + ' → ' + c`FileWriter` + ', ' + c`BufferedWriter`]
  ])}
  ${retenir(`<p>Toujours <b>fermer</b> un flux (ou utiliser try-with-resources). Fermer le flux extérieur ferme aussi ceux qu'il entoure.</p>`)}
  `},

  {
    id: 'serialisation', theme: 'io', tps: ['serial', 'hotel'],
    titre: 'Sérialisation : sauvegarder un objet',
    resume: 'Transformer un objet en suite d’octets pour l’écrire dans un fichier. Il faut implements Serializable.',
    corps: `
  ${idee(`<p><b>Sérialiser</b> = transformer un objet (qui vit en mémoire) en une suite d'octets qu'on peut écrire dans un fichier ou envoyer sur le réseau. <b>Désérialiser</b> = l'inverse : recréer l'objet à partir des octets.</p>
  <p>Condition : la classe doit implémenter ${c`Serializable`} (interface marqueur, aucune méthode à écrire).</p>`)}
  ${F('Hotel.java (TP Sérialisation)')`
    public class Hotel implements Serializable {
        private static final long serialVersionUID = 1L;
        private String name;
        private int stars;
        private String city;
        ...
    }
  `}
  ${F('HotelSerializer.java')`
    public class HotelSerializer {
        public static void main(String[] args) {
            Hotel h = new Hotel("Paradis", 4, "Nancy");
            try (ObjectOutputStream oos =
                     new ObjectOutputStream(new FileOutputStream("hotel.ser"))) {
                oos.writeObject(h);                       // UNE écriture
                System.out.println("Hôtel sérialisé");
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }
  `}
  ${piege(`<p>Si un objet à sauvegarder n'est pas ${c`Serializable`} → ${c`NotSerializableException`} au moment du ${c`writeObject`}.</p>`)}
  `},

  {
    id: 'deserialisation', theme: 'io', tps: ['serial', 'hotel'],
    titre: 'Désérialisation : relire un objet',
    resume: 'readObject() recrée l’objet. Il renvoie un Object → il faut un cast.',
    corps: `
  ${F('HotelDeserializer.java')`
    public class HotelDeserializer {
        public static void main(String[] args) {
            try (ObjectInputStream ois =
                     new ObjectInputStream(new FileInputStream("hotel.ser"))) {
                Hotel h = (Hotel) ois.readObject();        // cast obligatoire
                System.out.println(h.getName() + " " + h.getStars() + "* " + h.getCity());
            } catch (IOException | ClassNotFoundException e) {
                e.printStackTrace();
            }
        }
    }
  `}
  ${O`
    Paradis 4* Nancy
  `}
  ${table(['Exception', 'Quand ?'], [
    [c`IOException`, 'fichier introuvable, illisible, abîmé'],
    [c`ClassNotFoundException`, 'le fichier contient un objet dont la classe n’existe pas dans le programme qui lit'],
    [c`InvalidClassException`, 'la classe a changé depuis la sauvegarde (serialVersionUID différent)']
  ])}
  ${retenir(`<ul><li>${c`readObject()`} ne sait pas ce qu'il lit → il renvoie un ${c`Object`}, d'où le cast ${c`(Hotel)`}.</li>
  <li>Lire <b>dans le même ordre</b> que l'écriture.</li>
  <li>Le constructeur n'est <b>pas</b> appelé à la désérialisation : l'objet est recréé tel quel.</li></ul>`)}
  `},

  {
    id: 'graphe-objets', theme: 'io', tps: ['hotel', 'serial'],
    titre: 'Sauvegarder tout l’hôtel en une seule écriture',
    resume: 'writeObject(this) sauvegarde l’objet ET tout ce qu’il contient (listes, chambres…).',
    corps: `
  ${idee(`<p>Quand on sérialise un objet, Java suit <b>tous ses attributs</b>, puis les attributs de ses attributs… C'est le <b>graphe d'objets</b>. Un seul ${c`writeObject(hotel)`} sauvegarde donc l'hôtel, ses deux ${c`ArrayList`} et toutes les chambres.</p>`)}
  ${uml({ alt: 'Graphe d’objets de l’hôtel', classes: [
    { id: 'H', name: 'hotel : Hotel', obj: true, compact: true, cx: 300, y: 0 },
    { id: 'L', name: 'libres : ArrayList', obj: true, compact: true, cx: 150, y: 80 },
    { id: 'R', name: 'reservees : ArrayList', obj: true, compact: true, cx: 460, y: 80 },
    { id: 'C1', name: 'c1 : ChambreDouble', obj: true, compact: true, cx: 80, y: 170 },
    { id: 'C2', name: 'c2 : ChambreDoubleDouche', obj: true, compact: true, cx: 290, y: 170 },
    { id: 'C3', name: 'c3 : Appartement', obj: true, compact: true, cx: 510, y: 170 }
  ], rels: [
    { type: 'assoc', from: 'H', to: 'L' }, { type: 'assoc', from: 'H', to: 'R' },
    { type: 'assoc', from: 'L', to: 'C1' }, { type: 'assoc', from: 'L', to: 'C2' }, { type: 'assoc', from: 'R', to: 'C3' }
  ], caption: 'Diagramme d’objets : tout ce qui est accessible depuis hotel est sauvegardé' })}
  ${F('Hotel.java')`
    public void sauvegarder(String nomFichier) throws IOException {
        try (ObjectOutputStream oos = new ObjectOutputStream(new FileOutputStream(nomFichier))) {
            oos.writeObject(this);                 // tout l'hôtel d'un coup
        }
    }

    public static Hotel charger(String nomFichier) throws IOException, ClassNotFoundException {
        try (ObjectInputStream ois = new ObjectInputStream(new FileInputStream(nomFichier))) {
            return (Hotel) ois.readObject();       // une seule lecture
        }
    }
  `}
  ${tonTP(`<p><b>« Faut-il modifier les entêtes des classes ? »</b> → <b>Oui.</b> ${c`Hotel implements Serializable`} et ${c`Chambre implements Serializable`}. Les filles (${c`ChambreDouble`}…) l'héritent, pas besoin de le répéter. ${c`ArrayList`} est déjà sérialisable. La classe anonyme de la suite l'est aussi (elle hérite d'${c`Appartement`}).</p>`)}
  ${retenir(`<p><b>Bonus</b> (liste d'hôtels) : une ${c`ArrayList<Hotel>`} est sérialisable si ${c`Hotel`} l'est → ${c`oos.writeObject(liste)`} puis ${c`(List<Hotel>) ois.readObject()`}.</p>`)}
  `},

  {
    id: 'transient-static', theme: 'io', tps: ['serial', 'hotel'],
    titre: 'serialVersionUID, transient et static',
    resume: 'Le numéro de version de la classe, les attributs qu’on ne veut pas sauver, et ceux qui ne le sont jamais.',
    corps: `
  <h4>serialVersionUID</h4>
  <p>Un <b>numéro de version</b> de la classe, écrit dans le fichier. À la relecture, Java compare : si le numéro du fichier ≠ celui de la classe → ${c`InvalidClassException`}. Si on ne l'écrit pas, Java en calcule un qui change dès qu'on touche la classe.</p>
  ${J`
    private static final long serialVersionUID = 1L;
  `}
  <h4>transient</h4>
  <p>Un attribut ${c`transient`} n'est <b>pas sauvegardé</b>. À la relecture, il vaut la valeur par défaut (${c`0`}, ${c`false`}, ${c`null`}). Utile pour un mot de passe, un cache, ou un attribut non sérialisable.</p>
  ${J`
    private transient String motDePasse;   // pas écrit dans le fichier
  `}
  <h4>static</h4>
  <p>Un attribut ${c`static`} appartient à la <b>classe</b>, pas à l'objet : il n'est <b>jamais</b> sauvegardé.</p>
  ${tonTP(`<p>${c`nbc`} (static) n'est pas dans le fichier ${c`aujourdhui`}. Dans le même programme ça ne se voit pas (la valeur est toujours en mémoire). Mais si on relance le programme et qu'on charge l'hôtel, ${c`nbc`} repart à <b>0</b> : la prochaine chambre ajoutée recevrait le numéro 1, déjà pris ! Solution : recalculer ${c`nbc`} après ${c`charger`} (plus grand numéro trouvé), ou ne pas le mettre en static.</p>`)}
  ${table(['Attribut', 'Sauvegardé ?'], [
    ['normal', 'oui'], [c`transient`, 'non → valeur par défaut'], [c`static`, 'non → valeur actuelle de la classe']
  ])}
  `},

  /* ===================================================== CONCEPTION */
  {
    id: 'bonne-conception', theme: 'conception', tps: ['tele'],
    titre: 'Les règles d’une bonne conception',
    resume: 'Peu de lignes à changer pour ajouter, dépendre d’interfaces, jamais de copier-coller.',
    corps: `
  ${idee(`<p>Un programme qui marche n'est pas forcément bien conçu. Bien conçu = <b>facile à comprendre, à modifier et à étendre</b>.</p>`)}
  <ol class="regles">
  <li><b>Compter les lignes à modifier pour ajouter quelque chose.</b> V0+Hifi : ~20 lignes dans Telecommande par appareil. V1 : 0. Moins il y en a, meilleure est la conception.</li>
  <li><b>Localiser les dépendances.</b> Éviter une classe centrale qui dépend de tout ; préférer plusieurs petites classes qui isolent chacune un lien.</li>
  <li><b>Dépendre d'interfaces, pas de classes concrètes.</b> Une interface change rarement ; une classe évolue souvent.</li>
  <li><b>Bien choisir les méthodes de l'interface.</b> Assez générales (${c`allumer`} plutôt que ${c`augmenterSon`}) pour que tous les appareils puissent les respecter.</li>
  <li><b>Jamais de copier-coller.</b> Du code dupliqué = des bugs dupliqués. Il faut factoriser.</li>
  <li><b>Programmer vers l'interface :</b> ${c`List<X> l = new ArrayList<>()`}, ${c`Set<X> s = new TreeSet<>()`}.</li>
  </ol>
  ${retenir(`<p>Le diagramme de classes sert à <b>réfléchir avant de coder</b>. Si une flèche part d'une classe vers beaucoup d'autres classes concrètes, c'est le moment d'introduire une interface.</p>`)}
  `},

  {
    id: 'packages', theme: 'bases', tps: ['coll'],
    titre: 'Packages et import',
    resume: 'Un package est un dossier de classes. import permet d’utiliser une classe d’un autre package.',
    corps: `
  ${idee(`<p>Un <b>package</b> range les classes par thème, comme des dossiers. ${c`package tp1;`} en 1<sup>re</sup> ligne = « ce fichier est dans le dossier ${c`tp1`} ».</p>
  <p>${c`import`} évite d'écrire le nom complet d'une classe d'un autre package.</p>`)}
  ${J`
    package tp1;

    import java.util.ArrayList;     // une classe précise
    import java.util.List;
    import java.io.*;               // toutes les classes de java.io

    public class MoneyList { ... }
  `}
  ${table(['Package', 'Contient (dans les TP)'], [
    [c`java.lang`, c`String` + ', ' + c`Integer` + ', ' + c`Comparable` + ', ' + c`Exception` + ' — importé automatiquement'],
    [c`java.util`, c`List` + ', ' + c`ArrayList` + ', ' + c`Set` + ', ' + c`HashSet` + ', ' + c`TreeSet` + ', ' + c`Comparator` + ', ' + c`Collections` + ', ' + c`Scanner`],
    [c`java.io`, c`FileReader` + ', ' + c`BufferedReader` + ', ' + c`ObjectOutputStream` + ', ' + c`Serializable` + ', ' + c`IOException`]
  ])}
  `}
  ];

  /*
   * QCM : la bonne réponse est toujours écrite en PREMIER dans "choix",
   * l'ordre est mélangé à l'affichage.
   * type 'pratique' = lire du code / un diagramme ; 'theorie' = question de cours.
   */
  const QCM = [

  /* ======================= PRATIQUE : CODE ======================= */
  { theme: 'heritage', type: 'pratique',
    q: 'Qu’affiche ce code ?',
    code: J`
      interface Appareil { void allumer(); }
      class Lampe implements Appareil { public void allumer() { System.out.print("L"); } }
      class Hifi  implements Appareil { public void allumer() { System.out.print("H"); } }

      List<Appareil> l = new ArrayList<>();
      l.add(new Hifi()); l.add(new Lampe()); l.add(new Hifi());
      for (Appareil a : l) a.allumer();
    `,
    choix: [c`HLH`, c`LHL`, c`AAA`, 'Erreur de compilation : on ne peut pas mettre une Lampe dans une ' + c`List<Appareil>`],
    expl: 'Polymorphisme : chaque objet exécute <b>sa</b> version de ' + c`allumer()` + ', dans l’ordre de la liste. Une Lampe <b>est</b> un Appareil, donc elle a sa place dans la liste.' },

  { theme: 'bases', type: 'pratique',
    q: 'Qu’affiche ce code ?',
    code: J`
      String a = new String("java");
      String b = new String("java");
      System.out.println((a == b) + " " + a.equals(b));
    `,
    choix: [c`false true`, c`true true`, c`true false`, c`false false`],
    expl: c`new` + ' crée deux objets distincts : ' + c`==` + ' compare les adresses → ' + c`false` + '. ' + c`equals` + ' compare le contenu → ' + c`true` + '.' },

  { theme: 'collections', type: 'pratique',
    q: 'Qu’affiche ce code (dans quasiment tous les cas) ?',
    code: J`
      class P {
          int x;
          P(int x) { this.x = x; }
          public boolean equals(Object o) { return o instanceof P && ((P) o).x == x; }
          // pas de hashCode()
      }

      Set<P> s = new HashSet<>();
      s.add(new P(1));
      s.add(new P(1));
      System.out.println(s.size());
    `,
    choix: [c`2`, c`1`, c`0`, 'Une exception'],
    expl: 'Sans ' + c`hashCode()` + ' redéfini, les deux objets ont des hashCode différents : le HashSet les range dans des cases différentes et n’appelle jamais ' + c`equals` + '. Résultat : un doublon. D’où la règle « equals ⇒ hashCode ».' },

  { theme: 'collections', type: 'pratique',
    q: 'Qu’affiche ce code ?',
    code: J`
      Set<Integer> s = new TreeSet<>(List.of(5, 1, 3, 1));
      System.out.println(s);
    `,
    choix: [c`[1, 3, 5]`, c`[5, 1, 3]`, c`[1, 1, 3, 5]`, c`[5, 3, 1]`],
    expl: 'Un ' + c`TreeSet` + ' supprime les doublons (le 2ᵉ ' + c`1` + ') et garde les éléments triés dans l’ordre naturel (croissant pour des Integer).' },

  { theme: 'collections', type: 'pratique',
    q: 'Qu’affiche ce code ?',
    code: J`
      List<String> l = new ArrayList<>(List.of("10", "9", "100"));
      Collections.sort(l);
      System.out.println(l);
    `,
    choix: [c`[10, 100, 9]`, c`[9, 10, 100]`, c`[100, 10, 9]`, c`[10, 9, 100]`],
    expl: 'Ce sont des <b>String</b> : comparaison caractère par caractère. "10" et "100" commencent par \'1\' (< \'9\'), et "10" est un préfixe de "100" donc passe avant.' },

  { theme: 'heritage', type: 'pratique',
    q: 'Quelles lignes ne compilent PAS ?',
    code: J`
      abstract class Forme { abstract double aire(); }
      class Carre extends Forme {
          double c;
          Carre(double c) { this.c = c; }
          double aire() { return c * c; }
      }

      Forme f1 = new Carre(2);   // ligne A
      Forme f2 = new Forme();    // ligne B
      Carre c  = f1;             // ligne C
    `,
    choix: ['B et C', 'B seulement', 'A et B', 'Tout compile'],
    expl: '<b>B</b> : on ne peut pas instancier une classe abstraite. <b>C</b> : ' + c`f1` + ' est déclaré ' + c`Forme` + ' ; pour le ranger dans un ' + c`Carre` + ' il faut un cast : ' + c`Carre c = (Carre) f1;` + '. A est correcte : un Carre <b>est</b> une Forme.' },

  { theme: 'bases', type: 'pratique',
    q: 'Ce code compile-t-il ?',
    code: J`
      class Mere {
          Mere(int n) { }
      }
      class Fille extends Mere {
          Fille() { }
      }
    `,
    choix: ['Non : ' + c`Fille()` + ' appelle implicitement ' + c`super()` + ', qui n’existe pas', 'Oui', 'Non : une classe fille doit redéclarer les attributs de sa mère', 'Oui, mais il plante à l’exécution'],
    expl: 'Sans ' + c`super(...)` + ' explicite, Java ajoute ' + c`super();` + ' au début du constructeur. Or Mere n’a qu’un constructeur avec un ' + c`int` + '. Correction : ' + c`Fille() { super(0); }` + '.' },

  { theme: 'heritage', type: 'pratique',
    q: 'Qu’affiche ce code ? (piège)',
    code: J`
      class A {
          void f(Object o) { System.out.print("A-Object"); }
      }
      class B extends A {
          void f(Object o) { System.out.print("B-Object"); }
          void f(String s) { System.out.print("B-String"); }
      }

      A x = new B();
      x.f("salut");
    `,
    choix: [c`B-Object`, c`B-String`, c`A-Object`, 'Erreur de compilation'],
    expl: '1) <b>Compilation</b> : ' + c`x` + ' est déclaré ' + c`A` + ', qui ne connaît que ' + c`f(Object)` + ' → c’est cette signature qui est choisie (la surcharge ' + c`f(String)` + ' est invisible). 2) <b>Exécution</b> : l’objet est un B, qui redéfinit ' + c`f(Object)` + ' → ' + c`B-Object` + '.' },

  { theme: 'exceptions', type: 'pratique',
    q: 'Qu’affiche ce code ?',
    code: J`
      try {
          System.out.print("1");
          int[] t = new int[2];
          t[2] = 5;
          System.out.print("2");
      } catch (ArrayIndexOutOfBoundsException e) {
          System.out.print("3");
      } finally {
          System.out.print("4");
      }
      System.out.print("5");
    `,
    choix: [c`1345`, c`12345`, c`134`, c`1235`],
    expl: c`t[2]` + ' est hors du tableau (indices 0 et 1) → exception : on saute directement au ' + c`catch` + ' (le 2 n’est jamais affiché), puis ' + c`finally` + ' s’exécute toujours, puis le programme continue normalement.' },

  { theme: 'exceptions', type: 'pratique',
    q: 'Ce code compile-t-il ?',
    code: J`
      class MonErreur extends Exception { }

      void verifier(int n) {
          if (n < 0) throw new MonErreur();
      }
    `,
    choix: ['Non : il manque ' + c`throws MonErreur` + ' (ou un try/catch)', 'Oui', 'Non : une exception doit avoir un message', 'Oui, mais seulement si n est positif'],
    expl: c`MonErreur` + ' hérite d’' + c`Exception` + ' : c’est une exception <b>vérifiée</b> (checked). La méthode doit soit l’attraper, soit l’annoncer : ' + c`void verifier(int n) throws MonErreur` + '.' },

  { theme: 'exceptions', type: 'pratique',
    q: 'Et celui-ci, compile-t-il ?',
    code: J`
      class MonErreur extends RuntimeException { }

      void verifier(int n) {
          if (n < 0) throw new MonErreur();
      }
    `,
    choix: ['Oui : une RuntimeException n’a pas besoin de ' + c`throws`, 'Non : il manque ' + c`throws MonErreur`, 'Non : on ne peut pas hériter de RuntimeException', 'Oui, mais l’exception est ignorée'],
    expl: 'Les sous-classes de ' + c`RuntimeException` + ' sont <b>non vérifiées</b> (unchecked) : le compilateur n’oblige ni à les attraper ni à les déclarer. Elles remontent quand même si elles sont lancées.' },

  { theme: 'bases', type: 'pratique',
    q: 'Qu’affiche ce code ?',
    code: J`
      class Compteur {
          static int n = 0;
          int id;
          Compteur() { n++; id = n; }
      }

      Compteur a = new Compteur();
      Compteur b = new Compteur();
      Compteur c = new Compteur();
      System.out.println(a.id + " " + c.id + " " + Compteur.n);
    `,
    choix: [c`1 3 3`, c`1 1 1`, c`3 3 3`, c`1 3 1`],
    expl: c`n` + ' est <b>static</b> : un seul compteur partagé, qui vaut 3 à la fin. ' + c`id` + ' est propre à chaque objet et garde la valeur de ' + c`n` + ' au moment de sa création.' },

  { theme: 'collections', type: 'pratique',
    q: 'Qu’affiche ce code ?',
    code: J`
      class Note implements Comparable<Note> {
          int v;
          Note(int v) { this.v = v; }
          public int compareTo(Note o) { return Integer.compare(o.v, this.v); }
          public String toString() { return "" + v; }
      }

      List<Note> l = new ArrayList<>(List.of(new Note(12), new Note(18), new Note(5)));
      Collections.sort(l);
      System.out.println(l);
    `,
    choix: [c`[18, 12, 5]`, c`[5, 12, 18]`, c`[12, 18, 5]`, 'Erreur : Note n’a pas de Comparator'],
    expl: 'Regarde l’ordre des arguments : ' + c`compare(o.v, this.v)` + ' est inversé par rapport à l’habitude → tri <b>décroissant</b>. ' + c`Collections.sort(l)` + ' sans comparateur utilise ' + c`compareTo` + '.' },

  { theme: 'collections', type: 'pratique',
    q: 'Qu’affiche ce code ?',
    code: J`
      List<String> l = new ArrayList<>(List.of("java", "uml", "poo", "ok"));
      l.sort(Comparator.comparing(String::length));
      System.out.println(l);
    `,
    choix: [c`[ok, uml, poo, java]`, c`[ok, poo, uml, java]`, c`[java, ok, poo, uml]`, c`[java, uml, poo, ok]`],
    expl: 'Tri par <b>longueur</b> (2, 3, 3, 4). "uml" et "poo" ont la même longueur : le tri de Java est <b>stable</b>, ils gardent leur ordre de départ (uml avant poo).' },

  { theme: 'collections', type: 'pratique',
    q: 'Qu’affiche ce code ?',
    code: J`
      List<Integer> l = new ArrayList<>(List.of(10, 20, 30));
      l.remove(1);
      System.out.println(l);
    `,
    choix: [c`[10, 30]`, c`[20, 30]`, c`[10, 20, 30]`, c`[10, 20]`],
    expl: 'Avec un ' + c`int` + ', ' + c`remove(1)` + ' retire la case d’<b>indice</b> 1 (le 20), pas la valeur 1. Pour retirer une valeur : ' + c`l.remove(Integer.valueOf(1))` + '.' },

  { theme: 'io', type: 'pratique',
    q: 'Qu’affiche ce code ?',
    code: J`
      String[] t = "192.168.0.1".split(".");
      System.out.println(t.length);
    `,
    choix: [c`0`, c`4`, c`1`, c`11`],
    expl: c`split` + ' prend une expression régulière où ' + c`.` + ' = « n’importe quel caractère » : chaque caractère est un séparateur, il ne reste que des morceaux vides, que split supprime. Il fallait ' + c`split("\\.")` + ' → 4.' },

  { theme: 'collections', type: 'pratique',
    q: 'Qu’affiche ce code ?',
    code: J`
      System.out.println("64".compareTo("192") > 0);
      System.out.println(Integer.compare(64, 192) > 0);
    `,
    choix: [c`true` + ' puis ' + c`false`, c`false` + ' puis ' + c`false`, c`true` + ' puis ' + c`true`, c`false` + ' puis ' + c`true`],
    expl: 'En texte, \'6\' > \'1\' donc "64" est « après » "192" → ' + c`true` + '. En nombres, 64 < 192 → ' + c`false` + '. C’est pour ça qu’on trie des IP en comparant des entiers.' },

  { theme: 'collections', type: 'pratique',
    q: 'Que se passe-t-il ?',
    code: J`
      List<String> l = new ArrayList<>(List.of("a", "b", "c"));
      for (String s : l) {
          if (s.equals("a")) l.remove(s);
      }
      System.out.println(l);
    `,
    choix: [c`ConcurrentModificationException`, 'Affiche ' + c`[b, c]`, 'Affiche ' + c`[a, b, c]`, 'Erreur de compilation'],
    expl: 'On modifie la liste pendant qu’un for-each la parcourt : au tour suivant, l’itérateur détecte le changement et lance l’exception. Solution : ' + c`l.removeIf(s -> s.equals("a"))` + ' ou un ' + c`Iterator` + '.' },

  { theme: 'heritage', type: 'pratique',
    q: 'Qu’affiche ce code ?',
    code: J`
      abstract class Animal {
          abstract String cri();
          public String toString() { return "Je fais " + cri(); }
      }

      Animal a = new Animal() {
          String cri() { return "meuh"; }
      };
      System.out.println(a);
    `,
    choix: [c`Je fais meuh`, 'Erreur : on ne peut pas faire ' + c`new Animal()`, c`Je fais null`, c`Animal@1b6d3586`],
    expl: 'Les accolades après ' + c`new Animal()` + ' créent une <b>classe anonyme</b> qui hérite d’Animal et écrit ' + c`cri()` + '. Le ' + c`toString` + ' de la mère appelle la version de la fille (polymorphisme).' },

  { theme: 'heritage', type: 'pratique',
    q: 'Qu’affiche ce code ?',
    code: J`
      interface Volant { }
      class Oiseau implements Volant { }
      class Pingouin extends Oiseau { }

      Object p = new Pingouin();
      System.out.println((p instanceof Oiseau) + " " + (p instanceof Volant));
    `,
    choix: [c`true true`, c`true false`, c`false false`, c`false true`],
    expl: 'Pingouin hérite d’Oiseau, donc il hérite aussi de son ' + c`implements Volant` + '. ' + c`instanceof` + ' regarde le vrai objet, pas le type déclaré (' + c`Object` + ').' },

  { theme: 'io', type: 'pratique',
    q: 'On sérialise un User, puis on le relit dans un AUTRE programme. Qu’affiche la dernière ligne ?',
    code: J`
      class User implements Serializable {
          String nom = "Ada";
          transient String mdp = "1234";
      }

      // ... writeObject(new User()) dans le programme 1
      // ... dans le programme 2 :
      User u = (User) ois.readObject();
      System.out.println(u.nom + " " + u.mdp);
    `,
    choix: [c`Ada null`, c`Ada 1234`, c`null null`, c`NotSerializableException`],
    expl: c`transient` + ' = pas sauvegardé. À la relecture, ni le constructeur ni les initialisations (' + c`= "1234"` + ') ne sont rejoués : ' + c`mdp` + ' prend la valeur par défaut, ' + c`null` + '.' },

  { theme: 'io', type: 'pratique',
    q: 'Que se passe-t-il ?',
    code: J`
      class Moteur { }
      class Voiture implements Serializable {
          Moteur m = new Moteur();
      }

      oos.writeObject(new Voiture());
    `,
    choix: [c`NotSerializableException` + ' à l’exécution', 'Erreur de compilation', 'La voiture est écrite sans son moteur', 'Tout fonctionne'],
    expl: 'La sérialisation suit tous les attributs. ' + c`Moteur` + ' n’implémente pas Serializable → exception au moment du ' + c`writeObject` + '. Le compilateur, lui, ne vérifie rien. Solutions : ' + c`Moteur implements Serializable` + ' ou ' + c`transient Moteur m` + '.' },

  { theme: 'io', type: 'pratique',
    q: 'Ce code compile-t-il ?',
    code: J`
      try (ObjectInputStream ois = new ObjectInputStream(new FileInputStream("save"))) {
          Voiture v = ois.readObject();
      }
    `,
    choix: ['Non : ' + c`readObject()` + ' renvoie un Object, il faut ' + c`(Voiture)` + ' (et gérer les exceptions)', 'Oui', 'Non : il faut fermer le flux avec close()', 'Non : on ne peut pas emboîter deux flux'],
    expl: 'Deux problèmes : le cast manquant (' + c`Voiture v = (Voiture) ois.readObject();` + ') et les exceptions vérifiées ' + c`IOException` + ' / ' + c`ClassNotFoundException` + ' à attraper ou déclarer. La fermeture, elle, est faite par le try-with-resources.' },

  /* ======================= PRATIQUE : UML ======================= */
  { theme: 'uml', type: 'pratique',
    q: 'Ce diagramme est-il correct si Lampe fait « implements Appareil » ?',
    uml: uml({ classes: [{ id: 'L', name: 'Lampe', compact: true, x: 0, y: 6 }, { id: 'A', name: 'Appareil', stereo: 'interface', compact: true, x: 180, y: 0 }], rels: [{ type: 'extends', from: 'L', to: 'A' }] }),
    choix: ['Non : pour une interface implémentée, le trait doit être en pointillés', 'Oui, c’est correct', 'Non : la flèche devrait partir d’Appareil vers Lampe', 'Non : il faudrait un losange'],
    expl: 'Trait <b>plein</b> + triangle = héritage (' + c`extends` + '). Trait <b>pointillé</b> + triangle = réalisation (' + c`implements` + '). Le sens, lui, est bon : vers le parent.' },

  { theme: 'uml', type: 'pratique',
    q: 'Ce diagramme est-il correct ? (Douche et Serializable sont deux interfaces)',
    uml: uml({ classes: [{ id: 'D', name: 'Douche', stereo: 'interface', compact: true, x: 0, y: 0 }, { id: 'S', name: 'Serializable', stereo: 'interface', compact: true, x: 190, y: 0 }], rels: [{ type: 'extends', from: 'D', to: 'S' }] }),
    choix: ['Oui : entre deux interfaces, c’est un héritage (' + c`extends` + '), trait plein', 'Non : il faut des pointillés car ce sont des interfaces', 'Non : une interface ne peut pas hériter', 'Non : la flèche est dans le mauvais sens'],
    expl: 'En Java : ' + c`interface Douche extends Serializable` + '. Une interface <b>étend</b> une autre interface (même mot-clé qu’entre classes), donc trait plein. Les pointillés, c’est uniquement classe → interface.' },

  { theme: 'uml', type: 'pratique',
    q: 'Peut-on coder ce diagramme en Java ? (A et B sont deux classes)',
    uml: uml({ classes: [{ id: 'A', name: 'A', compact: true, cx: 40, y: 0 }, { id: 'B', name: 'B', compact: true, cx: 200, y: 0 }, { id: 'C', name: 'C', compact: true, cx: 120, y: 100 }], rels: [{ type: 'extends', from: 'C', to: 'A', fo: -25 }, { type: 'extends', from: 'C', to: 'B', fo: 25 }] }),
    choix: ['Non : Java interdit d’hériter de deux classes', 'Oui : ' + c`class C extends A, B`, 'Oui : ' + c`class C extends A implements B`, 'Oui, si A et B sont abstraites'],
    expl: 'Pas d’héritage multiple de <b>classes</b> en Java (même abstraites). Solution : transformer A ou B en <b>interface</b>, et écrire ' + c`class C extends A implements B` + '.' },

  { theme: 'uml', type: 'pratique',
    q: 'Quel code Java correspond à ce diagramme ?',
    uml: uml({ classes: [{ id: 'T', name: 'Telecommande', compact: true, x: 0, y: 0 }, { id: 'L', name: 'Lampe', compact: true, x: 250, y: 0 }], rels: [{ type: 'assoc', from: 'T', to: 'L', m2: '0..*', m2s: -1, label: 'lampes' }] }),
    choix: [c`class Telecommande { private List<Lampe> lampes; }`, c`class Lampe { private List<Telecommande> lampes; }`, c`class Telecommande extends Lampe { }`, c`class Telecommande { private Lampe lampes; }`],
    expl: 'Association navigable de Telecommande vers Lampe → un <b>attribut</b> dans Telecommande. Multiplicité ' + c`0..*` + ' → une <b>collection</b>. Le nom sur la flèche (' + c`lampes` + ') est le nom de l’attribut.' },

  { theme: 'uml', type: 'pratique',
    q: 'Quel code Java correspond à ce diagramme ?',
    uml: uml({ classes: [{ id: 'C', name: 'Comparable<T>', stereo: 'interface', compact: true, cx: 90, y: 0 }, { id: 'M', name: 'Money', compact: true, cx: 90, y: 100 }], rels: [{ type: 'implements', from: 'M', to: 'C', label: 'T = Money' }] }),
    choix: [c`class Money implements Comparable<Money>`, c`class Money extends Comparable<Money>`, c`interface Money extends Comparable<Money>`, c`class Comparable implements Money`],
    expl: 'Pointillés + triangle vers une «interface», en partant d’une classe → ' + c`implements` + '. Le ' + c`T = Money` + ' indique le type générique : ' + c`Comparable<Money>` + '.' },

  { theme: 'uml', type: 'pratique',
    q: 'On code exactement ce diagramme : Carre n’a aucune méthode. Que se passe-t-il ?',
    uml: uml({ classes: [{ id: 'F', name: 'Forme', abstract: true, cx: 90, y: 0, methods: ['/+ aire() : double'] }, { id: 'C', name: 'Carre', cx: 90, y: 120, attrs: ['- cote : double'] }], rels: [{ type: 'extends', from: 'C', to: 'F' }] }),
    choix: ['Erreur de compilation : Carre doit écrire ' + c`aire()` + ' ou être abstraite', 'Ça compile, ' + c`aire()` + ' renvoie 0', 'Ça compile, mais ' + c`new Carre()` + ' plante', 'Ça compile car Carre hérite d’' + c`aire()`],
    expl: c`aire()` + ' est en <i>italique</i> → abstraite, sans code. Une classe <b>concrète</b> (nom pas en italique) qui en hérite doit obligatoirement la redéfinir.' },

  { theme: 'uml', type: 'pratique',
    q: 'Quelle déclaration Java correspond à l’attribut de cette classe ?',
    uml: uml({ classes: [{ name: 'Compteur', x: 0, y: 0, attrs: ['_- nb : int'], methods: ['+ Compteur()'] }] }),
    choix: [c`private static int nb;`, c`private int nb;`, c`public static int nb;`, c`private final int nb;`],
    expl: '<b>−</b> = ' + c`private` + '. <u>Souligné</u> = ' + c`static` + '. Et en UML le type se met <b>après</b> le nom (' + c`nb : int` + ').' },

  { theme: 'uml', type: 'pratique',
    q: 'Que dit ce diagramme ?',
    uml: uml({ classes: [{ id: 'M', name: 'Maison', compact: true, x: 0, y: 0 }, { id: 'P', name: 'Piece', compact: true, x: 200, y: 0 }], rels: [{ type: 'compo', from: 'M', to: 'P', m2: '1..*' }] }),
    choix: ['Une maison est faite d’au moins une pièce, et les pièces disparaissent avec elle', 'Une pièce est une sorte de maison', 'Une maison a zéro ou une pièce, qui existe sans elle', 'Piece hérite de Maison'],
    expl: '<b>Losange plein</b> côté Maison = composition : la partie (Piece) ne vit pas sans le tout. ' + c`1..*` + ' = au moins une.' },

  { theme: 'uml', type: 'pratique',
    q: 'Que signifie cette flèche pointillée dans le code ?',
    uml: uml({ classes: [{ id: 'A', name: 'MoneyList', compact: true, x: 0, y: 0 }, { id: 'B', name: 'DeviseComparator', compact: true, x: 220, y: 0 }], rels: [{ type: 'dep', from: 'A', to: 'B', label: '«utilise»' }] }),
    choix: ['MoneyList utilise DeviseComparator dans une méthode, sans le garder en attribut', 'MoneyList a un attribut de type DeviseComparator', 'MoneyList implémente DeviseComparator', 'DeviseComparator hérite de MoneyList'],
    expl: 'Pointillés + <b>flèche ouverte</b> = dépendance : usage ponctuel, par exemple ' + c`Collections.sort(list, new DeviseComparator());` + ' dans une méthode. Un attribut serait une association (trait plein).' },

  { theme: 'uml', type: 'pratique',
    q: 'Quel diagramme correspond à ce code ?',
    code: J`
      public abstract class Chambre { ... }
      public class ChambreDouble extends Chambre implements Douche { ... }
    `,
    choix: ['ChambreDouble → Chambre en trait plein ; ChambreDouble → «interface» Douche en pointillés', 'Les deux flèches en trait plein', 'Les deux flèches en pointillés', 'Chambre → ChambreDouble en trait plein ; Douche → ChambreDouble en pointillés'],
    expl: c`extends` + ' → trait plein + triangle vers la mère. ' + c`implements` + ' → pointillés + triangle vers l’interface. Les flèches partent toujours de l’<b>enfant</b>.' },

  /* ======================= THÉORIE ======================= */
  { theme: 'uml', type: 'theorie',
    q: 'Pourquoi dessiner un diagramme de classes avant de coder ?',
    choix: ['Pour réfléchir à l’organisation et aux dépendances quand c’est encore facile à changer', 'Parce que Java en a besoin pour compiler', 'Pour générer automatiquement les tests', 'Pour rendre le programme plus rapide'],
    expl: 'Le diagramme est un <b>outil de réflexion</b> : on voit qui dépend de qui, on repère une classe trop centrale ou un futur copier-coller, avant d’avoir écrit le code.' },

  { theme: 'uml', type: 'theorie',
    q: 'Dans une association A → B, que signifie le sens de la flèche ?',
    choix: ['A connaît B, donc A dépend de B', 'B connaît A, donc B dépend de A', 'A hérite de B', 'Rien : c’est décoratif'],
    expl: 'A a un attribut de type B. Si B change, A devra peut-être changer. On veut donc que les flèches pointent vers ce qui est <b>stable</b> (une interface).' },

  { theme: 'uml', type: 'theorie',
    q: 'Quel critère permet de choisir entre agrégation et composition ?',
    choix: ['La durée de vie : la partie peut-elle exister sans le tout ?', 'Le nombre d’attributs de la classe', 'Si la classe est abstraite ou non', 'Si la relation est public ou private'],
    expl: 'Agrégation (losange vide) : la partie survit au tout. Composition (losange plein) : elle disparaît avec lui.' },

  { theme: 'bases', type: 'theorie',
    q: 'Pourquoi mettre les attributs en private ?',
    choix: ['Pour contrôler leur accès et pouvoir changer l’intérieur de la classe sans casser le reste', 'Pour que le programme aille plus vite', 'Parce que Java l’impose', 'Pour qu’ils ne soient pas hérités'],
    expl: '<b>Encapsulation</b> : on passe par des méthodes (getters/setters) qui peuvent vérifier les valeurs. Les attributs private sont bien hérités, mais pas accessibles directement par les filles.' },

  { theme: 'bases', type: 'theorie',
    q: 'Pourquoi redéfinir hashCode quand on redéfinit equals ?',
    choix: ['Parce que deux objets égaux doivent avoir le même hashCode, sinon HashSet/HashMap ne marchent plus', 'Pour accélérer equals', 'Parce que le compilateur l’exige', 'Pour pouvoir trier les objets'],
    expl: 'HashSet cherche d’abord la case avec hashCode, puis compare avec equals dans cette case. Deux objets égaux mais avec des hashCode différents → doublon.' },

  { theme: 'bases', type: 'theorie',
    q: 'À quoi sert @Override ?',
    choix: ['À faire vérifier par le compilateur qu’on redéfinit bien une méthode existante', 'À rendre une méthode obligatoire', 'À empêcher les filles de redéfinir la méthode', 'À rendre la méthode plus rapide'],
    expl: 'Une faute de nom ou de paramètre (ex. ' + c`equals(Money m)` + ') devient une erreur de compilation au lieu de créer une surcharge par accident.' },

  { theme: 'heritage', type: 'theorie',
    q: 'Avec « Appareil a = new Lampe(); a.allumer(); », quelle méthode allumer() est exécutée ?',
    choix: ['Celle de Lampe : le choix se fait à l’exécution selon le vrai objet', 'Celle d’Appareil, le type déclaré', 'Aucune : erreur de compilation', 'Ça dépend de l’ordre des imports'],
    expl: 'C’est la <b>liaison dynamique</b>, le cœur du polymorphisme. Le type déclaré dit seulement quelles méthodes on a le <b>droit</b> d’appeler.' },

  { theme: 'heritage', type: 'theorie',
    q: 'Pourquoi rendre une classe abstraite ?',
    choix: ['Elle représente un concept incomplet qui factorise du code commun et oblige les filles à compléter', 'Pour qu’elle soit plus rapide', 'Pour pouvoir en hériter plusieurs fois', 'Pour cacher ses attributs'],
    expl: 'On ne peut pas l’instancier, mais elle peut avoir attributs, constructeurs et méthodes concrètes, plus des méthodes abstraites que chaque fille doit écrire.' },

  { theme: 'heritage', type: 'theorie',
    q: 'Quand préférer une interface à une classe abstraite ?',
    choix: ['Quand des classes différentes doivent juste respecter le même contrat', 'Quand on veut partager des attributs', 'Quand on veut écrire un constructeur commun', 'Jamais : une classe abstraite fait tout mieux'],
    expl: 'Interface = « sait faire » (contrat, plusieurs possibles). Classe abstraite = « est un, en partie » (code et attributs partagés, une seule mère).' },

  { theme: 'heritage', type: 'theorie',
    q: 'Pourquoi Java autorise plusieurs interfaces mais une seule classe mère ?',
    choix: ['Deux classes mères pourraient avoir des attributs ou du code contradictoires ; une interface n’a pas d’état', 'Pour économiser de la mémoire', 'Parce que les interfaces sont plus récentes', 'C’est faux : on peut hériter de plusieurs classes'],
    expl: 'L’héritage multiple de classes crée des ambiguïtés (quel attribut, quelle méthode garder ?). Les interfaces ne sont que des promesses : pas de conflit d’état.' },

  { theme: 'heritage', type: 'theorie',
    q: 'Surcharge (overload) et redéfinition (override) : quand Java fait-il son choix ?',
    choix: ['Surcharge à la compilation, redéfinition à l’exécution', 'Les deux à la compilation', 'Les deux à l’exécution', 'Surcharge à l’exécution, redéfinition à la compilation'],
    expl: 'Surcharge : selon les <b>types déclarés</b> des arguments. Redéfinition : selon le <b>type réel</b> de l’objet sur lequel on appelle.' },

  { theme: 'heritage', type: 'theorie',
    q: 'À quoi sert une interface marqueur comme Serializable ?',
    choix: ['À coller une étiquette (une autorisation) sur une classe, testable avec instanceof', 'À fournir des méthodes par défaut', 'À empêcher l’héritage', 'À rendre la classe abstraite'],
    expl: 'Elle est vide : aucune méthode à écrire. Elle dit juste « cette classe a telle propriété ».' },

  { theme: 'heritage', type: 'theorie',
    q: 'Quand utiliser une classe anonyme ?',
    choix: ['Pour une sous-classe ou implémentation utilisée une seule fois, sur place', 'Pour cacher une classe aux autres packages', 'Pour hériter de plusieurs classes', 'Pour remplacer une interface'],
    expl: 'Exemple typique : un Comparator ponctuel, ou un objet unique un peu différent des autres. Ça évite un fichier pour presque rien.' },

  { theme: 'conception', type: 'theorie',
    q: 'Pourquoi le copier-coller est-il un signe de mauvaise conception ?',
    choix: ['Un bug ou une modification doit être répété dans chaque copie : le code n’est plus maintenable', 'Parce que le programme devient plus lent', 'Parce que Java refuse le code dupliqué', 'Parce que ça prend plus de place sur le disque'],
    expl: 'Il faut <b>factoriser</b> : mettre le code commun à un seul endroit (méthode, classe mère, interface + polymorphisme).' },

  { theme: 'conception', type: 'theorie',
    q: 'Quel est le meilleur indicateur d’une bonne conception ?',
    choix: ['Peu de lignes à modifier pour ajouter un nouvel élément', 'Le nombre total de classes', 'Le nombre de commentaires', 'Que tout soit dans une seule classe'],
    expl: 'Autre critère : des dépendances <b>localisées</b> (pas une classe centrale qui dépend de toutes les autres).' },

  { theme: 'conception', type: 'theorie',
    q: 'Que veut dire « ouvert à l’extension, fermé à la modification » ?',
    choix: ['On ajoute des comportements avec de nouvelles classes, sans retoucher le code existant', 'Les attributs sont public mais les méthodes private', 'On peut lire le code mais pas le compiler', 'Une classe ne peut pas avoir de fille'],
    expl: 'Exemple : une télécommande qui ne connaît qu’une interface Appareil. Nouveau type d’appareil = nouvelle classe, zéro ligne changée ailleurs.' },

  { theme: 'conception', type: 'theorie',
    q: 'Pourquoi dépendre d’interfaces plutôt que de classes concrètes ?',
    choix: ['Une interface change rarement : on peut ajouter ou modifier des implémentations sans toucher au code qui l’utilise', 'Les interfaces s’exécutent plus vite', 'On ne peut pas créer d’attribut d’un type classe', 'Pour éviter d’écrire des constructeurs'],
    expl: 'C’est aussi l’idée de ' + c`List<X> l = new ArrayList<>()` + ' : le code ne dépend que de ' + c`List` + '.' },

  { theme: 'collections', type: 'theorie',
    q: 'À quoi servent les génériques (List<Money>) ?',
    choix: ['Le compilateur vérifie le type rangé, et on récupère les éléments sans cast', 'À rendre la liste plus rapide', 'À autoriser les types primitifs comme int', 'À trier automatiquement la liste'],
    expl: 'Les erreurs de type arrivent à la compilation au lieu de l’exécution. Attention : ' + c`List<int>` + ' est interdit, on écrit ' + c`List<Integer>` + '.' },

  { theme: 'collections', type: 'theorie',
    q: 'Pourquoi écrire « List<X> l = new ArrayList<>() » plutôt que « ArrayList<X> l = … » ?',
    choix: ['Pour programmer vers l’interface : changer d’implémentation ne demande qu’un mot', 'Parce que ArrayList ne peut pas être un type de variable', 'Pour que la liste soit triée', 'Pour éviter les doublons'],
    expl: 'Le reste du code n’utilise que les méthodes de ' + c`List` + ' ; on pourrait passer à une ' + c`LinkedList` + ' sans rien casser.' },

  { theme: 'collections', type: 'theorie',
    q: 'Comment un HashSet sait-il qu’un élément est déjà présent ?',
    choix: ['hashCode() pour trouver la case, puis equals() pour comparer', 'compareTo() uniquement', '== uniquement', 'Il parcourt toute la liste avec toString()'],
    expl: 'D’où l’obligation de redéfinir les deux méthodes pour une classe perso.' },

  { theme: 'collections', type: 'theorie',
    q: 'Qu’utilise un TreeSet pour trier ET détecter les doublons ?',
    choix: ['compareTo (ou un Comparator) : 0 veut dire doublon', 'equals et hashCode', 'toString', 'L’ordre d’insertion'],
    expl: 'Un TreeSet n’appelle pas equals. Si deux objets différents donnent ' + c`compareTo == 0` + ', le second n’est pas ajouté.' },

  { theme: 'collections', type: 'theorie',
    q: 'Comparable ou Comparator : lequel permet plusieurs ordres de tri ?',
    choix: ['Comparator : une classe à part par ordre', 'Comparable : une méthode par ordre', 'Les deux en permettent un seul', 'Aucun, il faut trier à la main'],
    expl: c`Comparable` + ' = ordre <b>naturel</b>, unique, écrit dans la classe (' + c`compareTo` + '). ' + c`Comparator` + ' = ordre <b>externe</b>, autant qu’on veut (' + c`compare(o1, o2)` + ').' },

  { theme: 'collections', type: 'theorie',
    q: 'Pourquoi Integer.compare(a, b) plutôt que a - b dans compareTo ?',
    choix: ['a - b peut déborder et donner un mauvais signe', 'a - b ne compile pas', 'Integer.compare est obligatoire avec Comparable', 'a - b trie dans l’ordre inverse'],
    expl: 'Avec de grands nombres (ex. ' + c`Integer.MIN_VALUE - 1` + '), la soustraction dépasse la capacité d’un int et change de signe.' },

  { theme: 'exceptions', type: 'theorie',
    q: 'Pourquoi lancer une exception plutôt que renvoyer -1 ou null en cas d’erreur ?',
    choix: ['Une valeur spéciale peut être ignorée sans s’en rendre compte ; une exception interrompt et porte un message', 'Les exceptions sont plus rapides', 'On ne peut pas renvoyer -1 en Java', 'Pour que le programme ne s’arrête jamais'],
    expl: 'En plus, une exception <b>vérifiée</b> oblige l’appelant à traiter le cas.' },

  { theme: 'exceptions', type: 'theorie',
    q: 'Pour sa propre exception, quand hériter d’Exception plutôt que de RuntimeException ?',
    choix: ['Quand c’est une erreur prévisible que l’appelant doit obligatoirement gérer', 'Quand c’est un bug du programmeur', 'Toujours : RuntimeException est réservée à Java', 'Quand l’exception n’a pas de message'],
    expl: c`Exception` + ' = checked (fichier absent, devises incompatibles…). ' + c`RuntimeException` + ' = unchecked, plutôt pour les erreurs de programmation.' },

  { theme: 'exceptions', type: 'theorie',
    q: 'Que fait une exception qui n’est attrapée nulle part ?',
    choix: ['Elle remonte toute la pile d’appels et arrête le programme', 'Elle est ignorée', 'Elle relance la méthode', 'Elle renvoie null'],
    expl: 'Elle remonte de méthode appelante en méthode appelante jusqu’au premier ' + c`catch` + ' compatible ; s’il n’y en a pas, le programme plante avec la trace d’appels.' },

  { theme: 'io', type: 'theorie',
    q: 'Que garantit un try-with-resources ?',
    choix: ['Les ressources ouvertes dans try( ) sont fermées automatiquement, même en cas d’erreur', 'Qu’aucune exception ne sera lancée', 'Que le fichier existe', 'Que la lecture est plus rapide'],
    expl: 'Plus besoin d’un ' + c`finally { flux.close(); }` + '.' },

  { theme: 'io', type: 'theorie',
    q: 'Pourquoi emboîte-t-on les flux, ex. new ObjectOutputStream(new FileOutputStream(f)) ?',
    choix: ['Chaque flux ajoute une capacité à celui qu’il entoure (patron Décorateur)', 'Pour écrire deux fois le fichier', 'Parce qu’un flux seul ne peut pas être fermé', 'Pour chiffrer les données'],
    expl: 'FileOutputStream sait écrire des octets dans un fichier ; ObjectOutputStream sait transformer un objet en octets.' },

  { theme: 'io', type: 'theorie',
    q: 'Pourquoi l’interface Serializable ne contient-elle aucune méthode ?',
    choix: ['C’est un marqueur : elle autorise juste la sérialisation, faite par ObjectOutputStream', 'Parce que ses méthodes sont cachées', 'Parce qu’elle est abstraite', 'Erreur : elle contient writeObject et readObject à écrire'],
    expl: 'La classe dit seulement « j’accepte d’être sauvegardée ». Tout le travail est fait par les flux d’objets.' },

  { theme: 'io', type: 'theorie',
    q: 'À quoi sert serialVersionUID ?',
    choix: ['C’est le numéro de version de la classe, vérifié à la relecture', 'C’est l’identifiant unique de chaque objet', 'C’est la taille du fichier', 'C’est le nombre d’objets sérialisés'],
    expl: 'Si le numéro du fichier ne correspond pas à celui de la classe → ' + c`InvalidClassException` + '. Le fixer soi-même évite qu’une petite modification rende les anciens fichiers illisibles.' },

  { theme: 'io', type: 'theorie',
    q: 'Le constructeur est-il appelé quand on désérialise un objet ?',
    choix: ['Non : l’objet est recréé tel quel à partir des octets', 'Oui, le constructeur sans paramètre', 'Oui, avec les valeurs sauvegardées en paramètres', 'Seulement s’il est public'],
    expl: 'Les attributs reprennent les valeurs sauvegardées ; les ' + c`transient` + ' prennent la valeur par défaut, et les ' + c`static` + ' ne viennent pas du fichier.' }
  ];

  const LEXIQUE = [
    ['Abstrait(e)', 'Incomplet : une classe abstraite ne peut pas être instanciée, une méthode abstraite n’a pas de code.'],
    ['Agrégation', 'Lien « contient » faible : la partie peut exister sans le tout. Losange vide en UML.'],
    ['Association', 'Lien durable entre deux classes : l’une garde l’autre dans un attribut.'],
    ['Attribut', 'Variable qui appartient à un objet (son état). Ex. ' + c`nom` + ', ' + c`allume` + '.'],
    ['Cast (transtypage)', 'Dire à Java « cet objet est en fait un X » : ' + c`(Money) ob` + '.'],
    ['Checked exception', 'Exception que le compilateur oblige à traiter (try/catch ou throws).'],
    ['Classe', 'Le modèle (le moule) qui décrit les attributs et méthodes d’un type d’objet.'],
    ['Classe anonyme', 'Sous-classe sans nom créée sur place avec ' + c`new X() { ... }` + '.'],
    ['Collection', 'Objet qui contient d’autres objets : List, Set, Map…'],
    ['Comparable', 'Interface qui donne l’ordre naturel d’une classe via ' + c`compareTo` + '.'],
    ['Comparator', 'Interface d’un comparateur externe, via ' + c`compare(o1, o2)` + '.'],
    ['Composition', 'Lien « est fait de » fort : la partie meurt avec le tout. Losange plein.'],
    ['Constructeur', 'Méthode spéciale appelée par ' + c`new` + ' pour initialiser l’objet.'],
    ['Couplage', 'À quel point les classes dépendent les unes des autres. On le veut faible.'],
    ['Dépendance', 'Une classe en utilise une autre ponctuellement (dans une méthode). Flèche pointillée.'],
    ['Désérialiser', 'Recréer un objet à partir d’octets lus (fichier, réseau).'],
    ['Encapsulation', 'Cacher les attributs (private) et n’y donner accès que par des méthodes.'],
    ['Exception', 'Objet qui signale une erreur et remonte les appels jusqu’à un catch.'],
    ['Factoriser', 'Mettre du code répété à un seul endroit pour ne plus le dupliquer.'],
    ['Flux (stream)', 'Tuyau dans lequel circulent des données à lire ou à écrire.'],
    ['Générique', 'Classe paramétrée par un type : ' + c`List<Money>` + '.'],
    ['Getter / setter', 'Méthodes pour lire / modifier un attribut privé.'],
    ['hashCode', 'Numéro calculé à partir du contenu, utilisé pour ranger dans HashSet/HashMap.'],
    ['Héritage', 'Une classe fille récupère attributs et méthodes de sa mère (' + c`extends` + ').'],
    ['Implémenter', 'Écrire le code des méthodes promises par une interface (' + c`implements` + ').'],
    ['instanceof', 'Teste si un objet est d’un certain type : ' + c`c instanceof Douche` + '.'],
    ['Instance', 'Un objet concret créé à partir d’une classe. Synonyme d’objet.'],
    ['Interface', 'Contrat : liste de méthodes qu’une classe s’engage à fournir.'],
    ['Interface marqueur', 'Interface vide qui sert d’étiquette (Douche, Serializable).'],
    ['Liaison dynamique', 'Le choix de la méthode à exécuter se fait au moment de l’exécution, selon le vrai type.'],
    ['Méthode', 'Fonction qui appartient à une classe (ce que l’objet sait faire).'],
    ['Multiplicité', 'Combien d’objets à chaque bout d’une association : 1, 0..1, 0..*, 1..*.'],
    ['Navigabilité', 'Sens de l’association : qui connaît qui.'],
    ['Objet', 'Exemplaire concret d’une classe, avec ses propres valeurs.'],
    ['Package', 'Dossier qui regroupe des classes (' + c`java.util` + ', ' + c`tp1` + ').'],
    ['Polymorphisme', 'Un même appel donne des comportements différents selon l’objet réel.'],
    ['Redéfinition (override)', 'Réécrire dans une fille une méthode de la mère avec la même signature.'],
    ['Sérialiser', 'Transformer un objet en octets pour le sauvegarder ou l’envoyer.'],
    ['Signature', 'Nom d’une méthode + types de ses paramètres.'],
    ['static', 'Appartient à la classe, pas aux objets : un seul exemplaire partagé.'],
    ['Surcharge (overload)', 'Plusieurs méthodes de même nom avec des paramètres différents.'],
    ['transient', 'Attribut exclu de la sérialisation.'],
    ['UML', 'Langage de schémas pour décrire un logiciel (diagramme de classes, etc.).'],
    ['Unchecked exception', 'Exception (RuntimeException) qu’on n’est pas obligé de traiter.']
  ];

  MATIERES.push({
    id: 'genie-logiciel',
    nom: 'Génie Logiciel',
    sousTitre: 'Java & UML',
    description: 'Héritage, interfaces, UML, collections, exceptions, sérialisation — d’après les TP Télécommande, Collections, Hôtel Paradis et Sérialisation.',
    couleur: '#8250df',
    themes: THEMES, tps: TPS, fiches: FICHES, qcm: QCM, lexique: LEXIQUE
  });
})();
