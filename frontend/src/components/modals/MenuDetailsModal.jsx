// components/modals/MenuDetailsModal.jsx
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Box,
  Typography,
  Chip,
  Rating,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import { BASE_URL } from "../../constants/api";

export default function MenuDetailsModal({ open, onClose, menuItem }) {
  if (!menuItem) return null;

  const imageUrl = `${BASE_URL.replace("/api", "")}/${menuItem.imageUrl}`;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Typography variant="h6">Menu Details</Typography>
          <IconButton onClick={onClose}>
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent dividers>
        <Box>
          <Box
            component="img"
            src={imageUrl}
            alt={menuItem.name}
            sx={{
              width: "100%",
              maxHeight:320,
              objectFit: "cover",
              borderRadius: 2,
              mb: 3,
            }}
          />

          <Typography variant="h5" gutterBottom>
            {menuItem.name}
          </Typography>

          <Box display="flex" alignItems="center" gap={2} mb={2}>
            <Rating value={menuItem.averageRating || 0} precision={0.1} readOnly />
            <Typography variant="body2" color="text.secondary">
              ({menuItem.averageRating?.toFixed(1) || "0.0"})
            </Typography>
          </Box>

          <Box mb={2}>
            <Chip label={menuItem.category} color="primary" />
          </Box>

          <Typography variant="h6" color="success.main" gutterBottom>
            ${menuItem.price.toFixed(2)}
          </Typography>

          <Typography variant="body1" color="text.secondary" paragraph>
            {menuItem.description}
          </Typography>
        </Box>
      </DialogContent>
    </Dialog>
  );
}