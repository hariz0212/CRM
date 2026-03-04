import axios from "axios";
import { UserCreate } from "../User/User";

const url=import.meta.env.VITE_URL_PATH;


export const getAllUser=async ()=>{
    try {
        const reponse= await axios.get(`${url}admin`);
        return reponse.data;
    } catch (err) {
        console.log(err);
        throw err;
    }
}

export const addUser= async(data:Omit<UserCreate,'id_user'>)=>{
    try {
        const reponse= await axios.post(`${url}admin/addUser`,data);
        return reponse;
        
    } catch (err) {
        console.log(err);
        throw err;
        
    }

}

export const deleteUserByID=async(id:string|number)=>{
    try {
        const reponse=await axios.delete(`${url}admin/${id}`)
        return reponse;
    } catch (err) {
        console.log(err);
        throw err;    
    }
}