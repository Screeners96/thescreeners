const ModuleSpace = ({ module }) => {
    const height = module?.height || 0
    const backgroundColor = module?.backgroundColor || 'transparent'
  
    return (
      <section 
        className="moduleSpace module" 
        style={{ 
          height: `${height}px`,
          backgroundColor: backgroundColor
        }}
      >
        <div className="moduleSpace__inner" style={{ height: "100%" }}></div>
      </section>
    )
  }
  
  export default ModuleSpace
  