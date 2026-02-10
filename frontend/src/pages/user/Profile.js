import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Avatar,
  TextField,
  Button,
  Snackbar,
  Alert,
  Divider
} from "@mui/material";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

function Profile() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [userId, setUserId] = useState(null);

  const [open, setOpen] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user") || "null");
    if (storedUser) {
      setUserId(storedUser.id || null);
      setName(storedUser.name || "");
      setEmail(storedUser.email || "");

      if (storedUser.id) {
        const storedProfile = JSON.parse(localStorage.getItem(`profile_${storedUser.id}`) || "null");
        if (storedProfile) {
          setPhone(storedProfile.phone || "");
          setAddress(storedProfile.address || "");
        }
      }
    }
  }, []);

  const handleSave = () => {
    if (userId) {
      localStorage.setItem("user", JSON.stringify({ ...JSON.parse(localStorage.getItem("user") || "{}"), name, email }));
      localStorage.setItem(`profile_${userId}`, JSON.stringify({
        phone,
        address
      }));
    }
    setOpen(true);
  };

  const handleLogout = () => {
    logout();
    setLogoutOpen(true);

    setTimeout(() => {
      navigate("/");
    }, 1200);
  };

  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "#fafbfc", py: 6 }}>
      <Box sx={{ maxWidth: 800, mx: "auto", px: 2 }}>
        {/* HEADER */}
        <Box sx={{ mb: 5 }}>
          <Typography 
            variant="h4" 
            sx={{ 
              fontWeight: 700, 
              color: "#1a1a1a",
              letterSpacing: "-0.5px",
              mb: 1
            }}
          >
            Account Settings
          </Typography>
          <Typography sx={{ color: "#666", fontSize: "14px" }}>
            Manage your profile information
          </Typography>
        </Box>

        <Paper sx={{ p: 4, borderRadius: 2, border: "1px solid #e8e8e8", boxShadow: "0 1px 3px rgba(0, 0, 0, 0.04)" }}>
          {/* USER INFO */}
          <Box display="flex" alignItems="center" gap={3} mb={4}>
            <Avatar 
              sx={{ 
                width: 80, 
                height: 80, 
                backgroundColor: "#1a1a1a",
                fontSize: "32px",
                fontWeight: 700
              }}
            >
              {(name || "U").charAt(0)}
            </Avatar>
            <Box>
              <Typography sx={{ fontSize: "20px", fontWeight: 700, color: "#1a1a1a", mb: 0.5 }}>
                {name}
              </Typography>
              <Typography sx={{ color: "#666", fontSize: "14px" }}>
                {email}
              </Typography>
            </Box>
          </Box>

          <Divider sx={{ mb: 4 }} />

          {/* FORM FIELDS */}
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
            <TextField
              label="Full Name"
              fullWidth
              value={name}
              onChange={(e) => setName(e.target.value)}
              sx={{
                "& .MuiOutlinedInput-root": {
                  backgroundColor: "#fafbfc",
                  "& fieldset": {
                    borderColor: "#e8e8e8"
                  }
                },
                "& .MuiInputLabel-root": {
                  fontSize: "14px",
                  fontWeight: 500
                },
                "& .MuiInputBase-input": {
                  fontSize: "14px"
                }
              }}
            />

            <TextField
              label="Email Address"
              fullWidth
              value={email}
              disabled
              sx={{
                "& .MuiOutlinedInput-root": {
                  backgroundColor: "#f0f0f0",
                  "& fieldset": {
                    borderColor: "#e8e8e8"
                  }
                },
                "& .MuiInputLabel-root": {
                  fontSize: "14px",
                  fontWeight: 500
                },
                "& .MuiInputBase-input": {
                  fontSize: "14px",
                  color: "#999"
                }
              }}
            />

            <TextField
              label="Phone Number"
              fullWidth
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              sx={{
                "& .MuiOutlinedInput-root": {
                  backgroundColor: "#fafbfc",
                  "& fieldset": {
                    borderColor: "#e8e8e8"
                  }
                },
                "& .MuiInputLabel-root": {
                  fontSize: "14px",
                  fontWeight: 500
                },
                "& .MuiInputBase-input": {
                  fontSize: "14px"
                }
              }}
            />

            <TextField
              label="Address"
              fullWidth
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              sx={{
                "& .MuiOutlinedInput-root": {
                  backgroundColor: "#fafbfc",
                  "& fieldset": {
                    borderColor: "#e8e8e8"
                  }
                },
                "& .MuiInputLabel-root": {
                  fontSize: "14px",
                  fontWeight: 500
                },
                "& .MuiInputBase-input": {
                  fontSize: "14px"
                }
              }}
            />
          </Box>

          {/* ACTION BUTTONS */}
          <Box display="flex" gap={2} mt={4}>
            <Button 
              variant="contained" 
              onClick={handleSave}
              sx={{
                backgroundColor: "#1a1a1a",
                color: "white",
                fontWeight: 600,
                fontSize: "14px",
                paddingX: 3,
                paddingY: 1.1,
                borderRadius: 1.5,
                textTransform: "none",
                "&:hover": {
                  backgroundColor: "#333"
                }
              }}
            >
              Save Changes
            </Button>

            <Button
              variant="outlined"
              onClick={handleLogout}
              sx={{
                borderColor: "#e8e8e8",
                color: "#666",
                fontWeight: 600,
                fontSize: "14px",
                paddingX: 3,
                paddingY: 1.1,
                borderRadius: 1.5,
                textTransform: "none",
                "&:hover": {
                  borderColor: "#999",
                  backgroundColor: "#f5f5f5"
                }
              }}
            >
              Logout
            </Button>
          </Box>
        </Paper>
      </Box>

      {/* SAVE SUCCESS SNACKBAR */}
      <Snackbar
        open={open}
        autoHideDuration={2000}
        onClose={() => setOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert severity="success" sx={{ fontWeight: 500 }}>
          Profile updated successfully
        </Alert>
      </Snackbar>

      {/* LOGOUT SNACKBAR */}
      <Snackbar 
        open={logoutOpen} 
        autoHideDuration={2000}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert severity="success" sx={{ fontWeight: 500 }}>
          Logged out successfully
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default Profile;
