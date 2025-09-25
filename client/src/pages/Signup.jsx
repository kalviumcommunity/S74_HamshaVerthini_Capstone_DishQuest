/* eslint-disable no-unused-vars */
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Auth.css";

const Signup = () => {
  const [formData, setFormData] = useState({
    username: "Hamsha",
    email: "hamsha@gmail.com",
    password: "123456",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    // Hardcoded user data
    const user = {
      id: "dummy-id",
      username: formData.username,
      email: formData.email,
    };
    localStorage.setItem("token", "dummy-token");
    localStorage.setItem("user", JSON.stringify(user));
    setTimeout(() => {
      setLoading(false);
      navigate("/browse");
    }, 500);
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-card">
          <h1>Create Account</h1>
          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Username</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
            >
              {loading ? "Creating Account..." : "Sign Up"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
