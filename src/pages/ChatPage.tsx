import { useEffect, useRef } from 'react';
import { useChat } from '@/hooks/useChat';
import { ChatMessage } from '@/components/chat/ChatMessage';
import { ChatInput } from '@/components/chat/ChatInput';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const SUGGESTED_QUESTIONS = [
  '¿Cuál es el inventario total de todas las tiendas?',
  '¿Qué tiendas están en estado crítico?',
  '¿Cuál es la cobertura promedio?',
  'Muéstrame las tiendas con sobreinventario',
  '¿Cuál es el inventario de la Tienda 1?',
  'Dame un resumen de las ventas de mayo 2025',
];

export function ChatPage() {
  const { messages, sendMessage, clearChat, isLoading } = useChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Chat Asistente</h1>
          <p className="text-muted-foreground">
            Pregunta sobre inventarios, ventas y coberturas
          </p>
        </div>
        {messages.length > 0 && (
          <Button variant="outline" onClick={clearChat}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 mr-2"
            >
              <path d="M3 6h18" />
              <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
              <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
            </svg>
            Limpiar Chat
          </Button>
        )}
      </div>

      <Card className="flex-1 flex flex-col overflow-hidden">
        <CardContent className="flex-1 overflow-y-auto p-6">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center space-y-6">
              <div className="text-center space-y-2">
                <div className="flex justify-center mb-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-primary bg-primary/10">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      className="h-8 w-8 text-primary"
                    >
                      <path d="M12 8V4H8" />
                      <rect width="16" height="12" x="4" y="8" rx="2" />
                      <path d="M2 14h2" />
                      <path d="M20 14h2" />
                      <path d="M15 13v2" />
                      <path d="M9 13v2" />
                    </svg>
                  </div>
                </div>
                <h3 className="text-lg font-semibold">¡Hola! ¿En qué puedo ayudarte?</h3>
                <p className="text-sm text-muted-foreground max-w-md">
                  Puedo responder preguntas sobre inventarios, ventas, coberturas y
                  métricas de las tiendas.
                </p>
              </div>

              <div className="w-full max-w-2xl space-y-3">
                <p className="text-sm font-medium text-muted-foreground">
                  Preguntas sugeridas:
                </p>
                <div className="grid gap-2 sm:grid-cols-2">
                  {SUGGESTED_QUESTIONS.map((question, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      className="h-auto py-3 px-4 text-left justify-start whitespace-normal"
                      onClick={() => sendMessage(question)}
                      disabled={isLoading}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        className="h-4 w-4 mr-2 shrink-0 mt-0.5"
                      >
                        <circle cx="12" cy="12" r="10" />
                        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                        <path d="M12 17h.01" />
                      </svg>
                      <span className="text-sm">{question}</span>
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((message) => (
                <ChatMessage key={message.id} message={message} />
              ))}
              {isLoading && (
                <div className="flex w-full gap-3 mb-4">
                  <div className="flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-md border bg-primary text-primary-foreground">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      className="h-4 w-4"
                    >
                      <path d="M12 8V4H8" />
                      <rect width="16" height="12" x="4" y="8" rx="2" />
                      <path d="M2 14h2" />
                      <path d="M20 14h2" />
                      <path d="M15 13v2" />
                      <path d="M9 13v2" />
                    </svg>
                  </div>
                  <Card className="max-w-[80%] px-4 py-3 bg-muted">
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-[250px]" />
                      <Skeleton className="h-4 w-[200px]" />
                    </div>
                  </Card>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </CardContent>

        <div className="border-t p-4 bg-background">
          <ChatInput onSend={sendMessage} disabled={isLoading} />
        </div>
      </Card>
    </div>
  );
}
