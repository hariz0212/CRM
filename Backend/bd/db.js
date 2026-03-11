import mysql from 'mysql2/promise';
import 'dotenv/config';

const db= mysql.createPool({
    host:process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PSSWD,
    database: process.env.DB_DATABASE,
    waitForConnections:true,
    connectionLimit:10,
    queueLimit:0,
    ssl: { rejectUnauthorized: false }
});

db.getConnection()
    .then(()=>console.log('connecter a mysql'))
    .catch((err)=>console.error('erreur lors de la connexion a mysql :',err));

export default db;




