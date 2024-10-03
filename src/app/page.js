"use client"

import React, { useState, useRef, useEffect } from "react"
import { Moon, Send, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Image from "next/image"

// Initial messages
const initialMessages = [
  { content: "Hi, I’m GarAi, here to answer your questions as Garrett. Ask me anything about his skills, experience, or projects, and I’ll respond just like he would. Let’s chat!", sender: "ai" }
]

export default function GarAi() {
  const [messages, setMessages] = useState([])
  const [inputMessage, setInputMessage] = useState("")
  const [isDarkTheme, setIsDarkTheme] = useState(false)
  const [loading, setLoading] = useState(false)

  const messagesEndRef = useRef(null)

  // Suggestions
  const suggestions = [
    "What is GarAi?",
    "What is your current role?",
    "Where do you want to be in 5 years?",
    "What are some of your goals?",
  ]

  // Load messages from localStorage
  useEffect(() => {
    const savedMessages = localStorage.getItem("chatMessages")
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages))
    } else {
      setMessages(initialMessages)
    }
  }, [])

  // Save messages to localStorage
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem("chatMessages", JSON.stringify(messages))
    }
  }, [messages])

  // Scrolls to bottom of messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages])

  // Handle sending a message
  const handleSendMessage = async (message) => {
    if (message.trim() === "") return

    const newMessages = [...messages, { content: message, sender: "user" }]
    setMessages(newMessages)
    setInputMessage("")
    setLoading(true)

    try {
      // POST request to AI endpoint
      const response = await fetch("https://garai-backend-production.up.railway.app/ask-ai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          question: message
        })
      })
      const data = await response.json()

      // Update messages with AI's response
      setMessages([...newMessages, { content: data.answer, sender: "ai" }])
    } catch (error) {
      console.error("Error fetching AI response:", error)
      setMessages([...newMessages, { content: "Sorry, something went wrong. Please try again later.", sender: "ai" }])
    } finally {
      setLoading(false)
    }
  }

  // Handle suggestion click
  const handleSuggestionClick = (suggestion) => {
    handleSendMessage(suggestion)
  }

  // Toggle theme
  const toggleTheme = () => {
    setIsDarkTheme(!isDarkTheme)
  }

  return (
    <div className={`flex flex-col ${isDarkTheme ? "dark" : ""} font-sans h-[100svh] overflow-hidden`}>
      <div className="flex-1 bg-background text-foreground overflow-hidden relative">
        <img src='/transparent-bg.avif' className=" absolute top-0 left-0 object-cover h-full z-0 pointer-events-none select-none opacity-50" />
        <div className="container mx-auto p-4 flex flex-col h-full max-w-5xl z-10 relative">
          <header className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold flex items-center ">
              GarAI
              <img src='/ai-icon.svg' className="ms-3" width={24} height={24}></img>
            </h1>
            <Button variant="ghost" size="icon" onClick={toggleTheme}>
              {isDarkTheme ? <Sun className="h-[1.2rem] w-[1.2rem]" /> : <Moon className="h-[1.2rem] w-[1.2rem]" />}
            </Button>
          </header>
          <div className="flex-1 p-4 overflow-y-auto chat-scrollbar">
            {messages.map((message, index) => (
              <div key={index} className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"} mb-4`}>
                <div className={`flex items-start ${message.sender === "user" ? "flex-row-reverse" : ""}`}>
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={message.sender === "user" ? "/user-avatar.png" : "/ai-avatar.png"} />
                    <AvatarFallback>{message.sender === "user" ? "U" : "AI"}</AvatarFallback>
                  </Avatar>
                  <div
                    className={`mx-2 p-3 rounded-lg ${message.sender === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-secondary-foreground"
                      }`}
                  >
                    {message.content}
                  </div>
                </div>
              </div>
            ))}
            {loading && (
              <div className='flex mb-4'>
                <div className='flex items-start' >
                  <Avatar className="w-8 h-8">
                    <AvatarImage src="/ai-avatar.png" />
                    <AvatarFallback>AI</AvatarFallback>
                  </Avatar>
                  <div className="mx-2 p-3 rounded-lg bg-secondary text-secondary-foreground typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} /> {/* This will be used to scroll into view */}
          </div>
          <div className="mb-3">
            <h2 className="text-sm font-semibold mb-2">Suggestions:</h2>
            <div className="flex gap-2 overflow-x-auto whitespace-nowrap suggestion-scrollbar"
              onWheel={(e) => {
                e.currentTarget.scrollLeft += e.deltaY
              }}
            >
              {suggestions.map((suggestion, index) => (
                <Button
                  className="mb-1"
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  {suggestion}
                </Button>
              ))}
            </div>
          </div>
          <div className="flex items-center h-[45px]">
            <Input
              type="text"
              placeholder="Type your message..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter" && !loading) handleSendMessage(inputMessage)
              }}
              className="flex-1 mr-2 rounded-full h-full"
              disabled={loading}
            />
            <Button onClick={() => handleSendMessage(inputMessage)} className="rounded-full h-full" disabled={loading}>
              {loading ? "..." : <><Send className="h-4 w-4 mr-2" />Send</>}
            </Button>
          </div>
          <p className="flex justify-center text-xs text-gray-400 mt-1">this is a demo that may make mistakes</p>
        </div>
      </div>
    </div>
  )
}
