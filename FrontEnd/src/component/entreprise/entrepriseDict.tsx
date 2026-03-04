const secteurs = ["Informatique", "BTP", "Énergie", "Logistique", "Banque", "Santé", "Commerce", "Communication"];
const villes = ["Bobigny", "Paris", "Pantin", "Saint-Denis", "Montreuil", "Aubervilliers"];
const statuts = ["Partenaire signé", "En cours", "Prospect"];
const types = ["PME", "Grande Entreprise", "TPE", "Association"];

export const entreprisesDatas = Array.from({ length: 50 }, (_, i) => ({
  id: i + 1,
  nom: `Entreprise ${secteurs[i % secteurs.length]} ${i + 1}`,
  siret: `${Math.floor(10000000000000 + Math.random() * 90000000000000)}`,
  secteur: secteurs[i % secteurs.length],
  type: types[i % types.length],
  siteWeb: `https://www.entreprise${i + 1}.fr`,
  telephone: `01 ${Math.floor(10 + Math.random() * 89)} ${Math.floor(10 + Math.random() * 89)} ${Math.floor(10 + Math.random() * 89)} ${Math.floor(10 + Math.random() * 89)}`,
  ville: villes[i % villes.length],
  statut: statuts[i % statuts.length],
  commentaires: `Commentaire automatique pour l'entreprise numéro ${i + 1}. Partenariat à suivre de près.`
}));