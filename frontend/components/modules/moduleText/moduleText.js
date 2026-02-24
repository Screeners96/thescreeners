import RTE from "../../utils/rte/rte"

const ModuleText = ({ module, lang = "en" }) => {

  if (!module) {
    return null
  }

  let flag = null

  if (module.flagTitle && typeof module.flagTitle === "object") {
    flag = module.flagTitle[lang] || module.flagTitle.en || ""
  }

  else if (module.flag) {
    if (typeof module.flag === "string") {
      flag = module.flag

    } else if (typeof module.flag === "object" && module.flag !== null) {

      flag = module.flag[lang] || module.flag.en || ""

    } else {

      try {
        flag = String(module.flag)
 
      } catch (e) {

        flag = ""
      }
    }
  }

 
  const title = module.title && typeof module.title === "object" ? module.title[lang] || module.title.en : module.title

  
  let textContent = null

  
  if (module.bodyText) {
    if (typeof module.bodyText === "object" && !Array.isArray(module.bodyText)) {
      textContent = module.bodyText[lang] || module.bodyText.en
    } else {
      textContent = module.bodyText
    }
  }
  
  else if (module.text) {
    textContent = module.text
  }

  return (
    <section className="moduleText rte module">
      {flag && (
        <div className="module__flag" data-readable="true">
          <span>{flag}</span>
        </div>
      )}

    <div className="moduleText__inner" data-readable="true">
      {title && (typeof title === 'string' ? title.length > 0 : title) && <h2>{title}</h2>}
      
      {title && (typeof title === 'string' ? title.length > 0 : title) && 
      textContent && (typeof textContent === 'object' ? textContent.length > 0 : textContent) && 
      <div className="title-text-spacer" style={{ marginBottom: "40px" }}></div>}
      
      {textContent && (
        <RTE text={textContent} lang={lang} />
      )}
    </div>

    </section>
  )
}

export default ModuleText
