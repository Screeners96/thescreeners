import Grid3Bottom from "./Grid3Bottom"
import Grid3Top from "./Grid3Top"
import GridVertical from "./GridVertical"
import GridFull from "./GridFull"
import Grid3Vertical from "./Grid3Vertical"

const GridRenderer = ({ grid, lang = "en", pageType = "imagefilm" }) => {
  if (!grid) return null

  switch (grid._type) {
    case 'Grid3Bottom':
      return <Grid3Bottom grid={grid} lang={lang} pageType={pageType} />
    case 'Grid3Top':
      return <Grid3Top grid={grid} lang={lang} pageType={pageType} />
    case 'GridVertical':
      return <GridVertical grid={grid} lang={lang} pageType={pageType} />
    case 'GridFull':
      return <GridFull grid={grid} lang={lang} pageType={pageType} />
    case 'Grid3Vertical':
      return <Grid3Vertical grid={grid} lang={lang} pageType={pageType} />
    default:
      return null
  }
}

export default GridRenderer

