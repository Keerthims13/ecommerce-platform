import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  Paper,
  Container,
  Chip,
  CircularProgress,
  Alert
} from "@mui/material";
import ProductCard from "../../components/user/ProductCard";
import SearchBar from "../../components/user/SearchBar";
import { useNavigate } from "react-router-dom";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import LockIcon from "@mui/icons-material/Lock";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import api from "../../services/api";
import "./Home.css";

function Home() {
  const navigate = useNavigate();
  
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch categories and products on mount
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [categoriesRes, productsRes] = await Promise.all([
        api.get("/admin/categories"),
        api.get("/admin/products")
      ]);
      setCategories(categoriesRes.data);
      setProducts(productsRes.data);
      console.log("Products fetched:", productsRes.data);
      setError("");
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  // Get first 4 products for featured section
  const featuredProducts = products.slice(0, 4);

  const features = [
    {
      icon: <LocalShippingIcon sx={{ fontSize: 40 }} />,
      title: "Free Delivery",
      description: "Free shipping on orders above ₹999"
    },
    {
      icon: <LockIcon sx={{ fontSize: 40 }} />,
      title: "Secure Payment",
      description: "100% safe & trusted payments"
    },
    {
      icon: <RestartAltIcon sx={{ fontSize: 40 }} />,
      title: "Easy Returns",
      description: "7-day easy return policy"
    },
    {
      icon: <SupportAgentIcon sx={{ fontSize: 40 }} />,
      title: "24/7 Support",
      description: "Always here to help you"
    }
  ];

  // Hero image
  const heroImage = "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1000&q=80";

  return (
    <Box className="home-container">
      {/* ================= HERO SECTION ================= */}
      <Box className="hero-section">
        <Container maxWidth="lg">
          <Grid container alignItems="center" spacing={4}>
            <Grid item xs={12} md={6}>
              <Typography
                variant="h2"
                className="hero-title"
                sx={{
                  fontWeight: 800,
                  fontSize: { xs: "32px", sm: "44px", md: "52px" },
                  lineHeight: 1.2,
                  marginBottom: 2,
                  color: "var(--gray-900)"
                }}
              >
                Discover Quality Products
              </Typography>

              <Typography
                variant="body1"
                sx={{
                  color: "var(--gray-700)",
                  marginBottom: 3,
                  fontSize: { xs: "15px", sm: "16px" },
                  fontWeight: 400,
                  lineHeight: 1.6
                }}
              >
                Browse our collection of premium products at competitive prices. 
                Quality you can trust, service you can rely on.
              </Typography>

              <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  onClick={() => navigate("/user/products")}
                  sx={{
                    backgroundColor: "var(--primary)",
                    color: "white",
                    fontWeight: 700,
                    borderRadius: 1,
                    paddingX: 3,
                    paddingY: 1.3,
                    textTransform: "none",
                    fontSize: "16px",
                    "&:hover": {
                      backgroundColor: "var(--primary-dark)",
                      boxShadow: "0 4px 12px rgba(30, 64, 175, 0.2)"
                    },
                    transition: "all 0.2s ease"
                  }}
                >
                  Explore Products
                </Button>

                <Button
                  variant="outlined"
                  color="primary"
                  size="large"
                  sx={{
                    color: "var(--primary)",
                    borderColor: "var(--primary)",
                    fontWeight: 700,
                    borderRadius: 1,
                    paddingX: 3,
                    paddingY: 1.3,
                    textTransform: "none",
                    fontSize: "16px",
                    "&:hover": {
                      backgroundColor: "rgba(30, 64, 175, 0.04)",
                      borderColor: "var(--primary)"
                    }
                  }}
                >
                  Learn More
                </Button>
              </Box>
            </Grid>

            <Grid
              item
              xs={12}
              md={6}
              sx={{
                textAlign: "center",
                display: { xs: "block", md: "flex" },
                justifyContent: "center",
                alignItems: "center"
              }}
            >
              <Box
                component="img"
                src={heroImage}
                alt="Featured products"
                sx={{
                  width: "100%",
                  maxWidth: 520,
                  height: "auto",
                  borderRadius: 2,
                  boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
                  objectFit: "cover",
                  display: "block",
                  margin: "0 auto"
                }}
              />
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* ================= SEARCH BAR ================= */}
      <SearchBar />

      {/* ================= CATEGORIES ================= */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
          <Typography variant="h4" className="section-title">
            Shop by Category
          </Typography>
          <Button
            variant="text"
            endIcon={<ArrowForwardIcon />}
            onClick={() => navigate("/user/products")}
            sx={{
              color: "var(--primary)",
              fontWeight: 600,
              textTransform: "none",
              "&:hover": { backgroundColor: "transparent", textDecoration: "underline" }
            }}
          >
            View All
          </Button>
        </Box>

        {loading ? (
          <Box display="flex" justifyContent="center" py={4}>
            <CircularProgress />
          </Box>
        ) : categories.length === 0 ? (
          <Alert severity="info">No categories available yet.</Alert>
        ) : (
          <Grid container spacing={3}>
            {categories.map((cat, index) => {
              // Get product count for this category
              const productCount = products.filter(p => p.category_id === cat.id).length;
              
              // Different background colors for variety
              const gradients = [
                "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
                "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
                "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
                "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
                "linear-gradient(135deg, #30cfd0 0%, #330867 100%)"
              ];
              
              const bgGradient = gradients[index % gradients.length];
              
              return (
                <Grid item xs={6} sm={6} md={3} key={cat.id}>
                  <Card
                    className="category-card"
                    onClick={() => navigate("/user/products", { state: { selectedCategory: cat.id } })}
                    sx={{
                      cursor: "pointer",
                      borderRadius: 3,
                      background: bgGradient,
                      border: "none",
                      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                      position: "relative",
                      overflow: "hidden",
                      aspectRatio: "1",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "flex-end",
                      padding: 3,
                      "&:hover": {
                        boxShadow: "0 20px 40px rgba(0, 0, 0, 0.15)",
                        transform: "translateY(-8px)"
                      },
                      "&::before": {
                        content: '""',
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: "linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.3) 100%)",
                        zIndex: 0
                      }
                    }}
                  >
                    {/* Icon/Number badge */}
                    <Box
                      sx={{
                        position: "absolute",
                        top: 16,
                        right: 16,
                        width: 40,
                        height: 40,
                        borderRadius: "50%",
                        backgroundColor: "rgba(255,255,255,0.25)",
                        backdropFilter: "blur(10px)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: 700,
                        color: "white",
                        fontSize: "14px",
                        zIndex: 1
                      }}
                    >
                      {productCount}
                    </Box>

                    {/* Category name and explore button */}
                    <Box sx={{ position: "relative", zIndex: 1 }}>
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 700,
                          color: "white",
                          mb: 0.5,
                          fontSize: { xs: "18px", sm: "20px" },
                          textShadow: "0 2px 8px rgba(0,0,0,0.2)"
                        }}
                      >
                        {cat.name}
                      </Typography>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 0.5,
                          color: "rgba(255,255,255,0.95)",
                          fontSize: "13px",
                          fontWeight: 600,
                          "&:hover": {
                            gap: 1,
                            transition: "gap 0.2s ease"
                          }
                        }}
                      >
                        Shop now <ArrowForwardIcon sx={{ fontSize: 16 }} />
                      </Box>
                    </Box>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        )}
      </Container>

      {/* ================= OFFER BANNER ================= */}
      <Box
        className="offer-banner"
        sx={{
          mx: { xs: 2, md: 4 },
          my: 6,
          p: 4,
          borderRadius: 2,
          background: "var(--primary)",
          color: "white",
          textAlign: "center",
          boxShadow: "0 8px 16px rgba(30, 64, 175, 0.15)"
        }}
      >
        <Chip
          label="LIMITED TIME OFFER"
          sx={{
            backgroundColor: "rgba(255,255,255,0.2)",
            color: "white",
            fontWeight: 700,
            mb: 2,
            fontSize: "12px"
          }}
        />
        <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
          Special Offer: 30% OFF on Electronics
        </Typography>
        <Typography sx={{ mb: 3, fontSize: "16px" }}>
          Don't miss out! Limited stock available. Shop now and save big!
        </Typography>
        <Button
          variant="contained"
          sx={{
            backgroundColor: "white",
            color: "var(--primary)",
            fontWeight: 700,
            borderRadius: 1,
            paddingX: 4,
            textTransform: "none",
            fontSize: "16px",
            "&:hover": {
              backgroundColor: "var(--gray-50)"
            }
          }}
        >
          Shop Now
        </Button>
      </Box>

      {/* ================= WHY SHOP WITH US ================= */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography
          variant="h4"
          className="section-title"
          sx={{
            textAlign: "center",
            mb: 6
          }}
        >
          Why Shop With Us
        </Typography>

        <Grid container spacing={3}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Paper
                className="feature-card"
                sx={{
                  p: 4,
                  textAlign: "center",
                  borderRadius: 2,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                  border: "1px solid var(--gray-200)",
                  transition: "all 0.2s ease",
                  "&:hover": {
                    boxShadow: "0 8px 16px rgba(0,0,0,0.08)",
                    transform: "translateY(-4px)"
                  }
                }}
              >
                <Box sx={{ mb: 2, color: "var(--primary)" }}>{feature.icon}</Box>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 700,
                    mb: 1,
                    color: "var(--gray-900)"
                  }}
                >
                  {feature.title}
                </Typography>
                <Typography variant="body2" color="var(--gray-700)">
                  {feature.description}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* ================= FEATURED PRODUCTS ================= */}
      <Box sx={{ backgroundColor: "var(--gray-50)", py: 8 }}>
        <Container maxWidth="lg">
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 4
            }}
          >
            <Typography variant="h4" className="section-title">
              Featured Products
            </Typography>
            <Button
              endIcon={<ArrowForwardIcon />}
              onClick={() => navigate("/user/products")}
              sx={{
                color: "var(--primary)",
                fontWeight: 700,
                textTransform: "none",
                fontSize: "16px",
                "&:hover": {
                  color: "var(--primary-dark)",
                  backgroundColor: "transparent"
                }
              }}
            >
              View All
            </Button>
          </Box>

          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

          {loading ? (
            <Box display="flex" justifyContent="center" py={4}>
              <CircularProgress />
            </Box>
          ) : featuredProducts.length > 0 ? (
            <Grid container spacing={3}>
              {featuredProducts.map((prod) => (
                <Grid item xs={12} sm={6} md={3} key={prod.id}>
                  <ProductCard product={prod} />
                </Grid>
              ))}
            </Grid>
          ) : (
            <Typography textAlign="center" color="var(--gray-600)">
              No products available yet. Check back soon!
            </Typography>
          )}
        </Container>
      </Box>

      {/* ================= NEWSLETTER ================= */}
      <Box
        sx={{
          background: "var(--primary)",
          color: "white",
          py: 8,
          textAlign: "center"
        }}
      >
        <Container maxWidth="sm">
          <Typography variant="h4" sx={{ fontWeight: 800, mb: 2 }}>
            Subscribe to Our Newsletter
          </Typography>
          <Typography sx={{ mb: 3, opacity: 0.95 }}>
            Get exclusive deals, latest products, and special offers straight
            to your inbox!
          </Typography>

          <Box sx={{ display: "flex", gap: 1 }}>
            <input
              type="email"
              placeholder="Enter your email"
              style={{
                flex: 1,
                padding: "12px 16px",
                borderRadius: "6px",
                border: "none",
                outline: "none",
                fontSize: "14px",
                backgroundColor: "white",
                color: "var(--gray-900)"
              }}
            />
            <Button
              variant="contained"
              sx={{
                backgroundColor: "white",
                color: "var(--primary)",
                borderRadius: 1,
                paddingX: 3,
                fontWeight: 700,
                textTransform: "none",
                fontSize: "16px",
                "&:hover": {
                  backgroundColor: "var(--gray-50)"
                }
              }}
            >
              Subscribe
            </Button>
          </Box>
        </Container>
      </Box>
    </Box>
  );
}

export default Home;
