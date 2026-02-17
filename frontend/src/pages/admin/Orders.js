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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Select,
  MenuItem,
  CircularProgress,
  Alert,
  TablePagination
} from "@mui/material";
import api from "../../services/api";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [openStatusDialog, setOpenStatusDialog] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [newStatus, setNewStatus] = useState("");

  // Pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // Fetch orders on mount
  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await api.get("/admin/orders");
      setOrders(response.data);
      setError("");
    } catch (err) {
      console.error("Error fetching orders:", err);
      setError("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenStatusDialog = (order) => {
    setSelectedOrderId(order.id);
    setNewStatus(order.status);
    setOpenStatusDialog(true);
  };

  const handleUpdateStatus = async () => {
    try {
      await api.put(`/admin/orders/${selectedOrderId}/status`, {
        status: newStatus
      });

      // Update local state
      setOrders(
        orders.map((o) =>
          o.id === selectedOrderId ? { ...o, status: newStatus } : o
        )
      );

      setOpenStatusDialog(false);
      setSuccess("Order status updated successfully");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error("Error updating order status:", err);
      setError(err.response?.data?.message || "Failed to update order status");
    }
  };

  const getStatusColor = (status) => {
    if (status === "delivered") return "success";
    if (status === "shipped") return "info";
    if (status === "confirmed") return "primary";
    if (status === "pending") return "warning";
    return "default";
  };

  const formatStatus = (status) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress size={60} sx={{ color: "#43e97b" }} />
      </Box>
    );
  }

  const displayedOrders = orders.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Box sx={{ backgroundColor: "#f8f9fa", minHeight: "100vh", py: 4, px: { xs: 2, md: 0 } }}>
      {/* ALERTS */}
      {error && <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }}>{success}</Alert>}

      {/* HEADER SECTION */}
      <Box sx={{ mb: 5 }}>
        <Typography 
          variant="h4" 
          sx={{ 
            fontWeight: 800, 
            mb: 1,
            background: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text"
          }}
        >
          Orders Management
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ fontSize: "15px" }}>
          Total Orders: <strong>{orders.length}</strong> • Track and manage all customer orders
        </Typography>
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
                background: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
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
              <TableCell>Order ID</TableCell>
              <TableCell>Customer</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Total Amount</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Date</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {displayedOrders.length > 0 ? (
              displayedOrders.map((order) => (
                <TableRow 
                  key={order.id}
                  sx={{
                    borderBottom: "1px solid #e8e8e8",
                    transition: "all 0.2s ease",
                    "&:hover": {
                      backgroundColor: "#f0f7f5"
                    },
                    "& .MuiTableCell-body": {
                      padding: "14px 16px",
                      fontSize: "14px",
                      color: "#1a1a1a"
                    }
                  }}
                >
                  <TableCell sx={{ fontWeight: 600, color: "#43e97b" }}>#{order.id}</TableCell>
                  <TableCell>{order.user_name || "N/A"}</TableCell>
                  <TableCell>{order.email || "N/A"}</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>₹{parseFloat(order.total_amount).toLocaleString()}</TableCell>
                  <TableCell>
                    <Chip
                      label={formatStatus(order.status)}
                      color={getStatusColor(order.status)}
                      size="small"
                      sx={{
                        fontWeight: 700,
                        fontSize: "12px"
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    {new Date(order.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell align="right">
                    <Button
                      size="small"
                      onClick={() => handleOpenStatusDialog(order)}
                      sx={{
                        color: "#43e97b",
                        fontWeight: 600,
                        textTransform: "none",
                        border: "1.5px solid #43e97b",
                        borderRadius: 1,
                        "&:hover": { 
                          backgroundColor: "rgba(67, 233, 123, 0.1)",
                          borderColor: "#38f9d7"
                        }
                      }}
                    >
                      Update Status
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  No orders found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {/* PAGINATION */}
        {orders.length > 0 && (
          <TablePagination
            component="div"
            count={orders.length}
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

      {/* UPDATE STATUS DIALOG */}
      <Dialog 
        open={openStatusDialog} 
        onClose={() => setOpenStatusDialog(false)}
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: "0 20px 60px rgba(0, 0, 0, 0.15)"
          }
        }}
      >
        <DialogTitle sx={{ 
          background: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
          color: "white",
          fontWeight: 700,
          fontSize: "18px"
        }}>
          Update Order Status
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <Typography variant="body2" sx={{ mb: 2, mt: 1 }}>
            Order ID: <strong sx={{ color: "#43e97b" }}>#{selectedOrderId}</strong>
          </Typography>
          <Typography variant="body2" sx={{ mb: 2, fontWeight: 600 }}>
            Select new status:
          </Typography>
          <Select
            fullWidth
            value={newStatus}
            onChange={(e) => setNewStatus(e.target.value)}
            sx={{
              borderRadius: 2,
              "& .MuiOutlinedInput-root": {
                "&:hover fieldset": {
                  borderColor: "#43e97b"
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#43e97b",
                  boxShadow: "0 0 0 3px rgba(67, 233, 123, 0.1)"
                }
              }
            }}
          >
            <MenuItem value="pending">⏳ Pending</MenuItem>
            <MenuItem value="confirmed">✅ Confirmed</MenuItem>
            <MenuItem value="shipped">🚚 Shipped</MenuItem>
            <MenuItem value="delivered">📦 Delivered</MenuItem>
          </Select>
        </DialogContent>
        <DialogActions sx={{ p: 2, borderTop: "1px solid #e8e8e8" }}>
          <Button 
            onClick={() => setOpenStatusDialog(false)}
            sx={{ textTransform: "none", fontWeight: 600 }}
          >
            Cancel
          </Button>
          <Button 
            variant="contained" 
            onClick={handleUpdateStatus}
            sx={{
              background: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
              color: "white",
              fontWeight: 700,
              borderRadius: 2,
              textTransform: "none",
              boxShadow: "0 4px 15px rgba(67, 233, 123, 0.3)",
              "&:hover": {
                boxShadow: "0 6px 25px rgba(67, 233, 123, 0.4)",
                transform: "translateY(-2px)"
              }
            }}
          >
            Update Status
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Orders;
