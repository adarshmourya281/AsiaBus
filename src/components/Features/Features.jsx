import easy from "../../assets/easy.png";
import support from "../../assets/support.png";
import payment from "../../assets/payment.png";
import cancel from "../../assets/cancel.png";

function Features() {
  const features = [
    {
      title: "Easy Booking",
      img: easy,
      bg: "bg-blue-50",
      iconBg: "bg-blue-100",
      text: "text-blue-600",
    },
    {
      title: "Customer Support",
      img: support,
      bg: "bg-green-50",
      iconBg: "bg-green-100",
      text: "text-green-600",
    },
    {
      title: "Secure Payment",
      img: payment,
      bg: "bg-purple-50",
      iconBg: "bg-purple-100",
      text: "text-purple-600",
    },
    {
      title: "Ticket Cancellation",
      img: cancel,
      bg: "bg-red-50",
      iconBg: "bg-red-100",
      text: "text-red-500",
    },
  ];

  return (
    <section className="w-full py-12 md:py-16 bg-gray-50">
      
      {/* Title */}
      <h2 className="text-center text-lg md:text-2xl font-semibold text-blue-500 mb-8">
        Why Book With Us?
      </h2>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 px-5 md:px-12 lg:px-20">
        
        {features.map((item, index) => (
          <div
            key={index}
            className={`${item.bg} p-6 rounded-xl text-center border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-2 transition duration-300`}
          >
            
            {/* Icon */}
            <div className={`w-16 h-16 mx-auto mb-4 flex items-center justify-center rounded-full ${item.iconBg}`}>
              <img
                src={item.img}
                alt={item.title}
                className="w-9 h-9 object-contain"
              />
            </div>

            {/* Title */}
            <p className={`text-sm md:text-base font-semibold ${item.text}`}>
              {item.title}
            </p>

          </div>
        ))}

      </div>
    </section>
  );
}

export default Features;