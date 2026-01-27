// features/admin/UserManagementPage.jsx
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
  IconButton,
  Select,
  MenuItem,
  CircularProgress,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import { format } from "date-fns";
import useAuth from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../constants/routes";
import ConfirmDialog from "../../components/modals/ConfirmDialog";

export default function UserListPage() {
  const navigate = useNavigate();
  const [selectedUser, setSelectedUser] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const { users, isLoading, deleteUserMutation } = useAuth(undefined, true);
  // console.log("users in UserListPage:", users);

  const handleDeleteClick = (user) => {
    setSelectedUser(user);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    console.log("Deleting user:", selectedUser);
    if (selectedUser) {
      deleteUserMutation.mutate(selectedUser.id);
    }
  };

  const handleEdit = (userId) => {
    navigate(`${ROUTES.ADMIN_USERS_EDIT}/${userId}`);
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
      <Box mb={3}>
        <Typography variant="h4" color="success.main" gutterBottom>
          Users List
        </Typography>
        {/* <Typography variant="body2" color="text.secondary">
          Manage user accounts and roles
        </Typography> */}
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Created At</TableCell>
              <TableCell>Last Updated At</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users?.map((user, index) => (
              <TableRow key={index}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.role}</TableCell>
                {/* <TableCell>
                  <Select
                    value={user.role}
                    onChange={(e) => handleRoleChange(user.id, e.target.value)}
                    size="small"
                    sx={{ minWidth: 120 }}
                  >
                    <MenuItem value="Admin">Admin</MenuItem>
                    <MenuItem value="Customer">Customer</MenuItem>
                  </Select>
                </TableCell> */}
                <TableCell>
                  {format(new Date(user.createdAt), "yyyy-MM-dd HH:mm")}
                </TableCell>
                <TableCell>
                  {format(new Date(user.updatedAt), "yyyy-MM-dd HH:mm")}
                </TableCell>

                <TableCell>
                  <IconButton
                    color="primary"
                    size="small"
                    onClick={() => handleEdit(user.id)}
                  >
                    <Edit />
                  </IconButton>
                  <IconButton
                    color="error"
                    size="small"
                    onClick={() => handleDeleteClick(user)}
                  >
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <ConfirmDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Confirm Delete"
        message={
          selectedUser ? (
            <>
              <Typography>{`Are you sure you want to delete user "${selectedUser.name}"? `}</Typography>
              <Typography sx={{ color: "error.main" }}>
                This action cannot be undone.
              </Typography>
            </>
          ) : (
            ""
          )
        }
        confirmText="Delete"
        confirmColor="error"
      />
    </Container>
  );
}
