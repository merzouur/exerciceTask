/* eslint-disable */
import { TurboTasks } from 'next/dist/build/swc/generated-native';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

type User = {
  id: number;
  firstName: string;
  lastName: string;
};

type Task = {
  id: number;
  name: string;
  status: string;
  userId: number | null;
};

export default function EditTask() {
  const router = useRouter();
  const { id } = router.query; /// On recupere l'id de la tache à modifier

  const [task, setTask] = useState<Task | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);


  useEffect(() => {
    const fetchTask = async () => {
      if (!id) return; // Attendre que l'ID soit disponible

      try {
        const response = await fetch(`/api/tasks/${id}`);
        if (!response.ok) {
          throw new Error('Erreur lors de la récupération de la tâche');
        }
        const data:Task = await response.json();
        setTask(data);
      } catch (err: any) {
        setError(err.message);
      }
    };

    fetchTask();
  }, [id]);

  // Chargement des utilisateurs pour assigner la tache à un utilisateur
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('/api/users');
        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des utilisateurs');
        }
        const data:User[] = await response.json();
        setUsers(data);
      } catch (err: any) {
        setError(err.message);
      }
    };

    fetchUsers();
  }, []);

  // Formulaire
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!task) {
      setError('Les données de la tâche sont introuvables.');
      return;
    }

    try {
      const response = await fetch(`/api/tasks/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: task.name,
          status: task.status,
          userId: task.userId || null,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Erreur lors de la mise à jour');
      }

      router.push('/'); 
    } catch (err: any) {
      setError(err.message || 'Une erreur est survenue.');
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    if (!task) return;

    const { name, value } = e.target;
    setTask({
      ...task,
      [name]: name === 'userId' ? (value ? parseInt(value) : null) : value,
    });
  };

  if (!task) return <p>Chargement...</p>;

  return (
    <div className="max-w-md mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-4">Modifier la tâche</h1>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium mb-2">Nom de la tâche</label>
          <input
            type="text"
            name="name"
            value={task.name}
            onChange={handleChange}
            className="border border-gray-300 p-2 w-full rounded"
            placeholder="Nom de la tâche"
            required
          />
        </div>

        <div>
          <label className="block font-medium mb-2">Statut</label>
          <select
            name="status"
            value={task.status}
            onChange={handleChange}
            className="border border-gray-300 p-2 w-full rounded"
            required
          >
            <option value="en cours">En cours</option>
            <option value="terminée">Terminée</option>
          </select>
        </div>

        <div>
          <label className="block font-medium mb-2">Utilisateur (optionnel)</label>
          <select
            name="userId"
            value={task.userId || ''}
            onChange={handleChange}
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
          Enregistrer les modifications
        </button>
      </form>
    </div>
  );
}