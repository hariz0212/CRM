import axios from "axios";
const url=import.meta.env.VITE_URL_PATH;

export interface Entreprise {
  id_entreprise: number;
  nom: string;
  type_entreprise: string;
  SIRET: string;
  secteur: string;
  statut_contact: 'À contacter' | 'En cours' | 'Urgent';
  siteweb?: string;
  telephone?: string;
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

export const AddEntreprise=async(data:Omit<Entreprise,'id_entreprise'>)=>{
    console.log("Envoi au back:", data);
    try{
        const reponse= await axios.post(`${url}entreprises`,data);
        return reponse;
    }catch(err){
        console.error('erreur lors  de l insertion',err )
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