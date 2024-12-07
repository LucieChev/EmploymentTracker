import express, { Request, Response } from 'express';
import Person from '../models/Person';
import Job from '../models/Job';
import { Op } from 'sequelize';

const router = express.Router();

/**
 * @swagger
 * /persons:
 *   post:
 *     summary: Créer une nouvelle personne
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstname:
 *                 type: string
 *               lastname:
 *                 type: string
 *               birthdate:
 *                 type: string
 *                 format: date
 *     responses:
 *       201:
 *         description: Personne créée avec succès
 *       400:
 *         description: Erreur de validation des données
 */
router.post('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const { firstname, lastname, birthdate } = req.body;
    const maxDate = new Date();
    maxDate.setFullYear(maxDate.getFullYear() - 150);

    if (new Date(birthdate) < maxDate) {
      res.status(400).json({ error: 'La date de naissance est trop ancienne.' });
      return;
    }

    const person = await Person.create({ firstname, lastname, birthdate });
    res.status(201).json(person);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

/**
 * @swagger
 * /persons:
 *   get:
 *     summary: Récupérer toutes les personnes avec leurs emplois
 *     responses:
 *       200:
 *         description: Liste des personnes avec leurs emplois
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Person'
 *       500:
 *         description: Erreur serveur
 */
router.get('/', async (req, res) => {
  try {
    const persons = await Person.findAll({
      include: [
        {
          model: Job,
          as: 'jobs',
        },
      ],
    });
    res.json(persons);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

/**
 * @swagger
 * /persons/{id}:
 *   get:
 *     summary: Récupérer les détails d'une personne avec ses emplois
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la personne
 *     responses:
 *       200:
 *         description: Détails de la personne
 *       404:
 *         description: Personne non trouvée
 *       500:
 *         description: Erreur serveur
 */
router.get('/:id', async (req: Request<{ id: string }>, res: Response): Promise<void> => {
  try {
    const id = req.params.id;
    const person = await Person.findOne({
      where: { id },
      include: {
        model: Job,
        as: 'jobs',
      },
    });
    if (!person) {
      res.status(404).json({ error: 'Personne non trouvée.' });
      return;
    }

    res.json(person);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

/**
 * @swagger
 * /persons/by-company/{company}:
 *   get:
 *     summary: Récupérer les personnes travaillant pour une entreprise spécifique
 *     parameters:
 *       - in: path
 *         name: company
 *         required: true
 *         schema:
 *           type: string
 *         description: Nom de l'entreprise
 *     responses:
 *       200:
 *         description: Liste des personnes travaillant pour l'entreprise
 *       500:
 *         description: Erreur serveur
 */
router.get('/by-company/:company', async (req: Request, res: Response): Promise<void> => {
  const { company } = req.params;

  try {
    const persons = await Person.findAll({
      include: [
        {
          model: Job,
          as: 'jobs',
          where: { company },
        },
      ],
    });

    if (persons.length === 0) {
      res.status(200).json({ message: 'Aucune personne trouvée pour cette entreprise.' });
    } else {
      res.status(200).json(persons);
    }
  } catch (error) {
    console.error('Erreur lors de la récupération des personnes :', error);
    res.status(500).json({ error: 'Erreur interne du serveur.' });
  }
});

/**
 * @swagger
 * /persons/{personId}/jobs:
 *   get:
 *     summary: Récupérer les emplois d'une personne pour une plage de dates
 *     parameters:
 *       - in: path
 *         name: personId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la personne
 *       - in: query
 *         name: startDate
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: Date de début
 *       - in: query
 *         name: endDate
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: Date de fin
 *     responses:
 *       200:
 *         description: Liste des emplois dans la plage de dates
 *       400:
 *         description: Dates non valides
 *       500:
 *         description: Erreur serveur
 */
router.get('/:personId/jobs', async (req: Request, res: Response): Promise<void> => {
  const { personId } = req.params;
  const { startDate, endDate } = req.query;

  if (!startDate || !endDate) {
    res.status(400).json({ error: 'Les deux dates (début et fin) sont obligatoires.' });
    return;
  }

  try {
    const jobs = await Job.findAll({
      where: {
        personId,
        [Op.and]: [
          { startDate: { [Op.lte]: new Date(endDate as string) } },
          {
            [Op.or]: [
              { endDate: { [Op.gte]: new Date(startDate as string) } },
              { endDate: null },
            ],
          },
        ],
      },
    });

    res.status(200).json(jobs);
  } catch (error) {
    console.error('Erreur lors de la récupération des emplois :', error);
    res.status(500).json({ error: 'Erreur interne du serveur.' });
  }
});

export default router;
