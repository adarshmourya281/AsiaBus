import { Navigation } from "lucide-react";
import SeatItem from "./SeatItem";
import SeatLegend from "./SeatLegend";
import { useMemo } from "react";

/**
 * DeckLayout - Seatseller API Compliant Bus Seat Layout
 * 
 * ARCHITECTURE FIXES:
 * ✅ Coordinate Normalization: Calculates min/max from actual coordinates
 * ✅ Width/Length as Grid Spans: Sleepers occupy actual 2x1 or 1x2 grid cells
 * ✅ No Empty Cell Rendering: Only renders seat elements, not empty divs
 * ✅ Direct Seat Iteration: O(n) instead of O(n²) nested loops
 * ✅ Seatseller Spec Compliant: row/column = position, width/length = size
 * ✅ CSS Grid Properly: Normalized coordinates + explicit span properties
 */
function DeckLayout({ deckSeats, deckIndex, selectedSeats, onSeatClick, totalDecks }) {
  if (!deckSeats || deckSeats.length === 0) {
    return null;
  }

  // 🔧 CALCULATE NORMALIZED GRID DIMENSIONS with coordinate min/max
  const gridDimensions = useMemo(() => {
    if (!deckSeats || deckSeats.length === 0) {
      return { rows: 1, cols: 1, minRow: 0, minCol: 0 };
    }

    let minRow = Infinity;
    let maxRow = -Infinity;
    let minCol = Infinity;
    let maxCol = -Infinity;

    deckSeats.forEach((seat) => {
      const row = parseInt(seat.row);
      const col = parseInt(seat.column);
      const width = Math.max(1, parseInt(seat.width) || 1);
      const length = Math.max(1, parseInt(seat.length) || 1);

      if (isNaN(row) || isNaN(col)) return;

      minRow = Math.min(minRow, row);
      maxRow = Math.max(maxRow, row);
      minCol = Math.min(minCol, col);
      maxCol = Math.max(maxCol, col);

      // Account for seats that span multiple cells
      // width = vertical (rows), length = horizontal (columns) per Seatseller spec
      maxRow = Math.max(maxRow, row + width - 1);
      maxCol = Math.max(maxCol, col + length - 1);
    });

    if (!isFinite(minRow) || !isFinite(minCol) || !isFinite(maxRow) || !isFinite(maxCol)) {
      return { rows: 1, cols: 1, minRow: 0, minCol: 0 };
    }

    const rows = Math.max(1, maxRow - minRow + 1);
    const cols = Math.max(1, maxCol - minCol + 1);

    return {
      rows,
      cols,
      minRow,
      minCol,
    };
  }, [deckSeats]);

  // 🎨 GET DECK LABEL
  const getDeckLabel = () => {
    const deckNum = parseInt(deckIndex);
    if (deckNum === 0) return "Lower Deck";
    if (deckNum === 1) return "Upper Deck";
    return `Deck ${deckNum + 1}`;
  };

  return (
    
    <div className="w-full bg-white rounded-lg md:rounded-xl shadow-md hover:shadow-lg transition border border-gray-100 flex flex-col h-fit">
       
      {/* ========== DECK HEADER (RedBus Style) - COMPACT ========== */}
      <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-3 md:p-3 border-b border-blue-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-sm md:text-base text-gray-900">{getDeckLabel()}</h3>
            <p className="text-xs text-gray-600 mt-0.5">{deckSeats.length} seats</p>
          </div>
          <div className="flex items-center gap-1.5 text-gray-600">
            <Navigation size={16} className="text-blue-600" strokeWidth={2} />
            <span className="text-xs font-semibold">Front</span>
          </div>
        </div>
      </div>

      {/* ========== SEAT LAYOUT - COMPACT (No Horizontal Scroll) ========== */}
      
      <div className="p-2 sm:p-2 md:p-2 overflow-y-auto overflow-x-auto max-h-[700px] w-full flex justify-center">
        
        {/* Seat Grid Container - Direct Seat Rendering with CSS Grid Spans */}
        <div
          className="grid gap-1 sm:gap-1.5 md:gap-2 p-2 sm:p-2 md:p-3 bg-gradient-to-b from-gray-50 to-gray-100 rounded-lg w-fit"
          style={{
            display: 'inline-grid',
            gridTemplateColumns: `repeat(${gridDimensions.rows}, 48px)`,
            gridTemplateRows: `repeat(${gridDimensions.cols}, auto)`,
          }}
        >
          
          {/* RENDER ONLY SEAT ELEMENTS - No empty cells */}
          {deckSeats.map((seat) => {
            const row = parseInt(seat.row) || 0;
            const col = parseInt(seat.column) || 0;
            const width = parseInt(seat.width) || 1;
            const length = parseInt(seat.length) || 1;

            // Normalize coordinates based on min values
            const normalizedRow = row - gridDimensions.minRow + 1;
            const normalizedCol = col - gridDimensions.minCol + 1;

            const seatId = `${seat.name}-${seat.zIndex || "0"}`;
            const isSelected = selectedSeats.some((s) => s.id === seatId);

            return (
              <div
                key={seatId}
                style={{
                  // Transpose: swap row/col for top-to-bottom layout
                  gridColumn: `${normalizedRow} / span ${width}`,
                  gridRow: `${normalizedCol} / span ${length}`,
                  minWidth: 0,
                  minHeight: 0,
                }}
                className="flex items-center justify-center"
              >
                <SeatItem
                  seat={seat}
                  isSelected={isSelected}
                  onClick={() => onSeatClick(seat)}
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* ========== LEGEND - COMPACT ========== */}
      {deckIndex === "0" && (
        <div className="border-t border-gray-100 p-3 md:p-3 bg-gray-50">
          <SeatLegend />
        </div>
      )}
    </div>
  );
}

export default DeckLayout;
