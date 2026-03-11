import { useContext, useState, type ChangeEvent } from "react";
import { checkMdpAvecIdentifiant, Logindata } from "./loginService";
import { ClipLoader } from "react-spinners";
import { LoginContext } from "./LoginContext";
import { useNavigate } from "react-router-dom";


function Login() {
    const navigate =useNavigate();
    const [loading, setLoading] = useState(false);
    const [MsgError, setMsgError] = useState('');
    const {setIdUser,setAdmin}=useContext(LoginContext);

    const [formData, setFormData] = useState<Logindata>({
        identifiant: '',
        mdp: ''
    });

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [id]: value
        }));
    };

const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMsgError('');
    try {
        setLoading(true);
        const userData = await checkMdpAvecIdentifiant(formData); 
        
        // 1. On vérifie ce que le serveur nous envoie vraiment
        console.log("Réponse du serveur :", userData);

        if (userData && userData.id_user) {
            // 2. ✅ ON FORCE L'ÉCRITURE IMMÉDIATE
            localStorage.setItem("id_user", userData.id_user.toString());
            localStorage.setItem("admin", (userData.role === 'admin').toString());

            // 3. On met à jour le Context pour les composants déjà ouverts
            setIdUser(userData.id_user);
            setAdmin(userData.role === 'admin');

            console.log('ID bien enregistré dans le localStorage !');
            navigate('/main');
        } else {
            setMsgError("Erreur : l'ID utilisateur est manquant dans la réponse.");
        }
    } catch (err) {
        setMsgError('Identifiant ou mot de passe incorrect');
    } finally {
        setLoading(false);
    }
};

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
            <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
                
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-blue-900">IUT de Bobigny</h1>
                    <p className="text-gray-600">Gestion Relations Entreprises</p>
                </div>

                {/* BLOC MESSAGE D'ERREUR STYLISÉ */}
                {MsgError && (
                    <div className="mb-6 flex items-center bg-red-50 border-l-4 border-red-500 p-4 rounded shadow-sm animate-pulse">
                        <svg className="h-5 w-5 text-red-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        <p className="text-sm font-bold text-red-700">{MsgError}</p>
                    </div>
                )}

                {/* Formulaire utilisant maintenant handleSubmit */}
                <form onSubmit={handleSubmit}>
                    
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="identifiant">
                            Identifiant 
                        </label>
                        <input
                            onChange={handleChange}
                            value={formData.identifiant}
                            type="text"
                            id="identifiant"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                            placeholder="votre_identifiant"
                            required
                        />
                    </div>

                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="mdp">
                            Mot de passe
                        </label>
                        <input
                            onChange={handleChange}
                            value={formData.mdp}
                            type="password"
                            id="mdp"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    <button
                        disabled={loading}
                        type="submit"
                        className={`w-full bg-blue-900 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded-md transition duration-300 shadow-sm ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        {loading ? <ClipLoader/> : 'Se connecter'}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Login;