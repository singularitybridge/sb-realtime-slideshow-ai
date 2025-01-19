"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import ThreeDotsWave from "@/components/ui/three-dots-wave";
import { Conversation } from "@/lib/conversations";

/**
* Decide if a conversation item should be displayed or filtered out. 
* Optional, this is used to filter out empty or useless user messages (e.g., final + empty text)
*/
function shouldDisplayMessage(): boolean {
  // Display all messages unconditionally
  return true;
}

/**
* Single conversation item
*/
function ConversationItem({ message }: { message: Conversation }) {
 const isUser = message.role === "user";
 const isAssistant = message.role === "assistant";
 const msgStatus = message.status;

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
           ? "max-w-[70%] border-gray-300/50" 
           : "max-w-[85%] border-purple-500/80"
       }`}
     >
       <div>
         {/* For user messages */}
         {isUser && (
           <>
             {/* Show text if it exists and isn't "Processing speech..." */}
             {message.text && message.text !== "Processing speech..." && (
               <p>{message.text}</p>
             )}
             
             {/* Show animation when speaking or processing */}
             {(msgStatus === "speaking" || msgStatus === "processing") && (
               <ThreeDotsWave />
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

 // Get the 4 most recent messages
 const displayableMessages = React.useMemo(() => {
   const filteredMessages = conversation.filter(shouldDisplayMessage);
   return filteredMessages.slice(-4);
 }, [conversation]);

 return (
   <div className="flex flex-col w-full h-full mx-auto overflow-hidden">
     {/* Header */}
     <div className="px-4 py-3 flex items-center justify-between">
       <div className="font-medium text-foreground dark:text-foreground">
        Conversation
       </div>
     </div>

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
