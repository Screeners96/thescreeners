import Hero from "../../hero/hero"
import Modules from "../../modules/modules"
import BodyText from "../../bodyText/bodyText"

const Frontpage = ({ pageData, artistData = [], lang = "en" }) => {
  console.log("Frontpage bodyText:", pageData.bodyText)

  return (
    <main className="main page--frontpage" data-readable="true">
      <h1 className="title__main">
      CARING CULTURE LAB</h1>
      <Hero
        text={pageData.heroText}
        credits={pageData.heroTextCredits}
        image={pageData.heroImage}
        ticker={pageData.heroTicker}
        artistData={artistData}
        lang={lang}
      />

      {pageData?.bodyText && (
        <div className="content-intro">
          <BodyText data={pageData.bodyText} lang={lang} />
        </div>
      )}

      <div className="content frontpage-modules" data-readable="true">
        <Modules modules={pageData.modules} lang={lang} />
      </div>
    </main>
  )
}

export default Frontpage
