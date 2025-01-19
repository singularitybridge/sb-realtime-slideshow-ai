"use client"

import React, { useEffect } from "react"
import useWebRTCAudioSession from "@/hooks/use-webrtc"
import { tools } from "@/lib/tools"
import { openAIConfig } from "@/config/openai"
import { BroadcastButton } from "@/components/broadcast-button"
import { AvatarInfo } from "@/components/avatar-info"
import { StatusDisplay } from "@/components/status"
import { TokenUsageDisplay } from "@/components/token-usage"
import { MessageControls } from "@/components/message-controls"
import { MessageLogs } from "@/components/message-logs"
import { ToolsEducation } from "@/components/tools-education"
import { motion } from "framer-motion"
import { useToolsFunctions } from "@/hooks/use-tools"
import { SecuritySlides } from "@/components/security-slides"

const App: React.FC = () => {
  // WebRTC Audio Session Hook with fixed voice from config
  const {
    status,
    isSessionActive,
    registerFunction,
    handleStartStopClick,
    msgs,
    conversation
  } = useWebRTCAudioSession(openAIConfig.voice, tools)

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
          className="col-span-2 overflow-hidden"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <SecuritySlides />
        </motion.div>

        <motion.div
          className="col-span-1 overflow-hidden"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          <div className="p-6 flex flex-col h-full">
            {/* Top Section */}
            <div className="space-y-4">
              <AvatarInfo />
              <div className="flex flex-col items-center">
                <BroadcastButton 
                  isSessionActive={isSessionActive} 
                  onClick={handleStartStopClick}
                />
              </div>
            </div>

            {/* First Separator */}
            <div className="h-px bg-border my-6" />

            {/* Conversation Section */}
            {status && (
              <motion.div 
                className="flex-grow overflow-hidden"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <MessageControls conversation={conversation} />
              </motion.div>
            )}

            {/* Second Separator */}
            <div className="h-px bg-border my-6" />

            {/* Bottom Section */}
            <div className="space-y-4">
              {msgs.length > 4 && <TokenUsageDisplay messages={msgs} />}
              {status && <MessageLogs msgs={msgs} />}
              {status && <StatusDisplay status={status} />}
              <div className="w-full">
                <ToolsEducation />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </main>
  )
}

export default App;
