import { useParams, NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import { getEntrepriseById, Entreprise, getAllEntreprise, deleteEntrepriseById } from "./entrepriseService";
import { ClipLoader } from "react-spinners";
import { getUserid } from "../login/loginService";
import { useNavigate } from "react-router-dom";
import SectionTaches from "../tache/SectionTaches";
import { updateComm } from "./entrepriseService";

function EntrepriseDetail() {
  const navigate=useNavigate();
  const id_user=getUserid();
  const { id } = useParams<{ id: string }>();
  const [entreprise, setEntreprise] = useState<Entreprise | null>(null);
  const [loading, setLoading] = useState(true);
  const [AllEntreprise, setAllEntreprise] = useState<Entreprise[]>([]);
  const[commentaire,setCommentaire]=useState('');

  useEffect(() => {
    const fetchDetail = async () => {
    try {
      setLoading(true);
      if (id) {
        // On lance les deux promesses simultanément
        const [detailData, listData] = await Promise.all([
          getEntrepriseById(id),
          getAllEntreprise(id_user)
        ]);

        // Une fois que les deux sont arrivées, on met à jour les états
        setEntreprise(detailData);
        setAllEntreprise(listData);
        setCommentaire(detailData.commentaire);
      }
    } catch (err) {
      console.error("Erreur de récupération globale:", err);
    } finally {
      setLoading(false);
    }
  };

    fetchDetail();
  }, [id]);

   const handleComm=async () => {
      if(!entreprise){alert('impossible de modifier le commentaire');return;}
      try {
        await updateComm(commentaire,entreprise.id_entreprise)
        setEntreprise({ ...entreprise, commentaire: commentaire });
        alert('modification réussi');
      } catch (err) {
        console.log(err)
      }
    }

  const handleDelete=async(id:string|number)=>{
    if(!window.confirm('voulez-vous supprimer cette entreprise?')){
      return;
    }
    try {
      await deleteEntrepriseById(id);
      console.log('suppression de l id ',id)
      alert('suppression réussi');
      navigate('/entreprises');
    } catch (err) {
      console.log(err);
      alert('suppression non-réussi');
    }
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-200">
      <ClipLoader color="#1e293b" size={50} />
    </div>
  );
  
  if (!entreprise) return <div className="p-10 text-center text-red-500">Entreprise introuvable.</div>;

  return (
    <div className="min-h-screen bg-gray-200 p-4 md:p-8 font-sans text-gray-800">
      <main className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-6">
          
          {/* --- COLONNE GAUCHE (2/3) : FICHE RÉELLE --- */}
          <section className="w-full lg:w-2/3 space-y-6">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
              
              {/* Header Dynamique avec Bouton Supprimer */}
              <div className="bg-gradient-to-r from-slate-800 to-slate-700 p-8 text-white flex justify-between items-center">
                <div>
  <div className="flex items-center gap-3">
    <h1 className="text-2xl font-bold">{entreprise.nom}</h1>
    {/* BADGE CFA DYNAMIQUE */}
    {entreprise.cfa && (
      <span className="bg-amber-400 text-amber-950 text-[9px] font-black px-2 py-1 rounded-md shadow-sm border border-amber-500/20">
        🎓 CFA {entreprise.cfa}
      </span>
    )}
  </div>
  <p className="text-slate-300 text-xs mt-1 uppercase tracking-widest font-semibold">
    Fiche Entreprise #{id}
  </p>
</div>

                <button
                onClick={()=>handleDelete(entreprise.id_entreprise)} 
                className="bg-red-500 hover:bg-red-600 text-white px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg active:scale-95 border border-red-400/50">
                  Supprimer
                </button>
              </div>

              <div className="p-8 space-y-8">
                {/* 1. INFOS TECHNIQUES RÉELLES */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b pb-1">Identité</h3>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <p className="text-gray-500">Type:</p><p className="font-semibold text-right">{entreprise.type_entreprise || 'N/A'}</p>
                      <p className="text-gray-500">Secteur:</p><p className="font-semibold text-right text-blue-600 text-xs">{entreprise.secteur}</p>
                      <p className="text-gray-500">SIRET:</p><p className="font-mono text-[11px] text-right">{entreprise.SIRET}</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b pb-1">Coordonnées</h3>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <p className="text-gray-500">Web:</p>
                      <a href={`https://${entreprise.siteweb}`} target="_blank" className="text-blue-600 font-bold text-right truncate">
                        {entreprise.siteweb || 'Non renseigné'}
                      </a>
                      <p className="text-gray-500">Tél:</p><p className="font-semibold text-right">{entreprise.telephone || 'Non renseigné'}</p>
                      <p className="text-gray-500">Dernier contact:</p>
                      <input
                        type="date"
                        className="bg-gray-50 border border-gray-200 rounded-lg text-xs font-bold outline-none focus:ring-2 focus:ring-slate-300 text-right px-2 py-1"
                        defaultValue={entreprise.date_dernier_contact ?? ''}
                      />
                    </div>
                  </div>
                </div>

                {/* 2. COMMENTAIRES (Avec bouton enregistrer ajouté) */}
                <div className="space-y-3">
                  <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b pb-1">Commentaires de suivi</h3>
                  <div className="space-y-3">
                    <textarea 
                      onChange={(e)=>setCommentaire(e.target.value)}
                      value={commentaire}
                      className="w-full h-32 p-4 bg-gray-50 border border-gray-100 rounded-xl text-sm italic text-gray-600 outline-none focus:ring-1 focus:ring-slate-300 resize-none transition-all"
                      placeholder="Ajouter des notes sur cette entreprise (historique, préférences, échanges passés...)"
                    ></textarea>
                    <div className="flex justify-end">
                      <button
                      onClick={()=>handleComm()}
                       className="bg-white border border-slate-800 text-slate-800 hover:bg-slate-800 hover:text-white text-[9px] font-black py-2 px-6 rounded-lg uppercase tracking-widest transition-all shadow-sm active:scale-95">
                        Enregistrer le commentaire
                      </button>
                    </div>
                  </div>
                </div>

                {/* 3. LISTE DES CONTACTS */}
                <div className="space-y-4">
                  <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b pb-1">Contacts de l'entreprise</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-3 border border-gray-100 rounded-lg bg-slate-50 flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">?</div>
                      <div>
                        <p className="text-xs font-bold text-gray-800">Voir l'annuaire</p>
                        <p className="text-[10px] text-gray-500 italic">Pour les contacts liés</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 4. GESTION DES TÂCHES */}
                <SectionTaches id_entreprise={entreprise.id_entreprise} id_user={id_user} />
              </div>
            </div>
          </section>

          {/* --- COLONNE DROITE : NAVIGATION RÉELLE --- */}
          <aside className="w-full lg:w-1/3">
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden sticky top-8">
              <div className="p-4 bg-gray-50 border-b border-gray-100 text-center">
                <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Navigation rapide</h2>
              </div>
              <div className="overflow-y-auto max-h-[700px]">
                {AllEntreprise.map((ent:Entreprise) => (
                  <NavLink 
                    key={ent.id_entreprise} 
                    to={`/entreprises/${ent.id_entreprise}`}
                    className={({ isActive }) => `p-4 border-b border-gray-50 cursor-pointer flex items-center gap-3 transition-colors block ${isActive ? 'bg-slate-100 border-l-4 border-slate-800' : 'hover:bg-slate-50'}`}
                  >
                    <span className="text-lg">🏢</span>
                    <div>
                      <span className="text-xs font-bold text-gray-700 block">{ent.nom}</span>
                      <span className="text-[9px] text-gray-400 uppercase">{ent.secteur}</span>
                    </div>
                  </NavLink>
                ))}
              </div>
            </div>
          </aside>

        </div>
      </main>
    </div>
  );
}

export default EntrepriseDetail;