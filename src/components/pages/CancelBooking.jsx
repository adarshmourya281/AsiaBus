import { useState } from "react";
import {
  Search,
  Loader2,
  Ticket,
  MapPin,
  Bus,
  CalendarDays,
  User,
  Armchair,
  CheckCircle2,
} from "lucide-react";

import {
  lookupCancellationTicket,
  getCancellationData,
  cancelTicket,
} from "../../services/bookingService";


function CancelBooking() {

  /* =========================================================
     FORM STATE
     ========================================================= */

  const [ticketNo, setTicketNo] = useState("");
  const [mobileNo, setMobileNo] = useState("");


  /* =========================================================
     API STATES
     ========================================================= */

  const [loading, setLoading] = useState(false);
  const [policyLoading, setPolicyLoading] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(false);


  /* =========================================================
     DATA STATES
     ========================================================= */

  // Data returned from /cancel/lookup
  const [lookupData, setLookupData] = useState(null);

  // Data returned from /cancellation-data
  const [policyData, setPolicyData] = useState(null);

  // Selected active seats
  const [selectedSeats, setSelectedSeats] = useState([]);


  /* =========================================================
     UI STATES
     ========================================================= */

  const [error, setError] = useState("");

  const [showConfirmModal, setShowConfirmModal] =
    useState(false);

  const [cancelSuccess, setCancelSuccess] =
    useState(null);


  /* =========================================================
     STEP 1
     SEARCH TICKET USING TIN + MOBILE
     ========================================================= */

  const handleSearch = async () => {

    setError("");
    setLookupData(null);
    setPolicyData(null);
    setSelectedSeats([]);
    setCancelSuccess(null);

    const tin = ticketNo.trim();
    const mobile = mobileNo.trim();


    if (!tin) {
      setError("Please enter Ticket Number.");
      return;
    }


    if (!mobile) {
      setError("Please enter Mobile Number.");
      return;
    }


    if (!/^\d{10}$/.test(mobile)) {
      setError(
        "Please enter a valid 10 digit Mobile Number."
      );
      return;
    }


    try {

      setLoading(true);


      const response =
        await lookupCancellationTicket({
          tin,
          mobile,
        });


      console.log(
        "🎫 [CancelBooking] Lookup Data:",
        response
      );


      /*
       * If all seats are already cancelled
       */

      const activeSeats =
        Array.isArray(response?.activeSeats)
          ? response.activeSeats
          : [];


      if (
        response?.bookingStatus === "cancelled" ||
        activeSeats.length === 0
      ) {

        setError(
          "This ticket is already fully cancelled."
        );

        return;
      }


      /*
       * Backend cancellable check
       */

      if (response?.cancellable === false) {

        setError(
          response?.message ||
          "This ticket is not eligible for cancellation."
        );

        return;
      }


      setLookupData(response);


    } catch (err) {

      console.error(
        "❌ Ticket Lookup Error:",
        err
      );


      setError(
        err.message ||
        "Unable to fetch ticket details."
      );

    } finally {

      setLoading(false);

    }

  };


  /* =========================================================
     SELECT / UNSELECT SEAT
     ========================================================= */

  const toggleSeat = (seatName) => {

    const seat = String(seatName);


    setSelectedSeats((previousSeats) => {

      if (previousSeats.includes(seat)) {

        return previousSeats.filter(
          (item) => item !== seat
        );

      }


      return [
        ...previousSeats,
        seat,
      ];

    });

  };


  /* =========================================================
     CHECK IF SEAT IS ACTIVE
     ========================================================= */

  const isSeatActive = (seatName) => {

    return lookupData?.activeSeats
      ?.map(String)
      .includes(String(seatName));

  };


  /* =========================================================
     STEP 2
     GET CANCELLATION POLICY
     ========================================================= */

  const handleContinue = async () => {

    setError("");


    if (selectedSeats.length === 0) {

      setError(
        "Please select at least one passenger to cancel."
      );

      return;

    }


    try {

      setPolicyLoading(true);


      const response =
        await getCancellationData(
          lookupData.tin
        );


      console.log(
        "📋 [CancelBooking] Policy Data:",
        response
      );


      if (response?.cancellable === false) {

        setError(
          response?.message ||
          "This ticket is not eligible for cancellation."
        );

        return;

      }


      setPolicyData(response);

      setShowConfirmModal(true);


    } catch (err) {

      console.error(
        "❌ Cancellation Policy Error:",
        err
      );


      setError(
        err.message ||
        "Unable to fetch cancellation policy."
      );

    } finally {

      setPolicyLoading(false);

    }

  };


  /* =========================================================
     GET SELECTED SEAT POLICY
     ========================================================= */

  const selectedSeatPolicies =

    policyData?.seats?.filter((seat) =>

      selectedSeats
        .map(String)
        .includes(
          String(seat.seatName)
        )

    ) || [];


  /* =========================================================
     CALCULATE TOTAL REFUND
     ========================================================= */

  const totalRefund =

    selectedSeatPolicies.reduce(

      (total, seat) =>

        total +
        Number(
          seat.refundAmount || 0
        ),

      0

    );


  /* =========================================================
     CALCULATE TOTAL CANCELLATION CHARGE
     ========================================================= */

  const totalCancellationCharge =

    selectedSeatPolicies.reduce(

      (total, seat) =>

        total +
        Number(
          seat.cancellationCharge || 0
        ),

      0

    );


  /* =========================================================
     STEP 3
     FINAL CANCEL API
     ========================================================= */

  const handleCancelTicket = async () => {

    setError("");


    if (selectedSeats.length === 0) {

      setError(
        "Please select seats to cancel."
      );

      return;

    }


    try {

      setCancelLoading(true);


      const response =
        await cancelTicket({

          tin: lookupData.tin,

          seatsToCancel:
            selectedSeats.join(","),

        });


      console.log(
        "✅ Final Cancel Response:",
        response
      );


      setCancelSuccess(response);

      setShowConfirmModal(false);


    } catch (err) {

      console.error(
        "❌ Cancel Ticket Error:",
        err
      );


      setError(
        err.message ||
        "Unable to cancel ticket."
      );


      setShowConfirmModal(false);


    } finally {

      setCancelLoading(false);

    }

  };


  /* =========================================================
     RESET PAGE
     ========================================================= */

  const handleDone = () => {

    setTicketNo("");
    setMobileNo("");

    setLookupData(null);
    setPolicyData(null);

    setSelectedSeats([]);

    setCancelSuccess(null);

    setError("");

  };


  /* =========================================================
     JSX
     ========================================================= */

  return (

    <div className="min-h-screen bg-gray-100 py-10 px-4">


      <div className="max-w-3xl mx-auto">


        {/* ===================================================
            SEARCH CARD
            =================================================== */}

        {!lookupData && (

          <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">


            <div className="flex items-center gap-3 mb-8">

              <Ticket
                className="text-red-600"
                size={34}
              />

              <h1 className="text-2xl md:text-3xl font-bold">

                Cancel Ticket

              </h1>

            </div>


            <div className="space-y-5">


              {/* Ticket Number */}

              <div>

                <label className="block mb-2 font-semibold">

                  Ticket Number

                </label>


                <input

                  type="text"

                  value={ticketNo}

                  onChange={(e) =>
                    setTicketNo(
                      e.target.value.toUpperCase()
                    )
                  }

                  placeholder="Enter Ticket Number"

                  className="
                    w-full
                    border
                    rounded-lg
                    p-3
                    focus:ring-2
                    focus:ring-red-500
                    outline-none
                  "

                />

              </div>


              {/* Mobile */}

              <div>

                <label className="block mb-2 font-semibold">

                  Mobile Number

                </label>


                <div className="flex border rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-red-500">


                  <span className="px-3 flex items-center bg-gray-100 text-gray-600">

                    +91

                  </span>


                  <input

                    type="tel"

                    maxLength={10}

                    value={mobileNo}

                    onChange={(e) => {

                      const value =
                        e.target.value.replace(
                          /\D/g,
                          ""
                        );

                      setMobileNo(value);

                    }}

                    placeholder="Enter Mobile Number"

                    className="
                      flex-1
                      p-3
                      outline-none
                    "

                  />


                </div>

              </div>


              {/* Error */}

              {error && (

                <div className="bg-red-100 text-red-600 rounded-lg p-3">

                  {error}

                </div>

              )}


              {/* Search Button */}

              <button

                type="button"

                onClick={handleSearch}

                disabled={loading}

                className="
                  w-full
                  bg-red-600
                  hover:bg-red-700
                  disabled:bg-gray-400
                  text-white
                  rounded-lg
                  p-3
                  font-semibold
                  flex
                  justify-center
                  items-center
                  gap-2
                "

              >

                {loading ? (

                  <>

                    <Loader2
                      className="animate-spin"
                      size={20}
                    />

                    Searching...

                  </>

                ) : (

                  <>

                    <Search size={18} />

                    Search Ticket

                  </>

                )}

              </button>


            </div>

          </div>

        )}


        {/* ===================================================
            LOOKUP RESULT
            =================================================== */}

        {lookupData && (

          <div className="bg-white rounded-xl shadow-lg overflow-hidden">


            {/* Header */}

            <div className="p-6 border-b">


              <div className="flex justify-between items-start gap-4">


                <div>

                  <h2 className="text-2xl font-bold">

                    Select Passengers

                  </h2>


                  <p className="text-gray-500 mt-1">

                    Select passengers whose seats you want to cancel.

                  </p>

                </div>


                <Ticket
                  className="text-red-600"
                  size={32}
                />


              </div>


            </div>


            {/* Journey */}

            <div className="p-6 bg-gray-50">


              <div className="flex items-center justify-between gap-3">


                <div>

                  <p className="text-sm text-gray-500">

                    From

                  </p>

                  <h3 className="font-bold text-lg">

                    {lookupData.sourceName}

                  </h3>

                </div>


                <div className="flex-1 border-t border-dashed border-gray-400" />


                <Bus
                  size={22}
                  className="text-red-600"
                />


                <div className="flex-1 border-t border-dashed border-gray-400" />


                <div className="text-right">

                  <p className="text-sm text-gray-500">

                    To

                  </p>

                  <h3 className="font-bold text-lg">

                    {lookupData.destinationName}

                  </h3>

                </div>


              </div>


              <div className="flex items-center gap-2 mt-5 text-gray-600">

                <CalendarDays size={18} />

                <span>

                  {lookupData.doj}

                </span>

              </div>


            </div>


            {/* Ticket Details */}

            <div className="p-6 grid grid-cols-2 gap-4 border-b">


              <div>

                <p className="text-xs text-gray-500">

                  TIN

                </p>

                <p className="font-semibold">

                  {lookupData.tin}

                </p>

              </div>


              <div>

                <p className="text-xs text-gray-500">

                  PNR

                </p>

                <p className="font-semibold">

                  {lookupData.pnr}

                </p>

              </div>


              <div>

                <p className="text-xs text-gray-500">

                  Operator

                </p>

                <p className="font-semibold">

                  {lookupData.operatorName}

                </p>

              </div>


              <div>

                <p className="text-xs text-gray-500">

                  Fare

                </p>

                <p className="font-semibold">

                  ₹{lookupData.fare}

                </p>

              </div>


            </div>


            {/* Boarding / Dropping */}

            <div className="p-6 grid md:grid-cols-2 gap-4 border-b">


              <div className="flex gap-3">

                <MapPin
                  className="text-green-600"
                  size={20}
                />

                <div>

                  <p className="text-sm text-gray-500">

                    Boarding Point

                  </p>

                  <p className="font-semibold">

                    {lookupData.boardingPointName}

                  </p>

                </div>

              </div>


              <div className="flex gap-3">

                <MapPin
                  className="text-red-600"
                  size={20}
                />

                <div>

                  <p className="text-sm text-gray-500">

                    Dropping Point

                  </p>

                  <p className="font-semibold">

                    {lookupData.droppingPointName}

                  </p>

                </div>

              </div>


            </div>


            {/* Passengers */}

            <div className="p-6">


              <h3 className="font-bold text-lg mb-4">

                Select Passengers

              </h3>


              <div className="space-y-3">


                {lookupData.passengers?.map(
                  (passenger, index) => {

                    const active =
                      isSeatActive(
                        passenger.seatName
                      );


                    const checked =
                      selectedSeats.includes(
                        String(
                          passenger.seatName
                        )
                      );


                    return (

                      <div

                        key={
                          passenger.seatName ||
                          index
                        }

                        onClick={() => {

                          if (active) {

                            toggleSeat(
                              passenger.seatName
                            );

                          }

                        }}

                        className={`
                          border
                          rounded-xl
                          p-4
                          transition

                          ${!active

                            ? "bg-gray-100 opacity-60 cursor-not-allowed"

                            : checked

                              ? "border-red-500 bg-red-50 cursor-pointer"

                              : "border-gray-200 hover:border-red-400 cursor-pointer"

                          }
                        `}

                      >


                        <div className="flex justify-between items-center">


                          <div className="flex gap-3">


                            <div className="
                              w-10
                              h-10
                              rounded-full
                              bg-red-100
                              flex
                              items-center
                              justify-center
                            ">

                              <User
                                size={20}
                                className="text-red-600"
                              />

                            </div>


                            <div>


                              <p className="font-bold">

                                {passenger.name}

                              </p>


                              <div className="flex gap-3 text-sm text-gray-500 mt-1">


                                <span className="flex items-center gap-1">

                                  <Armchair size={14} />

                                  Seat {passenger.seatName}

                                </span>


                                <span>

                                  Age {passenger.age}

                                </span>


                                <span>

                                  {passenger.gender}

                                </span>


                              </div>


                              {!active && (

                                <p className="text-red-500 text-xs mt-2">

                                  Already Cancelled

                                </p>

                              )}


                            </div>


                          </div>


                          {active && (

                            <input

                              type="checkbox"

                              checked={checked}

                              onClick={(e) =>
                                e.stopPropagation()
                              }

                              onChange={() =>
                                toggleSeat(
                                  passenger.seatName
                                )
                              }

                              className="w-5 h-5 accent-red-600"

                            />

                          )}


                        </div>


                      </div>

                    );

                  }
                )}


              </div>


              {/* Error */}

              {error && (

                <div className="bg-red-100 text-red-600 rounded-lg p-3 mt-5">

                  {error}

                </div>

              )}


              {/* Continue */}

              <button

                type="button"

                onClick={handleContinue}

                disabled={
                  selectedSeats.length === 0 ||
                  policyLoading
                }

                className={`
                  mt-6
                  w-full
                  rounded-lg
                  p-3
                  font-semibold
                  text-white
                  flex
                  justify-center
                  items-center
                  gap-2

                  ${selectedSeats.length === 0

                    ? "bg-gray-400 cursor-not-allowed"

                    : "bg-red-600 hover:bg-red-700"

                  }
                `}

              >

                {policyLoading ? (

                  <>

                    <Loader2
                      className="animate-spin"
                      size={20}
                    />

                    Checking Refund...

                  </>

                ) : (

                  `Continue (${selectedSeats.length})`

                )}

              </button>


            </div>


          </div>

        )}


      </div>


      {/* =====================================================
          CONFIRMATION MODAL
          ===================================================== */}

      {showConfirmModal && policyData && (

        <div className="
          fixed
          inset-0
          bg-black/40
          flex
          items-center
          justify-center
          z-50
          px-4
        ">


          <div className="
            bg-white
            rounded-xl
            p-6
            md:p-8
            w-full
            max-w-md
          ">


            <h2 className="text-2xl font-bold mb-6">

              Confirm Cancellation

            </h2>


            <div className="space-y-4">


              <p>

                <strong>Ticket:</strong>{" "}

                {lookupData.tin}

              </p>


              <p>

                <strong>Seats:</strong>{" "}

                {selectedSeats.join(", ")}

              </p>


              <div className="border-t pt-4">


                <p className="text-sm text-gray-500">

                  Refund Percentage

                </p>


                <p className="font-bold text-lg">

                  {policyData.percentage || 0}%

                </p>


              </div>


              <div className="grid grid-cols-2 gap-4">


                <div className="bg-green-50 p-4 rounded-lg">


                  <p className="text-sm text-gray-600">

                    Refund

                  </p>


                  <p className="text-green-600 font-bold text-xl">

                    ₹{totalRefund.toFixed(2)}

                  </p>


                </div>


                <div className="bg-red-50 p-4 rounded-lg">


                  <p className="text-sm text-gray-600">

                    Charge

                  </p>


                  <p className="text-red-600 font-bold text-xl">

                    ₹{totalCancellationCharge.toFixed(2)}

                  </p>


                </div>


              </div>


            </div>


            <div className="flex gap-4 mt-8">


              <button

                type="button"

                onClick={() =>
                  setShowConfirmModal(false)
                }

                disabled={cancelLoading}

                className="
                  flex-1
                  border
                  rounded-lg
                  p-3
                "

              >

                Back

              </button>


              <button

                type="button"

                onClick={handleCancelTicket}

                disabled={cancelLoading}

                className="
                  flex-1
                  bg-red-600
                  hover:bg-red-700
                  disabled:bg-gray-400
                  text-white
                  rounded-lg
                  p-3
                  flex
                  justify-center
                  items-center
                  gap-2
                "

              >

                {cancelLoading ? (

                  <>

                    <Loader2
                      className="animate-spin"
                      size={18}
                    />

                    Cancelling...

                  </>

                ) : (

                  "Cancel Ticket"

                )}

              </button>


            </div>


          </div>


        </div>

      )}


      {/* =====================================================
          SUCCESS MODAL
          ===================================================== */}

      {cancelSuccess && (

        <div className="
          fixed
          inset-0
          bg-black/40
          flex
          items-center
          justify-center
          z-50
          px-4
        ">


          <div className="
            bg-white
            rounded-xl
            p-8
            w-full
            max-w-md
            text-center
          ">


            <CheckCircle2

              size={64}

              className="
                text-green-600
                mx-auto
                mb-4
              "

            />


            <h2 className="
              text-2xl
              font-bold
              text-green-600
            ">

              Ticket Cancelled

            </h2>


            <p className="text-gray-500 mt-2">

              Your selected seat(s) have been cancelled successfully.

            </p>


            <div className="
              mt-6
              text-left
              bg-gray-50
              rounded-lg
              p-4
              space-y-3
            ">


              <p>

                <strong>TIN:</strong>{" "}

                {cancelSuccess.tin}

              </p>


              <p>

                <strong>Cancelled Seats:</strong>{" "}

                {Array.isArray(
                  cancelSuccess.cancelledSeats
                )

                  ? cancelSuccess.cancelledSeats.join(
                    ", "
                  )

                  : selectedSeats.join(", ")

                }

              </p>


              <p>

                <strong>Booking Status:</strong>{" "}

                {cancelSuccess.bookingStatus}

              </p>


              <p>

                <strong>Refund:</strong>{" "}

                <span className="text-green-600 font-bold">

                  ₹
                  {Number(
                    cancelSuccess.refundAmount ||
                    totalRefund
                  ).toFixed(2)}

                </span>

              </p>


              <p>

                <strong>Cancellation Charge:</strong>{" "}

                <span className="text-red-600 font-bold">

                  ₹
                  {Number(
                    cancelSuccess.cancellationCharge ||
                    totalCancellationCharge
                  ).toFixed(2)}

                </span>

              </p>


            </div>


            <button

              type="button"

              onClick={handleDone}

              className="
                mt-8
                bg-red-600
                hover:bg-red-700
                text-white
                rounded-lg
                p-3
                w-full
                font-semibold
              "

            >

              Done

            </button>


          </div>


        </div>

      )}


    </div>

  );

}


export default CancelBooking;