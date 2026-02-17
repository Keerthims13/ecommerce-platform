import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Paper,
  TextField,
  Button,
  RadioGroup,
  FormControlLabel,
  Radio,
  Divider,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import api from "../../services/api";

function Checkout() {
  const navigate = useNavigate();
  const { cartItems, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successDialog, setSuccessDialog] = useState(false);
  const [orderId, setOrderId] = useState(null);

  // Form state
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [pincode, setPincode] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cod");

  // Get current user from localStorage
  const userData = JSON.parse(localStorage.getItem("user") || "{}");
  const userId = userData.id;

  useEffect(() => {
    if (!userId) return;

    setFullName(userData.name || "");
    setPhone(userData.phone || "");

    const storedProfile = JSON.parse(localStorage.getItem(`profile_${userId}`) || "null");
    if (storedProfile) {
      setPhone(storedProfile.phone || userData.phone || "");
      if (storedProfile.address) {
        setAddress(storedProfile.address || "");
      }
    }
  }, [userId]);

  // Calculate total
  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handlePlaceOrder = async () => {
    // Validation
    if (!fullName.trim() || !phone.trim() || !address.trim() || !city.trim() || !state.trim() || !pincode.trim()) {
      setError("Please fill in all shipping address fields");
      return;
    }

    if (!userId) {
      setError("Please log in first to place an order");
      return;
    }

    if (cartItems.length === 0) {
      setError("Your cart is empty");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const shippingAddress = `${address}, ${city}, ${state} - ${pincode}`;

      const response = await api.post("/admin/orders", {
        user_id: userId,
        items: cartItems.map(item => ({
          id: item.id,
          quantity: item.quantity,
          price: item.price
        })),
        total_amount: total,
        shipping_address: shippingAddress,
        payment_method: paymentMethod
      });

      // Clear cart and show success
      clearCart();
      setOrderId(response.data.orderId);
      setSuccessDialog(true);
      
    } catch (err) {
      console.error("Error placing order:", err);
      console.error("Error response:", err.response);
      console.error("Error data:", err.response?.data);
      setError(err.response?.data?.message || err.message || "Failed to place order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h5" fontWeight="bold" mb={3}>
        Checkout
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      <Grid container spacing={3}>
        {/* SHIPPING ADDRESS */}
        <Grid item xs={12} md={7}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight="bold" mb={2}>
              Shipping Address
            </Typography>

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Full Name"
                  fullWidth
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Phone Number"
                  fullWidth
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Address"
                  fullWidth
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  label="City"
                  fullWidth
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  label="State"
                  fullWidth
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  label="Pincode"
                  fullWidth
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                />
              </Grid>
            </Grid>

            <Typography variant="h6" fontWeight="bold" mt={4} mb={2}>
              Payment Method
            </Typography>

            <RadioGroup value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
              <FormControlLabel
                value="cod"
                control={<Radio />}
                label="Cash on Delivery"
              />
              <FormControlLabel
                value="card"
                control={<Radio />}
                label="Credit / Debit Card"
              />
              <FormControlLabel
                value="upi"
                control={<Radio />}
                label="UPI"
              />
            </RadioGroup>
          </Paper>
        </Grid>

        {/* ORDER SUMMARY */}
        <Grid item xs={12} md={5}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight="bold">
              Order Summary
            </Typography>

            <Divider sx={{ my: 2 }} />

            {cartItems.length > 0 ? (
              <>
                {cartItems.map((item) => (
                  <Box
                    key={item.id}
                    display="flex"
                    justifyContent="space-between"
                    mb={2}
                    pb={1}
                    borderBottom="1px solid #eee"
                  >
                    <Box>
                      <Typography variant="body2" fontWeight="600">
                        {item.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Qty: {item.quantity}
                      </Typography>
                    </Box>
                    <Typography fontWeight="600">
                      ₹{(item.price * item.quantity).toLocaleString()}
                    </Typography>
                  </Box>
                ))}

                <Divider sx={{ my: 2 }} />

                <Box display="flex" justifyContent="space-between" mb={3}>
                  <Typography fontWeight="bold">Total</Typography>
                  <Typography fontWeight="bold" variant="h6">
                    ₹{total.toLocaleString()}
                  </Typography>
                </Box>

                <Button
                  variant="contained"
                  fullWidth
                  size="large"
                  onClick={handlePlaceOrder}
                  disabled={loading}
                  sx={{
                    backgroundColor: "var(--primary)",
                    "&:hover": { backgroundColor: "var(--primary-dark)" }
                  }}
                >
                  {loading ? <CircularProgress size={24} /> : "Place Order"}
                </Button>
              </>
            ) : (
              <Box sx={{ py: 4, textAlign: "center" }}>
                <Typography color="text.secondary" sx={{ mb: 2 }}>
                  Your cart is empty
                </Typography>
                <Button
                  variant="contained"
                  onClick={() => navigate("/user/products")}
                  sx={{
                    backgroundColor: "var(--primary)",
                    "&:hover": { backgroundColor: "var(--primary-dark)" }
                  }}
                >
                  Continue Shopping
                </Button>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* SUCCESS DIALOG */}
      <Dialog open={successDialog} onClose={() => setSuccessDialog(false)}>
        <DialogTitle sx={{ fontSize: "18px", fontWeight: "bold" }}>
          ✓ Order Placed Successfully!
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Your order has been placed successfully.
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Order ID: <strong>#{orderId}</strong>
          </Typography>
          <Typography variant="body2" color="text.secondary">
            You can track your order status in "My Orders" section.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button
            variant="contained"
            onClick={() => {
              setSuccessDialog(false);
              navigate("/user/orders");
            }}
            sx={{
              backgroundColor: "var(--primary)",
              "&:hover": { backgroundColor: "var(--primary-dark)" }
            }}
          >
            View My Orders
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Checkout;
