import { NavLink } from 'react-router-dom';
import { getAdmin, LoginContext } from '../login/LoginContext';
import { useContext } from 'react';

function nav(){
  const {logout}=useContext(LoginContext);
  const isadmin=getAdmin();
  console.log(isadmin);
  return (
    /* Conteneur principal de la barre de navigation : définit la couleur de fond (bleu IUT), la couleur du texte et l'ombre portée */
    <nav className="bg-blue-900 text-white shadow-lg">
     {/* Limiteur de largeur : centre le contenu de la nav et ajoute un padding horizontal pour ne pas coller aux bords */}
      <div className="max-w-7xl mx-auto px-4">
        {/* Conteneur flex : aligne le logo et les liens horizontalement et définit une hauteur fixe de 16 (64px) */}
        <div className="flex justify-between items-center h-16">
          
          {/* Gauche : Nom de l'IUT */}
          {/* Bloc logo/nom : regroupe le titre de l'application à gauche et l'empêche de rétrécir (flex-shrink-0) */}
          <div className="flex-shrink-0 flex items-center">
            <span className="text-xl font-bold tracking-tight">
              IUT de Bobigny
            </span>
          </div>

          {/* Droite : Boutons de navigation */}
          {/* Menu principal : caché sur mobile (hidden) et affiché en flex sur les écrans moyens (md) et larges pour regrouper les liens */}
          <div className="hidden md:flex items-center space-x-4">
                {/* Lien Accueil (Logo) */}
                <NavLink 
                    to="/main" 
                    className="hover:bg-blue-800 px-3 py-2 rounded-md text-sm font-medium transition"
                >
                    Accueil
                </NavLink>

                <NavLink 
                    to="/entreprises" 
                    className="hover:bg-blue-800 px-3 py-2 rounded-md text-sm font-medium transition"
                >
                    Entreprises
                </NavLink>

                <NavLink 
                    to="/contacts" 
                    className="hover:bg-blue-800 px-3 py-2 rounded-md text-sm font-medium transition"
                >
                    Contacts
                </NavLink>

                { isadmin && (
                  <NavLink 
                    to="/admin" 
                    className="hover:bg-blue-800 px-3 py-2 rounded-md text-sm font-medium transition">
                    Admin
                </NavLink>
                )}

                {/* Bouton Déconnecter (Lien vers login ou fonction de déconnexion) */}
                <NavLink 
                    to="/" 
                    className="ml-4 bg-red-600 hover:bg-red-700 px-4 py-2 rounded-md text-sm font-bold transition shadow-sm text-white"
                    onClick={logout}
                >
                  
                    Déconnecter
                </NavLink>
            </div>

          {/* Menu Mobile (Optionnel - icône simple) */}
          {/* Conteneur mobile : visible uniquement sur petits écrans (md:hidden) pour afficher l'icône "hamburger" */}
          <div className="md:hidden flex items-center">
             <button className="p-2 rounded-md hover:bg-blue-800">
               <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
               </svg>
             </button>
          </div>

        </div>
      </div>
    </nav>
  );
};

export default nav;