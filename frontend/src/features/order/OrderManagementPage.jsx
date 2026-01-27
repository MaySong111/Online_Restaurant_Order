import { useState } from "react";
import {
  Container,
  Paper,
  Typography,
  Box,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  CircularProgress,
  Pagination,
} from "@mui/material";
import { Visibility } from "@mui/icons-material";
import { ORDER_STATUS, PAGE_SIZE } from "../../constants/constants";
import { useOrders } from "../../hooks/useOrders";
import OrderDetailsModal from "../../components/modals/OrderDetailsModal";

export default function OrderManagementPage() {
  const [filters, setFilters] = useState({
    status: "",
    sortBy: "",
    sortDirection: "Descending",
    search: "",
  });
  const [searchInput, setSearchInput] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentPageNumber, setCurrentPageNumber] = useState(1);

  const { data, isLoading } = useOrders(filters, currentPageNumber);
  // console.log("OrderManagementPage fetched data:", data);
  const orders = data?.orders;

  const totalOrders = data?.totalOrders;
  const totalPages = Math.ceil((totalOrders || 0) / PAGE_SIZE);

  const handleFilterChange = (field, value) => {
    setFilters({ ...filters, [field]: value });
    setCurrentPageNumber(1);
  };

  const handleSearchInputChange = (value) => {
    setSearchInput(value);
    if (value === "") {
      handleFilterChange("search", "");
    }
  };

  const handleSearch = () => {
    handleFilterChange("search", searchInput);
  };

  const handleResetFilters = () => {
    setFilters({
      status: "",
      sortBy: "",
      sortDirection: "Descending",
      search: "",
    });
    setSearchInput("");
    setCurrentPageNumber(1);
  };

  const handleViewDetails = (order) => {
    console.log("Viewing details for order:", order);
    setSelectedOrder(order);
    setModalOpen(true);
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
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" color="success.main" gutterBottom>
        Orders Management
      </Typography>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Box display="flex" gap={2} mb={3} flexWrap="wrap">
          <FormControl sx={{ minWidth: 250 }}>
            <InputLabel>Filter by Status</InputLabel>
            <Select
              value={filters.status}
              label="Filter by Status"
              onChange={(e) => handleFilterChange("status", e.target.value)}
            >
              <MenuItem value="">All Status</MenuItem>
              <MenuItem value={ORDER_STATUS.CONFIRMED}>Confirmed</MenuItem>
              <MenuItem value={ORDER_STATUS.READY_FOR_PICKUP}>
                Ready for Pickup
              </MenuItem>
              <MenuItem value={ORDER_STATUS.COMPLETED}>Completed</MenuItem>
              <MenuItem value={ORDER_STATUS.CANCELLED}>Cancelled</MenuItem>
            </Select>
          </FormControl>

          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Sort By</InputLabel>
            <Select
              value={filters.sortBy}
              label="Sort By"
              onChange={(e) => handleFilterChange("sortBy", e.target.value)}
            >
              <MenuItem value="">Order ID</MenuItem>
              <MenuItem value="TotalAmount">Total Amount</MenuItem>
              <MenuItem value="CustomerName">Customer Name</MenuItem>
            </Select>
          </FormControl>

          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Sort Direction</InputLabel>
            <Select
              value={filters.sortDirection}
              label="Sort Direction"
              onChange={(e) =>
                handleFilterChange("sortDirection", e.target.value)
              }
            >
              <MenuItem value="Descending">Descending</MenuItem>
              <MenuItem value="Ascending">Ascending</MenuItem>
            </Select>
          </FormControl>
        </Box>

        <Box display="flex" gap={2} alignItems="stretch" mb={2}>
          <TextField
            fullWidth
            placeholder="Search by name, email or phone"
            value={searchInput}
            onChange={(e) => handleSearchInputChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSearch();
              }
            }}
          />
          <Button
            variant="contained"
            color="success"
            onClick={handleSearch}
            sx={{ minWidth: 120, height: 52 }}
          >
            SEARCH
          </Button>
          <Button
            variant="outlined"
            color="success"
            onClick={handleResetFilters}
            sx={{ minWidth: 150, height: 52 }}
          >
            RESET FILTERS
          </Button>
        </Box>

        <Box mt={2}>
          <Chip label={`${totalOrders || 0} orders found`} color="success" />
        </Box>
      </Paper>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Order ID</TableCell>
              <TableCell>Pick Up Name</TableCell>
              <TableCell>Contact</TableCell>
              <TableCell>Number of Items</TableCell>
              <TableCell>Total</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders?.map((order) => (
              <TableRow key={order.id}>
                <TableCell>#{order.id}</TableCell>
                <TableCell>{order.pickUpName}</TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {order.pickUpPhoneNumber}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {order.pickUpEmail}
                  </Typography>
                </TableCell>
                <TableCell>{order.totalItem}</TableCell>
                <TableCell>${order.orderTotal.toFixed(2)}</TableCell>
                <TableCell>
                  <Chip
                    label={order.status}
                    color={getStatusColor(order.status)}
                    size="small"
                    sx={{
                      minWidth: 120,
                      justifyContent: "center",
                    }}
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
                    View Details
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box display="flex" justifyContent="center" mt={3}>
        <Pagination
          count={totalPages}
          page={currentPageNumber}
          onChange={(_, value) => {
            setCurrentPageNumber(value);
            console.log("Page changed to:", value);
          }}
          color="primary"
        />
      </Box>

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
