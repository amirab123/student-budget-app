
import React from "react";
import { useNavigate } from "react-router-dom";

const ErrorPage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-800">
      <h1 className="text-6xl font-bold mb-4">404</h1>
      <p className="text-xl mb-6">Oups ! La page que vous cherchez n’existe pas.</p>
      <button
        onClick={() => navigate("/")} 
        className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all duration-300"
      >
        Retour à l'accueil
      </button>
    </div>
  );
};

export default ErrorPage;