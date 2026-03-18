import { useState } from "react";
import { NavLink } from "react-router-dom";
import { updateTacheLibelle } from "./MainService";
import { ClipLoader } from "react-spinners";

export function Tachemain({ task, category }: { task: any, category: string }) {
  const [editedTask, setEditedTask] = useState(task.libelle_tache);
  const [loading, setLoading] = useState(false);

  const handleUpdate = async () => {
    try {
        setLoading(true);
        await updateTacheLibelle(editedTask, task.id_tache);
        alert(`Mise à jour de la tâche réussie !`);
    } catch (err) {
        alert('Erreur lors de la modification');
        console.log(err);
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className={`bg-white p-4 rounded-xl shadow-md border-l-4 transition-all hover:shadow-lg flex flex-col ${
      category === "Urgent" ? "border-l-red-500" : category === "À contacter" ? "border-l-blue-500" : "border-l-amber-500"
    }`}>
      
      {/* HEADER DE LA CARTE */}
      <div className="flex justify-between items-start mb-2">
        <div className="min-w-0">
          <p className="text-[10px] font-black text-blue-900 uppercase truncate">
            {/* 🌟 NOUVELLE LOGIQUE À 3 CHOIX 🌟 */}
            {task.id_contact 
              ? `👤 ${task.contact_prenom} ${task.contact_nom}` 
              : task.id_entreprise 
                ? `🏢 ${task.entreprise_nom}` 
                : `MÉMO PERSONNEL`}
          </p>
          <p className="text-[9px] text-gray-400 font-bold uppercase mt-0.5">
            {new Date(task.date_heure_rappel).toLocaleString('fr-FR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>

        {/* 🌟 ON CACHE LE LIEN SI C'EST UN MÉMO PERSO 🌟 */}
        {(task.id_contact || task.id_entreprise) && (
          <NavLink 
            to={task.id_contact ? `/contacts/${task.id_contact}` : `/entreprises/${task.id_entreprise}`}
            title="Aller vers la fiche"
            className="shrink-0 bg-gray-100 hover:bg-gray-200 p-1.5 rounded-lg transition-colors text-xs ml-2"
          >
            🔗
          </NavLink>
        )}
      </div>

      {/* ZONE DE TEXTE */}
      <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 mb-3 flex-grow">
        <textarea
          className="w-full h-full text-xs text-gray-700 italic leading-relaxed bg-transparent outline-none resize-none min-h-[60px]"
          value={editedTask}
          onChange={(e) => setEditedTask(e.target.value)}
        />
      </div>

      {/* BOUTON MODIFIER */}
      <div className="flex gap-2">
        {loading ? (
          <div className="flex-1 flex justify-center py-2">
            <ClipLoader size={20} color="#3b82f6" />
          </div>
        ) : (
          <button 
            onClick={handleUpdate}
            className="flex-1 bg-white border border-gray-200 hover:border-blue-500 hover:text-blue-600 text-[9px] font-black uppercase py-2 rounded-lg transition-all"
          >
            Modifier
          </button>
        )}
      </div>
    </div>
  );
}