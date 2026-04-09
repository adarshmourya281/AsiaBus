import BusDetails from "./BusDetails";
function SeatSelection({ selectedSeats, setSelectedSeats }) {
  const lowerSeats = Array.from({ length: 18 }, (_, i) => ({
    id: `L${i + 1}`,
    price: 2400,
  }));

  const upperSeats = Array.from({ length: 18 }, (_, i) => ({
    id: `U${i + 1}`,
    price: 2000,
  }));

  const toggleSeat = (seat) => {
    const exists = selectedSeats.find((s) => s.id === seat.id);

    if (exists) {
      setSelectedSeats(selectedSeats.filter((s) => s.id !== seat.id));
    } else {
      setSelectedSeats([...selectedSeats, seat]);
    }
  };

  const isSelected = (seat) =>
    selectedSeats.some((s) => s.id === seat.id);

  const SeatBox = ({ seat }) => (
    <div
      onClick={() => toggleSeat(seat)}
      className={`flex items-end justify-center 
        w-14 h-20 border rounded-lg text-xs cursor-pointer transition
        ${
          isSelected(seat)
            ? "bg-green-500 text-white"
            : "border-green-500 text-gray-600"
        }`}
    >
      ₹{seat.price}
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4">

      {/* 🔥 MAIN GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.6fr_1.2fr] gap-8">

        {/* ================= LEFT SIDE ================= */}
        <div>

          {/* SEAT LAYOUT */}
          <div className="flex flex-col sm:flex-row gap-6">

            {/* LOWER DECK */}
            <div className="bg-gray-100 p-4 rounded-xl flex-1">
              <h3 className="mb-3 font-semibold">Lower deck</h3>

              <div
                className="grid"
                style={{
                  gridTemplateColumns: "1fr 1fr 1fr",
                  rowGap: "16px",
                }}
              >
                {lowerSeats.map((seat, i) => {
                  const col = i % 3;

                  return (
                    <div
                      key={seat.id}
                      className={`flex justify-center ${
                        col === 0 ? "mr-10" : ""   // BIG GAP
                      } ${
                        col === 1 ? "mr-1" : ""    // SMALL GAP
                      }`}
                    >
                      <SeatBox seat={seat} />
                    </div>
                  );
                })}
              </div>
            </div>

            {/* UPPER DECK */}
            <div className="bg-gray-100 p-4 rounded-xl flex-1">
              <h3 className="mb-3 font-semibold">Upper deck</h3>

              <div
                className="grid"
                style={{
                  gridTemplateColumns: "1fr 1fr 1fr",
                  rowGap: "16px",
                }}
              >
                {upperSeats.map((seat, i) => {
                  const col = i % 3;

                  return (
                    <div
                      key={seat.id}
                      className={`flex justify-center ${
                        col === 0 ? "mr-10":""
                      } ${
                        col === 1 ? "mr-1":""
                      }`}
                    >
                      <SeatBox seat={seat} />
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

          {/* 🔥 KNOW YOUR SEAT TYPES */}
          <div className="mt-10">
            <h3 className="text-center font-semibold text-lg mb-5">
              Know your seat types
            </h3>

            <div className="bg-white border rounded-xl overflow-hidden">

              {/* HEADER */}
              <div className="grid grid-cols-3 bg-gray-100 p-3 text-sm font-semibold">
                <div>Seat Types</div>
                <div className="text-center">Seater</div>
                <div className="text-center">Sleeper</div>
              </div>

              {/* ROWS */}
              <div className="divide-y text-sm">

                <div className="grid grid-cols-3 p-4 items-center">
                  <div>Available</div>
                  <div className="flex justify-center">
                    <div className="w-6 h-6 border border-green-500 rounded"></div>
                  </div>
                  <div className="flex justify-center">
                    <div className="w-6 h-10 border border-green-500 rounded"></div>
                  </div>
                </div>

                <div className="grid grid-cols-3 p-4 items-center">
                  <div>Selected by you</div>
                  <div className="flex justify-center">
                    <div className="w-6 h-6 bg-green-500 rounded"></div>
                  </div>
                  <div className="flex justify-center">
                    <div className="w-6 h-10 bg-green-500 rounded"></div>
                  </div>
                </div>

                <div className="grid grid-cols-3 p-4 items-center">
                  <div>Already booked</div>
                  <div className="flex justify-center">
                    <div className="w-6 h-6 bg-gray-300 rounded"></div>
                  </div>
                  <div className="flex justify-center">
                    <div className="w-6 h-10 bg-gray-300 rounded"></div>
                  </div>
                </div>

              </div>
            </div>
          </div>

        </div>

        {/* ================= RIGHT SIDE ================= */}
<BusDetails></BusDetails>

      </div>
    </div>
  );
}

export default SeatSelection;