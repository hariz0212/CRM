import express from 'express';

import db from '../bd/db.js';

const router=express.Router();

router.get('/', async (req,res)=>{
  try{
    const id_user=req.headers['id_user'];
    const sql='SELECT * From ENTREPRISE WHERE id_user=?';

    const[rows]= await db.query(sql,[id_user]);
    res.json(rows);
  }catch(err){
    res.status(500).json({error:err.message});
  }

})

router.get('/contacts/:id', async (req, res) => {
    // 1. Ici, "id" représente l'id de l'ENTREPRISE
    const { id } = req.params;

    try {
        // 2. On demande à MySQL tous les contacts qui ont ce fameux id_entreprise
        const sql = `
            SELECT * FROM CONTACT 
            WHERE id_entreprise = ? 
            ORDER BY nom ASC
        `;
        
        // 3. On exécute
        const [contacts] = await db.query(sql, [id]);

        // 4. On renvoie le tableau de contacts (s'il n'y en a pas, ça renverra juste un tableau vide [], ce qui est parfait pour React !)
        res.status(200).json(contacts);

    } catch (err) {
        console.error("Erreur lors de la récupération des contacts de l'entreprise :", err);
        res.status(500).json({ error: "Erreur serveur lors de la récupération des contacts" });
    }
});

router.post('/', async (req, res) => {
    console.log("Données reçues depuis React :", req.body);
    
    try {
        // 1. EXTRACTION
        const { 
            nom, type_entreprise, SIRET, secteur, siteweb, 
            telephone, rue, ville, code_postale, statut_contact, 
            cfa, id_user 
        } = req.body;

        // 🛡️ NIVEAU 1 : VALIDATION DES CHAMPS OBLIGATOIRES
        // Si l'application React oublie d'envoyer le nom ou l'ID de l'utilisateur, on bloque tout de suite !
        if (!nom || nom.trim() === "") {
            return res.status(400).json({ error: "Le nom de l'entreprise est obligatoire." });
        }
        if (!id_user) {
            return res.status(400).json({ error: "L'identifiant de l'utilisateur est manquant." });
        }

        // Nettoyage des données optionnelles
        const siretPropre = (SIRET === "" || !SIRET) ? null : SIRET;
        const cfaPropre = (cfa === "" || !cfa) ? null : cfa;

        // 🛡️ NIVEAU 2 : LE VIDEUR (Vérification métier)
        const [entrepriseExistante] = await db.query(
            "SELECT id_entreprise FROM ENTREPRISE WHERE nom = ? AND id_user = ?", 
            [nom, id_user]
        );

        if (entrepriseExistante.length > 0) { 
            return res.status(400).json({ error: "Vous avez déjà enregistré cette entreprise dans votre liste." });
        }

        // 3. L'INSERTION
        const sql = `
            INSERT INTO ENTREPRISE 
            (nom, type_entreprise, SIRET, secteur, siteweb, telephone, rue, ville, code_postal, statut_contact, cfa, id_user) 
            VALUES(?,?,?,?,?,?,?,?,?,?,?,?)
        `;
        
        const [result] = await db.query(sql, [
            nom, type_entreprise, siretPropre, secteur, siteweb, telephone, 
            rue, ville, code_postale, statut_contact, cfaPropre, id_user
        ]);
        
        // 4. SUCCÈS
        res.status(201).json({ // 201 est le code parfait pour "Création réussie" (au lieu de 200)
            message: 'Entreprise créée avec succès', 
            id_entreprise: result.insertId 
        });

    } catch (err) {
        // 🛡️ NIVEAU 3 : GESTION DES ERREURS SQL ET CRASHES
        console.error("Erreur SQL lors de l'insertion de l'entreprise :", err);

        // Si le SIRET ou un autre champ est trop long par rapport à ce qui est défini dans ta BDD
        if (err.code === 'ER_DATA_TOO_LONG') {
            return res.status(400).json({ error: "Une des informations saisies est trop longue." });
        }
        
        // Si une contrainte de clé étrangère échoue (ex: l'id_user envoyé n'existe pas en base)
        if (err.code === 'ER_NO_REFERENCED_ROW_2') {
            return res.status(400).json({ error: "L'utilisateur associé est introuvable." });
        }

        // Si on a loupé un doublon malgré le videur (ex: contrainte UNIQUE sur le SIRET dans la BDD)
        if (err.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ error: "Cette entreprise ou ce SIRET existe déjà." });
        }

        // Erreur générique par défaut (500)
        res.status(500).json({ error: "Une erreur interne est survenue lors de la création de l'entreprise." });
    }
});
// Le :id dans l'URL devient disponible dans req.params.id
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params; // On récupère l'ID envoyé par le front
    console.log(id);
    
    // On utilise un "?" (placeholder) pour éviter les injections SQL
    const sql = 'SELECT *, nom AS nom_entreprise FROM ENTREPRISE WHERE id_entreprise = ?';
    
    // On exécute la requête (en passant l'ID dans un tableau)
    const [rows] = await db.execute(sql, [id]); 

    // Si on ne trouve rien, on renvoie une erreur 404
    if (rows.length === 0) {
      return res.status(404).json({ message: "Entreprise non trouvée" });
    }

    // On renvoie la première (et seule) ligne trouvée
    res.json(rows[0]);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        // 1. On supprime d'abord tous les contacts liés à cette entreprise
        await db.query('DELETE FROM CONTACT WHERE id_entreprise = ?', [id]);
        
        // 2. Maintenant on peut supprimer l'entreprise
        const [result] = await db.query('DELETE FROM ENTREPRISE WHERE id_entreprise = ?', [id]);

        res.json({ message: "Entreprise et ses contacts supprimés" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Erreur serveur" });
    }
});
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    
    // 1. On récupère toutes les variables depuis React
    const { 
        nom, type_entreprise, secteur, SIRET, siteweb, telephone, 
        ville, rue,code_postal, 
        statut_contact, cfa, id_user 
    } = req.body;

    // 2. La requête avec EXACTEMENT 14 "?"
    const sql = `
        UPDATE ENTREPRISE SET 
            nom = ?, type_entreprise = ?, secteur = ?, SIRET = ?, 
            siteweb = ?, telephone = ?, ville = ?, rue = ?, code_postal = ?,
            statut_contact = ?,  cfa = ?
        WHERE id_entreprise = ? AND id_user = ?
    `;

    try {
        // 3. Le tableau avec EXACTEMENT 14 variables dans le MÊME ORDRE
        await db.query(sql, [
            nom, 
            type_entreprise, 
            secteur, 
            SIRET, 
            siteweb, 
            telephone, 
            ville, 
            rue, 
            code_postal,               // 👈 Remplace le 9ème ? (code_postal)
            statut_contact || null,    // 👈 Remplace le 10ème ?
            cfa || null,               // 👈 Remplace le 12ème ?
            id,                        // 👈 Remplace le 13ème ? (WHERE id_entreprise)
            id_user                    // 👈 Remplace le 14ème ? (AND id_user)
        ]);
        
        res.status(200).json({ message: "Entreprise mise à jour avec succès !" });
    } catch (err) {
        console.error("Erreur UPDATE entreprise :", err);
        res.status(500).json({ error: "Erreur lors de la modification" });
    }
});

router.put('/commentaire/:id', async (req, res) => {
    const { id } = req.params;
    const { commentaire } = req.body;

    const sql = "UPDATE ENTREPRISE SET commentaire = ? WHERE id_entreprise = ?";

    try {
        await db.query(sql, [commentaire, id]);
        res.status(200).json({ message: "Commentaire mis à jour" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Erreur lors de la mise à jour" });
    }
});


export default router;