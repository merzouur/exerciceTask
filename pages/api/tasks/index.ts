import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const tasks = await prisma.task.findMany({
        include: { user: true }, // Inclut les informations de l'utilisateur assigné
      });
      res.status(200).json(tasks);
    } catch (error) {
      console.error('Erreur lors de la récupération des tâches :', error);
      res.status(500).json({ error: 'Erreur lors de la récupération des tâches' });
    }
  } else {
    // Méthode non autorisée
    res.status(405).json({ error: 'Méthode non autorisée' });
  }
}