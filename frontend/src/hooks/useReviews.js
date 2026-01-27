// hooks/useReviews.js
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import clientApi from "../api/clientApi";
import { API } from "../constants/api";

export const useReviewsByMenuItem = (menuItemId) => {
  return useQuery({
    queryKey: ["reviews", menuItemId],
    queryFn: () => clientApi(`${API.REVIEW_BY_MENUITEM}/${menuItemId}`),
    enabled: !!menuItemId,
  });
};

// create review hook
export const useCreateReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ orderItemId, rating }) =>
      // console.log("Creating review with:", { orderItemId, rating }) ||
      clientApi(`${API.REVIEW_CREATE}/${orderItemId}`, "POST", { rating }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });
};
