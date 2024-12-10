/* eslint-disable */
import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (!id || Array.isArray(id)) {
    res.status(400).json({ error: 'ID invalide' });
    return;
  }



  /// RECUPERER LES INFORMATIONS D'UNE TACHE

  if (req.method === 'GET') {
    try {
      const task = await prisma.task.findUnique({
        where: { id: parseInt(id) },
        include: { user: true }, 
      });

      if (!task) {
        res.status(404).json({ error: 'Tâche introuvable' });
        return;
      }

      res.status(200).json(task);
    } catch (error) {
      res.status(500).json({ error: 'Erreur lors de la récupération de la tâche' });
    }
  }
  


  //MODIFIER UNE TACHE AVEC PUT


  else if (req.method === 'PUT') {
    try {
      const { name, status, userId } = req.body;

      const updatedTask = await prisma.task.update({
        where: { id: parseInt(id) },
        data: {
          name,
          status,
          userId: userId || null, 
        },
      });

      res.status(200).json(updatedTask);
    } catch (error) {
      res.status(500).json({ error: 'Erreur lors de la mise à jour de la tâche' });
    }
  } 
  






  /// METHODE POUR SUPPRIMER UNE TACHE
  else if (req.method === 'DELETE') {

    try {
     
      await prisma.task.delete({
        where: { id: parseInt(id) },
      });

      res.status(204).end(); 
    } catch (error) {
      res.status(500).json({ error: 'Erreur lors de la suppression de la tâche' });
    }
  } else {
    res.status(405).json({ error: 'Méthode non autorisée' });
  }
}