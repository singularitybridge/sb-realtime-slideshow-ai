import React, { useEffect, useMemo } from 'react';
import { useSlideStore } from '@/hooks/use-slides-store';
import { Button } from './ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { translations } from '@/lib/translations';
import { useLanguageStore } from '@/hooks/use-language-store';
import { LanguageIcon } from '@heroicons/react/24/outline';
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


export const SecuritySlides = () => {
  const { currentSlide, nextSlide, prevSlide, setTotalSlides, setSlides, getCurrentSlideContent } = useSlideStore();
  const { language, setLanguage } = useLanguageStore();

  const t = translations[language];

  const slides: Slide[] = useMemo(() => [
    {
      title: t.slides.welcome.title,
      description: t.slides.welcome.description,
      blocks: [
        {
          id: uuidv4(),
          title: t.slides.welcome.blocks.voiceInteraction.title,
          content: t.slides.welcome.blocks.voiceInteraction.content
        },
        {
          id: uuidv4(),
          title: t.slides.welcome.blocks.realTimeUpdates.title,
          content: t.slides.welcome.blocks.realTimeUpdates.content
        },
        {
          id: uuidv4(),
          title: t.slides.welcome.blocks.smartNavigation.title,
          content: t.slides.welcome.blocks.smartNavigation.content
        }
      ]
    },
    {
      title: t.slides.capabilities.title,
      description: t.slides.capabilities.description,
      blocks: [
        {
          id: uuidv4(),
          title: t.slides.capabilities.blocks.contentGeneration.title,
          content: t.slides.capabilities.blocks.contentGeneration.content
        },
        {
          id: uuidv4(),
          title: t.slides.capabilities.blocks.interactiveLearning.title,
          content: t.slides.capabilities.blocks.interactiveLearning.content
        },
        {
          id: uuidv4(),
          title: t.slides.capabilities.blocks.customization.title,
          content: t.slides.capabilities.blocks.customization.content
        }
      ]
    },
    {
      title: t.slides.gettingStarted.title,
      description: t.slides.gettingStarted.description,
      blocks: [
        {
          id: uuidv4(),
          title: t.slides.gettingStarted.blocks.basicCommands.title,
          content: t.slides.gettingStarted.blocks.basicCommands.content
        },
        {
          id: uuidv4(),
          title: t.slides.gettingStarted.blocks.aiInteraction.title,
          content: t.slides.gettingStarted.blocks.aiInteraction.content
        },
        {
          id: uuidv4(),
          title: t.slides.gettingStarted.blocks.advancedFeatures.title,
          content: t.slides.gettingStarted.blocks.advancedFeatures.content
        }
      ]
    }
  ], [t]);

  useEffect(() => {
    setTotalSlides(slides.length);
    setSlides(slides);
  }, [setTotalSlides, setSlides]);

  return (
    <div className="h-full flex flex-col p-8" dir={language === 'he' ? 'rtl' : 'ltr'}>
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
                    className={`group bg-white hover:bg-gray-50 p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 ${language === 'he' ? 'text-right' : 'text-left'}`}
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
          {t.navigation.previous}
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

        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setLanguage(language === 'en' ? 'he' : 'en')}
            className="rounded-full"
          >
            <LanguageIcon className="w-5 h-5" />
          </Button>
          <Button
            onClick={nextSlide}
            variant="outline-purple"
            disabled={currentSlide === slides.length - 1}
          >
            {t.navigation.next}
          </Button>
        </div>
      </div>
    </div>
  );
};
