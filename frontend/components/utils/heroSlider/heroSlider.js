"use client"

import { useEffect, useState } from "react"
import ImageCms from "../imageCms/imageCms"

const HeroSlider = ({ images = [], lang = "en", interval = 6000, className = "" }) => {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    if (!images.length || images.length <= 1) return

    const slideInterval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length)
    }, interval)

    return () => clearInterval(slideInterval)
  }, [images.length, interval])

  if (!images.length) {
    return <div className={`hero-slider hero-slider--empty ${className}`.trim()}></div>
  }

  if (images.length === 1) {
    const image = images[0]
    const altText = image?.alt && typeof image.alt === "object"
      ? image.alt[lang] || image.alt.en || "Hero image"
      : image?.alt || "Hero image"
    return (
      <div className={`hero-slider hero-slider--single ${className}`.trim()}>
        <ImageCms image={image} alt={altText} className="hero-slider__image" />
      </div>
    )
  }

  return (
    <div className={`hero-slider ${className}`.trim()}>
      {images.map((image, index) => {
        const altText = image?.alt && typeof image.alt === "object"
          ? image.alt[lang] || image.alt.en || `Hero image ${index + 1}`
          : image?.alt || `Hero image ${index + 1}`
        return (
          <div
            key={image.asset?._ref || image.asset?._id || index}
            className={`hero-slider__slide ${index === current ? "hero-slider__slide--active" : ""}`}
          >
            <ImageCms image={image} alt={altText} className="hero-slider__image" />
          </div>
        )
      })}
      
      <div className="sr-only">
        {lang === "de" 
          ? `Bild ${current + 1} von ${images.length}. Slideshow wechselt automatisch alle ${interval / 1000} Sekunden.`
          : `Image ${current + 1} of ${images.length}. Slideshow changes automatically every ${interval / 1000} seconds.`
        }
      </div>
    </div>
  )
}

export default HeroSlider

