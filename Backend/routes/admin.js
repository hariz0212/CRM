import express from 'express';

import db from '../bd/db.js';
import bcrypt from 'bcrypt';

const router=express.Router();

router.get('/',async (req,res)=>{
    try {
        const sql='SELECT id_user,nom,prenom,email,identifiant,role FROM USER';
        const [rows]=await db.query(sql);
        res.status(200).json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({message:'erreur serveur'});
    }

});

router.post('/',async (req,res)=>{
    const{identifiant,mdp}=req.body;
    try{
        const sql='SELECT * from USER WHERE identifiant=?';

        const[rows]=await db.query(sql,[identifiant]);
        if (rows.length === 0) {
            return res.status(401).json({ message: "Identifiant incorrect" });
        }

        const user=rows[0];

            const match = await bcrypt.compare(mdp, user.mdp);

        if (match) {
            // C'est bon ! On prépare l'objet session sans le MDP
            const { mdp, ...userWithoutPassword } = user; 
            res.json(userWithoutPassword);
        } else {
            // Mot de passe faux
            res.status(401).json({ message: "mot de passe incorrect" });
        }
            

    }catch(err){
        res.status(500).json({message:'erreur serveur'})

    }
});

router.post('/addUser',async (req,res)=>{
    try {
        const{nom,prenom,email,identifiant,mdp,role}=req.body

        const sql='INSERT INTO USER(nom,prenom,email,identifiant,mdp,role)VALUES(?,?,?,?,?,?)';
        const hashedmdp= await bcrypt.hash(mdp,10);

        await db.query(sql,[nom,prenom,email,identifiant,hashedmdp,role]);
        res.status(200).json({message:'insertion réussi'});


    } catch (err) {
        console.error(err);
        res.status(500).json({message:'erreur serveur'});
        
    }
})

router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    
    // Sécurité : On empêche de supprimer l'ID 1 (ton compte admin principal)
    if (id === "1") {
        return res.status(403).json({ message: "Impossible de supprimer l'administrateur racine" });
    }

    try {
        // Option "Radicale" : On nettoie tout ce qui appartient à cet utilisateur
        // Étape A : Supprimer les contacts des entreprises de cet utilisateur
        await db.query(`
            DELETE FROM CONTACT 
            WHERE id_entreprise IN (SELECT id_entreprise FROM ENTREPRISE WHERE id_user = ?)
        `, [id]);

        // Étape B : Supprimer les entreprises de l'utilisateur
        await db.query('DELETE FROM ENTREPRISE WHERE id_user = ?', [id]);

        // Étape C : Enfin, supprimer l'utilisateur
        await db.query('DELETE FROM USER WHERE id_user = ?', [id]);

        res.json({ message: "Utilisateur et toutes ses données supprimés" });
    } catch (err) {
        res.status(500).json({ message: "Erreur lors de la suppression de l'utilisateur" });
    }
});


export default router;