// api.js
export const BASE_URL = import.meta.env.VITE_API_URL || "/api";

export const API = {
  // Auth
  AUTH_REGISTER: "/Auth/register",
  AUTH_LOGIN: "/Auth/login",
  AUTH_USERS: "/Auth/Users",
  AUTH_USERINFO: "/Auth/userinfo",
  AUTH_USERS_UPDATE: "/Auth/Users/update",
  AUTH_USERS_DELETE: "/Auth/Users/delete",

  // MenuItem
  MENUITEM_BASE: "/MenuItem",
  MENUITEM_CREATE: "/MenuItem/create",
  MENUITEM_UPDATE: "/MenuItem/update",
  MENUITEM_DELETE: "/MenuItem/delete",
  MENUITEM_TOGGLE_LIKE: "/MenuItem/toggle-like",

  // Order
  ORDER_BASE: "/Order",
  ORDER_CREATE: "/Order/create",
  ORDER_UPDATE: "/Order/update",

  // Review
  REVIEW_BASE: "/Review",
  REVIEW_CREATE: "/Review/create",
  REVIEW_UPDATE: "/Review/update",
  REVIEW_BY_MENUITEM: "/Review/menuitem",
};
