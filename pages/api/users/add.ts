import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { firstName, lastName } = req.body;

    // Validation des champs obligatoires
    if (!firstName || !lastName) {
      res.status(400).json({ error: 'Le prénom et le nom sont obligatoires' });
      return;
    }

    try {
      const newUser = await prisma.user.create({
        data: {
          firstName,
          lastName,
        },
      });

      res.status(201).json(newUser)
    } catch (error) {
      console.error('Erreur lors de la création de l\'utilisateur :', error);
      res.status(500).json({ error: 'Erreur lors de la création de l\'utilisateur' });
    }
  } else {
    res.status(405).json({ error: 'Méthode non autorisée' });
  }
}