import { useState } from "react";
import logo from "../../assets/logo1.png";
import { Eye, EyeOff } from "lucide-react";
import { Link } from "react-router-dom";

export default function ResetPasswordPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  return (
    <div className="min-h-screen bg-white">
      <div className="flex min-h-screen flex-col lg:flex-row">
        {/* Left Side - Form */}
        <div className="w-full lg:w-1/2 p-8! sm:p-12! xl:p-24!">
          <div className="w-full max-w-sm mx-auto">
            <div className="mb-8 text-center">
              <img src={logo} alt="NightPharm Logo" className="w-29 h-24 mx-auto" />
              <h1 className="text-xl font-semibold text-gray-900 mt-4 mb-2">
                Reset Password
              </h1>
              <p className="text-sm text-gray-600">
                Enter a new password for your account.
              </p>
            </div>

            {/* Reset Password Form */}
            <form className="space-y-6">
              {/* New Password Field */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  New Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent pr-10"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Confirm Password Field */}
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Confirm Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent pr-10"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
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