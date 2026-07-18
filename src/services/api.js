import axios from "axios";
const API_BASE_URL ="https://webapi.asiabus.in/api/v1";

const API = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 60000,
});


// ✅ Log all requests for debugging
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  console.log(
    `📡 [API] ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`
  );
  console.log("📡 [API] Headers:", config.headers);

  return config;
});

// ✅ Log all responses and errors
API.interceptors.response.use(
  (response) => {
    console.log(`✅ [API] Response from ${response.config.url}:`, response.data);
    return response;
  },
  (error) => {
    console.error(`❌ [API] Error on ${error.config?.url}:`, {
      status: error.response?.status,
      message: error.message,
      data: error.response?.data,
      fullResponse: error.response,
    });
    return Promise.reject(error);
  }
);

export default API;