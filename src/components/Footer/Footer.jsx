import { FaFacebookF, FaInstagram, FaYoutube, FaTwitter } from "react-icons/fa";
import logo from "../../assets/logo2.png";
function Footer() {
  return (
    <footer className="bg-gray-400 text-gray-300 mt-12">
      
      <div className="max-w-7xl mx-auto px-6 py-2 flex flex-col md:flex-row items-center justify-between gap-4">

        {/* LEFT - LOGO + COPYRIGHT */}
        <div className="flex items-center gap-3 text-center md:text-left">

          
            <a href="/" className="py-2 px-2">
            <img 
              src={logo} 
              alt="AsiaBus Logo" 
              className="h-11 md:h-13 cursor-pointer"
            />
          </a>
          <span className="text-gray-500 text-sm">
            © 2026 All rights reserved
          </span>
        </div>

        {/* CENTER - LINKS */}
        <div className="flex flex-wrap justify-center gap-4 text-sm">
          <a href="#" className="hover:text-white transition">About</a>
          <a href="#" className="hover:text-white transition">Terms</a>
          <a href="#" className="hover:text-white transition">Privacy</a>
          <a href="#" className="hover:text-white transition">Support</a>
        </div>

        {/* RIGHT - SOCIAL ICONS */}
        <div className="flex gap-3">
          <a href="#" className="p-2 bg-gray-800 rounded-full hover:bg-blue-600 transition">
            <FaFacebookF size={14} />
          </a>
          <a href="#" className="p-2 bg-gray-800 rounded-full hover:bg-pink-500 transition">
            <FaInstagram size={14} />
          </a>
          <a href="#" className="p-2 bg-gray-800 rounded-full hover:bg-red-600 transition">
            <FaYoutube size={14} />
          </a>
          <a href="#" className="p-2 bg-gray-800 rounded-full hover:bg-sky-500 transition">
            <FaTwitter size={14} />
          </a>
        </div>

      </div>
    </footer>
  );
}

export default Footer;
