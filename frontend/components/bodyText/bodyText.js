import RTE from "../utils/rte/rte";

const BodyText = ({ data, lang = "en" }) => {
  if (!data || data.length === 0) return null;

  return (
    <section className="bodyText" data-readable="true">
      <RTE text={data} lang={lang} />
    </section>
  );
};

export default BodyText;
