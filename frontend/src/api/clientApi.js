// api/clientApi.js
import axios from "axios";
import { BASE_URL } from "../constants/api";
import Cookies from "js-cookie";
import useAuthStore from "../../store/authStore";

export default async function clientApi(endpoint, method = "GET", body = null) {
  const token = Cookies.get("restaurant-token"); // get token from cookies

  // create/put will send formData,so need to check if body is formData
  const isFormData = body instanceof FormData;
  const headers = {};

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  if (!isFormData) {
    headers["Content-Type"] = "application/json";
  }

  // 401 handling
  try {
    const response = await axios({
      url: `${BASE_URL}${endpoint}`,
      method,
      headers,
      data: isFormData ? body : body ? JSON.stringify(body) : null,
    });
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 401) {
      useAuthStore.getState().logout();
      window.location.href = "/login";
    }
    throw error.response ? error.response.data : new Error("Network Error");
  }
}
