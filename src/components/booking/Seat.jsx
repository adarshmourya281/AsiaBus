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

/**
 * Seat - Professional RedBus-style seat renderer using SVG assets (coordinate-based grid)
 * 
 * Features:
 * ✅ SVG-based rendering: Uses actual seat images from assets
 * ✅ Type detection: Seater (1x1), H-Sleeper (1x2), V-Sleeper (2x1)
 * ✅ State mapping: Available, Selected, Booked, Male Reserved, Female Reserved
 * ✅ Coordinate positioning: Uses row/column from API for grid placement
 * ✅ Professional sizing: Seater (w-16 h-16), Sleeper (w-20 h-32)
 * ✅ Fare display below seat SVG
 * ✅ No seat labels in UI (only in tooltip)
 */
function Seat({ seat, isSelected, onClick, disabled }) {
  const isAvailable = seat.available === "true" || seat.available === true;
  const isMaleReserved = seat.maleReserved === "true" || seat.maleReserved === true;
  const isFemaleReserved = seat.ladiesSeat === "true" || seat.ladiesSeat === true;

  // Determine seat type from width and length
  const width = parseInt(seat.width) || 1;
  const length = parseInt(seat.length) || 1;
  const isHorizontalSleeper = width === 1 && length === 2;
  const isVerticalSleeper = width === 2 && length === 1;
  const isSleeper = isHorizontalSleeper || isVerticalSleeper;

  // Determine SVG based on seat type and state
  const getSvgImage = () => {
    // Determine base type
    const typeIsSleeper = isSleeper;

    // Determine state and return corresponding SVG
    if (!isAvailable) {
      return typeIsSleeper ? slBooked : seaterBooked;
    }

    if (isSelected) {
      return typeIsSleeper ? slSelected : seaterSelected;
    }

    if (isMaleReserved) {
      return typeIsSleeper ? slMale : seaterMale;
    }

    if (isFemaleReserved) {
      return typeIsSleeper ? slFem : seaterFem;
    }

    // Available
    return typeIsSleeper ? slAvailable : seaterAvailable;
  };

  // Size based on seat type
  const getSizeClasses = () => {
    if (isSleeper) {
      return "w-20 h-32"; // Sleeper: larger for bed-style seats
    }
    return "w-16 h-16"; // Seater: compact single seats
  };

  const hoverClasses = isAvailable && !disabled
    ? "hover:scale-110 hover:shadow-xl transition-all duration-200"
    : disabled || !isAvailable
      ? "cursor-not-allowed opacity-70"
      : "";

  const svgImage = getSvgImage();
  const fareAmount = parseFloat(seat.fare).toFixed(0);

  return (
    <div
      className={`flex flex-col items-center justify-center gap-2 ${hoverClasses}`}
      style={{
        gridColumn: `${parseInt(seat.column) + 1}`,
        gridRow: `${parseInt(seat.row) + 1}`,
      }}
    >
      {/* SVG Seat Image */}
      <button
        onClick={() => !disabled && isAvailable && onClick(seat)}
        disabled={disabled || !isAvailable}
        className={`relative flex items-center justify-center rounded-md overflow-hidden ${!isAvailable ? "cursor-not-allowed" : "cursor-pointer"}`}
        title={`Seat ${seat.name} - ₹${fareAmount}`}
      >
        <img
          src={svgImage}
          alt={`${seat.name}`}
          className={`${getSizeClasses()} object-contain`}
          loading="lazy"
        />
      </button>

      {/* Fare Display Only */}
      <div className="text-center">
        <span className="text-xs sm:text-sm font-bold text-gray-800">
          ₹{fareAmount}
        </span>
      </div>
    </div>
  );
}

export default Seat;
