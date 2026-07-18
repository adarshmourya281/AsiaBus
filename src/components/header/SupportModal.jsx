import { useState } from "react";

function SupportModal({ closeModal }) {
  const [form, setForm] = useState({
    subject: "",
    phone: "",
    email: "",
    message: ""
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (form.subject && form.phone && form.email && form.message) {
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setForm({ subject: "", phone: "", email: "", message: "" });
        closeModal();
      }, 2000);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 px-4">
      <div className="bg-white w-full md:w-[500px] rounded-lg shadow-lg overflow-hidden animate-in fade-in scale-in">
        
        {/* Header */}
        <div className="bg-red-600 text-white px-6 py-4 flex justify-between items-center">
          <h2 className="text-lg font-semibold">Email To Customer Support</h2>
          <button onClick={closeModal} className="hover:bg-red-700 rounded p-1 transition">
            ✕
          </button>
        </div>

        {/* Success Message */}
        {submitted && (
          <div className="bg-green-50 border border-green-200 p-4 m-4 rounded-lg text-green-700 text-sm">
            ✓ Your message has been sent successfully! We'll get back to you soon.
          </div>
        )}

        {/* Form */}
        <div className="p-6 flex flex-col gap-4">

          <input
            type="text"
            placeholder="Subject"
            value={form.subject}
            onChange={(e) => setForm({...form, subject: e.target.value})}
            disabled={submitted}
            className="border border-gray-300 p-3 rounded outline-none focus:ring-2 focus:ring-red-400 disabled:bg-gray-100"
          />

          <input
            type="text"
            placeholder="Enter your phone number"
            value={form.phone}
            onChange={(e) => setForm({...form, phone: e.target.value})}
            disabled={submitted}
            className="border border-gray-300 p-3 rounded outline-none focus:ring-2 focus:ring-red-400 disabled:bg-gray-100"
          />

          <input
            type="email"
            placeholder="Enter your email-id"
            value={form.email}
            onChange={(e) => setForm({...form, email: e.target.value})}
            disabled={submitted}
            className="border border-gray-300 p-3 rounded outline-none focus:ring-2 focus:ring-red-400 disabled:bg-gray-100"
          />

          <textarea
            placeholder="Message (maximum 500 characters)"
            value={form.message}
            onChange={(e) => setForm({...form, message: e.target.value.slice(0, 500)})}
            disabled={submitted}
            maxLength="500"
            className="border border-gray-300 p-3 rounded h-28 outline-none focus:ring-2 focus:ring-red-400 disabled:bg-gray-100 resize-none"
          />

          <div className="text-xs text-gray-500">
            {form.message.length}/500 characters
          </div>

          <button 
            onClick={handleSubmit}
            disabled={submitted || !form.subject || !form.phone || !form.email || !form.message}
            className="bg-red-600 text-white py-3 rounded hover:bg-red-700 disabled:bg-gray-400 transition font-semibold"
          >
            {submitted ? "Sending..." : "Submit"}
          </button>

        </div>
      </div>
    </div>
  );
}

export default SupportModal;
