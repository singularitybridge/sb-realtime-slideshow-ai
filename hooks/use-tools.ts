"use client"

import { toast } from "sonner"
import { useSlideStore } from "@/hooks/use-slides-store"

export const useToolsFunctions = () => {
  const { nextSlide: next, prevSlide: prev, currentSlide, totalSlides, getCurrentSlideContent } = useSlideStore()

  const getCurrentSlideFunction = () => {
    const slide = getCurrentSlideContent()
    if (!slide) {
      return {
        success: false,
        message: "No slide content available"
      }
    }

    const formattedBlocks = slide.blocks.map(block => 
      `${block.title}:\n${block.content}`
    ).join('\n\n')

    return {
      success: true,
      content: {
        title: slide.title,
        description: slide.description,
        blocks: formattedBlocks
      },
      message: `Current slide (${currentSlide + 1}/${totalSlides}):\n\nTitle: ${slide.title}\n\nDescription: ${slide.description}\n\nKey Points:\n${formattedBlocks}`
    }
  }

  const nextSlideFunction = () => {
    if (currentSlide >= totalSlides - 1) {
      return {
        success: false,
        message: "Already at the last slide."
      }
    }
    next()
    toast("Next Slide →", {
      description: `Moved to slide ${currentSlide + 2} of ${totalSlides}`,
    })
    return {
      success: true,
      message: `Moved to slide ${currentSlide + 2} of ${totalSlides}`
    }
  }

  const prevSlideFunction = () => {
    if (currentSlide <= 0) {
      return {
        success: false,
        message: "Already at the first slide."
      }
    }
    prev()
    toast("← Previous Slide", {
      description: `Moved to slide ${currentSlide} of ${totalSlides}`,
    })
    return {
      success: true,
      message: `Moved to slide ${currentSlide} of ${totalSlides}`
    }
  }

  const timeFunction = () => {
    const now = new Date()
    return {
      success: true,
      time: now.toLocaleTimeString(),
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      message: "Current time is " + now.toLocaleTimeString() + " in " + Intl.DateTimeFormat().resolvedOptions().timeZone + " timezone."
    }
  }

  return {
    getCurrentSlideFunction,
    nextSlideFunction,
    prevSlideFunction,
    timeFunction
  }
}
