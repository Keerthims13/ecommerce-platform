import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Grid,
  Paper,
  Checkbox,
  FormControlLabel,
  Slider,
  Card,
  Divider,
  Button,
  MenuItem,
  Select,
  Container,
  Chip,
  CircularProgress,
  Alert
} from "@mui/material";
import ProductCard from "../../components/user/ProductCard";
import TuneIcon from "@mui/icons-material/Tune";
import CloseIcon from "@mui/icons-material/Close";
import api from "../../services/api";
import { useLocation } from "react-router-dom";
import "./Products.css";

function Products() {
  const location = useLocation();
  
  // State for data from database
  const [allProducts, setAllProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Filter state
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 100000]);
  const [sortBy, setSortBy] = useState("popular");
  const [filterOpen, setFilterOpen] = useState(true);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Fetch products and categories from database
  useEffect(() => {
    fetchData();
  }, []);

  // Apply category filter from navigation state
  useEffect(() => {
    if (location.state?.selectedCategory && categories.length > 0) {
      setSelectedCategories([location.state.selectedCategory]);
    }
  }, [location.state, categories]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [productsRes, categoriesRes] = await Promise.all([
        api.get("/admin/products"),
        api.get("/admin/categories")
      ]);
      
      setAllProducts(productsRes.data || []);
      setCategories(categoriesRes.data || []);
      
      // Calculate max price from products
      if (productsRes.data && productsRes.data.length > 0) {
        const maxPrice = Math.max(...productsRes.data.map(p => p.price || 0));
        setPriceRange([0, Math.ceil(maxPrice * 1.1)]);
      }
      
      setError("");
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  // Filter logic
  let filteredProducts = allProducts.filter((p) => {
    const categoryMatch =
      selectedCategories.length === 0 ||
      selectedCategories.includes(p.category_id) ||
      selectedCategories.some(catId => {
        const cat = categories.find(c => c.id === catId);
        return cat && cat.name === p.category;
      });

    const priceMatch =
      (p.price || 0) >= priceRange[0] && (p.price || 0) <= priceRange[1];

    return categoryMatch && priceMatch;
  });

  // Sort logic
  if (sortBy === "price-low") {
    filteredProducts = [...filteredProducts].sort((a, b) => (a.price || 0) - (b.price || 0));
  } else if (sortBy === "price-high") {
    filteredProducts = [...filteredProducts].sort((a, b) => (b.price || 0) - (a.price || 0));
  } else if (sortBy === "rating") {
    filteredProducts = [...filteredProducts].sort((a, b) => (b.rating || 0) - (a.rating || 0));
  } else if (sortBy === "newest") {
    filteredProducts = [...filteredProducts].reverse();
  }

  const handleCategoryChange = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setPriceRange([0, 100000]);
    setSortBy("popular");
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
            Our Products
          </Typography>
          <Typography color="text.secondary">
            Browse our amazing collection of {loading ? "loading..." : filteredProducts.length} products
          </Typography>
        </Box>

        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

        {loading ? (
          <Box display="flex" justifyContent="center" py={8}>
            <CircularProgress />
          </Box>
        ) : (
          <Box>
            {/* HORIZONTAL FILTERS */}
            <Box sx={{ mb: 4 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2, flexWrap: "wrap", mb: 2 }}>
                <Typography sx={{ fontWeight: 600, fontSize: "14px", color: "#666" }}>
                  Filters:
                </Typography>
                
                {/* Category Chips */}
                {categories.map((cat) => (
                  <Chip
                    key={cat.id}
                    label={cat.name}
                    onClick={() => {
                      setSelectedCategories((prev) =>
                        prev.includes(cat.id)
                          ? prev.filter((c) => c !== cat.id)
                          : [...prev, cat.id]
                      );
                    }}
                    sx={{
                      backgroundColor: selectedCategories.includes(cat.id) ? "#1a1a1a" : "#fff",
                      color: selectedCategories.includes(cat.id) ? "#fff" : "#666",
                      border: selectedCategories.includes(cat.id) ? "none" : "1px solid #e8e8e8",
                      fontWeight: 600,
                      fontSize: "13px",
                      "&:hover": {
                        backgroundColor: selectedCategories.includes(cat.id) ? "#333" : "#f5f5f5"
                      }
                    }}
                  />
                ))}

                {/* Price Filter Button */}
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => setFilterOpen(!filterOpen)}
                  sx={{
                    borderColor: "#e8e8e8",
                    color: "#666",
                    textTransform: "none",
                    fontWeight: 600,
                    fontSize: "13px",
                    "&:hover": {
                      borderColor: "#999",
                      backgroundColor: "#f5f5f5"
                    }
                  }}
                >
                  Price: ₹{priceRange[0]} - ₹{priceRange[1]}
                </Button>

                {/* Sort */}
                <Box sx={{ ml: "auto", display: "flex", gap: 1.5, alignItems: "center" }}>
                  <Typography sx={{ fontSize: "13px", color: "#666", fontWeight: 500 }}>Sort:</Typography>
                  <Select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    size="small"
                    sx={{
                      minWidth: 140,
                      fontSize: "13px",
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#e8e8e8"
                      }
                    }}
                  >
                    <MenuItem value="popular">Most Popular</MenuItem>
                    <MenuItem value="newest">Newest</MenuItem>
                    <MenuItem value="price-low">Price: Low to High</MenuItem>
                    <MenuItem value="price-high">Price: High to Low</MenuItem>
                    <MenuItem value="rating">Highest Rated</MenuItem>
                  </Select>
                </Box>

                {/* Clear Filters */}
                {(selectedCategories.length > 0 || priceRange[0] > 0 || priceRange[1] < 100000) && (
                  <Button
                    size="small"
                    onClick={clearFilters}
                    sx={{
                      textTransform: "none",
                      color: "#999",
                      fontSize: "13px",
                      "&:hover": {
                        color: "#666"
                      }
                    }}
                  >
                    Clear All
                  </Button>
                )}
              </Box>

              {/* Price Range Slider (Collapsible) */}
              {filterOpen && (
                <Paper sx={{ p: 2.5, mb: 2, border: "1px solid #e8e8e8", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
                  <Typography sx={{ fontWeight: 600, mb: 2, fontSize: "13px", color: "#1a1a1a" }}>
                    Price Range
                  </Typography>
                  <Slider
                    value={priceRange}
                    onChange={(e, newValue) => setPriceRange(newValue)}
                    valueLabelDisplay="auto"
                    min={0}
                    max={100000}
                    step={500}
                    sx={{
                      "& .MuiSlider-thumb": {
                        backgroundColor: "#1a1a1a"
                      },
                      "& .MuiSlider-track": {
                        backgroundColor: "#1a1a1a"
                      },
                      "& .MuiSlider-rail": {
                        backgroundColor: "#e8e8e8"
                      }
                    }}
                  />
                </Paper>
              )}

              <Typography sx={{ color: "#666", fontSize: "13px" }}>
                Showing <span style={{ fontWeight: 700, color: "#1a1a1a" }}>{filteredProducts.length}</span> products
              </Typography>
            </Box>

            {/* PRODUCT GRID */}
            {filteredProducts.length > 0 ? (
              <Grid container spacing={3}>
                {filteredProducts.map((prod) => (
                  <Grid item xs={12} sm={6} md={4} lg={3} key={prod.id}>
                    <ProductCard product={prod} />
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Card sx={{ p: 6, textAlign: "center" }}>
                <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
                  No products found
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Try adjusting your filters to find what you're looking for
                </Typography>
                <Button
                  variant="contained"
                  onClick={clearFilters}
                  sx={{
                    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                  }}
                >
                  Clear Filters
                </Button>
              </Card>
            )}
          </Box>
        )}
      </Container>
    </Box>
  );
}

export default Products;
