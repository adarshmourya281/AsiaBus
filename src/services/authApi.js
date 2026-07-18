import axios from "axios";

const authAPI = axios.create({
  baseURL: "https://webapi.asiabus.in/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 60000,
});

authAPI.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  console.log(
    `📡 [AUTH API] ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`
  );

  return config;
});

authAPI.interceptors.response.use(
  (response) => {
    console.log(
      `✅ [AUTH API] Response from ${response.config.url}:`,
      response.data
    );
    return response;
  },
  (error) => {
    console.error(
      `❌ [AUTH API] Error on ${error.config?.url}:`,
      {
        status: error.response?.status,
        message: error.message,
        data: error.response?.data,
      }
    );

    return Promise.reject(error);
  }
);

export default authAPI;