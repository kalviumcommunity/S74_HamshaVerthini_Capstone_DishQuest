import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import "./Auth.css";

const Signup = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const trimmedData = {
        username: formData.username.trim(),
        email: formData.email.trim(),
        password: formData.password.trim(),
      };

      const response = await axios.post(
        "http://localhost:5000/api/auth/signup",
        trimmedData
      );

      const { token, user } = response.data;

      if (token && user) {
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
      }

      setFormData({ username: "", email: "", password: "" });

      // ✅ Popup with buttons
      const result = await Swal.fire({
        icon: "success",
        title: `🎉 Welcome, ${formData.username}!`,
        text: "Your account has been created successfully.",
        showCancelButton: true,
        confirmButtonText: "Start Exploring Recipes",
        cancelButtonText: "Set Up Profile",
      });
      
      if (result.isConfirmed) {
        navigate("/browse");
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        navigate("/profile");
      }

      // else they stay where they are

    } catch (err) {
      console.error("Signup error:", err);
      setError(err.response?.data?.message || "Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
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

          <p className="switch-text">
            Already have an account?{" "}
            <span onClick={() => navigate("/login")} className="link">
              Login
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
