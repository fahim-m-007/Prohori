import { Link, useNavigate } from "react-router-dom";

import "./Login.css";

function Login() {
  const navigate = useNavigate();

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
          onSubmit={(event) => {
            event.preventDefault();
            navigate("/dashboard");
          }}
        >

          <div className="auth-field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              placeholder="Enter your email"
            />
          </div>

          <div className="auth-field">
            <div className="field-row">
              <label htmlFor="password">Password</label>

              <a href="#forgot" className="forgot-link">
                Forgot password?
              </a>
            </div>

            <input
              id="password"
              type="password"
              placeholder="Enter your password"
            />
          </div>

          <button type="submit" className="auth-button">
            Log in
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