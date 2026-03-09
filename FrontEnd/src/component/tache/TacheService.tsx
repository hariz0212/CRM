export type StatutTache = 'À contacter' | 'En cours' | 'Urgent';

import axios from "axios";

const url=import.meta.env.VITE_URL_PATH;

export interface ITache {
  id_tache?: number;
  date_heure_rappel: string; // DATETIME
  libelle_tache: string;     // VARCHAR
  statut_tache: StatutTache; // ENUM
  id_user: string;
  id_entreprise: string;
  id_contact: string | null;
  contact_nom?: string;
  contact_prenom?: string;
}
export const  CONFIG_PRIORITE = {
  "Urgent":      { fond: "bg-red-50",    texte: "text-red-600",    bordure: "border-red-200",    point: "bg-red-500"    },
  "En cours":    { fond: "bg-amber-50",  texte: "text-amber-600",  bordure: "border-amber-200",  point: "bg-amber-400"  },
  "À contacter": { fond: "bg-blue-50",   texte: "text-blue-600",   bordure: "border-blue-200",   point: "bg-blue-500"   },
};

export interface SectionTachesProps {
  theme?: "indigo" | "slate";
  id_entreprise: string;
  id_contact?: string | null;
  id_user: string;
}

export const addTache = async (tache: ITache) => {
    try {
        const reponse = await axios.post(`${url}taches`, tache);
        return reponse.data;
    } catch (err) {
        console.error("Erreur service addTache:", err);
        throw err;
    }
};
