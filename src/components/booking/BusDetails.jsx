import { Star, Users, Wifi, AlertCircle, MapPin, Clock } from "lucide-react";
import { formatMinutesToTime } from "../../utils/timeUtils";

function BusDetails({ trip, selectedSeats = [] }) {
  if (!trip) {
    return (
      <div className="bg-white rounded-lg p-6 border border-gray-200 text-center">
        <p className="text-gray-500">No bus details available</p>
      </div>
    );
  }

  // ✅ Get the fare for currently selected seats
  const getSelectedFare = () => {
    if (selectedSeats.length === 0) return 0;
    return selectedSeats.reduce((sum, seat) => sum + (seat.fare || 0), 0);
  };

  const selectedFare = getSelectedFare();
  const seatsPerSeat = selectedSeats[0]?.fare || 0;

  // ✅ Get cancellation policy
  const cancellationPolicy = trip.cancellationPolicy || "Non-refundable";

  // ✅ Format departure & arrival times
  const departureTime = formatMinutesToTime(trip.departureTime);
  const arrivalTime = formatMinutesToTime(trip.arrivalTime);

  return (
    <div className="bg-white rounded-lg md:rounded-xl shadow-md md:shadow-lg overflow-hidden sticky lg:top-4 lg:h-fit lg:max-w-sm w-full max-w-full">
      {/* HEADER */}
      <div className="bg-gradient-to-r from-red-50 to-red-100 p-2 sm:p-3 md:p-4 border-b border-red-200">
        <h3 className="font-bold text-sm sm:text-base md:text-lg text-gray-900 truncate">{trip.travels || "Bus"}</h3>
        <p className="text-xs sm:text-sm text-gray-600 mt-0.5 sm:mt-1">{trip.busType || "AC Sleeper"}</p>
      </div>

      {/* CONTENT */}
      <div className="p-2 sm:p-3 md:p-4 space-y-2 sm:space-y-3 md:space-y-4">
        {/* TIME & DURATION */}
        <div className="space-y-1 sm:space-y-2 pb-2 sm:pb-3 md:pb-4 border-b">
          <div className="flex items-center justify-between gap-1 sm:gap-2">
            <div className="text-center flex-1">
              <p className="text-xs text-gray-600 font-semibold">DEPART</p>
              <p className="text-sm sm:text-base md:text-lg font-bold text-gray-900">{departureTime}</p>
            </div>
            <div className="text-center flex-1">
              <Clock size={12} className="text-gray-400 mx-auto mb-0.5 sm:w-3 sm:h-3 md:w-4 md:h-4" />
              <p className="text-xs text-gray-600 font-semibold">{trip.duration || "N/A"}</p>
            </div>
            <div className="text-center flex-1">
              <p className="text-xs text-gray-600 font-semibold">ARRIVE</p>
              <p className="text-sm sm:text-base md:text-lg font-bold text-gray-900">{arrivalTime}</p>
            </div>
          </div>
        </div>

        {/* SEATS AVAILABLE */}
        <div className="flex items-center gap-2 p-1.5 sm:p-2 md:p-3 bg-green-50 border border-green-200 rounded text-xs sm:text-sm">
          <Users size={12} className="text-green-600 sm:w-3 sm:h-3 md:w-4 md:h-4 flex-shrink-0" />
          <span className="font-semibold text-green-800">
            {trip.availableSeats || 0} seats available
          </span>
        </div>

        {/* AMENITIES */}
        <div className="space-y-1 pb-2 sm:pb-3 md:pb-4 border-b text-xs sm:text-sm">
          <div className="flex items-center gap-2 text-gray-700">
            <Wifi size={12} className="text-blue-600 flex-shrink-0 sm:w-3 sm:h-3 md:w-4 md:h-4" />
            <span>WiFi Available</span>
          </div>
          <div className="flex items-center gap-2 text-gray-700">
            <Users size={12} className="text-blue-600 flex-shrink-0 sm:w-3 sm:h-3 md:w-4 md:h-4" />
            <span>Full AC</span>
          </div>
          {trip.rating && (
            <div className="flex items-center gap-2 text-gray-700">
              <Star size={12} className="text-yellow-500 flex-shrink-0 sm:w-3 sm:h-3 md:w-4 md:h-4" fill="currentColor" />
              <span>Rating: {trip.rating}/5</span>
            </div>
          )}
        </div>

        {/* PRICING */}
        {selectedSeats.length > 0 && (
          <div className="space-y-1 sm:space-y-2 pb-2 sm:pb-3 md:pb-4 border-b bg-green-50 p-1.5 sm:p-2 md:p-3 rounded-lg text-xs sm:text-sm">
            {/* Selected Seat Numbers */}
            <div className="space-y-0.5 sm:space-y-1">
              <p className="text-xs text-gray-600 font-semibold">Selected Seats</p>
              <div className="flex flex-wrap gap-1">
                {selectedSeats.map((seat) => (
                  <span
                    key={seat.id}
                    className="px-1.5 py-0.5 sm:px-2 sm:py-1 bg-green-200 text-green-800 rounded text-xs font-semibold"
                  >
                    {seat.name}
                  </span>
                ))}
              </div>
            </div>

            {/* Fare Breakdown */}
            <div className="space-y-0.5 sm:space-y-1 pt-1 sm:pt-2 border-t border-green-200">
              <div className="flex justify-between items-center">
                <p className="text-xs text-gray-600 font-semibold">Per Seat</p>
                <p className="text-xs sm:text-sm font-bold text-green-600">₹{seatsPerSeat.toFixed(2)}</p>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-xs text-gray-600 font-semibold">
                  Seats ({selectedSeats.length})
                </p>
                <p className="text-xs sm:text-sm font-semibold text-green-600">
                  ₹{(seatsPerSeat * selectedSeats.length).toFixed(2)}
                </p>
              </div>
              <div className="flex justify-between items-center pt-0.5 sm:pt-1 border-t border-green-200">
                <p className="text-xs text-gray-600 font-semibold">Total</p>
                <p className="text-base sm:text-lg md:text-xl font-bold text-green-700">₹{selectedFare.toFixed(2)}</p>
              </div>
            </div>
          </div>
        )}

        {/* CANCELLATION POLICY */}
        <div className="space-y-1 sm:space-y-2 pb-2 sm:pb-3 md:pb-4 border-b text-xs sm:text-sm">
          <div className="flex items-start gap-2">
            <AlertCircle size={12} className="text-amber-600 flex-shrink-0 mt-0.5 sm:w-3 sm:h-3 md:w-4 md:h-4" />
            <div>
              <p className="font-semibold text-gray-900 text-xs sm:text-sm">Cancellation Policy</p>
              <p className="text-gray-600 text-xs mt-0.5">{cancellationPolicy}</p>
            </div>
          </div>
        </div>

        {/* INFO */}
        <div className="text-xs text-gray-600 space-y-0.5 sm:space-y-1">
          {trip.id && (
            <p>
              <span className="font-semibold text-gray-900">Trip ID:</span> <span className="truncate text-xs">{trip.id}</span>
            </p>
          )}
          {trip.travels && (
            <p>
              <span className="font-semibold text-gray-900">Operator:</span> {trip.travels}
            </p>
          )}
        </div>
      </div>

      {/* FOOTER STATUS */}
      {selectedSeats.length > 0 && (
        <div className="bg-gradient-to-r from-green-50 to-green-100 p-1.5 sm:p-2 md:p-3 border-t border-green-200">
          <p className="text-xs sm:text-sm text-green-700 font-semibold text-center">
            ✓ {selectedSeats.length} seat{selectedSeats.length !== 1 ? "s" : ""} selected
          </p>
        </div>
      )}
    </div>
  );
}


export default BusDetails;
