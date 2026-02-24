const WrapperTitle = ({ wrapper, lang = "en" }) => {
  if (!wrapper || !wrapper.title) return null

  const titleText = wrapper.title[lang] || wrapper.title.en || ""

  if (!titleText) return null

  return (
    <div className="wrapper wrapper-title">
      <h2 className="wrapper-title__text">{titleText}</h2>
    </div>
  )
}

export default WrapperTitle

