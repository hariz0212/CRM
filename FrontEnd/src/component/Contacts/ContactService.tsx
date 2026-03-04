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
        return reponse.data;

    }catch(err){
        console.error(err);
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