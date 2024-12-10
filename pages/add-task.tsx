/* eslint-disable */

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

type User = {
  id: number;
  firstName: string;
  lastName: string;
};

export default function AddTask() {
  const [name, setName] = useState('');
  const [status, setStatus] = useState('');
  const [userId, setUserId] = useState<number | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  /// On recupere tout les utilisateurs
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('/api/users');
        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des utilisateurs');
        }
        const data: User[] = await response.json();
        setUsers(data);
      } catch (err:any) {
        setError(err.message);
      }
    };

    fetchUsers();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    ///On valide les champs
    if (!name || !status) {
      setError('Le nom et le statut sont obligatoires.');
      return;
    }

    try {
      const response = await fetch('/api/tasks/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          status,
          userId: userId || null, // Peut etre vide avec le null
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Erreur inconnue');
      }

      // Redirige vers la liste des tâches après la création
      router.push('/');
    } catch (err: any) {
      setError(err.message || 'Une erreur est survenue.');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-4">Ajouter une nouvelle tâche</h1>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium mb-2">Nom de la tâche</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border border-gray-300 p-2 w-full rounded"
            placeholder="Nom de la tâche"
            required
          />
        </div>

        <div>
          <label className="block font-medium mb-2">Statut</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="border border-gray-300 p-2 w-full rounded"
            required
          >
            <option value="" disabled>
              Sélectionnez un statut
            </option>
            <option value="en cours">En cours</option>
            <option value="terminée">Terminée</option>
          </select>
        </div>

        <div>
          <label className="block font-medium mb-2">Utilisateur (optionnel)</label>
          <select
            value={userId || ''}
            onChange={(e) => setUserId(e.target.value ? parseInt(e.target.value) : null)}
            className="border border-gray-300 p-2 w-full rounded"
          >
            <option value="">-- Aucun utilisateur --</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.firstName} {user.lastName}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Ajouter la tâche
        </button>
      </form>
    </div>
  );
}