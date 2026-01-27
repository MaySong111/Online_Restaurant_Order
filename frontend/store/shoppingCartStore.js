// store/shoppingCartStore.js
import { create } from "zustand";
import { persist } from "zustand/middleware";

const useShoppingCartStore = create(
  persist(
    (set, get) => ({
      cartItems: [],
      // 将某个菜单 添加到购物车中,如果该菜单已存在则增加这个菜单的数量
      addToCart: (menuItem, quantity = 1) => {
        const cartItems = get().cartItems;
        const existingItem = cartItems.find((item) => item.id === menuItem.id);

        if (existingItem) {
          const updatedCart = cartItems.map((item) =>
            item.id === menuItem.id
              ? { ...item, quantity: item.quantity + quantity }
              : item
          );
          set({ cartItems: updatedCart });
        } else {
          set({ cartItems: [...cartItems, { ...menuItem, quantity }] });
        }
      },
      // 将购物车的菜单的数量减少(并不是remove整个菜单项)
      updateQuantity: (menuItemId, newQuantity = 1) => {
        const cartItems = get().cartItems;
        const updatedCart = cartItems.map((item) =>
          item.id === menuItemId
            ? { ...item, quantity: Math.max(1, item.quantity - newQuantity) }
            : item
        );
        set({ cartItems: updatedCart });
      },

      //  将某个菜单一整个从购物车中移除(并非减少数量,而是直接将这个菜单项删除)
      removeFromCart: (menuItemId) => {
        set({
          cartItems: get().cartItems.filter((item) => item.id !== menuItemId),
        });
      },

      // 将所有菜单 从购物车中移除(清空购物车)
      clearCart: () => {
        set({ cartItems: [] });
      },
      
    }),
    { name: "restaurant-cart-storage" }
  )
);

export default useShoppingCartStore;
