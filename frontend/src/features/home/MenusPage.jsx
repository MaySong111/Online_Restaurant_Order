// features/home/MenusPage.jsx
import { useState } from "react";
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  ToggleButton,
  ToggleButtonGroup,
  MenuItem,
  Select,
  FormControl,
  Alert,
} from "@mui/material";
import { Search } from "@mui/icons-material";
import { useFetchMenuItems } from "../../hooks/useMenuItems";
import { MENU_CATEGORIES, SORT_OPTIONS } from "../../constants/constants";
import Loader from "../../components/ui/Loader";
import MenuItemCard from "../../components/ui/MenuItemCard";
import MenuDetailsModal from "../../components/modals/MenuDetailsModal";

export default function MenusPage() {
  const [category, setCategory] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMenuItem, setSelectedMenuItem] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const {
    data: menuItems,
    isLoading,
    error,
  } = useFetchMenuItems(category, sortBy, searchQuery);

  console.log("Fetched menuItems:", menuItems);

  const handleCategoryChange = (event, newCategory) => {
    if (newCategory !== null) {
      setCategory(newCategory);
    }
  };

  const handleSearch = () => {
    setSearchQuery(searchInput);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleDetailsClick = (menuItem) => {
    setSelectedMenuItem(menuItem);
    setModalOpen(true);
  };

  return (
    <>
      <Box
        sx={{
          backgroundImage: "url(/src/assets/hero.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          py: 8,
          color: "white",
          textAlign: "center",
        }}
      >
        <Container maxWidth="md">
          <Box display="flex">
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Search your favorite foods..."
              value={searchInput}
              onChange={(e) => {
                setSearchInput(e.target.value);
                if (e.target.value === "") {
                  setSearchQuery("");
                }
              }}
              onKeyDown={handleKeyPress}
              sx={{
                backgroundColor: "rgba(255, 255, 255, 0.7)",
                "& .MuiOutlinedInput-root": {
                  height: 56,
                  borderTopRightRadius: 0,
                  borderBottomRightRadius: 0,
                },
              }}
            />
            <Button
              variant="contained"
              onClick={handleSearch}
              startIcon={<Search />}
              sx={{
                height: 56,
                backgroundColor: "success.main",
                "&:hover": {
                  backgroundColor: "success.dark",
                },
                borderLeft: "none",
                borderTopLeftRadius: 0,
                borderBottomLeftRadius: 0,
                borderTopRightRadius: 28,
                borderBottomRightRadius: 28,
                whiteSpace: "nowrap",
              }}
            >
              Search
            </Button>
          </Box>
        </Container>
      </Box>

      <Container sx={{ mt: 0, pt: 4, bgcolor: "background.default" }}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={3}
        >
          <Box
            sx={{
              height: 56,
              display: "flex",
              alignItems: "center",
              border: 1,
              borderColor: "divider",
              borderRadius: 1,
            }}
          >
            <ToggleButtonGroup
              value={category}
              exclusive
              onChange={handleCategoryChange}
              color="primary"
              sx={{ height: "100%" }}
            >
              {MENU_CATEGORIES.map((cat) => (
                <ToggleButton key={cat.value} value={cat.value}>
                  {cat.label}
                </ToggleButton>
              ))}
            </ToggleButtonGroup>
          </Box>

          <FormControl sx={{ minWidth: 200 }}>
            <Select
              value={sortBy || SORT_OPTIONS.NAME_ASC}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <MenuItem value={SORT_OPTIONS.NAME_ASC}>Name A-Z</MenuItem>
              <MenuItem value={SORT_OPTIONS.NAME_DESC}>Name Z-A</MenuItem>
              <MenuItem value={SORT_OPTIONS.PRICE_LOW_HIGH}>
                Price Low-High
              </MenuItem>
              <MenuItem value={SORT_OPTIONS.PRICE_HIGH_LOW}>
                Price High-Low
              </MenuItem>
            </Select>
          </FormControl>
        </Box>

        {isLoading && <Loader />}

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            Failed to load menu items. Please try again.
          </Alert>
        )}

        {!isLoading && !error && menuItems && (
          <Grid container spacing={3}>
            {menuItems.map((item) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={item.id}>
                <MenuItemCard
                  menuItem={item}
                  onDetailsClick={handleDetailsClick}
                />
              </Grid>
            ))}
          </Grid>
        )}

        {!isLoading && !error && menuItems?.length === 0 && (
          <Typography
            variant="h6"
            textAlign="center"
            color="text.secondary"
            mt={4}
          >
            No menu items found.
          </Typography>
        )}
      </Container>

      <MenuDetailsModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        menuItem={selectedMenuItem}
      />
    </>
  );
}
