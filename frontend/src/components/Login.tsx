import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext.tsx";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../api/auth.ts";
import { LoginRequest } from "../api/type.ts";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const auth = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();
  setError("");
  const payload: LoginRequest = { email, password };
  try {
    const data = await loginUser(payload);
    auth?.login(data.token, data.userId);
    navigate("/calendar"); 
  } catch {
    setError("Invalid credentials or server error");
  }
};

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 pt-32">
      <div className="bg-white shadow-lg rounded-2xl p-10 max-w-md w-full">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Login to CalNotify</h2>

        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}

        <form className="flex flex-col gap-4" onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
          <button className="mt-2 bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition">
            Login
          </button>
        </form>

        <p className="text-center text-gray-500 mt-6">
          Don't have an account?{" "}
          <span onClick={() => navigate("/register")} className="text-indigo-600 cursor-pointer hover:underline">
            Register
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;
