import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  InputAdornment,
  IconButton,
  Alert,
  Grid,
  Divider,
  FormControlLabel,
  Checkbox
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import api from "../../services/api";
import "./Auth.css";

function Signup() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState("user");
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    if (!acceptTerms) {
      setError("Please accept terms and conditions");
      return;
    }

    setLoading(true);

    try {
      // Call backend API to register user with role
      const response = await api.post("/auth/register", {
        name: name,
        email: email,
        password: password,
        role: role
      });

      // Store token and user info from backend
      const userRole = response.data.user?.role || role;
      localStorage.setItem("token", response.data.token || "user-token-" + Date.now());
      localStorage.setItem("user", JSON.stringify({
        id: response.data.user?.id || Math.random(),
        name: response.data.user?.name || name,
        email: response.data.user?.email || email,
        role: userRole
      }));

      setSuccess("Account created successfully! Redirecting...");

      // Redirect based on role
      setTimeout(() => {
        if (userRole === "admin") {
          navigate("/admin/dashboard");
        } else {
          navigate("/user/home");
        }
      }, 1500);

    } catch (err) {
      console.error("Signup error:", err);
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, var(--gray-50) 0%, var(--gray-100) 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        py: 4,
        position: "relative",
        overflow: "hidden"
      }}
      className="auth-container"
    >

      <Container maxWidth="sm" sx={{ position: "relative", zIndex: 1 }}>
        <Grid container spacing={0}>
          {/* SIGNUP FORM */}
          <Grid item xs={12}>
            <Paper
              elevation={2}
              sx={{
                p: { xs: 3, sm: 4 },
                borderRadius: 2,
                background: "#ffffff",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)"
              }}
              className="auth-card"
            >
              {/* HEADER */}
              <Box sx={{ textAlign: "center", mb: 4 }}>
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 800,
                    color: "var(--primary)",
                    mb: 1
                  }}
                >
                  Nexora
                </Typography>
                <Typography color="var(--gray-600)" sx={{ fontSize: "14px" }}>
                  Create your account
                </Typography>
              </Box>

              {/* ERROR MESSAGE */}
              {error && (
                <Alert
                  severity="error"
                  sx={{
                    mb: 3,
                    borderRadius: 1,
                    backgroundColor: "rgba(239, 68, 68, 0.08)",
                    color: "var(--error)",
                    border: "1px solid rgba(239, 68, 68, 0.2)",
                    "& .MuiAlert-icon": {
                      color: "var(--error)"
                    }
                  }}
                >
                  {error}
                </Alert>
              )}

              {/* SUCCESS MESSAGE */}
              {success && (
                <Alert
                  severity="success"
                  sx={{
                    mb: 3,
                    borderRadius: 1,
                    backgroundColor: "rgba(16, 185, 129, 0.08)",
                    color: "var(--success)",
                    border: "1px solid rgba(16, 185, 129, 0.2)",
                    display: "flex",
                    alignItems: "center",
                    gap: 1
                  }}
                  icon={<CheckCircleIcon sx={{ color: "var(--success)" }} />}
                >
                  {success}
                </Alert>
              )}

              <form onSubmit={handleSignup}>
                {/* NAME FIELD */}
                <Box sx={{ mb: 2.5 }}>
                  <Typography
                    sx={{
                      fontSize: "13px",
                      fontWeight: 600,
                      mb: 1,
                      color: "var(--gray-900)"
                    }}
                  >
                    Full Name
                  </Typography>
                  <TextField
                    fullWidth
                    placeholder="Enter your full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 1,
                        backgroundColor: "var(--gray-50)",
                        transition: "all 0.2s ease",
                        "& fieldset": {
                          borderColor: "var(--gray-200)"
                        },
                        "&:hover fieldset": {
                          borderColor: "var(--gray-300)"
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: "var(--primary)",
                          boxShadow: "0 0 0 3px rgba(30, 64, 175, 0.08)"
                        }
                      }
                    }}
                  />
                </Box>

                {/* EMAIL FIELD */}
                <Box sx={{ mb: 2.5 }}>
                  <Typography
                    sx={{
                      fontSize: "13px",
                      fontWeight: 600,
                      mb: 1,
                      color: "var(--gray-900)"
                    }}
                  >
                    Email Address
                  </Typography>
                  <TextField
                    fullWidth
                    placeholder="Enter your email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 1,
                        backgroundColor: "var(--gray-50)",
                        transition: "all 0.2s ease",
                        "& fieldset": {
                          borderColor: "var(--gray-200)"
                        },
                        "&:hover fieldset": {
                          borderColor: "var(--gray-300)"
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: "var(--primary)",
                          boxShadow: "0 0 0 3px rgba(30, 64, 175, 0.08)"
                        }
                      }
                    }}
                  />
                </Box>

                {/* ROLE SELECTION */}
                <Box sx={{ mb: 2.5 }}>
                  <Typography
                    sx={{
                      fontSize: "13px",
                      fontWeight: 600,
                      mb: 1,
                      color: "var(--gray-900)"
                    }}
                  >
                    Select Role
                  </Typography>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "12px",
                      borderRadius: "4px",
                      border: "1px solid var(--gray-200)",
                      backgroundColor: "var(--gray-50)",
                      fontSize: "14px",
                      cursor: "pointer",
                      fontFamily: "inherit"
                    }}
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </Box>

                {/* PASSWORD FIELD */}
                <Box sx={{ mb: 2.5 }}>
                  <Typography
                    sx={{
                      fontSize: "13px",
                      fontWeight: 600,
                      mb: 1,
                      color: "var(--gray-900)"
                    }}
                  >
                    Password
                  </Typography>
                  <TextField
                    fullWidth
                    placeholder="Enter your password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowPassword(!showPassword)}
                            edge="end"
                            sx={{ color: "var(--gray-600)" }}
                            size="small"
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      )
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 1,
                        backgroundColor: "var(--gray-50)",
                        transition: "all 0.2s ease",
                        "& fieldset": {
                          borderColor: "var(--gray-200)"
                        },
                        "&:hover fieldset": {
                          borderColor: "var(--gray-300)"
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: "var(--primary)",
                          boxShadow: "0 0 0 3px rgba(30, 64, 175, 0.08)"
                        }
                      }
                    }}
                  />
                  <Typography sx={{ fontSize: "12px", color: "var(--gray-600)", mt: 0.5 }}>
                    At least 6 characters
                  </Typography>
                </Box>

                {/* CONFIRM PASSWORD FIELD */}
                <Box sx={{ mb: 3 }}>
                  <Typography
                    sx={{
                      fontSize: "13px",
                      fontWeight: 600,
                      mb: 1,
                      color: "var(--gray-900)"
                    }}
                  >
                    Confirm Password
                  </Typography>
                  <TextField
                    fullWidth
                    placeholder="Re-enter your password"
                    type={showPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 1,
                        backgroundColor: "var(--gray-50)",
                        transition: "all 0.2s ease",
                        "& fieldset": {
                          borderColor: "var(--gray-200)"
                        },
                        "&:hover fieldset": {
                          borderColor: "var(--gray-300)"
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: "var(--primary)",
                          boxShadow: "0 0 0 3px rgba(30, 64, 175, 0.08)"
                        }
                      }
                    }}
                  />
                </Box>

                {/* TERMS & CONDITIONS */}
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={acceptTerms}
                      onChange={(e) => setAcceptTerms(e.target.checked)}
                      sx={{
                        color: "var(--primary)",
                        "&.Mui-checked": {
                          color: "var(--primary)"
                        }
                      }}
                    />
                  }
                  label={
                    <Typography sx={{ fontSize: "13px", color: "var(--gray-700)" }}>
                      I agree to{" "}
                      <span style={{ color: "var(--primary)", fontWeight: 600 }}>
                        terms & conditions
                      </span>
                    </Typography>
                  }
                  sx={{ mb: 3 }}
                />

                {/* SIGNUP BUTTON */}
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  size="large"
                  disabled={loading}
                  sx={{
                    backgroundColor: "var(--primary)",
                    py: 1.5,
                    fontWeight: 700,
                    borderRadius: 1,
                    textTransform: "none",
                    fontSize: "16px",
                    transition: "all 0.2s ease",
                    "&:hover": {
                      backgroundColor: "var(--primary-dark)",
                      boxShadow: "0 4px 12px rgba(30, 64, 175, 0.2)"
                    },
                    "&:disabled": {
                      opacity: 0.6
                    }
                  }}
                >
                  {loading ? "Creating Account..." : "Create Account"}
                </Button>
              </form>

              {/* DIVIDER */}
              <Divider sx={{ my: 3, backgroundColor: "var(--gray-200)" }} />

              {/* LOGIN LINK */}
              <Box sx={{ textAlign: "center" }}>
                <Typography sx={{ fontSize: "14px", color: "var(--gray-700)", mb: 1 }}>
                  Already have an account?
                </Typography>
                <Link
                  to="/"
                  style={{ textDecoration: "none" }}
                >
                  <Button
                    fullWidth
                    variant="outlined"
                    sx={{
                      borderColor: "var(--primary)",
                      color: "var(--primary)",
                      fontWeight: 600,
                      borderRadius: 1,
                      textTransform: "none",
                      "&:hover": {
                        backgroundColor: "rgba(30, 64, 175, 0.04)",
                        borderColor: "var(--primary)"
                      }
                    }}
                  >
                    Login
                  </Button>
                </Link>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

export default Signup;
