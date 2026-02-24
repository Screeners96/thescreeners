"use client"

import ImageCms from "../imageCms/imageCms"

const HeroImage = ({ image, alt, lang = "en", className = "" }) => {
  if (!image) return null

  const altText = alt || (image?.alt && typeof image.alt === "object"
    ? image.alt[lang] || image.alt.en || ""
    : image?.alt || "Hero image")

  return (
    <div className={`hero-image ${className}`.trim()}>
      <ImageCms image={image} alt={altText} className="hero-image__img" />
    </div>
  )
}

export default HeroImage

