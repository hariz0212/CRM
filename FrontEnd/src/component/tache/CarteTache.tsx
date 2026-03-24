import { ITache, CONFIG_PRIORITE } from "./TacheService";
import { useState } from "react";

function CarteTache({ tache, auSupprimer }: { tache: ITache, auSupprimer: (id: number) => void }) {
  const [survole, setSurvole] = useState(false);
  const conf = CONFIG_PRIORITE[tache.statut_tache];
  
  // Formatage de la date pour l'affichage
  const dateAffichee = new Date(tache.date_heure_rappel).toLocaleString('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',   // Affiche 09 au lieu de 9
    minute: '2-digit'
  });

  return (
    <div
      onMouseEnter={() => setSurvole(true)}
      onMouseLeave={() => setSurvole(false)}
      className="group relative p-4 bg-white border border-gray-100 rounded-2xl flex items-start justify-between gap-3 shadow-sm hover:shadow-md transition-all duration-200"
    >
      <div className={`absolute left-0 top-3 bottom-3 w-0.5 rounded-full ${conf.point} opacity-60`} />

      <div className="space-y-2 flex-1 min-w-0 pl-3">
        {/* HEADER : Badge statut + Date */}
        <div className="flex items-center gap-2">
          <span className={`inline-flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border ${conf.fond} ${conf.texte} ${conf.bordure}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${conf.point}`} />
            {tache.statut_tache}
          </span>
          <span className="text-[9px] text-gray-400 font-medium ml-auto">
             {dateAffichee.replace(',', ' à')} 
          </span>
        </div>

        {/* CONTENU : Libellé principal */}
        <p className="text-xs text-gray-600 leading-relaxed">
          {tache.libelle_tache}
        </p>

        {/* INFO CONTACT (si existe) */}
        {(tache.contact_nom || tache.contact_prenom) && (
          <p className="text-[10px] text-indigo-500 font-bold mt-1 italic">
              Contact : {tache.contact_prenom} {tache.contact_nom}
          </p>
        )}

        {/* 🌟 NOUVEAU : INFO COMPLÉMENTAIRE (si existe) 🌟 */}
        {tache.info && (
          <div className="mt-2 p-2.5 bg-gray-50/80 border border-gray-100/80 rounded-lg">
            <p className="text-[10px] text-gray-500 italic whitespace-pre-wrap leading-relaxed">
              {tache.info}
            </p>
          </div>
        )}
      </div>

      {/* BOUTON SUPPRIMER */}
      <button
        onClick={() => tache.id_tache && auSupprimer(Number(tache.id_tache))} // Sécurité : on s'assure que c'est bien un number
        className={`shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-[10px] text-red-400 hover:text-white hover:bg-red-500 border border-red-200 transition-all ${survole ? "opacity-100" : "opacity-0"}`}
      >
        ✕
      </button>
    </div>
  );
}

export default CarteTache;