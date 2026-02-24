import GridItem from "./GridItem"

const GridFull = ({ grid, lang = "en", pageType = "imagefilm" }) => {
  if (!grid) return null

  const item = grid.item

  return (
    <div className="grid-layout grid-layout--full">
      {item && <GridItem subpage={item} lang={lang} pageType={pageType} />}
    </div>
  )
}

export default GridFull

