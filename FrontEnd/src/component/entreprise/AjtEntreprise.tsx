import React, { useState } from "react";
import { AddEntreprise } from "./entrepriseService";
import { getUserid } from "../login/loginService";

interface AjtEntrepriseProps {
  onClose: () => void;
  onSuccess:()=>void;
}

function AjtEntreprise({ onClose,onSuccess }: AjtEntrepriseProps) {
  const id_user=getUserid();
  const [newEntreprise, setNewEntreprise] = useState({
    nom: '',
    type_entreprise: '',
    SIRET: '',
    secteur: '',
    site: '',
    tel: '',
    rue: '',
    ville: '',
    code_postale: '',
    statut_contact: 'À contacter'  as 'À contacter' | 'En cours' | 'Urgent',
    id_user: id_user,
  })

  function changeIn(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    setNewEntreprise(prev => ({
      ...prev,
      [name]: value,
    }));
  }

async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
      e.preventDefault();
      try {
        await AddEntreprise(newEntreprise);
        onSuccess();
        alert('insert réussi')
      } catch (error) {
        console.log(newEntreprise);
        console.error("Erreur lors de l'ajout :", error);
        alert('c rater')
      }
}

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
      
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl p-8 border border-gray-100 max-h-[90vh] overflow-y-auto">
        
        <div className="mb-8 border-b pb-4">
          <h2 className="text-2xl font-bold text-gray-800">Ajouter une entreprise</h2>
          <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest mt-1">Nouvelle fiche partenaire</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Colonne 1 */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Nom de l'entreprise</label>
                <input 
                  onChange={(e) => changeIn(e)}
                  value={newEntreprise.nom}
                  name="nom"
                  type="text" 
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  placeholder="Ex: TechCorp Paris"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Type d'établissement</label>
                <select
                  onChange={(e) => changeIn(e)}
                  value={newEntreprise.type_entreprise}
                  name="type_entreprise"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                >
                  <option value=''>Choisir type</option>
                  <option value='GE'>Grande Entreprise</option>
                  <option value='ASS'>Association</option>
                  <option value='Coll'>Collectivité</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Numéro SIRET</label>
                <input 
                  onChange={(e) => changeIn(e)}
                  value={newEntreprise.SIRET}
                  name="SIRET"
                  type="text" 
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none font-mono"
                  placeholder="123 456 789 00010"
                />
              </div>
            </div>

            {/* Colonne 2 */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Secteur d'activité</label>
                <input 
                  onChange={(e) => changeIn(e)}
                  value={newEntreprise.secteur}
                  name="secteur"
                  type="text" 
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Ex: Informatique, BTP..."
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Site Web</label>
                <input
                  onChange={(e) => changeIn(e)}
                  value={newEntreprise.site}  
                  name="site"
                  type="url" 
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none text-blue-600"
                  placeholder="https://..."
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Téléphone</label>
                <input 
                  onChange={(e) => changeIn(e)}
                  value={newEntreprise.tel}      
                  name="tel"
                  type="tel" 
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="01 48 00 00 00"
                />
              </div>
            </div>

            {/* Adresse — Pleine largeur */}
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Rue</label>
              <input 
                onChange={(e) => changeIn(e)}
                value={newEntreprise.rue}     
                name="rue"
                type="text" 
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Ex: 12 rue de la Paix"
              />
            </div>

            {/* Ville + Code postal côte à côte */}
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Ville</label>
              <input
                onChange={(e) => changeIn(e)}
                value={newEntreprise.ville}
                name="ville"
                type="text" 
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Ex: Bobigny"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Code Postal</label>
              <input 
                onChange={(e) => changeIn(e)}
                value={newEntreprise.code_postale}
                name="code_postale"
                type="text" 
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none font-mono"
                placeholder="Ex: 93000"
                maxLength={10}
              />
            </div>

          </div>

          <div className="mt-10 flex justify-end gap-3 border-t pt-6">
            <button 
              type="button" 
              onClick={onClose}
              className="px-6 py-2 text-sm font-bold text-gray-400 hover:text-gray-600 transition"
            >
              Annuler
            </button>
            <button 
              type="submit" 
              className="px-8 py-2 text-sm font-bold text-white bg-blue-900 rounded-xl hover:bg-blue-800 shadow-lg shadow-blue-900/20 transition-all"
            >
              Créer la fiche
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}

export default AjtEntreprise;