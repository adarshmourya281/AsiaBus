import { useState } from "react";

function TrackBooking() {
  const [bookingId, setBookingId] = useState("");
  const [mobile, setMobile] = useState("");

  const handleSubmit = () => {
    console.log("Booking ID:", bookingId);
    console.log("Mobile:", mobile);
  };

  return (
    <div className="bg-gray-100 min-h-screen flex items-start justify-center py-10 px-4">
      
      {/* Card */}
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-lg p-6 md:p-10">

        {/* Heading */}
        <h1 className="text-2xl md:text-3xl font-semibold mb-2">
          Enter Ticket Details
        </h1>
        <p className="text-gray-500 mb-6">
          Check your email or SMS that you received while booking
        </p>

        {/* Form */}
        <div className="flex flex-col md:flex-row gap-4 items-center">

          {/* Booking ID */}
          <div className="w-full md:flex-1">
            <label className="text-sm text-gray-600">
              Booking ID
            </label>
            <input
              type="text"
              placeholder="Please enter the booking ID"
              value={bookingId}
              onChange={(e) => setBookingId(e.target.value)}
              className="w-full mt-1 px-4 py-3 border rounded-lg outline-none focus:ring-2 focus:ring-red-400"
            />
          </div>

          {/* Mobile */}
          <div className="w-full md:flex-1">
            <label className="text-sm text-gray-600">
              Mobile Number
            </label>
            <div className="flex mt-1 border rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-red-400">
              <span className="px-3 flex items-center bg-gray-100 text-gray-600">
                +91
              </span>
              <input
                type="text"
                placeholder="Please enter the mobile number"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                className="w-full px-4 py-3 outline-none"
              />
            </div>
          </div>

          {/* Button */}
          <div className="w-full md:w-auto mt-2 md:mt-6">
            <button
              onClick={handleSubmit}
              className="w-full md:w-auto bg-red-500 hover:bg-red-600 text-white px-8 py-3 rounded-lg shadow-md transition"
            >
              Ticket Details
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}

export default TrackBooking;