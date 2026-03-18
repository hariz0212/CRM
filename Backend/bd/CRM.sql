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
    CFA ENUM ('Leem','Trans-faire','numiA') DEFAULT NULL,
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
    id_entreprise INT NULL,
    id_contact INT NULL, 
    PRIMARY KEY(id_tache),
    CONSTRAINT fk_tache_user FOREIGN KEY (id_user) REFERENCES USER(id_user),
    CONSTRAINT fk_tache_entreprise FOREIGN KEY (id_entreprise) REFERENCES ENTREPRISE(id_entreprise) ON DELETE CASCADE,
    CONSTRAINT fk_tache_contact FOREIGN KEY (id_contact) REFERENCES CONTACT(id_contact) ON DELETE SET NULL
);