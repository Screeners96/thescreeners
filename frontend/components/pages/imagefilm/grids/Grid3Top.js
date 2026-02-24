import GridItem from "./GridItem"

const Grid3Top = ({ grid, lang = "en", pageType = "imagefilm" }) => {
  if (!grid) return null

  const topLeft = grid.topLeft
  const topRight = grid.topRight
  const bottom = grid.bottom

  return (
    <div className="grid-layout grid-layout--3-top">
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
    </div>
  )
}

export default Grid3Top

