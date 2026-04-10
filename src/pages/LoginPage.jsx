import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import { getUserByEmail } from '../services/api';
 
function LoginPage() {
  const { login } = useContext(UserContext);
  const navigate = useNavigate();
 
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
 
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
 
    if (!email || !password) {
      setError('Tous les champs sont obligatoires');
      return;
    }
 
    try {
      const userData = await getUserByEmail(email);
 
      if (userData.password !== password) {
        setError('Mot de passe incorrect ❌');
        return;
      }
 
      login({
        id: userData.id,
        firstName: userData.firstName,
        email: userData.email,
      });
 
      navigate('/budget');
    } catch (err) {
      console.error(err);
      setError('Utilisateur introuvable ❌');
    }
  };
 
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md" noValidate>
        <h2 className="text-2xl font-bold text-center mb-4">Connexion</h2>
 
        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
 
        <input type="email" placeholder="Email" className="w-full mb-3 p-2 border rounded-md" value={email} onChange={(e) => setEmail(e.target.value)} />
 
        <input type="password" placeholder="Mot de passe" className="w-full mb-3 p-2 border rounded-md" value={password} onChange={(e) => setPassword(e.target.value)} />
 
        <button
          type="submit"
          className="w-full py-2 rounded-lg bg-gradient-to-r from-purple-600 via-purple-700 to-purple-800 text-white font-semibold shadow-lg hover:brightness-110 transition duration-300">
          Se connecter
        </button>
 
        <Link to="/inscription" className="text-purple-600 text-sm mt-3 text-center block">
          Pas de compte ? S’inscrire
        </Link>
      </form>
    </div>
  );
}
 
export default LoginPage;
 

 