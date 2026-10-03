const { co2 } = require("@tgwf/co2");

// Initialize CO2.js with the Sustainable Web Design model
const co2Emission = new co2({ model: "swd" });

// Middleware to calculate data transfer size
const trackCarbonFootprint = (req, res, next) => {
  let requestBytes = 0;
  let responseBytes = 0;

  // Calculate request size
  if (req.body) {
    try {
      requestBytes += Buffer.byteLength(JSON.stringify(req.body), "utf8");
    } catch {
      // Ignore body serialization errors
    }
  }
  if (req.query) {
    try {
      requestBytes += Buffer.byteLength(JSON.stringify(req.query), "utf8");
    } catch {
      // Ignore query serialization errors
    }
  }
  if (req.headers) {
    try {
      requestBytes += Buffer.byteLength(JSON.stringify(req.headers), "utf8");
    } catch {
      // Ignore headers serialization errors
    }
  }

  // Override res.write to calculate response size
  const originalWrite = res.write;
  const originalEnd = res.end;

  res.write = function (chunk, ...args) {
    if (chunk) {
      if (Buffer.isBuffer(chunk)) {
        responseBytes += chunk.length;
      } else if (typeof chunk === "string") {
        responseBytes += Buffer.byteLength(chunk, "utf8");
      }
    }
    return originalWrite.apply(res, [chunk, ...args]);
  };

  res.end = function (chunk, ...args) {
    if (chunk) {
      if (Buffer.isBuffer(chunk)) {
        responseBytes += chunk.length;
      } else if (typeof chunk === "string") {
        responseBytes += Buffer.byteLength(chunk, "utf8");
      }
    }
    // Store total bytes
    res.locals.totalBytes = requestBytes + responseBytes;
    // Calculate carbon emissions
    const greenHost = false; // Set to true if your server is hosted on a green host
    const emissions = co2Emission.perByte(res.locals.totalBytes, greenHost);
    console.log(`Data transferred: ${res.locals.totalBytes} bytes`);
    console.log(
      `Estimated CO2 emissions: ${Number(emissions).toFixed(3)} grams`,
    );
    return originalEnd.apply(res, [chunk, ...args]);
  };

  next();
};

module.exports = trackCarbonFootprint;
