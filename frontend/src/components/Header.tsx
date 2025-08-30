import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext.tsx";
import { useNavigate } from "react-router-dom";

const Header: React.FC = () => {
  const auth = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    auth?.logout();
    navigate("/login");
  };

  return (
    <header className="w-full bg-white shadow-md fixed top-0 left-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between py-4 px-6">
        <h1
          className="text-2xl font-bold text-indigo-600 cursor-pointer"
          onClick={() => navigate(auth?.token ? "/dashboard" : "/login")}
        >
          CalNotify
        </h1>
        <nav className="space-x-4">
          {!auth?.token ? (
            <>
              <span
                className="text-gray-600 hover:text-indigo-600 cursor-pointer transition"
                onClick={() => navigate("/login")}
              >
                Login
              </span>
              <span
                className="text-gray-600 hover:text-indigo-600 cursor-pointer transition"
                onClick={() => navigate("/register")}
              >
                Register
              </span>
            </>
          ) : (
            <>
              <span
                className="text-gray-600 hover:text-indigo-600 cursor-pointer transition"
                onClick={() => navigate("/dashboard")}
              >
                Dashboard
              </span>
              <span
                className="text-gray-600 hover:text-red-600 cursor-pointer transition"
                onClick={handleLogout}
              >
                Logout
              </span>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
