import React, { useState } from "react";
import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Alert,
  InputAdornment,
  IconButton,
  Grid,
  Divider,
  Checkbox,
  FormControlLabel
} from "@mui/material";
import { useNavigate, Link } from "react-router-dom";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import api from "../../services/api";
import "./Auth.css";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Call backend API to authenticate user
      const response = await api.post("/auth/login", {
        email: email,
        password: password
      });

      // Store token and user info from backend
      const userRole = response.data.user?.role || "user";
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      if (rememberMe) {
        localStorage.setItem("rememberMe", "true");
      }

      // Redirect based on role
      if (userRole === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/user/home");
      }

    } catch (err) {
      console.error("Login error:", err);
      setError(err.response?.data?.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, var(--gray-50) 0%, var(--gray-100) 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        py: 4
      }}
      className="auth-container"
    >
      <Container maxWidth="sm">
        <Grid container spacing={0}>
          {/* LOGIN FORM */}
          <Grid item xs={12}>
            <Paper
              elevation={2}
              sx={{
                p: { xs: 3, sm: 4 },
                borderRadius: 3,
                background: "var(--white)"
              }}
              className="auth-card"
            >
              {/* HEADER */}
              <Box sx={{ textAlign: "center", mb: 4 }}>
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: "800",
                    color: "var(--primary)",
                    mb: 1
                  }}
                >
                  Nexora
                </Typography>
                <Typography sx={{ fontSize: "15px", color: "var(--gray-600)" }}>
                  Sign in to your account
                </Typography>
              </Box>

              {/* ERROR MESSAGE */}
              {error && (
                <Alert
                  severity="error"
                  sx={{
                    mb: 3,
                    borderRadius: 2,
                    backgroundColor: "rgba(239, 68, 68, 0.08)",
                    color: "var(--error)",
                    "& .MuiAlert-icon": {
                      color: "var(--error)"
                    },
                    border: "1px solid rgba(239, 68, 68, 0.2)"
                  }}
                >
                  {error}
                </Alert>
              )}

              <form onSubmit={handleLogin}>
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
                    Email
                  </Typography>
                  <TextField
                    type="email"
                    fullWidth
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <EmailIcon sx={{ color: "var(--gray-400)", mr: 1 }} />
                        </InputAdornment>
                      )
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "8px",
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

                {/* PASSWORD FIELD */}
                <Box sx={{ mb: 3 }}>
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
                    type={showPassword ? "text" : "password"}
                    fullWidth
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LockIcon sx={{ color: "var(--gray-400)", mr: 1 }} />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={handleClickShowPassword}
                            onMouseDown={handleMouseDownPassword}
                            edge="end"
                            sx={{ color: "var(--gray-400)" }}
                            size="small"
                          >
                            {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                          </IconButton>
                        </InputAdornment>
                      )
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "8px",
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

                {/* REMEMBER ME & FORGOT PASSWORD */}
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 3
                  }}
                >
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        size="small"
                        sx={{
                          color: "var(--primary)",
                          "&.Mui-checked": {
                            color: "var(--primary)"
                          }
                        }}
                      />
                    }
                    label={
                      <Typography sx={{ fontSize: "14px", color: "var(--gray-600)" }}>
                        Remember me
                      </Typography>
                    }
                  />
                  <Link
                    to="/forgot-password"
                    style={{
                      textDecoration: "none",
                      color: "var(--primary)",
                      fontSize: "13px",
                      fontWeight: 600
                    }}
                  >
                    Forgot password?
                  </Link>
                </Box>

                {/* LOGIN BUTTON */}
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  size="large"
                  disabled={loading}
                  sx={{
                    background: "var(--primary)",
                    color: "white",
                    py: 1.4,
                    fontWeight: "600",
                    borderRadius: "8px",
                    textTransform: "none",
                    fontSize: "15px",
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
                  {loading ? "Signing in..." : "Sign In"}
                </Button>
              </form>

              {/* DIVIDER */}
              <Divider sx={{ my: 3, borderColor: "var(--gray-200)" }} />

              {/* SIGNUP LINK */}
              <Box sx={{ textAlign: "center" }}>
                <Typography sx={{ fontSize: "13px", color: "var(--gray-600)", mb: 2 }}>
                  Don't have an account?
                </Typography>
                <Link
                  to="/signup"
                  style={{ textDecoration: "none" }}
                >
                  <Button
                    fullWidth
                    variant="outlined"
                    sx={{
                      borderColor: "var(--primary)",
                      color: "var(--primary)",
                      fontWeight: "600",
                      borderRadius: "8px",
                      textTransform: "none",
                      "&:hover": {
                        backgroundColor: "rgba(30, 64, 175, 0.05)",
                        borderColor: "var(--primary)"
                      }
                    }}
                  >
                    Create Account
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

export default Login;
