import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

function PaymentPage() {
    const navigate = useNavigate();
    const [bookingData, setBookingData] = useState(null);

    useEffect(() => {
        try {
            const data = JSON.parse(localStorage.getItem('bookingData'));
            if (data) {
                setBookingData(data);
                console.log('Booking data loaded:', data);
            } else {
                console.log('No booking data in localStorage');
            }
        } catch (error) {
            console.error('Error parsing booking data:', error);
        }
    }, []);

    if (!bookingData) {
        return <div className="p-10 text-center">No booking data found</div>;
    }

    const { selectedSeats = [], boardingPoint = {}, droppingPoint = {}, totalPrice = 0, passengers = [] } = bookingData;
    
    const boarding = typeof boardingPoint === 'object' ? boardingPoint?.name || "N/A" : boardingPoint || "N/A";
    const dropping = typeof droppingPoint === 'object' ? droppingPoint?.name || "N/A" : droppingPoint || "N/A";

    return (
        
        <div className="bg-gray-100 min-h-screen p-6">
            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">

                {/* LEFT SIDE */}
                <div className="md:col-span-2 space-y-4">

                    {/* OFFER BOX */}
                    <div className="bg-white p-5 rounded-xl shadow">
                        <h2 className="font-semibold text-lg mb-2">
                            Payment Options
                        </h2>
                        <p className="text-gray-500 text-sm">
                            Choose your preferred payment method
                        </p>
                    </div>

                    {/* PAYMENT METHODS */}
                    <div className="bg-white p-5 rounded-xl shadow space-y-4">

                        <div className="border p-4 rounded-lg flex justify-between items-center">
                            <p>UPI (Google Pay / PhonePe)</p>
                            <input type="radio" name="payment" />
                        </div>

                        <div className="border p-4 rounded-lg flex justify-between items-center">
                            <p>Credit / Debit Card</p>
                            <span>›</span>
                        </div>

                        <div className="border p-4 rounded-lg flex justify-between items-center">
                            <p>Net Banking</p>
                            <span>›</span>
                        </div>

                    </div>
                </div>

                {/* RIGHT SIDE */}
                <div className="bg-white p-5 rounded-xl shadow h-fit">

                    <h2 className="font-semibold text-lg mb-4">
                        Fare Summary
                    </h2>

                    {/* SEATS */}
                    <div className="flex justify-between mb-2">
                        <span>Seats</span>
                        <span>{selectedSeats.length}</span>
                    </div>

                    {/* PRICE */}
                    <div className="flex justify-between mb-2">
                        <span>Total Fare</span>
                        <span>₹{totalPrice}</span>
                    </div>

                    <hr className="my-3" />

                    {/* TOTAL */}
                    <div className="flex justify-between font-bold text-lg">
                        <span>Total</span>
                        <span>₹{totalPrice}</span>
                    </div>

                    {/* PASSENGERS */}
                    <div className="mt-5">
                        <h3 className="font-semibold mb-2">Passengers</h3>

                        {passengers.length > 0 ? (
                            passengers.map((p, i) => (
                                <div key={i} className="text-sm mb-2">
                                    {p?.name || "No Name"} ({p?.gender || "-"}) -{" "}
                                    {p?.age || "-"} yrs
                                </div>
                            ))
                        ) : (
                            <p className="text-sm text-gray-500">
                                No passenger data available
                            </p>
                        )}
                    </div>

                    {/* BOARDING */}
                    <div className="mt-5 text-sm">
                        <p><b>From:</b> {boarding}</p>
                        <p><b>To:</b> {dropping}</p>
                    </div>

                    {/* BUTTONS */}
                    <button className="w-full mt-6 bg-red-500 text-white py-3 rounded-lg">
                        Pay ₹{totalPrice}
                    </button>

                    <button
                        onClick={() => navigate("/search")}
                        className="w-full mt-3 border py-2 rounded-lg"
                    >
                        Go Back
                    </button>

                </div>

            </div>
        </div>
    );
}

export default PaymentPage;