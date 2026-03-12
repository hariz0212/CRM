

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

export const updateTacheLibelle = async (data: string, id_tache: string | number) => {
    try {
        // On suit la même structure : URL + /taches/libelle/ + ID
        const reponse = await axios.put(`${url}taches/${id_tache}`, { 
            libelle_tache: data 
        });
        return reponse;
    } catch (err) {
        console.error("Erreur lors de la mise à jour du libellé de la tâche :");
        console.error("Data envoyée :", data);
        throw err;
    }
};