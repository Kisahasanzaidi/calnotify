import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.tsx";
import Login from "./components/Login.tsx";
import Register from "./components/Register.tsx";
import ProtectedRoute from "./components/ProtectedRoute.tsx";
import Header from "./components/Header.tsx";


const Dashboard: React.FC = () => {
  return (
    <div className="pt-32 min-h-screen bg-gray-50 flex flex-col items-center px-4">
      <div className="bg-white shadow-lg rounded-2xl p-10 w-full max-w-4xl">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Welcome to CalNotify Dashboard</h2>
        <p className="text-gray-600">
          Dashboard
        </p>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Header />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Login />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
