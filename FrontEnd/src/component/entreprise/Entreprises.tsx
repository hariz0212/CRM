import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import AjtEntreprise from './AjtEntreprise';
import { getAllEntreprise, Entreprise } from './entrepriseService';
import { ClipLoader } from 'react-spinners';
import { getUserid } from '../login/loginService';

const TYPE_OPTIONS = [
  { value: '', label: 'Tous', color: 'bg-gray-100 text-gray-700 border-gray-300' },
  { value: 'GE', label: 'Grande Entreprise', color: 'bg-blue-100 text-blue-800 border-blue-300' },
  { value: 'ASS', label: 'Association', color: 'bg-green-100 text-green-800 border-green-300' },
  { value: 'Coll', label: 'Collectivité', color: 'bg-purple-100 text-purple-800 border-purple-300' },
  { value: '__none__', label: 'Non défini', color: 'bg-gray-50 text-gray-400 border-gray-200' },
];

function typeBadge(type: string | null | undefined) {
  if (!type) {
    return <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-gray-100 text-gray-400">—</span>;
  }
  const opt = TYPE_OPTIONS.find((o) => o.value === type);
  const cls = opt ? opt.color : 'bg-gray-100 text-gray-600 border-gray-200';
  return (
    <span className={'px-2 py-0.5 text-[10px] font-bold rounded-full border ' + cls}>
      {opt ? opt.label : type}
    </span>
  );
}

function Entreprises() {
  const id_user = getUserid();
  const [searchTerm, setSearchTerm] = useState('');
  const [entreprisesData, setEntreprisesData] = useState<Entreprise[]>([]);
  const [afficheForm, setAfficheForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredEntreprises = entreprisesData.filter((e) => {
    const matchSearch =
      e.nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.SIRET?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.secteur?.toLowerCase().includes(searchTerm.toLowerCase());

    let matchType = true;
    if (filterType === '__none__') {
      matchType = !e.type_entreprise || e.type_entreprise.trim() === '';
    } else if (filterType !== '') {
      matchType = e.type_entreprise === filterType;
    }

    return matchSearch && matchType;
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const data = await getAllEntreprise(id_user);
      setEntreprisesData(data);
    } catch (err) {
      console.error('Erreur front:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentEntreprises = filteredEntreprises.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredEntreprises.length / itemsPerPage);
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const countByType = (value: string) => {
    if (value === '') return entreprisesData.length;
    if (value === '__none__') {
      return entreprisesData.filter((e) => !e.type_entreprise || e.type_entreprise.trim() === '').length;
    }
    return entreprisesData.filter((e) => e.type_entreprise === value).length;
  };

  if (loading) return <ClipLoader />;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
          Gestion des Entreprises
          <span className="bg-blue-100 text-blue-900 text-sm font-black px-3 py-1 rounded-full shadow-inner">
            {filteredEntreprises.length}
          </span>
        </h1>
        <button
          onClick={() => setAfficheForm(true)}
          className="bg-blue-900 hover:bg-blue-800 text-white px-4 py-2 rounded-md font-medium transition shadow-sm"
        >
          + Ajouter une entreprise
        </button>
      </div>

      {/* Barre de recherche */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-4">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md bg-gray-50"
          placeholder="Rechercher une entreprise..."
        />
      </div>

      {/* Filtres par type */}
      <div className="flex flex-wrap gap-2 mb-4">
        {TYPE_OPTIONS.map((opt) => {
          const count = countByType(opt.value);
          const isActive = filterType === opt.value;
          const activeClass = isActive ? opt.color + ' ring-2 ring-offset-1 ring-current scale-105' : 'bg-white text-gray-500 border-gray-200 hover:border-gray-400';
          const countClass = isActive ? 'bg-white/60' : 'bg-gray-100';
          return (
            <button
              key={opt.value}
              onClick={() => { setFilterType(opt.value); setCurrentPage(1); }}
              className={'flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold border transition-all shadow-sm ' + activeClass}
            >
              {opt.label}
              <span className={'text-[10px] font-black px-1.5 py-0.5 rounded-full ' + countClass}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nom</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Secteur</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentEntreprises.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-10 text-center text-sm text-gray-400">
                  Aucune entreprise trouvée pour ce filtre.
                </td>
              </tr>
            ) : (
              currentEntreprises.map((entreprise) => (
                <tr key={entreprise.id_entreprise} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4 text-sm font-semibold text-blue-900">{entreprise.nom}</td>
                  <td className="px-6 py-4">{typeBadge(entreprise.type_entreprise)}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{entreprise.secteur}</td>
                  <td className="px-6 py-4">
                    <span className={
                      'px-2 inline-flex text-xs leading-5 font-semibold rounded-full ' +
                      (entreprise.statut_contact === 'Urgent' ? 'bg-red-100 text-red-800' :
                      entreprise.statut_contact === 'En cours' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800')
                    }>
                      {entreprise.statut_contact}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right text-sm font-medium">
                    <NavLink to={'/entreprises/' + entreprise.id_entreprise} className="text-blue-600 hover:text-blue-900">
                      Voir détails
                    </NavLink>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200">
          <p className="text-sm text-gray-700">
            Page <span className="font-medium">{currentPage}</span> sur <span className="font-medium">{totalPages || 1}</span>
          </p>
          <div className="flex space-x-2">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => paginate(i + 1)}
                className={'px-3 py-1 border rounded ' + (currentPage === i + 1 ? 'bg-blue-900 text-white' : 'bg-white')}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>
      </div>

      {afficheForm && (
        <AjtEntreprise
          onClose={() => setAfficheForm(false)}
          onSuccess={() => { fetchData(); setAfficheForm(false); }}
        />
      )}
    </div>
  );
}

export default Entreprises;
