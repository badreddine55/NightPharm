import { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate for redirection
import logo from "../../assets/logo1.png";
import Googel from "../../assets/google-icon-logo.svg";
import { Eye, EyeOff } from "lucide-react";
import { Link } from "react-router-dom";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Hook for navigation

  const handleLogin = async (e) => {
    e.preventDefault(); // Prevent page reload
    setError(null); // Reset errors before new attempt
  
    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        localStorage.setItem("token", data.token); // Save token to localStorage
        localStorage.setItem("role", data.role); // Save role to localStorage
  
        // Redirect based on role
        switch (data.role) {
          case "superadmin":
            navigate("/Dashboard");
            break;
          case "nurse":
            navigate("/DashbordNuers");
            break;
          case "Supplier":
            navigate("/SupplierDshbard");
            break;
          default:
            navigate("/Dashboard"); // Fallback for unknown roles
        }
      } else {
        setError(data.message || "Login failed. Please try again.");
      }
    } catch (error) {
      setError("Network error. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="flex min-h-screen flex-col lg:flex-row">
        {/* Left Side - Form */}
        <div className="w-full lg:w-1/2 p-8 sm:p-12 xl:p-24">
          <div className="w-full max-w-sm mx-auto">
            <div className="mb-8 text-center">
              <img src={logo} alt="NightPharm Logo" className="w-29 h-24 mx-auto" />
              <h1 className="text-xl font-semibold text-gray-900 mt-4 mb-2">
                Login to your account.
              </h1>
            </div>

            {/* Login Form */}
            <form className="space-y-6" onSubmit={handleLogin}>
              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent pr-10"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Error Message */}
              {error && <p className="text-red-500 text-sm">{error}</p>}

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input type="checkbox" id="rememberMe" className="h-4 w-4 rounded border-gray-300 text-emerald-500 focus:ring-emerald-500" />
                  <label htmlFor="rememberMe" className="ml-2 text-sm text-gray-600">
                    Remember me
                  </label>
                </div>
                <Link to="/ForgotPassword" className="text-sm text-emerald-500 hover:text-emerald-600">
                  Forgot password?
                </Link>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-[#1da684] to-[#31eb97] text-white py-2 px-4 rounded-xl hover:bg-[#1da684] transition-colors"
              >
                Login
              </button>
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
  );
}
