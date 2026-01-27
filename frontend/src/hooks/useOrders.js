// hooks/useOrders.js
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import clientApi from "../api/clientApi";
import { API } from "../constants/api";
import { PAGE_SIZE } from "../constants/constants";
import { toast } from "react-hot-toast";

export const useOrders = (
  filters = {},
  currentPage = 1,
  pageSize = PAGE_SIZE,
) => {
  // console.log("useOrders called with filters:", filters, "currentPage:", currentPage, "pageSize:", pageSize);
  return useQuery({
    queryKey: ["orders", filters, pageSize, currentPage],
    queryFn: () => {
      const params = new URLSearchParams();
      if (filters.status) params.append("status", filters.status);
      if (filters.sortBy) params.append("sortBy", filters.sortBy);
      if (filters.sortDirection)
        params.append("sortDirection", filters.sortDirection);
      if (filters.search) params.append("search", filters.search);
      if (pageSize) params.append("pageSize", pageSize);
      if (currentPage) params.append("currentPage", currentPage);

      const queryString = params.toString();
      const endpoint = queryString
        ? `${API.ORDER_BASE}?${queryString}`
        : API.ORDER_BASE;

      // console.log("Fetching orders from endpoint:", endpoint);
      return clientApi(endpoint);
    },
  });
};

export const useOrderById = (orderId) => {
  return useQuery({
    queryKey: ["order", orderId],
    queryFn: () => clientApi(`${API.ORDER_BASE}/${orderId}`),
    enabled: !!orderId,
  });
};

export const useCreateOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (orderData) => clientApi(API.ORDER_CREATE, "POST", orderData),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      toast.success(data.message);
    },
    onError: (error) => {
      toast.error(
        error?.response?.data?.message ||
          "Failed to create order. Please try again.",
      );
    },
  });
};

export const useUpdateOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ orderId, status }) =>
      clientApi(`${API.ORDER_UPDATE}/${orderId}`, "PUT", { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });
};
