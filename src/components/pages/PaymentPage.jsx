import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Clock, AlertCircle } from "lucide-react";
import { clearBlockTicketData } from "../../services/bookingService";
import { createPaymentOrder, verifyPayment, confirmBooking } from "../../services/paymentService";

function PaymentPage() {
  const navigate = useNavigate();
  const [bookingData, setBookingData] = useState(null);
  const [blockKey, setBlockKey] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState("08:00");
  const [isExpired, setIsExpired] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState(null);

  // Only update the selected method — API call happens on "Proceed to Pay"
  const handlePaymentMethodSelect = (method) => {
    setSelectedPaymentMethod(method);
  };

  // ✅ LOAD BOOKING DATA AND BLOCK KEY
  useEffect(() => {
    try {
      const data = JSON.parse(localStorage.getItem("bookingData"));
      const key = localStorage.getItem("BlockKey");

      if (!data || !key) {
        console.warn("❌ Missing booking data or BlockKey");
        navigate("/search");
        return;
      }

      setBookingData(data);
      setBlockKey(key);
      console.log("✅ Booking data and BlockKey loaded");
      console.log("🔑 BlockID:", key);
      console.log("📦 Complete Booking Data:", data);
      
      // ✅ LOG TIME REMAINING
      const blockExpiryTime = localStorage.getItem("blockExpiryTime");
      if (blockExpiryTime) {
        const timeRemain = parseInt(blockExpiryTime) - Date.now();
        const minutes = Math.floor(timeRemain / 60000);
        const seconds = Math.floor((timeRemain % 60000) / 1000);
        console.log("⏱️ [PaymentPage] BlockKey expires in:", minutes + "m " + seconds + "s");
        console.log("⚠️ [PaymentPage] Complete payment within this time to confirm booking!");
      }
    } catch (error) {
      console.error("❌ Error loading booking data:", error);
      navigate("/search");
    }
  }, [navigate]);

  // ✅ COUNTDOWN TIMER EFFECT
  useEffect(() => {
    if (!bookingData) return;

    const timer = setInterval(() => {
      const blockExpiryTime = localStorage.getItem("blockExpiryTime");
      if (!blockExpiryTime) {
        clearInterval(timer);
        return;
      }

      const remaining = parseInt(blockExpiryTime) - Date.now();

      if (remaining <= 0) {
        // ✅ SEAT HOLD EXPIRED
        console.warn("⏰ Seat hold expired!");
        clearBlockTicketData();
        setIsExpired(true);
        clearInterval(timer);
        return;
      }

      // ✅ Convert milliseconds to MM:SS format
      const totalSeconds = Math.floor(remaining / 1000);
      const minutes = Math.floor(totalSeconds / 60);
      const seconds = totalSeconds % 60;
      const formattedTime = `${String(minutes).padStart(2, "0")}:${String(
        seconds
      ).padStart(2, "0")}`;

      setTimeRemaining(formattedTime);
    }, 1000);

    return () => clearInterval(timer);
  }, [bookingData]);

  // ✅ HANDLE EXPIRY REDIRECT
  useEffect(() => {
    if (isExpired) {
      const timer = setTimeout(() => {
        navigate("/search");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isExpired, navigate]);

  // ✅ HANDLE RAZORPAY PAYMENT
  const handlePayment = async (methodToUse) => {
    const paymentMethod = methodToUse || selectedPaymentMethod;
    if (!paymentMethod) {
      setPaymentError("Please select a payment method.");
      return;
    }

    try {
      setIsProcessing(true);
      setPaymentError(null);

      if (!bookingData) {
        throw new Error("Booking data not available");
      }

      // ✅ CHECK IF BLOCKKEY IS STILL VALID
      const blockExpiryTime = localStorage.getItem("blockExpiryTime");
      const timeRemainMs = blockExpiryTime ? parseInt(blockExpiryTime) - Date.now() : 0;
      console.log("⏱️ [PaymentPage] Time remaining for BlockKey:", Math.floor(timeRemainMs / 1000), "seconds");
      
      if (timeRemainMs <= 0) {
        throw new Error("BlockKey has expired. Please search and book again.");
      }

      // ✅ BUILD METADATA
      const metadata = {
        passengerName: bookingData.passengers?.[0]?.name || "Guest",
        route: `${
          typeof bookingData.boardingPoint === "object"
            ? bookingData.boardingPoint?.name
            : bookingData.boardingPoint
        } → ${
          typeof bookingData.droppingPoint === "object"
            ? bookingData.droppingPoint?.name
            : bookingData.droppingPoint
        }`,
        seats: bookingData.selectedSeats?.map((s) => s.name) || [],
        journeyDate: bookingData.journeyDate || new Date().toISOString().split("T")[0],
      };

      // ✅ VALIDATE BLOCKKEY
      const currentBlockKey = blockKey || localStorage.getItem("BlockKey");
      console.log("Booking ID:", bookingData.bookingId);
      console.log("BlockKey:", currentBlockKey);
      if (!currentBlockKey) {
        throw new Error("BlockKey is missing");
      }

      // ✅ CREATE ORDER VIA API
      console.log("💳 [PaymentPage] Creating Razorpay order...");
      const bookingId = bookingData.bookingId;
      const orderPayload = {
        bookingId,
        blockKey: currentBlockKey,
        amount: bookingData.totalPrice,
        description: `Bus ticket - ${metadata.route}`,
        metadata,
      };

      const orderResponse = await createPaymentOrder(orderPayload);

      console.log("✅ [PaymentPage] Order created:", orderResponse);

      // ✅ OPEN RAZORPAY CHECKOUT
      const options = {
        key: orderResponse.keyId,
        amount: orderResponse.amount, // in paise (already multiplied by 100)
        currency: orderResponse.currency || "INR",
        name: "AsiaBus",
        description: `Bus Booking - ${metadata.route}`,
        order_id: orderResponse.orderId,
        prefill: {
          name: metadata.passengerName,
          email: bookingData.passengers?.[0]?.email || "",
          contact: bookingData.passengers?.[0]?.mobile || "",
          method: paymentMethod, // Auto-select the selected payment method!
        },
        theme: {
          color: "#ef4444",
        },
        // ✅ SHOW UPI APPS AS DIRECT BUTTONS (GPay, PhonePe, BHIM) - NOT QR CODE
        method: {
          upi: true,
          card: true,
          netbanking: true,
          wallet: true,
          emandate: false,
        },
        handler: async (response) => {
          try {
            console.log("✅ [Razorpay] Payment successful:", response);
            const paymentStartTime = Date.now();

            // ✅ VERIFY PAYMENT WITH BACKEND
            const verifyResponse = await verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            console.log("✅ [PaymentPage] Payment verified:", verifyResponse);
            const verifyTime = Date.now() - paymentStartTime;
            console.log("⏱️ [PaymentPage] Verification took:", verifyTime, "ms");

            // ✅ CHECK TIME REMAINING BEFORE CONFIRM BOOKING
            const blockExpiryTime = localStorage.getItem("blockExpiryTime");
            const timeRemainBeforeConfirm = blockExpiryTime ? parseInt(blockExpiryTime) - Date.now() : 0;
            console.log("⏱️ [PaymentPage] Time remaining before confirm:", Math.floor(timeRemainBeforeConfirm / 1000), "seconds");
            
            if (timeRemainBeforeConfirm <= 0) {
              throw new Error("BlockKey expired during payment. Please try again.");
            }

            // ✅ CONFIRM BOOKING / BOOK TICKET WITH BLOCKKEY
            console.log("🎫 [PaymentPage] Now confirming ticket with BlockKey...");
            const confirmStartTime = Date.now();
            const confirmResponse = await confirmBooking(blockKey);
            const confirmTime = Date.now() - confirmStartTime;

            console.log("✅ [PaymentPage] Ticket confirmed:", confirmResponse);
            console.log("🎟️ [PaymentPage] TIN (Ticket Number):", confirmResponse.tin);
            console.log("⏱️ [PaymentPage] Confirm booking took:", confirmTime, "ms");
            console.log("⏱️ [PaymentPage] Total time from payment to confirmation:", Date.now() - paymentStartTime, "ms");

            // ✅ PRINT BLOCK ID AND PAYMENT ID IN CONSOLE
            console.log("--------------------------------------------------");
            console.log("💎 SUCCESSFUL PAYMENT & BOOKING CONFIRMATION 💎");
            console.log("👉 BLOCK ID (BlockKey):", blockKey);
            console.log("👉 PAYMENT ID (Internal):", verifyResponse.paymentId);
            console.log("👉 RAZORPAY PAYMENT ID:", response.razorpay_payment_id);
            console.log("👉 TICKET NO (TIN):", confirmResponse.tin);
            console.log("--------------------------------------------------");

            // ✅ READ bookingData from sessionStorage snapshot (reliable — not stale React state)
            let finalBookingData = bookingData;
            try {
              const snapshotStr = sessionStorage.getItem("printTicketBookingData");
              if (snapshotStr) {
                finalBookingData = JSON.parse(snapshotStr);
                console.log("✅ [PaymentPage] Loaded bookingData from sessionStorage snapshot");
              }
            } catch (e) {
              console.warn("⚠️ [PaymentPage] Could not parse sessionStorage snapshot, using React state");
            }

            const finalBlockKey = sessionStorage.getItem("printTicketBlockKey") || currentBlockKey;
            // confirmResponse.tin is now a string (fixed in paymentService)
            // Extra fallbacks: tinData object has {tin, bookingId, blockKey, ...}
            const finalTin =
              (typeof confirmResponse.tin === "string" ? confirmResponse.tin : null) ||
              confirmResponse.tinData?.tin ||
              confirmResponse.tinData?.TIN ||
              confirmResponse.data?.tin ||
              confirmResponse.data?.TIN;
            const finalPaymentId = verifyResponse.paymentId || verifyResponse.data?.paymentId || response.razorpay_payment_id;
            const finalBookingId =
              verifyResponse.bookingId ||
              verifyResponse.data?.bookingId ||
              confirmResponse.tinData?.bookingId ||
              bookingId;

            console.log("🎫 [PrintTicket Navigate] Final data:");
            console.log("  tin:", finalTin);
            console.log("  paymentId:", finalPaymentId);
            console.log("  bookingId:", finalBookingId);
            console.log("  blockKey:", finalBlockKey);
            console.log("  bookingData:", finalBookingData);

            // ✅ ALSO SAVE TO sessionStorage so PrintTicket can read it as fallback
            sessionStorage.setItem("printTicketState", JSON.stringify({
              tin: finalTin,
              paymentId: finalPaymentId,
              bookingId: finalBookingId,
              blockKey: finalBlockKey,
              bookingData: finalBookingData,
            }));

            // ✅ CLEAR TEMPORARY DATA AND REDIRECT
            clearBlockTicketData();
            localStorage.removeItem("bookingData");
            sessionStorage.removeItem("printTicketBookingData");
            sessionStorage.removeItem("printTicketBlockKey");

            // ✅ REDIRECT TO SUCCESS PAGE WITH PAYMENT & TICKET DATA
            navigate("/print-ticket", {
              state: {
                paymentId: finalPaymentId,
                bookingId: finalBookingId,
                tin: finalTin,
                bookingData: finalBookingData,
                blockKey: finalBlockKey,
              },
            });
          } catch (verifyError) {
            console.error("❌ [PaymentPage] Payment or booking confirmation failed:", verifyError);
            setPaymentError(
              verifyError.response?.data?.message ||
                verifyError.message ||
                "Payment or booking confirmation failed. Please contact support."
            );
            setIsProcessing(false);
          }
        },
        modal: {
          ondismiss: () => {
            console.warn("⚠️ [Razorpay] Checkout dismissed by user");
            setIsProcessing(false);
          },
        },
      };

      // ✅ SNAPSHOT bookingData to sessionStorage BEFORE opening Razorpay
      // React state can be stale/null inside async Razorpay callbacks
      sessionStorage.setItem("printTicketBookingData", JSON.stringify(bookingData));
      sessionStorage.setItem("printTicketBlockKey", currentBlockKey);
      console.log("💾 [PaymentPage] Snapshotted bookingData to sessionStorage before Razorpay open");

      // ✅ INITIALIZE AND OPEN RAZORPAY
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("❌ [PaymentPage] Payment error:", error);
      setPaymentError(
        error.response?.data?.message ||
          error.message ||
          "Failed to create payment order. Please try again."
      );
      setIsProcessing(false);
    }
  };

  if (isExpired) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md text-center">
          <div className="mb-4 flex justify-center">
            <div className="bg-red-100 rounded-full p-4">
              <AlertCircle size={48} className="text-red-600" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-red-600 mb-2">
            Seat Hold Expired
          </h2>
          <p className="text-gray-600 mb-6">
            Your seat reservation has expired. Please search and book again.
          </p>
          <p className="text-sm text-gray-500">Redirecting to search...</p>
        </div>
      </div>
    );
  }

  if (!bookingData) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading booking details...</p>
        </div>
      </div>
    );
  }

  const {
    selectedSeats = [],
    boardingPoint = {},
    droppingPoint = {},
    totalPrice = 0,
    passengers = [],
    travels = "",
    busType = "",
    departureTime = "",
    arrivalTime = "",
  } = bookingData;

  const boarding =
    typeof boardingPoint === "object"
      ? boardingPoint?.name || "N/A"
      : boardingPoint || "N/A";
  const dropping =
    typeof droppingPoint === "object"
      ? droppingPoint?.name || "N/A"
      : droppingPoint || "N/A";

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 md:p-8">
      {/* HEADER WITH TIMER */}
      <div className="max-w-7xl mx-auto mb-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Complete Your Payment
          </h1>
          <div className="bg-white rounded-lg shadow-md p-3 sm:p-4 flex items-center gap-2 sm:gap-3">
            <Clock
              size={24}
              className={`${
                timeRemaining.split(":")[0] === "00"
                  ? "text-red-600 animate-pulse"
                  : "text-green-600"
              }`}
            />
            <div className="text-right">
              <p className="text-xs sm:text-sm text-gray-600">Hold expires in</p>
              <p
                className={`text-lg sm:text-2xl font-bold font-mono ${
                  timeRemaining.split(":")[0] === "00"
                    ? "text-red-600"
                    : "text-gray-900"
                }`}
              >
                {timeRemaining}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT COLUMN - PAYMENT METHODS & DETAILS */}
        <div className="lg:col-span-2 space-y-6">
          {/* TRIP DETAILS CARD */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              Trip Details
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <p className="text-xs text-gray-600 font-semibold mb-1">
                  DEPARTURE
                </p>
                <p className="text-lg font-bold text-gray-900">
                  {departureTime}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-600 font-semibold mb-1">
                  ARRIVAL
                </p>
                <p className="text-lg font-bold text-gray-900">{arrivalTime}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600 font-semibold mb-1">
                  FROM
                </p>
                <p className="text-lg font-bold text-gray-900">{boarding}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600 font-semibold mb-1">TO</p>
                <p className="text-lg font-bold text-gray-900">{dropping}</p>
              </div>
            </div>
          </div>

          {/* BUS DETAILS CARD */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Bus Details</h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                <span className="text-gray-600">Bus Name</span>
                <span className="font-semibold text-gray-900">{travels}</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                <span className="text-gray-600">Bus Type</span>
                <span className="font-semibold text-gray-900">{busType}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Selected Seats</span>
                <span className="font-semibold text-gray-900">
                  {selectedSeats.map((s) => s.name).join(", ")}
                </span>
              </div>
            </div>
          </div>

          {/* PASSENGER DETAILS CARD */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              Passenger Details
            </h2>
            <div className="space-y-3">
              {passengers && passengers.length > 0 ? (
                passengers.map((p, idx) => (
                  <div
                    key={idx}
                    className="pb-3 border-b border-gray-200 last:border-b-0"
                  >
                    <p className="font-semibold text-gray-900">
                      {p?.name || "Passenger " + (idx + 1)}
                    </p>
                    <div className="text-sm text-gray-600 mt-1 space-y-0.5">
                      <p>Age: {p?.age || "-"} years</p>
                      <p>
                        Gender: {p?.gender ? (p.gender === "M" ? "Male" : "Female") : "-"}
                      </p>
                      <p>Seat: {p?.seatName || "-"}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No passenger data available</p>
              )}
            </div>
          </div>

          {/* PAYMENT METHODS SECTION */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              Select Payment Method
            </h2>
            <div className="space-y-3">
              {/* UPI PAYMENT */}
              <label className="flex items-start p-4 border-2 rounded-lg cursor-pointer transition hover:bg-gray-50"
                style={{
                  borderColor: selectedPaymentMethod === "upi" ? "#ef4444" : "#e5e7eb",
                  backgroundColor: selectedPaymentMethod === "upi" ? "#fef2f2" : "transparent",
                }}>
                <input
                  type="radio"
                  name="payment"
                  value="upi"
                  checked={selectedPaymentMethod === "upi"}
                  onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                  className="mt-1 w-4 h-4 text-red-500 cursor-pointer"
                />
                <div className="ml-4 flex-1">
                  <p className="font-semibold text-gray-900">
                    UPI Payment (Recommended)
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    Google Pay, PhonePe, BHIM, or other UPI apps
                  </p>
                </div>
              </label>

              {/* CREDIT/DEBIT CARD */}
              <label className="flex items-start p-4 border-2 rounded-lg cursor-pointer transition hover:bg-gray-50"
                style={{
                  borderColor: selectedPaymentMethod === "card" ? "#ef4444" : "#e5e7eb",
                  backgroundColor: selectedPaymentMethod === "card" ? "#fef2f2" : "transparent",
                }}>
                <input
                  type="radio"
                  name="payment"
                  value="card"
                  checked={selectedPaymentMethod === "card"}
                  onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                  className="mt-1 w-4 h-4 text-red-500 cursor-pointer"
                />
                <div className="ml-4 flex-1">
                  <p className="font-semibold text-gray-900">Credit/Debit Card</p>
                  <p className="text-sm text-gray-600 mt-1">
                    Visa, Mastercard, Amex
                  </p>
                </div>
              </label>

              {/* NET BANKING */}
              <label className="flex items-start p-4 border-2 rounded-lg cursor-pointer transition hover:bg-gray-50"
                style={{
                  borderColor: selectedPaymentMethod === "netbanking" ? "#ef4444" : "#e5e7eb",
                  backgroundColor: selectedPaymentMethod === "netbanking" ? "#fef2f2" : "transparent",
                }}>
                <input
                  type="radio"
                  name="payment"
                  value="netbanking"
                  checked={selectedPaymentMethod === "netbanking"}
                  onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                  className="mt-1 w-4 h-4 text-red-500 cursor-pointer"
                />
                <div className="ml-4 flex-1">
                  <p className="font-semibold text-gray-900">Net Banking</p>
                  <p className="text-sm text-gray-600 mt-1">
                    All major Indian banks supported
                  </p>
                </div>
              </label>
            </div>

            {/* PROCEED BUTTON */}
            <button
              onClick={() => handlePayment(selectedPaymentMethod)}
              disabled={isProcessing || !selectedPaymentMethod}
              className="w-full mt-6 bg-red-500 hover:bg-red-600 disabled:bg-gray-400 text-white py-3 rounded-lg font-bold text-lg transition active:scale-95 disabled:cursor-not-allowed"
            >
              {isProcessing ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
                  Processing...
                </span>
              ) : (
                selectedPaymentMethod
                  ? `Proceed to Pay ₹${totalPrice.toLocaleString()}`
                  : "Select a Payment Method"
              )}
            </button>

            {/* ERROR MESSAGE */}
            {paymentError && (
              <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex gap-3">
                  <AlertCircle size={20} className="text-red-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-red-900">Payment Error</p>
                    <p className="text-sm text-red-700 mt-1">{paymentError}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN - FARE BREAKDOWN & SUMMARY */}
        <div className="lg:col-span-1">
          {/* FARE BREAKDOWN CARD - STICKY */}
          <div className="bg-white rounded-xl shadow-md p-6 sticky top-6">
            <h2 className="text-lg font-bold text-gray-900 mb-6">
              Fare Summary
            </h2>

            <div className="space-y-4">
              {/* SEAT COUNT */}
              <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                <span className="text-gray-600">
                  {selectedSeats.length} Seat{selectedSeats.length !== 1 ? "s" : ""}
                </span>
                <span className="font-semibold text-gray-900">
                  ₹{totalPrice.toLocaleString()}
                </span>
              </div>

              {/* INDIVIDUAL SEATS BREAKDOWN */}
              {selectedSeats && selectedSeats.length > 0 && (
                <div className="space-y-2 pb-3 border-b border-gray-200">
                  {selectedSeats.map((seat, idx) => (
                    <div
                      key={idx}
                      className="flex justify-between text-sm text-gray-600"
                    >
                      <span>{seat.name}</span>
                      <span>₹{seat.fare?.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* DISCOUNT (If any) */}
              <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                <span className="text-gray-600">Discount</span>
                <span className="font-semibold text-green-600">₹0</span>
              </div>

              {/* TAXES */}
              <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                <span className="text-gray-600">Taxes & Fees</span>
                <span className="font-semibold text-gray-900">₹0</span>
              </div>

              {/* TOTAL AMOUNT */}
              <div className="flex justify-between items-center pt-2">
                <span className="text-lg font-bold text-gray-900">
                  Total Amount
                </span>
                <span className="text-2xl font-bold text-red-600">
                  ₹{totalPrice.toLocaleString()}
                </span>
              </div>
            </div>

            {/* SEAT HOLD TIMER ALERT */}
            <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Clock size={20} className="text-yellow-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="font-semibold text-yellow-900 mb-1">
                    Seat Hold Expires In
                  </p>
                  <p
                    className={`text-xl font-bold font-mono ${
                      timeRemaining.split(":")[0] === "00"
                        ? "text-red-600"
                        : "text-yellow-700"
                    }`}
                  >
                    {timeRemaining}
                  </p>
                  <p className="text-yellow-700 mt-2 text-xs">
                    Complete your payment before the hold expires to secure your seats.
                  </p>
                </div>
              </div>
            </div>

            {/* GO BACK BUTTON */}
            <button
              onClick={() => navigate("/search")}
              className="w-full mt-6 border-2 border-gray-300 hover:border-gray-400 text-gray-700 hover:text-gray-900 py-3 rounded-lg font-semibold transition"
            >
              Modify Booking
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PaymentPage;