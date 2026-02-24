import GridItem from "./GridItem"

const GridFull = ({ grid, lang = "en", pageType = "imagefilm" }) => {
  if (!grid) return null

  // GridFull can have trailerPage (for trailer pages) or item (for imagefilm/event pages)
  const item = grid.trailerPage || grid.item

  return (
    <li className="grid-layout grid-layout--full">
      {item && <GridItem subpage={item} lang={lang} pageType={pageType} />}
    </li>
  )
}

export default GridFull

