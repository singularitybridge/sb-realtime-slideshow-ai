import { create } from 'zustand'

interface SlideState {
  currentSlide: number
  totalSlides: number
  nextSlide: () => void
  prevSlide: () => void
  setTotalSlides: (total: number) => void
}

export const useSlideStore = create<SlideState>((set) => ({
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
  setTotalSlides: (total: number) => set({ totalSlides: total } as Partial<SlideState>)
}))
