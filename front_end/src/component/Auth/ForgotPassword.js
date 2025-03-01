import { useState } from "react";
import logo from "../../assets/logo1.png";
import { Link } from "react-router-dom";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");

  return (
    <div className="min-h-screen bg-white">
      <div className="flex min-h-screen flex-col lg:flex-row">
        {/* Left Side - Form */}
        <div className="w-full lg:w-1/2 p-8! sm:p-12! xl:p-24! ">
          <div className="w-full max-w-sm mx-auto mt-[100px] ">
            <div className="mb-8 text-center">
              <img src={logo} alt="NightPharm Logo" className="w-29 h-24 mx-auto" />
              <h1 className="text-xl font-semibold text-gray-900 mt-4 mb-2">
                Forgot Password
              </h1>
              <p className="text-sm text-gray-600">
                Enter your email to reset your password.
              </p>
            </div>

            {/* Forgot Password Form */}
            <form className="space-y-6">
              {/* Email Field */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Email address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  placeholder="Enter your email"
                  required
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-[#1da684] to-[#31eb97] text-white py-2 px-4 rounded-xl hover:bg-[#1da684] transition-colors"
              >
                Reset Password
              </button>
            </form>

            {/* Back to Login Link */}
            <div className="mt-6 text-center">
              <Link
                to="/"
                className="text-sm text-emerald-500 hover:text-emerald-600 font-medium"
              >
                Back to Login
              </Link>
            </div>
          </div>
        </div>

        {/* Right Side - Background Image */}
        <div className="hidden lg:block lg:w-1/2">
          <div
            className="h-full w-full bg-cover bg-center"
            style={{
              backgroundImage: `url('https://r1.ilikewallpaper.net/iphone-wallpapers/download/83603/photo-of-green-fern-plant-iphone-wallpaper-ilikewallpaper_com.jpg')`,
            }}
          ></div>
        </div>
      </div>
    </div>
  );
}