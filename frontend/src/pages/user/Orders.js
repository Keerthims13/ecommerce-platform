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
  Chip,
  Button,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

function Orders() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [openDetails, setOpenDetails] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);

  // Get user ID from localStorage
  const userData = JSON.parse(localStorage.getItem("user") || "{}");
  const userId = userData.id;

  useEffect(() => {
    if (userId) {
      fetchOrders();
    } else {
      setError("Please log in to view your orders");
      setLoading(false);
    }
  }, [userId]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/admin/user/${userId}/orders`);
      setOrders(response.data || []);
      setError("");
    } catch (err) {
      console.error("Error fetching orders:", err);
      setError("Failed to load orders. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = async (order) => {
    try {
      setDetailsLoading(true);
      const response = await api.get(`/admin/orders/${order.id}`);
      setOrderDetails(response.data);
      setSelectedOrder(order);
      setOpenDetails(true);
    } catch (err) {
      console.error("Error fetching order details:", err);
      setError("Failed to load order details");
    } finally {
      setDetailsLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "delivered":
        return "success";
      case "shipped":
        return "info";
      case "confirmed":
        return "primary";
      case "pending":
        return "warning";
      default:
        return "default";
    }
  };

  const formatStatus = (status) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric"
    });
  };

  if (loading) {
    return (
      <Box sx={{ p: 4, textAlign: "center" }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h5" fontWeight="bold" mb={3}>
        My Orders
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      {orders.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: "center" }}>
          <Typography color="text.secondary" sx={{ mb: 2 }}>
            You haven't placed any orders yet.
          </Typography>
          <Button
            variant="contained"
            onClick={() => navigate("/user/products")}
            sx={{
              backgroundColor: "var(--primary)",
              "&:hover": { backgroundColor: "var(--primary-dark)" }
            }}
          >
            Start Shopping
          </Button>
        </Paper>
      ) : (
        <Paper elevation={3}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: "var(--gray-100)" }}>
                <TableCell fontWeight="bold">Order ID</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Total Amount</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Action</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell fontWeight="bold">#{order.id}</TableCell>
                  <TableCell>{formatDate(order.created_at)}</TableCell>
                  <TableCell>₹{parseFloat(order.total_amount).toLocaleString()}</TableCell>
                  <TableCell>
                    <Chip
                      label={formatStatus(order.status)}
                      color={getStatusColor(order.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => handleViewDetails(order)}
                      sx={{
                        borderColor: "var(--primary)",
                        color: "var(--primary)",
                        textTransform: "none",
                        "&:hover": {
                          borderColor: "var(--primary-dark)",
                          backgroundColor: "rgba(30, 64, 175, 0.05)"
                        }
                      }}
                    >
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      )}

      {/* ORDER DETAILS DIALOG */}
      <Dialog open={openDetails} onClose={() => setOpenDetails(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Order Details</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          {detailsLoading ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 3 }}>
              <CircularProgress />
            </Box>
          ) : orderDetails ? (
            <Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Order ID: <strong>#{orderDetails.id}</strong>
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                  Date: <strong>{formatDate(orderDetails.created_at)}</strong>
                </Typography>
              </Box>

              <Typography variant="subtitle2" fontWeight="bold" sx={{ mt: 2, mb: 1 }}>
                Items:
              </Typography>
              {orderDetails.items && orderDetails.items.length > 0 ? (
                <Box sx={{ mb: 2, p: 1, backgroundColor: "#f5f5f5", borderRadius: 1 }}>
                  {orderDetails.items.map((item) => (
                    <Box
                      key={item.id}
                      display="flex"
                      justifyContent="space-between"
                      sx={{ mb: 1 }}
                    >
                      <Typography variant="body2">
                        {item.product_name} (Qty: {item.quantity})
                      </Typography>
                      <Typography variant="body2" fontWeight="600">
                        ₹{(item.price * item.quantity).toLocaleString()}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              ) : null}

              <Typography variant="subtitle2" fontWeight="bold" sx={{ mt: 2, mb: 1 }}>
                Shipping Address:
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {orderDetails.shipping_address || "N/A"}
              </Typography>

              <Box sx={{ mt: 2, pt: 2, borderTop: "1px solid #ddd" }}>
                <Typography variant="h6" fontWeight="bold">
                  Total: ₹{parseFloat(orderDetails.total_amount).toLocaleString()}
                </Typography>
                <Chip
                  label={formatStatus(orderDetails.status)}
                  color={getStatusColor(orderDetails.status)}
                  sx={{ mt: 1 }}
                />
              </Box>
            </Box>
          ) : null}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setOpenDetails(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Orders;
