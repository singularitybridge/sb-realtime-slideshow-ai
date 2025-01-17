"use client"

import React, { useEffect, useState } from "react"
import useWebRTCAudioSession from "@/hooks/use-webrtc"
import { tools } from "@/lib/tools"
import { VoiceSelector } from "@/components/voice-select"
import { BroadcastButton } from "@/components/broadcast-button"
import { StatusDisplay } from "@/components/status"
import { TokenUsageDisplay } from "@/components/token-usage"
import { MessageControls } from "@/components/message-controls"
import { ToolsEducation } from "@/components/tools-education"
import { motion } from "framer-motion"
import { useToolsFunctions } from "@/hooks/use-tools"
import { SecuritySlides } from "@/components/security-slides"

const App: React.FC = () => {
  // State for voice selection
  const [voice, setVoice] = useState("ash")

  // WebRTC Audio Session Hook
  const {
    status,
    isSessionActive,
    registerFunction,
    handleStartStopClick,
    msgs,
    conversation
  } = useWebRTCAudioSession(voice, tools)

  // Get all tools functions
  const toolsFunctions = useToolsFunctions();

  useEffect(() => {
    // Register all functions by iterating over the object
    Object.entries(toolsFunctions).forEach(([name, func]) => {
      const functionNames: Record<string, string> = {
        getCurrentSlideFunction: 'getCurrentSlide',
        nextSlideFunction: 'nextSlide',
        prevSlideFunction: 'prevSlide',
        timeFunction: 'getCurrentTime',
        backgroundFunction: 'changeBackgroundColor',
        partyFunction: 'partyMode',
        launchWebsite: 'launchWebsite', 
        copyToClipboard: 'copyToClipboard',
        scrapeWebsite: 'scrapeWebsite'
      };
      
      registerFunction(functionNames[name], func);
    });
  }, [registerFunction, toolsFunctions])

  return (
    <main className="h-screen p-8">
      <div className="h-full grid grid-cols-3 gap-8">
        <motion.div 
          className="col-span-2 bg-white rounded-lg shadow-xl overflow-hidden"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <SecuritySlides />
        </motion.div>

        <motion.div
          className="col-span-1 bg-white rounded-lg shadow-xl overflow-hidden"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          <div className="p-6 space-y-4">
            <VoiceSelector value={voice} onValueChange={setVoice} />
            
            <div className="flex flex-col items-center gap-4">
              <BroadcastButton 
                isSessionActive={isSessionActive} 
                onClick={handleStartStopClick}
              />
            </div>
            
            {msgs.length > 4 && <TokenUsageDisplay messages={msgs} />}
            
            {status && (
              <motion.div 
                className="w-full flex flex-col gap-2"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <MessageControls conversation={conversation} msgs={msgs} />
              </motion.div>
            )}
            
            {status && <StatusDisplay status={status} />}
            
            <div className="w-full flex flex-col items-center gap-4">
              <ToolsEducation />
            </div>
          </div>
        </motion.div>
      </div>
    </main>
  )
}

export default App;
