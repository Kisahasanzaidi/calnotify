import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../api/auth.ts";
import { RegisterRequest } from "../api/type.ts";
import { Form, Input, Button, Typography, Alert, message, Spin } from "antd";

const { Text, Link } = Typography;

const Register: React.FC = () => {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (values: RegisterRequest) => {
    setError("");
    setLoading(true);
    try {
      await registerUser(values);
      message.success("Registration successful! Please login.");
      navigate("/login");
    } catch {
      setError("Error registering user");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 pt-32">
      <div className="bg-white shadow-lg rounded-2xl p-10 max-w-md w-full">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Create Your Account
        </h2>

        {error && <Alert message={error} type="error" showIcon className="mb-4" />}

        <Form layout="vertical" onFinish={handleRegister} autoComplete="off" className="flex flex-col gap-4">
          <Form.Item
            label="Full Name"
            name="name"
            rules={[{ required: true, message: "Please input your full name!" }]}
          >
            <Input placeholder="Full Name" disabled={loading} />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Please input your email!" },
              { type: "email", message: "Please enter a valid email!" },
            ]}
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
              {loading ? <Spin size="small" /> : "Register"}
            </Button>
          </Form.Item>
        </Form>

        <Text className="text-center text-gray-500 mt-6">
          Already have an account?{" "}
          <Link onClick={() => navigate("/login")}>Login</Link>
        </Text>
      </div>
    </div>
  );
};

export default Register;
