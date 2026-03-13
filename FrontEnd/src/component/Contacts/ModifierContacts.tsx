import { useState } from "react";
import { updateContact, Contact } from "./ContactService";
import { getUserid } from "../login/loginService";
import { ClipLoader } from "react-spinners";

interface ModifierContactProps {
  contact: Contact;
  onClose: () => void;
  onRefresh: (updatedContact: Contact) => void;
}

function ModifierContact({ contact, onClose, onRefresh }: ModifierContactProps) {
  const [formData, setFormData] = useState<Contact>({ ...contact });
  const [loading, setLoading] = useState(false);
  const id_user = getUserid();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateContact(contact.id_contact, { ...formData, id_user });
      onRefresh(formData);
      onClose();
    } catch (err) {
      console.error(err);
      alert("Erreur lors de la modification");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        
        <div className="bg-indigo-700 p-6 text-white flex justify-between items-center">
          <h2 className="text-xl font-bold">Modifier le profil</h2>
          <button onClick={onClose} className="text-white/70 hover:text-white text-2xl">&times;</button>
        </div>

        <form onSubmit={handleSubmit} className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Prénom</label>
              <input 
                type="text"
                className="w-full border-b-2 border-gray-100 focus:border-indigo-500 outline-none py-2 text-sm transition-colors"
                value={formData.prenom || ''}
                onChange={(e) => setFormData({...formData, prenom: e.target.value})}
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Nom</label>
              <input 
                type="text"
                required
                className="w-full border-b-2 border-gray-100 focus:border-indigo-500 outline-none py-2 text-sm transition-colors"
                value={formData.nom}
                onChange={(e) => setFormData({...formData, nom: e.target.value})}
              />
            </div>

            <div className="md:col-span-2 space-y-1">
              <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Email professionnel</label>
              <input 
                type="email"
                className="w-full border-b-2 border-gray-100 focus:border-indigo-500 outline-none py-2 text-sm transition-colors"
                value={formData.email || ''}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Fonction / Poste</label>
              <input 
                type="text"
                className="w-full border-b-2 border-gray-100 focus:border-indigo-500 outline-none py-2 text-sm transition-colors"
                value={formData.fonction || ''}
                onChange={(e) => setFormData({...formData, fonction: e.target.value})}
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Téléphone</label>
              <input 
                type="text"
                className="w-full border-b-2 border-gray-100 focus:border-indigo-500 outline-none py-2 text-sm transition-colors"
                value={formData.telephone || ''}
                onChange={(e) => setFormData({...formData, telephone: e.target.value})}
              />
            </div>

            {/* LinkedIn ajouté en bas sur toute la largeur */}
            <div className="md:col-span-2 space-y-1">
              <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Profil LinkedIn</label>
              <input 
                type="text"
                placeholder="https://linkedin.com/in/nom-utilisateur"
                className="w-full border-b-2 border-gray-100 focus:border-indigo-500 outline-none py-2 text-sm transition-colors"
                value={formData.linkedin || ''}
                onChange={(e) => setFormData({...formData, linkedin: e.target.value})}
              />
            </div>
          </div>

          <div className="mt-10 flex justify-end gap-4">
            <button 
              type="button"
              onClick={onClose}
              className="px-6 py-2 text-xs font-bold uppercase text-gray-400 hover:text-gray-600 transition-colors"
            >
              Annuler
            </button>
            <button 
              type="submit"
              disabled={loading}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-xl text-xs font-bold uppercase shadow-lg shadow-indigo-200 transition-all active:scale-95 disabled:opacity-50 min-w-[150px] flex justify-center"
            >
              {loading ? <ClipLoader size={18} color="#ffffff" /> : 'Sauvegarder'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ModifierContact;