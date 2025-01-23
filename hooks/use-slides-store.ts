import { create } from 'zustand'

interface SlideBlock {
  title: string
  content: string
}

interface Slide {
  title: string
  description: string
  blocks: SlideBlock[]
}

interface SlideState {
  currentSlide: number
  totalSlides: number
  slides: Slide[]
  nextSlide: () => void
  prevSlide: () => void
  setTotalSlides: (total: number) => void
  setSlides: (slides: Slide[]) => void
  getCurrentSlideContent: () => Slide | null
  updateCurrentSlideTitle: (title: string) => void
}

export const useSlideStore = create<SlideState>((set, get) => ({
  currentSlide: 0,
  totalSlides: 0,
  nextSlide: () => set((state) => {
    if (state.currentSlide >= state.totalSlides - 1) {
      return {} // No change needed
    }
    return { currentSlide: state.currentSlide + 1 } as Partial<SlideState>
  }),
  prevSlide: () => set((state) => {
    if (state.currentSlide <= 0) {
      return {} // No change needed
    }
    return { currentSlide: state.currentSlide - 1 } as Partial<SlideState>
  }),
  slides: [],
  setTotalSlides: (total: number) => set({ totalSlides: total } as Partial<SlideState>),
  setSlides: (slides: Slide[]) => set({ slides } as Partial<SlideState>),
  getCurrentSlideContent: () => {
    const state = get()
    return state.slides[state.currentSlide] || null
  },
  updateCurrentSlideTitle: (title: string) => {
    const state = get()
    if (state.currentSlide >= 0 && state.currentSlide < state.slides.length) {
      const updatedSlides = [...state.slides]
      updatedSlides[state.currentSlide] = {
        ...updatedSlides[state.currentSlide],
        title
      }
      set({ slides: updatedSlides })
    }
  }
}))
