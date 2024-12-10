/* eslint-disable */
import { useState } from 'react';
import { useRouter } from 'next/router';

export default function AddUser() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    /// Validation des champs obligatoires
    if (!firstName || !lastName) {
      setError('Le prénom et le nom sont obligatoires.');
      return;
    }

    ///On utilise la methode post pour ajouter l'utilisateur
    try {
      const response = await fetch('/api/users/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName,
          lastName,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Erreur inconnue');
      }

      // Une fois crée, redirection vers l'acceuil avec la liste des taches 

      router.push('/');
    } catch (err: any) {
      setError(err.message || 'Une erreur est survenue.');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-4">Ajouter un utilisateur</h1>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium mb-2">Prénom</label>
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="border border-gray-300 p-2 w-full rounded"
            placeholder="Prénom"
            required
          />
        </div>

        <div>
          <label className="block font-medium mb-2">Nom</label>
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="border border-gray-300 p-2 w-full rounded"
            placeholder="Nom"
            required
          />
        </div>

        <button
          type="submit"
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Ajouter l'utilisateur
        </button>
      </form>
    </div>
  );
}