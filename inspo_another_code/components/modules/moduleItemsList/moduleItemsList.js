import RTE from "../../utils/rte/rte";

const ModuleItemsList = ({ items }) => {
  if (!items || items.length === 0) return null;

  return (
    <section className="moduleItemsList">
      <div className="moduleItemsList__inner">
        {items.map((item, index) => (
          <div className="moduleItemsList__item" key={index} data-readable="true">
            {item.itemTitle && <h2>{item.itemTitle}</h2>}
            {item.itemBody?.length > 0 && <RTE text={item.itemBody} />}
          </div>
        ))}
      </div>
    </section>
  );
};

export default ModuleItemsList;
