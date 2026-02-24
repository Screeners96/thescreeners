import GridItem from "./GridItem"

const Grid3Vertical = ({ grid, lang = "en", pageType = "imagefilm" }) => {
  if (!grid) return null

  const items = grid.items || []

  return (
    <div className="grid-layout grid-layout--3-vertical">
      {items.map((item, idx) => (
        <div key={item._id || idx} className="grid-layout__item">
          <GridItem subpage={item} lang={lang} pageType={pageType} />
        </div>
      ))}
    </div>
  )
}

export default Grid3Vertical

