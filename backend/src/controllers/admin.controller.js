const pool = require("../config/db");

/* ===================== DASHBOARD STATS ===================== */
exports.getDashboardStats = async (req, res) => {
  try {
    let users = 0, categories = 0, products = 0, orders = 0;

    // Get total users
    try {
      const [userCount] = await pool.query("SELECT COUNT(*) as count FROM users");
      users = userCount[0]?.count || 0;
    } catch (err) {
      console.error("Error counting users:", err.message);
    }
    
    // Get total categories
    try {
      const [categoryCount] = await pool.query("SELECT COUNT(*) as count FROM categories");
      categories = categoryCount[0]?.count || 0;
    } catch (err) {
      console.error("Error counting categories:", err.message);
    }
    
    // Get total products
    try {
      const [productCount] = await pool.query("SELECT COUNT(*) as count FROM products");
      products = productCount[0]?.count || 0;
    } catch (err) {
      console.error("Error counting products:", err.message);
    }
    
    // Get total orders
    try {
      const [orderCount] = await pool.query("SELECT COUNT(*) as count FROM orders");
      orders = orderCount[0]?.count || 0;
    } catch (err) {
      console.error("Error counting orders:", err.message);
    }

    res.status(200).json({
      users,
      categories,
      products,
      orders
    });

  } catch (error) {
    console.error("DASHBOARD STATS ERROR:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/* ===================== MANAGE USERS ===================== */
exports.getAllUsers = async (req, res) => {
  try {
    const [users] = await pool.query("SELECT id, name, email, role, created_at FROM users");
    res.status(200).json(users);
  } catch (error) {
    console.error("GET USERS ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    
    const [result] = await pool.query("DELETE FROM users WHERE id = ?", [id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("DELETE USER ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;
    
    if (!["user", "admin"].includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }
    
    const [result] = await pool.query("UPDATE users SET role = ? WHERE id = ?", [role, id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    
    res.status(200).json({ message: "User role updated successfully" });
  } catch (error) {
    console.error("UPDATE USER ROLE ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/* ===================== MANAGE PRODUCTS ===================== */
exports.getAllProducts = async (req, res) => {
  try {
    const [products] = await pool.query(
      "SELECT p.*, c.name as category_name FROM products p LEFT JOIN categories c ON p.category_id = c.id"
    );
    res.status(200).json(products);
  } catch (error) {
    console.error("GET PRODUCTS ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const [products] = await pool.query(
      "SELECT p.*, c.name as category_name FROM products p LEFT JOIN categories c ON p.category_id = c.id WHERE p.id = ?",
      [id]
    );

    if (!products || products.length === 0) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json(products[0]);
  } catch (error) {
    console.error("GET PRODUCT BY ID ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.createProduct = async (req, res) => {
  try {
    const { name, description, price, category_id, image, rating, reviews, badge, stock } = req.body;
    
    if (!name || !price || !category_id) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    
    const [result] = await pool.query(
      "INSERT INTO products (name, description, price, category_id, image, rating, reviews, badge, stock) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [name, description, price, category_id, image, rating || 0, reviews || 0, badge || null, stock || 0]
    );
    
    res.status(201).json({
      message: "Product created successfully",
      productId: result.insertId
    });
  } catch (error) {
    console.error("CREATE PRODUCT ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, category_id, image, rating, reviews, badge, stock } = req.body;
    
    const [result] = await pool.query(
      "UPDATE products SET name=?, description=?, price=?, category_id=?, image=?, rating=?, reviews=?, badge=?, stock=? WHERE id=?",
      [name, description, price, category_id, image, rating, reviews, badge, stock, id]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Product not found" });
    }
    
    res.status(200).json({ message: "Product updated successfully" });
  } catch (error) {
    console.error("UPDATE PRODUCT ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    
    const [result] = await pool.query("DELETE FROM products WHERE id = ?", [id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Product not found" });
    }
    
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("DELETE PRODUCT ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/* ===================== MANAGE CATEGORIES ===================== */
exports.getAllCategories = async (req, res) => {
  try {
    const [categories] = await pool.query("SELECT * FROM categories");
    res.status(200).json(categories);
  } catch (error) {
    console.error("GET CATEGORIES ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    
    if (!name) {
      return res.status(400).json({ message: "Category name is required" });
    }
    
    const [result] = await pool.query(
      "INSERT INTO categories (name, description) VALUES (?, ?)",
      [name, description || null]
    );
    
    res.status(201).json({
      message: "Category created successfully",
      categoryId: result.insertId
    });
  } catch (error) {
    console.error("CREATE CATEGORY ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;
    
    const [result] = await pool.query(
      "UPDATE categories SET name=?, description=? WHERE id=?",
      [name, description, id]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Category not found" });
    }
    
    res.status(200).json({ message: "Category updated successfully" });
  } catch (error) {
    console.error("UPDATE CATEGORY ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    
    const [result] = await pool.query("DELETE FROM categories WHERE id = ?", [id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Category not found" });
    }
    
    res.status(200).json({ message: "Category deleted successfully" });
  } catch (error) {
    console.error("DELETE CATEGORY ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/* ===================== MANAGE ORDERS ===================== */
exports.createOrder = async (req, res) => {
  try {
    console.log("POST /admin/orders - Creating order...");
    console.log("Request body:", req.body);
    
    const { user_id, items, total_amount, shipping_address, payment_method } = req.body;
    
    if (!user_id || !items || !total_amount) {
      console.log("Missing fields - user_id:", user_id, "items:", items, "total_amount:", total_amount);
      return res.status(400).json({ message: "Missing required fields" });
    }
    
    // Insert order
    const [orderResult] = await pool.query(
      "INSERT INTO orders (user_id, total_amount, status, shipping_address, payment_method) VALUES (?, ?, ?, ?, ?)",
      [user_id, total_amount, 'pending', shipping_address || null, payment_method || 'cod']
    );
    
    const orderId = orderResult.insertId;
    console.log("Order created with ID:", orderId);
    
    // Insert order items
    for (const item of items) {
      await pool.query(
        "INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)",
        [orderId, item.id, item.quantity, item.price]
      );
    }
    
    console.log("Order items inserted successfully");
    res.status(201).json({
      message: "Order created successfully",
      orderId: orderId
    });
  } catch (error) {
    console.error("CREATE ORDER ERROR:", error);
    res.status(500).json({ message: "Server error: " + error.message });
  }
};

exports.getUserOrders = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const [orders] = await pool.query(
      "SELECT o.* FROM orders o WHERE o.user_id = ? ORDER BY o.created_at DESC",
      [userId]
    );
    
    res.status(200).json(orders);
  } catch (error) {
    console.error("GET USER ORDERS ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getOrderDetails = async (req, res) => {
  try {
    const { orderId } = req.params;
    
    const [order] = await pool.query(
      "SELECT o.* FROM orders o WHERE o.id = ?",
      [orderId]
    );
    
    if (!order || order.length === 0) {
      return res.status(404).json({ message: "Order not found" });
    }
    
    const [items] = await pool.query(
      "SELECT oi.*, p.name as product_name FROM order_items oi LEFT JOIN products p ON oi.product_id = p.id WHERE oi.order_id = ?",
      [orderId]
    );
    
    res.status(200).json({
      ...order[0],
      items: items
    });
  } catch (error) {
    console.error("GET ORDER DETAILS ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    const [orders] = await pool.query(
      "SELECT o.*, u.name as user_name, u.email FROM orders o LEFT JOIN users u ON o.user_id = u.id"
    );
    res.status(200).json(orders);
  } catch (error) {
    console.error("GET ORDERS ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const validStatuses = ['pending', 'confirmed', 'shipped', 'delivered'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }
    
    const [result] = await pool.query("UPDATE orders SET status = ? WHERE id = ?", [status, id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Order not found" });
    }
    
    res.status(200).json({ message: "Order status updated successfully" });
  } catch (error) {
    console.error("UPDATE ORDER STATUS ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};
