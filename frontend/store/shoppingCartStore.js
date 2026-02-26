// store/shoppingCartStore.js
import { create } from "zustand";
import { persist } from "zustand/middleware";

const useShoppingCartStore = create(
  persist(
    (set, get) => ({
      cartItems: [],
      // add a menu item to the cart, if the item already exists, increase the quantity
      addToCart: (menuItem, quantity = 1) => {
        const cartItems = get().cartItems;
        const existingItem = cartItems.find((item) => item.id === menuItem.id);

        if (existingItem) {
          const updatedCart = cartItems.map((item) =>
            item.id === menuItem.id
              ? { ...item, quantity: item.quantity + quantity }
              : item,
          );
          set({ cartItems: updatedCart });
        } else {
          set({ cartItems: [...cartItems, { ...menuItem, quantity }] });
        }
      },
      // update the quantity of a menu item in the cart, if the new quantity is less than 1, set it to 1
      updateQuantity: (menuItemId, newQuantity = 1) => {
        const cartItems = get().cartItems;
        const updatedCart = cartItems.map((item) =>
          item.id === menuItemId
            ? { ...item, quantity: Math.max(1, item.quantity - newQuantity) }
            : item,
        );
        set({ cartItems: updatedCart });
      },

      //  remove a menu item from the cart(not reduce the quantity, but remove the item completely)
      removeFromCart: (menuItemId) => {
        set({
          cartItems: get().cartItems.filter((item) => item.id !== menuItemId),
        });
      },

      // reset the cart to an empty state
      clearCart: () => {
        set({ cartItems: [] });
      },
    }),
    { name: "restaurant-cart-storage" },
  ),
);

export default useShoppingCartStore;
