import express from 'express';
import cors from 'cors';
import sequelize from './config/database';
import { setupSwagger } from './swagger';
import personRoutes from './routes/personRoutes';
import jobRoutes from './routes/jobRoutes';
import Person from './models/Person';
import Job from './models/Job';
import dotenv from "dotenv";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],}));

app.use(express.json());
app.use('/persons', personRoutes);
app.use('/jobs', jobRoutes);

app.use((err: any, req: any, res : any, next : any) => {
  console.error(err.stack);
  res.status(500).send('Erreur interne du serveur.');
});

app.get('/', (req, res) => {
  res.send('Bienvenue sur le serveur Express !');
});

// Synchroniser les modèles avec la base de données
(async () => {
  try {
    await sequelize.authenticate();
    console.log('Connexion à la base de données réussie.');

    await sequelize.sync({alter: true});
    console.log('Les modèles sont synchronisés avec la base de données.');
  } catch (error) {
    console.error('Erreur de connexion ou de synchronisation :', error);
  }
})();

app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
  console.log(`Documentation Swagger : http://localhost:${PORT}/api-docs`);
});

// Swagger setup
setupSwagger(app);
