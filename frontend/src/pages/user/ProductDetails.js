import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Grid,
  Button,
  Rating,
  TextField,
  Paper,
  Chip,
  Container,
  Snackbar,
  Alert,
  CircularProgress
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import api from "../../services/api";
import { useCart } from "../../context/CartContext";

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isAdded, setIsAdded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/admin/products/${id}`);
        setProduct(res.data);
        setError("");
      } catch (err) {
        console.error("Error fetching product:", err);
        setError("Product not found");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <Container sx={{ py: 8, textAlign: "center" }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error || !product) {
    return (
      <Container sx={{ py: 8, textAlign: "center" }}>
        <Typography variant="h4" sx={{ mb: 2 }}>Product Not Found</Typography>
        <Typography color="text.secondary" sx={{ mb: 3 }}>
          The product you're looking for doesn't exist.
        </Typography>
        <Button
          variant="contained"
          onClick={() => navigate("/user/products")}
          sx={{
            backgroundColor: "var(--primary)",
            "&:hover": { backgroundColor: "var(--primary-dark)" }
          }}
        >
          Back to Products
        </Button>
      </Container>
    );
  }

  const productImage = product.image && product.image.trim() !== ""
    ? product.image
    : "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1000&q=80";

  return (
    <Box sx={{ backgroundColor: "var(--gray-50)", minHeight: "100vh", py: 4 }}>
      <Container maxWidth="lg">
        {/* Back Button */}
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/user/products")}
          sx={{
            mb: 3,
            color: "var(--primary)",
            fontWeight: 600,
            textTransform: "none",
            "&:hover": { backgroundColor: "rgba(30, 64, 175, 0.05)" }
          }}
        >
          Back to Products
        </Button>

        <Paper sx={{ p: { xs: 2, md: 4 }, borderRadius: 2, boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}>
          <Grid container spacing={4}>
            {/* Product Image */}
            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  position: "relative",
                  borderRadius: 2,
                  overflow: "hidden",
                  backgroundColor: "var(--gray-100)",
                  maxHeight: { xs: "220px", md: "280px" },
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}
              >
                <img
                  src={productImage}
                  alt={product.name}
                  style={{
                    width: "100%",
                    height: "100%",
                    maxHeight: "280px",
                    display: "block",
                    objectFit: "contain"
                  }}
                />
                {product.badge && (
                  <Chip
                    label={product.badge}
                    sx={{
                      position: "absolute",
                      top: 16,
                      right: 16,
                      fontWeight: 700,
                      backgroundColor:
                        product.badge === "Sale"
                          ? "var(--error)"
                          : product.badge === "New"
                          ? "var(--primary)"
                          : "var(--warning)",
                      color: "white"
                    }}
                  />
                )}
              </Box>
            </Grid>

            {/* Product Info */}
            <Grid item xs={12} md={6}>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 800,
                  color: "var(--gray-900)",
                  mb: 2,
                  fontSize: { xs: "24px", md: "32px" }
                }}
              >
                {product.name}
              </Typography>

              {/* Rating & Reviews */}
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 3 }}>
                <Rating value={product.rating} readOnly precision={0.1} sx={{ color: "var(--primary)" }} />
                <Typography variant="body2" sx={{ color: "var(--gray-600)", fontWeight: 600 }}>
                  {product.rating} ({product.reviews} reviews)
                </Typography>
              </Box>

              {/* Category */}
              <Typography variant="body2" sx={{ color: "var(--gray-600)", mb: 2 }}>
                Category: <strong>{product.category_name || product.category || "N/A"}</strong>
              </Typography>

              {/* Price */}
              <Box sx={{ mb: 3 }}>
                <Typography
                  variant="h4"
                  sx={{
                    color: "var(--primary)",
                    fontWeight: 800,
                    fontSize: "32px"
                  }}
                >
                  ₹{(product.price || 0).toLocaleString()}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: "var(--gray-500)",
                    textDecoration: "line-through",
                    fontSize: "14px"
                  }}
                >
                  ₹{Math.round((product.price || 0) * 1.2).toLocaleString()}
                </Typography>
              </Box>

              {/* Description */}
              <Typography
                variant="body1"
                sx={{
                  color: "var(--gray-700)",
                  mb: 3,
                  lineHeight: 1.8
                }}
              >
                {product.description}
              </Typography>

              {/* Quantity Selector */}
              <TextField
                type="number"
                label="Quantity"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                size="small"
                inputProps={{ min: 1, max: 10 }}
                sx={{ mb: 3, width: 120 }}
              />

              {/* Action Buttons */}
              <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                <Button
                  variant="contained"
                  size="large"
                  disabled={isAdded || isLoading}
                  startIcon={isAdded ? null : <AddShoppingCartIcon />}
                  sx={{
                    backgroundColor: isAdded ? "var(--success, #4caf50)" : "var(--primary)",
                    color: "white",
                    fontWeight: 700,
                    textTransform: "none",
                    borderRadius: 1,
                    px: 4,
                    py: 1.5,
                    fontSize: "16px",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      backgroundColor: isAdded ? "var(--success, #4caf50)" : "var(--primary-dark)",
                      boxShadow: isAdded ? "none" : "0 4px 12px rgba(30, 64, 175, 0.3)"
                    },
                    "&:disabled": {
                      backgroundColor: "var(--success, #4caf50)",
                      color: "white",
                      cursor: "not-allowed"
                    }
                  }}
                  onClick={() => {
                    if (isLoading || isAdded) return;
                    
                    setIsLoading(true);
                    addToCart(product, quantity);
                    setSnackbarMessage(`${product.name} (Qty: ${quantity}) added to cart!`);
                    setOpenSnackbar(true);
                    setIsAdded(true);
                    
                    setTimeout(() => {
                      setIsAdded(false);
                      setIsLoading(false);
                    }, 2000);
                  }}
                >
                  {isAdded ? "✓ Added to Cart" : isLoading ? "Adding..." : "Add to Cart"}
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  startIcon={<ShoppingBagIcon />}
                  sx={{
                    borderColor: "var(--primary)",
                    color: "var(--primary)",
                    fontWeight: 700,
                    textTransform: "none",
                    borderRadius: 1,
                    px: 4,
                    py: 1.5,
                    fontSize: "16px",
                    "&:hover": {
                      borderColor: "var(--primary-dark)",
                      backgroundColor: "rgba(30, 64, 175, 0.05)"
                    }
                  }}
                  onClick={() => navigate("/user/checkout")}
                >
                  Buy Now
                </Button>
              </Box>

              <Snackbar
                open={openSnackbar}
                autoHideDuration={2000}
                onClose={() => setOpenSnackbar(false)}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              >
                <Alert onClose={() => setOpenSnackbar(false)} severity="success">
                  {snackbarMessage}
                </Alert>
              </Snackbar>
            </Grid>
          </Grid>
        </Paper>
      </Container>
    </Box>
  );
}

export default ProductDetails;
