import RTE from "../utils/rte/rte";

const BodyText = ({ data }) => {
  if (!data || data.length === 0) return null;

  return (
    <section className="bodyText" data-readable="true">
      <RTE text={data} />
    </section>
  );
};

export default BodyText;
