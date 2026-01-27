// components/layout/Header.jsx
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Badge,
  Box,
  Container,
  Menu,
  MenuItem,
  Divider,
  Avatar,
} from "@mui/material";
import { ShoppingCart, Brightness4, Brightness7 } from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";
import { ROUTES } from "../../constants/routes";
import { Roles } from "../../constants/constants";
import useAuthStore from "../../../store/authStore";
import useThemeStore from "../../../store/themeStore";
import useShoppingCartStore from "../../../store/shoppingCartStore";
import { useState } from "react";
import { CgProfile } from "react-icons/cg";
import { RiShoppingBagLine } from "react-icons/ri";
import { BiDish } from "react-icons/bi";
import { FiUsers } from "react-icons/fi";
import { FiLogOut } from "react-icons/fi";
import { KeyboardArrowDown } from "@mui/icons-material";
import { BASE_URL } from "../../constants/api";

export default function Header() {
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);
  const cartItems = useShoppingCartStore((state) => state.cartItems);
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const { theme, toggleTheme } = useThemeStore();
  // console.log("header  user info:", user);
  const imageUrl = `${BASE_URL.replace("/api", "")}/${user?.imageUrl}`;

  const [anchorEl, setAnchorEl] = useState(null);
  const menuOpen = Boolean(anchorEl);

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleNavigate = (route) => {
    navigate(route);
    handleMenuClose();
  };

  return (
    <AppBar
      position="sticky"
      sx={{
        backgroundColor: (theme) =>
          theme.palette.mode === "light" ? "#ffffff" : "#2d2d2d",
        color: (theme) =>
          theme.palette.mode === "light" ? "#2e7d32" : "#e0e0e0",
      }}
    >
      <Container maxWidth="lg">
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={() => navigate("/")}
            sx={{ mr: 1 }}
          >
            🔥
          </IconButton>

          <Typography
            variant="h6"
            component="div"
            sx={{ cursor: "pointer", mr: 5 }}
            onClick={() => navigate("/")}
          >
            Restaurant
          </Typography>

          <Button color="inherit" onClick={() => navigate("/")} sx={{ mx: 1 }}>
            Home
          </Button>
          <Button
            color="inherit"
            onClick={() => navigate(ROUTES.MENU_ITEMS)}
            sx={{ mx: 1 }}
          >
            Menu
          </Button>
          <Button
            color="inherit"
            onClick={() => navigate("/contact")}
            sx={{ mx: 1 }}
          >
            Contact
          </Button>

          <Box sx={{ flexGrow: 1 }} />

          <IconButton color="inherit" component={Link} to={ROUTES.CART}>
            <Badge badgeContent={totalItems} color="error">
              <ShoppingCart />
            </Badge>
          </IconButton>

          <Box sx={{ ml: 5 }}>
            {isAuthenticated ? (
              <>
                <IconButton
                  color="inherit"
                  onClick={handleMenuClick}
                  sx={{ p: 0, display: "flex" }}
                >
                  <Avatar
                    src={imageUrl}
                    alt="avatar"
                    sx={{
                      bgcolor: "success.main",
                      width: 36,
                      height: 36,
                      cursor: "pointer",
                    }}
                  >
                    {user?.name?.charAt(0).toUpperCase()}
                  </Avatar>
                  <KeyboardArrowDown />
                </IconButton>

                <Menu
                  anchorEl={anchorEl}
                  open={menuOpen}
                  onClose={handleMenuClose}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "right",
                  }}
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  sx={{ mt: 1 }}
                >
                  <MenuItem onClick={() => handleNavigate(ROUTES.Profile)}>
                    <Box
                      sx={{
                        width: 24,
                        display: "flex",
                        alignItems: "center",
                        mr: 1,
                      }}
                    >
                      <CgProfile size={18} color="currentColor" />
                    </Box>
                    My Profile
                  </MenuItem>

                  {user?.role === Roles.CUSTOMER && (
                    <MenuItem onClick={() => handleNavigate(ROUTES.ORDERS)}>
                      <Box
                        sx={{
                          width: 24,
                          display: "flex",
                          alignItems: "center",
                          mr: 1,
                        }}
                      >
                        <RiShoppingBagLine size={18} color="currentColor" />
                      </Box>
                      Orders
                    </MenuItem>
                  )}

                  {user?.role === Roles.ADMIN && (
                    <>
                      <Divider sx={{ my: 1 }} />

                      <MenuItem
                        onClick={() =>
                          handleNavigate(ROUTES.ADMIN_MENUITEM_MANAGE)
                        }
                      >
                        <Box
                          sx={{
                            width: 24,
                            display: "flex",
                            alignItems: "center",
                            mr: 1,
                          }}
                        >
                          <BiDish size={18} color="currentColor" />
                        </Box>
                        Menu Items
                      </MenuItem>
                      <MenuItem
                        onClick={() =>
                          handleNavigate(ROUTES.ADMIN_ORDER_MANAGE)
                        }
                      >
                        <Box
                          sx={{
                            width: 24,
                            display: "flex",
                            alignItems: "center",
                            mr: 1,
                          }}
                        >
                          <RiShoppingBagLine size={18} color="currentColor" />
                        </Box>
                        Orders Management
                      </MenuItem>

                      <MenuItem
                        onClick={() => handleNavigate(ROUTES.ADMIN_USERS)}
                      >
                        <Box
                          sx={{
                            width: 24,
                            display: "flex",
                            alignItems: "center",
                            mr: 1,
                          }}
                        >
                          <FiUsers size={18} color="currentColor" />
                        </Box>
                        Users
                      </MenuItem>
                    </>
                  )}

                  <Divider sx={{ my: 1 }} />

                  <MenuItem
                    onClick={() => {
                      handleMenuClose();
                      logout();
                    }}
                    sx={{ color: "error.main" }}
                  >
                    <Box
                      sx={{
                        width: 24,
                        display: "flex",
                        alignItems: "center",
                        mr: 1,
                      }}
                    >
                      <FiLogOut size={18} color="currentColor" />
                    </Box>
                    Logout
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <>
                <Button color="inherit" onClick={() => navigate(ROUTES.LOGIN)}>
                  Sign In
                </Button>
                <Button
                  color="inherit"
                  onClick={() => navigate(ROUTES.REGISTER)}
                >
                  Sign Up
                </Button>
              </>
            )}
          </Box>
          <IconButton
            color="inherit"
            onClick={toggleTheme}
            sx={{ mx: 1, ml: 5 }}
          >
            {theme === "dark" ? <Brightness7 /> : <Brightness4 />}
          </IconButton>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
