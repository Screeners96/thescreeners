import RTE from "@/components/utils/rte/rte"

const WrapperTextBig = ({ wrapper, lang = "en" }) => {
  if (!wrapper || !wrapper.bodyText) return null

  const bodyText = wrapper.bodyText[lang] || wrapper.bodyText.en || []

  if (!bodyText || bodyText.length === 0) return null

  return (
    <div className="wrapper wrapper-text-big">
      <RTE text={bodyText} lang={lang} />
    </div>
  )
}

export default WrapperTextBig

