/* Briques de mise en page partagées par toutes les matières (encadrés, tableaux). */
window.MATIERES = [];

const idee = t => `<h4>L'idée</h4>${t}`;
const retenir = t => `<div class="box b-retenir"><strong>À retenir</strong>${t}</div>`;
const piege = t => `<div class="box b-piege"><strong>Piège</strong>${t}</div>`;
const tonTP = t => `<div class="box b-tp"><strong>Dans ton TP</strong>${t}</div>`;
const table = (head, rows) =>
  `<div class="tbl"><table><thead><tr>${head.map(h => `<th>${h}</th>`).join('')}</tr></thead><tbody>` +
  rows.map(r => `<tr>${r.map(x => `<td>${x}</td>`).join('')}</tr>`).join('') + '</tbody></table></div>';
const enTD = t => `<div class="box b-tp"><strong>En TD / TP</strong>${t}</div>`;
const methode = t => `<div class="box b-methode"><strong>Méthode</strong>${t}</div>`;
// R`...` garde les antislashs tels quels : indispensable pour écrire du LaTeX ($rac{a}{b}$) dans les fiches.
const R = String.raw;
