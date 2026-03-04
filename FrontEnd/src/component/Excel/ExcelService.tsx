import axios from "axios";

const url=import.meta.env.VITE_URL_PATH;



export const getExcelData= async ()=>{
    console.log(url);
    try{
        const reponse= await axios.get(`${url}contacts/excel`);
        return reponse.data

    }catch(err){
        console.error(err);
        throw err

    }
}