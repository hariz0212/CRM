-- 1. Suppression (ordre inverse pour respecter les clés étrangères)
DROP TABLE IF EXISTS TACHE;
DROP TABLE IF EXISTS CONTACT;
DROP TABLE IF EXISTS ENTREPRISE;
DROP TABLE IF EXISTS USER;

-- 2. Création des tables
CREATE TABLE USER (
    id_user INT AUTO_INCREMENT,
    nom VARCHAR(50) NOT NULL,
    prenom VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    identifiant VARCHAR(50) UNIQUE NOT NULL,
    mdp VARCHAR(255) NOT NULL,
    role ENUM('admin', 'user') DEFAULT 'user',
    PRIMARY KEY(id_user)
);

CREATE TABLE ENTREPRISE (
    id_entreprise INT AUTO_INCREMENT,
    nom VARCHAR(100) NOT NULL,
    type_entreprise VARCHAR(50),
    SIRET VARCHAR(14),
    secteur VARCHAR(100),
    siteweb VARCHAR(255),
    telephone VARCHAR(20),
    rue VARCHAR(255),
    ville VARCHAR(100),
    code_postal VARCHAR(10), 
    statut_contact ENUM('À contacter', 'En cours', 'Urgent') DEFAULT 'À contacter',
    commentaire TEXT, -- Ajouté ici
    date_derniere_action DATE,
    id_user INT NOT NULL, 
    PRIMARY KEY(id_entreprise),
    CONSTRAINT fk_entreprise_user FOREIGN KEY (id_user) REFERENCES USER(id_user)
);

CREATE TABLE CONTACT (
    id_contact INT AUTO_INCREMENT,
    nom VARCHAR(100) NOT NULL,
    prenom VARCHAR(100),
    fonction VARCHAR(100),
    telephone VARCHAR(20),
    email VARCHAR(250) UNIQUE,
    linkedin VARCHAR(255),
    statut_contact ENUM('À contacter', 'En cours', 'Urgent') DEFAULT 'À contacter',
    commentaire TEXT, -- Ajouté ici
    id_entreprise INT NOT NULL,
    date_derniere_action DATE,
    PRIMARY KEY(id_contact),
    CONSTRAINT fk_contact_entreprise FOREIGN KEY (id_entreprise) REFERENCES ENTREPRISE(id_entreprise) ON DELETE CASCADE
);

CREATE TABLE TACHE (
    id_tache INT AUTO_INCREMENT,
    date_heure_rappel DATETIME NOT NULL, 
    libelle_tache VARCHAR(255) NOT NULL,
    statut_tache ENUM('À contacter', 'En cours', 'Urgent') DEFAULT 'À contacter',
    id_user INT NOT NULL,
    id_entreprise INT NOT NULL,
    id_contact INT NULL, 
    PRIMARY KEY(id_tache),
    CONSTRAINT fk_tache_user FOREIGN KEY (id_user) REFERENCES USER(id_user),
    CONSTRAINT fk_tache_entreprise FOREIGN KEY (id_entreprise) REFERENCES ENTREPRISE(id_entreprise) ON DELETE CASCADE,
    CONSTRAINT fk_tache_contact FOREIGN KEY (id_contact) REFERENCES CONTACT(id_contact) ON DELETE SET NULL
);

-- 3. INSERTS DE TEST (Vérifiés)
/**INSERT INTO USER (nom, prenom, email, identifiant, mdp, role) 
VALUES ('hariz', 'piratheepan', 'harizsan38@gmail.com', 'harsan02', '$2b$10$qCc//l1oOpMisgzgX.sB/uIh1ow8kc25QHUHFD3fvSIw0ZmuxboKy', 'admin');

INSERT INTO ENTREPRISE (nom, type_entreprise, SIRET, secteur, statut_contact, commentaire, id_user) 
VALUES 
('Mairie de Bobigny', 'Secteur Public', '21930008600019', 'Administration', 'À contacter', 'Partenaire historique pour les stages de com.', 1),
('Boulangerie du Centre', 'Artisan', '12398745600012', 'Alimentaire', 'En cours', 'Demande un stagiaire pour la vente.', 1),
('Innov''Tech 93', 'Startup', '45612378900055', 'Technologie', 'Urgent', 'Grosse recherche de développeurs.', 1);

INSERT INTO CONTACT (nom, prenom, fonction, statut_contact, commentaire, id_entreprise)
VALUES 
('Hallyday', 'Johnny', 'Directeur Artistique', 'Urgent', 'Ne pas appeler avant 11h.', 2),
('Piaf', 'Édith', 'Chargée de Com', 'En cours', 'Ancienne élève de l IUT.', 1);

INSERT INTO TACHE (date_heure_rappel, libelle_tache, statut_tache, id_entreprise, id_user, id_contact)
VALUES 
('2024-05-21 09:00:00', 'Signer contrat partenariat', 'Urgent', 3, 1, 1), 
('2024-05-22 14:30:00', 'Relance téléphonique', 'En cours', 1, 1, NULL),
('2024-05-25 10:00:00', 'Envoyer invitation', 'À contacter', 2, 1, 2);

/**DELETE FROM TACHE WHERE id_tache IN (1, 2, 3, 4);
DELETE FROM CONTACT WHERE id_contact IN (1, 2, 3);
DELETE FROM ENTREPRISE WHERE id_entreprise IN (1, 2, 3);
**/

**/