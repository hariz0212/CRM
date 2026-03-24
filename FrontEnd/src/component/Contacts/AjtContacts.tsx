import React, { useState } from "react";
import { Entreprise } from "../entreprise/entrepriseService";
import { AddContact } from "./ContactService";
import { getUserid } from "../login/loginService";

interface AjtContactProps {
  onClose: () => void;
  onSuccess: () => void;
  entreprise: Entreprise[];
}

function AjtContact({ onClose, onSuccess, entreprise }: AjtContactProps) {
  const id_user = getUserid();
  
  // 🌟 NOUVEAU : On ajoute l'état pour gérer l'erreur de l'API
  const [erreurApi, setErreurApi] = useState<string | null>(null);

  // Correction de la syntaxe du useState
  const [newContact, setNewContact] = useState({
    nom: '',
    prenom: '',
    fonction: '',
    telephone: '',
    email: '',
    statut_contact: 'À contacter' as 'À contacter' | 'En cours' | 'Urgent',
    linkedin: '',
    commentaire: '',
    id_entreprise: '',
    nom_entreprise: '',
    id_user: id_user,
  });

  function changeIn(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setNewContact(prev => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErreurApi(null); // 🌟 On efface l'ancienne erreur avant de réessayer

    if (!newContact.id_entreprise) {
      setErreurApi('Veuillez sélectionner une entreprise.');
      return;
    }
    
    try {
      await AddContact(newContact);
      onSuccess();
      onClose();
    } catch (err: any) {
      console.error("Erreur lors de l'ajout :", err);
      // 🌟 On attrape le message précis du backend (ou le fallback)
      setErreurApi(err.message || 'Une erreur est survenue lors de la création.');
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl p-8 border border-indigo-50 max-h-[95vh] overflow-y-auto">

        {/* HEADER MODALE */}
        <div className="mb-6 border-b pb-4 flex justify-between items-end">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 tracking-tight">Nouveau Contact</h2>
            <p className="text-[10px] text-indigo-400 uppercase font-black tracking-widest mt-1">Ajouter une personne physique</p>
          </div>
          <div className="text-3xl bg-indigo-50 p-2 rounded-xl">👤</div>
        </div>

        {/* 🌟 NOUVEAU : LA BOÎTE D'ERREUR ROUGE 🌟 */}
        {erreurApi && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
            <span className="text-red-500 text-lg mt-0.5">⚠️</span>
            <div>
              <h4 className="text-[10px] font-black uppercase tracking-widest text-red-800">Erreur</h4>
              <p className="text-xs text-red-600 font-medium mt-0.5">{erreurApi}</p>
            </div>
            <button type="button" onClick={() => setErreurApi(null)} className="ml-auto text-red-400 hover:text-red-800">
              ✕
            </button>
          </div>
        )}

        {/* FORMULAIRE */}
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Colonne 1 */}
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1 tracking-wider">Prénom</label>
                <input
                  onChange={changeIn}
                  value={newContact.prenom}
                  name="prenom"
                  type="text"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder:text-gray-300"
                  placeholder="Ex: Jean"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1 tracking-wider">Nom de famille <span className="text-red-400">*</span></label>
                <input
                  onChange={changeIn}
                  value={newContact.nom}
                  name="nom"
                  type="text"
                  required
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder:text-gray-300"
                  placeholder="Ex: DUPONT"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1 tracking-wider">Fonction / Poste</label>
                <input
                  onChange={changeIn}
                  value={newContact.fonction}
                  name="fonction"
                  type="text"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder:text-gray-300"
                  placeholder="Ex: Responsable RH"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1 tracking-wider">Statut</label>
                <select
                  onChange={changeIn}
                  value={newContact.statut_contact}
                  name="statut_contact"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
                >
                  <option value="À contacter">À contacter</option>
                  <option value="En cours">En cours</option>
                  <option value="Urgent">Urgent</option>
                </select>
              </div>
            </div>

            {/* Colonne 2 */}
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1 tracking-wider">Adresse Email</label>
                <input
                  onChange={changeIn}
                  value={newContact.email}
                  name="email"
                  type="email"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder:text-gray-300"
                  placeholder="j.dupont@entreprise.com"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1 tracking-wider">Téléphone Direct</label>
                <input
                  onChange={changeIn}
                  value={newContact.telephone}
                  name="telephone"
                  type="tel"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder:text-gray-300"
                  placeholder="06 00 00 00 00"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1 tracking-wider">LinkedIn</label>
                <input
                  onChange={changeIn}
                  value={newContact.linkedin}
                  name="linkedin"
                  type="url"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder:text-gray-300 text-indigo-600"
                  placeholder="https://linkedin.com/in/..."
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1 tracking-wider">Entreprise rattachée <span className="text-red-400">*</span></label>
                <select
                  onChange={changeIn}
                  value={newContact.id_entreprise}
                  name="id_entreprise"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none bg-gray-50 text-gray-700"
                >
                  <option value="" disabled >Sélectionner une entreprise...</option>
                  {entreprise?.map(({ id_entreprise, nom }) => (
                    <option key={id_entreprise} value={id_entreprise}>{nom}</option>
                  ))}
                </select>
              </div>
            </div>

          </div>

          {/* FOOTER MODALE */}
          <div className="mt-8 flex justify-end items-center gap-4 border-t pt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 text-xs font-bold text-gray-400 hover:text-gray-600 transition-colors uppercase tracking-widest"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-8 py-3 text-xs font-bold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all transform hover:-translate-y-0.5 active:scale-95 uppercase tracking-widest"
            >
              Créer le contact
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}

export default AjtContact;