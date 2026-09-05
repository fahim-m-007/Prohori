import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "../context/AuthContext";

import "./Login.css";

function Login() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (password.length < 8) {
      return setError("Password must be at least 8 characters long.");
    }
    setError("");
    setSubmitting(true);
    try { await login({ email, password }); navigate("/dashboard", { replace: true }); }
    catch (requestError) { setError(requestError.response?.data?.message || "Unable to log in. Try again."); }
    finally { setSubmitting(false); }
  };

  return (
    <div className="auth-page">

      <div className="auth-brand">
        <Link to="/" className="auth-logo">
          <div className="auth-logo-mark">P</div>
          <span>PROHORI</span>
        </Link>
      </div>

      <div className="auth-card">

        <div className="auth-heading">
          <span>WELCOME BACK</span>
          <h1>Log in to Prohori</h1>
          <p>Stay informed about safety in your area.</p>
        </div>

        <form
          onSubmit={handleSubmit}
        >

          <div className="auth-field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>

          <div className="auth-field">
            <div className="field-row">
              <label htmlFor="password">Password</label>

              <a href="#forgot" className="forgot-link">
                Forgot password?
              </a>
            </div>

            <div className="password-wrapper">
              <input
                id="password"
                className="password-input"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password (min. 8 characters)"
                value={password}
                onChange={(e) => setPassword(e.target.value || "")}
                minLength={8}
                required
              />
              {password && password.length > 0 && (
                <button 
                  type="button" 
                  className="password-toggle" 
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              )}
            </div>
            <span className="auth-hint">Must be at least 8 characters</span>
          </div>

          {error && <p className="auth-error" role="alert">{error}</p>}
          <button type="submit" className="auth-button" disabled={submitting}>
            {submitting ? "Logging in..." : "Log in"}
          </button>

        </form>

        <p className="auth-switch">
          Not a user yet?
          <Link to="/signup"> Register</Link>
        </p>

      </div>

      <Link to="/" className="auth-back">
        ← Back to Prohori
      </Link>

    </div>
  );
}

export default Login;
