import GridItem from "./GridItem"

const Grid3Top = ({ grid, lang = "en", pageType = "imagefilm" }) => {
  if (!grid) return null

  // Grid3Top: top (full width), bottomLeft and bottomRight (split bottom)
  const top = grid.top
  const bottomLeft = grid.bottomLeft
  const bottomRight = grid.bottomRight

  return (
    <li className="grid-layout grid-layout--3-top">
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
    </li>
  )
}

export default Grid3Top

