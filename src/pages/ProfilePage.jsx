import { useState, useContext } from 'react';
import { signupUser } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';

function EyeIcon({ open }) {
  return open ? (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
      <path d="M10 4.5c-4 0-7 4-7 4s3 4 7 4 7-4 7-4-3-4-7-4zM10 11a2 2 0 110-4 2 2 0 010 4z" />
    </svg>
  ) : (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 3l18 18M10 4.5c-4 0-7 4-7 4s3 4 7 4c1.7 0 3.2-.7 4.3-1.8M14.7 9.3a2 2 0 11-2.7-2.7" />
    </svg>
  );
}

export default function ProfilePage() {
  const { login } = useContext(UserContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({}); // <-- pour les messages d'erreur

  const passwordCriteria = {
    length: formData.password.length >= 8,
    uppercase: /[A-Z]/.test(formData.password),
    lowercase: /[a-z]/.test(formData.password),
    number: /\d/.test(formData.password),
  };
  const strength = Object.values(passwordCriteria).filter(Boolean).length;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' }); 
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  const { firstName, email, password, confirmPassword } = formData;

  let newErrors = {};

  // Vérifier si tous les champs sont vides
  if (!firstName && !email && !password && !confirmPassword) {
    setErrors({ general: 'Veuillez remplir tous les champs avant de continuer.' });
    return;
  }

  // Validation individuelle
  if (!firstName) newErrors.firstName = 'Le prénom est requis';
  else if (firstName.length < 3) newErrors.firstName = 'Le prénom doit contenir au moins 3 caractères';

  if (!email) newErrors.email = 'Le courriel est requis';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) newErrors.email = 'Email invalide';

  if (!password) newErrors.password = 'Le mot de passe est requis';
  else if (!passwordCriteria.length)
    newErrors.password = 'Le mot de passe doit contenir au moins 8 caractères';
  else if (!passwordCriteria.uppercase || !passwordCriteria.lowercase || !passwordCriteria.number)
    newErrors.password = 'Le mot de passe doit contenir 1 majuscule, 1 minuscule et 1 chiffre';

  if (!confirmPassword) newErrors.confirmPassword = 'Veuillez confirmer le mot de passe';
  else if (password !== confirmPassword) newErrors.confirmPassword = 'Les mots de passe ne correspondent pas';

  // Si erreurs, afficher et arrêter
  if (Object.keys(newErrors).length > 0) {
    setErrors(newErrors);
    return;
  }

  setLoading(true);
  try {
    const payload = { firstName, email, password, isActive: true, phone: '' };
    const data = await signupUser(payload);

    if (data.error === 'EMAIL_EXISTS') {
      setErrors({ email: 'Cet email est déjà utilisé' });
      return;
    }

    login({ id: data.id, firstName: data.firstName, email: data.email });
    navigate('/updateProfil', { state: { welcomeMessage: `Bienvenue ${data.firstName} !` } });
  } catch (err) {
    console.error('Erreur signup:', err);
    if (err?.response?.status === 409) {
      setErrors({ general: "Ce courriel est déjà utilisé." });
    } else {
      setErrors({ general: 'Une erreur est survenue. Veuillez réessayer.' });
    }
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white rounded-xl shadow-xl p-6 sm:p-8 w-full max-w-md mx-2">
        <h1 className="text-2xl font-bold mb-2 text-center">Inscription</h1>
        <p className="text-center mb-6 text-gray-600">
          Commencez à budgetter en quelques secondes! 💰
        </p>

        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          <div>
            <label className="block mb-1 font-medium">Votre prénom :</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
            />
            {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
          </div>

          <div>
            <label className="block mb-1 font-medium">Votre courriel :</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>

          <div>
            <label className="block mb-1 font-medium">Mot de passe :</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                <EyeIcon open={showPassword} />
              </button>
            </div>
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}

            {/* Barre dynamique */}
            {formData.password.length > 0 && (
              <div className="mt-2">
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${
                      strength <= 2
                        ? 'bg-red-500'
                        : strength === 3
                        ? 'bg-yellow-500'
                        : 'bg-green-500'
                    }`}
                    style={{ width: `${(strength / 4) * 100}%` }}
                  ></div>
                </div>
                <p className="text-sm mt-1">
                  {strength <= 2 && <span className="text-red-500">Mot de passe faible</span>}
                  {strength === 3 && <span className="text-yellow-500">Mot de passe moyen</span>}
                  {strength === 4 && <span className="text-green-600">Mot de passe fort</span>}
                </p>
              </div>
            )}
          </div>

          <div>
            <label className="block mb-1 font-medium">Confirmer mot de passe :</label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none pr-10"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                <EyeIcon open={showConfirmPassword} />
              </button>
            </div>
            {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
          </div>

          {errors.general && <p className="text-red-500 text-center">{errors.general}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 mt-4 rounded-lg bg-gradient-to-r from-purple-600 via-purple-700 to-purple-800 text-white font-semibold shadow-lg hover:brightness-110 transition duration-300"
          >
            {loading ? 'Inscription...' : 'S’inscrire'}
          </button>
        </form>
      </div>
    </div>
  );
}