import { useState, useEffect } from "react";
import SeatSelection from "./SeatSelection";
import Boarding from "./Boarding";
import Passenger from "./Passenger";
import BusDetails from "./BusDetails";
import { useNavigate } from "react-router-dom";
import {
  blockTicket,
  buildBlockTicketPayload,
  storeBlockTicketData,
} from "../../services/bookingService";

function SeatModal({ trip, onClose }) {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [passengers, setPassengers] = useState([]);
  const [boardingPoint, setBoardingPoint] = useState(null);
  const [droppingPoint, setDroppingPoint] = useState(null);
  const [isPassengerValid, setIsPassengerValid] = useState(false);
  const [isBlockingSeats, setIsBlockingSeats] = useState(false);
  const [blockError, setBlockError] = useState(null);

  // ✅ STEP CONTROL
  const handleStepChange = (targetStep) => {
    console.log(`🔄 Attempting step change: ${step} → ${targetStep}`);
    console.log(`📦 selectedSeats:`, selectedSeats);
    console.log(`📍 boardingPoint:`, boardingPoint);
    console.log(`📍 droppingPoint:`, droppingPoint);

    if (targetStep > 1 && selectedSeats.length === 0) {
      console.warn("⚠️ Cannot proceed - no seats selected");
      alert("Please select at least one seat first");
      return;
    }

    if (targetStep > 2 && (!boardingPoint || !droppingPoint)) {
      console.warn("⚠️ Cannot proceed - boarding/dropping points not selected");
      alert("Please select both boarding and dropping points");
      return;
    }

    console.log(`✅ Step changed to: ${targetStep}`);
    setStep(targetStep);
  };

  // ✅ RESET VALIDATION WHEN STEP CHANGES
  useEffect(() => {
    if (step !== 3) setIsPassengerValid(false);
  }, [step]);

  // ✅ TOTAL PRICE
  const totalPrice = selectedSeats.reduce(
    (sum, seat) => sum + (seat.fare || 0),
    0
  );

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-end sm:items-center justify-center overflow-hidden max-w-full">
      <div className="w-full sm:w-auto sm:max-w-7xl bg-white rounded-t-3xl sm:rounded-2xl md:rounded-3xl h-[95vh] sm:h-auto sm:max-h-[90vh] p-3 sm:p-4 md:p-6 overflow-y-auto relative max-w-full">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-2 sm:mb-3 md:mb-4 sticky top-0 bg-white z-10">
          <h2 className="font-bold text-sm sm:text-base md:text-lg">
            {step === 1 && "📍 Select Seats"}
            {step === 2 && "🚍 Board / Drop"}
            {step === 3 && "👥 Passenger Info"}
          </h2>
          <button onClick={onClose} className="text-xl sm:text-2xl font-bold text-gray-500 hover:text-gray-700 transition">✕</button>
        </div>

        {/* STEPS INDICATOR */}
        <div className="flex justify-between gap-2 sm:gap-3 mb-3 sm:mb-4 md:mb-6 text-xs sm:text-sm px-1 sm:px-2">

          <button
            onClick={() => handleStepChange(1)}
            className={`flex-1 text-center py-2 px-2 rounded-lg transition font-semibold ${step === 1 ? "bg-red-500 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
          >
            1. Seats
          </button>

          <button
            onClick={() => handleStepChange(2)}
            className={`flex-1 text-center py-2 px-2 rounded-lg transition font-semibold ${step === 2 ? "bg-red-500 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
          >
            2. Board/Drop
          </button>

          <button
            onClick={() => handleStepChange(3)}
            className={`flex-1 text-center py-2 px-2 rounded-lg transition font-semibold ${step === 3 ? "bg-red-500 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
          >
            3. Passenger
          </button>
        </div>

        {/* CONTENT - RESPONSIVE LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-[auto_1fr_380px] gap-2 sm:gap-3 md:gap-4 mb-28 sm:mb-20 lg:mb-8 px-1 sm:px-2">

          {/* MAIN CONTENT AREA - Full width on mobile/tablet */}
          <div className="lg:col-span-2 space-y-3 sm:space-y-3 md:space-y-3 w-full">
            {step === 1 && (
              <SeatSelection
                trip={trip}
                selectedSeats={selectedSeats}
                setSelectedSeats={setSelectedSeats}
              />
            )}

            {step === 2 && (
              <Boarding
                trip={trip}
                boardingPoint={boardingPoint}
                setBoardingPoint={setBoardingPoint}
                droppingPoint={droppingPoint}
                setDroppingPoint={setDroppingPoint}
              />
            )}

            {step === 3 && (
              <Passenger
                trip={trip}
                selectedSeats={selectedSeats}
                onValidationChange={setIsPassengerValid}
                setPassengers={setPassengers}
              />
            )}
          </div>

          {/* BUS DETAILS SIDEBAR - DESKTOP ONLY (Right column) */}
          <div className="hidden lg:block row-span-3">
            <div className="sticky top-20">
              <BusDetails trip={trip} selectedSeats={selectedSeats} />
            </div>
          </div>
        </div>

        {/* BUS DETAILS - MOBILE/TABLET ONLY */}
        <div className="lg:hidden mb-6 px-1 sm:px-2">
          <BusDetails trip={trip} selectedSeats={selectedSeats} />
        </div>

        {/* BOTTOM BAR - STICKY */}
        {selectedSeats.length > 0 && (
          <div className="fixed bottom-0 left-0 right-0 bg-white p-2 sm:p-3 md:p-4 shadow-2xl border-t-2 border-gray-100 flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-2 sm:gap-4 max-w-full z-40">

            {/* LEFT - Price Info */}
            <div className="text-left">
              <p className="text-xs sm:text-sm text-gray-600">
                {selectedSeats.length} seat{selectedSeats.length !== 1 ? 's' : ''}
              </p>
              <p className="font-bold text-base sm:text-lg md:text-xl text-green-600">₹{totalPrice.toFixed(2)}</p>
            </div>

            {/* RIGHT BUTTONS */}
            <div className="flex gap-2 w-full sm:w-auto">

              {/* STEP 1 */}
              {step === 1 && (
                <button
                  onClick={() => handleStepChange(2)}
                  disabled={selectedSeats.length === 0}
                  className={`flex-1 sm:flex-none px-4 sm:px-6 md:px-8 py-2.5 sm:py-2 md:py-3 rounded-full text-white text-xs sm:text-sm md:text-base font-semibold transition ${selectedSeats.length > 0
                      ? "bg-red-500 hover:bg-red-600 active:scale-95 shadow-md hover:shadow-lg"
                      : "bg-gray-300 cursor-not-allowed opacity-60"
                    }`}
                >
                  {selectedSeats.length === 0
                    ? "Select seats"
                    : "Continue"}
                </button>
              )}

              {/* STEP 2 */}
              {step === 2 && (
                <button
                  onClick={() => handleStepChange(3)}
                  disabled={!boardingPoint || !droppingPoint}
                  className={`flex-1 sm:flex-none px-4 sm:px-6 md:px-8 py-2.5 sm:py-2 md:py-3 rounded-full text-white text-xs sm:text-sm md:text-base font-semibold transition ${boardingPoint && droppingPoint
                    ? "bg-red-500 hover:bg-red-600 active:scale-95 shadow-md hover:shadow-lg"
                    : "bg-gray-300 cursor-not-allowed opacity-60"
                    }`}
                >
                  Continue
                </button>
              )}

              {/* STEP 3 */}
              {step === 3 && (
                <div className="flex-1 sm:flex-none flex flex-col gap-2 w-full sm:w-auto">
                  {blockError && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded text-xs sm:text-sm whitespace-pre-wrap">
                      {blockError}
                    </div>
                  )}
                  <button
                    disabled={!isPassengerValid || isBlockingSeats}
                    onClick={async () => {
                      try {
                        setBlockError(null);
                        setIsBlockingSeats(true);

                        console.log("🔄 Starting seat blocking process...");

                        // ✅ Log all available data
                        console.log("📊 Trip Object:", trip);
                        console.log("📊 Boarding Point:", boardingPoint);
                        console.log("📊 Dropping Point:", droppingPoint);
                        console.log("📊 Passengers:", passengers);

                        // ✅ Build booking data to store after successful blocking
                        const bookingData = {
                          availableTripId: trip.id,
                          tripId: trip.id,
                          travels: trip.travels,
                          busType: trip.busType,
                          departureTime: trip.departureTime,
                          arrivalTime: trip.arrivalTime,
                          duration: trip.duration,
                          source: trip.source || trip.sourceId || 0,
                          destination: trip.destination || trip.destinationId || 0,
                          selectedSeats: selectedSeats.map((seat) => ({
                            name: seat.name,
                            fare: seat.fare,
                            row: seat.row,
                            column: seat.column,
                            zIndex: seat.zIndex,
                          })),
                          boardingPoint,
                          droppingPoint,
                          boardingPointId: boardingPoint?.id || boardingPoint?.pointId || 0,
                          droppingPointId: droppingPoint?.id || droppingPoint?.pointId || 0,
                          totalPrice,
                          passengers,
                          bookingTime: new Date().toISOString(),
                        };

                        // ✅ Build payload for Block Ticket API
                        const blockPayload = buildBlockTicketPayload({
                          availableTripId: trip.id || trip.availableTripId,

                          boardingPointId:
                            boardingPoint?.id || boardingPoint?.pointId,

                          droppingPointId:
                            droppingPoint?.id || droppingPoint?.pointId,

                          source:
                            trip.source || trip.sourceId,

                          destination:
                            trip.destination || trip.destinationId,

                          doj:
                            trip.doj || trip.date || trip.journeyDate,

                          passengers: passengers,
                        });

                        console.log("📌 Block Ticket Payload:", blockPayload);

                        // ✅ Call Block Ticket API
                        const blockResponse = await blockTicket(blockPayload);

                        if (blockResponse.success) {
                          console.log(
                            "✅ Seat blocking successful! BlockKey:",
                            blockResponse.blockKey
                          );
                          console.log("💎 BLOCK ID (BlockKey):", blockResponse.blockKey);
                          if (blockResponse.bookingId) {
                            console.log(
                              "🧾 Seat blocking response includes bookingId:",
                              blockResponse.bookingId
                            );
                            console.log("💎 BOOKING ID:", blockResponse.bookingId);
                          }

                          // ✅ Store block ticket data
                          storeBlockTicketData(blockResponse.blockKey);

                          // ✅ Store booking data with bookingId if returned
                          const storedBookingData = {
                            ...bookingData,
                            ...(blockResponse.bookingId ? { bookingId: blockResponse.bookingId } : {}),
                          };
                          localStorage.setItem(
                            "bookingData",
                            JSON.stringify(storedBookingData)
                          );

                          console.log(
                            "💾 Booking data stored, navigating to payment..."
                          );

                          // ✅ Navigate to payment and close modal
                          navigate("/payment");
                          onClose();
                        }
                      } catch (error) {
                        console.error("❌ Error blocking seats:", error.message);

                        // ✅ Extract specific error messages
                        let errorMsg = "Failed to block seats. Please try again.";

                        if (error.message?.includes("Trip is not available")) {
                          errorMsg = "⏰ Trip is no longer available. Another user may have booked it. Please search again.";
                        } else if (error.response?.status === 502) {
                          errorMsg = "🔧 Server error. Please try again in a few moments.";
                        } else if (error.response?.status === 400) {
                          errorMsg = "❌ Invalid booking details. Please verify and try again.";
                        } else if (error.message) {
                          errorMsg = error.message;
                        }

                        setBlockError(errorMsg);
                        setIsBlockingSeats(false);
                      }
                    }}
                    className={`flex-1 sm:flex-none px-4 sm:px-6 md:px-8 py-2.5 sm:py-2 md:py-3 rounded-full text-white text-xs sm:text-sm md:text-base font-semibold transition ${isPassengerValid && !isBlockingSeats
                        ? "bg-green-600 hover:bg-green-700 active:scale-95 shadow-md hover:shadow-lg"
                        : "bg-gray-300 cursor-not-allowed opacity-60"
                      }`}
                  >
                    {isBlockingSeats ? "🔄 Blocking Seats..." : `Pay ₹${totalPrice.toFixed(0)}`}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default SeatModal;