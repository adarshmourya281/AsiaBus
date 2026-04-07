function AboutAsiaBus() {
  return (
    <div className="w-full bg-gray-50 px-4 md:px-10 lg:px-20 py-12">

      {/* Title */}
      
        <h2 className="text-lg md:text-2xl font-semibold text-blue-500 mb-8">

        About AsiaBus
      </h2>

      {/* Content */}
      <p className="text-gray-600 text-sm md:text-base leading-7 mb-5">
        AsiaBus is your trusted travel partner, making bus booking simple,
        fast, and reliable across India and Asia. We aim to provide a seamless
        booking experience with a wide network of routes, ensuring comfort and
        affordability for every traveler.
      </p>

      <p className="text-gray-600 text-sm md:text-base leading-7 mb-5">
        With a growing network of bus operators and routes, AsiaBus connects
        thousands of cities, offering multiple travel options to suit your
        schedule. Our platform focuses on user-friendly design, secure payments,
        and real-time booking updates to enhance your journey.
      </p>

      <p className="text-gray-600 text-sm md:text-base leading-7 mb-5">
        We are committed to innovation by integrating modern technology,
        improving customer support, and continuously enhancing our services to
        deliver the best travel experience.
      </p>

      {/* Link */}
      <span className="text-red-500 cursor-pointer hover:underline text-sm md:text-base">
        Know more about AsiaBus →
      </span>

    </div>
  );
}

export default AboutAsiaBus;