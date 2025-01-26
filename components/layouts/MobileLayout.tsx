import React from "react"
import { motion } from "framer-motion"
import { BroadcastButton } from "@/components/broadcast-button"
import { StatusDisplay } from "@/components/status"
import { MuteButton } from "@/components/mute-button"
import { SecuritySlides } from "@/components/security-slides"
import { useLanguageStore } from "@/hooks/use-language-store"
import { LanguageIcon } from "@heroicons/react/24/outline"
import { Button } from "@/components/ui/button"

interface MobileLayoutProps {
  status: string
  isSessionActive: boolean
  handleStartStopClick: () => Promise<void>
  audioStreamRef: React.MutableRefObject<MediaStream | null>
  dataChannelRef: React.MutableRefObject<RTCDataChannel | null>
}

export const MobileLayout: React.FC<MobileLayoutProps> = ({
  status,
  isSessionActive,
  handleStartStopClick,
  audioStreamRef,
  dataChannelRef,
}) => {
  const { language, setLanguage } = useLanguageStore()

  return (
    <main className="min-h-screen relative" dir={language === 'he' ? 'rtl' : 'ltr'}>
      {/* Main Content */}
      <div className="pb-24">
        <SecuritySlides />
      </div>

      {/* Sticky Control Panel */}
      <motion.div
        className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-purple-100 shadow-lg"
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="px-4 py-4 max-w-lg mx-auto">
          <div className="flex flex-col gap-2 w-full">
            {/* Controls Row */}
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setLanguage(language === 'en' ? 'he' : 'en')}
                className="rounded-full"
              >
                <LanguageIcon className="w-5 h-5" />
              </Button>
              <MuteButton audioStream={audioStreamRef.current} />
            </div>

            {/* Status and Full-width Button */}
            <div className="w-full">
              {status && (
                <div className="text-sm text-center mb-2">
                  <StatusDisplay status={status} />
                </div>
              )}
              <BroadcastButton 
                isSessionActive={isSessionActive} 
                onClick={handleStartStopClick}
                dataChannel={dataChannelRef.current}
              />
            </div>
          </div>
        </div>

        {/* Safe Area Padding for Mobile */}
        <div className="h-[env(safe-area-inset-bottom)]" />
      </motion.div>
    </main>
  )
}
