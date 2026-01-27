// components/layout/Footer.jsx
import { Box, Container, Grid, Typography, IconButton } from "@mui/material";
import {
  Twitter,
  Facebook,
  Instagram,
  LocationOn,
  Phone,
  Email,
} from "@mui/icons-material";

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: "background.paper",
        borderTop: "1px solid",
        borderColor: "divider",
        py: 6,
        mt: "auto",
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Opening Hours */}
          <Grid size={{ xs: 12, md: 3 }}>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              Opening Hours
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Monday - Friday
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              8:00am - 9:00pm
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              gutterBottom
              sx={{ mt: 1 }}
            >
              Saturday - Sunday
            </Typography>
            <Typography variant="body2" color="text.secondary">
              9:00am - 10:00pm
            </Typography>
          </Grid>

          {/* Services */}
          <Grid size={{ xs: 12, md: 3 }}>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              Services
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Dine-In
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Online Ordering
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Catering
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Specialty Dishes
            </Typography>
          </Grid>

          {/* Contact Info */}
          <Grid size={{ xs: 12, md: 3 }}>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              Contact Us
            </Typography>
            <Box display="flex" alignItems="flex-start" gap={1} mb={1}>
              <LocationOn sx={{ fontSize: 20, color: "success.main" }} />
              <Typography variant="body2" color="text.secondary">
                123 Food Street, Sydney, NSW 2000
              </Typography>
            </Box>
            <Box display="flex" alignItems="center" gap={1} mb={1}>
              <Phone sx={{ fontSize: 20, color: "success.main" }} />
              <Typography variant="body2" color="text.secondary">
                +61 123 456 789
              </Typography>
            </Box>
            <Box display="flex" alignItems="center" gap={1}>
              <Email sx={{ fontSize: 20, color: "success.main" }} />
              <Typography variant="body2" color="text.secondary">
                info@restaurant.com
              </Typography>
            </Box>
          </Grid>
          {/* Logo & Social Media */}
          <Grid size={{ xs: 12, md: 3 }}>
            <Box display="flex" gap={1} mt={2}>
              <IconButton
                color="inherit"
                href="https://twitter.com"
                target="_blank"
                sx={{ "&:hover": { color: "success.main" } }}
              >
                <Twitter />
              </IconButton>
              <IconButton
                color="inherit"
                href="https://facebook.com"
                target="_blank"
                sx={{ "&:hover": { color: "success.main" } }}
              >
                <Facebook />
              </IconButton>
              <IconButton
                color="inherit"
                href="https://instagram.com"
                target="_blank"
                sx={{ "&:hover": { color: "success.main" } }}
              >
                <Instagram />
              </IconButton>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
