import RTE from "../../utils/rte/rte";

const ModuleItemsList = ({ items, lang = "en" }) => {
  if (!items || items.length === 0) return null;

  return (
    <section className="moduleItemsList">
      <div className="moduleItemsList__inner">
        {items.map((item, index) => (
          <div className="moduleItemsList__item" key={index} data-readable="true">
            {item.itemTitle && <h2>{item.itemTitle}</h2>}
            {item.itemBody?.length > 0 && <RTE text={item.itemBody} lang={lang} />}
          </div>
        ))}
      </div>
    </section>
  );
};

export default ModuleItemsList;
