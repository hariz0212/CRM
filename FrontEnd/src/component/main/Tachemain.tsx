import { useState } from "react";
import { NavLink } from "react-router-dom";
import { updateTacheLibelle } from "./MainService";
import { ClipLoader } from "react-spinners";

export function Tachemain({ task, category }: { task: any, category: string }) {
  // ✅ Chaque carte a maintenant son propre état interne
  const [editedTask, setEditedTask] = useState(task.libelle_tache);
  const [loading,setLoading]=useState(false);

  const handleUpdate = async () => {
    try {
        setLoading(true)
        await updateTacheLibelle(editedTask,task.id_tache);
        alert(`Mise à jour de la tâche ${task.id_tache} : ${editedTask}`);
    } catch (err) {
        alert('erreur lors de la modification ')
        console.log(err);
    }finally{
        setLoading(false);
    }
  };

  return (
    <div className={`bg-white p-4 rounded-xl shadow-md border-l-4 transition-all hover:shadow-lg ${
      category === "Urgent" ? "border-l-red-500" : category === "À contacter" ? "border-l-blue-500" : "border-l-amber-500"
    }`}>
      <div className="flex justify-between items-start mb-2">
        <div className="min-w-0">
          <p className="text-[10px] font-black text-blue-900 uppercase truncate">
            {task.id_contact ? `👤 ${task.contact_prenom} ${task.contact_nom}` : `🏢 ${task.entreprise_nom}`}
          </p>
          <p className="text-[9px] text-gray-400 font-bold uppercase">
            {new Date(task.date_heure_rappel).toLocaleString('fr-FR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>
        <NavLink 
          to={task.id_contact ? `/contacts/${task.id_contact}` : `/entreprises/${task.id_entreprise}`}
          className="shrink-0 bg-gray-100 hover:bg-gray-200 p-1.5 rounded-lg transition-colors"
        >
          🔗
        </NavLink>
      </div>

      <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 mb-3">
        <textarea
          className="w-full text-xs text-gray-700 italic leading-relaxed bg-transparent outline-none resize-none"
          value={editedTask}
          onChange={(e) => setEditedTask(e.target.value)}
        />
      </div>

      <div className="flex gap-2">
        { loading ? <ClipLoader/>:
        <button 
          onClick={handleUpdate}
          className="flex-1 bg-white border border-gray-200 hover:border-blue-500 hover:text-blue-600 text-[9px] font-black uppercase py-2 rounded-lg transition-all"
        >
          Modifier
        </button>}
      </div>
    </div>
  );
}