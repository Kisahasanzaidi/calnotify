import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext.tsx";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../api/auth.ts";
import { LoginRequest } from "../api/type.ts";
import { Form, Input, Button, Typography, Alert, Spin, message } from "antd";

const { Text, Link } = Typography;

const Login: React.FC = () => {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const auth = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async (values: LoginRequest) => {
    setError("");
    setLoading(true);
    try {
      const data = await loginUser(values);
      auth?.login(data.token, data.userId);
      message.success("Login successful");
      navigate("/calendar");
    } catch {
      setError("Invalid credentials or server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 pt-32">
      <div className="bg-white shadow-lg rounded-2xl p-10 max-w-md w-full">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Login to CalNotify</h2>

        {error && <Alert message={error} type="error" showIcon className="mb-4" />}

        <Form layout="vertical" onFinish={handleLogin} autoComplete="off" className="flex flex-col gap-4">
          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, message: "Please input your email!" }]}
          >
            <Input placeholder="Email" disabled={loading} />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input.Password placeholder="Password" disabled={loading} />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block disabled={loading}>
              {loading ? <Spin size="small" /> : "Login"}
            </Button>
          </Form.Item>
        </Form>

        <Text className="text-center text-gray-500 mt-6">
          Don't have an account?{" "}
          <Link onClick={() => navigate("/register")}>Register</Link>
        </Text>
      </div>
    </div>
  );
};

export default Login;
