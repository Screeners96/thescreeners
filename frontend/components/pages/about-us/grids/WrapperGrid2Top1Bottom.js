import WrapperRenderer from "../wrappers"

const WrapperGrid2Top1Bottom = ({ grid, lang = "en" }) => {
  if (!grid) return null

  const top = grid.top || []
  const bottomLeft = grid.bottomLeft || []
  const bottomRight = grid.bottomRight || []

  return (
    <li className="grid-wrapper grid-wrapper--2-top-1-bottom">
      <div className="grid-wrapper__top">
        {top.map((wrapper, idx) => (
          <WrapperRenderer key={wrapper._key || idx} wrapper={wrapper} lang={lang} />
        ))}
      </div>
      <div className="grid-wrapper__bottom">
        <div className="grid-wrapper__bottom-left">
          {bottomLeft.map((wrapper, idx) => (
            <WrapperRenderer key={wrapper._key || idx} wrapper={wrapper} lang={lang} />
          ))}
        </div>
        <div className="grid-wrapper__bottom-right">
          {bottomRight.map((wrapper, idx) => (
            <WrapperRenderer key={wrapper._key || idx} wrapper={wrapper} lang={lang} />
          ))}
        </div>
      </div>
    </li>
  )
}

export default WrapperGrid2Top1Bottom

