import { useState, useEffect } from "react";

import { StatutTache,ITache } from "./TacheService";
// ─── 1. TYPES ALIGNÉS SUR LA BDD ─────────────────────────────────────────────


const  CONFIG_PRIORITE = {
  "Urgent":      { fond: "bg-red-50",    texte: "text-red-600",    bordure: "border-red-200",    point: "bg-red-500"    },
  "En cours":    { fond: "bg-amber-50",  texte: "text-amber-600",  bordure: "border-amber-200",  point: "bg-amber-400"  },
  "À contacter": { fond: "bg-blue-50",   texte: "text-blue-600",   bordure: "border-blue-200",   point: "bg-blue-500"   },
};

// ─── 2. CARTE INDIVIDUELLE ───────────────────────────────────────────────────
function CarteTache({ tache, auSupprimer }: { tache: ITache, auSupprimer: (id: number) => void }) {
  const [survole, setSurvole] = useState(false);
  const conf = CONFIG_PRIORITE[tache.statut_tache];
  
  // Formatage de la date pour l'affichage
  const dateAffichee = new Date(tache.date_heure_rappel).toLocaleDateString('fr-FR', {
    day: 'numeric', month: 'short', year: 'numeric'
  });

  return (
    <div
      onMouseEnter={() => setSurvole(true)}
      onMouseLeave={() => setSurvole(false)}
      className="group relative p-4 bg-white border border-gray-100 rounded-2xl flex items-start justify-between gap-3 shadow-sm hover:shadow-md transition-all duration-200"
    >
      <div className={`absolute left-0 top-3 bottom-3 w-0.5 rounded-full ${conf.point} opacity-60`} />

      <div className="space-y-2 flex-1 min-w-0 pl-3">
        <div className="flex items-center gap-2">
          <span className={`inline-flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border ${conf.fond} ${conf.texte} ${conf.bordure}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${conf.point}`} />
            {tache.statut_tache}
          </span>
          <span className="text-[9px] text-gray-300 uppercase tracking-wider ml-auto">{dateAffichee}</span>
        </div>
        <p className="text-xs text-gray-600 leading-relaxed">{tache.libelle_tache}</p>
      </div>

      <button
        onClick={() => tache.id_tache && auSupprimer(tache.id_tache)}
        className={`shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-[10px] text-red-400 hover:text-white hover:bg-red-500 border border-red-200 transition-all ${survole ? "opacity-100" : "opacity-0"}`}
      >
        ✕
      </button>
    </div>
  );
}

// ─── 3. SECTION PRINCIPALE ───────────────────────────────────────────────────
interface SectionTachesProps {
  theme?: "indigo" | "slate";
  id_entreprise: number;
  id_contact?: number | null;
  id_user: number;
}

export default function SectionTaches({ theme = "indigo", id_entreprise, id_contact, id_user }: SectionTachesProps) {
  const [onglet, setOnglet] = useState("liste");
  const [taches, setTaches] = useState<ITache[]>([]);
  
  // État du formulaire
  const [nouveauLibelle, setNouveauLibelle] = useState("");
  const [statutSelectionne, setStatutSelectionne] = useState<StatutTache>("À contacter");

  const t = theme === "indigo" ? 
    { accent: "from-indigo-700 to-purple-600", titre: "text-indigo-400", bouton: "bg-indigo-700", anneau: "focus:ring-indigo-300" } :
    { accent: "from-slate-800 to-slate-600", titre: "text-slate-400", bouton: "bg-slate-800", anneau: "focus:ring-slate-300" };

  // Fonction pour enregistrer (Simulation de l'appel API)
  const enregistrerTache = async () => {
    if (!nouveauLibelle) return alert("Veuillez saisir une description");

    const tacheASauver: ITache = {
      date_heure_rappel: new Date().toISOString(), // On prend l'heure actuelle
      libelle_tache: nouveauLibelle,
      statut_tache: statutSelectionne,
      id_user: id_user,
      id_entreprise: id_entreprise,
      id_contact: id_contact || null
    };

    console.log("Envoi à la BDD :", tacheASauver);
    // Ici : await serviceTache.ajouter(tacheASauver);
    
    setNouveauLibelle("");
    setOnglet("liste");
    alert("Tâche enregistrée !");
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