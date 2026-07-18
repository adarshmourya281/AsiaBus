import { useState } from "react";
import SignUpModal from "./SignUpModal";
import { loginUser } from "../../services/authService";

function LoginModal({ closeModal, onSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showSignUp, setShowSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    try {
      setError("");
      setLoading(true);

      const payload = {
        email,
        password
      };

      const data = await loginUser(payload);

      console.log("Login Response:", data);

      if (data.status === "success") {
        localStorage.setItem("token", data.data.token);

        // Call onSuccess callback to refresh profile in Navbar
        if (onSuccess) {
          onSuccess();
        }

        setEmail("");
        setPassword("");
      }
    } catch (error) {
      console.log(error);

      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Login Failed";

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setEmail("");
    setPassword("");
    setError("");
    closeModal();
  };

  if (showSignUp) {
    return (
      <SignUpModal
        closeModal={() => setShowSignUp(false)}
        onSuccess={onSuccess}
      />
    );
  }

  return (
    <>
      {/* Login Modal */}
      <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/50 px-4">
        <div className="bg-white text-black rounded-2xl w-full max-w-md p-6 relative shadow-2xl animate-in fade-in scale-in">
          {/* Close */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 text-gray-600 hover:text-black text-2xl"
          >
            ✕
          </button>

          {/* Title */}
          <h2 className="text-2xl font-semibold mb-1 text-black">
            Login to AsiaBus
          </h2>
          <p className="text-sm text-gray-600 mb-5">
            Enter your credentials to continue
          </p>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-2 mb-4 text-red-700 text-sm">
              {error}
            </div>
          )}

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
            className="w-full border border-gray-300 text-black rounded-lg px-4 py-3 mb-2 outline-none focus:ring-2 focus:ring-red-400 disabled:bg-gray-100"
          />

          {/* Forgot */}
          <div className="text-right mb-4">
            <span className="text-sm text-red-500 cursor-pointer hover:underline">
              Forgot Password?
            </span>
          </div>

          {/* Login */}
          <button
            onClick={handleLogin}
            disabled={loading || !email || !password}
            className="w-full bg-red-500 hover:bg-red-600 disabled:bg-gray-400 text-white py-3 rounded-lg font-medium mb-4 transition flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Logging in...
              </>
            ) : (
              "Login"
            )}
          </button>

          {/* Signup */}
          <p className="text-center text-sm mb-5 text-black">
            Don't have an account?{" "}
            <span
              className="text-red-500 cursor-pointer hover:underline font-semibold"
              onClick={() => setShowSignUp(true)}
            >
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
          <button
            disabled={loading}
            className="w-full border border-gray-300 py-3 rounded-lg flex items-center justify-center gap-3 hover:bg-gray-100 disabled:opacity-50 transition"
          >
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
    </>
  );
}

export default LoginModal;
