import React, { useState, useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext.jsx";
import HomeIcon from "../assets/icons/home (3).png";
import BudgetIcon from "../assets/icons/dollar-symbol (1).png";
import ProfileIcon from "../assets/icons/profile.png";
import LogoutIcon from "../assets/icons/logout2.png";

const Sidebar = () => {
  const { user, logout } = useContext(UserContext); // <-- utilise logout du contexte
  const location = useLocation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(true);
  const [showToast, setShowToast] = useState(false);

  if (!user || location.pathname === "/connexion") return null;

  const navItems = [
    { icon: HomeIcon, path: "/dashboard", label: "Accueil" },
    { icon: BudgetIcon, path: "/budget", label: "Budget" },
    { icon: ProfileIcon, path: "/updateProfil", label: "Profil" },
  ];

  const handleLogout = () => {
    logout(); // <-- supprime user et localStorage
    setShowToast(true);

    setTimeout(() => {
      setShowToast(false);
      navigate("/connexion"); // redirection après le toast
    }, 1500);
  };

  return (
    <div
      className={`flex flex-col ${isOpen ? "w-64" : "w-20"} h-screen p-4 bg-gradient-to-b from-purple-600 via-purple-700 to-purple-800 text-white shadow-lg transition-all duration-300`}
    >
      <div className="flex flex-col items-center mb-6">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 rounded hover:bg-purple-500/50 transition-all duration-300 shadow-md"
        >
          <span className="text-2xl">☰</span>
        </button>
      </div>

      <div className="flex flex-col items-center justify-center flex-1 space-y-6">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center ${isOpen ? "justify-start pl-4" : "justify-center"} h-12 w-full rounded-lg transition-all duration-300 shadow-md hover:shadow-xl hover:bg-purple-500/30 ${
              location.pathname === item.path ? "bg-purple-900 shadow-inner" : ""
            }`}
            title={item.label}
          >
            <img src={item.icon} alt={item.label} className="h-6 w-6" />
            {isOpen && <span className="ml-4">{item.label}</span>}
          </Link>
        ))}
      </div>

      <div className="flex flex-col items-center mt-4">
        <button
          onClick={handleLogout}
          className={`flex items-center ${isOpen ? "justify-start pl-4" : "justify-center"} h-12 w-full rounded-lg hover:bg-purple-500/30 transition-all duration-300 shadow-md`}
          title="Déconnexion"
        >
          <img src={LogoutIcon} alt="Déconnexion" className="h-6 w-6" />
          {isOpen && <span className="ml-4">Déconnexion</span>}
        </button>
      </div>

      {showToast && (
        <div className="fixed bottom-4 right-4 bg-purple-700 text-white px-4 py-2 rounded shadow-lg">
          Déconnexion réussie !
        </div>
      )}
    </div>
  );
};

export default Sidebar;