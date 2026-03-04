import { getUserid } from "../login/loginService";
import { getExcelData } from "./ExcelService";
import * as XLSX from "xlsx";

function Excel() {
  const id_user=getUserid();
  const handleExport = async () => {
    try {
      const contacts = await getExcelData(id_user);

      const rows = contacts.map((c: any) => ({
        // --- ENTREPRISE EN PREMIER ---
        "Entreprise":          c.nom_entreprise,
        "Type entreprise":     c.type_entreprise,
        "Secteur":             c.secteur,
        "SIRET":               c.SIRET,
        "Site web":            c.siteweb,
        "Tél. entreprise":     c.telephone_entreprise,
        "Ville":               c.ville,
        "Statut entreprise":   c.statut_contact_entreprise,
        "Dernier contact":     c.date_derniere_action,

        // --- CONTACT ENSUITE ---
        "Nom":                 c.nom,
        "Prénom":              c.prenom,
        "Fonction":            c.fonction,
        "Email":               c.email,
        "Tél. contact":        c.telephone,
        "LinkedIn":            c.linkedin,
        "Statut contact":      c.statut_contact,
        "Commentaire":         c.commentaire,
      }));

      const ws = XLSX.utils.json_to_sheet(rows);
      ws["!cols"] = [
        { wch: 30 }, { wch: 20 }, { wch: 20 }, { wch: 16 },
        { wch: 25 }, { wch: 18 }, { wch: 18 }, { wch: 15 },
        { wch: 18 }, { wch: 20 }, { wch: 20 }, { wch: 25 },
        { wch: 30 }, { wch: 18 }, { wch: 30 }, { wch: 15 },
        { wch: 40 },
      ];

      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Contacts");
      XLSX.writeFile(wb, `contacts_${new Date().toISOString().slice(0, 10)}.xlsx`);
    } catch (err) {
      console.error("Erreur export:", err);
    }
  };

  return (
    <button
      onClick={handleExport}
      className="flex items-center gap-2 bg-indigo-700 hover:bg-indigo-800 text-white font-black text-[11px] uppercase tracking-widest px-5 py-2.5 rounded-xl shadow-lg transition-all active:scale-95"
    >
      📥 Exporter en Excel
    </button>
  );
}

export default Excel;