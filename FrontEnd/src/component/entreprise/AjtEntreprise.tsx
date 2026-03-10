import React, { useState } from "react";
import { AddEntreprise } from "./entrepriseService";
import { getUserid } from "../login/loginService";

interface AjtEntrepriseProps {
  onClose: () => void;
  onSuccess: () => void;
}

function AjtEntreprise({ onClose, onSuccess }: AjtEntrepriseProps) {
  const id_user = getUserid();
  
  // 1. On ajoute 'cfa' dans le state initial
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
    statut_contact: 'À contacter' as 'À contacter' | 'En cours' | 'Urgent',
    cfa: '', // Nouveau champ
    id_user: id_user,
  });

  // 2. État local pour l'affichage conditionnel
  const [showCFAList, setShowCFAList] = useState(false);

  function changeIn(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
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
      alert('Insertion réussie');
      onClose();
    } catch (error) {
      console.error("Erreur lors de l'ajout :", error);
      alert('Échec de l\'insertion');
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl p-8 border border-gray-100 max-h-[90vh] overflow-y-auto">
        
        <div className="mb-8 border-b pb-4 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Ajouter une entreprise</h2>
            <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest mt-1">Nouvelle fiche partenaire</p>
          </div>
          <span className="text-3xl">🏢</span>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Colonne 1 */}
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Nom de l'entreprise</label>
                <input name="nom" onChange={changeIn} value={newEntreprise.nom} type="text" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Ex: TechCorp Paris" />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Type d'établissement</label>
                <select name="type_entreprise" onChange={changeIn} value={newEntreprise.type_entreprise} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white">
                  <option value=''>Choisir type</option>
                  <option value='GE'>Grande Entreprise</option>
                  <option value='ASS'>Association</option>
                  <option value='Coll'>Collectivité</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Statut Partenariat</label>
                <select name="statut_contact" onChange={changeIn} value={newEntreprise.statut_contact} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-blue-50 font-bold text-blue-900">
                  <option value="À contacter">À contacter</option>
                  <option value="En cours">En cours</option>
                  <option value="Urgent">Urgent</option>
                </select>
              </div>
            </div>

            {/* Colonne 2 */}
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Secteur d'activité</label>
                <input name="secteur" onChange={changeIn} value={newEntreprise.secteur} type="text" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Ex: Informatique, BTP..." />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Site Web</label>
                <input name="site" onChange={changeIn} value={newEntreprise.site} type="url" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none text-blue-600" placeholder="https://..." />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Téléphone</label>
                <input name="tel" onChange={changeIn} value={newEntreprise.tel} type="tel" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" placeholder="01 48 00 00 00" />
              </div>
            </div>

            {/* --- SECTION CFA CONDITIONNELLE (Pleine largeur) --- */}
            <div className="md:col-span-2 bg-slate-50 p-4 rounded-xl border border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Partenaire CFA ?</label>
                <select
                  onChange={(e) => {
                    const isYes = e.target.value === "oui";
                    setShowCFAList(isYes);
                    if (!isYes) setNewEntreprise(prev => ({ ...prev, cfa: '' }));
                  }}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                >
                  <option value="non">Non</option>
                  <option value="oui">Oui</option>
                </select>
              </div>

              {showCFAList && (
                <div className="animate-in fade-in slide-in-from-left-2 duration-300">
                  <label className="block text-[10px] font-bold text-amber-600 uppercase mb-1">Choisir le CFA</label>
                  <select
                    name="cfa"
                    onChange={changeIn}
                    value={newEntreprise.cfa}
                    className="w-full border-2 border-amber-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-amber-500 outline-none bg-white font-bold text-amber-900"
                  >
                    <option value="">-- Sélectionner --</option>
                    <option value="Leem">Leem</option>
                    <option value="Trans-faire">Trans-faire</option>
                    <option value="numiA">numiA</option>
                  </select>
                </div>
              )}
            </div>

            {/* Adresse */}
            <div className="md:col-span-2">
              <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Rue / Adresse</label>
              <input name="rue" onChange={changeIn} value={newEntreprise.rue} type="text" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" placeholder="12 rue de la Paix" />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Ville</label>
              <input name="ville" onChange={changeIn} value={newEntreprise.ville} type="text" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Bobigny" />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Code Postal</label>
              <input name="code_postale" onChange={changeIn} value={newEntreprise.code_postale} type="text" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none font-mono" placeholder="93000" maxLength={10} />
            </div>

          </div>

          <div className="mt-10 flex justify-end gap-3 border-t pt-6">
            <button type="button" onClick={onClose} className="px-6 py-2 text-sm font-bold text-gray-400 hover:text-gray-600">Annuler</button>
            <button type="submit" className="px-8 py-2 text-sm font-bold text-white bg-blue-900 rounded-xl hover:bg-blue-800 shadow-lg shadow-blue-900/20 active:scale-95 transition-all">Créer la fiche</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AjtEntreprise;