import API from "./api";

export const getAvailableTrips = async (
  source,
  destination,
  doj
) => {
  try {
    const response = await API.get(
      `/bus/available-trips`,
      {
        params: {
          source,
          destination,
          doj,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// ✅ Fetch trip details including seat layout
export const getSeatLayout = async (tripId) => {
  try {
    console.log(`📡 [getSeatLayout] Fetching trip details for ID: ${tripId}`);
    
    const response = await API.get(
      `/bus/trip-details`,
      {
        params: {
          id: tripId,
        },
      }
    );

    console.log("📋 [getSeatLayout] API Response:", response.data);

    // Extract seats from response.data.data.seats
    const seats = response.data?.data?.seats || [];
    console.log(`✅ [getSeatLayout] Extracted ${seats.length} seats`);

    return {
      success: response.data?.status === "success",
      seats: seats,
      tripDetails: response.data?.data || {},
      rawResponse: response.data,
    };
  } catch (error) {
    console.error("❌ [getSeatLayout] Error fetching seat layout:", error.message);
    throw error;
  }
};