import { useState } from 'react';
import { NavLink } from 'react-router-dom';

{/* --- TYPES TYPESCRIPT --- */}
type Category = "Urgent" | "À contacter" | "En cours";

{/* --- GÉNÉRATION DE 60 TÂCHES RÉALISTES --- */}
const tasksData = Array.from({ length: 60 }, (_, i) => {
  const types: Category[] = ["Urgent", "À contacter", "En cours"];
  const type = types[i % 3];
  const isCompany = i % 2 === 0;
  return {
    id: i + 1,
    name: isCompany ? `Entreprise : TechCorp ${i + 1}` : `Contact : M. Dupont ${i + 1}`,
    type: type,
    icon: isCompany ? "🏢" : "👤",
    noteInitiale: "Besoin de relance pour la convention..."
  };
});

function Main() {
  {/* --- ÉTATS --- */}
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState({
    "Urgent": 1,
    "À contacter": 1,
    "En cours": 1
  });
  
  const tasksPerPage = 3; // On en affiche 3 par colonne pour que tout rentre sans trop scroller

  {/* --- LOGIQUE DE PAGINATION --- */}
  const changePage = (category: Category, direction: 'next' | 'prev') => {
    setCurrentPage(prev => ({
      ...prev,
      [category]: direction === 'next' ? prev[category] + 1 : Math.max(prev[category] - 1, 1)
    }));
  };

  return (
    <div className="min-h-screen bg-gray-200 p-4 md:p-8 font-sans text-gray-800">
      <main className="max-w-7xl mx-auto">
        
        {/* HEADER : Titre et Recherche */}
        <div className="mb-8 flex flex-col md:flex-row justify-between items-center bg-white p-5 rounded-2xl shadow-sm border border-gray-100 gap-4">
          <div>
            <h1 className="text-2xl font-black text-blue-900 uppercase tracking-tighter">Tableau de Bord</h1>
            <p className="text-xs text-gray-500 font-medium">Gestion des flux et tâches prioritaires</p>
          </div>
          
          <div className="relative w-full max-w-md">
            <input 
              type="text" 
              placeholder="Rechercher une tâche par nom..." 
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

        {/* GRILLE TRELLO (3 COLONNES) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {(["Urgent", "À contacter", "En cours"] as Category[]).map((category) => {
            
            {/* Filtrage */}
            const filteredTasks = tasksData.filter(t => 
              t.type === category && t.name.toLowerCase().includes(searchTerm.toLowerCase())
            );

            {/* Pagination */}
            const totalPages = Math.ceil(filteredTasks.length / tasksPerPage) || 1;
            const currentTasks = filteredTasks.slice(
              (currentPage[category] - 1) * tasksPerPage,
              currentPage[category] * tasksPerPage
            );

            return (
              <div key={category} className="flex flex-col bg-slate-100 rounded-2xl p-4 shadow-inner border border-slate-200 h-fit min-h-[600px]">
                
                {/* Header de la Colonne */}
                <div className="flex justify-between items-center mb-6 px-1">
                  <h3 className={`font-black uppercase text-xs tracking-widest ${
                    category === "Urgent" ? "text-red-600" : category === "À contacter" ? "text-blue-600" : "text-yellow-600"
                  }`}>{category}</h3>
                  <span className="bg-white text-gray-600 px-2 py-0.5 rounded-lg text-[10px] font-bold shadow-sm border border-gray-100">
                    {filteredTasks.length}
                  </span>
                </div>

                {/* Liste des Cartes (Affichage Direct) */}
                <div className="space-y-4 flex-grow">
                  {currentTasks.map((task) => (
                    <div key={task.id} className={`bg-white p-4 rounded-xl shadow-md border-t-4 transition-transform hover:scale-[1.02] ${
                      category === "Urgent" ? "border-t-red-500" : category === "À contacter" ? "border-t-blue-500" : "border-t-yellow-500"
                    }`}>
                      {/* Titre et Icône */}
                      <div className="flex justify-between items-start mb-3">
                        <p className="text-xs font-bold text-gray-800 leading-tight">{task.icon} {task.name}</p>
                        <NavLink to="/entreprises/EntrepriseDetails" className="text-[9px] font-black text-blue-500 hover:text-blue-700 uppercase">Voir</NavLink>
                      </div>

                      {/* Zone de texte affichée directement */}
                      <textarea 
                        className="w-full h-24 p-2 bg-gray-50 border border-gray-100 rounded-lg text-[11px] outline-none focus:ring-1 focus:ring-blue-300 resize-none mb-3 italic text-gray-600"
                        defaultValue={task.noteInitiale}
                        placeholder="Écrire une note ici..."
                      ></textarea>

                      {/* Bouton d'enregistrement affiché directement */}
                      <button className={`w-full py-2 rounded-lg text-white text-[10px] font-black uppercase tracking-wider transition-colors ${
                        category === "Urgent" ? "bg-red-600 hover:bg-red-700" : 
                        category === "À contacter" ? "bg-blue-600 hover:bg-blue-700" : 
                        "bg-yellow-600 hover:bg-yellow-700"
                      }`}>
                        Enregistrer la note
                      </button>
                    </div>
                  ))}
                  
                  {filteredTasks.length === 0 && (
                    <div className="text-center py-10 opacity-20 italic text-xs">Aucun résultat</div>
                  )}
                </div>

                {/* Pagination de la colonne */}
                <div className="mt-6 flex items-center justify-between bg-white/50 p-2 rounded-xl border border-white/50">
                  <button 
                    onClick={() => changePage(category, 'prev')}
                    disabled={currentPage[category] === 1}
                    className="p-1 hover:bg-white rounded-lg disabled:opacity-10 transition-all"
                  >
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 19l-7-7 7-7" /></svg>
                  </button>
                  <span className="text-[10px] font-black text-gray-500 tracking-tighter">
                    {currentPage[category]} / {totalPages}
                  </span>
                  <button 
                    onClick={() => changePage(category, 'next')}
                    disabled={currentPage[category] >= totalPages}
                    className="p-1 hover:bg-white rounded-lg disabled:opacity-10 transition-all"
                  >
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7" /></svg>
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