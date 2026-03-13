import axios from "axios";

const url=import.meta.env.VITE_URL_PATH;

export interface Contact{
    id_contact:string;
    nom:string;
    prenom:string;
    fonction:string;
    telephone:string;
    email:string;
    statut_contact: 'À contacter' | 'En cours' | 'Urgent';
    linkedin:string;
    commentaire:string;
    id_entreprise:string;
    nom_entreprise:string;
    id_user:string;
}


export const getAllContact=async(id:string)=>{
    try{
        const reponse=await axios.get(`${url}contacts`,{
            headers:{id_user:id}
        });
        console.log(reponse.data);
        return reponse.data;
    }catch(err){
        console.error(err);
        throw err;
    }

} 

export const updateContact = async (id_contact: string | number, data: any) => {
    try {
        // Même logique pour les contacts
        const reponse = await axios.put(`${url}contacts/${id_contact}`, data);
        return reponse;
    } catch (err) {
        console.error("Erreur mise à jour contact:", err);
        throw err;
    }
};

export const updateComm= async(data:string,id_contact:string)=>{
    try {
        const reponse= await axios.put(`${url}contacts/commentaire/${id_contact}`,{commentaire:data});
        return reponse
    } catch (err) {
        console.error(err);
        console.error(data);
        throw err;
    }

}

export const AddContact=async(data:Omit<Contact,'id_contact'>)=>{
    
    try{
        const reponse=await axios.post(`${url}contacts`,data);
        return reponse
    }catch(err){
        console.error(err);
        throw err;
    }
}

export const getContactById=async(id:number|string)=>{
    try{
        const reponse=await axios.get(`${url}contacts/${id}`);
        console.log(reponse.data)
        return reponse.data;


    }catch(err){
        console.error(err);
        throw err;
    }
}

export const getTachesContact = async (id_contact: string | number, id_entreprise: string | number, id_user: string | number) => {
    try {
        // L'id_contact est obligatoire ici car il est dans le chemin de l'URL
        const reponse = await axios.get(`${url}taches/contact/${id_contact}`, {
            headers: { 
                'id_user': id_user,
                'id_entreprise': id_entreprise 
            }
        });
        return reponse.data;
    } catch (err) {
        console.error("Erreur getTachesContact:", err);
        throw err;
    }
}

export const deleteContactById= async (id:string)=>{
    try {
        const reponse=await axios.delete(`${url}contacts/${id}`);
        return reponse
    } catch (err) {
        console.error(err);
        throw err;
    }

}
