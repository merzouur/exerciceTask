import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { name, status, userId } = req.body;

    // Validation des champs obligatoires
    if (!name || !status) {
      res.status(400).json({ error: 'Nom et statut sont obligatoires' });
      return;
    }

    try {
      const newTask = await prisma.task.create({
        data: {
          name,
          status,
          userId: userId || null, // Peut être null si aucun utilisateur n'est assigné
        },
      });

      res.status(201).json(newTask); // On renvoie la tache crée
    } catch (error) {
      console.error('Erreur lors de l\'ajout de la tâche :', error);
      res.status(500).json({ error: 'Erreur lors de l\'ajout de la tâche' });
    }
  } else {
    // Méthode non autorisée
    res.status(405).json({ error: 'Méthode non autorisée' });
  }
}