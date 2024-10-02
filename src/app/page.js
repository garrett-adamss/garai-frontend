"use client"

import React, { useState, useRef, useEffect } from "react"
import { Moon, Send, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Image from "next/image"

// Initial AI message
const initialMessages = [
  { content: "Hi, I’m GarAi, here to answer your questions as Garrett. Ask me anything about his skills, experience, or projects, and I’ll respond just like he would. Let’s chat!", sender: "ai" }
]

export default function ChatGPTReplica() {
  const [messages, setMessages] = useState(initialMessages)
  const [inputMessage, setInputMessage] = useState("")
  const [isDarkTheme, setIsDarkTheme] = useState(false)
  const [loading, setLoading] = useState(false)

  // Ref to the messages container for auto-scroll
  const messagesEndRef = useRef(null)

  const suggestions = [
    "What is GarAi?",
    "What was your last role?",
    "Where do you want to be in 5 years?",
    "What are some of your goals?",
  ]

  // Auto-scroll to the bottom when new messages are added
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages])

  const handleSendMessage = async (message) => {
    if (message.trim() === "") return

    const newMessages = [...messages, { content: message, sender: "user" }]
    setMessages(newMessages)
    setInputMessage("")
    setLoading(true)

    try {
      // Make a POST request to your backend
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
      setMessages([...newMessages, { content: "Sorry, something went wrong.", sender: "ai" }])
    } finally {
      setLoading(false)
    }
  }

  const handleSuggestionClick = (suggestion) => {
    handleSendMessage(suggestion)
  }

  const toggleTheme = () => {
    setIsDarkTheme(!isDarkTheme)
  }

  return (
    <div className={`h-screen flex flex-col ${isDarkTheme ? "dark" : ""} font-sans`}>
      <div className="flex-1 bg-background text-foreground overflow-hidden relative">
        <img src='/transparent-bg.avif' className=" absolute top-0 left-0 object-cover h-[750px] z-0 pointer-events-none select-none opacity-50" />
        <div className="container mx-auto px-3 pt-4 pb-6 flex flex-col h-full max-w-5xl z-10 relative">
          <header className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold flex items-center ">
              GarAI
              <Image src='/ai-icon.svg' className="ms-3" width={24} height={24}></Image>
            </h1>
            <Button variant="ghost" size="icon" onClick={toggleTheme}>
              {isDarkTheme ? <Sun className="h-[1.2rem] w-[1.2rem]" /> : <Moon className="h-[1.2rem] w-[1.2rem]" />}
            </Button>
          </header>
          <div className="flex-1 border rounded-md p-4 mb-4 overflow-y-auto">
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
            <div className="flex gap-2 overflow-x-auto whitespace-nowrap scrollbar-thin"
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
        </div>
      </div>
    </div>
  )
}
