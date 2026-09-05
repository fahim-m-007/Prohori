import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, ChevronDown } from "lucide-react";
import { useAuth } from "../context/AuthContext";

import "./Login.css";
import "./Signup.css";

function Signup() {
  const navigate = useNavigate();
  
  // Password states
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { register } = useAuth();

  // Thana Dropdown states
  const [thanaSearch, setThanaSearch] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const dropdownRef = useRef(null);
  const listRef = useRef(null);

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
        setHighlightedIndex(-1);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Scroll highlighted item into view
  useEffect(() => {
    if (isDropdownOpen && listRef.current && highlightedIndex >= 0) {
      const items = listRef.current.querySelectorAll(".custom-dropdown-item");
      if (items[highlightedIndex]) {
        items[highlightedIndex].scrollIntoView({ block: "nearest" });
      }
    }
  }, [highlightedIndex, isDropdownOpen]);

  const handleSelectThana = (thana) => {
    setThanaSearch(thana);
    setIsDropdownOpen(false);
    setHighlightedIndex(-1);
  };

  const handleThanaKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (!isDropdownOpen) {
        setIsDropdownOpen(true);
        setHighlightedIndex(0);
      } else if (filteredThanas.length > 0) {
        setHighlightedIndex((prev) => 
          prev < filteredThanas.length - 1 ? prev + 1 : 0
        );
      }
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (!isDropdownOpen) {
        setIsDropdownOpen(true);
        setHighlightedIndex(filteredThanas.length - 1);
      } else if (filteredThanas.length > 0) {
        setHighlightedIndex((prev) => 
          prev > 0 ? prev - 1 : filteredThanas.length - 1
        );
      }
    } else if (e.key === "Enter") {
      if (isDropdownOpen && filteredThanas.length > 0) {
        e.preventDefault();
        const selected = (highlightedIndex >= 0 && highlightedIndex < filteredThanas.length)
          ? filteredThanas[highlightedIndex]
          : filteredThanas[0];
        handleSelectThana(selected);
      } else if (isDropdownOpen && filteredThanas.length === 0) {
        e.preventDefault();
      }
    } else if (e.key === "Escape") {
      setIsDropdownOpen(false);
      setHighlightedIndex(-1);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (password.length < 8) return setError("Password must be at least 8 characters long.");
    if (password !== confirmPassword) return setError("Passwords do not match.");
    setError("");
    setSubmitting(true);
    try { await register({ name, email, password, thana: thanaSearch }); navigate("/dashboard", { replace: true }); }
    catch (requestError) { setError(requestError.response?.data?.message || "Unable to create your account. Try again."); }
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

      <div className="auth-card signup-card">

        <div className="auth-heading">
          <span>CREATE YOUR ACCOUNT</span>
          <h1>Join Prohori</h1>
          <p>Choose your area to see relevant safety reports.</p>
        </div>

        <form
          onSubmit={handleSubmit}
        >

          <div className="auth-field">
            <label htmlFor="name">Full name</label>
            <input
              id="name"
              type="text"
              placeholder="Enter your full name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
            />
          </div>

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

          <div className="auth-field" ref={dropdownRef} style={{ position: "relative" }}>
            <label htmlFor="thana">Select your Thana</label>
            <div className="dropdown-input-wrapper">
              <input 
                id="thana" 
                type="text"
                autoComplete="off"
                placeholder="Select or search Thana" 
                value={thanaSearch}
                onChange={(e) => {
                  setThanaSearch(e.target.value);
                  setIsDropdownOpen(true);
                  setHighlightedIndex(0);
                }}
                onFocus={() => {
                  setIsDropdownOpen(true);
                  if (highlightedIndex === -1 && filteredThanas.length > 0) {
                    setHighlightedIndex(0);
                  }
                }}
                onClick={() => setIsDropdownOpen(true)}
                onKeyDown={handleThanaKeyDown}
              />
              <button
                type="button"
                className="dropdown-toggle-button"
                onClick={() => {
                  setIsDropdownOpen((prev) => {
                    const nextState = !prev;
                    if (nextState) setHighlightedIndex(0);
                    return nextState;
                  });
                }}
                tabIndex={-1}
                aria-label="Toggle thana dropdown"
              >
                <ChevronDown size={16} className={`dropdown-chevron ${isDropdownOpen ? "open" : ""}`} />
              </button>
            </div>
            {isDropdownOpen && (
              <div className="custom-dropdown-menu" ref={listRef} role="listbox">
                {filteredThanas.length > 0 ? (
                  filteredThanas.map((thana, index) => (
                    <div 
                      key={thana} 
                      role="option"
                      aria-selected={highlightedIndex === index}
                      className={`custom-dropdown-item ${highlightedIndex === index ? "highlighted" : ""}`}
                      onMouseEnter={() => setHighlightedIndex(index)}
                      onClick={() => handleSelectThana(thana)}
                    >
                      {thana}
                    </div>
                  ))
                ) : (
                  <div className="custom-dropdown-empty">No thanas found</div>
                )}
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
                placeholder="Create a password (min. 8 characters)"
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

          <div className="auth-field">
            <label htmlFor="confirm-password">Confirm password</label>
            <div className="password-wrapper">
              <input
                id="confirm-password"
                className="password-input"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm your password (min. 8 characters)"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value || "")}
                minLength={8}
                required
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

          {error && <p className="auth-error" role="alert">{error}</p>}
          <button type="submit" className="auth-button" disabled={submitting}>
            {submitting ? "Creating account..." : "Create account"}
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
