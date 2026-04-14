
import axios from "axios";

const api = axios.create({
  baseURL:         process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000",
  withCredentials: true,   // always send cookies — no need to repeat per call
});

export default api;