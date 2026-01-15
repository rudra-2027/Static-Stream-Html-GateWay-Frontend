// import axios from "axios";

// const api = axios.create({
//   baseURL: "http://localhost:8080/api/v1.0",

// });

// api.interceptors.request.use((config) => {
//   const token = localStorage.getItem("token");
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

// export default api;
import axios from "axios";
import {jwtDecode} from "jwt-decode"; // install using: npm install jwt-decode

const api = axios.create({
  baseURL: "http://localhost:8080/api/v1.0",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000;

    if (decoded.exp < currentTime) {
      console.warn("Token expired, logging out...");
      localStorage.removeItem("token");
      window.location.href = "/login";
      return Promise.reject("Token expired");
    }

    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
