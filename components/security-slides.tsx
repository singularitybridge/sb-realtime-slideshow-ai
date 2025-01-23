import React, { useEffect } from 'react';
import { useSlideStore } from '@/hooks/use-slides-store';
import { Button } from './ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MicrophoneIcon,
  ArrowPathRoundedSquareIcon,
  CommandLineIcon,
  DocumentPlusIcon,
  ChatBubbleBottomCenterTextIcon,
  WrenchScrewdriverIcon,
  PlayCircleIcon,
  SparklesIcon,
  CpuChipIcon,
} from '@heroicons/react/24/outline';

import { v4 as uuidv4 } from 'uuid';

interface SlideBlock {
  id: string;
  title: string;
  content: string;
}

interface Slide {
  title: string;
  description: string;
  blocks: SlideBlock[];
}

const slides: Slide[] = [
  {
    title: "Welcome to AI-Powered Presentations",
    description: "Experience the future of presentations with our AI assistant. This innovative system combines real-time voice interaction, dynamic content generation, and intelligent slide management to create engaging and interactive presentations. Whether you're teaching, presenting, or brainstorming, our AI assistant is here to enhance your experience.",
    blocks: [
      {
        id: uuidv4(),
        title: "Voice Interaction",
        content: "Speak naturally with our AI assistant using advanced speech recognition and natural language processing technology."
      },
      {
        id: uuidv4(),
        title: "Real-time Updates",
        content: "Watch as your slides update dynamically based on your conversation with the AI, creating a truly interactive experience."
      },
      {
        id: uuidv4(),
        title: "Smart Navigation",
        content: "Effortlessly move between slides using voice commands or traditional controls, with AI-powered content organization."
      }
    ]
  },
  {
    title: "AI Capabilities & Features",
    description: "Our system leverages cutting-edge AI technology to provide a seamless and intuitive presentation experience. The AI assistant understands context, remembers previous interactions, and can adapt its responses to better suit your needs. With support for multiple languages and various presentation styles, it's designed to be versatile and user-friendly.",
    blocks: [
      {
        id: uuidv4(),
        title: "Content Generation",
        content: "The AI can help create, modify, and enhance slide content based on your instructions and requirements."
      },
      {
        id: uuidv4(),
        title: "Interactive Learning",
        content: "Engage in dynamic conversations with the AI to explore topics, ask questions, and deepen understanding."
      },
      {
        id: uuidv4(),
        title: "Customization",
        content: "Tailor the AI's behavior, voice, and personality to match your preferences and presentation style."
      }
    ]
  },
  {
    title: "Getting Started",
    description: "Begin your journey with our AI presentation system by exploring its core features. The system is designed to be intuitive while offering powerful capabilities. You can start with basic voice commands and gradually discover more advanced features as you become comfortable with the interface.",
    blocks: [
      {
        id: uuidv4(),
        title: "Basic Commands",
        content: "Start with simple voice commands like 'next slide', 'update title', or 'add content' to control your presentation."
      },
      {
        id: uuidv4(),
        title: "AI Interaction",
        content: "Engage in natural conversations with the AI to create, modify, and enhance your presentation content."
      },
      {
        id: uuidv4(),
        title: "Advanced Features",
        content: "Explore advanced capabilities like real-time content generation, dynamic updates, and interactive elements."
      }
    ]
  }
];

export const SecuritySlides = () => {
  const { currentSlide, nextSlide, prevSlide, setTotalSlides, setSlides, getCurrentSlideContent } = useSlideStore();

  useEffect(() => {
    setTotalSlides(slides.length);
    setSlides(slides);
  }, [setTotalSlides, setSlides]);

  return (
    <div className="h-full flex flex-col p-8">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
          transition={{ duration: 0.5 }}
          className="h-[calc(100%-3rem)]"
        >
          <div className="flex flex-col h-full">
            <div className="mb-12">
              <h1 className="text-3xl font-bold mb-6 text-primary">{getCurrentSlideContent()?.title}</h1>
              <p className="text-lg leading-relaxed text-gray-600">{getCurrentSlideContent()?.description}</p>
            </div>
            
            <div className="mt-auto mb-6">
              <div className="grid grid-cols-3 gap-6">
              {getCurrentSlideContent()?.blocks.map((block, index) => {
                const icons = [
                  [MicrophoneIcon, ArrowPathRoundedSquareIcon, CommandLineIcon],
                  [DocumentPlusIcon, ChatBubbleBottomCenterTextIcon, WrenchScrewdriverIcon],
                  [PlayCircleIcon, SparklesIcon, CpuChipIcon]
                ];
                const Icon = icons[currentSlide][index];
                
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.2 }}
                    className="group bg-white hover:bg-gray-50 p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200"
                  >
                    <div className="flex flex-col h-full">
                      <div className="mb-3">
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                            <Icon className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-slate-500 group-hover:text-primary transition-colors">
                              {block.title}
                            </h3>
                            <p className="text-xs text-gray-400">ID: {block.id}</p>
                          </div>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        {block.content}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="flex justify-between items-center h-12 px-4 py-8">
        <Button
          onClick={prevSlide}
          variant="outline-purple"
          disabled={currentSlide === 0}
        >
          Previous
        </Button>
        
        <div className="flex items-center gap-3">
          {slides.map((_, index) => (
            <div
              key={index}
              className={`w-8 h-8 flex items-center justify-center rounded-full text-base font-medium transition-all
                ${currentSlide === index 
                  ? 'border border-purple-500 text-purple-500 bg-white' 
                  : 'text-gray-500'
                }`}
            >
              {index + 1}
            </div>
          ))}
        </div>

        <Button
          onClick={nextSlide}
          variant="outline-purple"
          disabled={currentSlide === slides.length - 1}
        >
          Next
        </Button>
      </div>
    </div>
  );
};
