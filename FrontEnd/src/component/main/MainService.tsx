

import axios from "axios";
const url=import.meta.env.VITE_URL_PATH;

export const getAllTache = async (id_user: string | number) => {
    try {
        const reponse = await axios.get(`${url}taches/user/${id_user}`);
        return reponse.data; // Doit retourner t.* + entreprise_nom + contact_nom        
    } catch (err) {
        console.log(err);
        throw err;
    }
};

export const updateTacheLibelle = async (libelle_tache: string, info: string, id_tache: string | number) => {
    try {
        // On envoie maintenant les DEUX informations au backend
        const reponse = await axios.put(`${url}taches/${id_tache}`, { 
            libelle_tache: libelle_tache,
            info: info
        });
        return reponse;
    } catch (err) {
        console.error("Erreur lors de la mise à jour de la tâche :");
        console.error("Données envoyées :", { libelle_tache, info });
        throw err;
    }
};