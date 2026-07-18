import { formatMinutesToTime } from "../../utils/timeUtils";

function Boarding({
  trip,
  boardingPoint,
  setBoardingPoint,
  droppingPoint,
  setDroppingPoint,
}) {
  // ✅ Handle both array and object formats for boardingTimes
  const boardingList = Array.isArray(trip?.boardingTimes)
    ? trip.boardingTimes
    : trip?.boardingTimes ? [trip.boardingTimes] : [];

  // ✅ Handle both array and object formats for droppingTimes
  const droppingList = Array.isArray(trip?.droppingTimes)
    ? trip.droppingTimes
    : trip?.droppingTimes ? [trip.droppingTimes] : [];

  console.log("🚐 Boarding data:", { boardingList, droppingList });

  // ✅ Transform to consistent format with time conversion
  const boardingPoints = boardingList.map((point, idx) => ({
    id: point.bpId || `boarding-${idx}`,
    time: formatMinutesToTime(parseInt(point.time) || 0),
    bpName: point.bpName || "Unknown",
    location: point.location || "",
    address: point.address || "",
    landmark: point.landmark || "",
    contactNumber: point.contactNumber || "",
    rawTime: point.time,
  }));

  const droppingPoints = droppingList.map((point, idx) => ({
    id: point.bpId || `dropping-${idx}`,
    time: formatMinutesToTime(parseInt(point.time) || 0),
    bpName: point.bpName || "Unknown",
    location: point.location || "",
    address: point.address || "",
    landmark: point.landmark || "",
    contactNumber: point.contactNumber || "",
    rawTime: point.time,
  }));

  // ✅ Fallback if no data
  if (boardingPoints.length === 0 || droppingPoints.length === 0) {
    console.warn("⚠️ Missing boarding/dropping times from trip:", {
      boardingTimes,
      droppingTimes,
      fullTrip: trip
    });
    
    return (
      <div className="pb-24">
        <div className="bg-amber-50 border border-amber-200 p-6 rounded-lg text-center">
          <p className="text-amber-800 font-semibold">
            Boarding and dropping points not available for this trip
          </p>
          <p className="text-sm text-amber-700 mt-2">Please try a different trip</p>
        </div>
      </div>
    );
  }

  const BoardingItem = ({ point, selected, onClick }) => (
    <div
      onClick={onClick}
      className={`p-4 border-b last:border-b-0 cursor-pointer rounded transition hover:bg-gray-50 ${
        selected ? "bg-green-50 border-l-4 border-l-green-500" : ""
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        {/* LEFT: Details */}
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <p className="text-xl font-bold text-gray-900">{point.time}</p>
            <p className="text-sm font-semibold text-gray-700">{point.bpName}</p>
          </div>
          <div className="text-sm text-gray-600 space-y-1">
            {point.location && (
              <p>
                <span className="font-medium">Location:</span> {point.location}
              </p>
            )}
            {point.landmark && (
              <p>
                <span className="font-medium">Landmark:</span> {point.landmark}
              </p>
            )}
            {point.address && (
              <p>
                <span className="font-medium">Address:</span> {point.address}
              </p>
            )}
            {point.contactNumber && (
              <p>
                <span className="font-medium">Contact:</span> {point.contactNumber}
              </p>
            )}
          </div>
        </div>

        {/* RIGHT: Radio Button */}
        <div className="flex-shrink-0">
          <div
            className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition ${
              selected
                ? "border-green-500 bg-green-500"
                : "border-gray-300 hover:border-green-400"
            }`}
          >
            {selected && <span className="text-white text-sm">✓</span>}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="pb-24">
      {/* RESPONSIVE GRID: Desktop side-by-side, Mobile stacked */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* BOARDING POINTS - LEFT */}
        <div>
          <h3 className="font-bold text-lg mb-4 text-gray-900">
            🚌 Boarding Points
          </h3>
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
            {boardingPoints.length > 0 ? (
              boardingPoints.map((point) => (
                <BoardingItem
                  key={point.id}
                  point={point}
                  selected={boardingPoint?.id === point.id}
                  onClick={() => setBoardingPoint(point)}
                />
              ))
            ) : (
              <div className="p-6 text-center text-gray-500">
                No boarding points available
              </div>
            )}
          </div>

          {/* SELECTION STATUS */}
          {boardingPoint && (
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm font-semibold text-green-800">
                ✓ Selected: {boardingPoint.bpName} at {boardingPoint.time}
              </p>
            </div>
          )}
        </div>

        {/* DROPPING POINTS - RIGHT */}
        <div>
          <h3 className="font-bold text-lg mb-4 text-gray-900">
            🏁 Dropping Points
          </h3>
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
            {droppingPoints.length > 0 ? (
              droppingPoints.map((point) => (
                <BoardingItem
                  key={point.id}
                  point={point}
                  selected={droppingPoint?.id === point.id}
                  onClick={() => setDroppingPoint(point)}
                />
              ))
            ) : (
              <div className="p-6 text-center text-gray-500">
                No dropping points available
              </div>
            )}
          </div>

          {/* SELECTION STATUS */}
          {droppingPoint && (
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm font-semibold text-green-800">
                ✓ Selected: {droppingPoint.bpName} at {droppingPoint.time}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* SUMMARY SECTION */}
      {(boardingPoint || droppingPoint) && (
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm font-semibold text-blue-900 mb-2">Journey Summary:</p>
          {boardingPoint && (
            <p className="text-sm text-blue-800">
              📍 Pickup: <span className="font-bold">{boardingPoint.bpName}</span> at{" "}
              <span className="font-bold">{boardingPoint.time}</span>
            </p>
          )}
          {droppingPoint && (
            <p className="text-sm text-blue-800">
              📍 Dropoff: <span className="font-bold">{droppingPoint.bpName}</span> at{" "}
              <span className="font-bold">{droppingPoint.time}</span>
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export default Boarding;