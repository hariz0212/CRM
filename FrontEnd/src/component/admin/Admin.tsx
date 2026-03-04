import React, { useState, useEffect, useCallback, ChangeEvent } from "react";
import { User } from "../User/User";
import { addUser, deleteUserByID, getAllUser } from "./AdminService";

function Admin(){
  const [userList, setUserList] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  
  // État pour le nouvel utilisateur
  const [newUser, setNewUser] = useState({
    nom: '',
    prenom: '',
    email: '',
    identifiant: '',
    mdp: '',
    role: 'user' as 'user' | 'admin'
  });


  // Gestion des changements dans le formulaire
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewUser(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getAllUser();
      setUserList(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Ici tu appelleras ton service de création (ex: createUser(newUser))
    try {
      addUser(newUser);
      alert('insertion réussi');
      fetchUsers();
    } catch (err) {
      console.log('erreur lors de l ajout',err);
      alert('nope');
    }
  };

  const handleDelete=async (id:string|number) => {
    if(!window.confirm('voulez vous supprimer l user et ses donnée?')){
      return;
    }
    try {
      await deleteUserByID(id)
      console.log('suppression');
      alert('suppression réussi')
      await fetchUsers();
    } catch (err) {
      console.log('erreur lors de la suppression ')
      alert('erreur lors de la suppression');
    }
    
  }

  return (
    <div className="p-6 bg-gray-200 min-h-screen">
      <div className="flex flex-col lg:flex-row gap-6">

        {/* LISTE DES UTILISATEURS */}
        <div className="w-full lg:w-1/2 bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-blue-900 mb-4">Utilisateurs enregistrés</h2>
          <div className="overflow-hidden border border-gray-100 rounded-md">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Utilisateur</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rôle</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Action</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr><td colSpan={3} className="p-6 text-center text-gray-400 italic">Chargement...</td></tr>
                ) : userList.map((user) => (
                  <tr key={user.id_user} className="hover:bg-gray-50">
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{user.prenom} {user.nom}</div>
                      <div className="text-xs text-gray-500">{user.email}</div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-bold rounded-full uppercase ${
                        user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-right text-sm">
                      <button
                      onClick={()=>handleDelete(user.id_user)}
                       className="text-red-600 hover:text-red-900 font-bold">Supprimer</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* FORMULAIRE CRÉATION AVEC SELECT */}
        <div className="w-full lg:w-1/2 bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-blue-900 mb-6">Créer un nouvel utilisateur</h2>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
                <input name="nom" value={newUser.nom} onChange={handleChange} type="text" className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Ex: Dupont" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Prénom</label>
                <input name="prenom" value={newUser.prenom} onChange={handleChange} type="text" className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Ex: Jean" required />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Identifiant</label>
              <input name="identifiant" value={newUser.identifiant} onChange={handleChange} type="text" className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none" placeholder="jdupont" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input name="email" value={newUser.email} onChange={handleChange} type="email" className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none" placeholder="jean.dupont@iut-bobigny.fr" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mot de passe</label>
              <input name="mdp" value={newUser.mdp} onChange={handleChange} type="password" className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none" placeholder="••••••••" required />
            </div>

            {/* LE SELECT DU RÔLE */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Rôle utilisateur</label>
              <select 
                name="role"
                value={newUser.role}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md bg-white focus:ring-2 focus:ring-blue-500 outline-none font-medium"
              >
                <option value="user">Utilisateur (Standard)</option>
                <option value="admin">Administrateur (Gestion totale)</option>
              </select>
              <p className="text-[10px] text-gray-400 mt-1 italic">
                Un administrateur peut créer, modifier et supprimer des utilisateurs.
              </p>
            </div>

            <div className="pt-4">
              <button type="submit" className="w-full bg-blue-900 hover:bg-blue-800 text-white font-bold py-2 rounded-md transition shadow-md uppercase text-xs tracking-widest">
                Enregistrer l'utilisateur
              </button>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
}

export default Admin;