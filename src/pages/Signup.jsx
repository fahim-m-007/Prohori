import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

import "./Signup.css";

function Signup() {
  const navigate = useNavigate();
  
  // Password states
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");

  // Thana Dropdown states
  const [thanaSearch, setThanaSearch] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const thanaList = [
    "Adabor",
    "Airport / Bimanbandar",
    "Badda",
    "Banani",
    "Bangshal",
    "Bhashantek",
    "Cantonment",
    "Chalkbazar",
    "Dakshinkhan",
    "Darus-Salam",
    "Demra",
    "Dhanmondi",
    "Gandaria",
    "Gulshan",
    "Hatirjheel",
    "Hazaribagh",
    "Jatrabari",
    "Kadamtoli",
    "Kafrul",
    "Kalabagan",
    "Kamrangirchar",
    "Khilgaon",
    "Khilkhet",
    "Kotwali",
    "Lalbagh",
    "Mirpur Model",
    "Mohammadpur",
    "Motijheel",
    "Mugda",
    "New Market",
    "Pallabi",
    "Paltan Model",
    "Ramna Model",
    "Rampura",
    "Rupnagar",
    "Sabujbag",
    "Shah Ali",
    "Shahbag",
    "Shahjahanpur",
    "Sher-e-Bangla Nagar",
    "Shyampur",
    "Sutrapur",
    "Tejgaon",
    "Tejgaon Industrial Area",
    "Turag",
    "Uttarkhan",
    "Uttara East",
    "Uttara West",
    "Vatara",
    "Wari"
  ];

  const filteredThanas = thanaList.filter(t => 
    t.toLowerCase().includes(thanaSearch.toLowerCase())
  );

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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

        <form
          onSubmit={(event) => {
            event.preventDefault();
            navigate("/dashboard");
          }}
        >

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

          <div className="auth-field" ref={dropdownRef} style={{ position: "relative" }}>
            <label htmlFor="thana">Select your Thana</label>
            <input 
              id="thana" 
              type="text"
              autoComplete="off"
              placeholder="Type to search Thana" 
              value={thanaSearch}
              onChange={(e) => {
                setThanaSearch(e.target.value);
                setIsDropdownOpen(true);
              }}
              onFocus={() => setIsDropdownOpen(true)}
            />
            {isDropdownOpen && thanaSearch.length > 0 && filteredThanas.length > 0 && (
              <div className="custom-dropdown-menu">
                {filteredThanas.map(thana => (
                  <div 
                    key={thana} 
                    className="custom-dropdown-item"
                    onClick={() => {
                      setThanaSearch(thana);
                      setIsDropdownOpen(false);
                    }}
                  >
                    {thana}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="auth-field">
            <label htmlFor="password">Password</label>
            <div className="password-wrapper">
              <input
                id="password"
                className="password-input"
                type={showPassword ? "text" : "password"}
                placeholder="Create a password"
                onChange={(e) => setPassword(e.target.value || "")}
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
          </div>

          <div className="auth-field">
            <label htmlFor="confirm-password">Confirm password</label>
            <div className="password-wrapper">
              <input
                id="confirm-password"
                className="password-input"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm your password"
                onChange={(e) => setConfirmPassword(e.target.value || "")}
              />
              {confirmPassword && confirmPassword.length > 0 && (
                <button 
                  type="button" 
                  className="password-toggle" 
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              )}
            </div>
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
