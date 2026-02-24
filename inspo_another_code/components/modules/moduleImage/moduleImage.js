import ImageCms from "../../utils/imageCms/imageCms"

const TeaserImage = ({ image, alt = "", lang = "en" }) => {
  if (!image) return null

  const altText = alt
    ? lang === "de"
      ? `Teaser-Bild für: ${alt}`
      : `Teaser image for: ${alt}`
    : lang === "de"
      ? "Teaser-Bild"
      : "Teaser image"

  return (
    <div className="teaserImage">
      <ImageCms image={image} alt={altText} />
    </div>
  )
}

export default TeaserImage
