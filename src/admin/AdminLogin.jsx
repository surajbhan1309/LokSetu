import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginCitizen, signupCitizen } from "../services/api";
import { useAuth } from "../contexts/AuthContext";
import Input from "../components/Input";
import Button from "../components/Button";

const AdminLogin = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [authMode, setAuthMode] = useState("login");

  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!credentials.email || !credentials.password) {
      setError("Please enter both email and password");
      return;
    }

    if (authMode === "signup" && credentials.password !== credentials.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      if (authMode === "login") {
        const response = await loginCitizen(
          credentials.email.trim().toLowerCase(),
          credentials.password,
          "admin",
        );
        login(response.user);
        navigate("/admin/dashboard");
      } else {
        await signupCitizen(
          credentials.email.trim().toLowerCase(),
          credentials.password,
          "admin",
        );

        setSuccess("Admin account created. Please login to continue.");
        setAuthMode("login");
        setCredentials((prev) => ({ ...prev, password: "", confirmPassword: "" }));
      }
    } catch (err) {
      setError(err.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-8">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-kiosk-lg shadow-kiosk-xl p-12">
          <div className="text-center mb-8">
            <div className="text-5xl mb-4">🔐</div>
            <h1 className="text-kiosk-2xl font-bold text-gray-900 mb-2">
              Admin {authMode === "login" ? "Login" : "Sign Up"}
            </h1>
            <p className="text-kiosk-base text-gray-600">
              LokSetu Admin Dashboard
            </p>
          </div>

          <div className="mb-6 grid grid-cols-2 gap-3">
            <Button
              variant={authMode === "login" ? "primary" : "secondary"}
              size="medium"
              onClick={() => setAuthMode("login")}
              disabled={loading}
              fullWidth
            >
              Login
            </Button>
            <Button
              variant={authMode === "signup" ? "primary" : "secondary"}
              size="medium"
              onClick={() => setAuthMode("signup")}
              disabled={loading}
              fullWidth
            >
              Sign Up
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Email"
              type="email"
              value={credentials.email}
              onChange={(e) =>
                setCredentials({ ...credentials, email: e.target.value })
              }
              placeholder="Enter admin email"
              required
            />

            <Input
              label="Password"
              type="password"
              value={credentials.password}
              onChange={(e) =>
                setCredentials({ ...credentials, password: e.target.value })
              }
              placeholder="Enter password"
              required
            />

            {authMode === "signup" && (
              <Input
                label="Confirm Password"
                type="password"
                value={credentials.confirmPassword}
                onChange={(e) =>
                  setCredentials({ ...credentials, confirmPassword: e.target.value })
                }
                placeholder="Re-enter password"
                required
              />
            )}

            {error && (
              <div className="p-4 bg-red-50 border-2 border-red-200 rounded-kiosk">
                <p className="text-kiosk-base text-red-600 text-center">
                  {error}
                </p>
              </div>
            )}

            {success && (
              <div className="p-4 bg-green-50 border-2 border-green-200 rounded-kiosk">
                <p className="text-kiosk-base text-green-600 text-center">
                  {success}
                </p>
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              size="large"
              loading={loading}
              fullWidth
            >
              {authMode === "login" ? "Login" : "Sign Up"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-kiosk-sm text-gray-500">
              Login with your admin email & password
            </p>
          </div>

          <div className="mt-8 text-center">
            <button
              onClick={() => navigate("/")}
              className="text-primary-500 text-kiosk-base hover:underline"
            >
              ← Back to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
