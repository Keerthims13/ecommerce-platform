import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
  Alert
} from "@mui/material";
import api from "../../services/api";

function ManageCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [categoryName, setCategoryName] = useState("");
  const [description, setDescription] = useState("");

  const [deleteId, setDeleteId] = useState(null);

  // Fetch categories on mount
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await api.get("/admin/categories");
      setCategories(response.data);
      setError("");
    } catch (err) {
      console.error("Error fetching categories:", err);
      setError("Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setEditingId(null);
    setCategoryName("");
    setDescription("");
    setOpen(true);
  };

  const handleEdit = (cat) => {
    setEditingId(cat.id);
    setCategoryName(cat.name);
    setDescription(cat.description || "");
    setOpen(true);
  };

  const handleSave = async () => {
    if (!categoryName.trim()) {
      setError("Category name is required");
      return;
    }

    try {
      if (editingId) {
        // Update category
        await api.put(`/admin/categories/${editingId}`, {
          name: categoryName,
          description: description
        });
        setCategories(
          categories.map((c) =>
            c.id === editingId
              ? { ...c, name: categoryName, description: description }
              : c
          )
        );
        setSuccess("Category updated successfully");
      } else {
        // Create new category
        const response = await api.post("/admin/categories", {
          name: categoryName,
          description: description
        });
        setCategories([
          ...categories,
          { id: response.data.categoryId, name: categoryName, description: description }
        ]);
        setSuccess("Category created successfully");
      }
      setOpen(false);
      setError("");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error("Error saving category:", err);
      setError(err.response?.data?.message || "Failed to save category");
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      await api.delete(`/admin/categories/${deleteId}`);
      setCategories(categories.filter((c) => c.id !== deleteId));
      setDeleteId(null);
      setSuccess("Category deleted successfully");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error("Error deleting category:", err);
      setError("Failed to delete category");
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ backgroundColor: "#f8f9fa", minHeight: "100vh", py: 4, px: { xs: 2, md: 0 } }}>
      {/* ALERTS */}
      {error && <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }}>{success}</Alert>}

      {/* HEADER SECTION */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 5 }}>
        <Box>
          <Typography 
            variant="h4" 
            sx={{ 
              fontWeight: 800, 
              mb: 1,
              background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text"
            }}
          >
            Manage Categories
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ fontSize: "15px" }}>
            Total Categories: <strong>{categories.length}</strong> • Organize your product categories
          </Typography>
        </Box>
        <Button 
          variant="contained" 
          onClick={handleOpenAdd}
          sx={{
            background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
            color: "white",
            fontWeight: 700,
            borderRadius: 2,
            px: 3,
            py: 1.2,
            textTransform: "none",
            fontSize: "15px",
            boxShadow: "0 4px 15px rgba(240, 147, 251, 0.3)",
            "&:hover": {
              boxShadow: "0 6px 25px rgba(240, 147, 251, 0.4)",
              transform: "translateY(-2px)"
            },
            transition: "all 0.2s ease"
          }}
        >
          + Add Category
        </Button>
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
                background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
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
              <TableCell>Category Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {categories.length > 0 ? (
              categories.map((cat) => (
                <TableRow key={cat.id}>
                  <TableCell>{cat.id}</TableCell>
                  <TableCell>{cat.name}</TableCell>
                  <TableCell>{cat.description || "-"}</TableCell>
                  <TableCell align="right">
                    <Button 
                      size="small" 
                      onClick={() => handleEdit(cat)}
                      sx={{
                        color: "#f093fb",
                        fontWeight: 600,
                        textTransform: "none",
                        "&:hover": { backgroundColor: "rgba(240, 147, 251, 0.1)" }
                      }}
                    >
                      Edit
                    </Button>
                    <Button
                      size="small"
                      onClick={() => setDeleteId(cat.id)}
                      sx={{
                        color: "#ff6b6b",
                        fontWeight: 600,
                        textTransform: "none",
                        "&:hover": { backgroundColor: "rgba(255, 107, 107, 0.1)" }
                      }}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  No categories found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Box>

      {/* ADD/EDIT MODAL */}
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>
          {editingId ? "Edit Category" : "Add Category"}
        </DialogTitle>

        <DialogContent>
          <TextField
            label="Category Name"
            fullWidth
            margin="normal"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
          />
          <TextField
            label="Description (optional)"
            fullWidth
            margin="normal"
            multiline
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSave}>
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* DELETE CONFIRMATION */}
      <Dialog open={Boolean(deleteId)} onClose={() => setDeleteId(null)}>
        <DialogTitle>Delete Category</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this category? This action cannot be undone.
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

export default ManageCategories;
