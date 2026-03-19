import React, { useState } from "react";
import { AddEntreprise } from "./entrepriseService";
import { getUserid } from "../login/loginService";
import { ClipLoader } from "react-spinners"; // Optionnel
import { AddContact } from "../Contacts/ContactService";

interface AjtEntrepriseProps {
  onClose: () => void;
  onSuccess: () => void;
}

function AjtEntreprise({ onClose, onSuccess }: AjtEntrepriseProps) {
  const id_user = getUserid();
  const [loading, setLoading] = useState(false);
  
  // 1. État de l'entreprise
  const [newEntreprise, setNewEntreprise] = useState({
    nom: '', type_entreprise: '', SIRET: '', secteur: '', siteweb: '', telephone: '', 
    rue: '', ville: '', code_postale: '', statut_contact: 'À contacter' as 'À contacter' | 'En cours' | 'Urgent',
    cfa: '', id_user: id_user,
  });

  // 2. État du contact (Nouveau)
  const [showContactForm, setShowContactForm] = useState(false);
  const [newContact, setNewContact] = useState({
    nom: '', prenom: '', email: '', telephone: '', fonction: '',linkedin: ''
  });

  const [showCFAList, setShowCFAList] = useState(false);

  function changeIn(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setNewEntreprise(prev => ({ ...prev, [name]: value }));
  }

  function changeContactIn(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setNewContact(prev => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Création de l'entreprise
        const response = await AddEntreprise(newEntreprise);
      
      // On récupère l'ID généré (à adapter selon le format de retour de ton backend)
      // ✅ La nouvelle ligne propre (on tape directement dans la boîte 'data')
          const nouvelIdEntreprise = response.data?.id_entreprise;

      // 2. Création du contact si demandé et si on a bien l'ID
// 2. Création du contact si demandé et si on a bien l'ID
      if (showContactForm && nouvelIdEntreprise) {
          const contactComplet = {
              ...newContact,
              id_entreprise: nouvelIdEntreprise,
              id_user: id_user,
              
              // 🌟 LA CORRECTION EST LÀ : On remplit les trous obligatoires avec des valeurs par défaut 🌟
              statut_contact: "À contacter", // On met le statut de base
              commentaire: "",               // Vide pour l'instant
              linkedin: '',               // Vide pour l'instant
              nom_entreprise: newEntreprise.nom // 💡 Astuce : On récupère le nom tapé dans le formulaire du haut !
          };
          
          // @ts-ignore (Si jamais il chipote encore sur un détail, tu peux rajouter 'as any' : await addContact(contactComplet as any);)
          await AddContact(contactComplet);
      }

      onSuccess();
      alert('Insertion réussie !');
      onClose();
    } catch (error) {
      console.error("Erreur lors de l'ajout :", error);
      alert('Échec de l\'insertion');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4 py-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl p-8 border border-gray-100 max-h-[95vh] overflow-y-auto">
        
        <div className="mb-6 border-b pb-4 flex justify-between items-center">
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
                <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Nom de l'entreprise *</label>
                <input required name="nom" onChange={changeIn} value={newEntreprise.nom} type="text" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Ex: TechCorp Paris" />
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
                <input name="siteweb" onChange={changeIn} value={newEntreprise.siteweb} type="url" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none text-blue-600" placeholder="https://..." />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Téléphone</label>
                <input name="telephone" onChange={changeIn} value={newEntreprise.telephone} type="tel" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" placeholder="01 48 00 00 00" />
              </div>
            </div>

            {/* Adresse */}
            <div className="md:col-span-2 grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="col-span-2">
                    <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Rue / Adresse</label>
                    <input name="rue" onChange={changeIn} value={newEntreprise.rue} type="text" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none" />
                </div>
                <div className="col-span-1">
                    <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Code Postal</label>
                    <input name="code_postale" onChange={changeIn} value={newEntreprise.code_postale} type="text" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none" />
                </div>
                <div className="col-span-1">
                    <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Ville</label>
                    <input name="ville" onChange={changeIn} value={newEntreprise.ville} type="text" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none" />
                </div>
            </div>

            {/* 🌟 SECTION CONTACT CONDITIONNELLE 🌟 */}
            <div className="md:col-span-2 bg-indigo-50/50 p-5 rounded-xl border border-indigo-100 mt-2">
              <div className="flex items-center justify-between mb-4">
                <label className="text-[11px] font-black text-indigo-900 uppercase tracking-widest flex items-center gap-2">
                  <span>👤</span> Créer un contact en même temps ?
                </label>
                
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" checked={showContactForm} onChange={() => setShowContactForm(!showContactForm)} />
                  <div className="w-9 h-5 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
                </label>
              </div>

              {showContactForm && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2 duration-300 border-t border-indigo-100 pt-4">
  <div>
    <label className="block text-[10px] font-bold text-indigo-700 uppercase mb-1">Nom *</label>
    <input required={showContactForm} name="nom" onChange={changeContactIn} value={newContact.nom} type="text" className="w-full border border-indigo-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-400" />
  </div>
  <div>
    <label className="block text-[10px] font-bold text-indigo-700 uppercase mb-1">Prénom *</label>
    <input required={showContactForm} name="prenom" onChange={changeContactIn} value={newContact.prenom} type="text" className="w-full border border-indigo-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-400" />
  </div>
  <div>
    <label className="block text-[10px] font-bold text-indigo-700 uppercase mb-1">Fonction</label>
    <input name="fonction" onChange={changeContactIn} value={newContact.fonction} type="text" className="w-full border border-indigo-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-400" />
  </div>
  <div>
    <label className="block text-[10px] font-bold text-indigo-700 uppercase mb-1">Email</label>
    <input name="email" onChange={changeContactIn} value={newContact.email} type="email" className="w-full border border-indigo-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-400" />
  </div>
  
  {/* 🌟 LES DEUX NOUVEAUX CHAMPS 🌟 */}
  <div>
    <label className="block text-[10px] font-bold text-indigo-700 uppercase mb-1">Téléphone direct</label>
    <input name="telephone" onChange={changeContactIn} value={newContact.telephone} type="tel" className="w-full border border-indigo-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-400" />
  </div>
  <div>
    <label className="block text-[10px] font-bold text-indigo-700 uppercase mb-1">Profil LinkedIn</label>
    <input name="linkedin" onChange={changeContactIn} value={newContact.linkedin} type="url" placeholder="https://linkedin.com/in/..." className="w-full border border-indigo-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-400 text-indigo-600" />
  </div>
</div>
              )}
            </div>

            {/* CFA Section */}
            <div className="md:col-span-2 bg-slate-50 p-4 rounded-xl border border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Partenaire CFA ?</label>
                <select onChange={(e) => { setShowCFAList(e.target.value === "oui"); if (e.target.value !== "oui") setNewEntreprise(prev => ({ ...prev, cfa: '' })); }} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none bg-white">
                  <option value="non">Non</option>
                  <option value="oui">Oui</option>
                </select>
              </div>
              {showCFAList && (
                <div>
                  <label className="block text-[10px] font-bold text-amber-600 uppercase mb-1">Choisir le CFA</label>
                  <select name="cfa" onChange={changeIn} value={newEntreprise.cfa} className="w-full border-2 border-amber-200 rounded-lg px-3 py-2 text-sm outline-none bg-white font-bold text-amber-900">
                    <option value="">-- Sélectionner --</option>
                    <option value="Leem">Leem</option>
                    <option value="Trans-faire">Trans-faire</option>
                    <option value="numiA">numiA</option>
                  </select>
                </div>
              )}
            </div>

          </div>

          <div className="mt-8 flex justify-end gap-3 border-t pt-4">
            <button type="button" onClick={onClose} className="px-6 py-2 text-sm font-bold text-gray-400 hover:text-gray-600">Annuler</button>
            <button type="submit" disabled={loading} className="px-8 py-2 text-sm font-bold text-white bg-blue-900 rounded-xl hover:bg-blue-800 shadow-lg active:scale-95 transition-all flex items-center justify-center min-w-[150px]">
              {loading ? <ClipLoader size={18} color="#fff" /> : 'Créer la fiche'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AjtEntreprise;