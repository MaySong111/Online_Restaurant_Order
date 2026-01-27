// features/cart/ShoppingCartPage.jsx
import { useState } from "react";
import {
  Container,
  Typography,
  Box,
  Paper,
  Button,
  IconButton,
  Divider,
  Grid,
} from "@mui/material";
import { Delete, ShoppingBag } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../constants/routes";
import { BASE_URL } from "../../constants/api";
import CheckoutModal from "../../components/modals/CheckoutModal";
import useShoppingCartStore from "../../../store/shoppingCartStore";
import useAuthStore from "../../../store/authStore";
import QuantityControl from "../../components/ui/QuantityControl";

export default function ShoppingCartPage() {
  const navigate = useNavigate();
  const cartItems = useShoppingCartStore((state) => state.cartItems);
  const addToCart = useShoppingCartStore((state) => state.addToCart);
  const updateQuantity = useShoppingCartStore((state) => state.updateQuantity);
  const removeFromCart = useShoppingCartStore((state) => state.removeFromCart);
  const clearCart = useShoppingCartStore((state) => state.clearCart);
  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  // console.log("shoppingCartPage Items:", cartItems);
  if (cartItems.length === 0) {
    return (
      <Container maxWidth="md" sx={{ mt: 8, textAlign: "center" }}>
        <ShoppingBag sx={{ fontSize: 80, color: "text.secondary", mb: 2 }} />
        <Typography variant="h4" gutterBottom>
          Your Cart is Empty
        </Typography>
        <Button
          variant="contained"
          onClick={() => navigate(ROUTES.MENUS)}
          sx={{ mt: 2 }}
        >
          Continue Shopping
        </Button>
      </Container>
    );
  }

  return (
    <>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Your Cart
        </Typography>

        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 8 }}>
            <Paper elevation={2} sx={{ p: 2 }}>
              <Box display="flex" justifyContent="space-between" mb={2}>
                <Typography variant="h6">Item</Typography>
                <Typography variant="h6">Price</Typography>
              </Box>

              <Divider />

              {cartItems.map((item) => (
                <Box key={item.id}>
                  <Box display="flex" alignItems="center" py={2}>
                    <Box
                      component="img"
                      src={`${BASE_URL.replace("/api", "")}/${item.imageUrl}`}
                      alt={item.name}
                      sx={{
                        width: 80,
                        height: 80,
                        objectFit: "cover",
                        borderRadius: 1,
                        mr: 2,
                      }}
                    />

                    <Box flex={1}>
                      <Typography variant="h6">{item.name}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        ${item.price.toFixed(2)} each
                      </Typography>
                    </Box>
                    <QuantityControl
                      onIncrease={() => addToCart(item)}
                      onDecrease={() => updateQuantity(item.id)}
                      quantity={item.quantity}
                    />
                    <IconButton
                      color="error"
                      onClick={() => removeFromCart(item.id)}
                      sx={{ ml: 1 }}
                    >
                      <Delete />
                    </IconButton>
                  </Box>
                  <Divider />
                </Box>
              ))}

              <Box mt={2} display="flex" gap={2}>
                <Button
                  variant="outlined"
                  onClick={() => navigate(ROUTES.MENUS)}
                >
                  Continue Shopping
                </Button>
                <Button variant="outlined" color="error" onClick={clearCart}>
                  Clear Cart
                </Button>
              </Box>
            </Paper>
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <Paper elevation={2} sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Order Summary
              </Typography>

              <Box display="flex" justifyContent="space-between" mb={1}>
                <Typography>Items:</Typography>
                <Typography>{totalItems}</Typography>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Box display="flex" justifyContent="space-between" mb={3}>
                <Typography variant="h6">Total:</Typography>
                <Typography variant="h6" color="success.main">
                  ${totalPrice.toFixed(2)}
                </Typography>
              </Box>

              <Button
                fullWidth
                variant="contained"
                size="large"
                onClick={() => {
                  if (!isAuthenticated) {
                    navigate(ROUTES.LOGIN);
                  } else {
                    setCheckoutOpen(true);
                  }
                }}
              >
                Proceed to Checkout
              </Button>

              <Typography
                variant="caption"
                display="block"
                mt={2}
                color="text.secondary"
              >
                Order will be ready for pickup in 30 minutes.
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Container>

      <CheckoutModal
        open={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
      />
    </>
  );
}
