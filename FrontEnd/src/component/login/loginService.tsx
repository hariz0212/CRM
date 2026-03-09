import axios from "axios";
import { useContext } from "react";
import { LoginContext } from "./LoginContext";

const url=import.meta.env.VITE_URL_PATH;

export interface Logindata{
    identifiant:string;
    mdp:string;
}

export const checkMdpAvecIdentifiant= async (data:Logindata)=>{
    try {
        const reponse=await axios.post(`${url}admin`,data);
        return reponse.data;
    } catch (err) {
        console.log(err);
        throw err;
    }

}

export const getUserid=()=>{
    const{idUser}=useContext(LoginContext);
    return idUser;
}

