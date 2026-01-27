// features/order/OrderHistoryListPage.jsx
import { useState } from "react";
import {
  Container,
  Paper,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  CircularProgress,
  Button,
  Rating,
} from "@mui/material";
import { Visibility } from "@mui/icons-material";
import { ORDER_STATUS } from "../../constants/constants";
import { useOrders } from "../../hooks/useOrders";
import { useCreateReview } from "../../hooks/useReviews";
import OrderDetailsModal from "../../components/modals/OrderDetailsModal";
import { format } from "date-fns";
import toast from "react-hot-toast";
import { Fragment } from "react";

export default function OrderHistoryListPage() {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const { mutate: createReview } = useCreateReview();
  const { data, isLoading } = useOrders({}, 1, 100);
  const orders = data?.orders;
  console.log("OrderHistoryListPage-Orders:", orders);

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setModalOpen(true);
  };

  const handleRatingChange = (orderItemId, newRating, hasExistingReview) => {
    console.log("handleRatingChange called with:", {
      orderItemId,
      newRating,
      hasExistingReview,
    });
    if (hasExistingReview) {
      toast.error("You've already reviewed this item.");
    } else {
      createReview(
        { orderItemId, rating: newRating },
        {
          onSuccess: () => {
            toast.success("Rating updated successfully");
          },
        },
      );
    }
  };

  const getStatusColor = (status) => {
    if (status === ORDER_STATUS.CONFIRMED) return "warning";
    if (status === ORDER_STATUS.READY_FOR_PICKUP) return "info";
    if (status === ORDER_STATUS.COMPLETED) return "success";
    if (status === ORDER_STATUS.CANCELLED) return "error";
    return "default";
  };

  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="80vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" color="success.main" gutterBottom>
        My Orders
      </Typography>

      {orders && orders.length > 0 ? (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Order ID</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Items</TableCell>
                <TableCell>Total</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {orders?.map((order) => (
                <Fragment key={order.id}>
                  <TableRow>
                    <TableCell>#{order.id.substring(0, 8)}</TableCell>
                    <TableCell>
                      {format(new Date(order.orderDate), "MMM dd, yyyy")}
                    </TableCell>
                    <TableCell>{order.totalItem}</TableCell>
                    <TableCell>${order.orderTotal.toFixed(2)}</TableCell>
                    <TableCell>
                      <Chip
                        label={order.status}
                        color={getStatusColor(order.status)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        color="success"
                        size="small"
                        startIcon={<Visibility />}
                        onClick={() => handleViewDetails(order)}
                      >
                        View
                      </Button>
                    </TableCell>
                  </TableRow>

                  {order.status === ORDER_STATUS.COMPLETED && (
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        sx={{ bgcolor: "background.default" }}
                      >
                        <Box p={2}>
                          <Typography variant="subtitle2" gutterBottom>
                            Rate your items:
                          </Typography>
                          {order?.orderItems?.map((item, index) => (
                            <Box
                              key={index}
                              display="flex"
                              alignItems="center"
                              justifyContent="flex-start"
                              mb={1}
                            >
                              <Typography variant="body2">
                                {item.itemName}:
                              </Typography>
                              <Rating
                                sx={{ ml: 3 }}
                                value={item.rating || 0}
                                readOnly={!!item.rating}
                                onChange={(_, newValue) => {
                                  console.log("New Rating Value:", newValue);
                                  if (newValue) {
                                    handleRatingChange(
                                      item.id,
                                      newValue,
                                      !!item.rating,
                                    );
                                  }
                                }}
                              />
                            </Box>
                          ))}
                        </Box>
                      </TableCell>
                    </TableRow>
                  )}
                </Fragment>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Paper sx={{ p: 4, textAlign: "center" }}>
          <Typography variant="h6" color="text.secondary">
            You haven't placed any orders yet
          </Typography>
        </Paper>
      )}

      <OrderDetailsModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setSelectedOrder(null);
        }}
        order={selectedOrder}
      />
    </Container>
  );
}
