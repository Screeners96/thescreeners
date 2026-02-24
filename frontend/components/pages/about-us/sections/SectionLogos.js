import { useState } from "react"
import BodyText from "@/components/bodyText/bodyText"
import ImageCms from "@/components/utils/imageCms/imageCms"

const SectionLogos = ({ section, lang = "en" }) => {
  if (!section || section.sectionType !== 'logos') return null

  const getOrientationFromMetadata = (image) => {
    if (!image?.asset?.metadata?.dimensions) return null
    
    const { width, height } = image.asset.metadata.dimensions
    return width > height ? 'landscape' : 'portrait'
  }

  const LogoItem = ({ image, idx, altText }) => {
    const [orientation, setOrientation] = useState(getOrientationFromMetadata(image))

    const handleImageLoad = (e) => {
      if (!orientation && e.target.naturalWidth && e.target.naturalHeight) {
        const detectedOrientation = e.target.naturalWidth > e.target.naturalHeight ? 'landscape' : 'portrait'
        setOrientation(detectedOrientation)
      }
    }

    const orientationClass = orientation ? `is${orientation.charAt(0).toUpperCase() + orientation.slice(1)}` : ''
    
    return (
      <div key={idx} className={`section-logo-item ${orientationClass}`}>
        <ImageCms 
          image={image} 
          alt={altText}
          onLoad={handleImageLoad}
        />
      </div>
    )
  }

  return (
    <div className="about-us-section about-us-section--logos" data-section-slug={section.slug}>
      
      {section.images && section.images.length > 0 && (
        <div className="section-logos-grid">
          {section.images.map((image, idx) => {
            const altText = image?.alt 
              ? (typeof image.alt === 'object' ? image.alt[lang] || image.alt.en : image.alt)
              : ''
            
            return (
              <LogoItem 
                key={idx}
                image={image} 
                idx={idx}
                altText={altText}
              />
            )
          })}
        </div>
      )}
    </div>
  )
}

export default SectionLogos

