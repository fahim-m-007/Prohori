require("dotenv").config();

const app = require("./src/app");
const connectDatabase = require("./src/config/db");

const port = process.env.PORT || 5000;

connectDatabase()
  .then(() => {
    app.listen(port, () => console.log(`API server listening on port ${port}`));
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error.message);
    process.exit(1);
  });
