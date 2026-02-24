"use client"

import { useEffect, useState } from "react"
import ImageCms from "@/components/utils/imageCms/imageCms"
// import Link from "next/link"

const Slideshow = ({ slideshowData = [], lang = "en" }) => {
  const shuffled = [...slideshowData].sort(() => 0.5 - Math.random())
  const [orderedSlides] = useState(shuffled)
  const [current, setCurrent] = useState(0)

  useEffect(() => { 
    if (!orderedSlides.length) return

    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % orderedSlides.length)
    }, 6000)
    return () => clearInterval(interval)
  }, [orderedSlides])

  if (!slideshowData.length) {
    return <div className="slideshow-empty"></div>
  }

  const currentSlide = orderedSlides[current]

  const slideTitle = currentSlide
    ? typeof currentSlide.title === "object"
      ? currentSlide.title[lang] || currentSlide.title.en || "Untitled"
      : currentSlide.title || "Untitled"
    : ""

  return (
    <div className="slideshow">
      {orderedSlides.map((slide, index) => (
        <div
          key={index}
          className={`slideshow__image ${index === current ? "slideshow__image--active" : ""}`}
        >
          <ImageCms
            image={slide.image}
            alt={
              slide.subtitle && typeof slide.subtitle === "object"
                ? slide.subtitle[lang] || slide.subtitle.en || slide.title?.[lang] || slide.title?.en || "Image"
                : slide.title?.[lang] || slide.title?.en || "Image"
            }
            className="hero__image"
          />
        </div>
      ))}

      {slideTitle && (
        <div className="slideshow__title">
          <span>{slideTitle}</span>
        </div>
      )}
      
      <div className="sr-only">
        {lang === "de" 
          ? `Bild ${current + 1} von ${orderedSlides.length}. Slideshow wechselt automatisch alle 6 Sekunden.`
          : `Image ${current + 1} of ${orderedSlides.length}. Slideshow changes automatically every 6 seconds.`
        }
      </div>
    </div>
  )
}

export default Slideshow
