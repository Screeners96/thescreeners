import ModuleBanner from "./moduleBanner/moduleBanner"
import ModuleLink from "./moduleLink/moduleLink"
import ModuleSlider from "./moduleSlider/moduleSlider"
import ModuleSpace from "./moduleSpace/moduleSpace"
import ModuleText from "./moduleText/moduleText"

export const ModulesInner = ({ modules, lang = "en" }) => {
  return (
    <div className="modules">
      {modules?.map((module, index) => {
        switch (module._type) {
          case "moduleBanner":
            return <ModuleBanner module={module} lang={lang} key={module._key} />
          case "moduleLink":
            return <ModuleLink module={module} lang={lang} index={index} key={module._key} />
          case "moduleSpace":
            return <ModuleSpace module={module} key={module._key} />
          case "moduleText":
            return <ModuleText module={module} lang={lang} key={module._key} />
          case "moduleSlider":
            return <ModuleSlider module={module} key={module._key} />
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
