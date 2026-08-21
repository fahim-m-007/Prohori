import { Link } from "react-router-dom";

import "./Signup.css";

function Signup() {
  return (
    <div className="auth-page">

      <div className="auth-brand">
        <Link to="/" className="auth-logo">
          <div className="auth-logo-mark">P</div>
          <span>PROHORI</span>
        </Link>
      </div>

      <div className="auth-card signup-card">

        <div className="auth-heading">
          <span>CREATE YOUR ACCOUNT</span>
          <h1>Join Prohori</h1>
          <p>Choose your area to see relevant safety reports.</p>
        </div>

        <form>

          <div className="auth-field">
            <label htmlFor="name">Full name</label>
            <input
              id="name"
              type="text"
              placeholder="Enter your full name"
            />
          </div>

          <div className="auth-field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              placeholder="Enter your email"
            />
          </div>

          <div className="auth-field">
            <label htmlFor="thana">Select your Thana</label>

            <select id="thana" defaultValue="">
              <option value="" disabled>
                Choose a Thana
              </option>

              <option value="dhanmondi">Dhanmondi Thana</option>
              <option value="mirpur">Mirpur Thana</option>
              <option value="gulshan">Gulshan Thana</option>
              <option value="uttara">Uttara Thana</option>
              <option value="ramna">Ramna Thana</option>
              <option value="tejgaon">Tejgaon Thana</option>
            </select>
          </div>

          <div className="auth-field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              placeholder="Create a password"
            />
          </div>

          <div className="auth-field">
            <label htmlFor="confirm-password">Confirm password</label>
            <input
              id="confirm-password"
              type="password"
              placeholder="Confirm your password"
            />
          </div>

          <button type="submit" className="auth-button">
            Create account
          </button>

        </form>

        <p className="auth-switch">
          Already a user?
          <Link to="/login"> Log in</Link>
        </p>

      </div>

      <Link to="/" className="auth-back">
        ← Back to Prohori
      </Link>

    </div>
  );
}

export default Signup;
