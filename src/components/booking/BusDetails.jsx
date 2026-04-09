import { useState, useEffect } from "react";

import bus1 from "../../assets/bus1.jpeg";
import bus2 from "../../assets/bus2.jpeg";
import bus3 from "../../assets/bus3.jpeg";
import bus4 from "../../assets/bus4.jpeg";
import bus5 from "../../assets/bus5.jpeg";

function BusDetails() {
  const [activeTab, setActiveTab] = useState("policy");
  const [previewIndex, setPreviewIndex] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const images = [bus1, bus2, bus3, bus4, bus5];

  const visible = 3;
  const total = images.length;

  // 🔥 AUTO SLIDE
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) =>
        prev < total - visible ? prev + 1 : 0
      );
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // NEXT
  const next = () => {
    if (currentIndex < total - visible) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  // PREV
  const prev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  return (
    <div className="bg-gray-50 p-5 rounded-xl shadow-sm">

      {/* HEADER */}
      <h2 className="font-semibold text-lg">Intercity Travels</h2>
      <p className="text-sm text-gray-500">
        18:30 - 12:25 • Thu 16 Apr
      </p>

      {/* 🔥 CAROUSEL (3 ITEMS ONLY) */}
      <div className="relative mt-4">

        {/* LEFT */}
        <button
          onClick={prev}
          className="absolute left-0 top-1/2 -translate-y-1/2 bg-white shadow p-2 rounded-full z-10"
        >
          ◀
        </button>

        {/* VIEWPORT */}
        <div className="overflow-hidden">

          <div
            className="flex transition-transform duration-500"
            style={{
              transform: `translateX(-${currentIndex * (100 / visible)}%)`,
              width: `${(total * 100) / visible}%`,
            }}
          >
            {images.map((img, i) => (
              <div
                key={i}
                style={{ width: `${100 / total}%` }}
                className="px-2"
              >
                <img
                  src={img}
                  onClick={() => setPreviewIndex(i)}
                  className="w-full h-44 object-cover rounded-lg cursor-pointer hover:scale-105 transition"
                />
              </div>
            ))}
          </div>

        </div>

        {/* RIGHT */}
        <button
          onClick={next}
          className="absolute right-0 top-1/2 -translate-y-1/2 bg-white shadow p-2 rounded-full z-10"
        >
          ▶
        </button>

      </div>

      {/* 🔥 TABS */}
      <div className="flex gap-4 mt-6 text-sm border-b pb-2 overflow-x-auto">
        {["policy", "boarding", "dropping", "photos"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-1 whitespace-nowrap capitalize ${
              activeTab === tab
                ? "text-red-500 border-b-2 border-red-500"
                : "text-gray-500"
            }`}
          >
            {tab === "policy"
              ? "Cancellation policy"
              : tab === "photos"
              ? "Bus Photos"
              : tab}
          </button>
        ))}
      </div>

      {/* CONTENT */}
      <div className="mt-4 text-sm max-h-[220px] overflow-y-auto">

        {activeTab === "policy" && (
          <div className="space-y-3">
            <div className="p-3 border rounded-lg flex justify-between">
              <span>Before 24 hrs</span>
              <span className="text-green-600 font-semibold">90% refund</span>
            </div>
            <div className="p-3 border rounded-lg flex justify-between">
              <span>12–24 hrs</span>
              <span className="text-yellow-600 font-semibold">50% refund</span>
            </div>
            <div className="p-3 border rounded-lg flex justify-between">
              <span>Less than 12 hrs</span>
              <span className="text-red-500 font-semibold">No refund</span>
            </div>
          </div>
        )}

        {activeTab === "boarding" && (
          <div className="space-y-3">
            {[
              { time: "18:00", name: "Nigdi" },
              { time: "18:15", name: "Ravet" },
              { time: "18:30", name: "Wakad" },
            ].map((item, i) => (
              <div key={i} className="p-3 border rounded-lg flex justify-between">
                <span>{item.name}</span>
                <span className="text-gray-500">{item.time}</span>
              </div>
            ))}
          </div>
        )}

        {activeTab === "dropping" && (
          <div className="space-y-3">
            {[
              { time: "04:10", name: "Zaheerabad" },
              { time: "05:00", name: "Hyderabad" },
            ].map((item, i) => (
              <div key={i} className="p-3 border rounded-lg flex justify-between">
                <span>{item.name}</span>
                <span className="text-gray-500">{item.time}</span>
              </div>
            ))}
          </div>
        )}

        {activeTab === "photos" && (
          <div className="grid grid-cols-2 gap-3">
            {images.map((img, i) => (
              <img
                key={i}
                src={img}
                onClick={() => setPreviewIndex(i)}
                className="w-full h-28 object-cover rounded-lg cursor-pointer"
              />
            ))}
          </div>
        )}
      </div>

      {/* 🔥 FULLSCREEN PREVIEW */}
      {previewIndex !== null && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50">

          <button
            onClick={() => setPreviewIndex(null)}
            className="absolute top-5 right-5 text-white text-2xl"
          >
            ✕
          </button>

          <button
            onClick={() =>
              setPreviewIndex(prev =>
                prev === 0 ? images.length - 1 : prev - 1
              )
            }
            className="absolute left-5 text-white text-3xl"
          >
            ◀
          </button>

          <img
            src={images[previewIndex]}
            className="max-h-[80vh] max-w-[90vw] rounded-lg"
          />

          <button
            onClick={() =>
              setPreviewIndex(prev =>
                prev === images.length - 1 ? 0 : prev + 1
              )
            }
            className="absolute right-5 text-white text-3xl"
          >
            ▶
          </button>
        </div>
      )}
    </div>
  );
}

export default BusDetails;