import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Button,
  IconButton,
  Badge,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Divider,
  Container
} from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import PersonIcon from "@mui/icons-material/Person";
import LogoutIcon from "@mui/icons-material/Logout";
import HomeIcon from "@mui/icons-material/Home";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import "./Header.css";

function Header() {
  const { logout } = useAuth();
  const { cartItems } = useCart();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Calculate total items in cart
  const cartItemCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const navLinks = [
    { label: "Home", path: "/user/home" },
    { label: "Products", path: "/user/products" },
    { label: "Orders", path: "/user/orders" },
    { label: "Profile", path: "/user/profile" }
  ];

  const drawer = (
    <Box sx={{ width: 280 }}>
      <Box sx={{ p: 2, display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--gray-200)" }}>
        <Typography variant="h6" sx={{ fontWeight: "700", color: "var(--gray-900)" }}>
          Menu
        </Typography>
        <IconButton onClick={handleDrawerToggle} size="small">
          <CloseIcon />
        </IconButton>
      </Box>
      <List sx={{ py: 1 }}>
        {navLinks.map((link) => (
          <ListItem key={link.path} disablePadding>
            <ListItemButton
              component={Link}
              to={link.path}
              onClick={() => setMobileOpen(false)}
              sx={{
                px: 2,
                py: 1.5,
                "&:hover": { backgroundColor: "var(--gray-100)" },
                color: "var(--gray-700)"
              }}
            >
              <ListItemText 
                primary={link.label} 
                sx={{ 
                  "& .MuiListItemText-primary": { 
                    fontWeight: 500,
                    color: "var(--gray-900)"
                  } 
                }} 
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider sx={{ my: 1 }} />
      <Box sx={{ p: 2 }}>
        <Button
          fullWidth
          onClick={handleLogout}
          startIcon={<LogoutIcon />}
          sx={{
            color: "var(--error)",
            fontWeight: 600,
            border: "1px solid var(--error)",
            "&:hover": { backgroundColor: "rgba(239, 68, 68, 0.05)" }
          }}
          variant="outlined"
        >
          Logout
        </Button>
      </Box>
    </Box>
  );

  return (
    <>
      <AppBar
        position="sticky"
        sx={{
          background: "var(--white)",
          color: "var(--gray-900)",
          boxShadow: "0 1px 3px rgba(0, 0, 0, 0.08)",
          top: 0,
          zIndex: 100,
          borderBottom: "1px solid var(--gray-200)"
        }}
      >
        <Container maxWidth="lg" sx={{ px: 0 }}>
          <Toolbar
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "12px 0"
            }}
          >
            {/* LOGO */}
            <Typography
              variant="h6"
              component={Link}
              to="/user/home"
              sx={{
                fontWeight: "800",
                textDecoration: "none",
                color: "var(--primary)",
                fontSize: { xs: "20px", sm: "24px" },
                letterSpacing: "-0.5px"
              }}
            >
              Nexora
            </Typography>

            {/* NAV LINKS - Desktop */}
            <Box
              sx={{
                display: { xs: "none", md: "flex" },
                gap: 4,
                alignItems: "center"
              }}
            >
              {navLinks.map((link) => (
                <Button
                  key={link.path}
                  component={Link}
                  to={link.path}
                  sx={{
                    color: "var(--gray-600)",
                    fontWeight: 500,
                    fontSize: "14px",
                    textTransform: "none",
                    transition: "color 0.2s ease",
                    "&:hover": {
                      color: "var(--primary)"
                    }
                  }}
                >
                  {link.label}
                </Button>
              ))}
          </Box>

          {/* RIGHT ACTIONS */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <IconButton
              component={Link}
              to="/user/cart"
              sx={{
                color: "var(--gray-600)",
                transition: "0.2s",
                "&:hover": {
                  color: "var(--primary)"
                }
              }}
            >
              <Badge
                badgeContent={cartItemCount}
                sx={{
                  "& .MuiBadge-badge": {
                    backgroundColor: "var(--error)",
                    color: "white",
                    fontWeight: "700"
                  }
                }}
              >
                <ShoppingCartIcon />
              </Badge>
            </IconButton>

            {/* Mobile Menu Button */}
            <IconButton
              onClick={handleDrawerToggle}
              sx={{
                display: { xs: "flex", md: "none" },
                color: "var(--gray-600)"
              }}
            >
              <MenuIcon />
            </IconButton>

            {/* Desktop Logout Button */}
            <Button
              onClick={handleLogout}
              sx={{
                display: { xs: "none", md: "inline-flex" },
                fontWeight: 600,
                borderRadius: "6px",
                textTransform: "none",
                paddingX: 2,
                color: "var(--error)",
                border: "1px solid var(--error)",
                "&:hover": {
                  backgroundColor: "rgba(239, 68, 68, 0.05)"
                }
              }}
              variant="outlined"
            >
              Logout
            </Button>
          </Box>
        </Toolbar>
        </Container>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        sx={{
          "& .MuiDrawer-paper": {
            backgroundColor: "var(--white)"
          }
        }}
      >
        {drawer}
      </Drawer>
    </>
  );
}

export default Header;
