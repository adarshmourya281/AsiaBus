import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  ChevronDown,
  Sun,
  Sunset,
  Moon,
  Bus,
} from "lucide-react";
import Booking from "../booking/Booking";

function SearchPage() {
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

  const timeOptions = [
    { label: "06:00 - 12:00", sub: "Morning", icon: <Sun size={16} /> },
    { label: "12:00 - 18:00", sub: "Afternoon", icon: <Sunset size={16} /> },
    { label: "18:00 - 24:00", sub: "Evening", icon: <Sunset size={16} /> },
    { label: "00:00 - 06:00", sub: "Night", icon: <Moon size={16} /> },
  ];

  const busTypes = ["AC", "Non AC", "Seater", "Sleeper", "Volvo"];

  const FilterContent = () => (
    <div className="space-y-6">

      {/* Chips */}
      <div className="flex flex-wrap gap-3">
        {[
          "Primo Bus",
          "Free Cancellation",
          "AC",
          "Sleeper",
          "Seater",
          "Single Seats",
          "Non AC",
          "High Rated",
          "Live Tracking",
          "Volvo",
        ].map((item, i) => (
          <button
            key={i}
            className="px-4 py-2 rounded-full border text-sm bg-gray-50 hover:bg-red-50"
          >
            {item}
          </button>
        ))}
      </div>

      {/* Sections */}
      {["departure", "arrival", "bus"].map((section) => (
        <div key={section}>
          <div
            onClick={() => toggleSection(section)}
            className="flex justify-between cursor-pointer"
          >
            <h3 className="font-medium capitalize">
              {section === "bus"
                ? "Bus Type"
                : `${section} time`}
            </h3>
            <ChevronDown
              className={`transition ${
                openSection === section ? "rotate-180" : ""
              }`}
            />
          </div>

          {openSection === section && (
            <div className="mt-3 space-y-3">
              {(section === "bus" ? busTypes : timeOptions).map(
                (item, i) => (
                  <label
                    key={i}
                    className="flex justify-between p-2 hover:bg-gray-50 rounded"
                  >
                    <div className="flex gap-2 items-center">
                      {section !== "bus" ? item.icon : <Bus size={16} />}
                      <span className="text-sm">
                        {section === "bus" ? item : item.label}
                      </span>
                    </div>
                    <input type="checkbox" className="accent-red-500" />
                  </label>
                )
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );

  return (
    <div className="bg-gradient-to-b from-gray-50 to-white min-h-screen">

      {/* Top */}
      <div className="sticky top-0 z-40 bg-white shadow-md">
        <Booking {...data} onSearch={handleSearch} isSearchPage />
      </div>

      {/* 📱 MOBILE FILTER BAR */}
      <div className="md:hidden sticky top-[64px] z-30 bg-white border-b py-2 overflow-x-auto">
        <div className="flex gap-3 px-2 w-max">

          <button
            onClick={() => setShowFilter(true)}
            className="border px-3 py-1.5 rounded-full text-sm bg-white shadow"
          >
            ⚙️ Filter & Sort
          </button>

          {["Free Cancellation", "AC", "Sleeper", "Seater"].map(
            (item, i) => (
              <button
                key={i}
                className="border px-3 py-1.5 rounded-full text-sm bg-gray-50 whitespace-nowrap"
              >
                {item}
              </button>
            )
          )}
        </div>
      </div>

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
              </div>

              <div className="text-right">
                <p className="text-green-600">4.3 ⭐</p>
                <p className="font-bold text-xl">₹{700 + i * 50}</p>
                <button className="mt-2 bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-lg">
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
    </div>
  );
}

export default SearchPage;
