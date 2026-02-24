"use client"

import { useEffect, useState } from "react"
import ImageCms from "@/components/utils/imageCms/imageCms"
// import Link from "next/link"

const ArtistSlideshow = ({ artistData = [], lang = "en" }) => {
  const shuffled = [...artistData].sort(() => 0.5 - Math.random())
  const [orderedArtists] = useState(shuffled)
  const [current, setCurrent] = useState(0)

  useEffect(() => { 
    if (!orderedArtists.length) return

    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % orderedArtists.length)
    }, 6000)
    return () => clearInterval(interval)
  }, [orderedArtists])

  if (!artistData.length) {
    return <div className="artist-slideshow-empty"></div>
  }

  const currentArtist = orderedArtists[current]

  const artistTitle = currentArtist
    ? typeof currentArtist.title === "object"
      ? currentArtist.title[lang] || currentArtist.title.en || "Untitled"
      : currentArtist.title || "Untitled"
    : ""

  // const artistLink = currentArtist?.slug?.current ? `/${lang}/artists/${currentArtist.slug.current}` : null

  return (
    <div className="artist-slideshow">
      {orderedArtists.map((artist, index) => (
        <div
          key={index}
          className={`artist-slideshow__image ${index === current ? "artist-slideshow__image--active" : ""}`}
        >
      <ImageCms
        image={artist.image}
        alt={
          artist.subtitle && typeof artist.subtitle === "object"
            ? artist.subtitle[lang] || artist.subtitle.en || artist.title?.[lang] || artist.title?.en || "Artwork"
            : artist.title?.[lang] || artist.title?.en || "Artwork"
        }
        className="hero__image"
      />


        </div>
      ))}

      {artistTitle && (
        <div className="artist-slideshow__title">
          <span>{artistTitle}</span>
        </div>
      )}
      
      <div className="sr-only">
        {lang === "de" 
          ? `Bild ${current + 1} von ${orderedArtists.length}. Slideshow wechselt automatisch alle 6 Sekunden.`
          : `Image ${current + 1} of ${orderedArtists.length}. Slideshow changes automatically every 6 seconds.`
        }
      </div>
      
    </div>
  )
}

export default ArtistSlideshow
