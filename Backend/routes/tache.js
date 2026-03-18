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
    const sql='SELECT * FROM TACHE where id_user=? and id_entreprise=? and id_contact=?';
    try {
        const [rows]=await db.query(sql,[id_user,id_entreprise,id]);
        res.status(200).json(rows);
    } catch (err) {
        console.log(err);
        res.status(500).json({message:'erreur serveur'});

        
    }

});

router.put('/:id', async(req,res)=>{
    const{id}=req.params;
    const{libelle_tache}=req.body;
    const sql = "UPDATE TACHE SET libelle_tache = ? WHERE id_tache = ?";
    try {
        await db.query(sql,[libelle_tache,id]);
        res.status(200).json({message:'modification commentaire niveau base de donné'});
    } catch (err) {
        console.log(err)
        res.status(501).json({message:'erreur modification commentaire niveau base de donné'});       
    }
})
router.get('/user/:id', async (req, res) => {
    const { id } = req.params;

    try {
        // 🌟 LA REQUÊTE SQL MAGIQUE AVEC LES LEFT JOIN 🌟
        const sql = `
            SELECT 
                t.*, 
                e.nom AS entreprise_nom, 
                c.nom AS contact_nom,
                c.prenom AS contact_prenom
            FROM TACHE t
            LEFT JOIN ENTREPRISE e ON t.id_entreprise = e.id_entreprise
            LEFT JOIN CONTACT c ON t.id_contact = c.id_contact
            WHERE t.id_user = ?
            ORDER BY t.date_heure_rappel ASC
        `;
        
        const [taches] = await db.query(sql, [id]);
        res.status(200).json(taches);

    } catch (err) {
        console.error("Erreur récupération de toutes les tâches :", err);
        res.status(500).json({ error: "Erreur lors de la récupération du tableau de bord" });
    }
});

// 🌟 NOUVELLE ROUTE : Récupérer uniquement les tâches globales d'un utilisateur
router.get('/globales/:id_user', async (req, res) => {
    const { id_user } = req.params;

    try {
        // La magie est ici : on demande à MySQL les tâches de l'user où l'entreprise ET le contact sont NULL
        const sql = `
            SELECT * FROM TACHE 
            WHERE id_user = ? 
            AND id_entreprise IS NULL 
            AND id_contact IS NULL 
            ORDER BY date_heure_rappel ASC
        `;
        
        const [taches] = await db.query(sql, [id_user]);
        res.status(200).json(taches);

    } catch (err) {
        console.error("Erreur récupération tâches globales :", err);
        res.status(500).json({ error: "Erreur lors de la récupération des tâches" });
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

    // ✅ CORRECTION 1 : L'entreprise n'est plus obligatoire !
    if (!libelle_tache || !id_user) {
        return res.status(400).json({ message: "Champs obligatoires manquants" });
    }

    const sql = `
        INSERT INTO TACHE 
        (date_heure_rappel, libelle_tache, statut_tache, id_user, id_entreprise, id_contact) 
        VALUES (?, ?, ?, ?, ?, ?)
    `;

    try {
        // ✅ CORRECTION 2 : On force la valeur NULL pour SQL si c'est vide
        const entrepriseId = id_entreprise || null; 
        const contactId = id_contact || null;
        
        const [result] = await db.query(sql, [
            date_heure_rappel, 
            libelle_tache, 
            statut_tache, 
            id_user, 
            entrepriseId, // 👈 On utilise la variable "propre" ici
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