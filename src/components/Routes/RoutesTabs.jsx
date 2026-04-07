import { useState } from "react";

function RoutesTabs() {
  const [activeTab, setActiveTab] = useState("routes");

  const tabs = [
    { id: "routes", label: "South Asia Buses" },
    { id: "Southeast", label: "Southeast Asia Buses" },
    { id: "EastAsia", label: "East Asia Buses" },
    { id: "services", label: "Top Bus Services" },
    { id: "quick", label: "Quick Links" },
  ];

  const data = {
    routes: [
      "Delhi to Manali Bus",
      "Vijayawada to Hyderabad Bus",
      "Chennai to Madurai Bus",
      "Mumbai to Ahmedabad Bus",
      "Mumbai to Pune Bus",
      "Kathmandu → Pokhara Bus",
      "Kolkata to Digha Bus",
      "Delhi to Jaipur Bus",
      "Colombo to Kandy Bus",
      "Bangalore to Chennai Bus",
      "Hyderabad to Bangalore Bus",
      "Delhi to Dehradun Bus",
      "Jaipur to Udaipur Bus",
      "Varanasi to Prayagraj Bus",
      "Amritsar to Chandigarh Bus",
      "Pune to Goa Bus",
      "Ahmedabad to Udaipur Bus",
      "Lucknow to Delhi Bus",
      "Indore to Bhopal Bus",
      "Kathmandu to Chitwan Bus",
      "Pokhara to Chitwan Bus",
      "Kathmandu to Biratnagar Bus",
      "Colombo to Galle Bus",
      "Colombo to Negombo Bus",
      "Kandy to Nuwara Eliya Bus",
      "Dhaka to Chittagong Bus",
      "Dhaka to Sylhet Bus"

    ],
    Southeast: [
      "Singapore to Kuala Lumpur Bus",
      "Bangkok to Chiang Mai Bus",
      "Hanoi to Sapa Bus",
      "Bangkok to Phuket Bus",
      "Ho Chi Minh City to Phnom Penh Bus",
      "Kuala Lumpur to Penang Bus",
      "Jakarta to Bandung Bus",
      "Bangkok to Siem Reap Bus",
      "Singapore to Malacca Bus",
      "Da Nang to Hue Bus",
      "Bangkok to Krabi Bus",
      "Phnom Penh to Siem Reap Bus",
      "Ho Chi Minh City to Da Nang Bus",
      "Hanoi to Ha Long Bay Bus",
      "Kuala Lumpur to Ipoh Bus",
      "Singapore to Johor Bahru Bus",
      "Chiang Mai to Pai Bus",
      "Jakarta to Yogyakarta Bus",
      "Denpasar to Ubud Bus",
      "Bangkok to Hua Hin Bus",
      "Surabaya to Malang Bus",
      "Kuala Lumpur to Genting Highlands Bus",
      "Penang to Malacca Bus Bus",
      "Phnom Penh to Sihanoukville Bus",
    ],
    EastAsia: [
      "Tokyo to Osaka Bus",
      "Tokyo to Kyoto Bus",
      "Osaka to Kobe Bus",
      "Kyoto to Hiroshima Bus",
      "Seoul to Busan Bus",
      "Seoul to Incheon Bus",
      "Beijing to Shanghai Bus",
      "Shanghai to Hangzhou Bus",
      "Guangzhou to Shenzhen Bus",
      "Nanjing to Suzhou Bus",
      "Almaty to Astana Bus",
      "Almaty to Shymkent Bus",
      "Tashkent to Samarkand Bus",
      "Samarkand to Bukhara Bus",
      "Tashkent to Shymkent Bus",
      "Bishkek to Osh Bus",
      "Bishkek to Almaty Bus",
      "Dushanbe to Khujand Bus",
      "Seoul to Daegu Bus",
      "Tokyo to Nagoya Bus",
      "Harbin to Changchun Bus",
      "Ulaanbaatar to Darkhan Bus"
    ],
    services: [
      "VRL Travels",
      "SRS Travels",
      "KPN Travels",
      "Zing Bus Travels",
      "Orange Travels",
      "Raj Ratan Tours and Travels",
      "Royal Safari Travels",
      "Srinath Travels",
      "Aeroline",
      "Transtar Travel",
      "The Sinh Tourist",
      "Green Bus Thailand",
      "Nakhonchai Air",
      "Giant Ibis Transport",
      "Sapa Express",
      "JR Bus",
      "Willer Express",
      "Korea Express Bus Lines",
      "China Long-Distance Bus",
      "Kazakhstan Intercity Bus",
      "Uzbekistan Bus Services",
      "Kyrgyzstan Marshrutka",
      "SAPTCO",
      "Emirates Express",
      "Karwa Bus",
      "Dubai RTA Bus"
    ],
    quick: [
      "Bus Booking",
      "Bus Tickets",
      "Sleeper Bus",
      "AC Bus",
      "Luxury Bus",
      "Online Booking",
    ],
  };

  return (
    
    <div className="bg-gray-100 py-10 px-4 mt-4 md:mt-6">
    
      <div className="max-w-6xl mx-auto">
       <h2 className="text-center text-lg md:text-2xl font-semibold text-blue-500 mb-8">
      Top Bus Routes Across Asia
       </h2>

        {/* Tabs */}
        <div className="flex flex-wrap gap-4 border-b pb-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-2 text-sm md:text-base ${
                activeTab === tab.id
                  ? "text-red-500 border-b-2 border-red-500 font-semibold"
                  : "text-gray-600 hover:text-red-500"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-6 text-sm text-gray-700">
          {data[activeTab].map((item, index) => (
            <p key={index} className="hover:text-red-500 cursor-pointer">
              {item}
            </p>
          ))}
        </div>

      </div>
    </div>
  );
}

export default RoutesTabs;