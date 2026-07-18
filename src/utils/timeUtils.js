// ✅ Convert minutes from midnight to HH:mm 24-hour format
export const formatMinutesToTime = (minutes) => {
  if (!minutes && minutes !== 0) return "N/A";

  const mins = parseInt(minutes, 10);
  if (isNaN(mins) || mins < 0) return "N/A";

  let hours = Math.floor(mins / 60);
  const mins_remainder = mins % 60;

  let nextDay = false;
  if (hours >= 24) {
    hours = hours - 24;
    nextDay = true;
  }

  const timeStr = `${String(hours).padStart(2, "0")}:${String(mins_remainder).padStart(2, "0")}`;

  return nextDay ? `${timeStr} (+1 Day)` : timeStr;
};

// ✅ Get time slot from minutes (for filtering)
export const getTimeSlot = (minutes) => {
  if (!minutes && minutes !== 0) return null;
  const mins = parseInt(minutes, 10);
  const hours = Math.floor(mins / 60);

  if (hours >= 6 && hours < 12) return "morning";
  if (hours >= 12 && hours < 18) return "afternoon";
  if (hours >= 18 || hours < 6) return "evening";
  return null;
};

// ✅ Format fare with rupee symbol and 2 decimal places
export const formatFare = (fare) => {
  if (!fare) return "N/A";

  if (Array.isArray(fare)) {
    if (fare.length > 0) {
      return `₹${parseFloat(fare[0]).toFixed(2)}`;
    }
    return "N/A";
  }

  const fareNum = parseFloat(fare);
  if (isNaN(fareNum)) return "N/A";
  return `₹${fareNum.toFixed(2)}`;
};
