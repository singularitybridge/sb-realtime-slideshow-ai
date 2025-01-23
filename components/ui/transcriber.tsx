"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import ThreeDotsWave from "@/components/ui/three-dots-wave";
import { Conversation } from "@/lib/conversations";

/**
* Decide if a conversation item should be displayed or filtered out. 
* Show messages that are either:
* - Non-final (in progress)
* - Final with non-empty text
*/
function shouldDisplayMessage(message: Conversation): boolean {
  // Always show non-final messages (for loading indicators)
  if (!message.isFinal) return true;
  
  // For final messages, only show if they have content
  return !!(message.text && message.text.trim() !== '');
}

/**
* Single conversation item
*/
function ConversationItem({ message }: { message: Conversation }) {
 const isUser = message.role === "user";
 const isAssistant = message.role === "assistant";

 return (
   <motion.div
     initial={{ opacity: 0, x: isUser ? 20 : -20, y: 10 }}
     animate={{ opacity: 1, x: 0, y: 0 }}
     exit={{ opacity: 0, x: isUser ? 20 : -20, y: -10 }}
     transition={{ duration: 0.4, ease: "easeInOut" }}
     className={`flex items-start ${isUser ? "justify-end" : ""}`}
   >
     {/* Message Bubble */}
     <div
       className={`text-foreground px-4 py-2 rounded-lg border motion-preset-slide-up-right ${
         isUser 
           ? "max-w-[70%] border-gray-300/50 bg-white" 
           : "max-w-[85%] border-purple-500/80 bg-purple-50/50"
       }`}
     >
       <div>
         {/* For user messages */}
         {isUser && (
           <>
             {/* Show loading indicator for non-final messages */}
             {!message.isFinal && (
               <ThreeDotsWave />
             )}
             
             {/* Show text content if available */}
             {message.text && message.text !== "Processing speech..." && (
               <p>{message.text}</p>
             )}
           </>
         )}
         
         {/* For assistant messages */}
         {isAssistant && (
           <p>{message.text}</p>
         )}
       </div>
     </div>
   </motion.div>
 );
}

interface TranscriberProps {
 conversation: Conversation[];
}


export default function Transcriber({ conversation }: TranscriberProps) {
 const scrollRef = React.useRef<HTMLDivElement>(null);
 // Scroll to bottom whenever conversation updates
 React.useEffect(() => {
   if (scrollRef.current) {
     scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
   }
 }, [conversation]);

 // Get the most recent messages, prioritizing user input
 const displayableMessages = React.useMemo(() => {
   const filteredMessages = conversation.filter(shouldDisplayMessage);
   
   // Find the last user message that's not final (active input)
   const lastUserMessage = filteredMessages.findLast(
     msg => msg.role === 'user' && !msg.isFinal
   );
   
   if (lastUserMessage) {
     // If there's active user input, show it and the previous message for context
     const userMessageIndex = filteredMessages.indexOf(lastUserMessage);
     return filteredMessages.slice(Math.max(0, userMessageIndex - 1), userMessageIndex + 1);
   }
   
   // Otherwise show the last 4 messages
   return filteredMessages.slice(-4);
 }, [conversation]);

 return (
   <div className="flex flex-col w-full h-full mx-auto overflow-hidden">
     {/* Body */}
     <div
       ref={scrollRef}
       className="flex-1 h-full overflow-y-auto p-4 space-y-4 z-50 scrollbar-thin scrollbar-thumb-primary"
     >
       <AnimatePresence mode="popLayout">
         {displayableMessages.map((message) => (
           <ConversationItem key={message.id} message={message} />
         ))}
       </AnimatePresence>
     </div>
   </div>
 );
}
