import React from "react";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-purple-500 to-purple-800 text-white mt-16 hover:brightness-110 transition-all duration-500">
      
      <div className="max-w-7xl mx-auto px-8 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
   
        {/* Logo */}
        <div className="transform transition-all duration-700 hover:-translate-y-2">
          <h2 className="text-xl font-bold mb-3">
            MonBudget 💰
          </h2>
          <p className="text-sm text-purple-100">
            Gérez vos finances facilement et atteignez vos objectifs.
          </p>
        </div>

        {/* Liens */}
        <div className="transform transition-all duration-700 hover:-translate-y-2">
          <h3 className="font-semibold mb-3">Liens</h3>
          <ul className="space-y-2 text-sm">
            
            {["Accueil", "Budget", "Profil"].map((item, i) => (
              <li key={i} className="relative cursor-pointer group">
                <span className="group-hover:text-white transition">
                  {item}
                </span>
                <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-white transition-all duration-300 group-hover:w-full"></span>
              </li>
            ))}

          </ul>
        </div>

        {/* Contact */}
        <div className="transform transition-all duration-700 hover:-translate-y-2">
          <h3 className="font-semibold mb-3">Contact</h3>
          <p className="text-sm">📍 Montréal, Canada</p>
          <p className="text-sm">📧 MonBudget@gmail.com</p>
          <p className="text-sm">📞 +1 514 000 0000</p>
        </div>
      </div>

      <div className="text-center text-xs text-purple-200 border-t border-purple-400/30 py-4">
        © {new Date().getFullYear()} MonBudget — Tous droits réservés
      </div>

    </footer>
  );
}