import WrapperGrid1Top2bottom from "./WrapperGrid1Top2bottom"
import WrapperGrid2Top1Bottom from "./WrapperGrid2Top1Bottom"
import WrapperGridVertical from "./WrapperGridVertical"
import WrapperGrid3Vertical from "./WrapperGrid3Vertical"

const GridRenderer = ({ grid, lang = "en" }) => {
  if (!grid) return null

  switch (grid._type) {
    case 'wrapperGrid1Top2bottom':
      return <WrapperGrid1Top2bottom grid={grid} lang={lang} />
    case 'wrapperGrid2Top1Bottom':
      return <WrapperGrid2Top1Bottom grid={grid} lang={lang} />
    case 'wrapperGridVertical':
      return <WrapperGridVertical grid={grid} lang={lang} />
    case 'wrapperGrid3Vertical':
      return <WrapperGrid3Vertical grid={grid} lang={lang} />
    default:
      return null
  }
}

export default GridRenderer

export {
  WrapperGrid1Top2bottom,
  WrapperGrid2Top1Bottom,
  WrapperGridVertical,
  WrapperGrid3Vertical
}

