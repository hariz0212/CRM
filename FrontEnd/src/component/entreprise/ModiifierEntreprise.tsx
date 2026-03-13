import { useState } from "react";
import { updateEntreprise, Entreprise } from "./entrepriseService";
import { getUserid } from "../login/loginService";
import { ClipLoader } from "react-spinners";

interface ModifierEntrepriseProps {
  entreprise: Entreprise;
  onClose: () => void;
  onRefresh: (updated: Entreprise) => void;
}

function ModifierEntreprise({ entreprise, onClose, onRefresh }: ModifierEntrepriseProps) {
  const [formData, setFormData] = useState<Entreprise>({ ...entreprise });
  const [loading, setLoading] = useState(false);
  const id_user = getUserid();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateEntreprise(entreprise.id_entreprise, { ...formData, id_user });
      onRefresh(formData);
      onClose();
    } catch (err) {
      console.error(err);
      alert("Erreur lors de la mise à jour de l'entreprise");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        
        <div className="bg-slate-800 p-6 text-white flex justify-between items-center">
          <h2 className="text-xl font-bold">Modifier l'entreprise</h2>
          <button onClick={onClose} className="text-white/70 hover:text-white text-2xl">&times;</button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 max-h-[80vh] overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Nom */}
            <div className="md:col-span-2 space-y-1">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Nom de l'établissement</label>
              <input 
                type="text" required
                className="w-full border-b-2 border-gray-100 focus:border-slate-500 outline-none py-2 text-sm"
                value={formData.nom}
                onChange={(e) => setFormData({...formData, nom: e.target.value})}
              />
            </div>

            {/* Type & Secteur */}
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Type</label>
              <input 
                type="text"
                className="w-full border-b-2 border-gray-100 focus:border-slate-500 outline-none py-2 text-sm"
                value={formData.type_entreprise || ''}
                onChange={(e) => setFormData({...formData, type_entreprise: e.target.value})}
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Secteur</label>
              <input 
                type="text"
                className="w-full border-b-2 border-gray-100 focus:border-slate-500 outline-none py-2 text-sm"
                value={formData.secteur || ''}
                onChange={(e) => setFormData({...formData, secteur: e.target.value})}
              />
            </div>

            {/* SIRET & Ville */}
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">SIRET</label>
              <input 
                type="text"
                className="w-full border-b-2 border-gray-100 focus:border-slate-500 outline-none py-2 text-sm"
                value={formData.SIRET || ''}
                onChange={(e) => setFormData({...formData, SIRET: e.target.value})}
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Ville</label>
              <input 
                type="text"
                className="w-full border-b-2 border-gray-100 focus:border-slate-500 outline-none py-2 text-sm"
                value={formData.ville || ''}
                onChange={(e) => setFormData({...formData, ville: e.target.value})}
              />
            </div>

            {/* Web & Tel */}
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Site Web</label>
              <input 
                type="text"
                className="w-full border-b-2 border-gray-100 focus:border-slate-500 outline-none py-2 text-sm"
                value={formData.siteweb || ''}
                onChange={(e) => setFormData({...formData, siteweb: e.target.value})}
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Téléphone</label>
              <input 
                type="text"
                className="w-full border-b-2 border-gray-100 focus:border-slate-500 outline-none py-2 text-sm"
                value={formData.telephone || ''}
                onChange={(e) => setFormData({...formData, telephone: e.target.value})}
              />
            </div>

            {/* CFA Selection */}
            <div className="md:col-span-2 space-y-1">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">CFA Associé</label>
              <select 
                className="w-full border-b-2 border-gray-100 focus:border-slate-500 outline-none py-2 text-sm bg-transparent"
                value={formData.cfa || ''}
                onChange={(e) => setFormData({...formData, cfa: e.target.value as any})}
              >
                <option value="">Aucun</option>
                <option value="Leem">Leem</option>
                <option value="Trans-faire">Trans-faire</option>
                <option value="numiA">numiA</option>
              </select>
            </div>
          </div>

          <div className="mt-10 flex justify-end gap-4">
            <button type="button" onClick={onClose} className="px-6 py-2 text-xs font-bold uppercase text-gray-400">Annuler</button>
            <button 
              type="submit" disabled={loading}
              className="bg-slate-800 hover:bg-slate-900 text-white px-8 py-3 rounded-xl text-xs font-bold uppercase shadow-lg flex items-center justify-center min-w-[140px]"
            >
              {loading ? <ClipLoader size={16} color="#fff" /> : 'Enregistrer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ModifierEntreprise;