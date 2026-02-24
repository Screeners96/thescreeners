"use client"

import { Fragment, useEffect, useRef, useState, useCallback } from "react"
import { Swiper, SwiperSlide } from "swiper/react"
import "swiper/css"
import GridRenderer from "./grids"

const MOBILE_BREAKPOINT = 780

const AboutUsGridsSlider = ({ grids = [], lang = "en" }) => {
  const totalItems = grids.length
  const [currentIndex, setCurrentIndex] = useState(0)
  const [swiperInstance, setSwiperInstance] = useState(null)
  const [swiperKey, setSwiperKey] = useState(Date.now())
  const [isMobile, setIsMobile] = useState(false)
  const containerRef = useRef(null)

  useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT}px)`)
    const update = () => setIsMobile(mql.matches)
    update()
    mql.addEventListener("change", update)
    return () => mql.removeEventListener("change", update)
  }, [])

  const slidesVisible = 1
  const lastIndex = Math.max(0, totalItems - slidesVisible)
  const canGoPrev = currentIndex > 0
  const canGoNext = currentIndex < lastIndex

  useEffect(() => {
    setCurrentIndex(0)
    setSwiperKey(Date.now())
  }, [grids])

  useEffect(() => {
    if (swiperInstance) {
      setTimeout(() => swiperInstance.slideTo(0, 0), 0)
    }
  }, [swiperInstance])

  const handlePrev = useCallback(() => {
    if (!canGoPrev || !swiperInstance) return
    swiperInstance.slidePrev()
  }, [canGoPrev, swiperInstance])

  const handleNext = useCallback(() => {
    if (!canGoNext || !swiperInstance) return
    swiperInstance.slideNext()
  }, [canGoNext, swiperInstance])

  const renderGrid = useCallback(
    (grid, gridLang = lang) => <GridRenderer grid={grid} lang={gridLang} />,
    [lang]
  )

  if (!grids || grids.length === 0) return null

  if (!isMobile) {
    return (
      <ul className="about-us-main-grids">
        {grids.map((grid, idx) => (
          <Fragment key={grid._key || idx}>{renderGrid(grid, lang)}</Fragment>
        ))}
      </ul>
    )
  }

  return (
    <div
      className="about-us-grids-slider-wrapper"
      ref={containerRef}
    >
      {canGoPrev && (
        <button
          className="about-us-grids-slider__arrow about-us-grids-slider__arrow--left"
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            handlePrev()
          }}
          aria-label={lang === "de" ? "Vorheriges Element" : "Previous item"}
          type="button"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path
              d="M15 18L9 12L15 6"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      )}

      {canGoNext && (
        <button
          className="about-us-grids-slider__arrow about-us-grids-slider__arrow--right"
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            handleNext()
          }}
          aria-label={lang === "de" ? "Nächstes Element" : "Next item"}
          type="button"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path
              d="M9 18L15 12L9 6"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      )}

      <Swiper
        key={swiperKey}
        slidesPerView={1}
        spaceBetween={12}
        initialSlide={0}
        onSwiper={(swiper) => {
          setSwiperInstance(swiper)
          swiper.slideTo(0, 0)
        }}
        onRealIndexChange={(swiper) => setCurrentIndex(swiper.realIndex)}
        className="about-us-grids-slider"
        speed={600}
        loop={false}
        grabCursor={true}
        touchEventsTarget="container"
      >
        {grids.map((grid, idx) => (
          <SwiperSlide key={grid._key || idx} className="about-us-grids-slider__slide">
            {renderGrid(grid, lang)}
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  )
}

export default AboutUsGridsSlider
