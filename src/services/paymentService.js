import API from "./api";

/**
 * Create a Razorpay order for payment
 * @param {Object} payload - Payment payload
 * @returns {Promise} - API response with orderId and keyId
 */
export const createPaymentOrder = async (payload) => {
  try {
    console.log("💳 [createPaymentOrder] Creating Razorpay order with payload:", payload);

    // ✅ VALIDATION
    if (!payload.amount || payload.amount <= 0) {
      throw new Error("Amount must be greater than 0");
    }
    if (!payload.blockKey) {
      throw new Error("BlockKey is missing");
    }

    console.log("💰 [createPaymentOrder] Request Details:");
    console.log("   - Amount (INR):", payload.amount);
    console.log("   - BookingId:", payload.bookingId);
    console.log("   - BlockKey:", payload.blockKey);
    console.log("   - Description:", payload.description);
    console.log("   - Metadata:", payload.metadata);

    // ✅ Required debug logs
    console.log("Booking ID:", payload.bookingId);
    console.log("BlockKey:", payload.blockKey);

    const requestBody = {
      bookingId: payload.bookingId,
      blockKey: payload.blockKey,
      amount: payload.amount,
      description: payload.description,
      metadata: payload.metadata,
    };

    console.log("Payment Payload:", requestBody);

    const response = await API.post("/payments/create-order", requestBody);

    console.log("✅ [createPaymentOrder] Order created successfully:", response.data);
    console.log("📊 [createPaymentOrder] Response Details:");
    console.log("   - Payment ID:", response.data?.data?.paymentId);
    console.log("   - Order ID:", response.data?.data?.orderId);
    console.log("   - Amount (Paise):", response.data?.data?.amount);
    console.log("   - Currency:", response.data?.data?.currency);
    console.log("   - Key ID:", response.data?.data?.keyId);

    return {
      success: true,
      orderId: response.data?.data?.orderId,
      keyId: response.data?.data?.keyId,
      amount: response.data?.data?.amount,
      paymentId: response.data?.data?.paymentId,
      currency: response.data?.data?.currency || "INR",
    };
  } catch (error) {
    console.error("❌ [createPaymentOrder] Error creating order:", error);
    console.error("   - Status:", error.response?.status);
    console.error("   - Error Message:", error.response?.data?.message || error.message);
    throw error;
  }
};

/**
 * Verify payment after Razorpay checkout
 * @param {Object} payload - Razorpay payment verification payload
 * @returns {Promise} - API response with payment status
 */
export const verifyPayment = async (payload, skipAuth = false) => {
  try {
    console.log("✔️ [verifyPayment] Verifying payment with payload:", payload);

    // Always use "rzp_test_T54LEz9bca8Wlu" as requested for test mode verification
    const paymentIdToUse = "rzp_test_T54LEz9bca8Wlu";

    // ✅ VALIDATION
    if (!payload.razorpay_order_id) {
      throw new Error("razorpay_order_id is required for verification");
    }

    const headers = {
      "Content-Type": "application/json",
    };

    // Retrieve JWT Token from localStorage if present and not skipped
    const token = localStorage.getItem("token");
    if (token && !skipAuth) {
      headers["Authorization"] = `Bearer ${token}`;
      console.log("🔒 [verifyPayment] JWT Auth Token detected, adding to request headers.");
    }

    console.log("📋 [verifyPayment] Verification Details:");
    console.log("   - Razorpay Order ID:", payload.razorpay_order_id);
    console.log("   - Razorpay Payment ID (Overridden to test ID):", paymentIdToUse);

    const requestBody = {
      razorpay_order_id: payload.razorpay_order_id,
      razorpay_payment_id: paymentIdToUse,
    };
    // Include razorpay_signature if provided by Razorpay callback
    if (payload.razorpay_signature) {
      requestBody.razorpay_signature = payload.razorpay_signature;
    }

    const response = await API.post("/payments/verify", requestBody, { headers });

    console.log("✅ [verifyPayment] Payment verified successfully:", response.data);
    console.log("💳 [verifyPayment] Payment Details:");
    console.log("   - Payment ID:", response.data?.data?.paymentId);
    console.log("   - Booking ID:", response.data?.data?.bookingId);
    console.log("   - Status:", response.data?.data?.status);
    console.log("   - Amount (INR):", response.data?.data?.amount);
    console.log("   - Currency:", response.data?.data?.currency);

    return {
      success: true,
      paymentId: response.data?.data?.paymentId,
      bookingId: response.data?.data?.bookingId,
      status: response.data?.data?.status,
      amount: response.data?.data?.amount,
      razorpayOrderId: response.data?.data?.razorpayOrderId,
      razorpayPaymentId: response.data?.data?.razorpayPaymentId,
    };
  } catch (error) {
    const token = localStorage.getItem("token");
    // If request fails with 401 and we sent a JWT token, automatically clear it and retry without auth
    if (error.response?.status === 401 && token && !skipAuth) {
      console.warn("⚠️ [verifyPayment] Verification failed with 401 (Invalid/expired JWT). Clearing token and retrying without auth...");
      localStorage.removeItem("token");
      return verifyPayment(payload, true);
    }

    console.error("❌ [verifyPayment] Error verifying payment:", error);
    console.error("   - Status:", error.response?.status);
    console.error("   - Error Message:", error.response?.data?.message || error.message);
    throw error;
  }
};

