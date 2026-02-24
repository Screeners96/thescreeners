import Intro from "@/components/intro/intro"
import RTE from "@/components/utils/rte/rte"

const ImpressumDatenschutz = ({ impressumData, datenschutzData, lang }) => {
  const impressumIntro = Array.isArray(impressumData?.subtitle) ? impressumData.subtitle : []
  const impressumBodyText = Array.isArray(impressumData?.bodyText) ? impressumData.bodyText : []
  const datenschutzIntro = Array.isArray(datenschutzData?.subtitle) ? datenschutzData.subtitle : []
  const datenschutzBodyText = Array.isArray(datenschutzData?.bodyText) ? datenschutzData.bodyText : []

  return (
    <>
      <main id="main-content" className="main page--impressum-datenschutz content" data-readable="true" role="main">
        {impressumData && (impressumData.title || impressumIntro.length > 0 || impressumBodyText.length > 0) && (
          <section className="impressum-section">
            {impressumData.title && (
              <Intro title={impressumData.title} data={[]} lang={lang} />
            )}
            {impressumIntro && impressumIntro.length > 0 && (
              <Intro data={impressumIntro} lang={lang} />
            )}
            {impressumBodyText && impressumBodyText.length > 0 && (
              <div className="impressum-section__body rte">
                <RTE text={impressumBodyText} lang={lang} />
              </div>
            )}
          </section>
        )}

        {datenschutzData && (datenschutzData.title || datenschutzIntro.length > 0 || datenschutzBodyText.length > 0) && (
          <section className="datenschutz-section">
            {datenschutzData.title && (
              <Intro title={datenschutzData.title} data={[]} lang={lang} />
            )}
            {datenschutzIntro && datenschutzIntro.length > 0 && (
              <Intro data={datenschutzIntro} lang={lang} />
            )}
            {datenschutzBodyText && datenschutzBodyText.length > 0 && (
              <div className="datenschutz-section__body rte">
                <RTE text={datenschutzBodyText} lang={lang} />
              </div>
            )}
          </section>
        )}
      </main>
    </>
  )
}

export default ImpressumDatenschutz
