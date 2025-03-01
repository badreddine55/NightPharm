"use client"

import { useEffect, useState } from "react"
import Top from "./Top"
import { MapPin, Clock, Phone, Mail, ChevronRight, Facebook, Twitter, Instagram, Linkedin } from "lucide-react"
import { motion } from "framer-motion"

export default function DashbordUser() {
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  }

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
 

      {/* Hero Section - London Specific */}
      <div
        className="relative min-h-screen bg-cover bg-center flex items-center"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${encodeURI(
            "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?q=80&w=1470&auto=format&fit=crop",
          )})`,
        }}
      >
        <div className="container mx-auto px-4">

          <motion.div
            className="max-w-4xl mx-auto text-center text-white mb-8"
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
          <Top />
            <motion.h1 className="text-4xl md:text-6xl font-bold mb-4" variants={fadeInUp}>
              London Night Pharmacy Services
            </motion.h1>
            <motion.p className="text-lg md:text-xl opacity-90 mb-8" variants={fadeInUp}>
              Access 24/7 pharmacy services across London. Find the nearest open pharmacy for your late-night medication
              needs.
            </motion.p>
            <motion.div variants={fadeInUp}>
              <a
                href="#london-pharmacies"
                className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 px-8 rounded-full transition-all duration-300 inline-block"
              >
                Find London Pharmacies
              </a>
            </motion.div>
          </motion.div>
        </div>

        {/* Animated scroll indicator */}
        <motion.div
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
          animate={{
            y: [0, 10, 0],
            opacity: [0.4, 1, 0.4],
          }}
          transition={{
            repeat: Number.POSITIVE_INFINITY,
            duration: 2,
          }}
        >
          <ChevronRight className="h-10 w-10 text-white transform rotate-90" />
        </motion.div>
      </div>

      {/* London Pharmacies Section */}
      <section id="london-pharmacies" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">London Night Pharmacies</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Our network of night pharmacies across London ensures you're never far from essential medication services,
              no matter the hour.
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {/* Pharmacy Card 1 */}
            <motion.div className="bg-white rounded-lg shadow-lg overflow-hidden" variants={fadeInUp}>
              <div className="h-48 overflow-hidden">
                <img
                  src="/placeholder.svg?height=300&width=500"
                  alt="Central London Pharmacy"
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-2">Central London Pharmacy</h3>
                <div className="flex items-center text-gray-600 mb-2">
                  <MapPin className="h-4 w-4 mr-2 text-teal-600" />
                  <span>123 Oxford Street, London</span>
                </div>
                <div className="flex items-center text-gray-600 mb-2">
                  <Clock className="h-4 w-4 mr-2 text-teal-600" />
                  <span>Open 24/7</span>
                </div>
                <div className="flex items-center text-gray-600 mb-4">
                  <Phone className="h-4 w-4 mr-2 text-teal-600" />
                  <span>020 1234 5678</span>
                </div>
                <button className="w-full bg-teal-600 hover:bg-teal-700 text-white py-2 rounded transition-colors duration-300">
                  View Details
                </button>
              </div>
            </motion.div>

            {/* Pharmacy Card 2 */}
            <motion.div className="bg-white rounded-lg shadow-lg overflow-hidden" variants={fadeInUp}>
              <div className="h-48 overflow-hidden">
                <img
                  src="/placeholder.svg?height=300&width=500"
                  alt="East London Pharmacy"
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-2">East London Pharmacy</h3>
                <div className="flex items-center text-gray-600 mb-2">
                  <MapPin className="h-4 w-4 mr-2 text-teal-600" />
                  <span>45 Brick Lane, London</span>
                </div>
                <div className="flex items-center text-gray-600 mb-2">
                  <Clock className="h-4 w-4 mr-2 text-teal-600" />
                  <span>Open 10PM - 8AM</span>
                </div>
                <div className="flex items-center text-gray-600 mb-4">
                  <Phone className="h-4 w-4 mr-2 text-teal-600" />
                  <span>020 8765 4321</span>
                </div>
                <button className="w-full bg-teal-600 hover:bg-teal-700 text-white py-2 rounded transition-colors duration-300">
                  View Details
                </button>
              </div>
            </motion.div>

            {/* Pharmacy Card 3 */}
            <motion.div className="bg-white rounded-lg shadow-lg overflow-hidden" variants={fadeInUp}>
              <div className="h-48 overflow-hidden">
                <img
                  src="/placeholder.svg?height=300&width=500"
                  alt="South London Pharmacy"
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-2">South London Pharmacy</h3>
                <div className="flex items-center text-gray-600 mb-2">
                  <MapPin className="h-4 w-4 mr-2 text-teal-600" />
                  <span>78 Brixton Road, London</span>
                </div>
                <div className="flex items-center text-gray-600 mb-2">
                  <Clock className="h-4 w-4 mr-2 text-teal-600" />
                  <span>Open 8PM - 6AM</span>
                </div>
                <div className="flex items-center text-gray-600 mb-4">
                  <Phone className="h-4 w-4 mr-2 text-teal-600" />
                  <span>020 3456 7890</span>
                </div>
                <button className="w-full bg-teal-600 hover:bg-teal-700 text-white py-2 rounded transition-colors duration-300">
                  View Details
                </button>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* London Map Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Find Pharmacies Across London</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Our interactive map helps you locate the nearest night pharmacy in London, with real-time information on
              opening hours and services.
            </p>
          </motion.div>

          <motion.div
            className="bg-white rounded-xl shadow-xl overflow-hidden"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="aspect-w-16 aspect-h-9 w-full h-[500px] bg-gray-200 relative">
              {/* This would be replaced with an actual map component */}
              <div className="absolute inset-0 flex items-center justify-center">
                <p className="text-gray-500 text-lg">Interactive London Pharmacy Map</p>
              </div>
              <img
                src="/placeholder.svg?height=500&width=1000"
                alt="London Pharmacy Map"
                className="w-full h-full object-cover"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* London Services Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Our London Services</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              We offer a range of essential pharmacy services across London, available when you need them most.
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {/* Service 1 */}
            <motion.div
              className="bg-white rounded-lg p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300"
              variants={fadeInUp}
            >
              <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mb-6 mx-auto">
                <svg
                  className="w-8 h-8 text-teal-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-center text-gray-800 mb-2">Prescription Services</h3>
              <p className="text-gray-600 text-center">
                24/7 prescription filling and emergency medication services across London.
              </p>
            </motion.div>

            {/* Service 2 */}
            <motion.div
              className="bg-white rounded-lg p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300"
              variants={fadeInUp}
            >
              <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mb-6 mx-auto">
                <svg
                  className="w-8 h-8 text-teal-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-center text-gray-800 mb-2">Health Advice</h3>
              <p className="text-gray-600 text-center">
                Professional health advice from qualified pharmacists at any hour.
              </p>
            </motion.div>

            {/* Service 3 */}
            <motion.div
              className="bg-white rounded-lg p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300"
              variants={fadeInUp}
            >
              <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mb-6 mx-auto">
                <svg
                  className="w-8 h-8 text-teal-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-center text-gray-800 mb-2">Emergency Supplies</h3>
              <p className="text-gray-600 text-center">
                Access to emergency medication supplies when you need them most.
              </p>
            </motion.div>

            {/* Service 4 */}
            <motion.div
              className="bg-white rounded-lg p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300"
              variants={fadeInUp}
            >
              <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mb-6 mx-auto">
                <svg
                  className="w-8 h-8 text-teal-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-center text-gray-800 mb-2">Telephone Consultations</h3>
              <p className="text-gray-600 text-center">
                Speak directly with a London pharmacist over the phone for immediate advice.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* London Testimonials */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">What Londoners Say</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Hear from London residents who have used our night pharmacy services.
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {/* Testimonial 1 */}
            <motion.div className="bg-white p-8 rounded-lg shadow-lg relative" variants={fadeInUp}>
              <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
                <div className="w-12 h-12 bg-teal-600 rounded-full flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                  </svg>
                </div>
              </div>
              <div className="pt-6">
                <p className="text-gray-600 mb-4 italic">
                  "When my daughter needed medication at 2AM, I was so relieved to find an open pharmacy through this
                  service. The staff were incredibly helpful and understanding."
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gray-200 rounded-full mr-3"></div>
                  <div>
                    <h4 className="font-bold text-gray-800">Sarah Johnson</h4>
                    <p className="text-sm text-gray-500">Camden, London</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Testimonial 2 */}
            <motion.div className="bg-white p-8 rounded-lg shadow-lg relative" variants={fadeInUp}>
              <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
                <div className="w-12 h-12 bg-teal-600 rounded-full flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                  </svg>
                </div>
              </div>
              <div className="pt-6">
                <p className="text-gray-600 mb-4 italic">
                  "As a shift worker, I often need pharmacy services at unusual hours. This app has been a lifesaver,
                  helping me find open pharmacies across London whenever I need them."
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gray-200 rounded-full mr-3"></div>
                  <div>
                    <h4 className="font-bold text-gray-800">David Thompson</h4>
                    <p className="text-sm text-gray-500">Greenwich, London</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Testimonial 3 */}
            <motion.div className="bg-white p-8 rounded-lg shadow-lg relative" variants={fadeInUp}>
              <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
                <div className="w-12 h-12 bg-teal-600 rounded-full flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                  </svg>
                </div>
              </div>
              <div className="pt-6">
                <p className="text-gray-600 mb-4 italic">
                  "The ability to find a pharmacy open at night in London has been invaluable for managing my chronic
                  condition. I can always get my medication when I need it."
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gray-200 rounded-full mr-3"></div>
                  <div>
                    <h4 className="font-bold text-gray-800">Emma Wilson</h4>
                    <p className="text-sm text-gray-500">Islington, London</p>
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
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready to Find a London Night Pharmacy?</h2>
            <p className="text-xl text-teal-100 mb-8">
              Download our app now to locate the nearest open pharmacy in London, anytime day or night.
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

      {/* Footer with images */}
      <footer className="bg-gray-900 text-white">
        <div className="container mx-auto px-4">
          {/* London landmarks footer banner */}
          <motion.div
            className="py-8 border-b border-gray-800"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex flex-wrap justify-center gap-4">
              <motion.div
                className="w-24 h-24 md:w-32 md:h-32 rounded-lg overflow-hidden"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                <img
                  src="/placeholder.svg?height=150&width=150"
                  alt="London Eye"
                  className="w-full h-full object-cover"
                />
              </motion.div>
              <motion.div
                className="w-24 h-24 md:w-32 md:h-32 rounded-lg overflow-hidden"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                <img
                  src="/placeholder.svg?height=150&width=150"
                  alt="Tower Bridge"
                  className="w-full h-full object-cover"
                />
              </motion.div>
              <motion.div
                className="w-24 h-24 md:w-32 md:h-32 rounded-lg overflow-hidden"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                <img src="/placeholder.svg?height=150&width=150" alt="Big Ben" className="w-full h-full object-cover" />
              </motion.div>
              <motion.div
                className="w-24 h-24 md:w-32 md:h-32 rounded-lg overflow-hidden"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                <img
                  src="/placeholder.svg?height=150&width=150"
                  alt="The Shard"
                  className="w-full h-full object-cover"
                />
              </motion.div>
              <motion.div
                className="w-24 h-24 md:w-32 md:h-32 rounded-lg overflow-hidden"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                <img
                  src="/placeholder.svg?height=150&width=150"
                  alt="Buckingham Palace"
                  className="w-full h-full object-cover"
                />
              </motion.div>
            </div>
          </motion.div>

          <div className="py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <h3 className="text-xl font-bold">NightPharm London</h3>
              <p className="text-gray-400">
                Your trusted source for night pharmacy services across London. Available 24/7 for all your medication
                needs.
              </p>
              <div className="flex space-x-4">
                <motion.a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors duration-300"
                  whileHover={{ scale: 1.2 }}
                >
                  <Facebook className="h-5 w-5" />
                </motion.a>
                <motion.a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors duration-300"
                  whileHover={{ scale: 1.2 }}
                >
                  <Twitter className="h-5 w-5" />
                </motion.a>
                <motion.a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors duration-300"
                  whileHover={{ scale: 1.2 }}
                >
                  <Instagram className="h-5 w-5" />
                </motion.a>
                <motion.a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors duration-300"
                  whileHover={{ scale: 1.2 }}
                >
                  <Linkedin className="h-5 w-5" />
                </motion.a>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">
                    Home
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">
                    Services
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">
                    Find a Pharmacy
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">
                    Contact
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-4">London Areas</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">
                    Central London
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">
                    North London
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">
                    South London
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">
                    East London
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">
                    West London
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-4">Contact Us</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <MapPin className="h-5 w-5 mr-2 text-teal-500 mt-0.5" />
                  <span className="text-gray-400">123 Pharmacy Street, London, UK</span>
                </li>
                <li className="flex items-start">
                  <Phone className="h-5 w-5 mr-2 text-teal-500 mt-0.5" />
                  <span className="text-gray-400">+44 20 1234 5678</span>
                </li>
                <li className="flex items-start">
                  <Mail className="h-5 w-5 mr-2 text-teal-500 mt-0.5" />
                  <span className="text-gray-400">info@nightpharm.co.uk</span>
                </li>
                <li className="flex items-start">
                  <Clock className="h-5 w-5 mr-2 text-teal-500 mt-0.5" />
                  <span className="text-gray-400">Available 24/7</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="py-6 border-t border-gray-800 text-center">
            <p className="text-gray-400">&copy; {new Date().getFullYear()} NightPharm London. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

