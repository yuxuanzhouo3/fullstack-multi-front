"use client"

import { useState, useEffect, useRef } from "react"
import { useAuth } from "../providers"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Send, Search, MoreVertical, Shield, MessageCircle } from "lucide-react"

interface Message {
  id: string
  content: string
  sender_id: string
  sender_email: string
  timestamp: string
  encrypted: boolean
}

interface Chat {
  id: string
  name: string
  last_message: string
  timestamp: string
  unread_count: number
  online: boolean
  user_type: "renter" | "landlord"
}

export default function ChatPage() {
  const { user } = useAuth()
  const [selectedChat, setSelectedChat] = useState<string | null>(null)
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState<Message[]>([])
  const chats = [
    {
      id: "1",
      name: "John Smith (Landlord)",
      last_message: "The deposit has been processed successfully.",
      timestamp: "2 min ago",
      unread_count: 2,
      online: true,
      user_type: "landlord",
    },
    {
      id: "2",
      name: "Sarah Johnson (Renter)",
      last_message: "When can I schedule a viewing?",
      timestamp: "1 hour ago",
      unread_count: 0,
      online: false,
      user_type: "renter",
    },
    {
      id: "3",
      name: "Mike Davis (Landlord)",
      last_message: "The lease agreement is ready for review.",
      timestamp: "3 hours ago",
      unread_count: 1,
      online: true,
      user_type: "landlord",
    },
  ]
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (selectedChat) {
      // Simulate loading messages for selected chat
      setMessages([
        {
          id: "1",
          content: "Hi! I'm interested in the property listing.",
          sender_id: user?.id || "",
          sender_email: user?.email || "",
          timestamp: "10:30 AM",
          encrypted: true,
        },
        {
          id: "2",
          content: "Great! I'd be happy to help. The property is available for viewing this weekend.",
          sender_id: "other-user",
          sender_email: "landlord@example.com",
          timestamp: "10:32 AM",
          encrypted: true,
        },
        {
          id: "3",
          content: "Perfect! What time works best for you?",
          sender_id: user?.id || "",
          sender_email: user?.email || "",
          timestamp: "10:35 AM",
          encrypted: true,
        },
        {
          id: "4",
          content: "How about Saturday at 2 PM? Also, the deposit amount is $2,000.",
          sender_id: "other-user",
          sender_email: "landlord@example.com",
          timestamp: "10:40 AM",
          encrypted: true,
        },
      ])
    }
  }, [selectedChat, user])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSendMessage = () => {
    if (message.trim() && selectedChat) {
      const newMessage: Message = {
        id: Date.now().toString(),
        content: message,
        sender_id: user?.id || "",
        sender_email: user?.email || "",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        encrypted: true,
      }
      setMessages([...messages, newMessage])
      setMessage("")
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Please sign in to access chat</h1>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Secure Chat</h1>
            <p className="mt-2 text-gray-600 flex items-center">
              <Shield className="h-4 w-4 mr-2 text-green-500" />
              End-to-end encrypted messaging
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
            {/* Chat List */}
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle className="text-lg">Conversations</CardTitle>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input placeholder="Search conversations..." className="pl-10" />
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="space-y-1">
                  {chats.map((chat) => (
                    <div
                      key={chat.id}
                      onClick={() => setSelectedChat(chat.id)}
                      className={`p-4 cursor-pointer hover:bg-gray-50 border-b ${
                        selectedChat === chat.id ? "bg-blue-50 border-blue-200" : ""
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="relative">
                          <Avatar>
                            <AvatarFallback>
                              {chat.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          {chat.online && (
                            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium text-gray-900 truncate">{chat.name}</p>
                            <div className="flex items-center space-x-1">
                              {chat.unread_count > 0 && (
                                <Badge variant="destructive" className="text-xs">
                                  {chat.unread_count}
                                </Badge>
                              )}
                              <span className="text-xs text-gray-500">{chat.timestamp}</span>
                            </div>
                          </div>
                          <p className="text-sm text-gray-500 truncate">{chat.last_message}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Chat Messages */}
            <Card className="lg:col-span-2">
              {selectedChat ? (
                <>
                  <CardHeader className="border-b">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Avatar>
                          <AvatarFallback>
                            {chats
                              .find((c) => c.id === selectedChat)
                              ?.name.split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-medium">{chats.find((c) => c.id === selectedChat)?.name}</h3>
                          <p className="text-sm text-gray-500">
                            {chats.find((c) => c.id === selectedChat)?.online ? "Online" : "Last seen 2 hours ago"}
                          </p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="flex flex-col h-[400px]">
                    <div className="flex-1 overflow-y-auto space-y-4 p-4">
                      {messages.map((msg) => (
                        <div
                          key={msg.id}
                          className={`flex ${msg.sender_id === user.id ? "justify-end" : "justify-start"}`}
                        >
                          <div
                            className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                              msg.sender_id === user.id ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-900"
                            }`}
                          >
                            <p className="text-sm">{msg.content}</p>
                            <div className="flex items-center justify-between mt-1">
                              <span className="text-xs opacity-75">{msg.timestamp}</span>
                              {msg.encrypted && <Shield className="h-3 w-3 opacity-75" />}
                            </div>
                          </div>
                        </div>
                      ))}
                      <div ref={messagesEndRef} />
                    </div>
                    <div className="border-t p-4">
                      <div className="flex space-x-2">
                        <Input
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          placeholder="Type your message..."
                          onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                          className="flex-1"
                        />
                        <Button onClick={handleSendMessage} disabled={!message.trim()}>
                          <Send className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </>
              ) : (
                <CardContent className="flex items-center justify-center h-full">
                  <div className="text-center text-gray-500">
                    <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Select a conversation to start messaging</p>
                  </div>
                </CardContent>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
