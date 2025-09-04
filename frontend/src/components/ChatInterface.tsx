'use client'

import { useState, useRef, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Send, Bot, User as UserIcon, Copy, RefreshCw, ThumbsUp, ThumbsDown, Sparkles, Mail, Clock, AlertCircle } from 'lucide-react'

interface Message {
  id: string
  type: 'user' | 'assistant'
  content: string
  timestamp: Date
  isTyping?: boolean
  feedback?: 'like' | 'dislike' | null
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

const generateEnhancedResponse = (message: string, emails: Email[]): string => {
  const lowerMessage = message.toLowerCase()

  // Email count queries
  if (lowerMessage.includes('how many') && lowerMessage.includes('email')) {
    const total = emails.length
    const summarized = emails.filter(e => e.summary).length
    const actionRequired = emails.filter(e =>
      e.summary?.action_required?.toLowerCase().includes('yes') ||
      e.summary?.action_required?.toLowerCase().includes('action')
    ).length

    return `📊 **Email Overview:**
• **Total emails:** ${total}
• **Summarized:** ${summarized}
• **Need action:** ${actionRequired}

${total > 0 ? "Would you like me to show you the emails that need your attention?" : "Your inbox is clean! 🎉"}`
  }

  // Action/urgent email queries
  if (lowerMessage.includes('action') || lowerMessage.includes('urgent')) {
    const actionEmails = emails.filter(e =>
      e.summary?.action_required?.toLowerCase().includes('yes') ||
      e.summary?.action_required?.toLowerCase().includes('action')
    )

    if (actionEmails.length === 0) {
      return `✅ **Great news!** No emails require immediate action right now. You're all caught up!`
    }

    const emailList = actionEmails.slice(0, 3).map(e =>
      `• **"${e.subject}"** from ${e.sender}`
    ).join('\n')

    return `⚡ **${actionEmails.length} emails need your attention:**

${emailList}

${actionEmails.length > 3 ? `...and ${actionEmails.length - 3} more emails.` : ''}

Would you like me to summarize any of these emails for you?`
  }

  // Today's emails
  if (lowerMessage.includes('today')) {
    const today = new Date()
    const todayEmails = emails.filter(e => {
      const emailDate = new Date(e.received_at)
      return emailDate.toDateString() === today.toDateString()
    })

    if (todayEmails.length === 0) {
      return `📭 **No new emails today!** You can focus on other tasks. 🎯`
    }

    const senders = [...new Set(todayEmails.map(e => e.sender))].slice(0, 3)

    return `📅 **Today's email summary:**
• **${todayEmails.length} new emails** received
• **Top senders:** ${senders.join(', ')}
• **Latest:** "${todayEmails[0]?.subject}" (${new Date(todayEmails[0]?.received_at).toLocaleTimeString()})

Would you like me to prioritize them for you?`
  }

  // Summary requests
  if (lowerMessage.includes('summary') || lowerMessage.includes('summarize')) {
    const recentEmails = emails.slice(0, 5)
    if (recentEmails.length === 0) {
      return `📝 No emails to summarize right now. Your inbox is empty!`
    }

    return `📝 **Recent email summaries:**

${recentEmails.map((e, i) =>
  `${i + 1}. **${e.subject}** (${e.sender})
   ${e.summary?.key_points || 'Not yet summarized'}`
).join('\n\n')}

Would you like more details about any of these emails?`
  }

  // Sender-specific queries
  if (lowerMessage.includes('from ') || lowerMessage.includes('sender')) {
    const senderCounts = emails.reduce((acc, e) => {
      acc[e.sender] = (acc[e.sender] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    const topSenders = Object.entries(senderCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([sender, count]) => `• **${sender}** (${count} emails)`)
      .join('\n')

    return `👥 **Top email senders:**

${topSenders}

Want me to show emails from a specific sender?`
  }

  // Greeting responses
  if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
    return `👋 **Hello there!** I'm your AI email assistant. I can help you:

🔍 **Analyze** your emails and find important ones
📊 **Summarize** email content and key points
⚡ **Identify** emails that need action
📅 **Review** today's or recent emails
👥 **Filter** emails by sender

What would you like to explore first?`
  }

  // Help requests
  if (lowerMessage.includes('help') || lowerMessage.includes('what can you do')) {
    return `🤖 **I'm here to help you manage your emails!** Here's what I can do:

**📊 Email Analytics:**
• Count total, unread, and summarized emails
• Identify emails requiring action
• Show today's email activity

**🔍 Smart Search:**
• Find emails by sender, subject, or content
• Filter by date ranges
• Locate urgent or important emails

**📝 AI Summaries:**
• Generate key points from email content
• Highlight action items and deadlines
• Provide conversation context

**💡 Smart Suggestions:**
• Recommend priority emails to read
• Suggest response templates
• Identify follow-up opportunities

Try asking: *"What emails need action?"* or *"Summarize today's emails"*`
  }

  // Default response with suggestions
  return `🤔 I'd be happy to help you with your emails! Here are some things you can ask me:

💬 **Try asking:**
• "How many emails do I have?"
• "What emails need action today?"
• "Show me emails from [sender name]"
• "Summarize my recent emails"
• "What are my top email senders?"

Or just tell me what you're looking for and I'll help you find it! ✨`
}

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'assistant',
      content: '👋 **Welcome to your AI Email Assistant!** I\'m here to help you manage and understand your emails better.\n\n🤖 I can help you with:\n• **Email analysis** and summaries\n• **Finding urgent** or important emails\n• **Tracking** email activity and trends\n• **Smart insights** about your inbox\n\nWhat would you like to explore first?',
      timestamp: new Date(),
    },
  ])
  const [inputMessage, setInputMessage] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [typingMessage, setTypingMessage] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const { data: emailData, isLoading } = useQuery({
    queryKey: ['emails'],
    queryFn: fetchEmails,
  })

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
    }
  }, [inputMessage])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, typingMessage])

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text.replace(/\*\*/g, '').replace(/•/g, '-'))
    } catch (err) {
      console.error('Failed to copy text: ', err)
    }
  }

  const handleFeedback = (messageId: string, feedback: 'like' | 'dislike') => {
    setMessages(prev => prev.map(msg =>
      msg.id === messageId
        ? { ...msg, feedback: msg.feedback === feedback ? null : feedback }
        : msg
    ))
  }

  const regenerateResponse = async (userMessage: string) => {
    setIsProcessing(true)

    setTimeout(() => {
      const response = generateEnhancedResponse(userMessage, emailData?.emails || [])
      const assistantMessage: Message = {
        id: Date.now().toString(),
        type: 'assistant',
        content: response,
        timestamp: new Date(),
      }
      setMessages(prev => [...prev, assistantMessage])
      setIsProcessing(false)
    }, 1000 + Math.random() * 1500)
  }

  const typeMessage = async (response: string) => {
    const words = response.split(' ')
    setTypingMessage('')

    for (let i = 0; i < words.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 50 + Math.random() * 100))
      setTypingMessage(words.slice(0, i + 1).join(' '))
    }

    const assistantMessage: Message = {
      id: Date.now().toString(),
      type: 'assistant',
      content: response,
      timestamp: new Date(),
    }
    setMessages(prev => [...prev, assistantMessage])
    setTypingMessage('')
    setIsProcessing(false)
  }

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isProcessing) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, userMessage])
    const currentMessage = inputMessage
    setInputMessage('')
    setIsProcessing(true)

    // Simulate more realistic AI response timing
    setTimeout(async () => {
      const response = generateEnhancedResponse(currentMessage, emailData?.emails || [])
      await typeMessage(response)
    }, 800 + Math.random() * 1200)
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
      <div className="text-center mb-8 fade-in-up">
        <h2 className="text-4xl font-bold text-gradient mb-4">AI Email Assistant</h2>
        <p className="text-gray-400 text-lg">Ask questions about your emails and get AI-powered insights</p>
      </div>

      {/* Chat Container */}
      <div className="glass rounded-2xl flex flex-col h-[600px] hover-glow">
        {/* Chat Header */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 gradient-animation rounded-full flex items-center justify-center">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-white">AI Assistant</h3>
                <p className="text-sm text-gray-400">
                  {isLoading ? 'Loading emails...' : `${emailData?.emails?.length || 0} emails available`}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-xs text-green-400">Online</span>
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
              } fade-in-up`}
            >
              <div className={`flex gap-3 max-w-[85%] ${
                message.type === 'user' ? 'flex-row-reverse' : 'flex-row'
              }`}>
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                    message.type === 'user'
                      ? 'gradient-animation text-white'
                      : 'glass text-blue-400'
                  }`}
                >
                  {message.type === 'user' ? (
                    <UserIcon className="w-5 h-5" />
                  ) : (
                    <Bot className="w-5 h-5" />
                  )}
                </div>
                <div className="flex flex-col space-y-2">
                  <div
                    className={`p-4 rounded-2xl transition-all duration-300 hover:scale-[1.02] ${
                      message.type === 'user'
                        ? 'gradient-animation text-white shadow-lg'
                        : 'dark-glass text-gray-300 border border-white/10'
                    }`}
                  >
                    <div
                      className="text-sm leading-relaxed"
                      dangerouslySetInnerHTML={{
                        __html: message.content
                          .replace(/\*\*(.*?)\*\*/g, '<strong class="text-white">$1</strong>')
                          .replace(/•/g, '•')
                          .replace(/\n/g, '<br>')
                      }}
                    />
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

                  {/* Message Actions */}
                  {message.type === 'assistant' && (
                    <div className="flex items-center gap-2 px-2">
                      <button
                        onClick={() => copyToClipboard(message.content)}
                        className="text-gray-500 hover:text-blue-400 p-1 rounded transition-colors"
                        title="Copy message"
                      >
                        <Copy className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => regenerateResponse(messages.find(m => m.type === 'user' && m.timestamp < message.timestamp)?.content || '')}
                        className="text-gray-500 hover:text-blue-400 p-1 rounded transition-colors"
                        title="Regenerate response"
                      >
                        <RefreshCw className="w-3 h-3" />
                      </button>
                      <div className="flex gap-1">
                        <button
                          onClick={() => handleFeedback(message.id, 'like')}
                          className={`p-1 rounded transition-colors ${
                            message.feedback === 'like'
                              ? 'text-green-400'
                              : 'text-gray-500 hover:text-green-400'
                          }`}
                          title="Good response"
                        >
                          <ThumbsUp className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => handleFeedback(message.id, 'dislike')}
                          className={`p-1 rounded transition-colors ${
                            message.feedback === 'dislike'
                              ? 'text-red-400'
                              : 'text-gray-500 hover:text-red-400'
                          }`}
                          title="Poor response"
                        >
                          <ThumbsDown className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}

          {/* Typing Animation */}
          {typingMessage && (
            <div className="flex gap-3 justify-start fade-in-up">
              <div className="flex gap-3 max-w-[85%]">
                <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 glass text-blue-400">
                  <Bot className="w-5 h-5" />
                </div>
                <div className="p-4 rounded-2xl dark-glass text-gray-300 border border-white/10">
                  <div
                    className="text-sm leading-relaxed"
                    dangerouslySetInnerHTML={{
                      __html: typingMessage
                        .replace(/\*\*(.*?)\*\*/g, '<strong class="text-white">$1</strong>')
                        .replace(/•/g, '•')
                        .replace(/\n/g, '<br>')
                    }}
                  />
                  <div className="flex items-center gap-1 mt-2">
                    <div className="w-1 h-1 bg-blue-400 rounded-full animate-pulse"></div>
                    <div className="w-1 h-1 bg-purple-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-1 h-1 bg-cyan-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Processing Animation */}
          {isProcessing && !typingMessage && (
            <div className="flex gap-3 justify-start fade-in-up">
              <div className="flex gap-3 max-w-[85%]">
                <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 glass text-blue-400">
                  <Bot className="w-5 h-5" />
                </div>
                <div className="p-4 rounded-2xl dark-glass text-gray-300 border border-white/10">
                  <div className="flex items-center gap-3">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                    <span className="text-sm text-gray-400">Analyzing your emails...</span>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-6 border-t border-white/10 bg-white/5 rounded-b-2xl">
          <div className="flex gap-3 items-end">
            <div className="flex-1 relative">
              <textarea
                ref={textareaRef}
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Ask me about your emails... (Press Enter to send, Shift+Enter for new line)"
                className="w-full p-4 pr-12 bg-white/5 border border-white/10 rounded-xl resize-none text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none transition-all duration-200 min-h-[52px] max-h-[120px]"
                rows={1}
                disabled={isProcessing}
                style={{ height: 'auto' }}
              />
              {inputMessage && (
                <div className="absolute bottom-2 right-2 text-xs text-gray-500">
                  {inputMessage.length}
                </div>
              )}
            </div>
            <button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isProcessing}
              className="group relative px-6 py-4 btn-primary rounded-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 min-h-[52px]"
            >
              {isProcessing ? (
                <div className="flex space-x-1">
                  <div className="w-1 h-1 bg-white rounded-full animate-bounce"></div>
                  <div className="w-1 h-1 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-1 h-1 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              ) : (
                <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
              )}
            </button>
          </div>

          {/* Enhanced Quick Actions */}
          <div className="mt-4 space-y-3">
            <div className="flex flex-wrap gap-2">
              <span className="text-xs text-gray-500 mr-2 flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                Quick questions:
              </span>
              {[
                { text: "How many emails do I have?", icon: Mail },
                { text: "What emails need action?", icon: AlertCircle },
                { text: "Show me today's emails", icon: Clock }
              ].map((item) => (
                <button
                  key={item.text}
                  onClick={() => setInputMessage(item.text)}
                  className="text-xs glass border border-white/10 text-gray-300 px-3 py-2 rounded-full hover:bg-white/10 hover:text-white transition-all duration-200 flex items-center gap-1"
                  disabled={isProcessing}
                >
                  <item.icon className="w-3 h-3" />
                  {item.text}
                </button>
              ))}
            </div>

            {/* Conversation Starters */}
            <div className="flex flex-wrap gap-2">
              <span className="text-xs text-gray-500 mr-2">💡 Try asking:</span>
              {[
                "Summarize my latest emails",
                "Find emails from specific sender",
                "Show urgent emails",
                "Help me prioritize"
              ].map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => setInputMessage(suggestion)}
                  className="text-xs text-gray-400 hover:text-blue-400 underline decoration-dotted underline-offset-2 transition-colors duration-200"
                  disabled={isProcessing}
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
