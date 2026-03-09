import express from 'express';

import db from '../bd/db.js';

const router=express.Router();


router.get('/', async (req, res) => {
    try {
        const id_user = req.headers['id_user'];
        const sql = `SELECT c.* FROM CONTACT c 
                     JOIN ENTREPRISE e ON c.id_entreprise = e.id_entreprise 
                     WHERE e.id_user = ?`;
        const [rows] = await db.query(sql, [id_user]);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/', async (req,res)=>{
    try {
        const{nom,prenom,fonction,telephone,email,statut_contact,linkedin,id_entreprise}=req.body;
        const sql='INSERT INTO CONTACT (nom,prenom,fonction,telephone,email,statut_contact,linkedin,id_entreprise) VALUES(?,?,?,?,?,?,?,?)';
        await db.query(sql,[nom,prenom,fonction,telephone,email,statut_contact,linkedin,id_entreprise]);
        res.status(200).json({message:'insertion réussit'})
        
    } catch (err) {
        console.error(err);
        res.status(500).json({message:'erreur lors de linsertion'});
        
    }
});
router.get('/excel',async(req,res)=>{
    try {
      const id_user = req.headers['id_user'];
        const sql=("SELECT e.nom AS nom_entreprise, e.type_entreprise, e.secteur, e.SIRET,e.siteweb, e.telephone AS telephone_entreprise, e.ville,e.statut_contact AS statut_contact_entreprise, e.date_derniere_action,c.* FROM CONTACT c JOIN ENTREPRISE e ON c.id_entreprise = e.id_entreprise where e.id_user=?");
        const [rows]=await db.query(sql,[id_user]);
        res.status(200).json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({message:'errur contact et entreprise non trouvé'});
    }
});

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params; // On récupère l'ID du contact
    console.log("Recherche du contact ID :", id);
    
    // Requête SQL pour un contact spécifique
    const sql = 'SELECT * FROM CONTACT WHERE id_contact = ?';
    
    const [rows] = await db.execute(sql, [id]); 

    if (rows.length === 0) {
      return res.status(404).json({ message: "Contact non trouvé" });
    }

    // On renvoie l'objet du contact
    res.json(rows[0]);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur lors de la récupération du contact" });
  }
});
// Mettre à jour le commentaire d'un contact
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

router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const [result] = await db.query('DELETE FROM CONTACT WHERE id_contact = ?', [id]);
        console.log('id=',id);
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Contact non trouvé" });
        }
        res.json({ message: "Contact supprimé avec succès" });
    } catch (err) {
      console.error(err);
        res.status(500).json({ message: "Erreur lors de la suppression" });
    }
});


export default router;
