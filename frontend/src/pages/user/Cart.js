import React, { useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Button,
  IconButton,
  Paper,
  TextField,
  Divider,
  Container,
  Card,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import CardGiftcardIcon from "@mui/icons-material/CardGiftcard";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import "./Cart.css";

function Cart() {
  const navigate = useNavigate();
  const { cartItems, removeFromCart, updateQuantity } = useCart();

  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const handleQuantityChange = (id, newQuantity) => {
    updateQuantity(id, newQuantity);
  };

  const handleRemove = (id) => {
    removeFromCart(id);
    setDeleteConfirm(null);
  };

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const savings = cartItems.reduce(
    (sum, item) => sum + (item.price * item.quantity * item.discount) / 100,
    0
  );

  const shipping = subtotal > 1000 ? 0 : 100;
  const promoDiscount = promoApplied ? subtotal * 0.05 : 0;
  const total = subtotal - savings + shipping - promoDiscount;

  const handlePromoApply = () => {
    if (promoCode.trim()) {
      setPromoApplied(true);
    }
  };

  return (
    <Box sx={{ backgroundColor: "#f8f9fa", minHeight: "100vh", py: 4 }}>
      <Container maxWidth="lg">
        {/* HEADER */}
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 800,
              mb: 1,
              fontSize: { xs: "24px", sm: "32px" }
            }}
          >
            Shopping Cart
          </Typography>
          <Typography color="text.secondary">
            {cartItems.length} item{cartItems.length !== 1 ? "s" : ""} in your cart
          </Typography>
        </Box>

        {cartItems.length > 0 ? (
          <Grid container spacing={3}>
            {/* CART ITEMS */}
            <Grid item xs={12} md={8}>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {cartItems.map((item) => (
                  <Card
                    key={item.id}
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      border: "1px solid rgba(0, 0, 0, 0.08)",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        boxShadow: "0 4px 12px rgba(0,0,0,0.08)"
                      }
                    }}
                    className="cart-item"
                  >
                    <Grid container alignItems="center" spacing={1.5}>
                      {/* IMAGE */}
                      <Grid item xs={12} sm="auto">
                        <Box
                          component="img"
                          src={item.image || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80"}
                          alt={item.name}
                          onError={(e) => {
                            e.target.src = "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80";
                          }}
                          sx={{
                            width: "80px",
                            height: "80px",
                            borderRadius: 1,
                            backgroundColor: "#f5f5f5",
                            objectFit: "cover"
                          }}
                        />
                      </Grid>

                      {/* DETAILS */}
                      <Grid item xs={12} sm={true} sx={{ flex: 1 }}>
                        <Typography
                          variant="body1"
                          sx={{
                            fontWeight: 600,
                            mb: 0.5,
                            fontSize: "14px"
                          }}
                        >
                          {item.name}
                        </Typography>

                        {/* PRICING */}
                        <Box sx={{ display: "flex", gap: 1.5, alignItems: "center", mb: 1 }}>
                          <Typography
                            sx={{
                              fontSize: "15px",
                              fontWeight: 700,
                              color: "#667eea"
                            }}
                          >
                            ₹{item.price}
                          </Typography>
                          <Typography
                            sx={{
                              fontSize: "12px",
                              textDecoration: "line-through",
                              color: "#999"
                            }}
                          >
                            ₹{Math.round(item.price * 1.15)}
                          </Typography>
                          <Chip
                            label={`${item.discount}% OFF`}
                            size="small"
                            sx={{
                              backgroundColor: "#ff512f",
                              color: "white",
                              fontWeight: 600,
                              height: "20px",
                              fontSize: "11px"
                            }}
                          />
                        </Box>
                      </Grid>

                      {/* QUANTITY SELECTOR */}
                      <Grid item xs={6} sm="auto">
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            backgroundColor: "#f5f5f5",
                            borderRadius: 1,
                            p: 0.5
                          }}
                        >
                          <IconButton
                            size="small"
                            onClick={() =>
                              handleQuantityChange(item.id, item.quantity - 1)
                            }
                            sx={{
                              color: "#667eea",
                              padding: "4px",
                              "&:hover": {
                                backgroundColor: "#f0f0f0"
                              }
                            }}
                          >
                            <RemoveIcon fontSize="small" />
                          </IconButton>
                          <Typography
                            sx={{
                              px: 1,
                              fontWeight: 600,
                              minWidth: "24px",
                              textAlign: "center",
                              fontSize: "13px"
                            }}
                          >
                            {item.quantity}
                          </Typography>
                          <IconButton
                            size="small"
                            onClick={() =>
                              handleQuantityChange(item.id, item.quantity + 1)
                            }
                            sx={{
                              color: "#667eea",
                              padding: "4px",
                              "&:hover": {
                                backgroundColor: "#f0f0f0"
                              }
                            }}
                          >
                            <AddIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      </Grid>

                      {/* REMOVE BUTTON */}
                      <Grid item xs={6} sm="auto" sx={{ textAlign: "right" }}>
                        <IconButton
                          color="error"
                          size="small"
                          onClick={() => setDeleteConfirm(item.id)}
                          sx={{
                            transition: "all 0.3s ease",
                            padding: "6px",
                            "&:hover": {
                              backgroundColor: "rgba(244, 67, 54, 0.1)"
                            }
                          }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Grid>
                    </Grid>
                  </Card>
                ))}
              </Box>
            </Grid>

            {/* PRICE SUMMARY */}
            <Grid item xs={12} md={4}>
              <Card
                sx={{
                  p: 3,
                  borderRadius: 3,
                  position: "sticky",
                  top: "80px",
                  border: "1px solid rgba(0, 0, 0, 0.08)"
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 700,
                    mb: 2
                  }}
                >
                  Price Details
                </Typography>

                <Divider sx={{ mb: 2 }} />

                {/* SUBTOTAL */}
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 1.5
                  }}
                >
                  <Typography sx={{ color: "#666" }}>Subtotal</Typography>
                  <Typography sx={{ fontWeight: 600 }}>₹{subtotal}</Typography>
                </Box>

                {/* SAVINGS */}
                {savings > 0 && (
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mb: 1.5,
                      color: "#4caf50"
                    }}
                  >
                    <Typography>Discount</Typography>
                    <Typography sx={{ fontWeight: 600 }}>-₹{savings}</Typography>
                  </Box>
                )}

                {/* SHIPPING */}
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 2,
                    color: shipping === 0 ? "#4caf50" : "#666"
                  }}
                >
                  <Typography>Shipping</Typography>
                  <Typography sx={{ fontWeight: 600 }}>
                    {shipping === 0 ? "FREE" : `₹${shipping}`}
                  </Typography>
                </Box>

                {/* PROMO CODE */}
                <Box sx={{ mb: 2 }}>
                  <Box sx={{ display: "flex", gap: 1, mb: 1 }}>
                    <TextField
                      size="small"
                      placeholder="Promo code"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      disabled={promoApplied}
                      sx={{
                        flex: 1,
                        "& .MuiOutlinedInput-root": {
                          borderRadius: "8px"
                        }
                      }}
                    />
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={handlePromoApply}
                      disabled={promoApplied}
                      sx={{
                        borderColor: "#667eea",
                        color: "#667eea"
                      }}
                    >
                      Apply
                    </Button>
                  </Box>

                  {promoApplied && (
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        mb: 1.5,
                        color: "#4caf50"
                      }}
                    >
                      <Typography sx={{ fontSize: "14px" }}>
                        <CardGiftcardIcon
                          sx={{ fontSize: "16px", mr: 0.5, verticalAlign: "middle" }}
                        />
                        Promo Discount (5%)
                      </Typography>
                      <Typography sx={{ fontWeight: 600 }}>
                        -₹{promoDiscount.toFixed(0)}
                      </Typography>
                    </Box>
                  )}
                </Box>

                <Divider sx={{ mb: 2 }} />

                {/* TOTAL */}
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 3,
                    p: 1.5,
                    backgroundColor: "#f5f5f5",
                    borderRadius: 1
                  }}
                >
                  <Typography sx={{ fontWeight: 700, fontSize: "16px" }}>
                    Total Amount
                  </Typography>
                  <Typography
                    sx={{
                      fontWeight: 700,
                      fontSize: "18px",
                      color: "#667eea"
                    }}
                  >
                    ₹{total.toFixed(0)}
                  </Typography>
                </Box>

                {/* CHECKOUT BUTTON */}
                <Button
                  variant="contained"
                  fullWidth
                  size="large"
                  onClick={() => navigate("/user/checkout")}
                  sx={{
                    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    py: 1.5,
                    fontWeight: 700,
                    borderRadius: "12px",
                    textTransform: "none",
                    mb: 2,
                    transition: "all 0.3s ease",
                    "&:hover": {
                      transform: "translateY(-3px)",
                      boxShadow: "0 12px 24px rgba(102, 126, 234, 0.4)"
                    }
                  }}
                >
                  Proceed to Checkout
                </Button>

                {/* CONTINUE SHOPPING */}
                <Button
                  variant="outlined"
                  fullWidth
                  onClick={() => navigate("/user/products")}
                  sx={{
                    borderColor: "#667eea",
                    color: "#667eea",
                    fontWeight: 600,
                    borderRadius: "12px",
                    textTransform: "none",
                    "&:hover": {
                      backgroundColor: "rgba(102, 126, 234, 0.05)"
                    }
                  }}
                >
                  Continue Shopping
                </Button>

                {/* INFO BOX */}
                <Alert
                  severity="info"
                  sx={{ mt: 2, borderRadius: 1 }}
                  icon={<ShoppingBagIcon />}
                >
                  <Typography sx={{ fontSize: "13px" }}>
                    ✨ Free delivery on orders above ₹1000!
                  </Typography>
                </Alert>
              </Card>
            </Grid>
          </Grid>
        ) : (
          /* EMPTY CART */
          <Card
            sx={{
              p: 6,
              textAlign: "center",
              borderRadius: 3,
              border: "1px solid rgba(0, 0, 0, 0.08)"
            }}
          >
            <ShoppingBagIcon
              sx={{
                fontSize: "80px",
                color: "#ddd",
                mb: 2
              }}
            />
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
              Your Cart is Empty
            </Typography>
            <Typography color="text.secondary" sx={{ mb: 3 }}>
              Add some amazing products to get started!
            </Typography>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate("/user/products")}
              sx={{
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                borderRadius: "12px",
                textTransform: "none",
                fontWeight: 700
              }}
            >
              Start Shopping
            </Button>
          </Card>
        )}

        {/* DELETE CONFIRMATION DIALOG */}
        <Dialog open={Boolean(deleteConfirm)} onClose={() => setDeleteConfirm(null)}>
          <DialogTitle sx={{ fontWeight: 700 }}>Remove Item?</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to remove this item from your cart?
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteConfirm(null)}>Cancel</Button>
            <Button
              onClick={() => handleRemove(deleteConfirm)}
              color="error"
              variant="contained"
            >
              Remove
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
}

export default Cart;
