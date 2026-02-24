import GridItem from "./GridItem"

const Grid3Bottom = ({ grid, lang = "en", pageType = "imagefilm" }) => {
  if (!grid) return null

  // Grid3Bottom: topLeft, topRight (top row), bottom (full width bottom)
  const topLeft = grid.topLeft
  const topRight = grid.topRight
  const bottom = grid.bottom

  return (
    <li className="grid-layout grid-layout--3-bottom">
      <div className="grid-layout__top">
        <div className="grid-layout__top-left">
          {topLeft && <GridItem subpage={topLeft} lang={lang} pageType={pageType} />}
        </div>
        <div className="grid-layout__top-right">
          {topRight && <GridItem subpage={topRight} lang={lang} pageType={pageType} />}
        </div>
      </div>
      <div className="grid-layout__bottom">
        {bottom && <GridItem subpage={bottom} lang={lang} pageType={pageType} />}
      </div>
    </li>
  )
}

export default Grid3Bottom