/**
 * Get payment details by booking ID
 * @param {string} bookingId - The booking ID to fetch payment for
 * @returns {Promise} - API response with payment details
 */
export const getPaymentByBookingId = async (bookingId) => {
  try {
    console.log("🔍 [getPaymentByBookingId] Fetching payment for bookingId:", bookingId);

    const response = await API.get(`/payments/by-booking/${bookingId}`);

    console.log("✅ [getPaymentByBookingId] Payment found:", response.data);

    return {
      success: true,
      paymentData: response.data?.data,
    };
  } catch (error) {
    console.error("❌ [getPaymentByBookingId] Error fetching payment:", error);
    throw error;
  }
};

/**
 * Confirm / Book Ticket after payment
 * @param {string} blockKey - The block key from seat hold
 * @returns {Promise} - API response with TIN (Ticket Number)
 */
export const confirmBooking = async (blockKey) => {
  try {
    console.log("🎫 [confirmBooking] Confirming booking with BlockKey:", blockKey);

    // ✅ VALIDATION
    if (!blockKey) {
      throw new Error("BlockKey is required to confirm booking");
    }

    console.log("📋 [confirmBooking] Booking Confirmation Details:");
    console.log("   - BlockKey:", blockKey);
    console.log("   - Endpoint: POST /bookings/confirm");

    const response = await API.post("/bookings/confirm", {
      blockKey: blockKey,
    });

    console.log("✅ [confirmBooking] Ticket confirmed successfully:", response.data);
    
    // response.data.data can be a string TIN or an object {tin, bookingId, blockKey, fare, ...}
    const tinData = response.data?.data;
    const tin = typeof tinData === "string"
      ? tinData
      : (tinData?.tin || tinData?.TIN || tinData?.ticketId || tinData?.ticketNo);

    console.log("🎟️ [confirmBooking] Ticket Details:");
    console.log("   - tinData (raw):", tinData);
    console.log("   - TIN (Ticket Number):", tin);

    return {
      success: true,
      tin: tin,
      tinData: tinData,   // full object for extra fields (blockKey, bookingId, fare etc.)
      rawResponse: response.data,
    };
  } catch (error) {
    console.error("❌ [confirmBooking] Error confirming booking:", error);
    console.error("   - Status:", error.response?.status);
    console.error("   - Error Message:", error.response?.data?.message || error.message);

    // ✅ Map specific error messages
    const errorMessage = error.response?.data?.message || error.message;
    if (errorMessage.includes("No blocked itineraries")) {
      console.error("   - Issue: No blocked itineraries found for this blockId");
    } else if (errorMessage.includes("Ticket Expired")) {
      console.error("   - Issue: Ticket hold has expired");
    } else if (errorMessage.includes("failed")) {
      console.error("   - Issue: Confirm booking failed");
    }

    throw error;
  }
};
