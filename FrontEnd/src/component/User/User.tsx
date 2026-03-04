export interface User{
    id_user:string;
    nom:string;
    prenom:string;
    email:string;
    identifiant:string;
    role:'admin'|'user';
}

export interface UserCreate {
    nom: string;
    prenom: string;
    email: string;
    identifiant: string;
    mdp: string;
    role: 'admin' | 'user';
}