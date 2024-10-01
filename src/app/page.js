"use client"

import React, { useState } from "react"
import { Moon, Send, Sun, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function ChatGPTReplica() {
  const [messages, setMessages] = useState([])
  const [inputMessage, setInputMessage] = useState("")
  const [isDarkTheme, setIsDarkTheme] = useState(false)

  const suggestions = [
    "Tell me a joke",
    "What's the weather like?",
    "How does AI work?",
    "Recommend a book"
  ]

  const handleSendMessage = (message) => {
    if (message.trim() === "") return

    const newMessages = [
      ...messages,
      { content: message, sender: "user" },
      { content: "This is a mock AI response.", sender: "ai" },
    ]
    setMessages(newMessages)
    setInputMessage("")
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
              ChatGPT Replica
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
                  onClick={() => handleSendMessage(suggestion)}
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
                if (e.key === "Enter") handleSendMessage(inputMessage)
              }}
              className="flex-1 mr-2 rounded-full"
            />
            <Button onClick={() => handleSendMessage(inputMessage)} className="rounded-full">
              <Send className="h-4 w-4 mr-2" />
              Send
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}