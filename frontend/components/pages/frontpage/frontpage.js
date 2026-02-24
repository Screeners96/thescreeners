import Hero from "../../hero/hero"
import Modules from "../../modules/modules"
import BodyText from "../../bodyText/bodyText"
import Footer from "../../footer/footer"

const Frontpage = ({ pageData, globalData, lang = "en" }) => {
  console.log("Frontpage bodyText:", pageData.bodyText)

  return (
    <>
      <main id="main-content" className="main page--frontpage" data-readable="true" role="main">
        <Hero
          text={pageData.heroText}
          credits={pageData.heroTextCredits}
          image={pageData.heroImage}
          ticker={pageData.heroTicker}
          lang={lang}
          heroMediaType={pageData.heroMediaType}
          heroImage={pageData.heroImage}
          heroSlider={pageData.heroSlider}
          heroVideo={pageData.heroVideo}
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
      
      <Footer 
        getInTouch={globalData?.footerGetInTouch}
        socialLinks={globalData?.socialLinks}
        contactEmail={globalData?.contactEmail}
        lang={lang}
      />
    </>
  )
}

export default Frontpage
