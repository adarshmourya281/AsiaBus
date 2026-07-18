import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Bus,
  CalendarDays,
  MapPin,
  Ticket,
  Armchair,
  IndianRupee,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
} from "lucide-react";

import { getMyBookings } from "../../services/bookingService";

function MyBookings() {
  const navigate = useNavigate();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState({
    total: 0,
    page: 1,
    limit: 15,
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
  });

  // =========================================================
  // FETCH MY BOOKINGS
  // =========================================================

  const fetchBookings = async (pageNumber = 1) => {
    try {
      setLoading(true);
      setError("");

      // Check login
      const token = localStorage.getItem("token");

      if (!token) {
        setError("Please login to view your bookings.");
        setBookings([]);
        return;
      }

      console.log("-----------------------------------");
      console.log("🎫 Fetching My Bookings");
      console.log("Page:", pageNumber);

      const response = await getMyBookings(pageNumber, 15);

      console.log("✅ My Bookings Response:", response);

      const allBookings = response?.bookings || [];

      // =====================================================
      // SHOW ONLY COMPLETE TICKETS
      // Must contain TIN + PNR + Fare + DOJ
      // =====================================================

      console.log("📋 All Bookings:", allBookings);

      setBookings(allBookings);

      if (response?.meta) {
        setMeta(response.meta);
      }
    } catch (err) {
      console.error("❌ My Bookings Page Error:", err);

      setError(
        err.message ||
        "Unable to load your bookings. Please try again."
      );

      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // LOAD BOOKINGS WHEN PAGE CHANGES
  // =========================================================

  useEffect(() => {
    fetchBookings(page);
  }, [page]);

  // =========================================================
  // STATUS STYLE
  // =========================================================

  const getStatusStyle = (status) => {
    const bookingStatus = status?.toLowerCase();

    switch (bookingStatus) {
      case "confirmed":
        return "bg-green-100 text-green-700 border-green-200";

      case "cancelled":
        return "bg-red-100 text-red-700 border-red-200";

      case "payment_pending":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";

      case "blocked":
        return "bg-orange-100 text-orange-700 border-orange-200";

      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  // =========================================================
  // FORMAT STATUS
  // =========================================================

  const formatStatus = (status) => {
    if (!status) return "Unknown";

    return status
      .replaceAll("_", " ")
      .replace(/\b\w/g, (letter) => letter.toUpperCase());
  };

  // =========================================================
  // FORMAT DATE
  // =========================================================

  const formatDate = (date) => {
    if (!date) return "N/A";

    try {
      return new Date(`${date}T00:00:00`).toLocaleDateString(
        "en-IN",
        {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }
      );
    } catch {
      return date;
    }
  };

  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw
            size={40}
            className="animate-spin text-[#DE3826] mx-auto mb-4"
          />

          <p className="text-gray-600 font-medium">
            Loading your bookings...
          </p>
        </div>
      </div>
    );
  }

  // =========================================================
  // MAIN UI
  // =========================================================

  return (
    <div className="min-h-screen bg-gray-100 py-8 md:py-12">

      <div className="max-w-5xl mx-auto px-4">

        {/* Back Button */}

        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-[#DE3826] hover:text-red-700 font-semibold mb-6"
        >
          <ArrowLeft size={20} />

          Back to Home
        </button>

        {/* Page Header */}

        <div className="mb-8">

          <div className="flex items-center gap-3">

            <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center">

              <Ticket
                size={26}
                className="text-[#DE3826]"
              />

            </div>

            <div>

              <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                My Bookings
              </h1>

              <p className="text-gray-500 text-sm mt-1">
                View and manage your bus bookings
              </p>

            </div>

          </div>

        </div>

        {/* Error */}

        {error && (

          <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-6">

            <p className="text-red-600 font-medium">
              {error}
            </p>

            <button
              onClick={() => fetchBookings(page)}
              className="mt-4 bg-[#DE3826] text-white px-5 py-2 rounded-lg hover:bg-red-700"
            >
              Try Again
            </button>

          </div>

        )}

        {/* No Bookings */}

        {!error && bookings.length === 0 && (

          <div className="bg-white rounded-2xl shadow-sm p-10 text-center">

            <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-5">

              <Ticket
                size={36}
                className="text-[#DE3826]"
              />

            </div>

            <h2 className="text-xl font-bold text-gray-800 mb-2">
              No Bookings Found
            </h2>

            <p className="text-gray-500 mb-6">
              You don't have any completed bookings on this page.
            </p>

            <button
              onClick={() => navigate("/")}
              className="bg-[#DE3826] hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold"
            >
              Book a Bus
            </button>

          </div>

        )}

        {/* Booking Cards */}

        <div className="space-y-6">

          {bookings.map((booking) => (

            <div
              key={booking.id}
              className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100"
            >

              {/* Card Header */}

              <div className="p-5 md:p-6 border-b border-gray-100">

                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

                  <div className="flex items-center gap-3">

                    <div className="w-11 h-11 bg-red-50 rounded-lg flex items-center justify-center">

                      <Bus
                        size={23}
                        className="text-[#DE3826]"
                      />

                    </div>

                    <div>

                      <h2 className="text-lg md:text-xl font-bold text-gray-800">

                        {booking.sourceName || "N/A"}

                        <span className="mx-2 text-gray-400">
                          →
                        </span>

                        {booking.destinationName || "N/A"}

                      </h2>

                      {booking.operatorName && (

                        <p className="text-sm text-gray-500 mt-1">
                          {booking.operatorName}
                        </p>

                      )}

                    </div>

                  </div>

                  {/* Status */}

                  <span
                    className={`
                      px-4
                      py-2
                      rounded-full
                      border
                      text-sm
                      font-semibold
                      w-fit
                      ${getStatusStyle(booking.status)}
                    `}
                  >
                    {formatStatus(booking.status)}
                  </span>

                </div>

              </div>

              {/* Card Body */}

              <div className="p-5 md:p-6">

                {/* Main Information */}

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">

                  {/* Journey Date */}

                  <div>

                    <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">

                      <CalendarDays size={16} />

                      Journey Date

                    </div>

                    <p className="font-semibold text-gray-800">
                      {formatDate(booking.doj)}
                    </p>

                  </div>

                  {/* TIN */}

                  <div>

                    <p className="text-gray-500 text-sm mb-1">
                      Ticket Number
                    </p>

                    <p className="font-semibold text-gray-800">
                      {booking.tin}
                    </p>

                  </div>

                  {/* PNR */}

                  <div>

                    <p className="text-gray-500 text-sm mb-1">
                      PNR
                    </p>

                    <p className="font-semibold text-gray-800">
                      {booking.pnr}
                    </p>

                  </div>

                  {/* Fare */}

                  <div>

                    <div className="flex items-center gap-1 text-gray-500 text-sm mb-1">

                      <IndianRupee size={15} />

                      Total Fare

                    </div>

                    <p className="font-bold text-lg text-gray-800">
                      ₹{Number(booking.fare).toFixed(2)}
                    </p>

                  </div>

                </div>

                {/* Divider */}

                <div className="border-t border-gray-100 my-6" />

                {/* Boarding / Dropping */}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                  {/* Boarding */}

                  <div className="flex gap-3">

                    <div className="mt-1">

                      <MapPin
                        size={20}
                        className="text-green-600"
                      />

                    </div>

                    <div>

                      <p className="text-sm text-gray-500">
                        Boarding Point
                      </p>

                      <p className="font-semibold text-gray-800 mt-1">
                        {booking.boardingPointName || "N/A"}
                      </p>

                      {booking.boardingPointTime && (

                        <p className="text-sm text-gray-500 mt-1">
                          {booking.boardingPointTime}
                        </p>

                      )}

                    </div>

                  </div>

                  {/* Dropping */}

                  <div className="flex gap-3">

                    <div className="mt-1">

                      <MapPin
                        size={20}
                        className="text-red-600"
                      />

                    </div>

                    <div>

                      <p className="text-sm text-gray-500">
                        Dropping Point
                      </p>

                      <p className="font-semibold text-gray-800 mt-1">
                        {booking.droppingPointName || "N/A"}
                      </p>

                      {booking.droppingPointTime && (

                        <p className="text-sm text-gray-500 mt-1">
                          {booking.droppingPointTime}
                        </p>

                      )}

                    </div>

                  </div>

                </div>

                {/* Seats */}

                <div className="border-t border-gray-100 mt-6 pt-5">

                  <div className="flex items-center gap-2">

                    <Armchair
                      size={18}
                      className="text-[#DE3826]"
                    />

                    <span className="text-sm text-gray-500">
                      Seats:
                    </span>

                    <span className="font-semibold text-gray-800">

                      {booking.seatNames?.length > 0
                        ? booking.seatNames.join(", ")
                        : "N/A"}

                    </span>

                  </div>

                </div>

                {/* Bus Type */}

                {booking.busType && (

                  <div className="mt-4 text-sm text-gray-500">

                    <span className="font-medium">
                      Bus Type:
                    </span>{" "}

                    {booking.busType}

                  </div>

                )}

              </div>

            </div>

          ))}

        </div>

        {/* Pagination */}

        {meta.totalPages > 1 && (

          <div className="bg-white rounded-xl shadow-sm mt-8 p-4">

            <div className="flex items-center justify-between">

              <button
                disabled={!meta.hasPrevPage || page === 1}
                onClick={() =>
                  setPage((currentPage) =>
                    Math.max(currentPage - 1, 1)
                  )
                }
                className={`
                  flex
                  items-center
                  gap-2
                  px-4
                  py-2
                  rounded-lg
                  font-semibold
                  ${!meta.hasPrevPage || page === 1
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-[#DE3826] text-white hover:bg-red-700"
                  }
                `}
              >

                <ChevronLeft size={18} />

                Previous

              </button>

              <div className="text-center">

                <p className="font-semibold text-gray-800">
                  Page {meta.page} of {meta.totalPages}
                </p>

                <p className="text-xs text-gray-500 mt-1">
                  {meta.total} total bookings
                </p>

              </div>

              <button
                disabled={!meta.hasNextPage}
                onClick={() =>
                  setPage((currentPage) => currentPage + 1)
                }
                className={`
                  flex
                  items-center
                  gap-2
                  px-4
                  py-2
                  rounded-lg
                  font-semibold
                  ${!meta.hasNextPage
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-[#DE3826] text-white hover:bg-red-700"
                  }
                `}
              >

                Next

                <ChevronRight size={18} />

              </button>

            </div>

          </div>

        )}

      </div>

    </div>
  );
}

export default MyBookings;