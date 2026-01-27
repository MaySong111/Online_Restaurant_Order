//constants.js
// 订单状态常量
export const ORDER_STATUS = {
  CONFIRMED: "Confirmed",
  READY_FOR_PICKUP: "Ready for Pickup",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
};

// 菜单分类
export const MENU_CATEGORIES = [
  { value: "", label: "All" },
  { value: "Appetizer", label: "Appetizer" },
  { value: "Entrée", label: "Entrée" },
  { value: "Dessert", label: "Dessert" },
];

// 排序选项
export const SORT_OPTIONS = {
  NAME_ASC: "name_asc",
  NAME_DESC: "name_desc",
  PRICE_LOW_HIGH: "price_asc",
  PRICE_HIGH_LOW: "price_desc",
};

export const Roles = {
  ADMIN: "Admin",
  CUSTOMER: "Customer",
}


export const PAGE_SIZE = 5;