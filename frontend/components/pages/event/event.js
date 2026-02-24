"use client"

import Intro from "@/components/intro/intro"
import TrailerGridsSlider from "@/components/grids/TrailerGridsSlider"

const Event = ({ pageData, globalData, preview, lang }) => {
  const bodyTextData = pageData?.bodyText || []

  return (
    <>
      <main id="main-content" className="main page--event content" data-readable="true" role="main">
      {(pageData?.title || (pageData?.bodyText && bodyTextData.length > 0)) && (
        <Intro title={pageData?.title} data={bodyTextData} lang={lang} />
      )}
      
      {pageData?.grid && pageData.grid.length > 0 && (
        <div className="kino-content-slot">
          <TrailerGridsSlider
            grids={pageData.grid}
            lang={lang}
            pageType="event"
            sliderId="event-slider"
          />
        </div>
      )}
      </main>
    </>
  )
}

export default Event
