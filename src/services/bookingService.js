import API from "./api";

/**
 * Block ticket (seats) for 8 minutes to hold the reservation
 * @param {Object} payload - Booking payload with trip, points, and passenger details
 * @returns {Promise} - API response with BlockKey
 */
export const blockTicket = async (payload) => {
  try {
    console.log("📌 [blockTicket] Calling Block Ticket API with payload:", payload);

    const response = await API.post("bookings/block", payload);

    console.log("✅ [blockTicket] Full Response Object:", {
      status: response.status,
      statusText: response.statusText,
      data: response.data,
    });

    // ✅ Log entire response.data to see structure
    console.log("📋 [blockTicket] Response.data structure:", JSON.stringify(response.data, null, 2));

    // ✅ Handle multiple possible response structures
    let blockKey = null;
    let bookingId = null;

    // ✅ Try different paths where BlockKey might be
    if (typeof response.data?.data === "string") {
      blockKey = response.data.data;
    } else if (response.data?.data?.blockKey) {
      blockKey = response.data.data.blockKey;
    } else if (response.data?.data?.BlockKey) {
      blockKey = response.data.data.BlockKey;
    } else if (response.data?.BlockKey) {
      blockKey = response.data.BlockKey;
    } else if (response.data?.blockKey) {
      blockKey = response.data.blockKey;
    } else if (typeof response.data === "string") {
      blockKey = response.data;
    }

    // ✅ Try to extract bookingId if available from API response
    if (response.data?.data?.bookingId) {
      bookingId = response.data.data.bookingId;
    } else if (response.data?.bookingId) {
      bookingId = response.data.bookingId;
    } else if (response.data?.data?.booking_id) {
      bookingId = response.data.data.booking_id;
    } else if (response.data?.booking_id) {
      bookingId = response.data.booking_id;
    }

    console.log("🔑 [blockTicket] Extracted BlockKey:", blockKey);
    if (bookingId) {
      console.log("🧾 [blockTicket] Extracted BookingId:", bookingId);
    }

    if ((response.status === 200 || response.status === 201) && blockKey) {
      const result = {
        success: true,
        blockKey: blockKey,
        rawResponse: response.data,
      };
      if (bookingId) {
        result.bookingId = bookingId;
      }
      return result;
    } else {
      throw new Error(`Failed to extract BlockKey from response. Status: ${response.status}`);
    }
  } catch (error) {
    console.error("❌ [blockTicket] Full Error Object:", error);
    console.error("❌ [blockTicket] Error Response Data:", error.response?.data);
    console.error("❌ [blockTicket] Error Response Status:", error.response?.status);
    console.error("❌ [blockTicket] Error Message:", error.message);

    // ✅ Log the specific error from API
    const apiErrorMessage = error.response?.data?.message || error.response?.data?.error || error.message;
    console.error("📌 [blockTicket] API Error Message:", apiErrorMessage);

    throw error;
  }
};

/**
 * Build inventory items from passenger data for Block Ticket API
 * @param {Array} passengers - Array of passenger objects with seat details
 * @returns {Array} - Formatted inventory items for API
 */
/**
 * Build inventory items for Block Ticket API
 */
export const buildInventoryItems = (passengers) => {
  return passengers.map((p) => ({
    seatname: String(p.seatName || ""),

    fare: Number(p.fare || 0).toFixed(2),

    serviceTax: Number(
      p.serviceTax || 0
    ).toFixed(2),

    operatorServiceCharge: Number(
      p.operatorServiceCharge || 0
    ).toFixed(2),

    passengerName: p.passenger?.name || "",

    passengerAge: Number(
      p.passenger?.age || 0
    ),

    passengerGender:
      p.passenger?.gender || "O",

    passengerIdType:
      p.passenger?.idType || "",

    passengerIdNumber:
      p.passenger?.idNumber || "",
  }));
};


/**
 * Build complete payload for Block Ticket API
 * @param {Object} blockingData - Data needed for blocking
 * @returns {Object} - Complete payload for API
 */
