import GridItem from "./GridItem"

const GridVertical = ({ grid, lang = "en", pageType = "imagefilm" }) => {
  if (!grid) return null

  const item = grid.trailerPage || grid.item
  
  console.log('GridVertical - grid data:', grid)
  console.log('GridVertical - item data:', item)
  console.log('GridVertical - item bodyText:', item?.bodyText)

  return (
    <li className="grid-layout grid-layout--vertical">
      {item && <GridItem subpage={item} lang={lang} pageType={pageType} />}
    </li>
  )
}

export default GridVertical

