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

router.post('/', async (req, res) => {
  console.log(req.body);
    try {
        const { nom, type_entreprise, SIRET, secteur, siteweb, telephone, rue, ville, code_postal, statut_contact, id_user } = req.body;
        const sql = 'INSERT INTO ENTREPRISE (nom, type_entreprise, SIRET, secteur, siteweb, telephone, rue, ville, code_postal, statut_contact, id_user) VALUES(?,?,?,?,?,?,?,?,?,?,?)';
        await db.query(sql, [nom, type_entreprise, SIRET, secteur, siteweb, telephone, rue, ville, code_postal, statut_contact, id_user]);
        res.status(200).json({ message: 'insertion réussie' });
    } catch (err) {
    // ✅ LA BONNE FAÇON DE VÉRIFIER
        const [entrepriseExistante] = await pool.query("SELECT * FROM ENTREPRISE WHERE nom = ? AND id_user = ?", [nom, id_user]);

        // On vérifie que le tableau contient au moins 1 résultat
        if (entrepriseExistante.length > 0) { 
            return res.status(400).json({ error: "Vous avez déjà enregistré cette entreprise dans votre liste." });
        }
            res.status(500).json({ error: "Erreur serveur" });
     }
})
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