import { useState } from "react";
import { signup } from "../api/auth";
import { isValidEmail, isStrongPassword } from "../utils/validators";

function Signup() {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.fullName.trim()) {
      return setError("Full name is required");
    }
    if (!isValidEmail(form.email)) {
      return setError("Enter a valid email address");
    }
    if (!isStrongPassword(form.password)) {
      return setError("Password must be at least 6 characters");
    }

    try {
      setLoading(true);
      const res = await signup(form);
      localStorage.setItem("auth_token", res.data.token);
      alert("Signup successful");
    } catch (err) {
      setError(
        err.response?.data?.message || "Signup failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "40px auto" }}>
      <h2>Sign Up</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="fullName"
          placeholder="Full Name"
          value={form.fullName}
          onChange={handleChange}
          required
        />
        <br />
        <br />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        />
        <br />
        <br />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
        />
        <br />
        <br />

        <button type="submit" disabled={loading}>
          {loading ? "Creating account..." : "Sign Up"}
        </button>
      </form>
    </div>
  );
}

export default Signup;
