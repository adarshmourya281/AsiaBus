import { useState } from "react";
function Boarding({
  boardingPoint,
  setBoardingPoint,
  droppingPoint,
  setDroppingPoint,
}) {
  // SAMPLE DATA
  const boardingPoints = [
    { time: "18:00", name: "Nigdi MSRTC Bus Stand" },
    { time: "18:15", name: "Ravet" },
    { time: "18:30", name: "Wakad" },
    { time: "18:35", name: "Hinjewadi Flyover" },
  ];

  const droppingPoints = [
    { time: "04:10", name: "Zaheerabad" },
    { time: "04:30", name: "Woxsen College" },
    { time: "05:15", name: "Isnapur" },
    { time: "05:25", name: "Patancheru" },
  ];

  const Item = ({ item, selected, onClick }) => (
    <div
      onClick={onClick}
      className={`flex justify-between items-center p-4 border-b cursor-pointer rounded-lg transition
        ${selected ? "bg-red-50 border-red-400" : "hover:bg-gray-50"}
      `}
    >
      <div>
        <p className="font-semibold">{item.time}</p>
        <p className="text-sm text-gray-600">{item.name}</p>
      </div>

      <div
        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center
          ${
            selected
              ? "border-red-500 bg-red-500"
              : "border-gray-400"
          }
        `}
      />
    </div>
  );

  return (
    <div className="flex flex-col lg:flex-row gap-4 pb-24">

      {/* BOARDING */}
      <div className="flex-1 bg-gray-100 rounded-xl p-3">
        <h3 className="font-semibold mb-2">Boarding points</h3>

        {boardingPoints.map((point, i) => (
          <Item
            key={i}
            item={point}
            selected={boardingPoint?.name === point.name}
            onClick={() => setBoardingPoint(point)}
          />
        ))}
      </div>

      {/* DROPPING */}
      <div className="flex-1 bg-gray-100 rounded-xl p-3">
        <h3 className="font-semibold mb-2">Dropping points</h3>

        {droppingPoints.map((point, i) => (
          <Item
            key={i}
            item={point}
            selected={droppingPoint?.name === point.name}
            onClick={() => setDroppingPoint(point)}
          />
        ))}
      </div>

      {/* ✅ BOTTOM BUTTON */}
      <div className="fixed bottom-0 left-0 w-full bg-white p-4 border-t flex justify-center">

        <button
          disabled={!boardingPoint || !droppingPoint}
          className={`px-8 py-3 rounded-full text-white transition
            ${
              boardingPoint && droppingPoint
                ? "bg-red-500"
                : "bg-gray-300 cursor-not-allowed"
            }
          `}
        >
          Fill passenger details
        </button>

      </div>
    </div>
  );
}

export default Boarding;