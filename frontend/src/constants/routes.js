// 前端路由routes.js

export const ROUTES = {
  // Public
  HOME: "/",
  MENUS: "/menus",
  LOGIN: "/login",
  REGISTER: "/register",
  CART: "/cart",
  CONTACT: "/contact",

  // Menu
  MENU_ITEMS: "/menuitems",

  // Order (login required)
  ORDERS: "/order",
  ORDER_CONFIRM: "/order/confirm",
  Profile: "/profile",

  // Admin
  ADMIN_MENUITEM_MANAGE: "/admin/manage-menu-items", // Menu Itemspage
  ADMIN_MENUITEM_MANAGE_CREATE: "/admin/manage-menu-items/create", // add item page
  ADMIN_ORDER_MANAGE: "/admin/manage-orders", // Order Management page
  ADMIN_MENUITEM_MANAGE_UPDATE: "/admin/manage-menu-items/update", // update item page
  ADMIN_USERS: "/admin/users", // User Management page
  ADMIN_USERS_EDIT: "/admin/users/edit", // Edit User page

  // Review
  REVIEW_CREATE: "/review/create",
  REVIEW_UPDATE: "/review/update",
  REVIEW_BY_MENUITEM: "/review/menuitem",

  // Error
  UNAUTHORIZED: "/unauthorized",
  NOT_FOUND: "/404",
};
