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
    res.status(500).json({ message: `erreur lors de l insertion ${err.message}` });
}
})
// Le :id dans l'URL devient disponible dans req.params.id
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params; // On récupère l'ID envoyé par le front
    console.log(id);
    
    // On utilise un "?" (placeholder) pour éviter les injections SQL
    const sql = 'SELECT * FROM ENTREPRISE WHERE id_entreprise = ?';
    
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
router.put('/commentaire/:id', async (req, res) => {
    const { id } = req.params;
    const { commentaire } = req.body;

    const sql = "UPDATE CONTACT SET commentaire = ? WHERE id_contact = ?";

    try {
        await db.query(sql, [commentaire, id]);
        res.status(200).json({ message: "Commentaire mis à jour" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Erreur lors de la mise à jour" });
    }
});


export default router;