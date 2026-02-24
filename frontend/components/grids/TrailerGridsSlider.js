"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { Swiper, SwiperSlide } from "swiper/react"
import SwiperCore, { Navigation, Pagination } from "swiper"
import "swiper/css"
import "swiper/css/navigation"
import "swiper/css/pagination"
import GridRenderer from "./index"

SwiperCore.use([Navigation, Pagination])

const MOBILE_BREAKPOINT = 780

const TrailerGridsSlider = ({ grids = [], lang = "en", pageType = "trailer", controlsOnly = false, sliderId = "default" }) => {
  const totalItems = grids.length
  const [currentIndex, setCurrentIndex] = useState(0)
  const [swiperInstance, setSwiperInstance] = useState(null)
  const [swiperKey, setSwiperKey] = useState(Date.now())
  const [isHovered, setIsHovered] = useState(false)
  const [mouseX, setMouseX] = useState(0)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const containerRef = useRef(null)

  useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT}px)`)
    const update = () => setIsMobile(mql.matches)
    update()
    mql.addEventListener("change", update)
    return () => mql.removeEventListener("change", update)
  }, [])

  const slidesVisible = isMobile ? 1 : 3
  const lastCenteredIndex = Math.max(0, totalItems - slidesVisible)
  const canGoPrev = currentIndex > 0
  const canGoNext = currentIndex < lastCenteredIndex

  useEffect(() => {
    setCurrentIndex(0)
    setSwiperKey(Date.now())
  }, [grids])

  useEffect(() => {
    if (swiperInstance) {
      setTimeout(() => {
        swiperInstance.slideTo(0, 0)
      }, 0)
    }
  }, [swiperInstance])

  const scrollToIndex = useCallback((index) => {
    if (!swiperInstance) return
    const clamped = Math.max(0, Math.min(index, totalItems - 1))
    swiperInstance.slideTo(clamped)
  }, [swiperInstance, totalItems])

  const handlePrev = useCallback(() => {
    if (!canGoPrev || !swiperInstance) return
    swiperInstance.slidePrev()
  }, [canGoPrev, swiperInstance])

  const handleNext = useCallback(() => {
    if (!canGoNext || !swiperInstance) return
    swiperInstance.slideNext()
  }, [canGoNext, swiperInstance])

  const scrollToIndexRef = useRef(scrollToIndex)
  useEffect(() => {
    scrollToIndexRef.current = scrollToIndex
  }, [scrollToIndex])

  const handlePrevRef = useRef(handlePrev)
  const handleNextRef = useRef(handleNext)
  
  useEffect(() => {
    handlePrevRef.current = handlePrev
    handleNextRef.current = handleNext
  }, [handlePrev, handleNext])

  useEffect(() => {
    const handleMove = (event) => {
      if (!event?.detail || event.detail.sliderId !== sliderId) return
      if (event.detail.direction === "prev") {
        handlePrevRef.current()
      }
      if (event.detail.direction === "next") {
        handleNextRef.current()
      }
    }

    if (typeof window !== "undefined") {
      window.addEventListener("trailerSlider:move", handleMove)
    }
    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("trailerSlider:move", handleMove)
      }
    }
  }, [sliderId])

  useEffect(() => {
    if (typeof window === "undefined") return

    const checkModalState = () => {
      const modalOpen = document.querySelector('.modal-overlay--open')
      setIsModalOpen(!!modalOpen)
    }

    checkModalState()

    const observer = new MutationObserver(checkModalState)
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['class']
    })

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window[`trailerSlider_${sliderId}`] = {
        scrollToIndex: (index) => {
          scrollToIndexRef.current(index)
        },
        currentIndex,
        totalItems,
        canGoPrev,
        canGoNext,
        setCurrentIndex,
        lastCenteredIndex,
      }
    }
    return () => {
      if (typeof window !== 'undefined') {
        delete window[`trailerSlider_${sliderId}`]
      }
    }
  }, [currentIndex, totalItems, canGoPrev, canGoNext, lastCenteredIndex, sliderId])

  if (grids.length === 0) return null

  if (controlsOnly) {
    return <TrailerSliderControls sliderId={sliderId} lang={lang} />
  }

  const onMouseMove = (e) => {
    const rect = containerRef.current?.getBoundingClientRect()
    if (!rect) return
    setMouseX(e.clientX - rect.left)
  }

  const containerWidth = containerRef.current?.clientWidth || 0
  const isLeftSide = isHovered && containerWidth ? mouseX < containerWidth / 2 : false
  const showLeftArrow = (isMobile && canGoPrev) || (isHovered && isLeftSide && canGoPrev && totalItems > 1 && !isModalOpen)
  const showRightArrow = (isMobile && canGoNext) || (isHovered && !isLeftSide && canGoNext && totalItems > 1 && !isModalOpen)

  return (
    <div 
      className="trailer-grids-slider-wrapper"
      ref={containerRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseMove={onMouseMove}
    >
      {showLeftArrow && (
        <button
          className="trailer-grids-slider__arrow trailer-grids-slider__arrow--left"
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); handlePrev() }}
          aria-label={lang === "de" ? "Vorheriges Element" : "Previous item"}
          type="button"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M15 18L9 12L15 6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      )}

      {showRightArrow && (
        <button
          className="trailer-grids-slider__arrow trailer-grids-slider__arrow--right"
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleNext() }}
          aria-label={lang === "de" ? "Nächstes Element" : "Next item"}
          type="button"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M9 18L15 12L9 6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      )}

      <Swiper
        key={swiperKey}
        slidesPerView="auto"
        centeredSlides={false}
        spaceBetween={16}
        initialSlide={0}
        breakpoints={{
          0: { slidesPerView: 1, spaceBetween: 12 },
          781: { slidesPerView: "auto", spaceBetween: 16 },
        }}
        onSwiper={(swiper) => {
          setSwiperInstance(swiper)
          swiper.slideTo(0, 0)
        }}
        onRealIndexChange={(swiper) => {
          setCurrentIndex(swiper.realIndex)
        }}
        className="trailer-grids-slider"
        speed={600}
        loop={false}
        grabCursor={true}
        touchEventsTarget="container"
      >
        {grids.map((grid, idx) => (
          <SwiperSlide key={grid._key || idx} className="trailer-grids-slider__slide">
            <GridRenderer 
              grid={grid} 
              lang={lang} 
              pageType={pageType}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  )
}

export const TrailerSliderDots = ({ sliderId = "default", lang = "en" }) => {
  const [sliderState, setSliderState] = useState(null)

  useEffect(() => {
    const checkSlider = () => {
      if (typeof window !== 'undefined' && window[`trailerSlider_${sliderId}`]) {
        const state = window[`trailerSlider_${sliderId}`]
        const newState = {
          ...state,
          currentIndex: state.currentIndex,
          totalItems: state.totalItems,
          scrollToIndex: state.scrollToIndex
        }
        setSliderState(newState)
      }
    }
    
    checkSlider()
    const interval = setInterval(checkSlider, 50)
    return () => clearInterval(interval)
  }, [sliderId])

  if (!sliderState || sliderState.totalItems <= 1) return null

  const slidesVisible = 3
  const lastCenteredIndex = sliderState.lastCenteredIndex ?? Math.max(0, sliderState.totalItems - slidesVisible)
  const visibleSlidesCount = lastCenteredIndex + 1

  const handleDotClick = (index) => {
    if (sliderState?.scrollToIndex && typeof sliderState.scrollToIndex === 'function') {
      sliderState.scrollToIndex(index)
    }
  }

  return (
    <div className="trailer-grids-slider__dots" role="tablist" aria-label={lang === "de" ? "Trailer Slider" : "Trailer Slider"}>
      {Array.from({ length: visibleSlidesCount }).map((_, idx) => {
        const isActive = idx === (sliderState.currentIndex ?? 0)
        return (
          <button
            key={`slider-dot-${idx}`}
            type="button"
            className={`trailer-grids-slider__dot${isActive ? " is-active" : ""}`}
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              handleDotClick(idx)
            }}
            aria-label={lang === "de" ? `Element ${idx + 1}` : `Item ${idx + 1}`}
            aria-current={isActive ? "true" : "false"}
          />
        )
      })}
    </div>
  )
}

export const TrailerSliderControls = ({ sliderId = "default", lang = "en" }) => {
  const [sliderState, setSliderState] = useState(null)

  useEffect(() => {
    const checkSlider = () => {
      if (typeof window !== 'undefined' && window[`trailerSlider_${sliderId}`]) {
        setSliderState(window[`trailerSlider_${sliderId}`])
      }
    }
    
    checkSlider()
    const interval = setInterval(checkSlider, 100)
    return () => clearInterval(interval)
  }, [sliderId])

  if (!sliderState || sliderState.totalItems <= 1) return null

  const handlePrev = () => {
    if (!sliderState?.canGoPrev) return
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("trailerSlider:move", {
        detail: { sliderId, direction: "prev" }
      }))
    }
  }

  const handleNext = () => {
    if (!sliderState?.canGoNext) return
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("trailerSlider:move", {
        detail: { sliderId, direction: "next" }
      }))
    }
  }

  return (
    <div className="trailer-grids-slider__controls">
      <button
        className="trailer-grids-slider__button trailer-grids-slider__button--prev"
        onClick={handlePrev}
        disabled={!sliderState.canGoPrev}
        aria-label={lang === "de" ? "Vorheriges Element" : "Previous item"}
        type="button"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
      
      <span className="trailer-grids-slider__counter">
        {sliderState.currentIndex + 1} / {sliderState.totalItems}
      </span>
      
      <button
        className="trailer-grids-slider__button trailer-grids-slider__button--next"
        onClick={handleNext}
        disabled={!sliderState.canGoNext}
        aria-label={lang === "de" ? "Nächstes Element" : "Next item"}
        type="button"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
    </div>
  )
}

export { TrailerGridsSlider as GridsSlider }
export default TrailerGridsSlider
