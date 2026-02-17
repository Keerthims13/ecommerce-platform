import React, { useState } from "react";
import {
  Box,
  TextField,
  InputAdornment,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Chip,
  ClickAwayListener
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useNavigate } from "react-router-dom";
import { searchProducts } from "../../data/products";

function SearchBar() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showResults, setShowResults] = useState(false);
  const navigate = useNavigate();

  // Get search results
  const searchResults = searchQuery.trim() ? searchProducts(searchQuery).slice(0, 5) : [];

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    setShowResults(query.trim().length > 0);
  };

  const handleProductClick = (productId) => {
    setSearchQuery("");
    setShowResults(false);
    navigate(`/user/product/${productId}`);
  };

  const handleClickAway = () => {
    setShowResults(false);
  };

  return (
    <ClickAwayListener onClickAway={handleClickAway}>
      <Box sx={{ maxWidth: 700, mx: "auto", mt: -4, position: "relative", px: { xs: 2, sm: 0 } }}>
        <TextField
          fullWidth
          placeholder="Search for products, brands and more..."
          variant="outlined"
          value={searchQuery}
          onChange={handleSearch}
          onFocus={() => searchQuery.trim() && setShowResults(true)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: "var(--gray-500)" }} />
              </InputAdornment>
            )
          }}
          sx={{
            backgroundColor: "white",
            borderRadius: 2,
            "& .MuiOutlinedInput-root": {
              borderRadius: 2,
              "& fieldset": {
                borderColor: "var(--gray-300)",
                borderWidth: 2
              },
              "&:hover fieldset": {
                borderColor: "var(--primary)"
              },
              "&.Mui-focused fieldset": {
                borderColor: "var(--primary)",
                borderWidth: 2
              }
            },
            "& .MuiOutlinedInput-input": {
              fontSize: "16px",
              fontWeight: 500,
              py: 1.5
            }
          }}
        />

        {/* Search Results Dropdown */}
        {showResults && searchResults.length > 0 && (
          <Paper
            sx={{
              position: "absolute",
              top: "100%",
              left: { xs: 16, sm: 0 },
              right: { xs: 16, sm: 0 },
              mt: 1,
              maxHeight: 400,
              overflowY: "auto",
              zIndex: 1000,
              borderRadius: 2,
              boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
              border: "1px solid var(--gray-200)"
            }}
          >
            <List sx={{ py: 1 }}>
              {searchResults.map((product) => (
                <ListItem key={product.id} disablePadding>
                  <ListItemButton
                    onClick={() => handleProductClick(product.id)}
                    sx={{
                      py: 1.5,
                      px: 2,
                      "&:hover": {
                        backgroundColor: "var(--gray-50)"
                      }
                    }}
                  >
                    <Box
                      component="img"
                      src={product.image}
                      alt={product.name}
                      sx={{
                        width: 50,
                        height: 50,
                        borderRadius: 1,
                        objectFit: "cover",
                        mr: 2
                      }}
                    />
                    <ListItemText
                      primary={
                        <Typography
                          sx={{
                            fontWeight: 600,
                            color: "var(--gray-900)",
                            fontSize: "14px"
                          }}
                        >
                          {product.name}
                        </Typography>
                      }
                      secondary={
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 0.5 }}>
                          <Chip
                            label={product.category}
                            size="small"
                            sx={{
                              height: 20,
                              fontSize: "11px",
                              fontWeight: 600,
                              backgroundColor: "var(--gray-100)",
                              color: "var(--gray-700)"
                            }}
                          />
                          <Typography
                            variant="body2"
                            sx={{
                              color: "var(--primary)",
                              fontWeight: 700,
                              fontSize: "13px"
                            }}
                          >
                            ₹{product.price.toLocaleString()}
                          </Typography>
                        </Box>
                      }
                    />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
            <Box
              sx={{
                px: 2,
                py: 1.5,
                borderTop: "1px solid var(--gray-200)",
                backgroundColor: "var(--gray-50)"
              }}
            >
              <Typography
                variant="body2"
                sx={{ color: "var(--gray-600)", fontSize: "12px" }}
              >
                Showing {searchResults.length} of {searchProducts(searchQuery).length} results
              </Typography>
            </Box>
          </Paper>
        )}

        {/* No Results */}
        {showResults && searchQuery.trim() && searchResults.length === 0 && (
          <Paper
            sx={{
              position: "absolute",
              top: "100%",
              left: { xs: 16, sm: 0 },
              right: { xs: 16, sm: 0 },
              mt: 1,
              zIndex: 1000,
              borderRadius: 2,
              boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
              border: "1px solid var(--gray-200)",
              p: 3,
              textAlign: "center"
            }}
          >
            <Typography sx={{ color: "var(--gray-600)", fontSize: "14px" }}>
              No products found for "{searchQuery}"
            </Typography>
          </Paper>
        )}
      </Box>
    </ClickAwayListener>
  );
}

export default SearchBar;
