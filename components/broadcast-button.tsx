import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Square, Loader2 } from "lucide-react"
import { useState, KeyboardEvent, useEffect } from "react"
import { useLanguageStore } from "@/hooks/use-language-store"
import { translations } from "@/lib/translations"
import { useIsMobile } from "@/hooks/use-mobile"

interface BroadcastButtonProps {
  isSessionActive: boolean
  onClick: () => Promise<void>
  dataChannel?: RTCDataChannel | null
}

export function BroadcastButton({ isSessionActive, onClick, dataChannel }: BroadcastButtonProps) {
  const [inputText, setInputText] = useState("")
  const [isChannelReady, setIsChannelReady] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { language } = useLanguageStore()
  const t = translations[language]
  const isMobile = useIsMobile()

  useEffect(() => {
    if (!dataChannel) {
      setIsChannelReady(false);
      return;
    }

    const handleStateChange = () => {
      setIsChannelReady(dataChannel.readyState === 'open');
    };

    // Set initial state
    setIsChannelReady(dataChannel.readyState === 'open');

    // Listen for state changes
    dataChannel.addEventListener('open', handleStateChange);
    dataChannel.addEventListener('close', handleStateChange);

    return () => {
      dataChannel.removeEventListener('open', handleStateChange);
      dataChannel.removeEventListener('close', handleStateChange);
    };
  }, [dataChannel]);

  const handleSubmit = () => {
    if (!dataChannel || !inputText.trim() || !isChannelReady) {
      console.error('DataChannel is not ready');
      return;
    }

    try {
      // Send user message
      const userMessage = {
        type: 'conversation.item.create',
        item: {
          type: 'message',
          role: 'user',
          content: [{
            type: 'input_text',
            text: inputText.trim()
          }]
        }
      };

      // Send the message
      dataChannel.send(JSON.stringify(userMessage));

      // Trigger the voice response
      const responseCreate = {
        type: 'response.create',
        response: {
          modalities: ['text', 'audio']
        }
      };

      dataChannel.send(JSON.stringify(responseCreate));
      setInputText(""); // Clear input after sending
    } catch (error) {
      console.error('Error sending message:', error);
    }
  }

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  }

  if (isMobile) {
    return (
      <Button
        variant={isSessionActive ? "destructive" : "default"}
        className="w-full py-6 text-lg font-medium flex items-center justify-center gap-2"
        onClick={async () => {
          setIsLoading(true)
          try {
            await onClick()
          } finally {
            setIsLoading(false)
          }
        }}
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            {t.buttons.starting}
          </>
        ) : isSessionActive ? (
          <>
            <Square className="h-5 w-5" />
            {t.buttons.stop}
          </>
        ) : (
          t.buttons.start
        )}
      </Button>
    )
  }

  if (!isSessionActive) {
    return (
      <Button
        variant="default"
        className="w-full py-6 text-lg font-medium flex items-center justify-center gap-2 motion-preset-shake"
        onClick={async () => {
          setIsLoading(true)
          try {
            await onClick()
          } finally {
            setIsLoading(false)
          }
        }}
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            {t.buttons.starting}
          </>
        ) : (
          t.buttons.start
        )}
      </Button>
    )
  }

  // Desktop version with text input
  return (
    <div className="flex gap-2 w-full" dir={language === 'he' ? 'rtl' : 'ltr'}>
      <Input
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder={isChannelReady ? t.input.placeholder : t.input.connecting}
        disabled={!isChannelReady}
        className="flex-1 py-6 text-lg disabled:opacity-50"
      />
      <Button
        variant="default"
        size="icon"
        onClick={handleSubmit}
        disabled={!isChannelReady || !inputText.trim()}
        className="py-6"
        aria-label={t.buttons.send}
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
          <path d="m3 3 3 9-3 9 19-9Z" />
        </svg>
      </Button>
      <Button
        variant="destructive"
        size="icon"
        onClick={onClick}
        className="py-6"
        aria-label={t.buttons.stop}
      >
        <Square className="h-5 w-5" />
      </Button>
    </div>
  )
}
