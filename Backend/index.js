import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/api/test', (req, res) => {
  res.json({ message: "Backend JS en marche ! 🚀" });
});

app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
});