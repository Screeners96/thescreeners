import WrapperRenderer from "../wrappers"

const WrapperGrid3Vertical = ({ grid, lang = "en" }) => {
  if (!grid) return null

  const top = grid.top || []
  const middle = grid.middle || []
  const bottom = grid.bottom || []

  return (
    <li className="grid-wrapper grid-wrapper--3-vertical">
      <div className="grid-wrapper__item grid-wrapper__item--top">
        {top.map((wrapper, idx) => (
          <WrapperRenderer key={wrapper._key || idx} wrapper={wrapper} lang={lang} />
        ))}
      </div>
      <div className="grid-wrapper__item grid-wrapper__item--middle">
        {middle.map((wrapper, idx) => (
          <WrapperRenderer key={wrapper._key || idx} wrapper={wrapper} lang={lang} />
        ))}
      </div>
      <div className="grid-wrapper__item grid-wrapper__item--bottom">
        {bottom.map((wrapper, idx) => (
          <WrapperRenderer key={wrapper._key || idx} wrapper={wrapper} lang={lang} />
        ))}
      </div>
    </li>
  )
}

export default WrapperGrid3Vertical

