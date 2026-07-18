import { useState } from "react";
import LoginModal from "./LoginModal";
import { registerUser } from "../../services/authService";

function SignUpModal({ closeModal, onSuccess }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mobile, setMobile] = useState("");
  const [showLogin, setShowLogin] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSignUp = async () => {
    try {
      setError("");
      setLoading(true);

      const payload = {
        name,
        email,
        password,
        mobile,
      };

      const data = await registerUser(payload);

      console.log("Register Response:", data);

      if (data.status === "success") {
        localStorage.setItem("token", data.data.token);

        // Call onSuccess callback to refresh profile in Navbar
        if (onSuccess) {
          onSuccess();
        }

        setName("");
        setEmail("");
        setPassword("");
        setMobile("");
      }
    } catch (error) {
      console.log(error);

      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Registration Failed";

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setName("");
    setEmail("");
    setPassword("");
    setMobile("");
    setError("");
    closeModal();
  };

  if (showLogin) {
    return (
      <LoginModal
        closeModal={() => setShowLogin(false)}
        onSuccess={onSuccess}
      />
    );
  }

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/50 px-4">
      {/* Modal */}
      <div className="bg-white text-black rounded-2xl w-full max-w-md p-6 relative shadow-2xl animate-in fade-in scale-in">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-600 hover:text-black text-2xl"
        >
          ✕
        </button>

        {/* Title */}
        <h2 className="text-2xl font-semibold mb-1 text-black">
          Sign Up for AsiaBus
        </h2>
        <p className="text-sm text-gray-600 mb-5">
          Create your account to book tickets
        </p>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-2 mb-4 text-red-700 text-sm">
            {error}
          </div>
        )}

        {/* Name */}
        <input
          type="text"
          placeholder="Enter Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={loading}
          className="w-full border border-gray-300 text-black rounded-lg px-4 py-3 mb-4 outline-none focus:ring-2 focus:ring-red-400 disabled:bg-gray-100"
        />

        {/* Email */}
        <input
          type="email"
          placeholder="Enter Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading}
          className="w-full border border-gray-300 text-black rounded-lg px-4 py-3 mb-4 outline-none focus:ring-2 focus:ring-red-400 disabled:bg-gray-100"
        />

        {/* Password */}
        <input
          type="password"
          placeholder="Enter Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={loading}
          className="w-full border border-gray-300 text-black rounded-lg px-4 py-3 mb-4 outline-none focus:ring-2 focus:ring-red-400 disabled:bg-gray-100"
        />

        {/* Mobile Number */}
        <input
          type="tel"
          placeholder="Enter Mobile Number"
          value={mobile}
          onChange={(e) => setMobile(e.target.value)}
          disabled={loading}
          className="w-full border border-gray-300 text-black rounded-lg px-4 py-3 mb-4 outline-none focus:ring-2 focus:ring-red-400 disabled:bg-gray-100"
        />

        {/* Sign Up Button */}
        <button
          onClick={handleSignUp}
          disabled={loading || !name || !email || !password || !mobile}
          className="w-full bg-red-500 hover:bg-red-600 disabled:bg-gray-400 text-white py-3 rounded-lg font-medium mb-4 transition flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Signing up...
            </>
          ) : (
            "Sign Up"
          )}
        </button>

        {/* Login Link */}
        <p className="text-center text-sm text-black">
          Already have an account?{" "}
          <span
            className="text-red-500 cursor-pointer hover:underline font-semibold"
            onClick={() => setShowLogin(true)}
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
}

export default SignUpModal;
