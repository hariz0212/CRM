import db from '../bd/db.js';
import express from 'express';

const router=express.Router();



router.get('/entreprise/:id', async (req, res) => {
    const { id } = req.params; // C'est l'id_entreprise
    const id_user = req.headers['id_user'];

    // On sélectionne tout de tache (t.*) et on ajoute le nom/prénom du contact (c.nom, c.prenom)
    const sql = `
        SELECT t.*, c.nom AS contact_nom, c.prenom AS contact_prenom 
        FROM TACHE t
        LEFT JOIN CONTACT c ON t.id_contact = c.id_contact
        WHERE t.id_user = ? AND t.id_entreprise = ?
        ORDER BY t.date_heure_rappel DESC
    `;

    try {
        const [rows] = await db.query(sql, [id_user, id]);
        res.status(200).json(rows);
    } catch (err) {
        console.error("Erreur SQL Tâches Entreprise:", err);
        res.status(500).json({ message: 'erreur serveur' });
    }
});

router.get('/contact/:id',async(req,res)=>{

    const{id}=req.params;
    const id_user=req.headers['id_user'];
    const id_entreprise=req.headers['id_entreprise'];
    const sql='SELECT * FROM tache where id_user=? and id_entreprise=? and id_contact=?';
    try {
        const [rows]=await db.query(sql,[id_user,id_entreprise,id]);
        res.status(200).json(rows);
    } catch (err) {
        console.log(err);
        res.status(500).json({message:'erreur serveur'});

        
    }

});

router.get('/user/:id',async (req,res) => {
    const{id}=req.params;
    const sql=`SELECT t.*, e.nom as entreprise_nom, c.nom as contact_nom, c.prenom as contact_prenom FROM TACHE t JOIN ENTREPRISE e ON t.id_entreprise = e.id_entreprise LEFT JOIN CONTACT c ON t.id_contact = c.id_contact WHERE t.id_user = ?`
    try {
        const[rows]= await db.query(sql,[id]);
        res.status(200).json(rows);
    } catch (err) {
        console.log(err);
        res.status(500).json({message:'erreur serveur'});
    }
});

// Route pour ajouter une nouvelle tâche
router.post('/', async (req, res) => {
    const { 
        date_heure_rappel, 
        libelle_tache, 
        statut_tache, 
        id_user, 
        id_entreprise, 
        id_contact 
    } = req.body;

    // Validation simple
    if (!libelle_tache || !id_user || !id_entreprise) {
        return res.status(400).json({ message: "Champs obligatoires manquants" });
    }

    const sql = `
        INSERT INTO TACHE 
        (date_heure_rappel, libelle_tache, statut_tache, id_user, id_entreprise, id_contact) 
        VALUES (?, ?, ?, ?, ?, ?)
    `;

    try {
        // Si id_contact est vide ou undefined, on force la valeur NULL pour SQL
        const contactId = id_contact || null;
        
        const [result] = await db.query(sql, [
            date_heure_rappel, 
            libelle_tache, 
            statut_tache, 
            id_user, 
            id_entreprise, 
            contactId
        ]);

        res.status(201).json({ 
            message: "Tâche créée avec succès", 
            id_tache: result.insertId 
        });
    } catch (err) {
        console.error("Erreur insertion tâche:", err);
        res.status(500).json({ message: "Erreur lors de la création de la tâche" });
    }
});

export default router;