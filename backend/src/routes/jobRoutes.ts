import express from 'express';
import Job from '../models/Job';

const router = express.Router();

/**
 * @swagger
 * /jobs:
 *   post:
 *     summary: Créer un nouvel emploi
 *     description: Ajoute un nouvel emploi pour une personne donnée.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               company:
 *                 type: string
 *                 description: Nom de l'entreprise
 *                 example: "OpenAI"
 *               position:
 *                 type: string
 *                 description: Poste occupé
 *                 example: "Développeur Backend"
 *               startDate:
 *                 type: string
 *                 format: date
 *                 description: Date de début de l'emploi
 *                 example: "2023-01-01"
 *               endDate:
 *                 type: string
 *                 format: date
 *                 description: Date de fin de l'emploi (optionnelle)
 *                 example: "2023-12-31"
 *               personId:
 *                 type: string
 *                 description: ID de la personne associée à l'emploi
 *                 example: "123e4567-e89b-12d3-a456-426614174000"
 *     responses:
 *       201:
 *         description: Emploi créé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Job'
 *       400:
 *         description: Erreur lors de la validation ou de la création de l'emploi
 */
router.post('/', async (req, res) => {
  try {
    const { company, position, startDate, endDate, personId } = req.body;

    // Création d'un nouvel emploi
    const job = await Job.create({ company, position, startDate, endDate, personId });
    res.status(201).json(job);
  } catch (error) {
    // Gestion des erreurs
    res.status(400).json({ error: (error as Error).message });
  }
});

export default router;
