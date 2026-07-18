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
 * SeatItem - Professional RedBus-style seat renderer using SVG assets
 * 
 * Features:
 * ✅ SVG-based rendering with actual seat images
 * ✅ Type detection: Seater (1x1), H-Sleeper (1x2), V-Sleeper (2x1)
 * ✅ State mapping: Available, Selected, Booked, Male Reserved, Female Reserved
 * ✅ Professional sizing: Seater (w-16 h-16), Sleeper (w-20 h-32)
 * ✅ Fare display below seat SVG
 * ✅ No seat labels in UI (only in tooltip)
 * ✅ Responsive hover effects
 * 
 * ARCHITECTURE NOTE:
 * - Grid span (width/length) is handled by parent DeckLayout.jsx via CSS Grid
 * - This component only controls VISUAL SIZE (SVG image dimensions)
 * - Grid cell span: `gridColumn: ${col} / span ${width}`, `gridRow: ${row} / span ${length}`
 * - Visual size: w-16 h-16 (seater) or w-20 h-32 (sleeper) for SVG image
 * - These are separate concerns: grid span (layout) vs visual size (appearance)
 */
function SeatItem({ seat, isSelected, onClick, disabled }) {
  const isAvailable = seat.available === "true" || seat.available === true;
  const isMaleReserved = seat.maleReserved === "true" || seat.maleReserved === true;
  const isFemaleReserved = seat.ladiesSeat === "true" || seat.ladiesSeat === true;

  // Determine seat type from width and length
  const width = parseInt(seat.width) || 1;
  const length = parseInt(seat.length) || 1;
  const isHorizontalSleeper = width === 1 && length === 2;
  const isVerticalSleeper = width === 2 && length === 1;
  const isSeater = width === 1 && length === 1;

  // Determine SVG based on seat type and state
  const getSvgImage = () => {
    // Determine base type
    const isSleeper = isHorizontalSleeper || isVerticalSleeper;

    // Determine state and return corresponding SVG
    if (!isAvailable) {
      return isSleeper ? slBooked : seaterBooked;
    }

    if (isSelected) {
      return isSleeper ? slSelected : seaterSelected;
    }

    if (isMaleReserved) {
      return isSleeper ? slMale : seaterMale;
    }

    if (isFemaleReserved) {
      return isSleeper ? slFem : seaterFem;
    }

    // Available
    return isSleeper ? slAvailable : seaterAvailable;
  };

  // Fixed compact sizing for RedBus-style layout
  const getSizeClasses = () => {
    if (isHorizontalSleeper || isVerticalSleeper) {
      return "w-9 h-14 sm:w-10 sm:h-16 md:w-9 md:h-14"; // Sleeper: compact fixed
    }
    return "w-8 h-8 sm:w-9 sm:h-9 md:w-8 md:h-8"; // Seater: compact fixed
  };

  const hoverClasses = isAvailable && !disabled
    ? "hover:scale-110 hover:shadow-xl transition-all duration-200"
    : disabled || !isAvailable
      ? "cursor-not-allowed opacity-70"
      : "";

  const svgImage = getSvgImage();
  const fareAmount = parseFloat(seat.fare).toFixed(0);

  return (
    <div className={`flex flex-col items-center justify-center gap-1 ${hoverClasses}`}>
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
      {/* <div className="text-center">
        <span className="text-xs sm:text-sm font-bold text-gray-800">
          ₹{fareAmount}
        </span> 
      </div> */}
    </div>
  );
}

export default SeatItem;
