// components/modals/CheckoutModal.jsx
import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  IconButton,
  Divider,
  CircularProgress,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../constants/routes";
import useAuthStore from "../../../store/authStore";
import { useCreateOrder } from "../../hooks/useOrders";
import useShoppingCartStore from "../../../store/shoppingCartStore";

export default function CheckoutModal({ open, onClose }) {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const cartItems = useShoppingCartStore((state) => state.cartItems);
  const clearCart = useShoppingCartStore((state) => state.clearCart);
  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const { mutate: createOrder, isPending } = useCreateOrder();

  // console.log("CheckoutModal render user :", user);

  const [formData, setFormData] = useState({
    pickUpName: user?.name || "",
    pickUpPhoneNumber: "",
    pickUpEmail: user?.email || "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const orderData = {
      pickUpName: formData.pickUpName,
      pickUpPhoneNumber: formData.pickUpPhoneNumber,
      pickUpEmail: formData.pickUpEmail,
      OrderTotal: totalPrice,
      TotalItem: cartItems.reduce((sum, item) => sum + item.quantity, 0),
      OrderItems: cartItems.map((item) => ({
        menuItemId: item.id,
        itemName: item.name,
        quantity: item.quantity,
        price: item.price,
      })),
    };

    console.log("Submitting order data-for creating a new order:", orderData);

    createOrder(orderData);
    clearCart();
    onClose();
    navigate(ROUTES.ORDER_CONFIRM);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Typography variant="h6">Complete Your Order</Typography>
          <IconButton onClick={onClose}>
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent dividers>
          <TextField
            fullWidth
            label="Name"
            name="pickUpName"
            value={formData.pickUpName}
            onChange={handleChange}
            required
            margin="normal"
            helperText="Please enter the name for pickup"
          />

          <TextField
            fullWidth
            label="Phone Number"
            name="pickUpPhoneNumber"
            value={formData.pickUpPhoneNumber}
            onChange={handleChange}
            required
            margin="normal"
            helperText="Please enter a valid phone number"
          />

          <TextField
            fullWidth
            label="Email"
            name="pickUpEmail"
            type="email"
            value={formData.pickUpEmail}
            onChange={handleChange}
            required
            margin="normal"
            helperText="Please enter a valid email address"
          />

          <Divider sx={{ my: 3 }} />

          <Typography variant="h6" gutterBottom>
            Order Summary
          </Typography>

          {cartItems.map((item) => (
            <Box
              key={item.id}
              display="flex"
              justifyContent="space-between"
              mb={1}
            >
              <Typography>
                {item.name} x {item.quantity}
              </Typography>
              <Typography>
                ${(item.price * item.quantity).toFixed(2)}
              </Typography>
            </Box>
          ))}

          <Divider sx={{ my: 2 }} />

          <Box display="flex" justifyContent="space-between">
            <Typography variant="h6">Total</Typography>
            <Typography variant="h6" color="success.main">
              ${totalPrice.toFixed(2)}
            </Typography>
          </Box>
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
          <Button onClick={onClose}>Cancel</Button>
          <Button
            type="submit"
            variant="contained"
            disabled={isPending}
            startIcon={isPending ? <CircularProgress size={20} /> : null}
          >
            {isPending ? "Placing Order..." : "Place Order"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
