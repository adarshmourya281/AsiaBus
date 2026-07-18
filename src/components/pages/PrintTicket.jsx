import { useLocation, useNavigate } from "react-router-dom";
import { CheckCircle, Printer, Home, Calendar, MapPin, User, Ticket, CreditCard, ArrowRight } from "lucide-react";

function PrintTicket() {
  const location = useLocation();
  const navigate = useNavigate();

  // ✅ PRIMARY: Read from navigate state
  // ✅ FALLBACK: Read from sessionStorage (set by PaymentPage before Razorpay callback)
  let rawState = location.state || {};

  if (!rawState.tin || !rawState.bookingData) {
    try {
      const saved = sessionStorage.getItem("printTicketState");
      if (saved) {
        rawState = JSON.parse(saved);
        console.log("✅ [PrintTicket] Loaded state from sessionStorage fallback:", rawState);
        // Clean up after reading
        sessionStorage.removeItem("printTicketState");
      }
    } catch (e) {
      console.warn("⚠️ [PrintTicket] Failed to parse sessionStorage state:", e);
    }
  }

  const paymentId = rawState.paymentId;
  const bookingId = rawState.bookingId;
  const tin = rawState.tin || rawState.TIN;
  const bookingData = rawState.bookingData;
  const blockKey = rawState.blockKey;

  console.log("🎫 [PrintTicket] Final state used:", { tin, bookingData, paymentId, bookingId, blockKey });

  // If no state exists (e.g. direct page refresh), display an error/redirect state
  if (!tin || !bookingData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md text-center border border-gray-100">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Ticket className="text-red-500" size={32} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">No Ticket Data Found</h2>
          <p className="text-gray-600 mb-6">
            We couldn't retrieve any ticket confirmation details. This page is only accessible right after a successful booking.
          </p>
          <button
            onClick={() => navigate("/")}
            className="w-full bg-red-500 hover:bg-red-600 text-white py-3 rounded-xl font-semibold transition active:scale-95 flex items-center justify-center gap-2"
          >
            <Home size={18} />
            Go to Home
          </button>
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
    bookingTime = new Date().toISOString(),
  } = bookingData;

  const boarding = typeof boardingPoint === "object" ? boardingPoint?.name || "N/A" : boardingPoint || "N/A";
  const dropping = typeof droppingPoint === "object" ? droppingPoint?.name || "N/A" : droppingPoint || "N/A";
  const journeyDate = bookingData.journeyDate || new Date().toISOString().split("T")[0];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8 print:bg-white print:py-0">
      <div className="max-w-3xl mx-auto space-y-6">
        
        {/* SUCCESS SUMMARY (Hidden during print) */}
        <div className="bg-white rounded-2xl shadow-md p-6 text-center border border-green-100 print:hidden">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="text-green-600 animate-bounce" size={36} />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
            Booking Confirmed!
          </h1>
          <p className="text-gray-600 mt-2">
            Your ticket has been booked successfully. A copy of your ticket details is displayed below.
          </p>
          <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-green-50 text-green-800 rounded-full text-sm font-semibold">
            <span>Ticket Number (TIN):</span>
            <span className="font-mono text-base">{tin}</span>
          </div>
        </div>

        {/* ACTIONS BAR (Hidden during print) */}
        <div className="flex justify-between items-center print:hidden">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium transition"
          >
            <Home size={18} />
            Back to Home
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-5 py-2.5 rounded-xl font-semibold shadow-md hover:shadow-lg transition active:scale-95"
          >
            <Printer size={18} />
            Print / Save PDF
          </button>
        </div>

        {/* GORGEOUS DESIGNER E-TICKET CARD */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-200 relative print:shadow-none print:border-none">
          
          {/* Top Brand Banner */}
          <div className="bg-gradient-to-r from-red-500 to-red-600 px-6 sm:px-8 py-6 text-white flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-black tracking-wider">AsiaBus</h2>
              <p className="text-xs text-red-100 font-medium mt-0.5">Your Journey, Our Priority</p>
            </div>
            <div className="text-right">
              <span className="text-xs font-semibold uppercase tracking-wider text-red-100">Electronic Ticket</span>
              <p className="text-lg font-mono font-bold mt-0.5">{tin}</p>
            </div>
          </div>

          {/* Ticket Body */}
          <div className="p-6 sm:p-8 space-y-6">
            
            {/* Verification IDs Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-gray-50 rounded-2xl p-4 text-xs font-medium border border-gray-100 font-mono">
              <div>
                <p className="text-gray-500 mb-0.5 font-sans font-semibold">TICKET NO (TIN)</p>
                <p className="text-gray-900 font-bold break-all">{tin}</p>
              </div>
              <div>
                <p className="text-gray-500 mb-0.5 font-sans font-semibold">BLOCK ID (KEY)</p>
                <p className="text-gray-900 font-bold break-all">{blockKey || "N/A"}</p>
              </div>
              <div>
                <p className="text-gray-500 mb-0.5 font-sans font-semibold">PAYMENT ID</p>
                <p className="text-gray-900 font-bold break-all">{paymentId || "N/A"}</p>
              </div>
              <div>
                <p className="text-gray-500 mb-0.5 font-sans font-semibold">BOOKING ID</p>
                <p className="text-gray-900 font-bold break-all">{bookingId || "N/A"}</p>
              </div>
            </div>

            {/* Route & Times */}
            <div className="border-b border-dashed border-gray-200 pb-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                
                {/* Boarding Point */}
                <div className="flex-1">
                  <div className="flex items-center gap-2 text-red-500 mb-1">
                    <MapPin size={18} />
                    <span className="text-xs font-bold uppercase tracking-wider">Boarding Point</span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">{boarding}</h3>
                  <p className="text-sm font-semibold text-gray-600 mt-0.5">{departureTime}</p>
                </div>

                {/* Arrow Icon Indicator */}
                <div className="hidden sm:flex items-center justify-center text-gray-300 px-4">
                  <ArrowRight size={24} className="text-red-500" />
                </div>

                {/* Dropping Point */}
                <div className="flex-1 sm:text-right">
                  <div className="flex items-center sm:justify-end gap-2 text-red-500 mb-1">
                    <MapPin size={18} />
                    <span className="text-xs font-bold uppercase tracking-wider">Dropping Point</span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">{dropping}</h3>
                  <p className="text-sm font-semibold text-gray-600 mt-0.5">{arrivalTime}</p>
                </div>

              </div>
            </div>

            {/* Travel Details Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 border-b border-dashed border-gray-200 pb-6 text-sm">
              <div className="space-y-1">
                <span className="text-xs text-gray-500 uppercase font-semibold">Travels / Operator</span>
                <p className="font-bold text-gray-900">{travels || "AsiaBus Express"}</p>
              </div>
              <div className="space-y-1">
                <span className="text-xs text-gray-500 uppercase font-semibold">Bus Type</span>
                <p className="font-bold text-gray-900">{busType || "A/C Seater/Sleeper"}</p>
              </div>
              <div className="space-y-1">
                <span className="text-xs text-gray-500 uppercase font-semibold">Journey Date</span>
                <div className="flex items-center gap-1.5 font-bold text-gray-900">
                  <Calendar size={16} className="text-gray-500" />
                  <p>{journeyDate}</p>
                </div>
              </div>
            </div>

            {/* Passenger & Seats Info */}
            <div className="border-b border-dashed border-gray-200 pb-6">
              <h4 className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-3">Passenger & Seat Details</h4>
              <div className="space-y-3">
                {passengers.map((passenger, idx) => (
                  <div key={idx} className="flex justify-between items-center bg-gray-50 rounded-xl p-3 border border-gray-100 text-sm">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-red-50 text-red-500 rounded-full flex items-center justify-center font-bold text-xs">
                        {idx + 1}
                      </div>
                      <div>
                        <p className="font-bold text-gray-900">{passenger.name}</p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          Age: {passenger.age} | Gender: {passenger.gender === "M" ? "Male" : passenger.gender === "F" ? "Female" : "Other"}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-xs text-gray-500 block uppercase font-semibold">Seat</span>
                      <span className="font-bold text-red-500">{passenger.seatName}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Total Fare & Payment */}
            <div className="flex justify-between items-center pt-2">
              <div className="flex items-center gap-2 text-gray-600 text-sm font-semibold">
                <CreditCard size={18} />
                <span>Payment Status</span>
              </div>
              <div className="text-right">
                <span className="text-xs text-gray-500 block">Total Paid (INR)</span>
                <span className="text-2xl font-black text-green-600">₹{totalPrice.toLocaleString()}</span>
              </div>
            </div>

          </div>

          {/* Bottom Dotted Visual Segment */}
          <div className="bg-gray-50 px-6 sm:px-8 py-4 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-2 text-xs text-gray-500">
            <p>Booked on: {new Date(bookingTime).toLocaleString()}</p>
            <p className="font-mono text-gray-400">Thank you for traveling with AsiaBus!</p>
          </div>

        </div>

      </div>
    </div>
  );
}

export default PrintTicket;