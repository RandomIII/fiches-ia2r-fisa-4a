# Fiches de révision — Génie Logiciel (Java & UML)

Site statique de fiches de révision construit à partir des TP de Génie Logiciel (Polytech 4A) :

- **TP Télécommande** : diagramme de classes UML ↔ Java, interfaces, polymorphisme, bonne conception
- **TP Collections** : `Money`, exceptions, `List`, `Comparable` / `Comparator`, `Set`, lecture de fichier
- **TP Hôtel Paradis** : héritage, classe abstraite, interface marqueur, classe anonyme, sérialisation
- **TP Sérialisation** : flux, `Serializable`, `serialVersionUID`, `transient`

Trois onglets : **Fiches** (cartes filtrables par thème / TP, avec code et diagrammes UML), **Quiz** (cartes question/réponse) et **Lexique**.
Chaque fiche a un lien partageable : `…/#f/<id-de-la-fiche>`.

## Lancer en local

Ouvrir `index.html` dans un navigateur suffit. Ou, avec Python :

```bash
python -m http.server 5173
```

## Publier sur GitHub Pages

1. Créer un dépôt vide sur GitHub (par ex. `fiches-genie-logiciel`).
2. Dans ce dossier :
   ```bash
   git remote add origin https://github.com/<ton-pseudo>/fiches-genie-logiciel.git
   git push -u origin main
   ```
3. Sur GitHub : **Settings → Pages → Source : Deploy from a branch → `main` / `/ (root)`**.
4. Le site est en ligne après ~1 min à `https://<ton-pseudo>.github.io/fiches-genie-logiciel/`.

## Modifier le contenu

Tout le contenu est dans [`js/data.js`](js/data.js) : `FICHES`, `QUIZ` et `LEXIQUE`.
Les diagrammes UML sont décrits en JS (boîtes + relations) et dessinés en SVG par [`js/uml.js`](js/uml.js).
