// hooks/useMenuItems.js
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import clientApi from "../api/clientApi";
import { API } from "../constants/api";
import toast from "react-hot-toast";

export const useFetchMenuItems = (category = "", sortBy = "", search = "") => {
  return useQuery({
    queryKey: ["menuItems", category, sortBy, search],
    queryFn: () => {
      const params = new URLSearchParams();
      if (category) params.append("category", category);
      if (sortBy) params.append("sortBy", sortBy);
      if (search) params.append("search", search);

      const queryString = params.toString();
      const endpoint = queryString
        ? `${API.MENUITEM_BASE}?${queryString}`
        : API.MENUITEM_BASE;

      return clientApi(endpoint);
    },
  });
};

export const useFetchMenuItemById = (id) => {
  return useQuery({
    queryKey: ["menuItem", id],
    queryFn: () => clientApi(`${API.MENUITEM_BASE}/${id}`),
    enabled: !!id,
  });
};

// create a new menuItem
export const useCreateMenuItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (formData) => clientApi(API.MENUITEM_CREATE, "POST", formData),
    onSuccess: (data) => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["menuItems"] });
      toast.success(data.message);
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message || "Failed to create menu item",
      );
    },
  });
};

// update an existing menuItem
export const useUpdateMenuItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, formUpdateData }) =>
      clientApi(`${API.MENUITEM_UPDATE}/${id}`, "PUT", formUpdateData),
    onSuccess: (data) => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["menuItems"] });
      toast.success(data.message);
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message || "Failed to update menu item",
      );
    },
  });
};

// delete a menuItem
export const useDeleteMenuItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => clientApi(`${API.MENUITEM_DELETE}/${id}`, "DELETE"),
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["menuItems"] });
    },
  });
};

// toggle like for a menuItem
export const useLikeMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (menuItemId) =>
      clientApi(`${API.MENUITEM_TOGGLE_LIKE}/${menuItemId}`, "POST"),
    onSuccess: () => {
      queryClient.invalidateQueries(["menuItems"]);
    },
  });
};
