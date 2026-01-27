import { useEffect, useState } from "react";
import {
  Container,
  Paper,
  Typography,
  Box,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Alert,
  CircularProgress,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { ROUTES } from "../../constants/routes";
import { MENU_CATEGORIES } from "../../constants/constants";
import {
  useCreateMenuItem,
  useFetchMenuItemById,
  useUpdateMenuItem,
} from "../../hooks/useMenuItems";
import { BASE_URL } from "../../constants/api";

export default function MenuItemCreatePage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;
  const [preview, setPreview] = useState(null);
  const [errors, setErrors] = useState([]);
  const { mutate: createMenuItem } = useCreateMenuItem();
  const { mutate: updateMenuItem } = useUpdateMenuItem();
  const { data, isLoading } = useFetchMenuItemById(id);
  const [initialized, setInitialized] = useState(null);
  // initialize value empty
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    specialTag: "",
    category: "",
    price: "0",
    file: null,
  });

  // edit mode, load existing data
  useEffect(() => {
    if (data) {
      console.log("Fetched data:", data);
      setFormData({
        name: data.name || "",
        description: data.description || "",
        specialTag: data.specialTag || "",
        category: data.category || "",
        price: String(data.price) || "0",
        file: null,
      });
      // showing the image
      if (data.imageUrl) {
        setPreview(`${BASE_URL.replace("/api", "")}/${data.imageUrl}`);
      }
      setInitialized(data);
    }
  }, [data]);

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
    setErrors([]);
  };
  // 用户选择新图片
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, file });
      setPreview(URL.createObjectURL(file)); // local preview
      setErrors([]);
    }
  };

  const validateForm = () => {
    const newErrors = [];
    if (!formData.name || formData.name.length < 3) {
      newErrors.push("Name should be at least 3 char long.");
    }
    if (formData.price <= 0) {
      newErrors.push("Price should be greater than 0.");
    }
    if (!formData.category) {
      newErrors.push("Category must be selected.");
    }
    if (!formData.file && !isEditMode) {
      newErrors.push("Image file is required.");
    }
    return newErrors;
  };

  const handleSubmit = () => {
    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }
    const form = new FormData();
    form.append("Name", formData.name);
    form.append("Description", formData.description);
    form.append("SpecialTag", formData.specialTag);
    form.append("Category", formData.category);
    form.append("Price", formData.price);
    if (formData.file) {
      form.append("File", formData.file);
    }

    //  调用 API 创建/更新
    console.log("Submit:", form);

    if (isEditMode) {
      updateMenuItem(
        { id, formUpdateData: form },
        {
          onSuccess: () => {
            navigate(ROUTES.ADMIN_MENUITEM_MANAGE);
          },
        },
      );
    } else {
      createMenuItem(form, {
        onSuccess: () => {
          navigate(ROUTES.ADMIN_MENUITEM_MANAGE);
        },
      });
    }
  };

  // 检查表单是否有更改
  const isChanged =
    formData.name !== (initialized?.name || "") ||
    formData.description !== (initialized?.description || "") ||
    formData.specialTag !== (initialized?.specialTag || "") ||
    formData.category !== (initialized?.category || "") ||
    formData.price !== String(initialized?.price || "0") ||
    formData.file !== null;

  if (isLoading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Paper sx={{ p: 4 }}>
          <Box display="flex" justifyContent="center">
            <CircularProgress />
          </Box>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 4 }}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={3}
        >
          <Typography variant="h4" color="success.main">
            {isEditMode ? "Edit Menu" : "Add Menu"}
          </Typography>
          <Box display="flex" gap={2}>
            <Button
              variant="contained"
              color="success"
              onClick={handleSubmit}
              disabled={!isChanged}
            >
              {isEditMode ? "Update Item" : "Create Item"}
            </Button>
            <Button
              variant="outlined"
              onClick={() => navigate(ROUTES.ADMIN_MENUITEM_MANAGE)}
            >
              Cancel
            </Button>
          </Box>
        </Box>

        {errors.length > 0 && (
          <Alert severity="error" sx={{ mb: 3 }}>
            <Typography variant="subtitle2">
              Please fix the following errors:
            </Typography>
            <ul style={{ margin: 0, paddingLeft: 20 }}>
              {errors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </Alert>
        )}

        <Box display="flex" gap={4}>
          <Box flex={1}>
            <TextField
              fullWidth
              label="Item Name"
              placeholder="Enter item name"
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              margin="normal"
              required
            />

            <TextField
              fullWidth
              label="Description"
              placeholder="Describe the menu item..."
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              margin="normal"
              multiline
              rows={4}
            />

            <TextField
              fullWidth
              label="Special Tag (Optional)"
              placeholder="e.g., Chef's Special"
              value={formData.specialTag}
              onChange={(e) => handleChange("specialTag", e.target.value)}
              margin="normal"
            />

            <FormControl fullWidth margin="normal" required>
              <InputLabel>Category</InputLabel>
              <Select
                value={formData.category}
                label="Category"
                onChange={(e) => handleChange("category", e.target.value)}
              >
                <MenuItem value="">--Select a category--</MenuItem>
                {MENU_CATEGORIES.map((cat) => (
                  <MenuItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              fullWidth
              label="Price"
              type="number"
              value={formData.price}
              onChange={(e) => {
                // console.log(e.target.value,typeof e.target.value);
                handleChange("price", e.target.value);
              }}
              margin="normal"
              required
            />
          </Box>

          <Box flex={1}>
            <Typography variant="subtitle1" gutterBottom>
              Item Image
            </Typography>
            <Button variant="outlined" component="label" fullWidth>
              Choose file
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={handleFileChange}
              />
            </Button>
            {preview && (
              <Box mt={2}>
                <img
                  src={preview}
                  alt="Preview"
                  style={{
                    width: "100%",
                    maxHeight: "300px",
                    objectFit: "cover",
                    borderRadius: 8,
                    marginTop: 16,
                  }}
                />
              </Box>
            )}
          </Box>
        </Box>
      </Paper>
    </Container>
  );
}
