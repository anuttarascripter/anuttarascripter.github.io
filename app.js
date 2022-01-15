const path = require("path");
const express = require("express");
const dotenv = require("dotenv");
dotenv.config({ path: path.resolve(process.cwd(), "./env/.env") });

const { clog } = require("./modules/utils");

const ipAddr = "localhost";
const app = express();
const port = process.env.PORT || process.env.PORT2;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/", express.static(path.join(__dirname, "./docs")));

app.listen(port, function () {
  clog(`http://${ipAddr}:${port}`);
});

process.on("uncaughtException", (error) => {
  clog("uncaughtException");
  clog({ error });
});
