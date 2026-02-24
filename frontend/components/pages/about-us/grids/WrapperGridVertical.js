import WrapperRenderer from "../wrappers"

const WrapperGridVertical = ({ grid, lang = "en" }) => {
  if (!grid) return null

  const wrapperItems = grid.wrapper || []

  return (
    <li className="grid-wrapper grid-wrapper--vertical">
      {wrapperItems.map((wrapper, idx) => (
        <WrapperRenderer key={wrapper._key || idx} wrapper={wrapper} lang={lang} />
      ))}
    </li>
  )
}

export default WrapperGridVertical

