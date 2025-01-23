import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Square, Loader2 } from "lucide-react"
import { useState, KeyboardEvent, useEffect } from "react"

interface BroadcastButtonProps {
  isSessionActive: boolean
  onClick: () => Promise<void>
  dataChannel?: RTCDataChannel | null
}

export function BroadcastButton({ isSessionActive, onClick, dataChannel }: BroadcastButtonProps) {
  const [inputText, setInputText] = useState("")
  const [isChannelReady, setIsChannelReady] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

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
      // Stop any playing audio
      const audioElements = document.getElementsByTagName('audio');
      for (const audio of audioElements) {
        audio.pause();
      }

      // Create a unique ID for the message
      const messageId = crypto.randomUUID();

      // Add user message to conversation
      const conversationItem = {
      type: 'conversation.item.create',
      item: {
        id: messageId,
        type: 'message',
        role: 'user',
        content: [{
          type: 'input_text',
          text: inputText.trim()
        }],
        timestamp: new Date().toISOString()
      }
    };

      // Send the message
      dataChannel.send(JSON.stringify(conversationItem));

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
            Starting...
          </>
        ) : (
          "Start"
        )}
      </Button>
    )
  }

  return (
    <div className="flex gap-2 w-full">
      <Input
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder={isChannelReady ? "Type your message..." : "Connecting..."}
        disabled={!isChannelReady}
        className="flex-1 py-6 text-lg disabled:opacity-50"
      />
      <Button
        variant="destructive"
        size="icon"
        onClick={onClick}
        className="py-6"
      >
        <Square className="h-5 w-5" />
      </Button>
    </div>
  )
}
