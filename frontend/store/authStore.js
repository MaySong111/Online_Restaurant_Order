// store/authStore.js
import { create } from "zustand";
import Cookies from "js-cookie";

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

// cookie：存原始 token ✅
// zustand：只存解码后的 user info ✅,不存储 token!!!!!!(set({ user: userinfo, token, isAuthenticated: true }); 不对)
// store 不存 token
// isAuthenticated：基于 cookie token 的有效性
