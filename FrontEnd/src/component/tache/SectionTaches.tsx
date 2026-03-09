import { useEffect, useState } from "react";

import { StatutTache,ITache, SectionTachesProps } from "./TacheService";

import CarteTache from "./CarteTache";
import { getTachesEntreprise } from "../entreprise/entrepriseService";
import { getTachesContact } from "../Contacts/ContactService";

import { addTache } from "./TacheService";

// ─── 3. SECTION PRINCIPALE 

export default function SectionTaches({ theme = "indigo", id_entreprise, id_contact, id_user }: SectionTachesProps) {
  const [onglet, setOnglet] = useState("liste");
  const [taches, setTaches] = useState<ITache[]>([]);


const fetchTache = async () => {
    try {
        let resultats;
        if (id_contact) {
            resultats = await getTachesContact(id_contact, id_entreprise, id_user);
        } else {
            resultats = await getTachesEntreprise(id_entreprise, id_user);
        }

        // ✅ LA SÉCURITÉ : On vérifie si c'est un tableau
        if (Array.isArray(resultats)) {
            setTaches(resultats);
            console.log(resultats);
        } else {
            // Si c'est un objet, on met un tableau vide pour ne pas faire crash le .map()
            console.error("L'API n'a pas renvoyé un tableau :", resultats);
            setTaches([]); 
        }

    } catch (err) {
        console.error("Erreur API :", err);
        setTaches([]); // En cas d'erreur réseau, on garde un tableau vide
    }

  };


useEffect(() => {
  fetchTache();
  
  // 2. Le tableau de dépendances : on ne relance que si l'un de ces IDs change
}, [id_contact, id_entreprise, id_user]);
  
  // État du formulaire
  const [nouveauLibelle, setNouveauLibelle] = useState("");
  const [statutSelectionne, setStatutSelectionne] = useState<StatutTache>("À contacter");
  const [dateProgrammee, setDateProgrammee] = useState("");

  const t = theme === "indigo" ? 
    { accent: "from-indigo-700 to-purple-600", titre: "text-indigo-400", bouton: "bg-indigo-700", anneau: "focus:ring-indigo-300" } :
    { accent: "from-slate-800 to-slate-600", titre: "text-slate-400", bouton: "bg-slate-800", anneau: "focus:ring-slate-300" };

  // Fonction pour enregistrer (Simulation de l'appel API)
  const enregistrerTache = async () => {
    if (!nouveauLibelle || !dateProgrammee) {
        return alert("Veuillez saisir une description et une date.");
    }
    const datePourMySQL = dateProgrammee.replace('T', ' ') + ':00';

    const tacheASauver: ITache = {
      date_heure_rappel: datePourMySQL, // On prend l'heure actuelle
      libelle_tache: nouveauLibelle,
      statut_tache: statutSelectionne,
      id_user: id_user,
      id_entreprise: id_entreprise,
      id_contact: id_contact || null
    };

 try {
        // 1. Appel API
        await addTache(tacheASauver);
        
        // 2. Reset du formulaire
        setNouveauLibelle("");
        setDateProgrammee("")
        setOnglet("liste");
        
        // 3. Rafraîchissement de la liste (on rappelle la fonction de chargement)
        // Assure-toi que fetchTache est accessible ici
        fetchTache(); 
        
        alert("Action enregistrée !");
    } catch (err) {
        alert("Impossible d'enregistrer la tâche.");
    }
  };

  return (
    <div className="space-y-4 pt-4">
      {/* Entête avec onglets */}
      <div className="flex items-center justify-between border-b pb-2">
        <h3 className={`text-[10px] font-black ${t.titre} uppercase tracking-widest`}>
          Tâches & Actions
        </h3>
        <div className="flex rounded-lg overflow-hidden border border-gray-200 text-[9px] font-black uppercase tracking-widest">
          <button onClick={() => setOnglet("liste")} className={`px-3 py-1.5 ${onglet === "liste" ? `bg-gradient-to-r ${t.accent} text-white` : "bg-white text-gray-400"}`}>Liste</button>
          <button onClick={() => setOnglet("ajout")} className={`px-3 py-1.5 ${onglet === "ajout" ? `bg-gradient-to-r ${t.accent} text-white` : "bg-white text-gray-400"}`}>+ Ajouter</button>
        </div>
      </div>

      {/* Vue Liste */}
      {onglet === "liste" && (
        <div className="space-y-2">
          {taches.length === 0 ? (
            <p className="text-[10px] text-gray-300 italic text-center py-6">Aucune action enregistrée.</p>
          ) : (
            taches.map((t) => <CarteTache key={t.id_tache} tache={t} auSupprimer={(id) => console.log("Supprimer", id)} />)
          )}
        </div>
      )}

      {/* Vue Ajout */}
      {onglet === "ajout" && (
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm space-y-4">
          <div>
            <label className="block text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-2">Priorité</label>
            <div className="flex gap-2">
              {(['À contacter', 'En cours', 'Urgent'] as StatutTache[]).map((s) => (
                <button
                  key={s}
                  onClick={() => setStatutSelectionne(s)}
                  className={`text-[9px] font-black uppercase px-3 py-1.5 rounded-full border transition-all ${statutSelectionne === s ? "bg-gray-100 border-gray-400 shadow-inner" : "bg-white text-gray-400"}`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-2">
              Date et Heure du rappel
            </label>
            <input 
              type="datetime-local"
              value={dateProgrammee}
              onChange={(e) => setDateProgrammee(e.target.value)}
              className={`w-full p-3 bg-gray-50 border border-gray-100 rounded-xl text-xs outline-none focus:ring-2 ${t.anneau} text-gray-600`}
            />
          </div>
          <div>
            <label className="block text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-2">Libellé de la tâche</label>
            <textarea
              value={nouveauLibelle}
              onChange={(e) => setNouveauLibelle(e.target.value)}
              className={`w-full p-3 bg-gray-50 border border-gray-100 rounded-xl text-xs outline-none focus:ring-2 ${t.anneau} italic text-gray-600 resize-none`}
              placeholder="Ex: Envoyer le contrat par email..."
            />
          </div>

          <div className="flex items-center justify-between">
            <button onClick={() => setOnglet("liste")} className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">← Annuler</button>
            <button onClick={enregistrerTache} className={`${t.bouton} text-white text-[10px] font-black py-2.5 px-8 rounded-xl uppercase tracking-widest shadow-md active:scale-95`}>
              Enregistrer
            </button>
          </div>
        </div>
      )}
    </div>
  );
}