import ImageCms from "../../utils/imageCms/imageCms"

const ProjectModuleImage = ({ module, lang = "en" }) => {
  if (!module?.image) return null

  const altText = module.image?.alt && typeof module.image.alt === "object"
    ? module.image.alt[lang] || module.image.alt.en || ""
    : module.image?.alt || ""

  return (
    <div className="project-module-image">
      <ImageCms image={module.image} alt={altText || "Image"} />
    </div>
  )
}

export default ProjectModuleImage
