// components/modals/OrderDetailsModal.jsx
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Box,
  Typography,
  Button,
  Divider,
  Chip,
  Paper,
} from "@mui/material";
import {
  AccessTime,
  AttachMoney,
  CheckCircle,
  Close,
  Receipt,
  Settings,
} from "@mui/icons-material";
import { ORDER_STATUS } from "../../constants/constants";
import { useUpdateOrder } from "../../hooks/useOrders";
import { format } from "date-fns";
import { CgProfile } from "react-icons/cg";
import { MdLocalPhone } from "react-icons/md";
import { HiOutlineMail } from "react-icons/hi";
import { IoPersonOutline } from "react-icons/io5";
import toast from "react-hot-toast";

export default function OrderDetailsModal({ open, onClose, order }) {
  const { mutate: updateOrder } = useUpdateOrder();

  if (!order) return null;

  const handleStatusChange = (newStatus) => {
    console.log("Updating order status to:", newStatus);
    updateOrder(
      { orderId: order.id, status: newStatus },
      {
        onSuccess: (data) => {
          toast.success(data.message);
          onClose();
        },
      },
    );
  };

  const getStatusColor = (status) => {
    if (status === ORDER_STATUS.CONFIRMED) return "warning";
    if (status === ORDER_STATUS.READY_FOR_PICKUP) return "info";
    if (status === ORDER_STATUS.COMPLETED) return "success";
    if (status === ORDER_STATUS.CANCELLED) return "error";
    return "default";
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Typography variant="h6" color="primary" fontWeight="bold">
            Order #{order.id.substring(0, 8)}
          </Typography>
          <IconButton onClick={onClose}>
            <Close />
          </IconButton>
        </Box>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="caption" color="text.secondary">
            {format(new Date(order.orderDate), "MMMM dd, yyyy 'at' hh:mm a")}
          </Typography>
          <Chip label={order.status} color={getStatusColor(order.status)} />
        </Box>
      </DialogTitle>

      <DialogContent dividers sx={{ p: 2 }}>
        <Box display="flex" gap={3} mb={4}>
          <Paper elevation={2} sx={{ flex: 1, p: 1 }}>
            <Typography
              variant="h7"
              fontWeight="bold"
              gutterBottom
              display="flex"
              alignItems="center"
              gap={1}
            >
              <CgProfile /> Customer Information
            </Typography>
            <Box>
              <Box display="flex" alignItems="center" gap={1} mb={1}>
                <IoPersonOutline />
                <Typography variant="body2">
                  {order.pickUpName || "N/A"}
                </Typography>
              </Box>
              <Box display="flex" alignItems="center" gap={1} mb={1}>
                <MdLocalPhone />
                <Typography variant="body2">
                  {order.pickUpPhoneNumber || "N/A"}
                </Typography>
              </Box>
              <Box display="flex" alignItems="center" gap={1}>
                <HiOutlineMail />
                <Typography variant="body2">
                  {order.pickUpEmail || "N/A"}
                </Typography>
              </Box>
            </Box>
          </Paper>

          <Paper elevation={2} sx={{ flex: 1, p: 1 }}>
            <Typography
              variant="h7"
              fontWeight="bold"
              gutterBottom
              display="flex"
              alignItems="center"
            >
              <AttachMoney /> Order Summary
            </Typography>
            <Box display="flex" justifyContent="space-between" mb={1}>
              <Typography variant="body2">Total Items</Typography>
              <Typography variant="body2">{order.totalItem}</Typography>
            </Box>
            <Box display="flex" justifyContent="space-between">
              <Typography variant="body2">Total Amount</Typography>
              <Typography variant="body2" color="success.main">
                ${order.orderTotal?.toFixed(2)}
              </Typography>
            </Box>
          </Paper>
        </Box>

        <Divider sx={{ my: 1 }} />

        <Paper elevation={2} sx={{ p: 1, mb: 2 }}>
          <Typography
            variant="h6"
            gutterBottom
            display="flex"
            alignItems="center"
            gap={1}
          >
            <Receipt /> Order Items
          </Typography>
          {order.orderItems?.map((item, index) => (
            <Box key={index}>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                py={1}
              >
                <Typography variant="body2">
                  – {item.itemName || "Unknown Item"}
                </Typography>
                <Box display="flex" alignItems="center" gap={2}>
                  <Chip
                    label={`${item.quantity} x`}
                    size="small"
                    sx={{
                      bgcolor: "success.light",
                      color: "success.dark",
                    }}
                  />
                  <Typography>${item.price?.toFixed(2)}</Typography>
                </Box>
              </Box>
              {index < order.orderItems.length - 1 && <Divider />}
            </Box>
          ))}
        </Paper>

        <Divider sx={{ my: 3 }} />

        <Box mb={3}>
          <Typography variant="h6" gutterBottom>
            Order Status
          </Typography>

          {order.status !== ORDER_STATUS.CANCELLED &&
            order.status !== ORDER_STATUS.COMPLETED && (
              <Box display="flex" gap={2} alignItems="center" mb={3}>
                <Button
                  fullWidth
                  variant="contained"
                  disabled
                  sx={{
                    bgcolor: "success.light",
                    color: "success.dark",
                    "&.Mui-disabled": {
                      bgcolor: "success.light",
                      color: "success.dark",
                    },
                  }}
                  startIcon={<AccessTime />}
                >
                  Confirmed
                </Button>

                <Typography fontSize={20}>→</Typography>

                <Button
                  fullWidth
                  variant="contained"
                  disabled={order.status !== ORDER_STATUS.CONFIRMED}
                  onClick={() =>
                    handleStatusChange(ORDER_STATUS.READY_FOR_PICKUP)
                  }
                  sx={{
                    bgcolor:
                      order.status === ORDER_STATUS.CONFIRMED
                        ? "success.main"
                        : "success.light",
                    color:
                      order.status === ORDER_STATUS.CONFIRMED
                        ? "white"
                        : "success.dark",
                    "&.Mui-disabled": {
                      bgcolor: "success.light",
                      color: "success.dark",
                    },
                    "&:not(.Mui-disabled):hover": {
                      bgcolor: "success.dark",
                    },
                  }}
                  startIcon={<Settings />}
                >
                  Ready for Pickup
                </Button>

                <Typography fontSize={20}>→</Typography>

                <Button
                  fullWidth
                  variant="contained"
                  disabled={order.status !== ORDER_STATUS.READY_FOR_PICKUP}
                  onClick={() => handleStatusChange(ORDER_STATUS.COMPLETED)}
                  sx={{
                    bgcolor:
                      order.status === ORDER_STATUS.READY_FOR_PICKUP
                        ? "success.main"
                        : "success.light",
                    color:
                      order.status === ORDER_STATUS.READY_FOR_PICKUP
                        ? "white"
                        : "success.dark",
                    "&.Mui-disabled": {
                      bgcolor: "success.light",
                      color: "success.dark",
                    },
                    "&:not(.Mui-disabled):hover": {
                      bgcolor: "success.dark",
                    },
                  }}
                  startIcon={<CheckCircle />}
                >
                  Completed
                </Button>
              </Box>
            )}
          {(order.status === ORDER_STATUS.CANCELLED ||
            order.status === ORDER_STATUS.COMPLETED) && (
            <Box display="flex" gap={2} alignItems="center" mb={3}>
              <Button
                fullWidth
                variant="contained"
                disabled
                startIcon={<AccessTime />}
              >
                Confirmed
              </Button>
              <Typography fontSize={20}>→</Typography>
              <Button
                fullWidth
                variant="contained"
                disabled
                startIcon={<Settings />}
              >
                Ready for Pickup
              </Button>
              <Typography fontSize={20}>→</Typography>
              <Button
                fullWidth
                variant="contained"
                disabled
                startIcon={<CheckCircle />}
              >
                Completed
              </Button>
            </Box>
          )}

          <Button
            fullWidth
            variant="outlined"
            color="error"
            startIcon={<Close />}
            disabled={
              order.status === ORDER_STATUS.CANCELLED ||
              order.status === ORDER_STATUS.COMPLETED
            }
            onClick={() => handleStatusChange(ORDER_STATUS.CANCELLED)}
            sx={{
              "&:hover": {
                bgcolor: "error.main",
                color: "white",
                borderColor: "error.main",
              },
            }}
          >
            Cancel Order
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
