import React, { useState, useEffect } from "react";
import { 
  Grid, 
  Paper, 
  Typography, 
  Box, 
  CircularProgress,
  Card,
  CardContent,
  LinearProgress,
  Chip,
  Avatar,
  Stack
} from "@mui/material";
import PeopleIcon from "@mui/icons-material/People";
import CategoryIcon from "@mui/icons-material/Category";
import InventoryIcon from "@mui/icons-material/Inventory";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import api from "../../services/api";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function Dashboard() {
  const [stats, setStats] = useState({
    users: 0,
    categories: 0,
    products: 0,
    orders: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [animatedStats, setAnimatedStats] = useState({
    users: 0,
    categories: 0,
    products: 0,
    orders: 0
  });
  const [ordersByStatus, setOrdersByStatus] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  // Animate numbers counting up
  useEffect(() => {
    if (!loading && stats.users > 0) {
      const duration = 1500; // 1.5 seconds
      const steps = 60;
      const interval = duration / steps;
      
      let currentStep = 0;
      const timer = setInterval(() => {
        currentStep++;
        const progress = currentStep / steps;
        
        setAnimatedStats({
          users: Math.floor(stats.users * progress),
          categories: Math.floor(stats.categories * progress),
          products: Math.floor(stats.products * progress),
          orders: Math.floor(stats.orders * progress)
        });
        
        if (currentStep >= steps) {
          clearInterval(timer);
          setAnimatedStats(stats);
        }
      }, interval);
      
      return () => clearInterval(timer);
    }
  }, [stats, loading]);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const [statsRes, ordersRes] = await Promise.all([
        api.get("/admin/dashboard/stats"),
        api.get("/admin/orders")
      ]);
      
      setStats(statsRes.data);
      
      // Process orders for charts
      if (ordersRes.data) {
        setRecentOrders(ordersRes.data.slice(0, 7).reverse());
        
        // Count orders by status
        const statusCount = ordersRes.data.reduce((acc, order) => {
          acc[order.status] = (acc[order.status] || 0) + 1;
          return acc;
        }, {});
        
        setOrdersByStatus([
          { status: 'pending', count: statusCount.pending || 0 },
          { status: 'confirmed', count: statusCount.confirmed || 0 },
          { status: 'shipped', count: statusCount.shipped || 0 },
          { status: 'delivered', count: statusCount.delivered || 0 }
        ]);
      }
      
      setError("");
    } catch (err) {
      console.error("Error fetching stats:", err);
      setError(err.response?.data?.message || err.message || "Failed to load dashboard stats");
    } finally {
      setLoading(false);
    }
  };

  const statItems = [
    { 
      title: "Total Users", 
      count: animatedStats.users,
      icon: PeopleIcon,
      color: "#667eea",
      gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      trend: "+12%",
      trendUp: true,
      subtitle: "Active customers"
    },
    { 
      title: "Categories", 
      count: animatedStats.categories,
      icon: CategoryIcon,
      color: "#f093fb",
      gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
      trend: "+5%",
      trendUp: true,
      subtitle: "Product types"
    },
    { 
      title: "Products", 
      count: animatedStats.products,
      icon: InventoryIcon,
      color: "#4facfe",
      gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
      trend: "+8%",
      trendUp: true,
      subtitle: "In inventory"
    },
    { 
      title: "Orders", 
      count: animatedStats.orders,
      icon: ShoppingCartIcon,
      color: "#43e97b",
      gradient: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
      trend: "+23%",
      trendUp: true,
      subtitle: "Total orders"
    }
  ];

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress size={60} sx={{ color: "#667eea" }} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box>
      {/* Welcome Header */}
      <Box sx={{ mb: 4 }}>
        <Typography 
          variant="h4" 
          sx={{ 
            fontWeight: 800, 
            mb: 1,
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text"
          }}
        >
          Dashboard Overview
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Welcome back! Here's what's happening with your store today.
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3}>
        {statItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <Grid item xs={12} sm={6} md={3} key={item.title}>
              <Card
                elevation={0}
                sx={{
                  borderRadius: 3,
                  border: "1px solid #f0f0f0",
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  position: "relative",
                  overflow: "hidden",
                  "&:hover": {
                    transform: "translateY(-8px)",
                    boxShadow: "0 12px 40px rgba(0, 0, 0, 0.12)",
                    borderColor: item.color,
                  },
                  animation: `fadeInUp 0.5s ease ${index * 0.1}s both`,
                  "@keyframes fadeInUp": {
                    from: {
                      opacity: 0,
                      transform: "translateY(20px)"
                    },
                    to: {
                      opacity: 1,
                      transform: "translateY(0)"
                    }
                  }
                }}
              >
                {/* Gradient accent bar */}
                <Box
                  sx={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 4,
                    background: item.gradient
                  }}
                />
                
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
                    <Box>
                      <Typography 
                        variant="body2" 
                        color="text.secondary" 
                        sx={{ fontWeight: 600, mb: 0.5, fontSize: "13px" }}
                      >
                        {item.title}
                      </Typography>
                      <Typography 
                        variant="h3" 
                        sx={{ 
                          fontWeight: 800,
                          background: item.gradient,
                          WebkitBackgroundClip: "text",
                          WebkitTextFillColor: "transparent",
                          backgroundClip: "text"
                        }}
                      >
                        {item.count}
                      </Typography>
                    </Box>
                    
                    <Avatar
                      sx={{
                        background: item.gradient,
                        width: 56,
                        height: 56,
                        boxShadow: `0 4px 14px ${item.color}40`
                      }}
                    >
                      <Icon sx={{ fontSize: 28 }} />
                    </Avatar>
                  </Box>

                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Chip
                      icon={item.trendUp ? <TrendingUpIcon /> : <TrendingDownIcon />}
                      label={item.trend}
                      size="small"
                      sx={{
                        backgroundColor: item.trendUp ? "#e8f5e9" : "#ffebee",
                        color: item.trendUp ? "#2e7d32" : "#c62828",
                        fontWeight: 700,
                        fontSize: "11px",
                        height: 24,
                        "& .MuiChip-icon": {
                          fontSize: 14
                        }
                      }}
                    />
                    <Typography variant="caption" color="text.secondary" sx={{ fontSize: "12px" }}>
                      {item.subtitle}
                    </Typography>
                  </Box>

                  {/* Progress bar */}
                  <LinearProgress
                    variant="determinate"
                    value={75}
                    sx={{
                      mt: 2,
                      height: 6,
                      borderRadius: 3,
                      backgroundColor: "#f5f5f5",
                      "& .MuiLinearProgress-bar": {
                        background: item.gradient,
                        borderRadius: 3
                      }
                    }}
                  />
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {/* Quick Stats Summary */}
      <Grid container spacing={3} sx={{ mt: 3 }}>
        <Grid item xs={12}>
          <Card
            elevation={0}
            sx={{
              borderRadius: 3,
              border: "1px solid #f0f0f0",
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              color: "white",
              p: 4
            }}
          >
            <Grid container spacing={3} alignItems="center">
              <Grid item xs={12} md={8}>
                <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
                  🎉 Your store is performing great!
                </Typography>
                <Typography variant="body1" sx={{ opacity: 0.95 }}>
                  You have {stats.products} products across {stats.categories} categories, serving {stats.users} customers with {stats.orders} orders completed.
                </Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <Stack spacing={1}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>Products</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 700 }}>{stats.products}</Typography>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={(stats.products / 100) * 100} 
                    sx={{
                      height: 8,
                      borderRadius: 4,
                      backgroundColor: "rgba(255,255,255,0.2)",
                      "& .MuiLinearProgress-bar": {
                        backgroundColor: "white",
                        borderRadius: 4
                      }
                    }}
                  />
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>Orders</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 700 }}>{stats.orders}</Typography>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={(stats.orders / 50) * 100} 
                    sx={{
                      height: 8,
                      borderRadius: 4,
                      backgroundColor: "rgba(255,255,255,0.2)",
                      "& .MuiLinearProgress-bar": {
                        backgroundColor: "white",
                        borderRadius: 4
                      }
                    }}
                  />
                </Stack>
              </Grid>
            </Grid>
          </Card>
        </Grid>
      </Grid>

      {/* Charts Section */}
      <Grid container spacing={3} sx={{ mt: 5 }}>
        {/* Order Status Distribution - Doughnut Chart */}
        <Grid item xs={12} md={4}>
          <Card 
            elevation={0} 
            sx={{ 
              borderRadius: 3, 
              border: "1px solid #e8e8e8",
              p: 3,
              background: "#fafbfc",
              transition: "all 0.3s ease",
              "&:hover": {
                boxShadow: "0 8px 32px rgba(0, 0, 0, 0.08)",
                borderColor: "#667eea"
              }
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
              <Box 
                sx={{
                  width: 12,
                  height: 12,
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                }}
              />
              <Typography variant="h6" sx={{ fontWeight: 700, color: "#1a1a1a" }}>
                Order Status Distribution
              </Typography>
            </Box>
            <Box sx={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Doughnut
                data={{
                  labels: ['Pending', 'Confirmed', 'Shipped', 'Delivered'],
                  datasets: [{
                    data: ordersByStatus.map(o => o.count),
                    backgroundColor: [
                      '#FF6B6B',
                      '#4ECDC4',
                      '#45B7D1',
                      '#96CEB4'
                    ],
                    borderColor: '#fff',
                    borderWidth: 3,
                    hoverOffset: 12,
                    hoverBorderColor: 'rgba(0,0,0,0.1)',
                    hoverBorderWidth: 2
                  }]
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'bottom',
                      labels: {
                        padding: 20,
                        font: {
                          size: 12,
                          weight: 600,
                          family: "'Inter', sans-serif"
                        },
                        color: '#666',
                        generateLabels: function(chart) {
                          const data = chart.data;
                          return data.labels.map((label, i) => ({
                            text: label,
                            fillStyle: data.datasets[0].backgroundColor[i],
                            hidden: false,
                            index: i
                          }));
                        }
                      }
                    },
                    tooltip: {
                      backgroundColor: 'rgba(0, 0, 0, 0.9)',
                      padding: 16,
                      cornerRadius: 8,
                      titleFont: { size: 14, weight: 'bold', family: "'Inter', sans-serif" },
                      bodyFont: { size: 13, family: "'Inter', sans-serif" },
                      displayColors: true,
                      borderColor: 'rgba(255,255,255,0.1)',
                      borderWidth: 1,
                      callbacks: {
                        label: function(context) {
                          return 'Orders: ' + context.parsed;
                        }
                      }
                    }
                  }
                }}
              />
            </Box>
          </Card>
        </Grid>

        {/* Recent Orders Trend - Line Chart */}
        <Grid item xs={12} md={8}>
          <Card 
            elevation={0} 
            sx={{ 
              borderRadius: 3, 
              border: "1px solid #e8e8e8",
              p: 3,
              background: "#fafbfc",
              transition: "all 0.3s ease",
              "&:hover": {
                boxShadow: "0 8px 32px rgba(0, 0, 0, 0.08)",
                borderColor: "#667eea"
              }
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
              <Box 
                sx={{
                  width: 12,
                  height: 12,
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                }}
              />
              <Typography variant="h6" sx={{ fontWeight: 700, color: "#1a1a1a" }}>
                Recent Orders Trend
              </Typography>
            </Box>
            <Box sx={{ height: 300 }}>
              <Line
                data={{
                  labels: recentOrders.map((o, i) => `Day ${i + 1}`),
                  datasets: [{
                    label: 'Order Amount (₹)',
                    data: recentOrders.map(o => o.total_amount || 0),
                    borderColor: '#667eea',
                    backgroundColor: 'rgba(102, 126, 234, 0.08)',
                    fill: true,
                    tension: 0.5,
                    pointBackgroundColor: '#667eea',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 3,
                    pointRadius: 6,
                    pointHoverRadius: 8,
                    pointHoverBorderWidth: 4,
                    borderWidth: 3,
                    segment: {
                      borderDash: []
                    }
                  }]
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  interaction: {
                    intersect: false,
                    mode: 'index'
                  },
                  plugins: {
                    legend: {
                      display: true,
                      position: 'top',
                      labels: {
                        font: { size: 13, weight: 600, family: "'Inter', sans-serif" },
                        padding: 20,
                        color: '#666',
                        usePointStyle: true,
                        pointStyle: 'circle'
                      }
                    },
                    filler: {
                      propagate: true
                    },
                    tooltip: {
                      backgroundColor: 'rgba(0, 0, 0, 0.9)',
                      padding: 16,
                      cornerRadius: 8,
                      titleFont: { size: 14, weight: 'bold', family: "'Inter', sans-serif" },
                      bodyFont: { size: 13, family: "'Inter', sans-serif" },
                      borderColor: 'rgba(255,255,255,0.1)',
                      borderWidth: 1,
                      displayColors: true,
                      callbacks: {
                        label: function(context) {
                          return 'Amount: ₹' + Math.round(context.parsed.y).toLocaleString();
                        }
                      }
                    }
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      grid: {
                        color: 'rgba(200, 200, 200, 0.08)',
                        drawBorder: true,
                        lineWidth: 1
                      },
                      ticks: {
                        callback: function(value) {
                          return '₹' + (value / 1000).toFixed(0) + 'k';
                        },
                        font: { size: 12, weight: 500, family: "'Inter', sans-serif" },
                        color: '#666',
                        padding: 12
                      }
                    },
                    x: {
                      grid: {
                        display: false,
                        drawBorder: false
                      },
                      ticks: {
                        font: { size: 12, weight: 500, family: "'Inter', sans-serif" },
                        color: '#666',
                        padding: 12
                      }
                    }
                  }
                }}
              />
            </Box>
          </Card>
        </Grid>

        {/* Stats Comparison - Bar Chart */}
        <Grid item xs={12}>
          <Card 
            elevation={0} 
            sx={{ 
              borderRadius: 3, 
              border: "1px solid #e8e8e8",
              p: 3,
              background: "#fafbfc",
              transition: "all 0.3s ease",
              "&:hover": {
                boxShadow: "0 8px 32px rgba(0, 0, 0, 0.08)",
                borderColor: "#667eea"
              }
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
              <Box 
                sx={{
                  width: 12,
                  height: 12,
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                }}
              />
              <Typography variant="h6" sx={{ fontWeight: 700, color: "#1a1a1a" }}>
                Platform Statistics Overview
              </Typography>
            </Box>
            <Box sx={{ height: 350 }}>
              <Bar
                data={{
                  labels: ['Users', 'Categories', 'Products', 'Orders'],
                  datasets: [{
                    label: 'Count',
                    data: [stats.users, stats.categories, stats.products, stats.orders],
                    backgroundColor: [
                      'linear-gradient(180deg, #667eea 0%, #764ba2 100%)',
                      'linear-gradient(180deg, #f093fb 0%, #f5576c 100%)',
                      'linear-gradient(180deg, #4facfe 0%, #00f2fe 100%)',
                      'linear-gradient(180deg, #43e97b 0%, #38f9d7 100%)'
                    ],
                    borderRadius: 10,
                    borderSkipped: false,
                    barThickness: 50,
                    hoverBackgroundColor: 'rgba(0,0,0,0.1)',
                    borderColor: 'transparent'
                  }]
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      display: false
                    },
                    tooltip: {
                      backgroundColor: 'rgba(0, 0, 0, 0.9)',
                      padding: 16,
                      cornerRadius: 8,
                      titleFont: { size: 14, weight: 'bold', family: "'Inter', sans-serif" },
                      bodyFont: { size: 13, family: "'Inter', sans-serif" },
                      borderColor: 'rgba(255,255,255,0.1)',
                      borderWidth: 1,
                      displayColors: false,
                      callbacks: {
                        label: function(context) {
                          return 'Total: ' + context.parsed.y;
                        }
                      }
                    }
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      grid: {
                        color: 'rgba(200, 200, 200, 0.08)',
                        drawBorder: true,
                        lineWidth: 1
                      },
                      ticks: {
                        font: { size: 12, weight: 500, family: "'Inter', sans-serif" },
                        color: '#666',
                        padding: 12
                      }
                    },
                    x: {
                      grid: {
                        display: false,
                        drawBorder: false
                      },
                      ticks: {
                        font: { size: 13, weight: 600, family: "'Inter', sans-serif" },
                        color: '#1a1a1a',
                        padding: 12
                      }
                    }
                  }
                }}
              />
            </Box>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Dashboard;
