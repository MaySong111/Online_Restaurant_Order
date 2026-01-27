// App.jsx
import { Routes, Route } from "react-router-dom";
import { Box, CssBaseline, ThemeProvider, Typography } from "@mui/material";
import Header from "./components/layout/Header";
import MenusPage from "./features/home/MenusPage";
import LoginPage from "./features/auth/LoginPage";
import RegisterPage from "./features/auth/RegisterPage";
import ShoppingCartPage from "./features/cart/ShoppingCartPage";
import OrderConfirmationPage from "./features/order/OrderConfirmationPage";
import OrderHistoryListPage from "./features/order/OrderHistoryListPage";
import NotFoundPage from "./features/auth/NotFoundPage";
import { ROUTES } from "./constants/routes";
import MenuItemCreatePage from "./features/menu-item/MenuItemCreatePage";
import OrderManagementPage from "./features/order/OrderManagementPage";
import { useEffect, useState } from "react";
import useAuthStore from "../store/authStore";
import AuthGuard from "./components/guards/AuthGuard";
import UnauthorizedPage from "./features/auth/UnauthorizedPage";
import MenuItemListPage from "./features/menu-item/MenuItemListPage";
import { Roles } from "./constants/constants";
import { Toaster } from "react-hot-toast";
import ContactPage from "./features/contact/ContactPage";
import HomePage from "./features/home/HomePage";
// import UserManagementPage from "./features/auth/UserManagementPage";
import Footer from "./components/layout/Footer";
import useThemeStore from "../store/themeStore";
import { getTheme } from "./theme/theme";
import ProfilePage from "./features/profile/ProfilePage";
import UserListPage from "./features/auth/UserListPage";
import UserManagementPage from "./features/auth/UserManagementPage";

export default function App() {
  const initializeAuth = useAuthStore((state) => state.initializeAuth);
  const [loading, setLoading] = useState(true);
  const { theme: themeMode } = useThemeStore();

  const theme = getTheme(themeMode);
  useEffect(() => {
    async function loadAuth() {
      await initializeAuth();
      setLoading(false);
    }
    loadAuth();
  }, []);

  if (loading) return <Typography variant="h5">Loading...</Typography>;

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Toaster position="top-right" reverseOrder={false} />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
        }}
      >
        <Header />
        <Box component="main" sx={{ flexGrow: 1 }}>
          <Routes>
            <Route path={ROUTES.HOME} element={<HomePage />} />
            <Route path={ROUTES.MENUS} element={<MenusPage />} />
            <Route path={ROUTES.LOGIN} element={<LoginPage />} />
            <Route path={ROUTES.REGISTER} element={<RegisterPage />} />
            <Route path={ROUTES.UNAUTHORIZED} element={<UnauthorizedPage />} />
            <Route path={ROUTES.MENU_ITEMS} element={<MenusPage />} />
            <Route path={ROUTES.CART} element={<ShoppingCartPage />} />
            <Route path={ROUTES.CONTACT} element={<ContactPage />} />

            {/* 需要登录才能访问 */}
            <Route element={<AuthGuard />}>
              <Route path={ROUTES.ORDERS} element={<OrderHistoryListPage />} />
              <Route
                path={ROUTES.ORDER_CONFIRM}
                element={<OrderConfirmationPage />}
              />
              <Route path={ROUTES.Profile} element={<ProfilePage />} />
            </Route>

            {/* 需要特定角色才能访问 -admin*/}
            <Route element={<AuthGuard requiredRole={Roles.ADMIN} />}>
              <Route
                path={ROUTES.ADMIN_MENUITEM_MANAGE}
                element={<MenuItemListPage />}
              />
              <Route
                path={ROUTES.ADMIN_MENUITEM_MANAGE_CREATE}
                element={<MenuItemCreatePage />}
              />
              <Route
                path={`${ROUTES.ADMIN_MENUITEM_MANAGE_UPDATE}/:id`}
                element={<MenuItemCreatePage />}
              />

              <Route
                path={ROUTES.ADMIN_ORDER_MANAGE}
                element={<OrderManagementPage />}
              />
              <Route path={ROUTES.ADMIN_USERS} element={<UserListPage />} />
              <Route
                path={`${ROUTES.ADMIN_USERS_EDIT}/:userId`}
                element={<UserManagementPage />}
              />
            </Route>

            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Box>
        <Footer />
      </Box>
    </ThemeProvider>
  );
}
