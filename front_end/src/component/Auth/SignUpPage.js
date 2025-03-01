
import { useState } from "react"
import logo from "../../assets/logo1.png";
import Googel from "../../assets/google-icon-logo.svg"
import { Eye, EyeOff } from "lucide-react"
import { Link } from "react-router-dom";

export default function SignUpPage() {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className="min-h-screen  bg-white ">
      <div className="flex min-h-screen">

        {/* Left Side - Form */}
        <div className="w-full lg:w-1/2 p-8! sm:p-12! xl:p-24!">
          <div className="w-full max-w-sm mx-auto">
          <div className="mb-8 text-center">
          <img src={logo} alt="NightPharm Logo" className="w-29 h-24 mx-auto " />
          <h1 className="text-xl font-semibold text-gray-900 mb-2">Create your account.</h1>
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <Link
            to="/"
            className="text-emerald-500 hover:text-emerald-600 font-medium"
          >
              Sign in
              </Link>
          </p>
        </div>
            <form className="space-y-4">
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                  Full name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="fullName"
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"placeholder="Enter your full name"
                  required
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  className="w-full px-3 py-2 border border-gray-300  rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    className="w-full px-3 py-2 border border-gray-300  rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent pr-10"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="terms"
                  className="h-4 w-4 rounded border-gray-300 text-emerald-500 focus:ring-emerald-500"
                />
                <label htmlFor="terms" className="ml-2 text-sm text-gray-600">
                  I agree to the terms and conditions
                </label>
              </div>

              <button
            type="submit"
            className="w-full bg-gradient-to-r from-[#1da684] to-[#31eb97] text-white py-2 px-4 rounded-xl hover:bg-[#1da684] transition-colors"
          >
                Sign Up
              </button>

              <div className="relative my-8">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Or</span>
                </div>
              </div>

              <div className="flex gap-8">
                <button
                  type="button"
                  className="flex-1 flex items-center rounded-xl justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <img src={Googel} alt="Google" className="w-5 h-5" />
                </button>
              </div>
            </form>
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
  )
}