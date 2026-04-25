
import axios from "axios";

const api = axios.create({
  baseURL:         process.env.NEXT_PUBLIC_API_URL || "https://medical-credential-backend.onrender.com",
  withCredentials: true,   // always send cookies — no need to repeat per call
});

api.interceptors.request.use((config) => {
  const token = Cookies.get("token")
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default api;