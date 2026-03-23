import { useState, useEffect } from 'react';

import { getAllTache } from './MainService'; // Ton service
import { getUserid } from '../login/loginService';
import { StatutTache } from '../tache/TacheService'; // On réutilise le type
import { Tachemain } from './Tachemain';
import SectionTaches from '../tache/SectionTaches';
function Main() {
  const [isTachePersoModalOpen,setIsTachePersoModalOpen]=useState(false);
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
       {/* HEADER DYNAMIQUE ET RESPONSIVE */}
        <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100 gap-6 relative overflow-hidden">
          
          {/* Petit effet visuel optionnel en fond (bulle bleue floue) */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full blur-3xl -z-10 opacity-60 translate-x-1/2 -translate-y-1/2"></div>

          {/* 1. TITRES */}
          <div>
            <h1 className="text-2xl font-black text-blue-900 uppercase tracking-tighter italic flex items-center gap-2">
              Tableau de Bord
            </h1>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">
              Espace Trello & Tâches
            </p>
          </div>
          
          {/* 2. CONTRÔLES (Recherche + Bouton) */}
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
            
            {/* Barre de recherche */}
            <div className="relative w-full sm:w-80 group">
              <input 
                type="text" 
                placeholder="Rechercher (ex: mémo, nom...)" 
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage({"Urgent": 1, "À contacter": 1, "En cours": 1});
                }}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 hover:bg-gray-100 focus:bg-white border border-gray-200 focus:border-blue-300 rounded-xl text-sm outline-none focus:ring-4 focus:ring-blue-500/10 transition-all text-gray-700 placeholder:text-gray-400"
              />
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors">
                {/* Une vraie icône SVG plus propre que l'émoji 🔍 */}
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                </svg>
              </span>
            </div>

            {/* Bouton Ajout Tâche Perso */}
            <button 
              onClick={() => setIsTachePersoModalOpen(true)}
              className="w-full sm:w-auto shrink-0 bg-blue-900 hover:bg-blue-800 text-white px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-blue-900/20 active:scale-95 flex items-center justify-center gap-2 group border border-blue-800"
            >
              <span className="bg-white/20 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs group-hover:bg-white/30 transition-colors">
                +
              </span>
              Tâche Perso
            </button>
            
          </div>
        </div>

        {/* GRILLE TRELLO */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {(["Urgent", "À contacter", "En cours"] as StatutTache[]).map((category) => {
            
            // Filtrage dynamique sur plusieurs champs (nom entreprise, contact ou libellé)
            // On met le mot de recherche en minuscules une seule fois
            const term = searchTerm.toLowerCase();

            const filteredTasks = taches.filter(t => {
              // 1. Est-ce que c'est un mémo perso ? (Ni entreprise, ni contact)
              const isMemoPerso = !t.id_entreprise && !t.id_contact;

              // 2. On vérifie toutes les correspondances possibles
              const matchLibelle = t.libelle_tache?.toLowerCase().includes(term);
              const matchEntreprise = t.entreprise_nom?.toLowerCase().includes(term);
              const matchContact = t.contact_nom?.toLowerCase().includes(term);
              // 🌟 LA MAGIE EST LÀ : Si c'est un mémo, on vérifie si l'utilisateur a tapé "mémo" ou "personnel"
              const matchMemoTexte = isMemoPerso && "mémo personnel memo".includes(term);

              // 3. On garde la tâche si elle a le bon statut ET qu'elle correspond à un des critères
              return t.statut_tache === category && (matchLibelle || matchEntreprise || matchContact || matchMemoTexte);
            });

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
                      // ✅ On appelle le sous-composant ici
                      <Tachemain key={task.id_tache} task={task} category={category} />
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
        {/* 🌟 LA MODALE TÂCHE PERSO 🌟 */}
        {isTachePersoModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 relative animate-in fade-in zoom-in duration-200">
              
              {/* Bouton pour fermer */}
              <button 
                onClick={() => {
                  setIsTachePersoModalOpen(false);
                  chargerTaches(); // On rafraîchit le tableau de bord quand on ferme !
                }}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-800 text-xl font-bold"
              >
                &times;
              </button>

              <h2 className="text-lg font-black text-slate-800 uppercase tracking-widest border-b pb-3 mb-4">
                📝 Nouvelle Tâche Personnelle
              </h2>

              {/* 🌟 ON UTILISE TON COMPOSANT DIRECTEMENT ! 🌟 */}
              {/* Note: on ne lui passe ni id_entreprise ni id_contact, donc ton code comprendra que c'est une tâche globale (perso) */}
              <SectionTaches 
                theme="slate" 
                id_user={id_user} 
              />
              
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default Main;