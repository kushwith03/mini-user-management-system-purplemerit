import React, { useState, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../auth/AuthContext";
import { validateEmail, validatePassword, validateFullName } from "../utils/validators";
import Card from "../components/Card";
import styles from "./Signup.module.css";

const Signup = () => {
  const [formData, setFormData] = useState({ fullName: "", email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const auth = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleBlur = (e) => {
    const { id, value } = e.target;
    let error = "";
    if (id === "fullName") error = validateFullName(value);
    if (id === "email") error = validateEmail(value);
    if (id === "password") error = validatePassword(value);
    setErrors(prev => ({ ...prev, [id]: error }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {
      fullName: validateFullName(formData.fullName),
      email: validateEmail(formData.email),
      password: validatePassword(formData.password),
    };
    setErrors(newErrors);
    
    const isSubmittable = Object.values(newErrors).every(err => !err);
    if (!isSubmittable) return;

    setLoading(true);
    try {
      await auth.signup(formData);
      toast.success("Signup successful! Welcome.");
      navigate("/");
    } catch (err) {
      const message = err.response?.data?.message || "Signup failed. Please try again.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card title="Create an Account">
      <form onSubmit={handleSubmit} className={styles.form} noValidate>
        <div className={styles.inputGroup}>
          <label htmlFor="fullName">Full Name</label>
          <input
            type="text"
            id="fullName"
            value={formData.fullName}
            onChange={handleChange}
            onBlur={handleBlur}
            required
            placeholder="John Doe"
            aria-describedby="fullName-error"
          />
          <div id="fullName-error" className={styles.errorText} aria-live="polite">
            {errors.fullName}
          </div>
        </div>
        <div className={styles.inputGroup}>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={formData.email}
            onChange={handleChange}
            onBlur={handleBlur}
            required
            placeholder="you@example.com"
            aria-describedby="email-error"
          />
          <div id="email-error" className={styles.errorText} aria-live="polite">
            {errors.email}
          </div>
        </div>
        <div className={styles.inputGroup}>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={formData.password}
            onChange={handleChange}
            onBlur={handleBlur}
            required
            minLength="6"
            placeholder="Minimum 6 characters"
            aria-describedby="password-error"
          />
          <div id="password-error" className={styles.errorText} aria-live="polite">
            {errors.password}
          </div>
        </div>
        <button type="submit" disabled={loading} className={`${styles.submitButton} button-primary`}>
          {loading ? "Creating account..." : "Sign Up"}
        </button>
      </form>
      <p className={styles.footerText}>
        Already have an account? <Link to="/login">Log in</Link>
      </p>
    </Card>
  );
};

export default Signup;
