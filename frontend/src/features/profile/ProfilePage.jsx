// features/profile/ProfilePage.jsx
import { useEffect, useState } from "react";
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Avatar,
  Paper,
  Grid,
} from "@mui/material";
import { CameraAlt } from "@mui/icons-material";
import toast from "react-hot-toast";
// import useAuthStore from "../../../store/authStore";
import useAuth from "../../hooks/useAuth";
import { useQueryClient } from "@tanstack/react-query";
import useAuthStore from "../../../store/authStore";
import { BASE_URL } from "../../constants/api";

export default function ProfilePage() {
  const queryClient = useQueryClient();
  const loggedInUser = useAuthStore((state) => state.user);
  const updateUser = useAuthStore((state) => state.updateUser);
  const { updateUserMutation } = useAuth(loggedInUser.id);

  const [formData, setFormData] = useState({
    name: loggedInUser.name || "",
    email: loggedInUser.email,
    phoneNumber: loggedInUser.phoneNumber,
    address: loggedInUser.address || "",
    role: loggedInUser.role || "",
    file: null,
  });
  const imageUrl = `${BASE_URL.replace("/api", "")}/${loggedInUser?.imageUrl}`;
  const [imgPreview, setImgPreview] = useState(
    imageUrl || "/images/defaultAvatar.png",
  );

  useEffect(() => {
    if (loggedInUser) {
      setFormData({
        name: loggedInUser.name || "",
        email: loggedInUser.email || "",
        phoneNumber: loggedInUser.phoneNumber || "",
        address: loggedInUser.address || "",
        role: loggedInUser.role || "",
        file: null,
      });
      setImgPreview(imageUrl || "/images/defaultAvatar.png");
    }
  }, [loggedInUser]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === "number" ? Number(value) : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const formUpdateData = new FormData();
    formUpdateData.append("name", formData.name);
    formUpdateData.append("phoneNumber", formData.phoneNumber);
    formUpdateData.append("address", formData.address);
    formUpdateData.append("role", formData.role);
    if (formData.file) {
      formUpdateData.append("file", formData.file);
    }

    updateUserMutation.mutate(
      { userId: loggedInUser.id, formUpdateData },
      {
        onSuccess: (data) => {
          // console.log("Profile update. data-from backend:", data);
          toast.success(data.message || "Profile updated successfully");
          queryClient.invalidateQueries(["userInfo", loggedInUser.id]);
          updateUser(data);
        },
        onError: (error) => {
          if (error.status === 401) {
            toast.error("Unauthorized. Please log in again.");
            return;
          }
          toast.error(error?.message || "Failed to update profile");
        },
      },
    );
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography
        variant="h4"
        gutterBottom
        fontWeight="bold"
        color="success.main"
      >
        My Profile
      </Typography>
      <Typography variant="body2" color="text.secondary" mb={4}>
        Update your personal information
      </Typography>

      <Paper sx={{ p: 4 }}>
        <Grid container spacing={4}>
          <Grid size={{ xs: 12, md: 4 }}>
            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              gap={2}
              sx={{
                p: 3,
                backgroundColor: "action.hover",
                borderRadius: 2,
              }}
            >
              <Avatar
                src={imgPreview}
                sx={{
                  width: 120,
                  height: 120,
                  fontSize: "3rem",
                  bgcolor: "success.main",
                }}
              />
              <Button
                variant="outlined"
                component="label"
                startIcon={<CameraAlt />}
                size="small"
              >
                Upload Photo
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (!file) return;
                    setFormData({ ...formData, file });
                    setImgPreview(URL.createObjectURL(file));
                  }}
                />
              </Button>
              <Typography
                variant="caption"
                color="text.secondary"
                textAlign="center"
              >
                JPG, PNG or JPEG (Max 2MB)
              </Typography>
            </Box>
          </Grid>

          <Grid size={{ xs: 12, md: 8 }}>
            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Full Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                margin="normal"
              />
              <TextField
                fullWidth
                label="Email Address"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                margin="normal"
                disabled
              />
              <TextField
                fullWidth
                label="Phone Number"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                margin="normal"
              />
              <TextField
                fullWidth
                label="Address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                multiline
                rows={2}
                margin="normal"
              />
              <TextField
                fullWidth
                label="Role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                margin="normal"
                disabled
              />
              {/* loggedInUser.phoneNumber 用户注册之后要更新的话,那phoneNumber就是undefined,其他的属性同理 */}
              <Button
                type="submit"
                variant="contained"
                size="large"
                fullWidth
                sx={{ mt: 3 }}
              >
                Save Changes
              </Button>
            </form>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
}
