import express from 'express';
import cors from 'cors';
import routeEntreprises from './routes/entreprise.js';
import routeContacts from './routes/contact.js';
import routeAdmin from'./routes/admin.js'
import routeTache from './routes/tache.js'

const app = express();
const PORT = process.env.PORT;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: "Backend JS en marche ! 🚀" });
});


app.use('/entreprises',routeEntreprises);

app.use('/contacts',routeContacts);
app.use('/admin',routeAdmin);
app.use('/taches',routeTache);


app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
});