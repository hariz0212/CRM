const fonctions = [
  "Responsable RH", "DSI", "Directeur Technique", "Chargé de Recrutement", 
  "Développeur Senior", "Chef de Projet IT", "Responsable Stage", "Directeur Innovation"
];

const entreprises = [
  "TechCorp Paris", "BatiConstruct", "GreenELEC", "Mairie de Bobigny", 
  "L'Oréal", "Société Générale", "Amazon France", "Vinci", "Capgemini"
];

const noms = ["DUPONT", "MARTIN", "MOREL", "BERNARD", "PETIT", "ROBERT", "RICHARD", "DURAND", "DUBOIS", "LEFEBVRE"];
const prenoms = ["Jean", "Sophie", "Marc", "Lucie", "Pierre", "Marie", "Thomas", "Julie", "Nicolas", "Camille"];

export const contactsData = Array.from({ length: 50 }, (_, i) => {
  const nom = noms[i % noms.length];
  const prenom = prenoms[Math.floor(Math.random() * prenoms.length)];
  const entreprise = entreprises[i % entreprises.length];
  
  return {
    id: i + 1,
    nom: nom,
    prenom: prenom,
    fonction: fonctions[i % fonctions.length],
    entreprise: entreprise,
    email: `${prenom.toLowerCase()}.${nom.toLowerCase()}@${entreprise.toLowerCase().replace(/\s/g, "")}.fr`,
    telephone: `0${Math.floor(100000000 + Math.random() * 900000000)}`,
    notes: `Contact identifié pour les stages de ${i % 2 === 0 ? "2ème année" : "Licence Pro"}.`
  };
});