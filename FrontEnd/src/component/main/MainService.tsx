import { ITache } from "../tache/TacheService";

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

export const addTache = async (tache: ITache) => {
    try {
        const reponse = await axios.post(`${url}taches`, tache);
        return reponse.data;
    } catch (err) {
        console.error("Erreur service addTache:", err);
        throw err;
    }
};