export const buildBlockTicketPayload = (blockingData) => {
  const {
    availableTripId,
    boardingPointId,
    droppingPointId,
    source,
    destination,
    doj,
    passengers,
  } = blockingData;

  const payload = {
    availableTripId: String(availableTripId),

    boardingPointId: String(boardingPointId),

    droppingPointId: String(droppingPointId),

    // Backend requires strings
    source: String(source),

    destination: String(destination),

    // Backend requires journey date
    doj: doj,

    inventoryItems: buildInventoryItems(passengers),
  };

  console.log(
    "✅ [buildBlockTicketPayload] Final Payload:",
    JSON.stringify(payload, null, 2)
  );

  return payload;
};
/**
 * Store block ticket data in localStorage
 * @param {string} blockKey - Block key from API
 * @returns {Object} - Stored data with timestamps
 */
export const storeBlockTicketData = (blockKey) => {
  const blockStartTime = Date.now();
  const blockExpiryTime = blockStartTime + 8 * 60 * 1000; // 8 minutes in milliseconds

  localStorage.setItem("BlockKey", blockKey);
  localStorage.setItem("blockStartTime", blockStartTime.toString());
  localStorage.setItem("blockExpiryTime", blockExpiryTime.toString());

  console.log("💾 [storeBlockTicketData] Stored:", {
    BlockKey: blockKey,
    blockStartTime,
    blockExpiryTime,
  });

  return { blockStartTime, blockExpiryTime };
};

/**
 * Get remaining time in milliseconds for block ticket
 * @returns {number} - Remaining time in milliseconds (0 if expired)
 */
export const getRemainingBlockTime = () => {
  const blockExpiryTime = localStorage.getItem("blockExpiryTime");
  if (!blockExpiryTime) return 0;

  const remaining = parseInt(blockExpiryTime) - Date.now();
  return remaining > 0 ? remaining : 0;
};

/**
 * Check if block ticket is still valid
 * @returns {boolean}
 */
export const isBlockTicketValid = () => {
  return getRemainingBlockTime() > 0;
};

/**
 * Clear block ticket data from localStorage
 */
export const clearBlockTicketData = () => {
  localStorage.removeItem("BlockKey");
  localStorage.removeItem("blockStartTime");
  localStorage.removeItem("blockExpiryTime");
  localStorage.removeItem("bookingData");
  console.log("🗑️ [clearBlockTicketData] Cleared all block ticket data");
};

/**
 * Get all bookings for currently logged-in user
 * GET /bookings/my
 *
 * @param {number} page - Current page
 * @param {number} limit - Number of bookings per page
 * @returns {Promise<Object>} bookings and pagination meta
 */
export const getMyBookings = async (page = 1, limit = 15) => {
  try {
    console.log("-----------------------------------------");
    console.log("🎫 [My Bookings] Fetching user bookings");
    console.log("Page:", page);
    console.log("Limit:", limit);

    const response = await API.get("/bookings/my", {
      params: {
        page,
        limit,
      },
    });

    console.log("✅ [My Bookings] Full Response:", response.data);

    if (
      response.status === 200 &&
      response.data?.status === "success"
    ) {
      return {
        bookings: response.data?.data?.bookings || [],
        meta: response.data?.data?.meta || {
          total: 0,
          page: 1,
          limit,
          totalPages: 1,
          hasNextPage: false,
          hasPrevPage: false,
        },
      };
    }

    throw new Error(
      response.data?.message ||
      "Unable to fetch your bookings."
    );
  } catch (error) {
    console.error("❌ [My Bookings] Error:", error);
    console.error(
      "❌ [My Bookings] API Error:",
      error.response?.data
    );

    throw new Error(
      error.response?.data?.message ||
      error.message ||
      "Unable to fetch your bookings."
    );
  }
};


/* ===========================================================
   CANCELLATION SERVICES
   =========================================================== */

/**
 * STEP 1
 * Lookup ticket using TIN + Mobile Number
 *
 * POST /bookings/cancel/lookup
 *
 * Body:
 * {
 *   tin: "XLSRFVQT",
 *   mobile: "9123123456"
 * }
 */
