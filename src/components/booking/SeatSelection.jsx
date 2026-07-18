import { useState, useEffect, useMemo, useCallback } from "react";
import { getSeatLayout } from "../../services/tripService";
import DeckLayout from "./DeckLayout";

/**
 * SeatSelection - Main coordinator for COORDINATE-BASED seat layout
 * 
 * Architecture:
 * ✅ Fetches seats from Seatseller API (row, column, width, length, zIndex)
 * ✅ Groups seats by deck (zIndex: 0=Lower, 1=Upper) with useMemo
 * ✅ Renders each deck with DeckLayout using coordinate mapping
 * ✅ Preserves aisles/gaps exactly as returned by API (no artificial grid)
 * ✅ Manages seat selection state with full seat properties
 * ✅ Performance optimized for large datasets
 * 
 * Key Features:
 * - Coordinate-based: Uses row + column for actual positioning
 * - Type support: Seater (1x1), H-Sleeper (1x2), V-Sleeper (2x1)
 * - Deck support: Separate decks for Lower (0) and Upper (1)
 * - State management: Tracks selected seats with all properties
 * - Performance: useMemo for deck grouping, useCallback for event handlers
 * 
 * API Seat Structure:
 * {
 *   name: "A4",
 *   row: "4",           // Y position
 *   column: "12",       // X position
 *   width: "1",         // 1 or 2
 *   length: "2",        // 1 or 2
 *   zIndex: "0",        // 0=Lower, 1=Upper
 *   available: "true",
 *   ladiesSeat: "false",
 *   fare: "2199"
 * }
 */
function SeatSelection({ trip, selectedSeats, setSelectedSeats }) {
  const [seatsData, setSeatsData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 🔄 Fetch seat layout from Seatseller API
  useEffect(() => {
    if (!trip?.id) {
      console.warn("⚠️ [SeatSelection] No trip ID available");
      return;
    }

    const fetchSeats = async () => {
      setLoading(true);
      setError(null);

      try {
        console.log(`🔄 [SeatSelection] Fetching coordinates from API for trip: ${trip.id}`);

        const result = await getSeatLayout(trip.id);
console.log("Seat Result =", result); 
        if (!result.success) {
          throw new Error("API returned unsuccessful response");
        }

        const seats = result.seats || [];
        console.log(`✅ [SeatSelection] Received ${seats.length} seats with coordinates`);

        // Log seat distribution
        const seater = seats.filter(s => s.width === "1" && s.length === "1").length;
        const hSleeper = seats.filter(s => s.width === "1" && s.length === "2").length;
        const vSleeper = seats.filter(s => s.width === "2" && s.length === "1").length;

        console.log(`📊 [SeatSelection] Breakdown: ${seater} seater + ${hSleeper} h-sleeper + ${vSleeper} v-sleeper = ${seats.length} total`);

        setSeatsData(seats);
      } catch (err) {
        console.error("❌ [SeatSelection] Error fetching seats:", err.message);
        setError(err.message);
        setSeatsData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSeats();
  }, [trip?.id]);

  // 🗺️ GROUP SEATS BY DECK using useMemo (performance optimization)
  const deckGroups = useMemo(() => {
    if (!seatsData || !Array.isArray(seatsData)) return {};

    const decks = {};
    seatsData.forEach((seat) => {
      const deckIndex = String(seat.zIndex || "0");
      if (!decks[deckIndex]) {
        decks[deckIndex] = [];
      }
      decks[deckIndex].push(seat);
    });

    console.log(
      `📍 [SeatSelection] Grouped ${seatsData.length} seats into ${Object.keys(decks).length} deck(s): ${Object.keys(decks)
        .sort((a, b) => parseInt(a) - parseInt(b))
        .map((k) => `Deck ${k}`)
        .join(", ")}`
    );
    return decks;
  }, [seatsData]);

  // 🔢 SORT DECK KEYS numerically for consistent ordering (0, 1, 2...)
  const deckKeys = useMemo(() => {
    return Object.keys(deckGroups).sort((a, b) => parseInt(a) - parseInt(b));
  }, [deckGroups]);

  // 🎯 HANDLE SEAT SELECTION/DESELECTION with useCallback
  const handleSeatClick = useCallback(
    (seat) => {
      const seatId = `${seat.name}-${seat.zIndex || "0"}`;
      const isSelected = selectedSeats.some((s) => s.id === seatId);

      if (isSelected) {
        // DESELECT
        const newSelected = selectedSeats.filter((s) => s.id !== seatId);
        setSelectedSeats(newSelected);
        console.log(`❌ [SeatSelection] Deselected ${seat.name}`);
      } else {
        // SELECT with all seat properties from API
        const newSeat = {
          id: seatId,
          name: seat.name,
          fare: parseFloat(seat.fare) || 0,
          row: seat.row,
          column: seat.column,
          zIndex: seat.zIndex || "0",
          width: seat.width,
          length: seat.length,
          available: seat.available,
          ladiesSeat: seat.ladiesSeat,
        };
        const newSelected = [...selectedSeats, newSeat];
        setSelectedSeats(newSelected);
        console.log(`✅ [SeatSelection] Selected ${seat.name} - ₹${newSeat.fare}`);
      }
    },
    [selectedSeats, setSelectedSeats]
  );

  return (
    <div className="w-full">
      {/* ========== LOADING STATE ========== */}
      {loading && (
        <div className="bg-blue-50 border-2 border-blue-300 rounded-lg p-6 text-center">
          <p className="text-blue-800 font-semibold">🔄 Loading seat layout with coordinates...</p>
        </div>
      )}

      {/* ========== ERROR STATE ========== */}
      {error && (
        <div className="bg-red-50 border-2 border-red-300 rounded-lg p-6 text-center">
          <p className="text-red-800 font-semibold">❌ Error loading seats: {error}</p>
        </div>
      )}

      {/* ========== DECK RENDERING - COORDINATE-BASED ========== */}
      {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {deckKeys.length > 0 ? (
            deckKeys.map((deckIndex) => (
              <DeckLayout
                key={deckIndex}
                deckSeats={deckGroups[deckIndex]}
                deckIndex={deckIndex}
                selectedSeats={selectedSeats}
                onSeatClick={handleSeatClick}
                totalDecks={deckKeys.length}
              />
            ))
          ) : (
            <div className="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-6 text-center col-span-full">
              <p className="text-yellow-800 font-semibold">
                ⚠️ {error ? `Unable to load seats: ${error}` : "No seats available for this trip"}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default SeatSelection;

