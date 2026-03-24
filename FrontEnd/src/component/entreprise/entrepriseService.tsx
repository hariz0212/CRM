import axios from "axios";
const url=import.meta.env.VITE_URL_PATH;

export interface Entreprise {
  id_entreprise: string;
  nom: string;
  type_entreprise: string;
  SIRET: string;
  secteur: string;
  statut_contact: 'À contacter' | 'En cours' | 'Urgent';
  siteweb?: string;
  telephone?: string;
  cfa?: string;
  rue?:string;
  ville?:string;
  code_postal?:string;
  commentaire?:string;
  date_dernier_contact?:string;
  id_user: string;
}


export const getAllEntreprise = async (id:string) =>{
    try{
        const reponse = await axios.get(`${url}entreprises`,{
            headers:{id_user:id}
        });
        console.log(url)
        console.log(id)
        return reponse.data;
    }catch(err){
        console.error('erreur:',err);
        console.log(id)
        throw err;
    }
}

export const AddEntreprise = async (entrepriseData: any) => {
    try {
        const reponse = await axios.post(`${url}entreprises`, entrepriseData);
        return reponse.data; 
    } catch (err: any) {
        
        // 🌟 1. SÉCURITÉ : On vérifie que "response" et "data" existent bien
        if (err.response && err.response.data) {
            
            // 🌟 2. CORRECTION : On utilise bien "response" (avec le S)
            console.log('Erreur reçue du backend :', err.response.data);
            
            // 🌟 3. LE MESSAGE : On récupère ta clé "error" (ex: "Vous avez déjà enregistré...")
            // Si le backend n'a pas mis de clé "error", on met un message par défaut.
            const messageBackend = err.response.data.error || "Erreur lors de l'insertion";
            
            throw new Error(messageBackend); 

        } else {
            // Cas où le serveur Node.js est éteint ou injoignable
            throw new Error("Impossible de joindre le serveur.");
        }
    }
};

export const updateEntreprise = async (id_entreprise: string | number, data: any) => {
    try {
        // On envoie l'objet data qui contient tous les champs (nom, ville, etc.)
        const reponse = await axios.put(`${url}entreprises/${id_entreprise}`, data);
        return reponse;
    } catch (err) {
        console.error("Erreur mise à jour entreprise:", err);
        throw err;
    }
};

export const updateComm= async(data:string,id_entreprise:string)=>{
    try {
        const reponse= await axios.put(`${url}entreprises/commentaire/${id_entreprise}`,{commentaire:data});
        return reponse
    } catch (err) {
        console.error(err);
        console.error(data);
        throw err;
    }

}

export const getEntrepriseById=async (id:number|string)=>{
    try{
        const reponse= await axios.get(`${url}entreprises/${id}`)
        return reponse.data;
    }catch(err){
        console.log(err)
        throw err;
    }
}

export const deleteEntrepriseById=async(id:number|string)=>{
    try{
        const reponse=await axios.delete(`${url}entreprises/${id}`)
        return reponse.data;
    }catch(err){
        console.log(err);
        throw err;
    }
}

export const getTachesEntreprise = async (id_entreprise: string | number, id_user: string | number) => {
    try {
        const reponse = await axios.get(`${url}taches/entreprise/${id_entreprise}`, {
            headers: { 
                'id_user': id_user 
            }
        });
        return reponse.data;
    } catch (err) {
        console.error("Erreur getTachesEntreprise:", err);
        throw err;
    }
}

export const getContactEntrerpise = async (id_entreprise: string | number) => {
    try {
        const reponse = await axios.get(`${url}entreprises/contacts/${id_entreprise}`);
        return reponse.data;
    } catch (err) {
        console.error(`Erreur lors de la récupération des contacts pour l'entreprise ${id_entreprise}:`, err);
        throw err; // On renvoie l'erreur pour la gérer dans le composant
    }
};