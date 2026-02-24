import GridItem from "./GridItem"

const Grid3Vertical = ({ grid, lang = "en", pageType = "imagefilm" }) => {
  if (!grid) return null

  const top = grid.top
  const middle = grid.middle
  const bottom = grid.bottom

  return (
    <li className="grid-layout grid-layout--3-vertical">
      {top && (
        <div className="grid-layout__item grid-layout__item--top">
          <GridItem subpage={top} lang={lang} pageType={pageType} />
        </div>
      )}
      {middle && (
        <div className="grid-layout__item grid-layout__item--middle">
          <GridItem subpage={middle} lang={lang} pageType={pageType} />
        </div>
      )}
      {bottom && (
        <div className="grid-layout__item grid-layout__item--bottom">
          <GridItem subpage={bottom} lang={lang} pageType={pageType} />
        </div>
      )}
    </li>
  )
}

export default Grid3Vertical

