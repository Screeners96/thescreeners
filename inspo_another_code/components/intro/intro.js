import RTE from "../utils/rte/rte";

const Intro = ({ data }) => {
  if (!data || data.length === 0) return null;

  return (
    <section className="intro" data-readable="true">
      <RTE text={data} />
    </section>
  );
};

export default Intro;
