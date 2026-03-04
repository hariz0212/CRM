import {createContext, ReactNode, useState,useContext, useEffect } from "react";


export const LoginContext=createContext<any>(null);


export const LoginProvider=({children}:{children:ReactNode})=>{
    const[idUser,setIdUser]=useState<number | null>(()=>{
        const SavedId=localStorage.getItem('idUser');
        return SavedId ? Number(SavedId) : null;
    });
    const[admin,setAdmin]=useState<boolean>(()=>{
        const SavedAdmin=localStorage.getItem('admin');
        return SavedAdmin==='true';
    });

    const logout=()=>{
        setIdUser(null);
        setAdmin(false);
        localStorage.clear();
    }

    useEffect(()=>{
        if(idUser !== null){
            localStorage.setItem("idUser",idUser.toString());
            localStorage.setItem("admin",admin.toString());
        }else{
            localStorage.removeItem("idUser");
            localStorage.removeItem("admin");
        }

    },[idUser,admin]);



    return(
        <LoginContext.Provider value={{idUser,setIdUser,admin,setAdmin,logout}}>
            {children}
        </LoginContext.Provider>
    )
}
export const getAdmin=()=>{
    const{admin}=useContext(LoginContext);
    return admin;
}

