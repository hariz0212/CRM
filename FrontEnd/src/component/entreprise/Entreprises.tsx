import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import AjtEntreprise from './AjtEntreprise';
// Import du service réel
import { getAllEntreprise,Entreprise } from './entrepriseService'; 
import { ClipLoader } from 'react-spinners';
import { getUserid } from '../login/loginService';

function Entreprises() {
  const id_user=getUserid();//tant que je n'ai pas fais les sessions
  const [searchTerm, setSearchTerm] = useState('');
  const [entreprisesData, setEntreprisesData] = useState<Entreprise[]>([]);
  const [afficheForm, setAfficheForm] = useState(false);
  const [loading, setLoading] = useState(true); // État de chargement

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const filteredEntreprises = entreprisesData.filter((e) =>
    e.nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.SIRET?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.secteur?.toLowerCase().includes(searchTerm.toLowerCase())
  );
const fetchData = async () => {
      try {
        setLoading(true);
        console.log('id_user:',id_user);
        const data = await getAllEntreprise(id_user);
        console.log('data',data); // Appel API
        setEntreprisesData(data);
      } catch (err) {
        console.error("Erreur front:", err);
      } finally {
        setLoading(false);
      }
    };
  // --- RÉCUPÉRATION DES DONNÉES RÉELLES ---
  useEffect(() => {
    fetchData();
  }, []); // [] est crucial : l'appel ne se fait qu'une fois au montage

  // Logique de pagination (basée sur les données de l'API)
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentEntreprises = filteredEntreprises.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredEntreprises.length / itemsPerPage);

  const paginate = (pageNumber:number) => setCurrentPage(pageNumber);

  if (loading) return <ClipLoader/>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Gestion des Entreprises</h1>
        <button onClick={() => setAfficheForm(true)} className="bg-blue-900 hover:bg-blue-800 text-white px-4 py-2 rounded-md font-medium transition shadow-sm">
          + Ajouter une entreprise
        </button>
      </div>

      {/* Barre de recherche (à implémenter plus tard si tu veux) */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => {setSearchTerm(e.target.value);setCurrentPage(1)}}
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md bg-gray-50"
          placeholder="Rechercher une entreprise..."
        />
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">SIRET</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nom</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Secteur</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentEntreprises.map((entreprise) => (
              <tr key={entreprise.id_entreprise} className="hover:bg-gray-50 transition">
                {/* Attention : on utilise les noms de colonnes SQL (siret, nom, etc.) */}
                <td className="px-6 py-4 text-sm text-gray-600 font-mono">{entreprise.SIRET || 'N/A'}</td>
                <td className="px-6 py-4 text-sm font-semibold text-blue-900">{entreprise.nom}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{entreprise.secteur}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    entreprise.statut_contact === 'Urgent' ? 'bg-red-100 text-red-800' : 
                    entreprise.statut_contact === 'En cours' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {entreprise.statut_contact}
                  </span>
                </td>
                <td className="px-6 py-4 text-right text-sm font-medium">
                  <NavLink to={`/entreprises/${entreprise.id_entreprise}`} className="text-blue-600 hover:text-blue-900">
                    Voir détails
                  </NavLink>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* --- PAGINATION --- */}
        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200">
           {/* Ton code de pagination actuel fonctionne très bien ici */}
           <p className="text-sm text-gray-700">
             Page <span className="font-medium">{currentPage}</span> sur <span className="font-medium">{totalPages}</span>
           </p>
           <div className="flex space-x-2">
             {Array.from({ length: totalPages }, (_, i) => (
               <button 
                 key={i} 
                 onClick={() => paginate(i + 1)}
                 className={`px-3 py-1 border rounded ${currentPage === i+1 ? 'bg-blue-900 text-white' : 'bg-white'}`}
               >
                 {i + 1}
               </button>
             ))}
           </div>
        </div>
      </div>

      {afficheForm && <AjtEntreprise 
      onClose={() => setAfficheForm(false)}
      onSuccess={()=>{fetchData();setAfficheForm(false);}}
      />}
    </div>
  );
}

export default Entreprises;