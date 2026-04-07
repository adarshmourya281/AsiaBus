import { useRef } from "react";

// 👉 import your images
import offer1 from "../../assets/offer.png";
import offer2 from "../../assets/offer.png";
import offer3 from "../../assets/offer.png";
import offer4 from "../../assets/offer.png";

function Offers() {
  const scrollRef = useRef();

  const scroll = (direction) => {
    const { current } = scrollRef;
    if (direction === "left") {
      current.scrollBy({ left: -300, behavior: "smooth" });
    } else {
      current.scrollBy({ left: 300, behavior: "smooth" });
    }
  };

  const offers = [
  {
    title: "Save ₹300 on First Booking",
    code: "ASIAFIRST",
    img: offer1,
    bg: "bg-red-50",
  },
  {
    title: "Flat 20% OFF on Weekend",
    code: "WEEKEND20",
    img: offer2,
    bg: "bg-orange-50",
  },
  {
    title: "Get ₹200 Cashback",
    code: "UPI200",
    img: offer3,
    bg: "bg-purple-50",
  },
  {
    title: "Student Special Discount",
    code: "STUDENT15",
    img: offer4,
    bg: "bg-blue-50",
  },
];

  return (
    <div className="w-full px-4 md:px-10 lg:px-20 py-10 relative">

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl md:text-2xl font-semibold text-blue-500">
          Bus Booking Offers
        </h2>
        <span className="text-red-500 cursor-pointer">
          View All →
        </span>
      </div>

      {/* Left Arrow */}
      <button
        onClick={() => scroll("left")}
        className="hidden md:flex absolute left-4 top-[55%] z-10 bg-white shadow-md w-10 h-10 rounded-full items-center justify-center"
      >
        ◀
      </button>

      {/* Right Arrow */}
      <button
        onClick={() => scroll("right")}
        className="hidden md:flex absolute right-4 top-[55%] z-10 bg-white shadow-md w-10 h-10 rounded-full items-center justify-center"
      >
        ▶
      </button>

      {/* Cards */}
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto scroll-smooth scrollbar-hide"
      >
       {offers.map((offer, index) => (
  <div
    key={index}
    className={`relative min-w-[260px] md:min-w-[320px] flex-shrink-0 ${offer.bg} rounded-xl shadow-md p-5 overflow-hidden`}
  >
    <h3 className="font-semibold text-sm md:text-base mb-2">
      {offer.title}
    </h3>

    <p className="text-xs text-gray-600 mb-4">
      Use code while booking
    </p>

    <div className="flex justify-between items-center">
      <span className="bg-white px-3 py-1 rounded-md text-sm font-medium shadow">
        {offer.code}
      </span>
      <span className="text-red-500 cursor-pointer">→</span>
    </div>

    {/* Image */}
    <img
      src={offer.img}
      alt="offer"
      className="absolute bottom-2 right-2 w-16 md:w-20 opacity-90"
    />
  </div>
))}
      </div>
    </div>
  );
}

export default Offers;