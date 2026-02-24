import ImageCms from "@/components/utils/imageCms/imageCms"

const WrapperImage = ({ wrapper, lang = "en" }) => {
  if (!wrapper || !wrapper.image) return null

  const altText = wrapper.image?.alt
    ? typeof wrapper.image.alt === 'object'
      ? wrapper.image.alt[lang] || wrapper.image.alt.en || ""
      : wrapper.image.alt
    : ""

  return (
    <div className="wrapper wrapper-image">
      <ImageCms image={wrapper.image} alt={altText} />
    </div>
  )
}

export default WrapperImage

