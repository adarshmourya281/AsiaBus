import { useState, useRef } from "react";
import bgImage from "../../assets/bg1.png";

import fromIcon from "../../assets/bus.png";
import toIcon from "../../assets/bus.png";
import dateIcon from "../../assets/date.png";

function Booking({ initialFrom, initialTo, initialDate, onSearch, isSearchPage }) {
  
  const [from, setFrom] = useState(initialFrom || "Pune");
  const [to, setTo] = useState(initialTo || "Ameerpet, Hyderabad");
  const [date, setDate] = useState(initialDate || "2026-04-03");

  const dateRef = useRef(null);

  // ✅ SEARCH HANDLER
  const handleSearch = () => {
    if (onSearch) {
      onSearch({ from, to, date });
    }
  };

  // 🔁 SWAP
  const handleSwap = () => {
    setFrom(to);
    setTo(from);
  };

  // 📅 TODAY
  const setToday = () => {
    const today = new Date().toISOString().split("T")[0];
    setDate(today);
  };

  // 📅 TOMORROW
  const setTomorrow = () => {
    const t = new Date();
    t.setDate(t.getDate() + 1);
    setDate(t.toISOString().split("T")[0]);
  };

  return (
    <div className={`relative w-full flex justify-center px-3 
      ${isSearchPage ? "py-6" : "pt-32 pb-24 md:pt-40 md:pb-32"}
    `}>

      {/* ✅ Background ONLY for Home */}
      {!isSearchPage && (
        <>
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${bgImage})` }}
          />
          <div className="absolute inset-0 bg-black/40"></div>
        </>
      )}

      {/* ✅ CONTENT */}
      <div className="relative w-full max-w-7xl">

        {/* CARD */}
        <div className={`rounded-2xl shadow-xl px-4 md:px-6 py-4 
          ${isSearchPage ? "bg-white" : "bg-white/90 backdrop-blur-md"}
        `}>

          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-0">

            {/* FROM */}
            <div className="flex items-center gap-3 w-full md:w-1/3 px-2">
              <img src={fromIcon} alt="from" className="w-6 h-6" />
              <div className="w-full">
                <p className="text-xs text-gray-400">From</p>
                <input
                  value={from}
                  onChange={(e) => setFrom(e.target.value)}
                  className="w-full font-semibold outline-none text-sm md:text-base bg-transparent"
                />
              </div>
            </div>

            {/* Divider */}
            <div className="hidden md:block w-px h-10 bg-gray-200" />

            {/* SWAP */}
            <div className="flex justify-center w-full md:w-auto">
              <button
                onClick={handleSwap}
                className="bg-gray-100 w-10 h-10 rounded-full shadow hover:scale-105 transition"
              >
                ⇄
              </button>
            </div>

            {/* Divider */}
            <div className="hidden md:block w-px h-10 bg-gray-200" />

            {/* TO */}
            <div className="flex items-center gap-3 w-full md:w-1/3 px-2">
              <img src={toIcon} alt="to" className="w-6 h-6" />
              <div className="w-full">
                <p className="text-xs text-gray-400">To</p>
                <input
                  value={to}
                  onChange={(e) => setTo(e.target.value)}
                  className="w-full font-semibold outline-none text-sm md:text-base bg-transparent"
                />
              </div>
            </div>

            {/* Divider */}
            <div className="hidden md:block w-px h-10 bg-gray-200" />

            {/* DATE */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 w-full md:w-1/3 px-2">

              {/* Date */}
              <div className="flex items-center gap-3 w-full">
                <img
                  src={dateIcon}
                  alt="date"
                  className="w-6 h-6 cursor-pointer"
                  onClick={() => {
                    if (dateRef.current?.showPicker) {
                      dateRef.current.showPicker();
                    } else {
                      dateRef.current.click();
                    }
                  }}
                />

                <div className="w-full">
                  <p className="text-xs text-gray-400">Date</p>
                  <input
                    ref={dateRef}
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full font-semibold outline-none text-sm md:text-base bg-transparent"
                  />
                </div>
              </div>

              {/* Today / Tomorrow */}
              <div className="flex gap-2">
                <button
                  onClick={setToday}
                  className="px-4 py-1 rounded-full text-sm bg-red-100 text-red-500 hover:bg-red-200"
                >
                  Today
                </button>
                <button
                  onClick={setTomorrow}
                  className="px-4 py-1 rounded-full text-sm bg-red-100 text-red-500 hover:bg-red-200"
                >
                  Tomorrow
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* SEARCH BUTTON */}
        <div className="flex justify-center mt-6">
          <button
            onClick={handleSearch}
            className="bg-red-700 hover:bg-red-600 text-white px-10 md:px-14 py-3 rounded-full text-lg shadow-lg transition"
          >
            🔍 Search Buses
          </button>
        </div>

      </div>
    </div>
  );
}

export default Booking;