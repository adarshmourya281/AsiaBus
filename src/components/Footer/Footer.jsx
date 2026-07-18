import {
  FaFacebookF,
  FaInstagram,
  FaYoutube,
  FaTwitter,
} from "react-icons/fa";
import logo from "../../assets/logo2.png";

function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-8 sm:mt-12 lg:mt-16 w-full overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        
        {/* TOP SECTION */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
          
          {/* LOGO & COPYRIGHT */}
          <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
            <a href="/" className="flex-shrink-0">
              <img
                src={logo}
                alt="AsiaBus Logo"
                className="h-10 sm:h-12 object-contain"
              />
            </a>

            <div>
              <p className="text-white font-semibold text-lg">
                AsiaBus
              </p>
              <p className="text-gray-400 text-sm">
                Your trusted travel partner
              </p>
            </div>
          </div>

          {/* QUICK LINKS */}
          <div className="flex flex-wrap justify-center gap-4 sm:gap-6 text-sm">
            <a
              href="#"
              className="hover:text-white transition duration-200 hover:underline"
            >
              About Us
            </a>

            <a
              href="#"
              className="hover:text-white transition duration-200 hover:underline"
            >
              Terms & Conditions
            </a>

            <a
              href="#"
              className="hover:text-white transition duration-200 hover:underline"
            >
              Privacy Policy
            </a>

            <a
              href="#"
              className="hover:text-white transition duration-200 hover:underline"
            >
              Contact Us
            </a>

            <a
              href="#"
              className="hover:text-white transition duration-200 hover:underline"
            >
              Support
            </a>
          </div>

          {/* SOCIAL ICONS */}
          <div className="flex items-center gap-3">
            <a
              href="#"
              className="p-2.5 bg-gray-800 hover:bg-blue-600 rounded-full transition duration-300 hover:scale-110"
            >
              <FaFacebookF size={16} />
            </a>

            <a
              href="#"
              className="p-2.5 bg-gray-800 hover:bg-pink-600 rounded-full transition duration-300 hover:scale-110"
            >
              <FaInstagram size={16} />
            </a>

            <a
              href="#"
              className="p-2.5 bg-gray-800 hover:bg-red-600 rounded-full transition duration-300 hover:scale-110"
            >
              <FaYoutube size={16} />
            </a>

            <a
              href="#"
              className="p-2.5 bg-gray-800 hover:bg-sky-500 rounded-full transition duration-300 hover:scale-110"
            >
              <FaTwitter size={16} />
            </a>
          </div>
        </div>

        {/* DIVIDER */}
        <div className="border-t border-gray-800 mt-8 pt-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-3 text-center">
            
            <p className="text-sm text-gray-400">
              © {new Date().getFullYear()} AsiaBus. All Rights Reserved.
            </p>


            <p className="text-sm text-gray-400">
              Designed & Developed by{" "}
              <a
                href="https://sanstrojan.com"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-red-400 hover:text-red-300 transition"
              >
                Sanstrojan Solutions Pvt. Ltd.
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;