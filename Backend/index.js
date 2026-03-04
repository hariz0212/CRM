import express from 'express';
import cors from 'cors';
import routeEntreprises from './routes/entreprise.js';
import routeContacts from './routes/contact.js';
import routeAdmin from'./routes/admin.js'

const app = express();
const PORT = process.env.PORT || 5050;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: "Backend JS en marche ! 🚀" });
});


app.use('/entreprises',routeEntreprises);

app.use('/contacts',routeContacts);
app.use('/admin',routeAdmin);

app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
});