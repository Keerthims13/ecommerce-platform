import React from "react";
import { Outlet, useNavigate } from "react-router-dom";
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Toolbar,
  AppBar,
  Typography
} from "@mui/material";

import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import CategoryIcon from "@mui/icons-material/Category";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import ReceiptIcon from "@mui/icons-material/Receipt";
import LogoutIcon from "@mui/icons-material/Logout";

const drawerWidth = 240;

function AdminLayout() {
  const navigate = useNavigate();

  return (
    <Box sx={{ display: "flex" }}>
      {/* TOP BAR */}
      <AppBar
        position="fixed"
        sx={{
          zIndex: 1201,
          background: "linear-gradient(to right, #667eea, #764ba2)"
        }}
      >
        <Toolbar>
          <Typography variant="h6" noWrap>
            Admin Dashboard
          </Typography>
        </Toolbar>
      </AppBar>

      {/* SIDEBAR */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: "border-box",
            backgroundColor: "#1f2937",
            color: "white"
          }
        }}
      >
        <Typography
  variant="h6"
  align="center"
  sx={{
    py: 2,
    fontWeight: "bold",
    letterSpacing: 1
  }}
>
  Admin Panel
</Typography>


        <List>
          <ListItem button onClick={() => navigate("/admin/dashboard")}>
            <ListItemIcon sx={{ color: "white" }}>
              <DashboardIcon />
            </ListItemIcon>
            <ListItemText primary="Dashboard" />
          </ListItem>

          <ListItem button onClick={() => navigate("/admin/users")}>
            <ListItemIcon sx={{ color: "white" }}>
              <PeopleIcon />
            </ListItemIcon>
            <ListItemText primary="Manage Users" />
          </ListItem>

          <ListItem button onClick={() => navigate("/admin/categories")}>
            <ListItemIcon sx={{ color: "white" }}>
              <CategoryIcon />
            </ListItemIcon>
            <ListItemText primary="Manage Categories" />
          </ListItem>

          <ListItem button onClick={() => navigate("/admin/products")}>
            <ListItemIcon sx={{ color: "white" }}>
              <ShoppingBagIcon />
            </ListItemIcon>
            <ListItemText primary="Manage Products" />
          </ListItem>

          <ListItem button onClick={() => navigate("/admin/orders")}>
            <ListItemIcon sx={{ color: "white" }}>
              <ReceiptIcon />
            </ListItemIcon>
            <ListItemText primary="Orders" />
          </ListItem>

          <ListItem button onClick={() => navigate("/")}>
            <ListItemIcon sx={{ color: "white" }}>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItem>
        </List>
      </Drawer>

      {/* PAGE CONTENT */}
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
}

export default AdminLayout;
