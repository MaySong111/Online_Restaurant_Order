// store/authStore.js
import { create } from "zustand";
import Cookies from "js-cookie";
import useShoppingCartStore from "./shoppingCartStore";

const useAuthStore = create((set, get) => ({
  user: null,
  isAuthenticated: false,

  // store token in both cookies and zustand
  login: (token) => {
    // console.log("Storing token in cookies and zustand:", token);
    Cookies.set("restaurant-token", token, { expires: 7 });
    const userinfo = get().decodeToken(token);
    // console.log("Decoded userinfo during login:", userinfo);
    set({ user: userinfo, isAuthenticated: true });
  },

  logout: () => {
    set({ user: null, isAuthenticated: false });
    useShoppingCartStore.getState().clearCart(); // Clear the shopping cart on logout
    Cookies.remove("restaurant-token");
    window.location.href = "/";
  },

  // resolve token from cookies and store the decoded user info in zustand
  initializeAuth: () => {
    const token = Cookies.get("restaurant-token");
    if (!token) {
      set({ user: null, isAuthenticated: false });
      return;
    }
    const userinfo = get().decodeToken(token);
    set({ user: userinfo, isAuthenticated: true });
  },

  decodeToken: (token) => {
    const payload = JSON.parse(atob(token.split(".")[1]));
    // console.log("Decoded token payload:", payload);
    return {
      name: payload.unique_name,
      email: payload.email,
      role: payload.role,
      address: payload.Address,
      id: payload.nameid,
      phoneNumber: payload.PhoneNumber,
      imageUrl: payload.ImageUrl,
    };
  },

  updateUser: (newUserData) => {
    set((state) => {
      return {
        user: { ...state.user, ...newUserData },
      };
    });
  },
}));

export default useAuthStore;

// cookie：store original token ✅
// zustand：only store decoded user info ✅,not store token!!!!!!(set({ user: userinfo, token, isAuthenticated: true }); X)
// store not store token
// isAuthenticated：if userinfo exist, then isAuthenticated is true, otherwise false. So we can just set isAuthenticated to true when we have userinfo, and set it to false when we don't have userinfo. This way we can avoid the issue of token expiration, because if the token is expired, we won't be able to decode it and get userinfo, so isAuthenticated will be false. And if the token is valid, we can decode it and get userinfo, so isAuthenticated will be true. This way we can ensure that the authentication state is always accurate based on the presence of valid user information.

//  useShoppingCartStore.getState().clearCart(); // Clear the shopping cart on logout, otherwise if register a new account as Customer, the cart will still have the items added by the previous Admin account, which is not expected. So we need to clear the cart on logout.
