/* eslint-disable */

import { useEffect, useState } from 'react';
import Link from 'next/link';

type Task = {
  id: number;
  name: string;
  status: string;
  user: {
    id: number;
    firstName: string;
    lastName: string;
  } | null;
};

export default function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch('/api/tasks');
        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des tâches');
        }
        const data = await response.json();
        setTasks(data);
      } catch (err: any) {
        setError(err.message);
      }
    };

    fetchTasks();
  }, []);

  const deleteTask = async (taskId: number) => {
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Erreur lors de la suppression de la tâche');
      }
      setTasks(tasks.filter((task) => task.id !== taskId));
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="max-w-6xl mx-auto mt-10 p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
        Liste des Tâches
      </h1>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <div className="flex justify-between items-center mb-6">
        <div className="flex space-x-4">
          <Link
            href="/add-task"
            className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600 transition-all duration-200"
          >
            Ajouter une tâche
          </Link>
          <Link
            href="/add-user"
            className="bg-green-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-green-600 transition-all duration-200"
          >
            Ajouter un utilisateur
          </Link>
        </div>
        <p className="text-gray-600 italic">
          Cliquez sur "Modifier" ou "Supprimer" pour gérer vos tâches.
        </p>
      </div>

      <table className="w-full table-auto bg-white rounded-lg shadow-lg overflow-hidden">
        <thead className="bg-blue-100 text-gray-700">
          <tr>
            <th className="px-4 py-2 text-left">Nom de la tâche</th>
            <th className="px-4 py-2 text-left">Statut</th>
            <th className="px-4 py-2 text-left">Utilisateur</th>
            <th className="px-4 py-2 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => (
            <tr
              key={task.id}
              className="border-b hover:bg-gray-50 transition-all duration-200"
            >
              <td className="px-4 py-3">{task.name}</td>
              <td
                className={`px-4 py-3 ${
                  task.status === 'en cours'
                    ? 'text-yellow-600'
                    : 'text-green-600'
                } font-semibold`}
              >
                {task.status}
              </td>
              <td className="px-4 py-3">
                {task.user ? (
                  <span className="text-gray-700">
                    {task.user.firstName} {task.user.lastName}
                  </span>
                ) : (
                  <span className="text-gray-400 italic">Non attribuée</span>
                )}
              </td>
              <td className="px-4 py-3 text-center">
                <Link
                  href={`/edit-task/${task.id}`}
                  className="text-blue-500 hover:underline mr-4"
                >
                  Modifier
                </Link>
                <button
                  onClick={() => deleteTask(task.id)}
                  className="text-red-500 hover:text-red-700 transition-all duration-200"
                >
                  Supprimer
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {tasks.length === 0 && !error && (
        <p className="text-gray-500 text-center mt-6">
          Aucune tâche n'est disponible.
        </p>
      )}
    </div>
  );
}