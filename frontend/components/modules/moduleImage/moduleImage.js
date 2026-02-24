import ImageCms from "../../utils/imageCms/imageCms"

const ModuleImage = ({ module, lang = "en" }) => {
  if (!module?.image) return null

  const flag = module.flagTitle && typeof module.flagTitle === "object" 
    ? module.flagTitle[lang] || module.flagTitle.en || "" 
    : ""

  const altText = module.image?.alt && typeof module.image.alt === "object"
    ? module.image.alt[lang] || module.image.alt.en || ""
    : module.image?.alt || ""

  return (
    <section className="moduleImage module">
      {flag && (
        <div className="module__flag" data-readable="true">
          <span>{flag}</span>
        </div>
      )}
      <div className="teaserImage">
        <ImageCms image={module.image} alt={altText || "Image"} />
      </div>
    </section>
  )
}

export default ModuleImage
