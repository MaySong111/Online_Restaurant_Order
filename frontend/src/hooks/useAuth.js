import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { API } from "../constants/api";
import clientApi from "../api/clientApi";
import toast from "react-hot-toast";
import Cookies from "js-cookie";

export default function useAuth(id = null, fetchUsers = false) {
  // console.log("useAuth called with id:", id);
  const queryClient = useQueryClient();
  const token = Cookies.get("restaurant-token");

  const loginMutation = useMutation({
    mutationFn: (data) => clientApi(API.AUTH_LOGIN, "POST", data),
  });

  const registerMutation = useMutation({
    mutationFn: (data) => clientApi(API.AUTH_REGISTER, "POST", data),
  });

  // get userinfo by id
  const { data: userInfo, isLoading: isUserInfoLoading } = useQuery({
    queryKey: ["userInfo", id],
    queryFn: () => clientApi(`${API.AUTH_USERINFO}/${id}`),
    onError: (error) => {
      console.log("useAuth - userInfo fetch error:");
      console.error("Error fetching user info:", error);
    },
    enabled: !!id && token !== undefined,
  });

  // get all users for user management page
  const { data: users, isLoading: isUsersLoading } = useQuery({
    queryKey: ["users"],
    queryFn: () => clientApi(API.AUTH_USERS),
    enabled: token !== undefined && fetchUsers,
  });

  // admin and user self: update user info mutation
  const updateUserMutation = useMutation({
    mutationFn: ({ userId, formUpdateData }) =>
      console.log("Updating user with data:", formUpdateData) ||
      clientApi(`${API.AUTH_USERS_UPDATE}/${userId}`, "PUT", formUpdateData),
  });

  // admin: delete user mutation
  const deleteUserMutation = useMutation({
    mutationFn: (userId) =>
      clientApi(`${API.AUTH_USERS_DELETE}/${userId}`, "DELETE"),
    onSuccess: (data) => {
      queryClient.invalidateQueries(["users"]);
      toast.success(data.message || "User deleted successfully");
    },
    onError: (error) => {
      toast.error(error?.message || "Failed to delete user");
    },
  });

  return {
    loginMutation,
    registerMutation,
    users,
    isUsersLoading,
    updateUserMutation,
    deleteUserMutation,
    userInfo,
    isUserInfoLoading,
  };
}
