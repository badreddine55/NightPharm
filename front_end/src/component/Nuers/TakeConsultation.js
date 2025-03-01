"use client"

import { useState, useEffect, useRef } from "react"
import axios from "axios"
import Sidebar from "./Sidebar"
import Header from "../Function/Header"
import { User, Clock, CheckCheck, Send } from "lucide-react"

export default function TakeConsultation() {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [openMenuId, setOpenMenuId] = useState(null)
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 })
  const menuRef = useRef(null)

  const [clients, setClients] = useState([]) // List of clients who messaged the nurse
  const [selectedClient, setSelectedClient] = useState(null) // Selected client
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState("")
  const [nurse, setNurse] = useState(null) // Logged-in nurse info
  const messagesEndRef = useRef(null)

  // Fetch nurse info and clients who sent messages on mount
  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) {
      console.error("No token found in localStorage")
      return
    }

    const fetchNurse = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/nurses/me", {
          headers: { Authorization: `Bearer ${token}` }, // Nurse JWT
        })
        setNurse(response.data)
      } catch (error) {
        console.error("Error fetching nurse:", error.response?.data || error.message)
      }
    }

    const fetchClients = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/nurses/my-clients", {
          headers: { Authorization: `Bearer ${token}` }, // Nurse JWT
        })
        setClients(response.data.clients) // Assuming backend returns { clients: [...] }
      } catch (error) {
        console.error("Error fetching clients:", error.response?.data || error.message)
      }
    }

    fetchNurse()
    fetchClients()
  }, [])

  // Fetch messages when a client is selected
  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token || !selectedClient || !nurse) return

    const fetchMessages = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/nurses/messages/${selectedClient._id}`, {
          headers: { Authorization: `Bearer ${token}` }, // Nurse JWT
        })
        setMessages(response.data)
      } catch (error) {
        console.error("Error fetching messages:", error.response?.data || error.message)
        setMessages([]) // Reset if no messages or error
      }
    }

    fetchMessages()
  }, [selectedClient, nurse])

  // Scroll to the bottom of messages when they update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messagesEndRef]) //Corrected dependency

  // Send a new message to the selected client
  const handleSendMessage = async (e) => {
    e.preventDefault()

    const token = localStorage.getItem("token")
    if (!newMessage.trim() || !selectedClient || !nurse) return

    try {
      const response = await axios.post(
        "http://localhost:5000/api/nurses/messages",
        {
          clientId: selectedClient._id, // Changed from nurseId to clientId
          content: newMessage,
        },
        {
          headers: { Authorization: `Bearer ${token}` }, // Nurse JWT
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
                {selectedClient && nurse ? (
                  <>
                    <div className="bg-white p-4 border-b flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-500 mr-3">
                          <User size={20} />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold">{selectedClient.name}</h3>
                        </div>
                      </div>
                    </div>
                    <div className="flex-1 p-4 bg-gray-50 overflow-y-auto" style={{ minHeight: "400px" }}>
                      {messages.length > 0 ? (
                        messages.map((msg) => (
                          <div
                            key={msg._id}
                            className={`mb-4 flex ${
                              msg.sender.toString() === nurse._id.toString() ? "justify-end" : "justify-start"
                            }`}
                          >
                            {msg.sender.toString() !== nurse._id.toString() && (
                              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-500 mr-2 self-end">
                                <User size={16} />
                              </div>
                            )}
                            <div
                              className={`max-w-[70%] p-3 rounded-lg ${
                                msg.sender.toString() === nurse._id.toString()
                                  ? "bg-blue-500 text-white rounded-tr-none"
                                  : "bg-white border border-gray-200 rounded-tl-none"
                              }`}
                            >
                              <p>{msg.content}</p>
                              <div
                                className={`text-xs mt-1 flex items-center ${
                                  msg.sender.toString() === nurse._id.toString() ? "text-blue-100" : "text-gray-400"
                                }`}
                              >
                                <Clock size={12} className="mr-1" />
                                {new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                                {msg.sender.toString() === nurse._id.toString() && (
                                  <CheckCheck size={12} className="ml-1" />
                                )}
                              </div>
                            </div>
                            {msg.sender.toString() === nurse._id.toString() && (
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
                            Start the conversation with {selectedClient.name}
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
                    <p className="text-gray-500 text-center">Select a client from the list to start chatting</p>
                  </div>
                )}
              </div>

              {/* Client List */}
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
                  Clients
                </h2>
                <div className="space-y-2 overflow-y-auto max-h-[500px] pr-1">
                  {clients.map((client) => (
                    <div
                      key={client._id}
                      onClick={() => setSelectedClient(client)}
                      className={`p-3 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors duration-200 flex items-center ${
                        selectedClient?._id === client._id
                          ? "bg-blue-50 border border-blue-200"
                          : "border border-transparent"
                      }`}
                    >
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-500 mr-3">
                        {client.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-center">
                          <p className="font-medium">{client.name}</p>
                        </div>
                        <div className="flex justify-between items-center">
                          <p className="text-sm text-gray-600 truncate w-36">{client.email}</p>
                        </div>
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

