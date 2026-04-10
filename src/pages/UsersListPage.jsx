import { useEffect, useState } from "react";
import { getUserById } from "../services/api";

function User30Page() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchUser() {
      try {
        const data = await getUserById(33); // On teste l'utilisateur 30
        setUser(data);
      } catch (err) {
        console.error("Erreur récupération utilisateur:", err);
        setError("Impossible de récupérer l'utilisateur");
      } finally {
        setLoading(false);
      }
    }

    fetchUser();
  }, []);

  if (loading) return <p className="p-8">Chargement...</p>;
  if (error) return <p className="p-8 text-red-500">{error}</p>;

  return (
    <div className="p-8 min-h-screen bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">Utilisateur ID 30</h1>
      {user && (
        <div className="p-4 border rounded bg-white space-y-2">
          <p><strong>Prénom :</strong> {user.firstName}</p>
          <p><strong>Nom :</strong> {user.lastName}</p>
          <p><strong>Email :</strong> {user.email}</p>
          <p><strong>ID :</strong> {user.id}</p>
          <p><strong>Téléphone :</strong> {user.phone}</p>
          <p><strong>Date de naissance :</strong> {new Date(user.birthDate).toLocaleDateString()}</p>
          <p><strong>Actif :</strong> {user.isActive ? "Oui" : "Non"}</p>
        </div>
      )}
    </div>
  );
}

export default User30Page;