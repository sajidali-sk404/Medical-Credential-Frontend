
import axios from "axios";

const api = axios.create({
  baseURL:         process.env.NEXT_PUBLIC_API_URL || "https://medical-credential-backend.onrender.com",
  withCredentials: true,   // always send cookies — no need to repeat per call
});

export default api;