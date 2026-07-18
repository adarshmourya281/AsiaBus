import seaterAvailable from "../../assets/seats/seater_available.svg";
import seaterSelected from "../../assets/seats/seater_selected.svg";
import seaterBooked from "../../assets/seats/seater_booked.svg";
import seaterMale from "../../assets/seats/seater_male.svg";
import seaterFem from "../../assets/seats/seater_fem.svg";

import slAvailable from "../../assets/seats/sl_available.svg";
import slSelected from "../../assets/seats/sl_selected.svg";
import slBooked from "../../assets/seats/sl_booked.svg";
import slMale from "../../assets/seats/sl_male.svg";
import slFem from "../../assets/seats/sl_fem.svg";

function SeatLegend() {
  const legendItems = [
    {
      label: "Available",
      seater: seaterAvailable,
      sleeper: slAvailable,
    },
    {
      label: "Selected",
      seater: seaterSelected,
      sleeper: slSelected,
    },
    {
      label: "Booked",
      seater: seaterBooked,
      sleeper: slBooked,
    },
    {
      label: "Male Reserved",
      seater: seaterMale,
      sleeper: slMale,
    },
    {
      label: "Female Reserved",
      seater: seaterFem,
      sleeper: slFem,
    },
  ];

  return (
    <div className="bg-white border-t border-gray-200 p-4">
      <h3 className="text-sm font-semibold text-gray-800 mb-4">
        Seat Legend
      </h3>

      <div className="flex flex-wrap gap-4">
        {legendItems.map((item, index) => (
          <div
            key={index}
            className="flex items-center gap-3 bg-gray-50 px-3 py-2 rounded-lg border border-gray-200"
          >
            {/* Seater */}
            <img
              src={item.seater}
              alt={`${item.label} Seater`}
              className="w-8 h-8 object-contain"
            />

            {/* Sleeper */}
            <img
              src={item.sleeper}
              alt={`${item.label} Sleeper`}
              className="w-8 h-8 object-contain"
            />

            {/* Label */}
            <span className="text-sm font-medium text-gray-700 whitespace-nowrap">
              {item.label}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-4 p-3 bg-blue-50 border border-blue-100 rounded-lg">
        <p className="text-xs text-gray-700">
          <span className="font-semibold">Note:</span> The first icon represents
          a <strong>Seater</strong> seat and the second icon represents a
          <strong> Sleeper</strong> berth.
        </p>
      </div>
    </div>
  );
}

export default SeatLegend;