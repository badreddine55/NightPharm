import { useEffect, useState } from "react";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import {
  MapPin,
  Clock,
  Phone,
  Mail,
  ChevronRight,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
} from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import Logo from "../../assets/logo1-removebg-preview.png"; // Adjust path as needed

import PharmacyList from "./PharmacyList"; // Adjust path as needed
import NearbyPharmacies from "../Pharmacy/NearbyPharmacies";

export default function DashbordUser() {
  const [scrollY, setScrollY] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // Mobile menu toggle
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSuccess = (credentialResponse) => {
    console.log("Login Success:", credentialResponse);
    const token = credentialResponse.credential;
    const decodedToken = jwtDecode(token);
    console.log("User Info:", decodedToken);

    localStorage.setItem("googleToken", token);
    localStorage.setItem("user", JSON.stringify(decodedToken));

    navigate("/PharmacyShow");
  };

  const handleError = () => {
    console.log("Login Failed");
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
  };

  return (
    <GoogleOAuthProvider clientId="84784187497-r4iuulv6ucflh4jn438d4sp3e6ujmhdb.apps.googleusercontent.com">
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <div
          id="home"
          className="relative min-h-screen bg-cover bg-center flex"
          style={{
            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${encodeURI(
              "https://images.unsplash.com/photo-1666214280391-8ff5bd3c0bf0?q=80&w=1470&auto=format&fit=crop"
            )})`,
          }}
        >
          <div className="container mx-auto px-4">
            <nav className="transform p-6 max-w-7xl z-50">
              <div className="relative backdrop-blur-md dark:bg-gray-900/80 rounded-2xl shadow-lg border border-gray-200/20 dark:border-gray-700/20">
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-teal-500/20 to-blue-500/20 blur-xl -z-10"></div>
                <div className="container mx-auto px-4 py-4">
                  <div className="flex items-center justify-between">
                    {/* Logo Section */}
                    <div className="flex items-center gap-3">
                      <div className="relative group">
                        <div className="absolute -inset-2 bg-gradient-to-r from-teal-500 to-blue-500 rounded-lg blur opacity-0 group-hover:opacity-100 transition duration-500"></div>
                        <div className="relative flex items-center gap-2 rounded-lg px-3 py-2 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                          <img
                            src={Logo || "/placeholder.svg"}
                            alt="NightPharm Logo"
                            className="h-8 object-contain"
                          />
                          <span className="font-bold text-lg bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">
                            NightPharm
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center">
                      <div className="flex gap-1 bg-white/50 dark:bg-gray-800/50 rounded-lg p-1">
                        {[
                          { text: "Home", isActive: true, href: "#home" },
                          { text: "Nearby Pharmacies", isActive: false, href: "#nearby-pharmacies" },
                          { text: "Map", isActive: false, href: "#map" },
                          { text: "Services", isActive: false, href: "#services" },
                        ].map((link) => (
                          <a
                            key={link.text}
                            href={link.href}
                            className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 text-gray-700 dark:text-gray-300 hover:text-teal-600 dark:hover:text-teal-400 hover:bg-gray-100 dark:hover:bg-gray-700`}
                          >
                            {link.text}
                            {link.isActive && (
                              <span className="absolute inset-0 rounded-lg bg-gradient-to-r animate-pulse opacity-50 blur"></span>
                            )}
                          </a>
                        ))}
                      </div>
                    </div>

                    {/* Sign In and Mobile Menu Toggle */}
                    <div className="flex items-center gap-3">
                      <GoogleLogin
                        onSuccess={handleSuccess}
                        onError={handleError}
                        render={({ onClick }) => (
                          <button
                            onClick={onClick}
                            className="group relative flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300"
                          >
                            <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-teal-500 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            <div className="relative flex items-center gap-2 px-3 py-2 rounded-lg bg-white dark:bg-gray-800 group-hover:bg-opacity-10 transition-colors">
                              <svg className="w-5 h-5 transition-transform group-hover:scale-110" viewBox="0 0 48 48">
                                <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z" />
                                <path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z" />
                                <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0124 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z" />
                                <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 01-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z" />
                              </svg>
                              <span className="text-gray-700 dark:text-gray-300 group-hover:text-white transition-colors">
                                Sign in with Google
                              </span>
                            </div>
                          </button>
                        )}
                      />
                      <button
                        className="md:hidden relative p-2 rounded-lg bg-white/50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                      >
                        <svg className="w-6 h-6 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Mobile Menu */}
              <div className={`md:hidden ${isMobileMenuOpen ? "block" : "hidden"}`}>
                <div className="fixed inset-0 backdrop-blur-sm bg-gray-900/50 z-40">
                  <div className="absolute right-4 top-4 w-full max-w-xs bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
                    <button
                      className="absolute top-2 right-2 text-gray-700 dark:text-gray-300"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                    <div className="flex flex-col gap-4">
                      {[
                        { text: "Home", isActive: true, href: "#home" },
                        { text: "Nearby Pharmacies", isActive: false, href: "#nearby-pharmacies" },
                        { text: "Map", isActive: false, href: "#map" },
                        { text: "Services", isActive: false, href: "#services" },
                      ].map((link) => (
                        <a
                          key={link.text}
                          href={link.href}
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                            link.isActive
                              ? "text-white bg-gradient-to-r from-teal-500 to-blue-500"
                              : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                          }`}
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          {link.text}
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </nav>

            <motion.div
              className="max-w-4xl mx-auto text-center text-white mb-8"
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
            >
              <motion.h1 className="text-4xl md:text-6xl font-bold mb-4" variants={fadeInUp}>
                Morocco Night Pharmacy Services
              </motion.h1>
              <motion.p className="text-lg md:text-xl opacity-90 mb-8" variants={fadeInUp}>
                Access 24/7 pharmacy services across Morocco. Find the nearest open pharmacy for your late-night medication needs.
              </motion.p>
              <motion.div variants={fadeInUp}>
                <a
                  href="#nearby-pharmacies"
                  className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 px-8 rounded-full transition-all duration-300 inline-block"
                >
                  Find Morocco Pharmacies
                </a>
              </motion.div>
            </motion.div>
          </div>

          <motion.div
            className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
            animate={{ y: [0, 10, 0], opacity: [0.4, 1, 0.4] }}
            transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2 }}
          >
            <ChevronRight className="h-10 w-10 text-white transform rotate-90" />
          </motion.div>
        </div>

        {/* Pharmacy List Section */}
        <section id="nearby-pharmacies" className="py-20 bg-gray-50">
        <PharmacyList />
        </section>

        {/* Map Section */}
        <section id="map" className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                Find Pharmacies Across Morocco
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Our interactive map helps you locate the nearest night pharmacy in Morocco, with real-time information on opening hours and services.
              </p>
            </motion.div>
            <motion.div
              className="rounded-lx shadow-xl overflow-hidden"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="aspect-w-16 aspect-h-9 w-full h-[500px] bg-gray-200 relative">
                <NearbyPharmacies />
              </div>
            </motion.div>
          </div>
        </section>

        {/* Services Section */}
        <section id="services" className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                Our Morocco Services
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                We offer a range of essential pharmacy services across Morocco, available when you need them most.
              </p>
            </motion.div>
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <motion.div className="bg-white rounded-lg p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300" variants={fadeInUp}>
                <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mb-6 mx-auto">
                  <svg className="w-8 h-8 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-center text-gray-800 mb-2">Prescription Services</h3>
                <p className="text-gray-600 text-center">24/7 prescription filling and emergency medication services across Morocco.</p>
              </motion.div>
              <motion.div className="bg-white rounded-lg p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300" variants={fadeInUp}>
                <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mb-6 mx-auto">
                  <svg className="w-8 h-8 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-center text-gray-800 mb-2">Health Advice</h3>
                <p className="text-gray-600 text-center">Professional health advice from qualified pharmacists at any hour.</p>
              </motion.div>
              <motion.div className="bg-white rounded-lg p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300" variants={fadeInUp}>
                <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mb-6 mx-auto">
                  <svg className="w-8 h-8 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-center text-gray-800 mb-2">Emergency Supplies</h3>
                <p className="text-gray-600 text-center">Access to emergency medication supplies when you need them most.</p>
              </motion.div>
              <motion.div className="bg-white rounded-lg p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300" variants={fadeInUp}>
                <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mb-6 mx-auto">
                  <svg className="w-8 h-8 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-center text-gray-800 mb-2">Telephone Consultations</h3>
                <p className="text-gray-600 text-center">Speak directly with a Moroccan pharmacist over the phone for immediate advice.</p>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                What Moroccans Say
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Hear from Moroccan residents who have used our night pharmacy services.
              </p>
            </motion.div>
            <motion.div
              className="grid grid-cols-1 md:grid-cols-3 gap-8"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <motion.div className="bg-white p-8 rounded-lg shadow-lg relative" variants={fadeInUp}>
                <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
                  <div className="w-12 h-12 bg-teal-600 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                    </svg>
                  </div>
                </div>
                <div className="pt-6">
                  <p className="text-gray-600 mb-4 italic">
                    "When my son needed medication at midnight, I found a nearby pharmacy in Casablanca thanks to this service."
                  </p>
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-gray-200 rounded-full mr-3"></div>
                    <div>
                      <h4 className="font-bold text-gray-800">Fatima Zahra</h4>
                      <p className="text-sm text-gray-500">Casablanca, Morocco</p>
                    </div>
                  </div>
                </div>
              </motion.div>
              <motion.div className="bg-white p-8 rounded-lg shadow-lg relative" variants={fadeInUp}>
                <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
                  <div className="w-12 h-12 bg-teal-600 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                    </svg>
                  </div>
                </div>
                <div className="pt-6">
                  <p className="text-gray-600 mb-4 italic">
                    "This service is a game-changer for late-night needs in Marrakech. Highly recommended!"
                  </p>
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-gray-200 rounded-full mr-3"></div>
                    <div>
                      <h4 className="font-bold text-gray-800">Ahmed Benali</h4>
                      <p className="text-sm text-gray-500">Marrakech, Morocco</p>
                    </div>
                  </div>
                </div>
              </motion.div>
              <motion.div className="bg-white p-8 rounded-lg shadow-lg relative" variants={fadeInUp}>
                <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
                  <div className="w-12 h-12 bg-teal-600 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                    </svg>
                  </div>
                </div>
                <div className="pt-6">
                  <p className="text-gray-600 mb-4 italic">
                    "Managing my medication in Rabat has never been easier with this night pharmacy service."
                  </p>
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-gray-200 rounded-full mr-3"></div>
                    <div>
                      <h4 className="font-bold text-gray-800">Khadija El Amrani</h4>
                      <p className="text-sm text-gray-500">Rabat, Morocco</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-20 bg-teal-600">
          <div className="container mx-auto px-4">
            <motion.div
              className="max-w-4xl mx-auto text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Ready to Find a Morocco Night Pharmacy?
              </h2>
              <p className="text-xl text-teal-100 mb-8">
                Download our app now to locate the nearest open pharmacy in Morocco, anytime day or night.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <button className="bg-white text-teal-600 hover:bg-gray-100 font-bold py-3 px-8 rounded-full transition-colors duration-300 flex items-center justify-center">
                  <svg className="w-6 h-6 mr-2" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.6 9.48l1.84-3.18c.16-.31.04-.69-.26-.85-.29-.15-.65-.06-.83.22l-1.88 3.24c-2.86-1.21-6.08-1.21-8.94 0L5.65 5.67c-.19-.29-.58-.38-.87-.2-.28.18-.37.54-.22.83L6.4 9.48C3.3 11.25 1.28 14.44 1 18h22c-.28-3.56-2.3-6.75-5.4-8.52zM7 15.25c-.69 0-1.25-.56-1.25-1.25s.56-1.25 1.25-1.25 1.25.56 1.25 1.25-.56 1.25-1.25 1.25zm10 0c-.69 0-1.25-.56-1.25-1.25s.56-1.25 1.25-1.25 1.25.56 1.25 1.25-.56 1.25-1.25 1.25z" />
                  </svg>
                  <span>Download on Android</span>
                </button>
                <button className="bg-white text-teal-600 hover:bg-gray-100 font-bold py-3 px-8 rounded-full transition-colors duration-300 flex items-center justify-center">
                  <svg className="w-6 h-6 mr-2" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                  </svg>
                  <span>Download on iOS</span>
                </button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-900 text-white">
          <div className="container mx-auto px-4">
            <div className="py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="space-y-4">
                <h3 className="text-xl font-bold">NightPharm Morocco</h3>
                <p className="text-gray-400">
                  Your trusted source for night pharmacy services across Morocco. Available 24/7 for all your medication needs.
                </p>
                <div className="flex space-x-4">
                <motion.a
                  href="https://github.com/badreddine55"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors duration-300"
                  whileHover={{ scale: 1.2 }}
                >
                  <svg
                    className="h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.871.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                      clipRule="evenodd"
                    />
                  </svg>
                </motion.a>
                <motion.a
                  href="https://www.linkedin.com/in/badr-eddine-252704319"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors duration-300"
                  whileHover={{ scale: 1.2 }}
                >
                  <Linkedin className="h-5 w-5" />
                </motion.a>
                <motion.a
                  href="https://www.instagram.com/badr_dy/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors duration-300"
                  whileHover={{ scale: 1.2 }}
                >
                  <Instagram className="h-5 w-5" />
                </motion.a>
              </div>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-4">Quick Links</h3>
                <ul className="space-y-2">
                  <li><a href="#home" className="text-gray-400 hover:text-white transition-colors duration-300">Home</a></li>
                  <li><a href="#nearby-pharmacies" className="text-gray-400 hover:text-white transition-colors duration-300">Nearby Pharmacies</a></li>
                  <li><a href="#map" className="text-gray-400 hover:text-white transition-colors duration-300">Map</a></li>
                  <li><a href="#services" className="text-gray-400 hover:text-white transition-colors duration-300">Services</a></li>
                  <li><a href="#contact" className="text-gray-400 hover:text-white transition-colors duration-300">Contact</a></li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-4">Morocco Regions</h3>
                <ul className="space-y-2">
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">Casablanca-Settat</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">Marrakech-Safi</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">Rabat-Salé-Kénitra</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">Fès-Meknès</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">Tanger-Tétouan-Al Hoceïma</a></li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-4">Contact Us</h3>
                <ul className="space-y-3">

                  <li className="flex items-start">
                    <Phone className="h-5 w-5 mr-2 text-teal-500 mt-0.5" />
                    <span className="text-gray-400">+212 701708363</span>
                  </li>
                  <li className="flex items-start">
                    <Mail className="h-5 w-5 mr-2 text-teal-500 mt-0.5" />
                    <span className="text-gray-400">beddine330@gmail.com
</span>
                  </li>
                  <li className="flex items-start">
                    <Clock className="h-5 w-5 mr-2 text-teal-500 mt-0.5" />
                    <span className="text-gray-400">Available 24/7</span>
                  </li>
                </ul>
              </div>
            </div>
            <div className="py-6 border-t border-gray-800 text-center">
              <p className="text-gray-400">
                © {new Date().getFullYear()} NightPharm Morocco. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </GoogleOAuthProvider>
  );
}