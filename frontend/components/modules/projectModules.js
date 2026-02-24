import ProjectModuleImage from "./projectModuleImage/projectModuleImage"
import ProjectModuleVimeo from "./projectModuleVimeo/projectModuleVimeo"
import ProjectModuleVideo from "./projectModuleVideo/projectModuleVideo"
import ProjectModuleSlider from "./projectModuleSlider/projectModuleSlider"

export const ProjectModulesRenderer = ({ modules = [], lang = "en" }) => {
  if (!modules || modules.length === 0) return null

  const flattenedModules = []

  modules.forEach((module) => {
    if (module._type === "projectModuleSlider") {
      const images = module?.images || module?.slides || []
      images.forEach((item, index) => {
        flattenedModules.push({
          _type: "projectModuleImage",
          _key: `${module._key || 'slider'}-${index}`,
          image: item?.image || item
        })
      })
    } else {
      flattenedModules.push(module)
    }
  })

  return (
    <>
      {flattenedModules.map((module, index) => {
        switch (module._type) {
          case "projectModuleImage":
            return <ProjectModuleImage module={module} lang={lang} key={module._key || index} />
          case "projectModuleVimeo":
            return <ProjectModuleVimeo module={module} lang={lang} key={module._key || index} />
          case "projectModuleVideo":
            return <ProjectModuleVideo module={module} lang={lang} key={module._key || index} />
          default:
            return null
        }
      })}
    </>
  )
}

export default ProjectModulesRenderer
