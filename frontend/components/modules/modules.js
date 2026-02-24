import ModuleImage from "./moduleImage/moduleImage"
import ModuleSlider from "./moduleSlider/moduleSlider"
import ModuleSpace from "./moduleSpace/moduleSpace"
import ModuleText from "./moduleText/moduleText"
import ModuleVideo from "./moduleVideo/moduleVideo"
import ModuleVideoGallery from "./moduleVideoGallery/moduleVideoGallery"

export const ModulesInner = ({ modules, lang = "en" }) => {
  return (
    <div className="modules">
      {modules?.map((module, index) => {
        switch (module._type) {
          case "moduleImage":
            return <ModuleImage module={module} lang={lang} key={module._key} />
          case "moduleSlider":
            return <ModuleSlider module={module} lang={lang} key={module._key} />
          case "moduleSpace":
            return <ModuleSpace module={module} key={module._key} />
          case "moduleText":
            return <ModuleText module={module} lang={lang} key={module._key} />
          case "moduleVideo":
            return <ModuleVideo module={module} lang={lang} key={module._key} />
          case "moduleVideoGallery":
            return <ModuleVideoGallery module={module} lang={lang} key={module._key} />
          default:
            return null
        }
      })}
    </div>
  )
}

const Modules = ({ modules, lang = "en" }) => {
  return <ModulesInner modules={modules} lang={lang} />
}

export default Modules
