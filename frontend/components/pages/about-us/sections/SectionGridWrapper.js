import GridRenderer from "../grids"

const SectionGridWrapper = ({ section, lang = "en", renderGrid }) => {
  if (!section || section.sectionType !== 'gridWrapper') return null

  return (
    <div className="about-us-section about-us-section--grid-wrapper" data-section-slug={section.slug}>
      {section.grids && section.grids.length > 0 && (
        <div className="section-grids">
          {section.grids.map((grid, idx) => (
            <div key={grid._key || idx} className="section-grid-item">
              {renderGrid ? renderGrid(grid, lang) : <GridRenderer grid={grid} lang={lang} />}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default SectionGridWrapper

