import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../assets/icons/logo.png";
import UserIcon from "../assets/icons/user (1).png";
import { UserContext } from "../context/UserContext";
 
const Header = () => {
  const { user, logout } = useContext(UserContext);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
 

  const isLoggedIn = user && user.firstName;
 
  const handleLogout = () => {
    logout();             
    setMenuOpen(false);   
    navigate("/connexion");
  };
 
  const styles = {
    header: "bg-white shadow-md px-6 py-4",
    container: "flex items-center justify-between",
    logo: "flex items-center gap-2",
    title: "text-xl font-bold text-gray-800",
    menuDesktop: "hidden md:flex items-center gap-3",
    btn: "bg-purple-500 text-white px-4 py-1 rounded-md hover:bg-purple-600 transition",
    btnRed: "bg-red-500 text-white px-4 py-1 rounded-md hover:bg-red-600 transition",
    userBox:
      "flex items-center gap-2 border px-3 py-1 rounded-md hover:bg-gray-100 transition cursor-pointer",
    burger: "md:hidden text-2xl",
    mobileMenu: "md:hidden mt-4 flex flex-col gap-3 border-t pt-4",
  };
 
  return (
    <header className={styles.header}>
      <div className={styles.container}>
    
        <Link
          to="/"
          className="flex items-center"
          onClick={() => setMenuOpen(false)}
        >
          <img src={Logo} alt="Logo MonBudget" className="w-8 h-8 mr-2" />
          <h1 className={styles.title}>MonBudget</h1>
        </Link>
 
  
        <div className={styles.menuDesktop}>
          {!isLoggedIn ? (
            <>
              <Link to="/inscription" className={styles.btn}>
                Inscription
              </Link>
              <Link to="/connexion" className={styles.btn}>
                Connexion
              </Link>
            </>
          ) : (
            <>
              <Link to="/updateProfil" className={styles.userBox}>
                <img
                  src={UserIcon}
                  alt="Profil utilisateur"
                  className="w-6 h-6"
                />
                <span>{user.firstName}</span>
              </Link>
 
              <button onClick={handleLogout} className={styles.btnRed}>
                Déconnexion
              </button>
            </>
          )}
        </div>
 
        {/* Burger */}
        <button
          className={styles.burger}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </button>
      </div>
 
      {/* Mobile */}
      {menuOpen && (
        <div className={styles.mobileMenu}>
          {!isLoggedIn ? (
            <>
              <Link
                to="/inscription"
                className={styles.btn}
                onClick={() => setMenuOpen(false)}
              >
                Inscription
              </Link>
              <Link
                to="/connexion"
                className={styles.btn}
                onClick={() => setMenuOpen(false)}
              >
                Connexion
              </Link>
            </>
          ) : (
            <>
              <Link
              to="/updateProfil"
           
             
                className={styles.userBox}
                onClick={() => setMenuOpen(false)}
              >
                <img
                  src={UserIcon}
                  alt="Profil utilisateur"
                  className="w-6 h-6"
                />
                <span>{user.firstName}</span>
              </Link>
 
              <button onClick={handleLogout} className={styles.btnRed}>
                Déconnexion
              </button>
            </>
          )}
        </div>
      )}
    </header>
  );
};
 
export default Header;