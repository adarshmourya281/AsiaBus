import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
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
function SearchPage() {
  const [showSeatModal, setShowSeatModal] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const data = location.state || {};

  const handleSearch = (newData) => {
    navigate("/search", { state: newData });
  };

  const [openSection, setOpenSection] = useState("departure");
  const [showFilter, setShowFilter] = useState(false);

  const toggleSection = (section) => {
    setOpenSection(openSection === section ? "" : section);
  };

  // 🔥 Time options with labels + icons
  const timeOptions = [
    { label: "06:00 - 12:00", sub: "Morning", icon: <Sun size={18} /> },
    { label: "12:00 - 18:00", sub: "Afternoon", icon: <Sunset size={18} /> },
    { label: "18:00 - 24:00", sub: "Evening", icon: <Sunset size={18} /> },
    { label: "00:00 - 06:00", sub: "Night", icon: <Moon size={18} /> },
  ];

  const busTypes = ["AC", "Non AC", "Seater", "Sleeper", "Volvo"];

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
        {chipFilters.map((item, i) => (
          <button
            key={i}
            className="flex items-center gap-2 px-4 py-2 rounded-full border text-sm bg-gray-50 hover:bg-red-50 transition"
          >
            {item.icon}
            {item.label}
          </button>
        ))}
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
              className={`transition ${
                openSection === section ? "rotate-180" : ""
              }`}
            />
          </div>

          {/* Content */}
          {openSection === section && (
            <div className="mt-4 space-y-3">

              {(section === "bus" ? busTypes : timeOptions).map((item, i) => (
                <label
                  key={i}
                  className="flex justify-between items-center p-3 rounded-lg hover:bg-gray-50 cursor-pointer border-b"
                >
                  
                  <div className="flex items-center gap-3">
                    
                    {/* Icon */}
                    {section !== "bus" ? (
                      item.icon
                    ) : (
                      <Bus size={16} />
                    )}

                    {/* Text */}
                    <div>
                      <p className="text-sm font-medium">
                        {section === "bus" ? item : item.label}
                      </p>

                      {/* Sub text */}
                      {section !== "bus" && (
                        <p className="text-xs text-gray-500">
                          {item.sub}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Checkbox */}
                  <input
                    type="checkbox"
                    className="accent-red-500 w-4 h-4"
                  />
                </label>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );

  return (
    <div className="bg-gradient-to-b from-gray-50 to-white min-h-screen">

      {/* 🔍 Top */}
      <div className="sticky top-0 z-40 bg-white shadow-md">
        <Booking {...data} onSearch={handleSearch} isSearchPage />
      </div>

      {/* 📱 MOBILE FILTER BAR */}
      <div className="md:hidden sticky top-[64px] z-30 bg-white border-b py-2 overflow-x-auto">
        <div className="flex gap-3 px-2 w-max">

          <button
            onClick={() => setShowFilter(true)}
            className="flex items-center gap-1 border px-3 py-1.5 rounded-full text-sm bg-white shadow"
          >
            ⚙️ Filter & Sort
          </button>

          {chipFilters.map((item, i) => (
            <button
              key={i}
              className="flex items-center gap-1 border px-3 py-1.5 rounded-full text-sm bg-gray-50 whitespace-nowrap"
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* 📦 Layout */}
      <div className="max-w-7xl mx-auto px-4 py-6 flex gap-6">

        {/* Desktop Filter */}
        <div className="hidden md:block w-1/4">
          <div className="bg-white rounded-xl shadow-md p-5">
            <h2 className="text-lg font-semibold mb-4">Filter buses</h2>
            <FilterContent />
          </div>
        </div>

        {/* Bus List */}
        <div className="flex-1 flex flex-col gap-5">
          {[1, 2, 3, 4].map((_, i) => (
            <div
              key={i}
              className="bg-white p-5 rounded-xl shadow-md hover:shadow-xl transition border-l-4 border-red-500 flex justify-between"
            >
              <div>
                <h2 className="font-semibold text-lg">AsiaBus Travels</h2>
                <p className="text-sm text-gray-500">AC Sleeper</p>

                <div className="flex gap-4 mt-2 text-sm">
                  <span>20:00</span> → <span>07:00</span>
                </div>

                <p className="text-xs text-gray-400">11h duration</p>
              </div>

              <div className="text-right">
                <p className="text-green-600">4.3 ⭐</p>
                <p className="font-bold text-xl">₹{700 + i * 50}</p>

                <button
  onClick={() => setShowSeatModal(true)}   // ✅ HERE
  className="mt-2 bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-lg"
>
  View seats
</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 📱 Bottom Sheet */}
      {showFilter && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-end">
          <div className="w-full bg-white rounded-t-2xl p-5 max-h-[80vh] overflow-y-auto">

            <div className="flex justify-between mb-4">
              <h2 className="font-semibold">Filters</h2>
              <button onClick={() => setShowFilter(false)}>✕</button>
            </div>

            <FilterContent />

            <div className="flex gap-3 mt-6">
              <button className="flex-1 border py-2 rounded-lg">
                Reset
              </button>
              <button className="flex-1 bg-red-500 text-white py-2 rounded-lg">
                Apply
              </button>
            </div>

          </div>
        </div>
      )}
      {showSeatModal && (
      <SeatModal onClose={() => setShowSeatModal(false)} />
    )}

    </div>
  );
}

export default SearchPage;
