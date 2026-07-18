import { AlertCircle, Check } from "lucide-react";

function SeatSummary({ selectedSeats, trip, availableSeatsCount }) {
  const totalPrice = selectedSeats.reduce((sum, seat) => sum + (seat.fare || 0), 0);
  const perSeatPrice = selectedSeats.length > 0 ? selectedSeats[0].fare || 0 : 0;

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 sticky top-4 h-fit">
      {/* HEADER */}
      <h3 className="text-lg font-bold text-gray-900 mb-4">Booking Summary</h3>

      {/* TRIP INFO */}
      <div className="space-y-2 pb-4 border-b">
        <p className="text-sm text-gray-600">
          <span className="font-semibold">{trip?.travels}</span> • {trip?.busType}
        </p>
        <p className="text-xs text-gray-500">Trip ID: {trip?.id}</p>
      </div>

      {/* AVAILABLE SEATS INFO */}
      <div className="flex items-center gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg my-4">
        <AlertCircle size={16} className="text-blue-600" />
        <span className="text-sm text-blue-800">
          <span className="font-semibold">{availableSeatsCount}</span> seats available
        </span>
      </div>

      {/* SELECTED SEATS */}
      {selectedSeats.length > 0 ? (
        <>
          <div className="space-y-2 pb-4 border-b">
            <p className="font-semibold text-gray-900 text-sm mb-2">Selected Seats</p>
            <div className="flex flex-wrap gap-2">
              {selectedSeats.map((seat) => (
                <span
                  key={seat.id}
                  className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold flex items-center gap-1"
                >
                  <Check size={12} />
                  {seat.name}
                </span>
              ))}
            </div>
          </div>

          {/* PRICING */}
          <div className="space-y-3 pb-4 border-b">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">Per Seat Fare</span>
              <span className="font-semibold text-gray-900">₹{perSeatPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">Number of Seats</span>
              <span className="font-semibold text-gray-900">{selectedSeats.length}</span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t">
              <span className="font-bold text-gray-900">Total Fare</span>
              <span className="text-2xl font-bold text-green-600">₹{totalPrice.toFixed(2)}</span>
            </div>
          </div>

          {/* FOOTER */}
          <div className="bg-green-50 p-3 rounded-lg text-center">
            <p className="text-xs text-green-700 font-semibold">
              ✓ {selectedSeats.length} seat{selectedSeats.length !== 1 ? "s" : ""} selected and ready
            </p>
          </div>
        </>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-500 text-sm">Select seats to see summary</p>
        </div>
      )}
    </div>
  );
}

export default SeatSummary;
