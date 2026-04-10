import React, { useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Sidebar from "./Components/Sidebar.jsx";
import Header from "./Components/Header.jsx";

import ProfilePage from "./pages/ProfilePage.jsx";
import HomePage from "./pages/HomePage.jsx";
import BudgetPage from "./pages/BudgetPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import UpdateProfile from "./pages/UpdateProfile.jsx";
import ErrorPage from "./pages/ErrorPage.jsx";

import { UserProvider, UserContext } from "./context/UserContext.jsx";


const PrivateRoute = ({ children }) => {
  const { user } = useContext(UserContext);
  return user ? children : <Navigate to="/connexion" replace />;
};

function AppContent() {
  const { user } = useContext(UserContext);

  return (
    <div className="flex h-screen">

      {user && <Sidebar />}

      <main className="flex-1 flex flex-col overflow-auto bg-gray-50">
  
        <Header />

        <div className="p-6 flex-1 overflow-auto">
          <Routes>
      
            <Route path="/" element={<HomePage />} />
            <Route path="/connexion" element={<LoginPage />} />
            <Route path="/inscription" element={<ProfilePage />} />

     
            <Route
              path="/budget"
              element={
                <PrivateRoute>
                  <BudgetPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/updateProfil"
              element={
                <PrivateRoute>
                  <UpdateProfile />
                </PrivateRoute>
              }
            />

     
            <Route path="*" element={<ErrorPage />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}

function App() {
  return (
    <UserProvider>
      <AppContent />
    </UserProvider>
  );
}

export default App;