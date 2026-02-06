import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Box,
  Rating,
  Chip,
  IconButton,
  Snackbar,
  Alert
} from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import "./ProductCard.css";

function ProductCard({ product }) {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [isFavorite, setIsFavorite] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const productImage = product?.image && product.image.trim() !== ""
    ? product.image
    : "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80";
  
  // Debug log
  console.log(`Product: ${product?.name}, Image: ${product?.image}, Final Image: ${productImage}`);

  const handleAddToCart = (e) => {
    e.stopPropagation();
    
    // Prevent multiple rapid clicks
    if (isLoading || isAdded) return;
    
    setIsLoading(true);
    addToCart(product, 1);
    setOpenSnackbar(true);
    setIsAdded(true);
    
    // Reset the "Added" state after 2 seconds
    setTimeout(() => {
      setIsAdded(false);
      setIsLoading(false);
    }, 2000);
  };

  const handleFavorite = (e) => {
    e.stopPropagation();
    setIsFavorite(!isFavorite);
  };

  return (
    <>
      <Card
        className="product-card"
        sx={{
          borderRadius: 2,
          transition: "all 0.2s ease",
          cursor: "pointer",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          border: "1px solid var(--gray-200)",
          position: "relative",
          overflow: "hidden",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.06)",
          "&:hover": {
            transform: "translateY(-4px)",
            boxShadow: "0 8px 16px rgba(0, 0, 0, 0.08)"
          }
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => navigate(`/user/product/${product.id}`)}
      >
      {/* Image Container */}
      <Box
        sx={{
          position: "relative",
          overflow: "hidden",
          backgroundColor: "var(--gray-100)",
          height: 220,
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        <CardMedia
          component="img"
          image={
            productImage
          }
          alt={product.name}
          sx={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transition: "transform 0.4s ease",
            transform: isHovered ? "scale(1.1)" : "scale(1)"
          }}
        />

        {/* Badge */}
        {product.badge && (
          <Chip
            label={product.badge}
            size="small"
            sx={{
              position: "absolute",
              top: 12,
              right: 12,
              fontWeight: 700,
              backgroundColor:
                product.badge === "Sale"
                  ? "var(--error)"
                  : product.badge === "New"
                  ? "var(--primary)"
                  : "var(--warning)",
              color: "white",
              fontSize: "12px"
            }}
          />
        )}

        {/* Favorite Button */}
        <IconButton
          onClick={handleFavorite}
          sx={{
            position: "absolute",
            top: 12,
            left: 12,
            backgroundColor: "white",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
            transition: "all 0.2s ease",
            "&:hover": {
              backgroundColor: "white",
              transform: "scale(1.1)"
            }
          }}
        >
          {isFavorite ? (
            <FavoriteIcon sx={{ color: "var(--error)" }} />
          ) : (
            <FavoriteBorderIcon sx={{ color: "var(--gray-700)" }} />
          )}
        </IconButton>

        {/* Quick View Overlay */}
        {isHovered && (
          <Box
            className="quick-view-overlay"
            sx={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              background: "linear-gradient(to top, rgba(0,0,0,0.8), transparent)",
              color: "white",
              padding: 2,
              textAlign: "center",
              animation: "slideUp 0.3s ease"
            }}
          >
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              Click to view details
            </Typography>
          </Box>
        )}
      </Box>

      {/* Content */}
      <CardContent sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
        {/* Product Name */}
        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
            fontSize: "16px",
            color: "var(--gray-900)",
            mb: 1,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            minHeight: "40px"
          }}
        >
          {product.name}
        </Typography>

        {/* Rating */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mb: 2 }}>
          <Rating value={product.rating || 4} readOnly size="small" sx={{ color: "var(--primary)" }} />
          <Typography
            variant="body2"
            sx={{
              color: "var(--gray-600)",
              fontSize: "12px",
              fontWeight: 600
            }}
          >
            ({product.reviews || 0})
          </Typography>
        </Box>

        {/* Price */}
        <Box sx={{ mb: 2 }}>
          <Typography
            variant="h6"
            sx={{
              color: "var(--primary)",
              fontWeight: 800,
              fontSize: "20px"
            }}
          >
            ₹{product.price}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: "var(--gray-500)",
              textDecoration: "line-through",
              fontSize: "12px"
            }}
          >
            ₹{Math.round(product.price * 1.2)}
          </Typography>
        </Box>

        {/* Action Buttons */}
        <Box sx={{ display: "flex", gap: 1, mt: "auto" }}>
          <Button
            variant="contained"
            fullWidth
            size="small"
            onClick={handleAddToCart}
            disabled={isAdded || isLoading}
            startIcon={isAdded ? null : <AddShoppingCartIcon />}
            sx={{
              backgroundColor: isAdded ? "var(--success, #4caf50)" : "var(--primary)",
              fontWeight: 700,
              borderRadius: 1,
              textTransform: "none",
              fontSize: "14px",
              transition: "all 0.3s ease",
              "&:hover": {
                backgroundColor: isAdded ? "var(--success, #4caf50)" : "var(--primary-dark)",
                boxShadow: isAdded ? "none" : "0 4px 8px rgba(30, 64, 175, 0.2)"
              },
              "&:disabled": {
                backgroundColor: "var(--success, #4caf50)",
                color: "white",
                cursor: "not-allowed"
              }
            }}
          >
            {isAdded ? "✓ Added" : isLoading ? "Adding..." : "Add"}
          </Button>

          <Button
            variant="outlined"
            fullWidth
            size="small"
            onClick={() => navigate(`/user/product/${product.id}`)}
            sx={{
              borderColor: "var(--primary)",
              color: "var(--primary)",
              fontWeight: 700,
              borderRadius: 1,
              textTransform: "none",
              fontSize: "14px",
              "&:hover": {
                borderColor: "var(--primary-dark)",
                backgroundColor: "rgba(30, 64, 175, 0.04)"
              }
            }}
          >
            Details
          </Button>
        </Box>
      </CardContent>

      {/* Stock Status */}
      {product.inStock === false && (
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            backgroundColor: "rgba(0, 0, 0, 0.6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 3
          }}
        >
          <Typography
            sx={{
              color: "white",
              fontWeight: 800,
              fontSize: "20px",
              transform: "rotate(-45deg)"
            }}
          >
            OUT OF STOCK
          </Typography>
        </Box>
      )}
    </Card>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={2000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert onClose={() => setOpenSnackbar(false)} severity="success">
          {product.name} added to cart!
        </Alert>
      </Snackbar>
    </>
  );
}

export default ProductCard;
