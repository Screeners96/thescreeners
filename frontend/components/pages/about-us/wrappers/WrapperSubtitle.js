import RTE from "@/components/utils/rte/rte"

const WrapperSubtitle = ({ wrapper, lang = "en" }) => {
  if (!wrapper) return null

  const subtitle = wrapper.subtitle?.[lang] || wrapper.subtitle?.en || ""
  const bodyText = wrapper.bodyText?.[lang] || wrapper.bodyText?.en || []
  const color = wrapper.color || "grey"

  const hasContent = subtitle || (bodyText && bodyText.length > 0)
  if (!hasContent) return null

  return (
    <div className={`wrapper wrapper-subtitle wrapper-subtitle--${color}`}>
      {subtitle && <span className="wrapper-subtitle__title">{subtitle}</span>}
      {bodyText && bodyText.length > 0 && (
        <div className="wrapper-subtitle__body">
          <RTE text={bodyText} lang={lang} />
        </div>
      )}
    </div>
  )
}

export default WrapperSubtitle

