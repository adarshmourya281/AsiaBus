import { useState } from "react";
import LoginModal from "./LoginModal";
import SupportModal from "./SupportModal";
import logo from "../../assets/logo2.png";

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [supportOpen, setSupportOpen] = useState(false);
  const [openLogin, setOpenLogin] = useState(false);
  const [openSupportModal, setOpenSupportModal] = useState(false);

  return (
    <header className="w-full bg-white text-[#DE3826] shadow-md relative">

      {/* ================= TOP BAR ================= */}
      <div className="flex items-center justify-between px-6 md:px-12 lg:px-24 h-20">

        {/* ✅ Logo */}
        <a href="/" className="py-2 px-2">
          <img
            src={logo}
            alt="AsiaBus Logo"
            className="h-10 md:h-12 cursor-pointer"
          />
        </a>

        {/* ================= DESKTOP MENU ================= */}
        <nav className="hidden md:flex gap-8 text-base font-medium items-center">

          <a href="/" className="hover:text-red-600">Home</a>

          {/* ===== Bookings Dropdown ===== */}
          <div className="relative group">
            <span className="cursor-pointer hover:text-red-600">
              Bookings
            </span>

            <div className="absolute left-0 top-full pt-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition duration-200 z-50">
              <div className="bg-white shadow-xl rounded-xl w-56 text-sm border overflow-hidden">

                <a href="/track-booking" target="_blank" className="block px-4 py-3 hover:bg-gray-100">
                  📍 Track Booking
                </a>

                <a href="/cancel-booking" target="_blank" className="block px-4 py-3 hover:bg-gray-100">
                  ❌ Cancel Booking
                </a>

                <a href="/print-ticket" target="_blank" className="block px-4 py-3 hover:bg-gray-100">
                  🧾 Print E-Ticket
                </a>

              </div>
            </div>
          </div>

          {/* ===== Customer Support Dropdown ===== */}
          <div className="relative group">
            <span className="cursor-pointer hover:text-red-600">
              Customer Support
            </span>

            <div className="absolute right-0 top-full pt-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition duration-200 z-50">

              <div className="bg-white shadow-xl rounded-xl w-64 text-sm border overflow-hidden">

                <div className="px-4 py-3 hover:bg-gray-100">
                  📞 +91 9705100555
                </div>

                <div className="px-4 py-3 hover:bg-gray-100">
                  ☎️ +91 40-23296666
                </div>

                <button
                  onClick={() => setOpenSupportModal(true)}
                  className="w-full text-left px-4 py-3 hover:bg-gray-100"
                >
                  ✉️ Email Us
                </button>

              </div>
            </div>
          </div>
          {/* ===== Login ===== */}
          <button
            onClick={() => setOpenLogin(true)}
            className="hover:text-red-600"
          >
            Login/SignUp
          </button>
        </nav>

        {/* ================= MOBILE BUTTON ================= */}
        <button
          className="md:hidden text-3xl"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </button>

      </div>

      {/* ================= MOBILE MENU ================= */}
      {menuOpen && (
        <div className="md:hidden flex flex-col gap-5 px-6 pb-6 pt-2 bg-white text-[#DE3826] text-base font-medium">

          <a href="#">Home</a>

          {/* ===== Mobile Bookings ===== */}
          <div>
            <button
              onClick={() => setBookingOpen(!bookingOpen)}
              className="w-full text-left"
            >
              Bookings
            </button>

            {bookingOpen && (
              <div className="pl-4 mt-2 flex flex-col gap-2 text-sm">
                <a href="/track-booking" target="_blank">📍 Track Booking</a>
                <a href="/cancel-booking" target="_blank">❌ Cancel Booking</a>
                <a href="/print-ticket" target="_blank">🧾 Print E-Ticket</a>
              </div>
            )}
          </div>

          {/* ===== Mobile Support ===== */}
          {/* ===== Mobile Support ===== */}
          <div>
            <button
              onClick={() => setSupportOpen(!supportOpen)}
              className="w-full text-left"
            >
              Customer Support
            </button>

            {supportOpen && (
              <div className="pl-4 mt-2 bg-white rounded-xl shadow-md border overflow-hidden text-sm">

                <a
                  href="tel:+919705100555"
                  className="block px-4 py-3 hover:bg-gray-100"
                >
                  📞 +91 9705100555
                </a>

                <a
                  href="tel:+914023296666"
                  className="block px-4 py-3 hover:bg-gray-100"
                >
                  ☎️ +91 40-23296666
                </a>

                <button
                  onClick={() => setOpenSupportModal(true)}
                  className="w-full text-left px-4 py-3 hover:bg-gray-100"
                >
                  ✉️ Email Us
                </button>

              </div>
            )}
          </div>
          <button onClick={() => setOpenLogin(true)}>
            Login/SignUp
          </button>
        </div>
      )}

      {/* ================= MODALS ================= */}
      <LoginModal
        isOpen={openLogin}
        onClose={() => setOpenLogin(false)}
      />

      <SupportModal
        isOpen={openSupportModal}
        onClose={() => setOpenSupportModal(false)}
      />
    </header>
  );
}

export default Header;