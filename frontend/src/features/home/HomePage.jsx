// features/home/HomePage.jsx
import {
  Container,
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../constants/routes";
import { Restaurant, LocalShipping, Star, Schedule } from "@mui/icons-material";

export default function HomePage() {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Restaurant sx={{ fontSize: 48, color: "success.main" }} />,
      title: "Fresh Ingredients",
      description:
        "We use only the freshest, locally-sourced ingredients in every dish",
    },
    {
      icon: <LocalShipping sx={{ fontSize: 48, color: "success.main" }} />,
      title: "Fast Delivery",
      description: "Your order delivered hot and fresh to your doorstep",
    },
    {
      icon: <Star sx={{ fontSize: 48, color: "success.main" }} />,
      title: "Top Quality",
      description:
        "Award-winning chefs crafting exceptional culinary experiences",
    },
    {
      icon: <Schedule sx={{ fontSize: 48, color: "success.main" }} />,
      title: "Quick Service",
      description: "Most orders ready within 30 minutes",
    },
  ];

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          backgroundImage: `url(/assets/hero.jpg)`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          minHeight: "50vh",
          display: "flex",
          alignItems: "center",
          position: "relative",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          },
        }}
      >
        <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
          <Box textAlign="center" color="white">
            <Typography
              variant="h2"
              gutterBottom
              fontWeight="bold"
              sx={{
                textShadow: "2px 2px 4px rgba(0,0,0,0.8)",
                fontSize: { xs: "2.5rem", md: "4rem" },
              }}
            >
              Unlock the Art of Flavor
            </Typography>
            <Typography
              variant="h5"
              gutterBottom
              sx={{
                color: "success.light",
                textShadow: "1px 1px 2px rgba(0,0,0,0.8)",
                mb: 4,
              }}
            >
              Your Culinary Journey Begins Here!
            </Typography>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate(ROUTES.MENU_ITEMS)}
              sx={{
                px: 4,
                py: 1.5,
                fontSize: "1.1rem",
                background: "linear-gradient(45deg, #2e7d32 30%, #4caf50 90%)",
                "&:hover": {
                  background:
                    "linear-gradient(45deg, #1b5e20 30%, #2e7d32 90%)",
                },
              }}
            >
              Order Now
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography
          variant="h3"
          textAlign="center"
          gutterBottom
          fontWeight="bold"
          color="success.main"
        >
          Why Choose Us
        </Typography>
        <Typography
          variant="h6"
          textAlign="center"
          color="text.secondary"
          mb={6}
        >
          Experience the difference with our exceptional service
        </Typography>

        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
              <Card
                sx={{
                  height: "100%",
                  textAlign: "center",
                  transition: "transform 0.3s",
                  "&:hover": {
                    transform: "translateY(-8px)",
                    boxShadow: 6,
                  },
                }}
              >
                <CardContent sx={{ py: 4 }}>
                  <Box mb={2}>{feature.icon}</Box>
                  <Typography variant="h6" gutterBottom fontWeight="bold">
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* About Section */}
      <Box sx={{ backgroundColor: "background.paper", py: 8 }}>
        <Container maxWidth="lg">
          <Box textAlign="center">
            <Typography
              variant="h3"
              gutterBottom
              fontWeight="bold"
              color="success.main"
            >
              About Our Restaurant
            </Typography>
            <Typography
              variant="body1"
              paragraph
              color="text.secondary"
              lineHeight={1.8}
              maxWidth="800px"
              mx="auto"
            >
              Welcome to our culinary haven! For over a decade, we've been
              serving the finest dishes crafted with passion and dedication.
            </Typography>
            <Typography
              variant="body1"
              paragraph
              color="text.secondary"
              lineHeight={1.8}
              maxWidth="800px"
              mx="auto"
            >
              Every ingredient is carefully selected from local farmers,
              ensuring freshness and quality in every bite.
            </Typography>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate(ROUTES.MENU_ITEMS)}
              sx={{ mt: 2 }}
            >
              Explore Our Menu
            </Button>
          </Box>
        </Container>
      </Box>
    </Box>
  );
}
