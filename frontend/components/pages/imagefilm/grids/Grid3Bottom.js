import GridItem from "./GridItem"

const Grid3Bottom = ({ grid, lang = "en", pageType = "imagefilm" }) => {
  if (!grid) return null

  const top = grid.top
  const bottomLeft = grid.bottomLeft
  const bottomRight = grid.bottomRight

  return (
    <div className="grid-layout grid-layout--3-bottom">
      <div className="grid-layout__top">
        {top && <GridItem subpage={top} lang={lang} pageType={pageType} />}
      </div>
      <div className="grid-layout__bottom">
        <div className="grid-layout__bottom-left">
          {bottomLeft && <GridItem subpage={bottomLeft} lang={lang} pageType={pageType} />}
        </div>
        <div className="grid-layout__bottom-right">
          {bottomRight && <GridItem subpage={bottomRight} lang={lang} pageType={pageType} />}
        </div>
      </div>
    </div>
  )
}

export default Grid3Bottom

