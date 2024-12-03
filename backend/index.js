const express = require("express");
const cors = require("cors");
const PORT = 6969;
const app = express();
const mainrouter = require("./router/index");

app.use(cors());
app.use(express.json());
app.use("/api/v1", mainrouter);

app.listen(PORT, () => {
  console.log("server running");
});
