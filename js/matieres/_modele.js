/*
 * MODÈLE pour ajouter une matière.
 * 1. Copier ce fichier (ex. js/matieres/reseaux.js) et remplir les listes.
 * 2. Ajouter dans index.html, avant app.js :  <script src="js/matieres/reseaux.js"></script>
 * Helpers disponibles : idee(), retenir(), piege(), tonTP(), table(), J`code`, F('Fichier')`code`, O`sortie`, c`code`, uml({...}).
 */
(function () {
  const THEMES = {
    bases: { nom: 'Bases', couleur: '#3b6fd8' }
  };

  const TPS = {};   // facultatif : { tp1: 'TP 1 — ...' }

  const FICHES = [
    {
      id: 'exemple', theme: 'bases', tps: [],
      titre: 'Titre de la fiche',
      resume: 'Une phrase qui résume la fiche (le recto de la carte).',
      corps: `
${idee(`<p>Explication simple.</p>`)}
${retenir(`<p>Le point clé.</p>`)}
`
    }
  ];

  // La bonne réponse est TOUJOURS la première de "choix" (l'ordre est mélangé à l'affichage).
  const QCM = [
    { theme: 'bases', type: 'theorie', q: 'Question ?', choix: ['Bonne réponse', 'Faux 1', 'Faux 2', 'Faux 3'], expl: 'Pourquoi.' }
    // type 'pratique' : ajouter code: J`...` ou uml: uml({...})
  ];

  const LEXIQUE = [
    ['Mot', 'Définition simple.']
  ];

  MATIERES.push({
    id: 'ma-matiere', nom: 'Ma matière', sousTitre: 'Sous-titre', description: 'Ce qu’on révise ici.',
    couleur: '#0e8a9a',
    themes: THEMES, tps: TPS, fiches: FICHES, qcm: QCM, lexique: LEXIQUE
  });
})();
