import authAPI from "./authApi";

// Register
export const registerUser = async (userData) => {
  try {
    const response = await authAPI.post(
      "/auth/register",
      userData
    );

    console.log("Register Response:", response.data);

    return response.data;
  } catch (error) {
    console.log("Register Error:", error);
    throw error;
  }
};

// Login
export const loginUser = async (loginData) => {
  try {
    const response = await authAPI.post(
      "/auth/login",
      loginData
    );

    console.log("Login Response:", response.data);

    // Save JWT token
    const token = response.data.data.token;
    localStorage.setItem("token", token);
    
    return response.data;
  } catch (error) {
    console.log("Login Error:", error);
    throw error;
  }
};

// Profile
export const getProfile = async () => {
  try {
    const token = localStorage.getItem("token");

    const response = await authAPI.get(
      "/auth/profile",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log("Profile Response:", response.data);

    return response.data;
  } catch (error) {
    console.log("Profile Error:", error);
    throw error;
  }
};

// Logout
export const logoutUser = () => {
  try {
    localStorage.removeItem("token");
    console.log("User logged out successfully");
    return true;
  } catch (error) {
    console.log("Logout Error:", error);
    throw error;
  }
};