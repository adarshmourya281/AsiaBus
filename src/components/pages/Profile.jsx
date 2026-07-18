import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getProfile } from "../../services/authService";
import { Mail, Phone, User, ArrowLeft } from "lucide-react";

function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/");
          return;
        }

        const response = await getProfile();
        if (response.status === "success" && response.data?.user) {
          setUser(response.data.user);
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
        setError("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-200 rounded-full animate-pulse mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => navigate("/")}
            className="px-6 py-2 bg-[#DE3826] text-white rounded-lg hover:bg-red-700 transition"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 md:py-12">
      <div className="max-w-2xl mx-auto px-4">
        {/* Header */}
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-[#DE3826] hover:text-red-700 transition mb-6 font-semibold"
        >
          <ArrowLeft size={20} />
          Back to Home
        </button>

        {/* Profile Card */}
        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
          {/* Profile Header */}
          <div className="flex items-center gap-4 mb-8 pb-8 border-b border-gray-200">
            <div className="w-20 h-20 md:w-24 md:h-24 bg-gradient-to-br from-[#DE3826] to-red-700 rounded-full flex items-center justify-center text-white font-bold text-4xl flex-shrink-0">
              {user?.name?.charAt(0).toUpperCase() || "U"}
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                {user?.name || "User"}
              </h1>
              <p className="text-gray-600 text-sm">Account Details</p>
            </div>
          </div>

          {/* Profile Information */}
          <div className="space-y-6">
            {/* Email */}
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-red-50 rounded-lg flex items-center justify-center flex-shrink-0">
                <Mail className="text-[#DE3826]" size={20} />
              </div>
              <div className="min-w-0">
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Email Address
                </label>
                <p className="text-gray-600 break-all">{user?.email || "N/A"}</p>
              </div>
            </div>

            {/* Phone */}
            {user?.mobile && (
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-red-50 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Phone className="text-[#DE3826]" size={20} />
                </div>
                <div className="min-w-0">
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Mobile Number
                  </label>
                  <p className="text-gray-600">{user.mobile}</p>
                </div>
              </div>
            )}

            {/* ID */}
            {user?.id && (
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-red-50 rounded-lg flex items-center justify-center flex-shrink-0">
                  <User className="text-[#DE3826]" size={20} />
                </div>
                <div className="min-w-0">
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    User ID
                  </label>
                  <p className="text-gray-600 text-sm font-mono">{user.id}</p>
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="mt-8 pt-8 border-t border-gray-200">
            <button
              onClick={() => navigate("/track-booking")}
              className="w-full md:w-auto px-6 py-2 bg-[#DE3826] text-white rounded-lg hover:bg-red-700 transition font-semibold"
            >
              View My Bookings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
