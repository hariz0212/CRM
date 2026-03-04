export type StatutTache = 'À contacter' | 'En cours' | 'Urgent';

export interface ITache {
  id_tache?: number;
  date_heure_rappel: string; // DATETIME
  libelle_tache: string;     // VARCHAR
  statut_tache: StatutTache; // ENUM
  id_user: number;
  id_entreprise: number;
  id_contact?: number | null;
}
export const  CONFIG_PRIORITE = {
  "Urgent":      { fond: "bg-red-50",    texte: "text-red-600",    bordure: "border-red-200",    point: "bg-red-500"    },
  "En cours":    { fond: "bg-amber-50",  texte: "text-amber-600",  bordure: "border-amber-200",  point: "bg-amber-400"  },
  "À contacter": { fond: "bg-blue-50",   texte: "text-blue-600",   bordure: "border-blue-200",   point: "bg-blue-500"   },
};

export interface SectionTachesProps {
  theme?: "indigo" | "slate";
  id_entreprise: number;
  id_contact?: number | null;
  id_user: number;
}