export const lookupCancellationTicket = async ({ tin, mobile }) => {
  try {
    console.log("------------------------------------------------");
    console.log("🔍 [Cancel Lookup] Searching ticket");
    console.log("TIN:", tin);
    console.log("Mobile:", mobile);

    const payload = {
      tin: String(tin).trim(),
      mobile: String(mobile).trim(),
    };

    console.log("📦 [Cancel Lookup] Payload:", payload);

    const response = await API.post(
      "/bookings/cancel/lookup",
      payload
    );

    console.log("✅ [Cancel Lookup] Full Response:", response.data);

    if (
      response.status === 200 &&
      response.data?.status === "success"
    ) {
      return response.data.data;
    }

    // Fallback if backend directly returns data object
    if (
      response.status === 200 &&
      response.data?.tin
    ) {
      return response.data;
    }

    throw new Error(
      response.data?.message ||
      "Unable to retrieve ticket details."
    );
  } catch (error) {
    console.error("❌ [Cancel Lookup] Error:", error);
    console.error(
      "❌ [Cancel Lookup] Response:",
      error.response?.data
    );

    throw new Error(
      error.response?.data?.message ||
      error.message ||
      "Unable to retrieve ticket details."
    );
  }
};


/**
 * STEP 2
 * Get Cancellation Policy
 *
 * GET /bookings/cancellation-data?tin=
 */
export const getCancellationData = async (tin) => {
  try {
    console.log("------------------------------------------------");
    console.log("📋 [Cancellation Policy] Fetching policy");
    console.log("TIN:", tin);

    const response = await API.get(
      `/bookings/cancellation-data?tin=${encodeURIComponent(tin)}`
    );

    console.log(
      "✅ [Cancellation Policy] Response:",
      response.data
    );

    if (
      response.status === 200 &&
      response.data?.status === "success"
    ) {
      return response.data.data;
    }

    // Fallback if API directly returns data
    if (
      response.status === 200 &&
      response.data?.tin
    ) {
      return response.data;
    }

    throw new Error(
      response.data?.message ||
      "Unable to fetch cancellation policy."
    );
  } catch (error) {
    console.error(
      "❌ [Cancellation Policy] Error:",
      error
    );

    console.error(
      "❌ [Cancellation Policy] Response:",
      error.response?.data
    );

    throw new Error(
      error.response?.data?.message ||
      error.message ||
      "Unable to fetch cancellation policy."
    );
  }
};


/**
 * STEP 3
 * Cancel selected seats
 *
 * POST /bookings/cancel
 *
 * Body:
 * {
 *   tin: "XLSRFVQT",
 *   seatsToCancel: "4,5,6"
 * }
 */
export const cancelTicket = async ({
  tin,
  seatsToCancel,
}) => {
  try {
    console.log("------------------------------------------------");
    console.log("🚫 [Cancel Ticket] Cancelling ticket");

    const payload = {
      tin: String(tin).trim(),
      seatsToCancel: String(seatsToCancel).trim(),
    };

    console.log(
      "📦 [Cancel Ticket] Payload:",
      payload
    );

    const response = await API.post(
      "/bookings/cancel",
      payload
    );

    console.log(
      "✅ [Cancel Ticket] Response:",
      response.data
    );

    if (
      response.status === 200 &&
      response.data?.status === "success"
    ) {
      return response.data.data;
    }

    // Fallback
    if (
      response.status === 200 &&
      response.data?.tin
    ) {
      return response.data;
    }

    throw new Error(
      response.data?.message ||
      "Ticket cancellation failed."
    );
  } catch (error) {
    console.error(
      "❌ [Cancel Ticket] Error:",
      error
    );

    console.error(
      "❌ [Cancel Ticket] Response:",
      error.response?.data
    );

    throw new Error(
      error.response?.data?.message ||
      error.message ||
      "Ticket cancellation failed."
    );
  }
};