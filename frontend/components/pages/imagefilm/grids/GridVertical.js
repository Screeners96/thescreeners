import GridItem from "./GridItem"

const GridVertical = ({ grid, lang = "en", pageType = "imagefilm" }) => {
  if (!grid) return null

  const item = grid.trailerPage || grid.item

  return (
    <div className="grid-layout grid-layout--vertical">
      {item && <GridItem subpage={item} lang={lang} pageType={pageType} />}
    </div>
  )
}

export default GridVertical

