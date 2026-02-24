const ModuleSpace = ({ module }) => {
    const height = module?.height || 0
  
    return (
      <section className="moduleSpace module" style={{ height: `${height}px` }}>
        <div className="moduleSpace__inner" style={{ height: "100%" }}></div>
      </section>
    )
  }
  
  export default ModuleSpace
  