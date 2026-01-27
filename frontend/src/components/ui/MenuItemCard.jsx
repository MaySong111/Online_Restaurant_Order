// components/ui/MenuItemCard.jsx
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
  Box,
  Chip,
  Rating,
} from "@mui/material";
import { Add, Favorite } from "@mui/icons-material";
import { BASE_URL } from "../../constants/api";
import useShoppingCartStore from "../../../store/shoppingCartStore";
import QuantityControl from "./QuantityControl";
import { useState } from "react";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { useLikeMutation } from "../../hooks/useMenuItems";
import AlertDialog from "../modals/AlertDialog";

export default function MenuItemCard({ menuItem, onDetailsClick }) {
  // console.log("menuItem in MenuItemCard:", menuItem);
  const addToCart = useShoppingCartStore((state) => state.addToCart);
  const updateQuantity = useShoppingCartStore((state) => state.updateQuantity);
  const removeFromCart = useShoppingCartStore((state) => state.removeFromCart);
  const cartItems = useShoppingCartStore((state) => state.cartItems);

  const existingCartItem = cartItems.find((item) => item.id === menuItem.id);
  const quantity = existingCartItem ? existingCartItem.quantity : 0;
  const isInCart = !!existingCartItem;
  const { mutate: likeMutation } = useLikeMutation();
  const [open, setOpen] = useState(false);

  const handleLikeClick = (menuItemId) => {
    likeMutation(menuItemId, {
      onSuccess: (data) => {
        console.log("Like mutation success data:", data);
      },
      onError: (error) => {
        if (error.status === 401) {
          setOpen(true);
        } else {
          console.error("Like mutation error:", error);
        }
      },
    });
  };

  if (!menuItem) return null;

  return (
    <Card
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        position: "relative",
      }}
    >
      <Box sx={{ position: "relative" }}>
        <CardMedia
          component="img"
          height="200"
          src={`${BASE_URL.replace("/api", "")}/${menuItem.imageUrl}`}
          alt={menuItem.name}
          sx={{
            objectFit: "cover",
            cursor: "pointer",
          }}
          onClick={() => onDetailsClick && onDetailsClick(menuItem)}
        />

        {/* heart icon */}
        <Box
          sx={{
            position: "absolute",
            top: 8,
            right: 8,
            backgroundColor: (theme) =>
              theme.palette.mode === "dark"
                ? "rgba(0, 0, 0, 0.6)"
                : "rgba(255, 255, 255, 0.8)",
            borderRadius: "50%",
            width: 36,
            height: 36,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            "&:hover": {
              backgroundColor: (theme) =>
                theme.palette.mode === "dark"
                  ? "rgba(0, 0, 0, 0.8)"
                  : "rgba(255, 255, 255, 1)",
            },
          }}
          onClick={(e) => {
            e.stopPropagation();
            handleLikeClick(menuItem.id);
          }}
        >
          {menuItem?.likesCount > 0 ? (
            <Favorite sx={{ fontSize: 20, color: "error.main" }} />
          ) : (
            <FavoriteBorderIcon sx={{ fontSize: 20, color: "error.main" }} />
          )}
        </Box>
      </Box>

      <CardContent sx={{ flexGrow: 1, p: 2 }}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="flex-start"
          mb={1}
        >
          <Typography
            variant="h6"
            sx={{ fontWeight: "bold", fontSize: "1rem" }}
          >
            {menuItem.name}
          </Typography>
          <Typography
            variant="h6"
            color="success.main"
            sx={{ fontWeight: "bold", ml: 1, fontSize: "1rem" }}
          >
            ${menuItem.price?.toFixed(2)}
          </Typography>
        </Box>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            mb: 1,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {menuItem.description}
        </Typography>

        <Box display="flex" alignItems="center" gap={2} mb={1}>
          <Box display="flex" alignItems="center" gap={0.5}>
            {menuItem?.likesCount > 0 ? (
              <>
                <Favorite sx={{ fontSize: 16, color: "error.main" }} />
                <Typography variant="body2" fontSize="0.875rem">
                  {menuItem.likesCount}
                </Typography>
              </>
            ) : (
              <FavoriteBorderIcon sx={{ fontSize: 16, color: "error.main" }} />
            )}
          </Box>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            gap={0.5}
          >
            <Rating
              value={menuItem.averageRating || 0}
              precision={0.1}
              readOnly
              size="small"
            />
            {menuItem.totalReviews > 0 && (
              <Typography
                variant="caption"
                color="text.secondary"
                fontSize="0.75rem"
              >
                ({menuItem.averageRating.toFixed(1) || 0})
              </Typography>
            )}
          </Box>
          <Chip
            label={menuItem.category}
            size="small"
            variant="outlined"
            sx={{ fontSize: "0.75rem" }}
          />
        </Box>
      </CardContent>

      <Box px={2} pb={2}>
        {isInCart ? (
          <Box display="flex" justifyContent="center">
            <QuantityControl
              quantity={quantity}
              onIncrease={() => addToCart(menuItem)}
              onDecrease={() => {
                if (quantity > 1) {
                  updateQuantity(menuItem.id);
                } else {
                  removeFromCart(menuItem.id, 1);
                }
              }}
            />
          </Box>
        ) : (
          <Button
            variant="contained"
            size="medium"
            fullWidth
            onClick={() => addToCart(menuItem)}
            startIcon={<Add />}
          >
            Add to Cart
          </Button>
        )}
      </Box>

      <AlertDialog
        open={open}
        message="Please login to like menu items."
        onClose={() => setOpen(false)}
      />
    </Card>
  );
}
