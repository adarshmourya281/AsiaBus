import { useState } from "react";

function LoginModal({ isOpen, onClose }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/50">

      {/* Modal */}
      <div className="bg-white text-black rounded-2xl w-[90%] max-w-md p-6 relative shadow-2xl">

        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-600 hover:text-black text-2xl"
        >
          ✕
        </button>

        {/* Title */}
        <h2 className="text-2xl font-semibold mb-5 text-black">
          Login to AsiaBus
        </h2>

        {/* Email */}
        <input
          type="email"
          placeholder="Enter Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border border-gray-300 text-black rounded-lg px-4 py-3 mb-4 outline-none focus:ring-2 focus:ring-red-400"
        />

        {/* Password */}
        <input
          type="password"
          placeholder="Enter Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border border-gray-300 text-black rounded-lg px-4 py-3 mb-2 outline-none focus:ring-2 focus:ring-red-400"
        />

        {/* Forgot */}
        <div className="text-right mb-4">
          <span className="text-sm text-red-500 cursor-pointer hover:underline">
            Forgot Password?
          </span>
        </div>

        {/* Login */}
        <button className="w-full bg-red-500 hover:bg-red-600 text-white py-3 rounded-lg font-medium mb-4">
          Login
        </button>

        {/* Signup */}
        <p className="text-center text-sm mb-5 text-black">
          Don’t have an account?{" "}
          <span className="text-red-500 cursor-pointer hover:underline">
            Sign Up
          </span>
        </p>

        {/* Divider */}
        <div className="flex items-center gap-3 mb-5">
          <div className="flex-1 h-px bg-gray-300"></div>
          <span className="text-sm text-gray-500">
            Or Continue With
          </span>
          <div className="flex-1 h-px bg-gray-300"></div>
        </div>

        {/* Google */}
        <button className="w-full border border-gray-300 py-3 rounded-lg flex items-center justify-center gap-3 hover:bg-gray-100">
          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            alt="google"
            className="w-5 h-5"
          />
          <span className="text-sm text-black font-medium">
            Continue with Google
          </span>
        </button>

      </div>
    </div>
  );
}

export default LoginModal;