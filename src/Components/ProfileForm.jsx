import { useState } from "react";
import { signupUser, getProfile } from "../services/api";
import { useNavigate } from "react-router-dom";

function ProfilePage() {
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [userData, setUserData] = useState(null); 
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setIsError(false);

    try {

      const data = await signupUser(firstName, email, password);

   
      localStorage.setItem("token", data.token);
      localStorage.setItem("userId", data.user.id);

  
      setMessage("Compte créé avec succès !");
      setIsError(false);

   
      const profile = await getProfile();
      setUserData(profile);

    } catch (err) {
      setMessage(err.message || "Erreur lors de l'inscription");
      setIsError(true);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-100">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4 text-center">Inscription</h1>

        {message && (
          <p className={`text-center mb-4 ${isError ? "text-red-500" : "text-green-500"}`}>
            {message}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Votre prénom</label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Votre courriel</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Mot de passe</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-purple-500 text-white rounded py-2 mt-2 hover:bg-purple-600 transition"
          >
            S’inscrire
          </button>
        </form>

     
        {userData && (
          <div className="mt-6 p-4 border border-gray-200 rounded bg-gray-50">
            <h2 className="font-bold mb-2">Profil créé :</h2>
            <p><strong>Prénom :</strong> {userData.firstName}</p>
            <p><strong>Email :</strong> {userData.email}</p>
            <p><strong>ID :</strong> {userData.id}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProfilePage;