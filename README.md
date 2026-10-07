# Fiches IA2R FISA 4A

Site statique de révision, une matière par carte sur l’accueil. Chaque matière a trois onglets :

- **Fiches** : cartes filtrables par thème / TP, avec code et diagrammes UML ;
- **QCM** : une bonne réponse sur 4, correction expliquée, environ 50 % de questions pratiques (lire du code, vérifier un diagramme UML) ;
- **Lexique** : les mots du cours expliqués simplement.

En ligne : https://randomiii.github.io/fiches-genie-logiciel/

Liens partageables : `#/genie-logiciel` (fiches), `#/genie-logiciel/qcm`, `#/genie-logiciel/f/<id-fiche>`.

## Matières

| Matière | Fichier |
|---|---|
| Génie Logiciel (Java & UML) | [`js/matieres/genie-logiciel.js`](js/matieres/genie-logiciel.js) |
| Traitement numérique du signal (3 parties) | [`js/matieres/tns.js`](js/matieres/tns.js) |

## Ajouter une matière

1. Copier [`js/matieres/_modele.js`](js/matieres/_modele.js) vers `js/matieres/<ma-matiere>.js` et remplir `THEMES`, `FICHES`, `QCM`, `LEXIQUE`.
2. Ajouter la ligne `<script src="js/matieres/<ma-matiere>.js"></script>` dans `index.html`, avant `app.js`.

Dans le QCM, la **bonne réponse est toujours écrite en premier** dans `choix` : l’ordre est mélangé à l’affichage.
Les diagrammes UML sont décrits en JS (boîtes + relations) et dessinés en SVG par [`js/uml.js`](js/uml.js) ;
les graphes de signaux (courbes, Dirac, suites, pôles/zéros) par [`js/plot.js`](js/plot.js).
Les formules s’écrivent en LaTeX (`$...$`, `$$...$$`) dans des chaînes ``R`...` `` et sont affichées par KaTeX.

Après une modification, incrémenter le `?v=` des scripts dans `index.html` pour que les navigateurs ne gardent pas l’ancienne version en cache.

## Mémos A4 (PDF)

Chaque partie peut avoir un mémo A4 recto verso (recto = cours, verso = exercices), défini dans `js/matieres/<matière>-memo.js`.
La police de chaque feuille s'ajuste automatiquement pour remplir les 3 colonnes sans déborder.
Les PDF téléchargeables sont dans `pdf/` ; pour les régénérer après une modification (serveur local lancé sur le port 5173) :

```bash
"/c/Program Files (x86)/Microsoft/Edge/Application/msedge.exe" --headless=new --no-pdf-header-footer --virtual-time-budget=20000 --print-to-pdf="pdf/tns-p1.pdf" "http://localhost:5173/?memo-print=1#/tns/p1/memo"
```

## Lancer en local

Ouvrir `index.html` dans un navigateur, ou :

```bash
python -m http.server 5173
```
