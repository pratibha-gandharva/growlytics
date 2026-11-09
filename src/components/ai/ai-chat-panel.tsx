import { useState, useRef, useEffect } from 'react'
import { useStudent } from '../../context/student-context'
import { isAIServiceConfigured, sendAIMessage, ChatMessage } from '../../services/ai-service'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { 
  Bot, 
  Send, 
  Sparkles, 
  X, 
  AlertCircle, 
  RotateCcw
} from 'lucide-react'

interface AIChatPanelProps {
  isOpen: boolean
  onClose: () => void
}

export function AIChatPanel({ isOpen, onClose }: AIChatPanelProps) {
  const { currentRole, evaluatedSkills, roadmap, projects, totalStudyMinutes } = useStudent()
  
  const configured = isAIServiceConfigured()

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: `Hello! I am your Growlytics AI Learning Companion. I'm here to help you prepare for **${currentRole.name}** internships. Ask me to explain concepts, generate practice quizzes, provide coding hints, or recommend portfolio ideas!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ])

  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  if (!isOpen) return null

  const starterPrompts = [
    `Explain how to prepare for ${currentRole.name.split(' ')[0]} technical interviews`,
    'Suggest a high-impact portfolio feature to demonstrate distributed caching',
    'Generate 3 practice questions on React render optimization',
    'Explain the difference between sequential scan and index scan in SQL'
  ]

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || input).trim()
    if (!text || loading) return

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }

    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setErrorMsg(null)

    if (!configured) {
      // Endpoint is intentionally not connected
      return
    }

    setLoading(true)

    try {
      const topGaps = evaluatedSkills
        .filter((s) => s.status !== 'Demonstrated')
        .slice(0, 3)
        .map((s) => s.skillName)

      const reply = await sendAIMessage([...messages, userMessage], {
        targetRole: currentRole.name,
        topGaps,
        completedTasksCount: roadmap.filter((r) => r.completed).length,
        totalStudyHours: Math.round((totalStudyMinutes / 60) * 10) / 10,
        recentProjects: projects.slice(0, 3).map((p) => p.title)
      })

      const assistantMessage: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch (err: any) {
      setErrorMsg(err?.message || 'Failed to communicate with AI endpoint.')
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 w-full sm:w-[420px] max-w-[calc(100vw-2rem)] h-[600px] max-h-[calc(100vh-5rem)] rounded-3xl border border-border bg-card shadow-2xl flex flex-col overflow-hidden animate-slide-up">
      {/* Header */}
      <div className="p-4 border-b border-border bg-gradient-to-r from-emerald-500/10 via-card to-background flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="font-bold text-xs sm:text-sm text-foreground">
                Growlytics AI Companion
              </h3>
              <Badge variant={configured ? 'success' : 'outline'} size="sm" className="text-[9px]">
                {configured ? 'Connected' : 'Setup Required'}
              </Badge>
            </div>
            <p className="text-[10px] text-muted-foreground">
              Personalized to {currentRole.name}
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-1.5 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground cursor-pointer"
          title="Close Companion"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Endpoint Notice if unconfigured */}
      {!configured && (
        <div className="p-3 bg-amber-500/10 border-b border-amber-500/20 text-xs text-amber-900 dark:text-amber-200 space-y-1">
          <div className="flex items-center gap-1.5 font-bold">
            <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            <span>Server-side AI Endpoint Not Configured</span>
          </div>
          <p className="text-[11px] leading-relaxed">
            In compliance with our application security architecture, AI keys are never stored on the frontend. To activate live AI responses, deploy a Firebase Cloud Function and set <code className="px-1 py-0.5 rounded bg-black/10 dark:bg-white/10 font-mono">VITE_AI_ENDPOINT_URL</code>.
          </p>
        </div>
      )}

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3.5 text-xs">
        {messages.map((msg) => {
          const isUser = msg.role === 'user'
          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl p-3 leading-relaxed ${
                  isUser
                    ? 'bg-primary text-primary-foreground font-medium rounded-tr-xs'
                    : 'bg-muted/70 text-foreground border border-border/60 rounded-tl-xs'
                }`}
              >
                <p className="whitespace-pre-wrap">{msg.content}</p>
              </div>
              <span className="text-[9px] text-muted-foreground mt-0.5 px-1">
                {msg.timestamp}
              </span>
            </div>
          )
        })}

        {loading && (
          <div className="flex items-center gap-2 text-muted-foreground text-xs p-2">
            <Bot className="w-4 h-4 animate-spin text-primary" />
            <span>Analyzing curriculum context...</span>
          </div>
        )}

        {errorMsg && (
          <div className="p-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-700 dark:text-red-300 text-xs flex items-center justify-between gap-2">
            <span>{errorMsg}</span>
            <button
              onClick={() => handleSend()}
              className="text-[10px] font-bold text-red-700 dark:text-red-300 hover:underline flex items-center gap-1 shrink-0"
            >
              <RotateCcw className="w-3 h-3" /> Retry
            </button>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Starter Prompts */}
      <div className="px-3 py-2 border-t border-border bg-card/60">
        <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-amber-500" /> Suggested Prompts
        </p>
        <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {starterPrompts.map((p, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(p)}
              className="text-[11px] px-2.5 py-1 rounded-xl border border-border bg-card hover:bg-muted text-muted-foreground hover:text-foreground whitespace-nowrap transition-colors cursor-pointer shrink-0"
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Input Form */}
      <div className="p-3 border-t border-border bg-card">
        <div className="flex items-end gap-2">
          <textarea
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={
              configured 
                ? `Ask about ${currentRole.name} interview prep...` 
                : 'AI endpoint setup required to chat...'
            }
            disabled={loading}
            className="flex-1 max-h-24 min-h-[38px] p-2.5 rounded-xl border border-input bg-background text-xs resize-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
          <Button
            size="sm"
            variant="sprout"
            disabled={!input.trim() || loading}
            onClick={() => handleSend()}
            className="h-[38px] px-3 shrink-0 cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>
    </div>
  )
}
