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
        // 1. On extrait les variables (en gérant ton 'code_postale' avec un 'e')
        const { 
            nom, type_entreprise, SIRET, secteur, siteweb, 
            telephone, rue, ville, code_postale, statut_contact, 
            cfa, id_user 
        } = req.body;
        const siretPropre = (SIRET === "") ? null : SIRET;
        const cfaPropre = (cfa === "") ? null : cfa;

        // 2. LE VIDEUR : On vérifie si l'entreprise existe D'ABORD
        const [entrepriseExistante] = await db.query(
            "SELECT * FROM ENTREPRISE WHERE nom = ? AND id_user = ?", 
            [nom, id_user]
        );

        if (entrepriseExistante.length > 0) { 
            // Si le tableau n'est pas vide, on bloque et on renvoie l'erreur 400
            return res.status(400).json({ error: "Vous avez déjà enregistré cette entreprise dans votre liste." });
        }

        // 3. L'INSERTION : Si on arrive ici, c'est que l'entreprise n'existe pas encore !
        const sql = 'INSERT INTO ENTREPRISE (nom, type_entreprise, SIRET, secteur, siteweb, telephone, rue, ville, code_postal, statut_contact, cfa, id_user) VALUES(?,?,?,?,?,?,?,?,?,?,?,?)';
        
        // On passe bien toutes les variables, y compris code_postale
        const [result]=await db.query(sql, [nom, type_entreprise, siretPropre, secteur, siteweb, telephone, rue, ville, code_postale, statut_contact, cfaPropre, id_user]);
        
        // 4. On prévient React que tout est parfait
        res.status(200).json({ 
            message: 'Entreprise créée', 
            id_entreprise: result.insertId // 👈 C'est ÇA qui permet à React de faire la suite !
        });

    } catch (err) {
        // Si la base de données a un vrai problème (serveur éteint, faute de frappe SQL...)
        console.error("Erreur SQL critique :", err);
        res.status(500).json({ error: "Erreur serveur lors de l'insertion." });
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
    const { nom, type_entreprise, secteur, SIRET, siteweb, telephone, ville, id_user } = req.body;

    const sql = `UPDATE ENTREPRISE SET 
        nom = ?, type_entreprise = ?, secteur = ?, SIRET = ?, siteweb = ?, telephone = ?, ville = ? 
        WHERE id_entreprise = ? AND id_user = ?`;

    try {
        await db.query(sql, [nom, type_entreprise, secteur, SIRET, siteweb, telephone, ville, id, id_user]);
        res.json({ message: "Entreprise mise à jour !" });
    } catch (err) {
        res.status(500).json({ error: err.message });
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