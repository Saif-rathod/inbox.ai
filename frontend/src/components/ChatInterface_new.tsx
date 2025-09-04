'use client'

import { useState, useRef, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Send, Bot, User as UserIcon } from 'lucide-react'

interface Message {
  id: string
  type: 'user' | 'assistant'
  content: string
  timestamp: Date
}

interface Email {
  id: number
  sender: string
  subject: string
  body: string
  received_at: string
  summary?: {
    topic: string
    key_points: string
    action_required: string
  }
}

const API_BASE = 'http://localhost:8000'

const fetchEmails = async (): Promise<{ emails: Email[] }> => {
  const response = await fetch(`${API_BASE}/api/emails`)
  if (!response.ok) throw new Error('Failed to fetch emails')
  return response.json()
}

const generateMockResponse = (message: string, emails: Email[]): string => {
  const lowerMessage = message.toLowerCase()

  if (lowerMessage.includes('how many') && lowerMessage.includes('email')) {
    return `You have ${emails.length} emails in total. ${emails.filter(e => e.summary).length} of them have been summarized.`
  }

  if (lowerMessage.includes('action') || lowerMessage.includes('urgent')) {
    const actionEmails = emails.filter(e =>
      e.summary?.action_required?.toLowerCase().includes('yes') ||
      e.summary?.action_required?.toLowerCase().includes('action')
    )
    return `${actionEmails.length} emails require action. ${actionEmails.map(e => `"${e.subject}" from ${e.sender}`).slice(0, 3).join(', ')}`
  }

  if (lowerMessage.includes('today')) {
    const today = new Date()
    const todayEmails = emails.filter(e => {
      const emailDate = new Date(e.received_at)
      return emailDate.toDateString() === today.toDateString()
    })
    return `You received ${todayEmails.length} emails today.`
  }

  return "I'd be happy to help you with your emails! You can ask me about email counts, summaries, urgent emails, or specific senders."
}

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'assistant',
      content: '👋 Welcome to your AI Email Assistant! I can help you with questions about your emails, summaries, and provide insights. What would you like to know?',
      timestamp: new Date(),
    },
  ])
  const [inputMessage, setInputMessage] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const { data: emailData, isLoading } = useQuery({
    queryKey: ['emails'],
    queryFn: fetchEmails,
  })

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isProcessing) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputMessage('')
    setIsProcessing(true)

    // Simulate AI response
    setTimeout(() => {
      const response = generateMockResponse(inputMessage, emailData?.emails || [])
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: response,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, assistantMessage])
      setIsProcessing(false)
    }, 1500)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Page Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Email Assistant</h2>
        <p className="text-gray-600">Ask questions about your emails and get AI-powered insights</p>
      </div>

      {/* Chat Container */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col h-[600px]">
        {/* Chat Header */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">AI Assistant</h3>
                <p className="text-sm text-gray-500">
                  {isLoading ? 'Loading emails...' : `${emailData?.emails?.length || 0} emails available`}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span className="text-xs text-gray-500">Online</span>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${
                message.type === 'user' ? 'justify-end' : 'justify-start'
              } animate-fade-in`}
            >
              <div className={`flex gap-3 max-w-[80%] ${
                message.type === 'user' ? 'flex-row-reverse' : 'flex-row'
              }`}>
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    message.type === 'user'
                      ? 'bg-gradient-to-br from-blue-500 to-indigo-600 text-white'
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {message.type === 'user' ? (
                    <UserIcon className="w-4 h-4" />
                  ) : (
                    <Bot className="w-4 h-4" />
                  )}
                </div>
                <div
                  className={`p-4 rounded-2xl shadow-sm ${
                    message.type === 'user'
                      ? 'bg-gradient-to-br from-blue-500 to-indigo-600 text-white'
                      : 'bg-gray-50 text-gray-800 border border-gray-100'
                  }`}
                >
                  <p className="text-sm whitespace-pre-line leading-relaxed">{message.content}</p>
                  <p
                    className={`text-xs mt-2 ${
                      message.type === 'user' ? 'text-blue-100' : 'text-gray-500'
                    }`}
                  >
                    {message.timestamp.toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>
            </div>
          ))}

          {isProcessing && (
            <div className="flex gap-3 justify-start animate-fade-in">
              <div className="flex gap-3 max-w-[80%]">
                <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-gray-100 text-gray-600">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="p-4 rounded-2xl bg-gray-50 text-gray-800 border border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                    <span className="text-sm text-gray-600">Thinking...</span>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-6 border-t border-gray-100 bg-gray-50 rounded-b-2xl">
          <div className="flex gap-3">
            <textarea
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me about your emails..."
              className="flex-1 p-4 border border-gray-200 rounded-xl resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              rows={1}
              disabled={isProcessing}
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isProcessing}
              className="px-6 py-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl hover:from-blue-600 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Actions */}
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="text-xs text-gray-500 mr-2">Quick questions:</span>
            {[
              "How many emails do I have?",
              "What emails need action?",
              "Show me today's emails"
            ].map((question) => (
              <button
                key={question}
                onClick={() => setInputMessage(question)}
                className="text-xs bg-white border border-gray-200 text-gray-600 px-3 py-1 rounded-full hover:bg-gray-50 transition-colors duration-200"
                disabled={isProcessing}
              >
                {question}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
