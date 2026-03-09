import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { getAllTache } from './MainService'; // Ton service
import { getUserid } from '../login/loginService';
import { StatutTache } from '../tache/TacheService'; // On réutilise le type

function Main() {
  const id_user = getUserid();
  const [taches, setTaches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  
  const [currentPage, setCurrentPage] = useState({
    "Urgent": 1,
    "À contacter": 1,
    "En cours": 1
  });
  
  const tasksPerPage = 3;

  // --- CHARGEMENT DES DONNÉES RÉELLES ---
  const chargerTaches = async () => {
    try {
      setLoading(true);
      const data = await getAllTache(id_user);
      setTaches(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Erreur dashboard:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id_user) chargerTaches();
  }, [id_user]);

  // --- LOGIQUE DE PAGINATION ---
  const changePage = (category: StatutTache, direction: 'next' | 'prev') => {
    setCurrentPage(prev => ({
      ...prev,
      [category]: direction === 'next' ? prev[category] + 1 : Math.max(prev[category] - 1, 1)
    }));
  };

  if (loading) return <div className="p-20 text-center font-black text-blue-900 animate-pulse">CHARGEMENT DU FLUX...</div>;

  return (
    <div className="min-h-screen bg-gray-200 p-4 md:p-8 font-sans text-gray-800">
      <main className="max-w-7xl mx-auto">
        
        {/* HEADER */}
        <div className="mb-8 flex flex-col md:flex-row justify-between items-center bg-white p-5 rounded-2xl shadow-sm border border-gray-100 gap-4">
          <div>
            <h1 className="text-2xl font-black text-blue-900 uppercase tracking-tighter italic">Tableau de Bord</h1>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Flux opérationnel • Mme Benidir</p>
          </div>
          
          <div className="relative w-full max-w-md">
            <input 
              type="text" 
              placeholder="Rechercher une entreprise, un contact ou une tâche..." 
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage({"Urgent": 1, "À contacter": 1, "En cours": 1});
              }}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
            <span className="absolute left-3 top-2.5 opacity-30">🔍</span>
          </div>
        </div>

        {/* GRILLE TRELLO */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {(["Urgent", "À contacter", "En cours"] as StatutTache[]).map((category) => {
            
            // Filtrage dynamique sur plusieurs champs (nom entreprise, contact ou libellé)
            const filteredTasks = taches.filter(t => 
              t.statut_tache === category && 
              (t.libelle_tache.toLowerCase().includes(searchTerm.toLowerCase()) ||
               (t.entreprise_nom?.toLowerCase().includes(searchTerm.toLowerCase())) ||
               (t.contact_nom?.toLowerCase().includes(searchTerm.toLowerCase())))
            );

            const totalPages = Math.ceil(filteredTasks.length / tasksPerPage) || 1;
            const currentTasks = filteredTasks.slice(
              (currentPage[category] - 1) * tasksPerPage,
              currentPage[category] * tasksPerPage
            );

            return (
              <div key={category} className="flex flex-col bg-slate-100 rounded-2xl p-4 shadow-inner border border-slate-200 h-fit min-h-[600px]">
                
                {/* Header Colonne */}
                <div className="flex justify-between items-center mb-6 px-1">
                  <h3 className={`font-black uppercase text-[10px] tracking-widest ${
                    category === "Urgent" ? "text-red-600" : category === "À contacter" ? "text-blue-600" : "text-amber-600"
                  }`}>
                    {category === "Urgent" ? "🚨 " : category === "À contacter" ? "📞 " : "⏳ "}
                    {category}
                  </h3>
                  <span className="bg-white text-gray-600 px-2 py-0.5 rounded-lg text-[10px] font-black shadow-sm border border-gray-100">
                    {filteredTasks.length}
                  </span>
                </div>

                {/* Liste des Cartes */}
                <div className="space-y-4 flex-grow">
                  {currentTasks.map((task) => (
                    <div key={task.id_tache} className={`bg-white p-4 rounded-xl shadow-md border-l-4 transition-all hover:shadow-lg ${
                      category === "Urgent" ? "border-l-red-500" : category === "À contacter" ? "border-l-blue-500" : "border-l-amber-500"
                    }`}>
                      
                      {/* Source : Entreprise ou Contact */}
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

                      {/* Libellé de la tâche */}
                      <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 mb-3">
                         <textarea
                         className="text-xs text-gray-700 italic leading-relaxed" 
                         value={task.libelle_tache}></textarea>
                      </div>

                      {/* Action Rapide */}
                      <div className="flex gap-2">
                        <button 
                          onClick={() => alert('Fonctionnalité de validation à venir')}
                          className="flex-1 bg-white border border-gray-200 hover:border-green-500 hover:text-green-600 text-[9px] font-black uppercase py-2 rounded-lg transition-all"
                        >
                          Terminer
                        </button>
                      </div>
                    </div>
                  ))}
                  
                  {filteredTasks.length === 0 && (
                    <div className="text-center py-20 opacity-20 italic text-[10px] font-bold uppercase tracking-widest">Aucun flux</div>
                  )}
                </div>

                {/* Pagination */}
                <div className="mt-6 flex items-center justify-between bg-white/50 p-2 rounded-xl border border-white/50">
                  <button onClick={() => changePage(category, 'prev')} disabled={currentPage[category] === 1} className="p-1 hover:bg-white rounded-lg disabled:opacity-10">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 19l-7-7 7-7" /></svg>
                  </button>
                  <span className="text-[9px] font-black text-gray-400">
                    {currentPage[category]} / {totalPages}
                  </span>
                  <button onClick={() => changePage(category, 'next')} disabled={currentPage[category] >= totalPages} className="p-1 hover:bg-white rounded-lg disabled:opacity-10">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7" /></svg>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}

export default Main;