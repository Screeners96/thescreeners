import ImageCms from "../../utils/imageCms/imageCms"

const ProjectModuleSlider = ({ module, lang = "en" }) => {
  const images = module?.images || module?.slides || []
  
  if (images.length === 0) return null

  const bannerLabel = lang === "de" ? "Slider-Bild" : "Slider image"

  return (
    <div className="project-module-slider">
      {images.map((item, i) => {
        const image = item?.image || item
        const slideAlt = image?.alt && typeof image.alt === "object"
          ? image.alt[lang] || image.alt.en || ""
          : image?.alt || `${bannerLabel} ${i + 1}`

        return (
          <div key={item._key || i} className="project-module-slider__slide">
            <ImageCms image={image} alt={slideAlt} />
          </div>
        )
      })}
    </div>
  )
}

export default ProjectModuleSlider
