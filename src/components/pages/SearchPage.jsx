import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  ChevronDown,
  Sun,
  Sunset,
  Moon,
  Bus,
  Snowflake,
  Armchair,
  ShieldCheck,
  Star,
  MapPin,
} from "lucide-react";
import Booking from "../booking/Booking";
import SeatModal from "../booking/SeatModal";
import { getAvailableTrips } from "../../services/tripService";
import { formatMinutesToTime, getTimeSlot, formatFare } from "../../utils/timeUtils";

function SearchPage() {
  const [showSeatModal, setShowSeatModal] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const data = location.state || {};

  // ✅ FILTER STATES
  const [selectedDepartureSlots, setSelectedDepartureSlots] = useState([]);
  const [selectedArrivalSlots, setSelectedArrivalSlots] = useState([]);
  const [acOnly, setAcOnly] = useState(false);
  const [nonAcOnly, setNonAcOnly] = useState(false);
  const [sleeperOnly, setSleeperOnly] = useState(false);
  const [seaterOnly, setSeaterOnly] = useState(false);
  const [liveTrackingOnly, setLiveTrackingOnly] = useState(false);
  const [openSection, setOpenSection] = useState("departure");
  const [showFilter, setShowFilter] = useState(false);

  const handleSearch = (newData) => {
    // ✅ Reset filters when performing a new search
    handleResetFilters();
    navigate("/search", { state: newData });
  };

  useEffect(() => {
    console.log("📍 location.state:", data);
    console.log("🔍 Checking if search parameters are complete:", {
      sourceId: data?.sourceId,
      destinationId: data?.destinationId,
      date: data?.date,
    });

    if (data?.sourceId && data?.destinationId && data?.date) {
      console.log("✅ All parameters present, fetching trips...");
      fetchTrips();
    } else {
      console.warn("⚠️ Missing parameters:", {
        sourceId: data?.sourceId,
        destinationId: data?.destinationId,
        date: data?.date,
      });
      setTrips([]);
      setError(null);
    }
  }, [data?.sourceId, data?.destinationId, data?.date]);

  const toggleSection = (section) => {
    setOpenSection(openSection === section ? "" : section);
  };

  const fetchTrips = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log("🔄 Fetching trips with params:", {
        source: data.sourceId,
        destination: data.destinationId,
        doj: data.date,
      });

      const response = await getAvailableTrips(
        data.sourceId,
        data.destinationId,
        data.date
      );

      console.log("📡 API Response (full):", response);
      console.log("📦 response.data:", response.data);
      console.log("🚌 availableTrips:", response.data?.availableTrips);

      const availableTrips = response.data?.availableTrips || [];
      console.log(`✅ Setting ${availableTrips.length} trips to state`);
      setTrips(availableTrips);

      if (availableTrips.length === 0) {
        console.warn("⚠️ No buses available for this route");
      }
    } catch (error) {
      console.error("❌ Error fetching trips:", error);
      setError(error.message || "Failed to fetch buses");
      setTrips([]);
    } finally {
      setLoading(false);
    }
  };

  // ✅ FILTER LOGIC
  const filteredTrips = trips.filter((trip) => {
    // Filter by departure time slot
    if (selectedDepartureSlots.length > 0) {
      const departureSlot = getTimeSlot(trip.departureTime);
      if (!departureSlot || !selectedDepartureSlots.includes(departureSlot)) {
        return false;
      }
    }

    // Filter by arrival time slot
    if (selectedArrivalSlots.length > 0) {
      const arrivalSlot = getTimeSlot(trip.arrivalTime);
      if (!arrivalSlot || !selectedArrivalSlots.includes(arrivalSlot)) {
        return false;
      }
    }

    // Filter by bus type
    if (acOnly && trip.AC !== "true") return false;
    if (nonAcOnly && trip.nonAC !== "true") return false;
    if (sleeperOnly && trip.sleeper !== "true") return false;
    if (seaterOnly && trip.seater !== "true") return false;
    if (liveTrackingOnly && trip.liveTrackingAvailable !== "true") return false;

    return true;
  });

  // ✅ RESET ALL FILTERS
  const handleResetFilters = () => {
    setSelectedDepartureSlots([]);
    setSelectedArrivalSlots([]);
    setAcOnly(false);
    setNonAcOnly(false);
    setSleeperOnly(false);
    setSeaterOnly(false);
    setLiveTrackingOnly(false);
  };

  const timeOptions = [
    { label: "06:00 - 12:00", sub: "Morning", icon: <Sun size={18} /> },
    { label: "12:00 - 18:00", sub: "Afternoon", icon: <Sunset size={18} /> },
    { label: "18:00 - 24:00", sub: "Evening", icon: <Sunset size={18} /> },
    { label: "00:00 - 06:00", sub: "Night", icon: <Moon size={18} /> },
  ];

  // 🔥 Default filter chips with icons
  const chipFilters = [
    { label: "Free Cancellation", icon: <ShieldCheck size={16} /> },
    { label: "AC", icon: <Snowflake size={16} /> },
    { label: "Sleeper", icon: <Bus size={16} /> },
    { label: "Seater", icon: <Armchair size={16} /> },
    { label: "High Rated", icon: <Star size={16} /> },
    { label: "Live Tracking", icon: <MapPin size={16} /> },
  ];

  const FilterContent = () => (
    <div className="space-y-6">
      {/* 🔥 FILTER CHIPS */}
      <div className="flex flex-wrap gap-3">
        {chipFilters.map((item, i) => {
          let isSelected = false;
          let onClickHandler = () => {};

          if (item.label === "AC") {
            isSelected = acOnly;
            onClickHandler = () => setAcOnly(!acOnly);
          } else if (item.label === "Sleeper") {
            isSelected = sleeperOnly;
            onClickHandler = () => setSleeperOnly(!sleeperOnly);
          } else if (item.label === "Seater") {
            isSelected = seaterOnly;
            onClickHandler = () => setSeaterOnly(!seaterOnly);
          } else if (item.label === "Live Tracking") {
            isSelected = liveTrackingOnly;
            onClickHandler = () => setLiveTrackingOnly(!liveTrackingOnly);
          }

          return (
            <button
              key={i}
              onClick={onClickHandler}
              className={`flex items-center gap-2 px-4 py-2 rounded-full border text-sm transition ${
                isSelected
                  ? "bg-red-500 text-white border-red-500"
                  : "bg-gray-50 text-gray-900 border-gray-300 hover:bg-red-50"
              }`}
            >
              {item.icon}
              {item.label}
            </button>
          );
        })}
      </div>

      {/* 🔽 SECTIONS */}
      {["departure", "arrival", "bus"].map((section) => (
        <div key={section}>
          {/* Title */}
          <div
            onClick={() => toggleSection(section)}
            className="flex justify-between items-center cursor-pointer"
          >
            <h3 className="font-semibold text-gray-800">
              {section === "bus"
                ? "Bus Type"
                : section === "departure"
                  ? "Departure time from source"
                  : "Arrival time at destination"}
            </h3>

            <ChevronDown
              className={`transition ${openSection === section ? "rotate-180" : ""
                }`}
            />
          </div>

          {/* Content */}
          {openSection === section && (
            <div className="mt-4 space-y-3">
              {section === "departure" &&
                timeOptions.map((item, i) => {
                  const slotKey =
                    item.label === "06:00 - 12:00"
                      ? "morning"
                      : item.label === "12:00 - 18:00"
                        ? "afternoon"
                        : item.label === "18:00 - 24:00"
                          ? "evening"
                          : "night";
                  const isSelected = selectedDepartureSlots.includes(slotKey);

                  return (
                    <label
                      key={i}
                      className="flex justify-between items-center p-3 rounded-lg hover:bg-gray-50 cursor-pointer border-b"
                    >
                      <div className="flex items-center gap-3">
                        {item.icon}
                        <div>
                          <p className="text-sm font-medium">{item.label}</p>
                          <p className="text-xs text-gray-500">{item.sub}</p>
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => {
                          setSelectedDepartureSlots(
                            isSelected
                              ? selectedDepartureSlots.filter(s => s !== slotKey)
                              : [...selectedDepartureSlots, slotKey]
                          );
                        }}
                        className="accent-red-500 w-4 h-4"
                      />
                    </label>
                  );
                })}

              {section === "arrival" &&
                timeOptions.map((item, i) => {
                  const slotKey =
                    item.label === "06:00 - 12:00"
                      ? "morning"
                      : item.label === "12:00 - 18:00"
                        ? "afternoon"
                        : item.label === "18:00 - 24:00"
                          ? "evening"
                          : "night";
                  const isSelected = selectedArrivalSlots.includes(slotKey);

                  return (
                    <label
                      key={i}
                      className="flex justify-between items-center p-3 rounded-lg hover:bg-gray-50 cursor-pointer border-b"
                    >
                      <div className="flex items-center gap-3">
                        {item.icon}
                        <div>
                          <p className="text-sm font-medium">{item.label}</p>
                          <p className="text-xs text-gray-500">{item.sub}</p>
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => {
                          setSelectedArrivalSlots(
                            isSelected
                              ? selectedArrivalSlots.filter(s => s !== slotKey)
                              : [...selectedArrivalSlots, slotKey]
                          );
                        }}
                        className="accent-red-500 w-4 h-4"
                      />
                    </label>
                  );
                })}

              {section === "bus" &&
                [
                  { label: "AC", state: acOnly, setState: setAcOnly },
                  { label: "Non AC", state: nonAcOnly, setState: setNonAcOnly },
                  { label: "Sleeper", state: sleeperOnly, setState: setSleeperOnly },
                  { label: "Seater", state: seaterOnly, setState: setSeaterOnly },
                ].map((item, i) => (
                  <label
                    key={i}
                    className="flex justify-between items-center p-3 rounded-lg hover:bg-gray-50 cursor-pointer border-b"
                  >
                    <div className="flex items-center gap-3">
                      <Bus size={16} />
                      <p className="text-sm font-medium">{item.label}</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={item.state}
                      onChange={() => item.setState(!item.state)}
                      className="accent-red-500 w-4 h-4"
                    />
                  </label>
                ))}
            </div>
          )}
        </div>
      ))}

      {/* RESET BUTTON */}
      <button
        onClick={handleResetFilters}
        className="w-full mt-6 py-2 px-4 bg-gray-200 text-gray-800 rounded-lg font-semibold hover:bg-gray-300 transition"
      >
        Reset Filters
      </button>
    </div>
  );

  return (
    <div className="bg-gradient-to-b from-gray-50 to-white min-h-screen w-full max-w-full overflow-x-hidden">
      {/* 🔍 Top - Sticky Booking Section */}
      <div className="sticky top-0 z-40 bg-white shadow-md w-full max-w-full overflow-x-hidden">
        <Booking
          initialFrom={data.from}
          initialTo={data.to}
          initialDate={data.date}
          onSearch={handleSearch}
          isSearchPage
        />
      </div>

      {/* Selected Search Info */}
      <div className="w-full max-w-full overflow-x-hidden px-2 sm:px-3 md:px-6 py-2 sm:py-3 md:py-4">
        <div className="flex flex-wrap gap-2 sm:gap-3 md:gap-4 items-center justify-center text-xs sm:text-sm md:text-base font-medium text-gray-700">
          <span className="whitespace-nowrap">From: <span className="text-red-600 font-semibold">{data.from || "-"}</span></span>
          <span className="whitespace-nowrap">To: <span className="text-red-600 font-semibold">{data.to || "-"}</span></span>
          <span className="whitespace-nowrap">Date: <span className="text-red-600 font-semibold">{data.date || "-"}</span></span>
        </div>
      </div>

      {/* 📱 MOBILE FILTER BAR */}
      <div className="md:hidden sticky top-16 sm:top-20 z-30 bg-white border-b py-2 overflow-x-auto w-full max-w-full">
        <div className="flex gap-2 sm:gap-3 px-2 sm:px-4 w-max min-w-full">
          <button
            onClick={() => setShowFilter(true)}
            className="flex items-center gap-1 border px-2.5 sm:px-3 py-1.5 rounded-full text-xs sm:text-sm bg-white shadow flex-shrink-0 hover:bg-gray-50 transition"
          >
            ⚙️ Filter
          </button>

          {chipFilters.map((item, i) => {
            let isSelected = false;
            let onClickHandler = () => {};

            if (item.label === "AC") {
              isSelected = acOnly;
              onClickHandler = () => setAcOnly(!acOnly);
            } else if (item.label === "Sleeper") {
              isSelected = sleeperOnly;
              onClickHandler = () => setSleeperOnly(!sleeperOnly);
            } else if (item.label === "Seater") {
              isSelected = seaterOnly;
              onClickHandler = () => setSeaterOnly(!seaterOnly);
            } else if (item.label === "Live Tracking") {
              isSelected = liveTrackingOnly;
              onClickHandler = () => setLiveTrackingOnly(!liveTrackingOnly);
            }

            return (
              <button
                key={i}
                onClick={onClickHandler}
                className={`flex items-center gap-1 border px-2.5 sm:px-3 py-1.5 rounded-full text-xs sm:text-sm whitespace-nowrap transition flex-shrink-0 ${
                  isSelected
                    ? "bg-red-500 text-white border-red-500 shadow-md"
                    : "bg-gray-50 text-gray-900 border-gray-300 hover:bg-red-50"
                }`}
              >
                {item.icon}
                <span className="hidden xs:inline">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 📦 Main Layout */}
      <div className="w-full max-w-full overflow-x-hidden mx-auto px-2 sm:px-4 md:px-6 lg:px-8 py-3 sm:py-4 md:py-6 flex flex-col md:flex-row md:items-start gap-4 md:gap-6 lg:gap-8">
        {/* Desktop Filter - STICKY */}
        <div className="hidden md:block w-full md:w-64 lg:w-72 flex-shrink-0">
          <div className="bg-white rounded-lg md:rounded-xl shadow-md p-3 sm:p-4 md:p-5 sticky top-24 md:top-28 self-start max-h-[calc(100vh-7rem)] overflow-y-auto">
            <h2 className="text-base md:text-lg font-semibold mb-4">Filter buses</h2>
            <FilterContent />
          </div>
        </div>

        {/* Bus List */}
        <div className="w-full flex-1 flex flex-col gap-3 sm:gap-4 md:gap-5">
          {loading && (
            <div className="bg-white rounded-lg md:rounded-xl p-6 sm:p-10 text-center shadow">
              <p className="text-gray-600 animate-pulse text-sm sm:text-base">🔄 Loading buses...</p>
            </div>
          )}

          {error && (
            <div className="bg-red-50 rounded-lg md:rounded-xl p-6 sm:p-10 text-center shadow border border-red-200">
              <p className="text-red-600 font-semibold text-sm sm:text-base">❌ Error: {error}</p>
              <p className="text-xs sm:text-sm text-red-500 mt-2">Please try again</p>
            </div>
          )}

          {!loading && !error && trips.length === 0 && (
            <div className="bg-white rounded-lg md:rounded-xl p-6 sm:p-10 text-center shadow">
              <p className="text-gray-600 text-sm sm:text-base">No buses found for this route</p>
              <p className="text-xs sm:text-sm text-gray-500 mt-2">Try searching with different dates or cities</p>
            </div>
          )}

          {!loading && !error && trips.length > 0 && (
            <div>
              <p className="text-xs sm:text-sm text-gray-600 mb-3 md:mb-4">
                Found <span className="font-bold text-red-600">{filteredTrips.length}</span> buses
              </p>
              <div className="flex flex-col gap-3 sm:gap-4 md:gap-5">
                {filteredTrips.map((trip) => (
                  <div
                    key={trip.id}
                    className="bg-white rounded-lg sm:rounded-xl shadow-md hover:shadow-lg transition border-l-4 border-red-500 p-3 sm:p-4 md:p-5 lg:p-6 w-full max-w-full"
                  >
                    {/* Header: Travels Name and Bus Type */}
                    <div className="mb-2 sm:mb-3 md:mb-4">
                      <h2 className="font-bold text-sm sm:text-base md:text-lg lg:text-xl text-gray-900 truncate">
                        {trip.travels}
                      </h2>
                      <p className="text-xs text-gray-600 mt-1">
                        {trip.busType || "Bus"}
                      </p>
                    </div>

                    {/* Time Section: Departure → Arrival - Responsive Layout */}
                    <div className="mb-3 sm:mb-4 pb-3 sm:pb-4 border-b flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-2">
                      <div className="flex items-center justify-start gap-2 sm:gap-4 md:gap-6 flex-wrap sm:flex-nowrap w-full sm:w-auto">
                        {/* Departure Time */}
                        <div className="text-center min-w-max">
                          <p className="text-base sm:text-xl md:text-2xl font-bold text-gray-900">
                            {formatMinutesToTime(trip.departureTime)}
                          </p>
                          <p className="text-xs text-gray-500 mt-0.5">Departure</p>
                        </div>

                        {/* Arrow - Hidden on mobile */}
                        <div className="hidden sm:flex items-center text-gray-400">
                          <div className="text-lg md:text-2xl">─→</div>
                        </div>

                        {/* Arrival Time */}
                        <div className="text-center min-w-max">
                          <p className="text-base sm:text-xl md:text-2xl font-bold text-gray-900">
                            {formatMinutesToTime(trip.arrivalTime)}
                          </p>
                          <p className="text-xs text-gray-500 mt-0.5">Arrival</p>
                        </div>
                      </div>

                      {/* Right Side: Duration and Price */}
                      <div className="text-right w-full sm:w-auto flex-shrink-0">
                        <p className="text-xs sm:text-sm md:text-base font-semibold text-blue-600">
                          ⏱️ {trip.duration || "N/A"}
                        </p>
                        <p className="text-lg sm:text-2xl md:text-3xl lg:text-4xl font-bold text-green-600 mt-1">
                          {formatFare(trip.fares)}
                        </p>
                        <p className="text-xs text-gray-600 mt-0.5">Onwards</p>
                      </div>
                    </div>

                    {/* Middle Row: Seats and Rating */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-3 py-2 sm:py-3 border-b text-xs sm:text-sm">
                      <p className="text-gray-700">
                        💺 <span className="font-semibold">{trip.availableSeats}</span> seats
                      </p>
                      <p className="text-gray-700">
                        ⭐ <span className="font-semibold">{trip.rating || "4.0"}/5</span>
                      </p>
                    </div>

                    {/* View Seats Button */}
                    <div className="mt-2 sm:mt-3 md:mt-4 flex justify-center">
                      <button
                        onClick={() => {
                          setSelectedTrip(trip);
                          setShowSeatModal(true);
                        }}
                        className="w-full sm:w-auto bg-gradient-to-r from-red-500 to-red-600 text-white px-6 sm:px-10 md:px-12 py-2 sm:py-2.5 md:py-3 rounded-full font-semibold text-xs sm:text-sm md:text-base hover:shadow-lg transition active:scale-95"
                      >
                        View seats
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 📱 Bottom Sheet Filter Modal */}
      {showFilter && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-end overflow-hidden max-w-full">
          <div className="w-full bg-white rounded-t-2xl p-3 sm:p-4 md:p-5 max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between mb-4 items-center">
              <h2 className="font-semibold text-base sm:text-lg">Filters</h2>
              <button onClick={() => setShowFilter(false)} className="text-lg font-bold hover:text-red-500 transition">✕</button>
            </div>

            <FilterContent />

            <div className="flex gap-3 mt-6">
              <button onClick={handleResetFilters} className="flex-1 border py-2 px-3 rounded-lg text-xs sm:text-sm font-medium hover:bg-gray-50 transition">
                Reset
              </button>
              <button onClick={() => setShowFilter(false)} className="flex-1 bg-red-500 text-white py-2 px-3 rounded-lg text-xs sm:text-sm font-medium hover:bg-red-600 transition">
                Apply
              </button>
            </div>
          </div>
        </div>
      )}

      {showSeatModal && selectedTrip && (
        <SeatModal 
          trip={selectedTrip}
          onClose={() => {
            setShowSeatModal(false);
            setSelectedTrip(null);
          }} 
        />
      )}
    </div>
  );
}

export default SearchPage;
