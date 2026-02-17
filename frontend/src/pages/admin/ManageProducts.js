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
  Select,
  MenuItem,
  CircularProgress,
  Alert
} from "@mui/material";
import api from "../../services/api";

function ManageProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [stock, setStock] = useState("");
  const [image, setImage] = useState("");
  const [rating, setRating] = useState("0");

  const [deleteId, setDeleteId] = useState(null);

  // Fetch products and categories on mount
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [productsRes, categoriesRes] = await Promise.all([
        api.get("/admin/products"),
        api.get("/admin/categories")
      ]);
      setProducts(productsRes.data);
      setCategories(categoriesRes.data);
      setError("");
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setEditingId(null);
    setName("");
    setDescription("");
    setPrice("");
    setCategoryId(categories.length > 0 ? categories[0].id : "");
    setStock("");
    setImage("");
    setRating("0");
    setOpen(true);
  };

  const handleEdit = (prod) => {
    setEditingId(prod.id);
    setName(prod.name);
    setDescription(prod.description);
    setPrice(prod.price);
    setCategoryId(prod.category_id);
    setStock(prod.stock);
    setImage(prod.image);
    setRating(prod.rating);
    setOpen(true);
  };

  const handleSave = async () => {
    if (!name.trim() || !price || !categoryId) {
      setError("Name, price, and category are required");
      return;
    }

    // Validate image URL if provided
    if (image && image.trim() !== "") {
      try {
        new URL(image);
      } catch (err) {
        setError("Please enter a valid image URL (must start with http:// or https://)");
        return;
      }
    }

    try {
      if (editingId) {
        // Update product
        await api.put(`/admin/products/${editingId}`, {
          name,
          description,
          price: parseFloat(price),
          category_id: categoryId,
          stock: parseInt(stock) || 0,
          image,
          rating: parseFloat(rating) || 0
        });
        setProducts(
          products.map((p) =>
            p.id === editingId
              ? {
                  ...p,
                  name,
                  description,
                  price,
                  category_id: categoryId,
                  stock,
                  image,
                  rating
                }
              : p
          )
        );
        setSuccess("Product updated successfully");
      } else {
        // Create new product
        const response = await api.post("/admin/products", {
          name,
          description,
          price: parseFloat(price),
          category_id: categoryId,
          stock: parseInt(stock) || 0,
          image,
          rating: parseFloat(rating) || 0
        });
        setProducts([
          ...products,
          {
            id: response.data.productId,
            name,
            description,
            price,
            category_id: categoryId,
            stock,
            image,
            rating
          }
        ]);
        setSuccess("Product created successfully");
      }
      setOpen(false);
      setError("");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error("Error saving product:", err);
      setError(err.response?.data?.message || "Failed to save product");
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      await api.delete(`/admin/products/${deleteId}`);
      setProducts(products.filter((p) => p.id !== deleteId));
      setDeleteId(null);
      setSuccess("Product deleted successfully");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error("Error deleting product:", err);
      setError("Failed to delete product");
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress size={60} sx={{ color: "#4facfe" }} />
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
              background: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text"
            }}
          >
            Manage Products
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ fontSize: "15px" }}>
            Total Products: <strong>{products.length}</strong> • Add, edit, and manage your product inventory
          </Typography>
        </Box>
        <Button 
          variant="contained" 
          onClick={handleOpenAdd}
          sx={{
            background: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
            color: "white",
            fontWeight: 700,
            borderRadius: 2,
            px: 3,
            py: 1.2,
            textTransform: "none",
            fontSize: "15px",
            boxShadow: "0 4px 15px rgba(79, 172, 254, 0.3)",
            "&:hover": {
              boxShadow: "0 6px 25px rgba(79, 172, 254, 0.4)",
              transform: "translateY(-2px)"
            },
            transition: "all 0.2s ease"
          }}
        >
          + Add Product
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
                background: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
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
              <TableCell>Product Name</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Stock</TableCell>
              <TableCell>Category</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {products.length > 0 ? (
              products.map((prod) => {
                const categoryName = categories.find(
                  (c) => c.id === prod.category_id
                )?.name || "N/A";
                return (
                  <TableRow
                    key={prod.id}
                    sx={{
                      borderBottom: "1px solid #e8e8e8",
                      transition: "all 0.2s ease",
                      "&:hover": {
                        backgroundColor: "#f0f7ff"
                      },
                      "& .MuiTableCell-body": {
                        padding: "14px 16px",
                        fontSize: "14px",
                        color: "#1a1a1a"
                      }
                    }}
                  >
                    <TableCell>{prod.id}</TableCell>
                    <TableCell>{prod.name}</TableCell>
                    <TableCell>₹{parseFloat(prod.price).toLocaleString()}</TableCell>
                    <TableCell>{prod.stock}</TableCell>
                    <TableCell>{categoryName}</TableCell>
                    <TableCell align="right">
                      <Button 
                        size="small" 
                        onClick={() => handleEdit(prod)}
                        sx={{
                          color: "#4facfe",
                          fontWeight: 600,
                          textTransform: "none",
                          "&:hover": { backgroundColor: "rgba(79, 172, 254, 0.1)" }
                        }}
                      >
                        Edit
                      </Button>
                      <Button
                        size="small"
                        onClick={() => setDeleteId(prod.id)}
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
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  No products found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Box>

      {/* ADD/EDIT MODAL */}
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingId ? "Edit Product" : "Add Product"}
        </DialogTitle>

        <DialogContent>
          {!editingId && (
            <Box sx={{ mb: 2, p: 1.5, bgcolor: "#e3f2fd", borderRadius: 1 }}>
              <Typography variant="caption" display="block" sx={{ fontWeight: "bold", mb: 1 }}>
                ℹ️ Image URL Tips:
              </Typography>
              <Typography variant="caption" display="block" sx={{ fontSize: "11px", mb: 0.5 }}>
                • Use free image sites like Unsplash, Pexels, or Pixabay
              </Typography>
              <Typography variant="caption" display="block" sx={{ fontSize: "11px" }}>
                • Copy the full image URL (must start with http:// or https://)
              </Typography>
            </Box>
          )}
          <TextField
            label="Product Name"
            fullWidth
            margin="normal"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <TextField
            label="Description"
            fullWidth
            margin="normal"
            multiline
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <TextField
            label="Price"
            fullWidth
            margin="normal"
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
          <Select
            fullWidth
            margin="dense"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            sx={{ mt: 2 }}
          >
            {categories.map((cat) => (
              <MenuItem key={cat.id} value={cat.id}>
                {cat.name}
              </MenuItem>
            ))}
          </Select>
          <TextField
            label="Stock"
            fullWidth
            margin="normal"
            type="number"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
          />
          <TextField
            label="Image URL"
            fullWidth
            margin="normal"
            value={image}
            onChange={(e) => setImage(e.target.value)}
            size="small"
            placeholder="https://example.com/product.jpg or https://images.unsplash.com/..."
            helperText="Complete URL required (http:// or https://). Example: https://images.unsplash.com/photo-1542272604-787c62d465d1?auto=format&fit=crop&w=800&q=80"
            error={image && !image.startsWith("http")}
          />
          {image && image.startsWith("http") && (
            <Box sx={{ mt: 2, mb: 2 }}>
              <Typography variant="caption" display="block" sx={{ mb: 1, fontWeight: "bold" }}>
                ✓ Image Preview:
              </Typography>
              <Box
                component="img"
                src={image}
                onError={(e) => {
                  console.log("Image failed to load:", image);
                  e.target.style.display = "none";
                }}
                alt="Preview"
                sx={{
                  maxWidth: "100%",
                  maxHeight: "150px",
                  border: "2px solid #4caf50",
                  borderRadius: 1,
                  objectFit: "cover"
                }}
              />
            </Box>
          )}
          {image && !image.startsWith("http") && (
            <Box sx={{ mt: 2, mb: 2, p: 1, bgcolor: "#ffebee", borderRadius: 1 }}>
              <Typography variant="caption" display="block" sx={{ color: "#c62828", fontWeight: "bold" }}>
                ✗ Invalid URL - Must start with http:// or https://
              </Typography>
            </Box>
          )}
          <TextField
            label="Rating"
            fullWidth
            margin="normal"
            type="number"
            inputProps={{ step: "0.1", min: "0", max: "5" }}
            value={rating}
            onChange={(e) => setRating(e.target.value)}
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
        <DialogTitle>Delete Product</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this product? This action cannot be undone.
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

export default ManageProducts;
