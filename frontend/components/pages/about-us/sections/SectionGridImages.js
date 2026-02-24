import BodyText from "@/components/bodyText/bodyText"
import ImageCms from "@/components/utils/imageCms/imageCms"

const SectionGridImages = ({ section, lang = "en" }) => {
  if (!section || section.sectionType !== 'gridImages') return null

  return (
    <div className="about-us-section about-us-section--grid-images" data-section-slug={section.slug}>
      
      {section.images && section.images.length > 0 && (
        <div className="section-images-grid">
          {section.images.map((image, idx) => {
            const altText = image?.alt 
              ? (typeof image.alt === 'object' ? image.alt[lang] || image.alt.en : image.alt)
              : ''
            
            return (
              <div key={idx} className="section-image-item">
                <ImageCms image={image} alt={altText} />
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default SectionGridImages

