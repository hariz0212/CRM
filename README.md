# CRM API - Backend (Node.js / Express) 🚀

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-005C84?style=for-the-badge&logo=mysql&logoColor=white)

## 📋 Description

Ce projet constitue l'API (Backend) d'un système de Gestion de la Relation Client (CRM). Développé en **Node.js** et **Express**, il gère la logique métier, l'authentification des utilisateurs et la communication avec une base de données **MySQL**. 

L'API permet de manipuler les données liées aux administrateurs/utilisateurs, aux entreprises clientes, à leurs contacts associés, ainsi qu'au suivi des tâches.

## ✨ Fonctionnalités Principales

* **Authentification & Sécurité :** Connexion sécurisée avec hachage des mots de passe via `bcrypt`.
* **Gestion des Utilisateurs (`/admin`) :** Création et suppression de comptes, gestion des rôles (admin/user).
* **Gestion des Entreprises (`/entreprises`) :** CRUD complet sur les fiches entreprises, ajout de commentaires.
* **Gestion des Contacts (`/contacts`) :** Suivi des contacts liés aux entreprises et exportation des données.
* **Gestion des Tâches (`/taches`) :** Création et suivi de tâches (globales ou rattachées à un contact/entreprise spécifique).

## 🛠️ Prérequis

* [Node.js](https://nodejs.org/) (v18 ou supérieure recommandée)
* Un serveur **MySQL** actif.

## 🚀 Installation et Configuration

1. **Cloner le dépôt et accéder au dossier Backend :**
   ```bash
   git clone <URL_DU_REPO>
   cd Backend
