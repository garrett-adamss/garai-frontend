"use client"

import React, { useState } from "react"
import { Moon, Send, Sun, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

// Initial AI message
const initialMessages = [
  { content: "Hi, I’m GarAi, here to answer your questions as Garrett. Ask me anything about his skills, experience, or projects, and I’ll respond just like he would. Let’s chat!", sender: "ai" }
]

export default function ChatGPTReplica() {
  const [messages, setMessages] = useState(initialMessages) // Initial message always present
  const [inputMessage, setInputMessage] = useState("")
  const [isDarkTheme, setIsDarkTheme] = useState(false)
  const [loading, setLoading] = useState(false) // To handle loading state for API call

  const suggestions = [
    "What is GarAi?",
    "What was your last role?",
    "Where do you want to be in 5 years?",
    "What are some of your goals?",
  ]

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
    setInputMessage(suggestion) // Fill the input with the suggestion, but don't send it
  }

  const toggleTheme = () => {
    setIsDarkTheme(!isDarkTheme)
  }

  return (
    <div className={`h-screen flex flex-col ${isDarkTheme ? "dark" : ""}`}>
      <div className="flex-1 bg-background text-foreground overflow-hidden">
        <div className="container mx-auto p-4 flex flex-col h-full max-w-4xl">
          <header className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold flex items-center">
              GarAI
              <Star className="h-5 w-5 ml-2 text-yellow-400" fill="currentColor" />
            </h1>
            <Button variant="ghost" size="icon" onClick={toggleTheme}>
              {isDarkTheme ? <Sun className="h-[1.2rem] w-[1.2rem]" /> : <Moon className="h-[1.2rem] w-[1.2rem]" />}
            </Button>
          </header>
          <ScrollArea className="flex-1 border rounded-md p-4 mb-4">
            {messages.map((message, index) => (
              <div key={index} className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"} mb-4`}>
                <div className={`flex items-start ${message.sender === "user" ? "flex-row-reverse" : ""}`}>
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={message.sender === "user" ? "/user-avatar.png" : "/ai-avatar.png"} />
                    <AvatarFallback>{message.sender === "user" ? "U" : "AI"}</AvatarFallback>
                  </Avatar>
                  <div
                    className={`mx-2 p-3 rounded-lg ${
                      message.sender === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-secondary-foreground"
                    }`}
                  >
                    {message.content}
                  </div>
                </div>
              </div>
            ))}
          </ScrollArea>
          <div className="mb-4">
            <h2 className="text-sm font-semibold mb-2">Suggestions:</h2>
            <div className="flex flex-wrap gap-2">
              {suggestions.map((suggestion, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => handleSuggestionClick(suggestion)} // Just fills the input
                >
                  {suggestion}
                </Button>
              ))}
            </div>
          </div>
          <div className="flex items-center">
            <Input
              type="text"
              placeholder="Type your message..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter" && !loading) handleSendMessage(inputMessage)
              }}
              className="flex-1 mr-2 rounded-full"
              disabled={loading} // Disable input when loading
            />
            <Button onClick={() => handleSendMessage(inputMessage)} className="rounded-full" disabled={loading}>
              {loading ? "..." : <><Send className="h-4 w-4 mr-2" />Send</>}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
