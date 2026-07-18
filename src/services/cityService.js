import API from "./api";

export const getCities = async () => {
  try {
    console.log("📡 [getCities] Fetching cities from API...");
    const response = await API.get("/cities");
    
    // ✅ Extract data array from response wrapper
    const citiesData = response.data?.data || response.data || [];
    
    console.log("✅ [getCities] Response received:", {
      hasData: !!citiesData,
      isArray: Array.isArray(citiesData),
      count: Array.isArray(citiesData) ? citiesData.length : 0,
      sample: Array.isArray(citiesData) ? citiesData[0] : null,
    });
    
    return citiesData;
  } catch (error) {
    console.error("❌ [getCities] API Error:", {
      message: error.message,
      status: error.response?.status,
      url: error.config?.url,
      data: error.response?.data,
    });
    throw error;
  }
};

export const getCityAliases = async () => {
  try {
    console.log("📡 [getCityAliases] Fetching city aliases from API...");
    const response = await API.get("/bus/city-aliases");
    
    // ✅ Extract data array from response wrapper
    // Note: Each alias is a single object with { cityId, cityName, state, alias }
    const aliasesData = response.data?.data || response.data || [];
    
    console.log("✅ [getCityAliases] Response received:", {
      hasData: !!aliasesData,
      isArray: Array.isArray(aliasesData),
      count: Array.isArray(aliasesData) ? aliasesData.length : 0,
      sample: Array.isArray(aliasesData) ? aliasesData[0] : null,
    });
    
    return aliasesData;
  } catch (error) {
    console.error("❌ [getCityAliases] API Error:", {
      message: error.message,
      status: error.response?.status,
      url: error.config?.url,
      data: error.response?.data,
    });
    throw error;
  }
};