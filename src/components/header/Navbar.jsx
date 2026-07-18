import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { getProfile, logoutUser } from "../../services/authService";
import LoginModal from "./LoginModal";
import SupportModal from "./SupportModal";
import logo from "../../assets/logo2.png";
import { ChevronDown, LogOut, User, Bookmark } from "lucide-react";

function Navbar() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [supportOpen, setSupportOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [openLogin, setOpenLogin] = useState(false);
  const [openSupportModal, setOpenSupportModal] = useState(false);

  // Auth states
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const profileDropdownRef = useRef(null);
  const [loginToast, setLoginToast] = useState(false);

  // Auth-guarded navigation for protected links
  const handleMyBookingsClick = (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      setLoginToast(true);
      setTimeout(() => setLoginToast(false), 3000);
      setOpenLogin(true);
    } else {
      window.open("/MyBookings", "_blank");
    }
  };

  // ✅ Check token and fetch profile on mount
  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          setIsAuthenticated(false);
          setUser(null);
          setLoading(false);
          return;
        }

        // Token exists, fetch profile
        const response = await getProfile();

        if (response.status === "success" && response.data?.user) {
          setIsAuthenticated(true);
          setUser(response.data.user);
          setError(null);
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
        // Token might be expired or invalid
        localStorage.removeItem("token");
        setIsAuthenticated(false);
        setUser(null);
        setError("Session expired. Please login again.");
      } finally {
        setLoading(false);
      }
    };

    checkAuthentication();
  }, []);

  // ✅ Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        profileDropdownRef.current &&
        !profileDropdownRef.current.contains(e.target)
      ) {
        setProfileDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ✅ Handle Logout
  const handleLogout = () => {
    try {
      logoutUser();
      setIsAuthenticated(false);
      setUser(null);
      setProfileDropdownOpen(false);
      setError(null);
      navigate("/");
    } catch (err) {
      console.error("Logout error:", err);
      setError("Error logging out");
    }
  };

  // ✅ Handle successful login/signup
  const handleAuthSuccess = () => {
    setOpenLogin(false);
    // Refetch profile after login
    const checkAuth = async () => {
      try {
        const response = await getProfile();
        if (response.status === "success" && response.data?.user) {
          setIsAuthenticated(true);
          setUser(response.data.user);
          setError(null);
        }
      } catch (err) {
        console.error("Error fetching profile after login:", err);
      }
    };
    checkAuth();
  };

  return (
    <header className="w-full bg-white text-[#DE3826] shadow-md relative">
      {/* ================= TOP BAR ================= */}
      <div className="flex items-center justify-between px-4 md:px-8 lg:px-16 h-16 md:h-20">
        {/* ✅ Logo */}
        <a href="/" className="py-2 px-2 flex-shrink-0">
          <img
            src={logo}
            alt="AsiaBus Logo"
            className="h-10 md:h-12 cursor-pointer hover:opacity-80 transition"
          />
        </a>

        {/* ================= DESKTOP MENU ================= */}
        <nav className="hidden md:flex gap-6 lg:gap-8 text-base font-medium items-center flex-1 justify-center">
          <a href="/" className="hover:text-red-600 transition">
            Home
          </a>

          {/* ===== Bookings Dropdown ===== */}
          <div className="relative group">
            <span className="cursor-pointer hover:text-red-600 transition flex items-center gap-1">
              Bookings
            </span>

            <div className="absolute left-0 top-full pt-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition duration-200 z-50">
              <div className="bg-white shadow-xl rounded-xl w-56 text-sm border overflow-hidden">
                <button
                  onClick={handleMyBookingsClick}
                  className="w-full text-left block px-4 py-3 hover:bg-gray-100 transition"
                >
                  📍 My Bookings
                </button>

                <a
                  href="/cancel-booking"
                  target="_blank"
                  className="block px-4 py-3 hover:bg-gray-100 transition"
                >
                  ❌ Cancel Booking
                </a>

                <a
                  href="/print-ticket"
                  target="_blank"
                  className="block px-4 py-3 hover:bg-gray-100 transition"
                >
                  🧾 Print E-Ticket
                </a>
              </div>
            </div>
          </div>

          {/* ===== Customer Support Dropdown ===== */}
          <div className="relative group">
            <span className="cursor-pointer hover:text-red-600 transition">
              Customer Support
            </span>

            <div className="absolute right-0 top-full pt-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition duration-200 z-50">
              <div className="bg-white shadow-xl rounded-xl w-64 text-sm border overflow-hidden">
                <div className="px-4 py-3 hover:bg-gray-100 cursor-pointer transition">
                  📞 +91 9705100555
                </div>

                <div className="px-4 py-3 hover:bg-gray-100 cursor-pointer transition">
                  ☎️ +91 40-23296666
                </div>

                <button
                  onClick={() => setOpenSupportModal(true)}
                  className="w-full text-left px-4 py-3 hover:bg-gray-100 transition"
                >
                  ✉️ Email Us
                </button>
              </div>
            </div>
          </div>
        </nav>

        {/* ================= AUTH SECTION ================= */}
        <div className="flex items-center gap-3 md:gap-4">
          {!loading && !isAuthenticated ? (
            // ✅ Login / Sign Up Buttons (Desktop only)
            <button
              onClick={() => setOpenLogin(true)}
              className="hidden md:inline-block px-3 md:px-6 py-2 bg-[#DE3826] text-white rounded-lg hover:bg-red-700 transition font-semibold text-sm md:text-base whitespace-nowrap"
            >
              Login / Sign Up
            </button>
          ) : loading ? (
            // ✅ Loading State
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
            </div>
          ) : (
            // ✅ Profile Section (Authenticated)
            <div className="relative" ref={profileDropdownRef}>
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-2 px-3 md:px-4 py-2 rounded-lg hover:bg-gray-100 transition group"
              >
                {/* Profile Icon */}
                <div className="w-8 h-8 md:w-9 md:h-9 bg-gradient-to-br from-[#DE3826] to-red-700 rounded-full flex items-center justify-center text-white font-bold text-sm md:text-base flex-shrink-0">
                  {user?.name?.charAt(0).toUpperCase() || "U"}
                </div>

                {/* User Name (Hidden on small screens) */}
                <span className="hidden md:inline text-sm font-semibold text-gray-800 truncate max-w-[120px] group-hover:text-[#DE3826] transition">
                  Hi, {user?.name?.split(" ")[0] || "User"}
                </span>

                {/* Chevron Icon */}
                <ChevronDown
                  size={16}
                  className={`hidden md:inline transition-transform ${profileDropdownOpen ? "rotate-180" : ""
                    }`}
                />
              </button>

              {/* ✅ Profile Dropdown Menu */}
              {profileDropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-72 md:w-80 bg-white shadow-2xl rounded-xl border border-gray-200 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2">
                  {/* Profile Header */}
                  <div className="bg-gradient-to-r from-[#DE3826] to-red-700 p-4 text-white">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-[#DE3826] font-bold text-lg flex-shrink-0">
                        {user?.name?.charAt(0).toUpperCase() || "U"}
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-sm md:text-base truncate">
                          {user?.name || "User"}
                        </p>
                        <p className="text-red-100 text-xs md:text-sm truncate">
                          {user?.email || "No email"}
                        </p>
                      </div>
                    </div>
                    {user?.mobile && (
                      <p className="text-red-100 text-xs md:text-sm">
                        📱 {user.mobile}
                      </p>
                    )}
                  </div>

                  {/* Menu Items */}
                  <div className="py-2">
                    <button
                      onClick={() => {
                        navigate("/profile");
                        setProfileDropdownOpen(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-100 transition text-gray-700 font-medium text-sm md:text-base"
                    >
                      <User size={18} className="text-[#DE3826]" />
                      <span>My Profile</span>
                    </button>

                    <button
                      onClick={() => {
                        navigate("/track-booking");
                        setProfileDropdownOpen(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-100 transition text-gray-700 font-medium text-sm md:text-base"
                    >
                      <Bookmark size={18} className="text-[#DE3826]" />
                      <span>My Bookings</span>
                    </button>

                    <hr className="my-2" />

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-50 transition text-red-600 font-semibold text-sm md:text-base"
                    >
                      <LogOut size={18} />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ================= MOBILE MENU BUTTON ================= */}
          <button
            className="md:hidden text-3xl hover:text-red-600 transition"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            ☰
          </button>
        </div>
      </div>

      {/* ================= MOBILE MENU ================= */}
      {menuOpen && (
        <div className="md:hidden bg-gray-50 border-t border-gray-200 py-4 px-4 animate-in slide-in-from-top">
          <nav className="flex flex-col gap-4">
            <a href="/" className="text-gray-700 hover:text-[#DE3826] transition font-medium">
              Home
            </a>

            {/* Bookings */}
            <button
              onClick={() => setBookingOpen(!bookingOpen)}
              className="text-left text-gray-700 hover:text-[#DE3826] transition font-medium flex items-center justify-between"
            >
              Bookings
              <ChevronDown
                size={18}
                className={`transition-transform ${bookingOpen ? "rotate-180" : ""
                  }`}
              />
            </button>

            {bookingOpen && (
              <div className="pl-4 flex flex-col gap-2">
                <a
                  href="/track-booking"
                  className="text-sm text-gray-600 hover:text-[#DE3826] transition"
                >
                  📍 Track Booking
                </a>
                <a
                  href="/cancel-booking"
                  className="text-sm text-gray-600 hover:text-[#DE3826] transition"
                >
                  ❌ Cancel Booking
                </a>
                <a
                  href="/print-ticket"
                  className="text-sm text-gray-600 hover:text-[#DE3826] transition"
                >
                  🧾 Print E-Ticket
                </a>
              </div>
            )}

            {/* Support */}
            <button
              onClick={() => setSupportOpen(!supportOpen)}
              className="text-left text-gray-700 hover:text-[#DE3826] transition font-medium flex items-center justify-between"
            >
              Customer Support
              <ChevronDown
                size={18}
                className={`transition-transform ${supportOpen ? "rotate-180" : ""
                  }`}
              />
            </button>

            {supportOpen && (
              <div className="pl-4 flex flex-col gap-2">
                <div className="text-sm text-gray-600">📞 +91 9705100555</div>
                <div className="text-sm text-gray-600">☎️ +91 40-23296666</div>
                <button
                  onClick={() => {
                    setOpenSupportModal(true);
                    setSupportOpen(false);
                  }}
                  className="text-sm text-gray-600 hover:text-[#DE3826] transition text-left"
                >
                  ✉️ Email Us
                </button>
              </div>
            )}

            {/* Mobile Auth Section */}
            {!loading && !isAuthenticated && (
              <button
                onClick={() => {
                  setOpenLogin(true);
                  setMenuOpen(false);
                }}
                className="w-full px-4 py-2 bg-[#DE3826] text-white rounded-lg hover:bg-red-700 transition font-semibold mt-4"
              >
                Login / Sign Up
              </button>
            )}

            {!loading && isAuthenticated && (
              <div className="pt-4 border-t border-gray-300">
                <button
                  onClick={() => {
                    navigate("/profile");
                    setMenuOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 text-gray-700 hover:text-[#DE3826] transition font-medium"
                >
                  My Profile
                </button>
                <button
                  onClick={() => {
                    navigate("/track-booking");
                    setMenuOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 text-gray-700 hover:text-[#DE3826] transition font-medium"
                >
                  My Bookings
                </button>
                <button
                  onClick={() => {
                    handleLogout();
                    setMenuOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 transition font-semibold"
                >
                  Sign Out
                </button>
              </div>
            )}
          </nav>
        </div>
      )}

      {/* ================= MODALS ================= */}
      {openLogin && (
        <LoginModal
          closeModal={() => setOpenLogin(false)}
          onSuccess={handleAuthSuccess}
        />
      )}

      {openSupportModal && (
        <SupportModal closeModal={() => setOpenSupportModal(false)} />
      )}

      {/* ================= ERROR NOTIFICATION ================= */}
      {error && (
        <div className="bg-red-50 border-b border-red-200 px-4 md:px-8 lg:px-16 py-2 text-red-700 text-sm md:text-base">
          {error}
        </div>
      )}

      {/* ================= LOGIN REQUIRED TOAST ================= */}
      {loginToast && (
        <div className="fixed top-5 right-5 z-[9999] flex items-center gap-3 bg-white border border-red-200 shadow-2xl rounded-xl px-5 py-4 animate-fade-in">
          <span className="text-2xl">🔒</span>
          <div>
            <p className="font-bold text-gray-900 text-sm">Login Required</p>
            <p className="text-gray-500 text-xs mt-0.5">Please login first to view your bookings.</p>
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;
