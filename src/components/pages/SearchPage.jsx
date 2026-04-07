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

  return (
    <div className="bg-gradient-to-b from-gray-50 to-white min-h-screen">

      {/* 🔍 Top */}
      <div className="sticky top-0 z-40 bg-white shadow-md">
        <Booking
          initialFrom={data.from}
          initialTo={data.to}
          initialDate={data.date}
          onSearch={handleSearch}
          isSearchPage={true}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 flex gap-6">

        {/* 🧩 FILTER */}
        <div className="hidden md:block w-1/4">
          <div className="bg-white rounded-xl shadow-md p-5 space-y-6">

            <h2 className="text-lg font-semibold">Filter buses</h2>

{/* 🔥 TOP CHIP FILTERS (YOUR DEFAULT ONE) */}
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
        className="px-4 py-2 rounded-full border border-gray-300 text-sm bg-gray-50 hover:bg-red-50 hover:border-red-400 transition"
      >
        {item}
      </button>
    ))}
  </div>

            {/* 🔽 DEPARTURE */}
            <div>
              <div
                onClick={() => toggleSection("departure")}
                className="flex justify-between items-center cursor-pointer"
              >
                <h3 className="font-medium">
                  Departure time from source
                </h3>
                <ChevronDown
                  className={`transition ${
                    openSection === "departure" ? "rotate-180" : ""
                  }`}
                />
              </div>

              {openSection === "departure" && (
                <div className="mt-3 space-y-3">
                  {timeOptions.map((item, i) => (
                    <label
                      key={i}
                      className="flex justify-between items-center p-2 rounded-lg hover:bg-gray-50 cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        {item.icon}
                        <div>
                          <p className="text-sm font-medium">
                            {item.label}
                          </p>
                          <p className="text-xs text-gray-500">
                            {item.sub}
                          </p>
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        className="accent-red-500"
                      />
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* 🔽 ARRIVAL */}
            <div>
              <div
                onClick={() => toggleSection("arrival")}
                className="flex justify-between items-center cursor-pointer"
              >
                <h3 className="font-medium">
                  Arrival time at destination
                </h3>
                <ChevronDown
                  className={`transition ${
                    openSection === "arrival" ? "rotate-180" : ""
                  }`}
                />
              </div>

              {openSection === "arrival" && (
                <div className="mt-3 space-y-3">
                  {timeOptions.map((item, i) => (
                    <label
                      key={i}
                      className="flex justify-between items-center p-2 rounded-lg hover:bg-gray-50 cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        {item.icon}
                        <div>
                          <p className="text-sm font-medium">
                            {item.label}
                          </p>
                          <p className="text-xs text-gray-500">
                            {item.sub}
                          </p>
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        className="accent-red-500"
                      />
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* 🔽 BUS TYPE */}
            <div>
              <div
                onClick={() => toggleSection("bus")}
                className="flex justify-between items-center cursor-pointer"
              >
                <h3 className="font-medium">Bus Type</h3>
                <ChevronDown
                  className={`transition ${
                    openSection === "bus" ? "rotate-180" : ""
                  }`}
                />
              </div>

              {openSection === "bus" && (
                <div className="mt-3 space-y-3">
                  {busTypes.map((item, i) => (
                    <label
                      key={i}
                      className="flex justify-between items-center p-2 rounded-lg hover:bg-gray-50 cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <Bus size={16} />
                        <span className="text-sm">{item}</span>
                      </div>
                      <input
                        type="checkbox"
                        className="accent-red-500"
                      />
                    </label>
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>

        {/* 🚌 BUS LIST */}
        <div className="flex-1 flex flex-col gap-5">

          {[1, 2, 3, 4].map((_, i) => (
            <div
              key={i}
              className="bg-white p-5 rounded-xl shadow-md hover:shadow-xl hover:-translate-y-1 transition flex justify-between items-center border-l-4 border-red-500"
            >
              <div>
                <h2 className="font-semibold text-lg">
                  AsiaBus Travels
                </h2>
                <p className="text-sm text-gray-500">
                  AC Sleeper
                </p>

                <div className="flex gap-4 mt-2 text-sm">
                  <span className="font-medium">20:00</span>
                  <span>→</span>
                  <span className="font-medium">07:00</span>
                </div>

                <p className="text-xs text-gray-400">
                  11h duration
                </p>
              </div>

              <div className="text-right">
                <span className="bg-green-100 text-green-600 px-2 py-1 rounded text-sm">
                  4.3 ⭐
                </span>

                <p className="font-bold text-xl mt-1">
                  ₹{700 + i * 50}
                </p>

                <button className="mt-2 bg-gradient-to-r from-red-500 to-red-600 text-white px-5 py-2 rounded-lg shadow hover:scale-105 transition">
                  View seats
                </button>
              </div>
            </div>
          ))}

        </div>
      </div>
    </div>
  );
}

export default SearchPage;