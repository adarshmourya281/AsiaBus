
import { useState, useEffect } from "react";
import { getProfile } from "../../services/authService";
import { User, Phone, Mail } from "lucide-react";

function Passenger({ trip, selectedSeats, onValidationChange, setPassengers }) {
  // PROFILE STATE
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(false);

  // CONTACT STATE
  const [contactPhone, setContactPhone] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactName, setContactName] = useState("");

  // PASSENGERS STATE
  const [passengers, setPassengersState] = useState([]);

  // LOAD PROFILE
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        if (!token) {
          setLoading(false);
          return;
        }

        const profile = await getProfile();
        console.log("Profile data received:", profile);
        
        if (profile) {
          // Handle the correct API response structure: data.user
          const profileInfo = profile?.data?.user || profile?.user || profile?.data || profile;
          setProfileData(profileInfo);
          setContactName(profileInfo?.name || "");
          setContactPhone(profileInfo?.mobile || "");
          setContactEmail(profileInfo?.email || "");
        }
      } catch (error) {
        console.error("Failed to fetch profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // INITIALIZE PASSENGERS
  useEffect(() => {
    if (selectedSeats && selectedSeats.length > 0) {
      const initialPassengers = selectedSeats.map((seat, index) => ({
        seatIndex: index,
        seatName: seat.name || "",
        seatFare: seat.fare || 0,
        name: (index === 0 && profileData?.name) ? profileData.name : "",
        age: "",
        gender: "",
        idType: "",
        idNumber: "",
        mobile: contactPhone || "",
        email: contactEmail || "",
        primary: index === 0 ? "true" : "false",
      }));

      setPassengersState(initialPassengers);
    }
  }, [selectedSeats, profileData]);

  // VALIDATION
  const validateContact = () => {
    return (
      contactName?.trim() !== "" &&
      contactPhone?.length === 10 &&
      !isNaN(contactPhone) &&
      contactEmail?.includes("@")
    );
  };

  const validatePassenger = (passenger) => {
    return (
      passenger?.name?.trim?.() !== "" &&
      Number(passenger?.age) > 0 &&
      Number(passenger?.age) <= 120 &&
      passenger?.gender !== ""
    );
  };

  const isFormValid =
    validateContact() &&
    passengers.length > 0 &&
    passengers.every((p) => validatePassenger(p));

  // UPDATE PASSENGER
  const updatePassenger = (index, field, value) => {
    const updated = [...passengers];
    updated[index] = { ...updated[index], [field]: value };
    setPassengersState(updated);
  };

  // BUILD INVENTORY ITEMS
  const buildInventoryItems = () => {
    return passengers.map((p) => ({
      seatName: p.seatName || "",
      fare: Number(p.seatFare) || 0,
      passenger: {
        name: p.name || "",
        age: Number(p.age) || 0,
        gender: p.gender === "male" ? "M" : p.gender === "female" ? "F" : "O",
        mobile: contactPhone || "",
        email: contactEmail || "",
        primary: p.primary,
        idType: p.idType || "",
        idNumber: p.idNumber || "",
      },
    }));
  };

  // SEND DATA TO MODAL
  useEffect(() => {
    if (onValidationChange) {
      onValidationChange(isFormValid);
    }

    if (isFormValid && setPassengers) {
      setPassengers(buildInventoryItems());
    }
  }, [isFormValid, passengers, contactPhone, contactEmail, onValidationChange, setPassengers]);

  const contactPhoneError = (contactPhone?.length || 0) !== 10 || isNaN(contactPhone);
  const contactEmailError = !(contactEmail?.includes("@"));
  const contactNameError = !contactName?.trim();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1.8fr_320px] gap-3 sm:gap-4 md:gap-4">
      {/* LEFT SIDE - DETAILS */}
      <div className="space-y-3 sm:space-y-4">
        
        {/* CONTACT DETAILS CARD */}
        <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-100 p-4 sm:p-5 md:p-6 ">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Phone size={20} className="text-red-500" />
              <h2 className="text-lg sm:text-xl font-bold">Contact Details</h2>
            </div>
            {profileData && (
              <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                From Profile
              </span>
            )}
          </div>
          <p className="text-xs sm:text-sm text-gray-600 mb-4">
            {profileData ? "Pre-filled from your profile. You can edit these details." : "Enter your contact details"}
          </p>

          {/* NAME */}
          <div className="mb-3">
            <label className="block text-sm font-semibold mb-1">Full Name *</label>
            <input
              type="text"
              placeholder="Enter your name"
              value={contactName || ""}
              onChange={(e) => setContactName(e.target.value)}
              className={`w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg border-2 text-sm sm:text-base ${
                contactNameError ? "border-red-500 bg-red-50" : "border-gray-300"
              }`}
            />
            {contactNameError && <p className="text-red-500 text-xs mt-1">Name is required</p>}
          </div>

          {/* PHONE */}
          <div className="mb-3">
            <label className="block text-sm font-semibold mb-1">Mobile Number *</label>
            <div className={`flex border-2 rounded-lg overflow-hidden ${contactPhoneError ? "border-red-500 bg-red-50" : "border-gray-300"}`}>
              <div className="px-3 sm:px-4 py-2 sm:py-3 bg-gray-50 border-r text-xs sm:text-sm font-semibold whitespace-nowrap">
                +91
              </div>
              <input
                type="text"
                placeholder="10-digit number"
                maxLength="10"
                value={contactPhone || ""}
                onChange={(e) => setContactPhone(e.target.value.replace(/\D/g, ""))}
                className="flex-1 px-3 sm:px-4 py-2 sm:py-3 outline-none text-sm sm:text-base"
              />
            </div>
            {contactPhoneError && <p className="text-red-500 text-xs mt-1">Enter valid 10-digit number</p>}
          </div>

          {/* EMAIL */}
          <div className="mb-3">
            <label className="block text-sm font-semibold mb-1">Email Address *</label>
            <input
              type="email"
              placeholder="your@email.com"
              value={contactEmail || ""}
              onChange={(e) => setContactEmail(e.target.value)}
              className={`w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg border-2 text-sm sm:text-base ${
                contactEmailError ? "border-red-500 bg-red-50" : "border-gray-300"
              }`}
            />
            {contactEmailError && <p className="text-red-500 text-xs mt-1">Enter valid email</p>}
          </div>
        </div>

        {/* PASSENGER DETAILS CARDS */}
        <div className="space-y-3 sm:space-y-4">
          {passengers.map((passenger, index) => (
            <div key={index} className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-100 p-4 sm:p-5 md:p-6">
              {/* HEADER */}
              <div className="flex items-center gap-3 mb-4 pb-3 border-b">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-red-400 to-red-600 rounded-full flex items-center justify-center text-white font-bold text-sm sm:text-base">
                  {index + 1}
                </div>
                <div>
                  <p className="font-semibold text-sm sm:text-base">Passenger {index + 1}</p>
                  <p className="text-xs sm:text-sm text-gray-600">Seat {passenger?.seatName || "N/A"}</p>
                </div>
              </div>

              {/* PASSENGER FORM */}
              <div className="space-y-3">
                {/* NAME */}
                <div>
                  <label className="block text-sm font-semibold mb-1">Name *</label>
                  <input
                    type="text"
                    placeholder="Passenger name"
                    value={passenger?.name || ""}
                    onChange={(e) => updatePassenger(index, "name", e.target.value)}
                    className={`w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg border-2 text-sm sm:text-base ${
                      (passenger?.name || "").trim() === "" ? "border-red-300" : "border-gray-300"
                    }`}
                  />
                </div>

                {/* AGE */}
                <div>
                  <label className="block text-sm font-semibold mb-1">Age *</label>
                  <input
                    type="number"
                    placeholder="Age"
                    min="1"
                    max="120"
                    value={passenger?.age || ""}
                    onChange={(e) => updatePassenger(index, "age", e.target.value)}
                    className={`w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg border-2 text-sm sm:text-base ${
                      (passenger?.age === "" || Number(passenger?.age) <= 0) ? "border-red-300" : "border-gray-300"
                    }`}
                  />
                </div>

                {/* GENDER */}
                <div>
                  <label className="block text-sm font-semibold mb-2">Gender *</label>
                  <div className="grid grid-cols-3 gap-2">
                    {["male", "female", "other"].map((genderOption) => (
                      <button
                        key={genderOption}
                        onClick={() => updatePassenger(index, "gender", genderOption)}
                        className={`py-2 px-3 rounded-lg border-2 font-semibold text-xs sm:text-sm transition ${
                          passenger?.gender === genderOption
                            ? "border-red-500 bg-red-50 text-red-700"
                            : "border-gray-300 text-gray-700 hover:border-gray-400"
                        }`}
                      >
                        {genderOption.charAt(0).toUpperCase() + genderOption.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* ID TYPE */}
                <div>
                  <label className="block text-sm font-semibold mb-1">ID Type (Optional)</label>
                  <select
                    value={passenger?.idType || ""}
                    onChange={(e) => updatePassenger(index, "idType", e.target.value)}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg border border-gray-300 text-sm sm:text-base"
                  >
                    <option value="">Select ID Type</option>
                    <option value="aadhaar">Aadhar</option>
                    <option value="passport">Passport</option>
                    <option value="license">Driving License</option>
                    <option value="pan">PAN</option>
                  </select>
                </div>

                {/* ID NUMBER */}
                {passenger?.idType && (
                  <div>
                    <label className="block text-sm font-semibold mb-1">ID Number</label>
                    <input
                      type="text"
                      placeholder="Enter ID number"
                      value={passenger?.idNumber || ""}
                      onChange={(e) => updatePassenger(index, "idNumber", e.target.value)}
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg border border-gray-300 text-sm sm:text-base"
                    />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      
    </div>
  );
}

export default Passenger;