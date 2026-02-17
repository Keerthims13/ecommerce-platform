import React from "react";
import { Box, Typography, Grid, Link, Container, Divider, IconButton } from "@mui/material";
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import InstagramIcon from "@mui/icons-material/Instagram";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import "./Footer.css";

function Footer() {
  return (
    <Box
      sx={{
        background: "var(--gray-900)",
        color: "white",
        mt: 8,
        position: "relative",
        borderTop: "1px solid var(--gray-800)"
      }}
    >
      <Container maxWidth="lg">
        {/* MAIN CONTENT */}
        <Box sx={{ py: 6 }}>
          <Grid container spacing={4}>
            
            {/* BRAND */}
            <Grid item xs={12} md={3}>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 800,
                  color: "var(--primary)",
                  mb: 2
                }}
              >
                Nexora
              </Typography>
              <Typography variant="body2" sx={{ color: "var(--gray-400)", lineHeight: 1.8, mb: 3 }}>
                Your one-stop destination for quality products at the best prices. Shop with confidence, shop with Nexora.
              </Typography>
              
              {/* SOCIAL LINKS */}
              <Box sx={{ display: "flex", gap: 1 }}>
                <IconButton
                  size="small"
                  sx={{
                    color: "white",
                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                    transition: "all 0.2s ease",
                    "&:hover": {
                      backgroundColor: "var(--primary)",
                      color: "white"
                    }
                  }}
                >
                  <FacebookIcon fontSize="small" />
                </IconButton>
                <IconButton
                  size="small"
                  sx={{
                    color: "white",
                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                    transition: "all 0.2s ease",
                    "&:hover": {
                      backgroundColor: "var(--primary)",
                      color: "white"
                    }
                  }}
                >
                  <TwitterIcon fontSize="small" />
                </IconButton>
                <IconButton
                  size="small"
                  sx={{
                    color: "white",
                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                    transition: "all 0.2s ease",
                    "&:hover": {
                      backgroundColor: "var(--primary)",
                      color: "white"
                    }
                  }}
                >
                  <InstagramIcon fontSize="small" />
                </IconButton>
                <IconButton
                  size="small"
                  sx={{
                    color: "white",
                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                    transition: "all 0.2s ease",
                    "&:hover": {
                      backgroundColor: "var(--primary)",
                      color: "white"
                    }
                  }}
                >
                  <LinkedInIcon fontSize="small" />
                </IconButton>
              </Box>
            </Grid>

            {/* QUICK LINKS */}
            <Grid item xs={12} sm={6} md={3}>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  mb: 2,
                  color: "white",
                  fontSize: "15px"
                }}
              >
                Quick Links
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                <Link
                  className="footer-link"
                  href="/user/home"
                  underline="none"
                  sx={{
                    color: "var(--gray-400)",
                    transition: "all 0.2s ease",
                    fontSize: "14px",
                    "&:hover": {
                      color: "var(--primary)"
                    }
                  }}
                >
                  Home
                </Link>
                <Link
                  className="footer-link"
                  href="/user/products"
                  underline="none"
                  sx={{
                    color: "var(--gray-400)",
                    transition: "all 0.2s ease",
                    fontSize: "14px",
                    "&:hover": {
                      color: "var(--primary)"
                    }
                  }}
                >
                  Products
                </Link>
                <Link
                  className="footer-link"
                  href="/user/cart"
                  underline="none"
                  sx={{
                    color: "var(--gray-400)",
                    transition: "all 0.2s ease",
                    fontSize: "14px",
                    "&:hover": {
                      color: "var(--primary)"
                    }
                  }}
                >
                  Cart
                </Link>
                <Link
                  className="footer-link"
                  href="/user/orders"
                  underline="none"
                  sx={{
                    color: "var(--gray-400)",
                    transition: "all 0.2s ease",
                    fontSize: "14px",
                    "&:hover": {
                      color: "var(--primary)"
                    }
                  }}
                >
                  Orders
                </Link>
              </Box>
            </Grid>

            {/* POLICIES */}
            <Grid item xs={12} sm={6} md={3}>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  mb: 2,
                  color: "white",
                  fontSize: "15px"
                }}
              >
                Policies
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                <Link
                  className="footer-link"
                  href="#"
                  underline="none"
                  sx={{
                    color: "var(--gray-400)",
                    transition: "all 0.2s ease",
                    fontSize: "14px",
                    "&:hover": {
                      color: "var(--primary)"
                    }
                  }}
                >
                  Privacy Policy
                </Link>
                <Link
                  className="footer-link"
                  href="#"
                  underline="none"
                  sx={{
                    color: "var(--gray-400)",
                    transition: "all 0.2s ease",
                    fontSize: "14px",
                    "&:hover": {
                      color: "var(--primary)"
                    }
                  }}
                >
                  Terms & Conditions
                </Link>
                <Link
                  className="footer-link"
                  href="#"
                  underline="none"
                  sx={{
                    color: "var(--gray-400)",
                    transition: "all 0.2s ease",
                    fontSize: "14px",
                    "&:hover": {
                      color: "var(--primary)"
                    }
                  }}
                >
                  Refund Policy
                </Link>
                <Link
                  className="footer-link"
                  href="#"
                  underline="none"
                  sx={{
                    color: "var(--gray-400)",
                    transition: "all 0.2s ease",
                    fontSize: "14px",
                    "&:hover": {
                      color: "var(--primary)"
                    }
                  }}
                >
                  Shipping Info
                </Link>
              </Box>
            </Grid>

            {/* CONTACT */}
            <Grid item xs={12} md={3}>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  mb: 2,
                  color: "white",
                  fontSize: "15px"
                }}
              >
                Contact Us
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <Box>
                  <Typography sx={{ fontSize: "11px", color: "var(--gray-500)", mb: 0.5, fontWeight: 700, textTransform: "uppercase" }}>
                    Email
                  </Typography>
                  <Link
                    className="footer-link"
                    href="mailto:support@nexora.com"
                    underline="none"
                    sx={{
                      color: "var(--gray-400)",
                      transition: "all 0.2s ease",
                      fontSize: "14px",
                      fontWeight: 500,
                      "&:hover": {
                        color: "var(--primary)"
                      }
                    }}
                  >
                    support@nexora.com
                  </Link>
                </Box>
                <Box>
                  <Typography sx={{ fontSize: "11px", color: "var(--gray-500)", mb: 0.5, fontWeight: 700, textTransform: "uppercase" }}>
                    Phone
                  </Typography>
                  <Link
                    className="footer-link"
                    href="tel:+919876543210"
                    underline="none"
                    sx={{
                      color: "var(--gray-400)",
                      transition: "all 0.2s ease",
                      fontSize: "14px",
                      fontWeight: 500,
                      "&:hover": {
                        color: "var(--primary)"
                      }
                    }}
                  >
                    +91 98765 43210
                  </Link>
                </Box>
                <Box>
                  <Typography sx={{ fontSize: "11px", color: "var(--gray-500)", mb: 0.5, fontWeight: 700, textTransform: "uppercase" }}>
                    Hours
                  </Typography>
                  <Typography sx={{ fontSize: "14px", color: "var(--gray-400)" }}>
                    24/7 Customer Support
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Box>

        {/* DIVIDER */}
        <Divider sx={{ backgroundColor: "rgba(255, 255, 255, 0.1)" }} />

        {/* FOOTER BOTTOM */}
        <Box
          sx={{
            py: 3,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 2
          }}
        >
          <Typography variant="body2" sx={{ color: "var(--gray-500)", fontSize: "13px" }}>
            © {new Date().getFullYear()} Nexora. All rights reserved.
          </Typography>
          
          <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
            <Typography
              variant="body2"
              sx={{
                color: "var(--gray-500)",
                fontSize: "13px",
                transition: "all 0.2s ease",
                cursor: "pointer",
                "&:hover": {
                  color: "var(--primary)"
                }
              }}
            >
              Secure Payment
            </Typography>
            <Typography sx={{ color: "var(--gray-500)", fontSize: "13px" }}>|</Typography>
            <Typography
              variant="body2"
              sx={{
                color: "var(--gray-500)",
                fontSize: "13px",
                transition: "all 0.2s ease",
                cursor: "pointer",
                "&:hover": {
                  color: "var(--primary)"
                }
              }}
            >
              SSL Encrypted
            </Typography>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

export default Footer;
