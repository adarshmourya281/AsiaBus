import { useState } from "react";

function SupportModal({ isOpen, onClose }) {
  const [form, setForm] = useState({
    subject: "",
    phone: "",
    email: "",
    message: ""
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      
      <div className="bg-white w-[90%] md:w-[500px] rounded-lg shadow-lg overflow-hidden">
        
        {/* Header */}
        <div className="bg-red-600 text-white px-6 py-4 flex justify-between items-center">
          <h2 className="text-lg font-semibold">Email To Customer Support</h2>
          <button onClick={onClose}>✕</button>
        </div>

        {/* Form */}
        <div className="p-6 flex flex-col gap-4">

          <input
            type="text"
            placeholder="Subject"
            className="border p-3 rounded"
            onChange={(e) => setForm({...form, subject: e.target.value})}
          />

          <input
            type="text"
            placeholder="Enter your phone number"
            className="border p-3 rounded"
            onChange={(e) => setForm({...form, phone: e.target.value})}
          />

          <input
            type="email"
            placeholder="Enter your email-id"
            className="border p-3 rounded"
            onChange={(e) => setForm({...form, email: e.target.value})}
          />

          <textarea
            placeholder="Message (maximum 500 characters)"
            className="border p-3 rounded h-28"
            onChange={(e) => setForm({...form, message: e.target.value})}
          />

          <button className="bg-green-600 text-white py-3 rounded hover:bg-green-700">
            Submit
          </button>

        </div>
      </div>
    </div>
  );
}

export default SupportModal;