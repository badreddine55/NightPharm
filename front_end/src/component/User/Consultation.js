"use client"

import { useState, useEffect, useRef } from "react"
import axios from "axios"
import Sidebar from "./Sidebar"
import Header from "../Function/Header"
import { User, Clock, CheckCheck, Send } from "lucide-react"

export default function Consultation() {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [openMenuId, setOpenMenuId] = useState(null)
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 })
  const menuRef = useRef(null)

  const [nurses, setNurses] = useState([])
  const [selectedNurse, setSelectedNurse] = useState(null)
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState("")
  const [client, setClient] = useState(null)
  const messagesEndRef = useRef(null)

  // Fetch client and nurses on mount
  useEffect(() => {
    const token = localStorage.getItem("googleToken")
    if (!token) {
      console.error("No googleToken found in localStorage")
      return
    }

    const fetchClient = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/clients/me", {
          headers: { "x-google-token": token },
        })
        setClient(response.data) // { _id, googleId, name, email, role }
      } catch (error) {
        console.error("Error fetching client:", error.response?.data || error.message)
      }
    }

    const fetchNurses = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/nurses", {
          headers: { "x-google-token": token },
        })
        setNurses(response.data.nurses)
      } catch (error) {
        console.error("Error fetching nurses:", error.response?.data || error.message)
      }
    }

    fetchClient()
    fetchNurses()
  }, [])

  // Fetch messages
  useEffect(() => {
    const token = localStorage.getItem("googleToken")
    if (!token || !selectedNurse) return

    const fetchMessages = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/clients/messages/${selectedNurse._id}`, // Changed endpoint
          {
            headers: { "x-google-token": token },
          },
        )
        setMessages(response.data)
      } catch (error) {
        console.error("Error fetching messages:", error.response?.data || error.message)
        setMessages([])
      }
    }

    fetchMessages()
  }, [selectedNurse])
  // Scroll to the bottom of messages when they update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Send a new message
  // Send message
  const handleSendMessage = async (e) => {
    e.preventDefault()
    if (!newMessage.trim() || !selectedNurse || !client) return

    try {
      const response = await axios.post(
        "http://localhost:5000/api/clients/messages", // Changed endpoint
        {
          nurseId: selectedNurse._id,
          content: newMessage,
        },
        {
          headers: {
            "x-google-token": localStorage.getItem("googleToken"),
          },
        },
      )
      setMessages([...messages, response.data])
      setNewMessage("")
    } catch (error) {
      console.error("Error sending message:", error.response?.data || error.message)
    }
  }

  return (
    <>
      <div>
        <Header toggleMenu={() => setIsCollapsed(!isCollapsed)} />
      </div>
      <div className="min-h-screen flex">
        <Sidebar isCollapsed={isCollapsed} closeMenu={setIsCollapsed} />
        <div className={`flex-1 flex flex-col transition-all duration-300 ${isCollapsed ? "ml-[80px]" : "ml-[250px]"}`}>
          <main className="flex-1 overflow-y-auto p-6 mt-20">
            <div className="flex h-full">
              {/* Chat Window */}
              <div className="w-2/3 flex flex-col mr-4 rounded-lg overflow-hidden border border-gray-200 shadow-lg">
                {selectedNurse && client ? (
                  <>
                    <div className="bg-white p-4 border-b flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-500 mr-3">
                          <User size={20} />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold">{selectedNurse.name}</h3>
                        </div>
                      </div>
                    </div>
                    <div className="flex-1 p-4 bg-gray-50 overflow-y-auto" style={{ minHeight: "400px" }}>
                      {messages.length > 0 ? (
                        messages.map((msg) => (
                          <div
                            key={msg._id}
                            className={`mb-4 flex ${
                              msg.sender.toString() === client._id.toString() ? "justify-end" : "justify-start"
                            }`}
                          >
                            {msg.sender.toString() !== client._id.toString() && (
                              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-500 mr-2 self-end">
                                <User size={16} />
                              </div>
                            )}
                            <div
                              className={`max-w-[70%] p-3 rounded-lg ${
                                msg.sender.toString() === client._id.toString()
                                  ? "bg-blue-500 text-white rounded-tr-none"
                                  : "bg-white border border-gray-200 rounded-tl-none"
                              }`}
                            >
                              <p>{msg.content}</p>
                              <div
                                className={`text-xs mt-1 flex items-center ${
                                  msg.sender.toString() === client._id.toString() ? "text-blue-100" : "text-gray-400"
                                }`}
                              >
                                <Clock size={12} className="mr-1" />
                                {new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                                {msg.sender.toString() === client._id.toString() && (
                                  <CheckCheck size={12} className="ml-1" />
                                )}
                              </div>
                            </div>
                            {msg.sender.toString() === client._id.toString() && (
                              <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white ml-2 self-end">
                                <User size={16} />
                              </div>
                            )}
                          </div>
                        ))
                      ) : (
                        <div className="h-full flex flex-col items-center justify-center">
                          <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-500 mb-3">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="32"
                              height="32"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                            </svg>
                          </div>
                          <p className="text-gray-500 text-center font-medium">No messages yet</p>
                          <p className="text-gray-400 text-sm text-center">
                            Start the conversation with {selectedNurse.name}
                          </p>
                        </div>
                      )}
                      <div ref={messagesEndRef} />
                    </div>
                    <form
                      onSubmit={handleSendMessage}
                      className="p-3 bg-white border-t border-gray-200 flex items-center"
                    >
                      <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type your message..."
                        className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 mx-2"
                      />
                      <button
                        type="submit"
                        className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 flex items-center justify-center w-10 h-10"
                      >
                        <Send size={18} />
                      </button>
                    </form>
                  </>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center bg-gray-50 p-8">
                    <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center text-blue-500 mb-4">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="40"
                        height="40"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                      </svg>
                    </div>
                    <p className="text-gray-700 text-xl font-semibold mb-2">No conversation selected</p>
                    <p className="text-gray-500 text-center">Select a nurse from the list to start chatting</p>
                  </div>
                )}
              </div>

              {/* Nurse List */}
              <div className="w-1/3 bg-white p-4 rounded-lg border border-gray-200 shadow-lg">
                <h2 className="text-xl font-semibold mb-4 flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="mr-2"
                  >
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                  </svg>
                  Available Nurses
                </h2>
                <div className="space-y-2 overflow-y-auto max-h-[500px] pr-1">
                  {nurses.map((nurse) => (
                    <div
                      key={nurse._id}
                      onClick={() => setSelectedNurse(nurse)}
                      className={`p-3 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors duration-200 flex items-center ${
                        selectedNurse?._id === nurse._id
                          ? "bg-blue-50 border border-blue-200"
                          : "border border-transparent"
                      }`}
                    >
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-500 mr-3">
                        {nurse.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{nurse.name}</p>
                        <p className="text-sm text-gray-600">
                          {nurse.specialization} - {nurse.yearsOfExperience} years
                        </p>
                        <p className="text-sm text-gray-600">{nurse.pharmacyName}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  )
}

