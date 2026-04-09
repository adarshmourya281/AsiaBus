import { useState } from "react";
import SeatSelection from "./SeatSelection";
import Boarding from "./Boarding";
import Passenger from "./Passenger";

function SeatModal({ onClose }) {
  const [step, setStep] = useState(1);
  const [selectedSeats, setSelectedSeats] = useState([]);

  // ✅ NEW STATES (IMPORTANT)
  const [boardingPoint, setBoardingPoint] = useState(null);
  const [droppingPoint, setDroppingPoint] = useState(null);

  // ✅ STEP CONTROL
  const handleStepChange = (targetStep) => {
    // ❌ Block step 2 & 3 if no seats
    if (targetStep > 1 && selectedSeats.length === 0) {
      alert("Please select seat first");
      return;
    }

    // ❌ Block step 3 if boarding/drop not selected
    if (
      targetStep > 2 &&
      (!boardingPoint || !droppingPoint)
    ) {
      alert("Please select boarding & dropping point");
      return;
    }

    setStep(targetStep);
  };

  // ✅ TOTAL PRICE
  const totalPrice = selectedSeats.reduce(
    (sum, seat) => sum + seat.price,
    0
  );

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-end">
      <div className="w-full bg-white rounded-t-2xl h-[85vh] p-5 overflow-y-auto relative">

        {/* HEADER */}
        <div className="flex justify-between mb-4">
          <h2 className="font-semibold text-lg">
            {step === 1 && "Select Seats"}
            {step === 2 && "Board / Drop"}
            {step === 3 && "Passenger Info"}
          </h2>
          <button onClick={onClose}>✕</button>
        </div>

        {/* 🔥 STEPS */}
        <div className="flex justify-between mb-6 text-sm">

          <span
            onClick={() => handleStepChange(1)}
            className={`cursor-pointer ${
              step === 1 ? "text-red-500 font-semibold" : "text-gray-500"
            }`}
          >
            1. Seats
          </span>

          <span
            onClick={() => handleStepChange(2)}
            className={`cursor-pointer ${
              step === 2 ? "text-red-500 font-semibold" : "text-gray-500"
            }`}
          >
            2. Board/Drop Point
          </span>

          <span
            onClick={() => handleStepChange(3)}
            className={`cursor-pointer ${
              step === 3 ? "text-red-500 font-semibold" : "text-gray-500"
            }`}
          >
            3. Passenger
          </span>
        </div>

        {/* CONTENT */}
        {step === 1 && (
          <SeatSelection
            selectedSeats={selectedSeats}
            setSelectedSeats={setSelectedSeats}
          />
        )}

        {step === 2 && (
          <Boarding
            boardingPoint={boardingPoint}
            setBoardingPoint={setBoardingPoint}
            droppingPoint={droppingPoint}
            setDroppingPoint={setDroppingPoint}
          />
        )}

        {step === 3 && <Passenger />}

        {/* 🔥 BOTTOM BAR */}
        {selectedSeats.length > 0 && (
          <div className="fixed bottom-0 left-0 w-full bg-white p-4 shadow-md border-t flex justify-between items-center">

            {/* LEFT */}
            <div>
              <p className="text-sm text-gray-500">
                {selectedSeats.length} seat
              </p>
              <p className="font-bold text-lg">₹{totalPrice}</p>
            </div>

            {/* RIGHT BUTTONS */}

            {/* STEP 1 */}
            {step === 1 && (
              <button
                onClick={() => handleStepChange(2)}
                className="bg-red-500 text-white px-6 py-2 rounded-full"
              >
                Select boarding & dropping points
              </button>
            )}

            {/* STEP 2 */}
            {step === 2 && (
              <button
                onClick={() => handleStepChange(3)}
                disabled={!boardingPoint || !droppingPoint}
                className={`px-6 py-2 rounded-full text-white
                  ${
                    boardingPoint && droppingPoint
                      ? "bg-red-500"
                      : "bg-gray-300 cursor-not-allowed"
                  }
                `}
              >
                Fill passenger details
              </button>
            )}

            {/* STEP 3 */}
            {step === 3 && (
              <button className="bg-green-600 text-white px-6 py-2 rounded-full">
                Proceed to Payment
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default SeatModal;