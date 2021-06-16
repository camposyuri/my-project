const app = require("express")();
const consign = require("consign");
const db = require("./config/db.js");

app.db = db;

const port = "3001";

consign()
  .then("./config/middlewares.js")
  .then("./api/validation.js")
  .then("./api")
  .then("./config/routes.js")
  .into(app);

app.listen(`${port}`, () => {
  console.log(`Server is running: http://localhost:${port}`);
});
