const express = require("express");
const router = express.Router();

const {
  getDashboardStats,
  getAllUsers,
  deleteUser,
  updateUserRole,
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  getAllOrders,
  createOrder,
  getUserOrders,
  getOrderDetails,
  updateOrderStatus
} = require("../controllers/admin.controller");

// Dashboard
router.get("/dashboard/stats", getDashboardStats);

// Users Management
router.get("/users", getAllUsers);
router.delete("/users/:id", deleteUser);
router.put("/users/:id/role", updateUserRole);

// Products Management
router.get("/products", getAllProducts);
router.get("/products/:id", getProductById);
router.post("/products", createProduct);
router.put("/products/:id", updateProduct);
router.delete("/products/:id", deleteProduct);

// Categories Management
router.get("/categories", getAllCategories);
router.post("/categories", createCategory);
router.put("/categories/:id", updateCategory);
router.delete("/categories/:id", deleteCategory);

// Orders Management
router.post("/orders", createOrder);
router.get("/orders", getAllOrders);
router.get("/orders/:orderId", getOrderDetails);
router.get("/user/:userId/orders", getUserOrders);
router.put("/orders/:id/status", updateOrderStatus);

module.exports = router;
