if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
import * as express from "express";
import * as bodyParser from "body-parser";
import * as cors from "cors";
import routes from "./routes";
import { User } from "./models/user";
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const mongoSanitize = require("express-mongo-sanitize");

const dbUrl = process.env.DB_URL || "mongodb://localhost:27017/meetups";
// "mongodb://localhost:27017/meetups"
mongoose.connect(dbUrl, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true
});
mongoose.set("useFindAndModify", false);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error"));
db.once("open", () => {
  console.log("Database connected");
});

const app = express();
// Call midlewares
app.use(cors());
app.use(
  bodyParser.json({
    limit: "10mb"
  })
);
app.use(
  bodyParser.urlencoded({
    extended: true,
    limit: "10mb"
  })
);
app.use(mongoSanitize());

// app.use(express.json());

const port = process.env.PORT || 3000;
app.use("/api", routes);
if (process.env.NODE_ENV === "production") {
  //static folder
  app.use(express.static(__dirname + "/public"));
  //handle SPA
  app.get(/.*/, (req, res) => res.sendFile(__dirname + "public/index.html"));
}
app.listen(port, () => {
  console.log("Server started on port " + port + "!");
});
