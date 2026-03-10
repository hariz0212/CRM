import { useParams, NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
// Assure-toi d'avoir ces fonctions dans ton contactService
import { getContactById, getAllContact, Contact, deleteContactById, updateComm } from "./ContactService"; 
import { getUserid } from "../login/loginService";
import { useNavigate } from "react-router-dom";
import SectionTaches from "../tache/SectionTaches";
import { ClipLoader } from "react-spinners";



function ContactDetail() {
  const navigate=useNavigate()
  const { id } = useParams<{ id: string }>();
  const [contact, setContact] = useState<Contact | null>(null);
  const [allContacts, setAllContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const id_user=getUserid();
  const[commentaire,setCommentaire]=useState('');

  const handleComm=async () => {
    if(!contact){alert('impossible de modifier le commentaire');return;}
    try {
      await updateComm(commentaire,contact?.id_contact)
      alert('modification réussi');
    } catch (err) {
      console.log(err)
    }
  }

  const handleDelete=async(id:string)=>{
    console.log('handleDelete')
    console.log(id);
    if(!window.confirm('voulez vous supprimer le contact?')){
      return;
    }

    try{
      await deleteContactById(id)
      navigate('/contacts');
    }catch(err){
      console.log(err);
      alert('impossible de supprimer le contact')
    }
  }

  useEffect(() => {
    const fetchContactData = async () => {
      try {
        setLoading(true);
        if (id) {
          // On récupère le détail du contact ET la liste pour la sidebar
          const [detailData, listData] = await Promise.all([
            getContactById(id),
            getAllContact(id_user)
          ]);
          
          setContact(detailData);
          setAllContacts(listData);
        }
      } catch (err) {
        console.error("Erreur de récupération contact:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchContactData();
  }, [id]); // Recharge si on clique sur un autre contact dans la sidebar

  if (loading) return <ClipLoader />
  if (!contact) return <div className="p-10 text-center text-red-500">Contact introuvable.</div>;

  return (
    <div className="min-h-screen bg-gray-200 p-4 md:p-8 font-sans text-gray-800">
      <main className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-6">
          
          {/* --- COLONNE GAUCHE (2/3) : FICHE DU CONTACT --- */}
          <section className="w-full lg:w-2/3 space-y-6">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
              
              {/* Header Contact : Thème Indigo/Violet */}
              <div className="bg-gradient-to-r from-indigo-800 to-purple-700 p-8 text-white flex justify-between items-start">
                <div>
                  <h1 className="text-2xl font-bold leading-tight">
                    {contact.prenom} {contact.nom}
                  </h1>
                  
                  <div className="flex flex-wrap items-center gap-3 mt-2">
                    {/* Fonction */}
                    <p className="text-indigo-200 text-[10px] uppercase tracking-widest font-bold italic opacity-90">
                      {contact.fonction || 'Poste non renseigné'}
                    </p>

                    <span className="text-white/30 text-xs hidden md:block">•</span>

                    {/* LIEN VERS L'ENTREPRISE */}
                    <NavLink 
                      to={`/entreprises/${contact.id_entreprise}`}
                      className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 border border-white/20 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter transition-all active:scale-95"
                    >
                      <span className="text-white">{contact.nom_entreprise}</span>
                      <span className="text-indigo-300 ml-1">→</span>
                    </NavLink>
                  </div>
                </div>
                <button
                onClick={()=>handleDelete(contact.id_contact)}
                className="bg-red-500/20 hover:bg-red-500 text-red-100 border border-red-400/50 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all">
                  Supprimer
                </button>
              </div>

              <div className="p-8 space-y-8">
                {/* 1. COORDONNÉES & IDENTITÉ */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <h3 className="text-[10px] font-black text-indigo-400 uppercase tracking-widest border-b pb-1">Identité</h3>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <p className="text-gray-500">Prénom:</p><p className="font-semibold text-right">{contact.prenom || 'N/A'}</p>
                      <p className="text-gray-500">Nom:</p><p className="font-semibold text-right text-indigo-600">{contact.nom}</p>
                      <p className="text-gray-500">Fonction:</p><p className="font-semibold text-right text-xs">{contact.fonction || 'N/A'}</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-[10px] font-black text-indigo-400 uppercase tracking-widest border-b pb-1">Contact Direct</h3>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <p className="text-gray-500">Email:</p>
                      <a href={`mailto:${contact.email}`} className="text-blue-600 font-bold text-right truncate">{contact.email || 'N/A'}</a>
                      <p className="text-gray-500">Tél:</p><p className="font-semibold text-right">{contact.telephone || 'N/A'}</p>
                      <p className="text-gray-500">LinkedIn:</p>
                      <a href={contact.linkedin} target="_blank" rel="noreferrer" className="text-indigo-600 font-bold text-right truncate">Voir le profil 🔗</a>
                    </div>
                  </div>
                </div>

                {/* 2. COMMENTAIRES (Notes sur le contact) */}
            <div className="space-y-3">
              <h3 className="text-[10px] font-black text-indigo-400 uppercase tracking-widest border-b pb-1">Notes & Commentaires</h3>
              <textarea 
                onChange={(e)=>setCommentaire(e.target.value)}
                value={commentaire}
                className="w-full h-24 p-4 bg-gray-50 border border-gray-100 rounded-xl text-sm italic text-gray-600 outline-none focus:ring-1 focus:ring-indigo-300 resize-none"
                placeholder="Notes particulières sur ce contact..."
              ></textarea>
              <div className="flex justify-end">
                <button 
                onClick={()=>handleComm()}
                className="bg-indigo-700 hover:bg-indigo-800 text-white text-[10px] font-bold py-2 px-6 rounded-lg uppercase tracking-widest shadow-md transition-all active:scale-95">
                  Enregistrer
                </button>
              </div>
            </div>

                {/* 3. SUIVI DES ACTIONS */}
                <SectionTaches id_entreprise={contact.id_entreprise} id_user={id_user} id_contact={id} />
                
              </div>
            </div>
          </section>

          {/* --- COLONNE DROITE : NAVIGATION RÉPERTOIRE --- */}
          <aside className="w-full lg:w-1/3">
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden sticky top-8">
              <div className="p-4 bg-gray-50 border-b border-gray-100 text-center">
                <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Annuaire Rapide</h2>
              </div>
              <div className="overflow-y-auto max-h-[700px]">
                {allContacts.map((c) => (
                  <NavLink 
                    key={c.id_contact} 
                    to={`/contacts/${c.id_contact}`}
                    className={({ isActive }) => `p-4 border-b border-gray-50 cursor-pointer flex items-center gap-3 transition-colors block ${isActive ? 'bg-indigo-50 border-l-4 border-indigo-600' : 'hover:bg-gray-50'}`}
                  >
                    <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-[10px] font-bold">
                      {c.nom[0]}{c.prenom ? c.prenom[0] : ''}
                    </div>
                    <div>
                      <span className="text-xs font-bold text-gray-700 block">{c.prenom} {c.nom}</span>
                      <span className="text-[9px] text-gray-400 uppercase">{c.fonction || 'Contact'}</span>
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

export default ContactDetail;