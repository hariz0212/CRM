import { useEffect, useState, useCallback } from "react"; // Ajout de useCallback pour la propreté
import { NavLink } from "react-router-dom";
import AjtContact from "./AjtContacts";
import { Contact, getAllContact } from "./ContactService";
import { ClipLoader } from "react-spinners";
import { Entreprise, getAllEntreprise } from "../entreprise/entrepriseService";
import Excel from "../Excel/Excel";
import { getUserid } from "../login/loginService";

function Contacts() {
  const [entreprise,setEntreprise]=useState<Entreprise[]>([])
  const [contactsDatas, setContactsDatas] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [afficheForm, setAfficheForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const id_user=getUserid();

  // --- RÉCUPÉRATION DES DONNÉES ---
  // On utilise une fonction stable pour pouvoir la réutiliser
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [data, Edata] = await Promise.all([
        getAllContact(id_user),
        getAllEntreprise(id_user)
      ]);
      console.log("Edata reçu :", Edata)
      console.log("data",data);
      setContactsDatas(data);
      setEntreprise(Edata);
    } catch (err) {
      console.error("Erreur lors du chargement des contacts:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // CORRECTION : On ajoute [] pour que ça ne s'exécute qu'UNE fois au montage
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  /* 1. FILTRAGE */
const filteredContacts = contactsDatas.filter(contact => {
  const nomEntreprise = entreprise.find(e => e.id_entreprise === Number(contact.id_entreprise))?.nom ?? '';
  
  return (
    contact.nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.prenom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.fonction?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    nomEntreprise.toLowerCase().includes(searchTerm.toLowerCase())
  );
});

  /* 2. PAGINATION */
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentContacts = filteredContacts.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredContacts.length / itemsPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <ClipLoader color="#1e3a8a" size={50} />
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* En-tête */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Annuaire des Contacts</h1>
        <div className="flex items-center gap-3">
        <Excel/>
        <button onClick={() => setAfficheForm(true)} className="bg-blue-900 hover:bg-blue-800 text-white px-4 py-2 rounded-md font-medium transition shadow-sm">
          + Ajouter un contact
        </button>
        </div>
      </div>

      {/* Barre de recherche */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
        <div className="relative">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </span>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none sm:text-sm"
            placeholder="Rechercher par nom, prénom ou fonction..."
          />
        </div>
      </div>

      {/* Tableau des contacts */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Nom & Prénom</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">LinkedIn</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Statut</th>
              <th className="px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentContacts.map((contact) => (
              <tr key={contact.id_contact} className="hover:bg-gray-50 transition">
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <div className="font-semibold text-gray-900">{contact.nom} {contact.prenom}</div>
                  <div className="text-[10px] text-blue-800 font-bold uppercase">{contact.fonction}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 italic">
                  <a href={contact.linkedin} target="_blank" rel="noreferrer">Lien Profil</a>
                </td>
                <td className="px-6 py-4">
                   <span className={`px-2 py-1 text-[10px] font-bold rounded-full ${
                     contact.statut_contact === 'Urgent' ? 'bg-red-100 text-red-600' : 
                     contact.statut_contact === 'En cours' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
                   }`}>
                     {contact.statut_contact}
                   </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  {/* LIEN DYNAMIQUE : On passe l'ID réel */}
                  <NavLink to={`/contacts/${contact.id_contact}`} className="text-blue-600 hover:text-blue-900 font-bold">
                    Détails
                  </NavLink>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* --- PAGINATION (Style épuré) --- */}
        <div className="bg-gray-50 px-6 py-4 flex items-center justify-between border-t border-gray-200">
          <p className="text-xs text-gray-600 italic">
            {filteredContacts.length} contacts trouvés
          </p>
          <div className="flex gap-1">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                onClick={() => paginate(i + 1)}
                className={`w-8 h-8 text-xs font-bold rounded-md transition ${
                  currentPage === i + 1 ? "bg-blue-900 text-white" : "bg-white border border-gray-300 text-gray-500 hover:bg-gray-50"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>
      </div>

      
      {/* MODALE AVEC REFRESCH AUTOMATIQUE */}
      {afficheForm && (
        <AjtContact 
          onClose={() => setAfficheForm(false)} 
          onSuccess={() => { fetchData(); setAfficheForm(false); }}
          entreprise={entreprise} 
        />
      )}
    </div>
  );
};

export default Contacts;