import { useState } from 'react'
import Box from '@liveramp/motif/core/Box'
import IconButton from '@liveramp/motif/core/IconButton'
import { AutoAwesome, History, Build, DataSet, ShoppingCart, ArrowUpward, Clear } from '@liveramp/icons'

interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  text: string
}

const QUICK_ACTIONS = ['Find Asset', 'Suggest Segments', 'How to get started']

const SUGGESTED_PROMPTS = [
  { icon: History, text: 'Find segments like my last built segment' },
  { icon: Build, text: 'Find segments built in the last week' },
  { icon: DataSet, text: 'Find segments with clean room data' },
  { icon: ShoppingCart, text: 'Find segments with Marketplace segments' },
]

const ASSISTANT_REPLY = "This is a prototype, so I can't build real segments yet - but in the full product I'd turn that into a set of rules on the canvas."

function ChatBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === 'user'
  return (
    <Box
      sx={{
        alignSelf: isUser ? 'flex-end' : 'flex-start',
        maxWidth: '85%',
        bgcolor: isUser ? '#e4f9ec' : 'action.hover',
        borderRadius: 1.5,
        px: 2,
        py: 1.25,
        fontSize: 14,
      }}
    >
      {message.text}
    </Box>
  )
}

export function AssistantPanel({ onClose }: { onClose: () => void }) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [draftMessage, setDraftMessage] = useState('')

  function sendMessage(text: string) {
    const trimmed = text.trim()
    if (!trimmed) return
    setMessages((prev) => [
      ...prev,
      { id: `msg-${Date.now()}-u`, role: 'user', text: trimmed },
      { id: `msg-${Date.now()}-a`, role: 'assistant', text: ASSISTANT_REPLY },
    ])
    setDraftMessage('')
  }

  return (
    <Box
      sx={{
        width: 344,
        flexShrink: 0,
        bgcolor: 'background.paper',
        borderRight: '1px solid',
        borderColor: 'divider',
        boxShadow: 3,
        display: 'flex',
        flexDirection: 'column',
        zIndex: 11,
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', px: 1.5, pt: 1.5, flexShrink: 0 }}>
        <IconButton size="small" aria-label="Close panel" onClick={onClose}>
          <Clear sx={{ fontSize: 18 }} />
        </IconButton>
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1, minHeight: 0 }}>
        <Box sx={{ flexGrow: 1, overflow: 'auto', px: 3, pb: 3 }}>
          {messages.length === 0 ? (
            <>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <AutoAwesome sx={{ fontSize: 20, color: '#7c3aed' }} />
                <Box sx={{ fontSize: 18, fontWeight: 700 }}>How can I help you today?</Box>
              </Box>
              <Box sx={{ fontSize: 14, color: 'text.secondary', mb: 2.5 }}>
                I'm your segment strategy assistant. Ask me anything about building audiences.
              </Box>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 3 }}>
                {QUICK_ACTIONS.map((action) => (
                  <Box
                    key={action}
                    onClick={() => sendMessage(action)}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 0.5,
                      fontSize: 13,
                      fontWeight: 600,
                      color: '#4a2f9c',
                      bgcolor: '#ede7fb',
                      borderRadius: 10,
                      px: 1.5,
                      py: 0.75,
                      cursor: 'pointer',
                      '&:hover': { bgcolor: '#ddd2f7' },
                    }}
                  >
                    <AutoAwesome sx={{ fontSize: 14 }} />
                    {action}
                  </Box>
                ))}
              </Box>
              {SUGGESTED_PROMPTS.map(({ icon: Icon, text }) => (
                <Box
                  key={text}
                  onClick={() => sendMessage(text)}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.5,
                    fontSize: 14,
                    py: 1,
                    cursor: 'pointer',
                    color: 'text.secondary',
                    '&:hover': { color: 'text.primary' },
                  }}
                >
                  <Icon sx={{ fontSize: 18 }} />
                  {text}
                </Box>
              ))}
            </>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              {messages.map((message) => (
                <ChatBubble key={message.id} message={message} />
              ))}
            </Box>
          )}
        </Box>

        <Box sx={{ borderTop: '1px solid', borderColor: 'divider', p: 2, flexShrink: 0 }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'flex-end',
              gap: 1,
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 1.5,
              p: 1,
            }}
          >
            <Box
              component="textarea"
              rows={1}
              value={draftMessage}
              placeholder="Describe the audience you want to build..."
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setDraftMessage(e.target.value)}
              onKeyDown={(e: React.KeyboardEvent<HTMLTextAreaElement>) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  sendMessage(draftMessage)
                }
              }}
              sx={{
                flexGrow: 1,
                border: 'none',
                outline: 'none',
                resize: 'none',
                font: 'inherit',
                fontSize: 14,
                bgcolor: 'transparent',
              }}
            />
            <IconButton
              size="small"
              aria-label="Send message"
              onClick={() => sendMessage(draftMessage)}
              sx={{ bgcolor: 'success.main', color: 'white', '&:hover': { bgcolor: 'success.dark' } }}
            >
              <ArrowUpward sx={{ fontSize: 18 }} />
            </IconButton>
          </Box>
          {messages.length > 0 && (
            <Box
              onClick={() => setMessages([])}
              sx={{ fontSize: 13, color: 'primary.main', cursor: 'pointer', mt: 1, display: 'inline-block' }}
            >
              + New Chat
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  )
}
