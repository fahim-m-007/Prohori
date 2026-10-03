import { useCarbonFootprint } from "react-carbon-footprint";

const CarbonFootprintDisplay = () => {
  const [gCO2, bytesTransferred] = useCarbonFootprint();

  return (
    <div
      style={{
        position: "fixed",
        bottom: 10,
        right: 10,
        background: "rgba(255,255,255,0.85)",
        backdropFilter: "blur(4px)",
        padding: "10px 14px",
        borderRadius: "8px",
        border: "1px solid #e2e8f0",
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        zIndex: 1000,
        fontFamily: "inherit",
        fontSize: "12px",
        color: "#1e293b",
        maxWidth: "280px",
      }}
    >
      <h3 style={{ margin: "0 0 6px 0", fontSize: "13px", color: "#0f172a" }}>
        Network Carbon Footprint
      </h3>
      <p style={{ margin: "3px 0" }}>
        Bytes transferred: <strong>{bytesTransferred ?? 0} bytes</strong>
      </p>
      <p style={{ margin: "3px 0" }}>
        CO2 Emissions:{" "}
        <strong>
          {typeof gCO2 === "number"
            ? gCO2.toFixed(2)
            : (Number(gCO2) || 0).toFixed(2)}{" "}
          grams CO2eq
        </strong>
      </p>
      <p style={{ fontSize: "0.8em", color: "#666", margin: "4px 0 0 0" }}>
        (Estimates based on network data transfer during this session)
      </p>
    </div>
  );
};

export default CarbonFootprintDisplay;
