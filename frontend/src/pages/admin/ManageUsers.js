import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  TablePagination,
  CircularProgress,
  Alert
} from "@mui/material";
import api from "../../services/api";

function ManageUsers() {
  // ------------------ STATE ------------------
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");

  const [openForm, setOpenForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("user");

  const [deleteId, setDeleteId] = useState(null);

  // Pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // Load users on component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  // Fetch users from database
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await api.get("/admin/users");
      setUsers(response.data);
      setError("");
    } catch (err) {
      console.error("Error fetching users:", err);
      setError("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  // Filter logic
  const filteredUsers = users.filter((u) => {
    const matchSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());

    const matchRole = roleFilter === "All" || u.role === roleFilter;

    return matchSearch && matchRole;
  });

  // Delete user
  const handleDeleteConfirm = async () => {
    try {
      await api.delete(`/admin/users/${deleteId}`);
      setUsers(users.filter((u) => u.id !== deleteId));
      setDeleteId(null);
    } catch (err) {
      console.error("Error deleting user:", err);
      setError("Failed to delete user");
    }
  };

  // Update user role
  const handleSave = async () => {
    if (editingId) {
      try {
        await api.put(`/admin/users/${editingId}/role`, { role });
        // Update local state
        setUsers(
          users.map((u) => (u.id === editingId ? { ...u, role } : u))
        );
        setOpenForm(false);
      } catch (err) {
        console.error("Error updating user:", err);
        setError("Failed to update user");
      }
    }
  };

  const handleEdit = (user) => {
    setEditingId(user.id);
    setName(user.name);
    setEmail(user.email);
    setRole(user.role);
    setOpenForm(true);
  };

  // Show loading
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ backgroundColor: "#f8f9fa", minHeight: "100vh", py: 4, px: { xs: 2, md: 0 } }}>
      {/* ERROR MESSAGE */}
      {error && <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>{error}</Alert>}

      {/* HEADER SECTION */}
      <Box sx={{ mb: 5 }}>
        <Typography 
          variant="h4" 
          sx={{ 
            fontWeight: 800, 
            mb: 1,
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text"
          }}
        >
          Manage Users
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ fontSize: "15px" }}>
          Total Users: <strong>{users.length}</strong> • View and manage user accounts and roles
        </Typography>
      </Box>

      {/* SEARCH & FILTERS */}
      <Box 
        sx={{ 
          display: "flex", 
          gap: 2, 
          mb: 4,
          flexWrap: "wrap",
          alignItems: "center"
        }}
      >
        <TextField
          label="Search by Name or Email"
          size="small"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ 
            minWidth: 250,
            "& .MuiOutlinedInput-root": {
              borderRadius: 2,
              backgroundColor: "white",
              "&:hover fieldset": {
                borderColor: "#667eea"
              },
              "&.Mui-focused fieldset": {
                borderColor: "#667eea",
                boxShadow: "0 0 0 3px rgba(102, 126, 234, 0.1)"
              }
            },
            "& .MuiOutlinedInput-input": {
              fontSize: "14px"
            }
          }}
          InputProps={{
            startAdornment: (
              <Box sx={{ mr: 1, display: "flex", alignItems: "center", color: "#666" }}>🔍</Box>
            )
          }}
        />

        <Select
          size="small"
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          sx={{ 
            minWidth: 160,
            borderRadius: 2,
            backgroundColor: "white",
            "& .MuiOutlinedInput-root": {
              "&:hover fieldset": {
                borderColor: "#667eea"
              },
              "&.Mui-focused fieldset": {
                borderColor: "#667eea",
                boxShadow: "0 0 0 3px rgba(102, 126, 234, 0.1)"
              }
            }
          }}
        >
          <MenuItem value="All">All Roles</MenuItem>
          <MenuItem value="user">👤 User</MenuItem>
          <MenuItem value="admin">👨‍💼 Admin</MenuItem>
        </Select>
      </Box>

      {/* TABLE */}
      <Box
        sx={{
          backgroundColor: "white",
          borderRadius: 3,
          border: "1px solid #e8e8e8",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.06)",
          overflow: "hidden"
        }}
      >
        <Table>
          <TableHead>
            <TableRow
              sx={{
                backgroundColor: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                "& .MuiTableCell-head": {
                  color: "white",
                  fontWeight: 700,
                  fontSize: "13px",
                  padding: "16px",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px"
                }
              }}
            >
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Joined</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {filteredUsers.length > 0 ? (
              filteredUsers
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((user, idx) => (
                  <TableRow 
                    key={user.id}
                    sx={{
                      borderBottom: "1px solid #e8e8e8",
                      transition: "all 0.2s ease",
                      "&:hover": {
                        backgroundColor: "#f8f9ff"
                      },
                      "& .MuiTableCell-body": {
                        padding: "14px 16px",
                        fontSize: "14px",
                        color: "#1a1a1a"
                      }
                    }}
                  >
                    <TableCell>{user.id}</TableCell>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Chip
                        label={user.role}
                        color={user.role === "admin" ? "primary" : "default"}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      {new Date(user.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell align="right">
                      <Button 
                        size="small" 
                        onClick={() => handleEdit(user)}
                        sx={{
                          color: "#667eea",
                          fontWeight: 600,
                          textTransform: "none",
                          "&:hover": { backgroundColor: "rgba(102, 126, 234, 0.1)" }
                        }}
                      >
                        Edit Role
                      </Button>
                      {user.role !== "admin" && (
                        <Button
                          size="small"
                          onClick={() => setDeleteId(user.id)}
                          sx={{
                            color: "#ff6b6b",
                            fontWeight: 600,
                            textTransform: "none",
                            "&:hover": { backgroundColor: "rgba(255, 107, 107, 0.1)" }
                          }}
                        >
                          Delete
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  No users found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {/* PAGINATION */}
        {filteredUsers.length > 0 && (
          <TablePagination
            component="div"
            count={filteredUsers.length}
            page={page}
            onPageChange={(e, newPage) => setPage(newPage)}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={(e) => {
              setRowsPerPage(parseInt(e.target.value, 10));
              setPage(0);
            }}
          />
        )}
      </Box>

      {/* EDIT USER MODAL */}
      <Dialog open={openForm} onClose={() => setOpenForm(false)}>
        <DialogTitle>Edit User Role</DialogTitle>
        <DialogContent>
          <TextField
            label="Name"
            fullWidth
            margin="normal"
            value={name}
            disabled
          />
          <TextField
            label="Email"
            fullWidth
            margin="normal"
            value={email}
            disabled
          />
          <Select
            fullWidth
            value={role}
            onChange={(e) => setRole(e.target.value)}
            sx={{ mt: 2 }}
          >
            <MenuItem value="user">User</MenuItem>
            <MenuItem value="admin">Admin</MenuItem>
          </Select>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenForm(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSave}>
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* DELETE CONFIRMATION */}
      <Dialog open={Boolean(deleteId)} onClose={() => setDeleteId(null)}>
        <DialogTitle>Delete User</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this user? This action cannot be undone.
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteId(null)}>Cancel</Button>
          <Button color="error" variant="contained" onClick={handleDeleteConfirm}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default ManageUsers;
