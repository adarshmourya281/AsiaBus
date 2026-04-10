
import { useState, useEffect } from "react";
function BookingPage({ onValidationChange, setPassengers  }) {
  // CONTACT STATE
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [state, setState] = useState("");
  const [whatsapp, setWhatsapp] = useState(true);

  // PASSENGER STATE
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");

  // VALIDATIONS
  const phoneError = phone.length !== 10 || isNaN(phone);
  const stateError = state === "";
  const nameError = name.trim() === "";
  const ageError = Number(age) <= 0;
  const genderError = gender === "";

  const isFormValid =
    !phoneError &&
    !stateError &&
    !nameError &&
    !ageError &&
    !genderError;

  useEffect(() => {
  if (onValidationChange) {
    onValidationChange(isFormValid);
  }

  // ✅ SEND DATA BACK TO MODAL
  if (isFormValid && setPassengers) {
    setPassengers([
      {
        name,
        age,
        gender,
      },
    ]);
  }
}, [isFormValid, name, age, gender, onValidationChange, setPassengers]);

  return (
    <div className="bg-gray-100 min-h-screen p-6">
      <div className="max-w-3xl mx-auto space-y-6">

        {/* ================= CONTACT DETAILS ================= */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-2xl font-bold mb-1">
            Contact details
          </h2>
          <p className="text-gray-500 mb-4">
            Ticket details will be sent to
          </p>

          {/* PHONE */}
          <div className="mb-2">
            <div
              className={`flex border-2 rounded-xl overflow-hidden ${phoneError ? "border-red-500" : "border-gray-300"
                }`}
            >
              <div className="px-4 py-3 bg-gray-50 border-r">
                <p className="text-xs text-gray-500">Country Code</p>
                <p className="font-semibold">+91 (IND)</p>
              </div>

              <input
                type="text"
                placeholder="Phone *"
                className="flex-1 px-4 outline-none"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>

            {phoneError && (
              <p className="text-red-500 text-sm mt-1">
                Please enter valid phone number
              </p>
            )}
          </div>

          {/* EMAIL */}
          <input
            type="email"
            placeholder="Email ID"
            className="w-full border rounded-xl px-4 py-3 mb-4"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          {/* STATE */}
          <select
            className={`w-full border-2 rounded-xl px-4 py-3 ${stateError ? "border-red-500" : "border-gray-300"
              }`}
            value={state}
            onChange={(e) => setState(e.target.value)}
          >
            <option value="">State of Residence *</option>
            <option>Uttar Pradesh</option>
            <option>Maharashtra</option>
            <option>Delhi</option>
          </select>

          <p className="text-red-500 text-sm mt-2 mb-4">
            Required for GST Tax Invoicing
          </p>

          {/* WHATSAPP */}
          <div className="flex items-center justify-between">
            <p>Send booking details on WhatsApp</p>

            <div
              onClick={() => setWhatsapp(!whatsapp)}
              className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer ${whatsapp ? "bg-red-500" : "bg-gray-300"
                }`}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full transform duration-300 ${whatsapp ? "translate-x-6" : ""
                  }`}
              />
            </div>
          </div>
        </div>

        {/* ================= PASSENGER DETAILS ================= */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-2xl font-bold mb-4">
            Passenger details
          </h2>

          {/* LOGIN BAR */}
          <div className="bg-red-100 text-center py-3 rounded-full mb-5">
            Login to view saved passengers list
          </div>

          {/* HEADER */}
          <div className="flex items-center gap-3 mb-4 border-b pb-3">
            <div className="bg-gray-200 p-3 rounded-full">👤</div>
            <div>
              <p className="font-semibold">Passenger 1</p>
              <p className="text-gray-500 text-sm">
                Seat U3, Upper Deck
              </p>
            </div>
          </div>

          {/* NAME */}
          <div className="mb-3">
            <input
              type="text"
              placeholder="Name *"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`w-full px-4 py-3 rounded-xl border-2 ${nameError ? "border-red-500" : "border-gray-300"
                }`}
            />
            {nameError && (
              <p className="text-red-500 text-sm mt-1">
                Please enter valid Name
              </p>
            )}
          </div>

          {/* AGE */}
          <div className="mb-4">
            <input
              type="number"
              placeholder="Age *"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              className={`w-full px-4 py-3 rounded-xl border-2 ${ageError ? "border-red-500" : "border-gray-300"
                }`}
            />
            {ageError && (
              <p className="text-red-500 text-sm mt-1">
                Please enter valid Age
              </p>
            )}
          </div>

          {/* GENDER */}
          <p className="mb-2">
            Gender <span className="text-red-500">*</span>
          </p>

          <div className="flex gap-4">
            <div
              onClick={() => setGender("male")}
              className={`flex-1 border-2 rounded-full px-5 py-3 flex justify-between cursor-pointer ${gender === "male"
                  ? "border-red-500"
                  : "border-gray-300"
                }`}
            >
              Male
            </div>

            <div
              onClick={() => setGender("female")}
              className={`flex-1 border-2 rounded-full px-5 py-3 flex justify-between cursor-pointer ${gender === "female"
                  ? "border-red-500"
                  : "border-gray-300"
                }`}
            >
              Female
            </div>
          </div>

          {genderError && (
            <p className="text-red-500 text-sm mt-2">
              Please select valid gender
            </p>
          )}
        </div>


      </div>
    </div>
  );
}

export default BookingPage;