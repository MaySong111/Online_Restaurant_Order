import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  CircularProgress,
} from "@mui/material";
import { Add, Edit, Delete } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useDeleteMenuItem, useFetchMenuItems } from "../../hooks/useMenuItems";
import { ROUTES } from "../../constants/routes";
import { BASE_URL } from "../../constants/api";
import { useState } from "react";
import { MENU_CATEGORIES } from "../../constants/constants";
import ConfirmDialog from "../../components/modals/ConfirmDialog";

export default function MenuItemListPage() {
  const titles = ["Item", "Category", "Price", "Tag", "Actions"];
  const navigate = useNavigate();
  const { mutate: deleteMenuItem } = useDeleteMenuItem();
  const [category, setCategory] = useState("");
  const { data: menuItems, isLoading } = useFetchMenuItems(category);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState(null);

  const handleEdit = (id) => {
    navigate(`${ROUTES.ADMIN_MENUITEM_MANAGE_UPDATE}/${id}`);
  };

  const handleDelete = (id) => {
    setSelectedItemId(id);
    setOpenDialog(true);
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
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Box>
          <Typography variant="h4" color="success.main" gutterBottom>
            Menu Items
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage your restaurant's offerings
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => navigate(ROUTES.ADMIN_MENUITEM_MANAGE_CREATE)}
          sx={{
            bgcolor: "success.light",
            color: "success.dark",
          }}
        >
          Add Item
        </Button>
      </Box>

      <Box display="flex" gap={1} mb={3}>
        {MENU_CATEGORIES.map((cat) => (
          <Chip
            key={cat.label}
            label={cat.label}
            onClick={() => setCategory(cat.value)}
            variant="outlined"
            color={category === cat.value ? "primary" : "default"}
          />
        ))}
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: "grey.100" }}>
              {titles.map((title, index) => (
                <TableCell key={index}>
                  <Typography variant="subtitle1" fontWeight="bold">
                    {title}
                  </Typography>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {menuItems?.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  <Box display="flex" alignItems="center" gap={2}>
                    <Box
                      component="img"
                      src={`${BASE_URL.replace("/api", "")}/${item.imageUrl}`}
                      alt={item.name}
                      sx={{
                        width: 60,
                        height: 60,
                        objectFit: "cover",
                        borderRadius: 1,
                      }}
                    />
                    <Typography>{item.name}</Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Chip label={item.category} size="small" sx={{ width: 70 }} />
                </TableCell>
                <TableCell>${item.price.toFixed(2)}</TableCell>
                <TableCell>
                  {item.specialTag && (
                    <Chip label={item.specialTag} color="info" size="small" />
                  )}
                </TableCell>
                <TableCell>
                  <IconButton
                    color="primary"
                    size="small"
                    onClick={() => handleEdit(item.id)}
                  >
                    <Edit />
                  </IconButton>
                  <IconButton
                    color="error"
                    size="small"
                    onClick={() => handleDelete(item.id)}
                  >
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {openDialog && (
        <ConfirmDialog
          open={openDialog}
          onClose={() => setOpenDialog(false)}
          onConfirm={() => deleteMenuItem(selectedItemId)}
          setSelectedItemId={setSelectedItemId}
          title="Delete Menu Item"
          message="Are you sure you want to delete this menu item? This action cannot be undone."
          confirmText="Delete"
          confirmColor="error"
        />
      )}
    </Container>
  );
}
