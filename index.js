const config = require("config");
const express = require("express");
const helmet = require("helmet");
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);
const morgan = require("morgan");
const mongoose = require("mongoose");

const categories = require("./routes/categories");
const customers = require("./routes/customers");
const items = require("./routes/items");
const rentals = require("./routes/rentals");
const home = require("./routes/home");

mongoose
  .connect(config.get("mongoURI"), {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(console.log("Connected to MongoDB"))
  .catch((err) => console.log(err));

const app = express();

app.set("view engine", "pug"); //express will internally load pug module
// app.set("views", "./views") this is default value

//Built-in middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use(helmet());

if (app.get("env") === "development") {
  app.use(morgan("tiny"));
  console.log("Morgan enabled");
}

app.use("/", home);
app.use("/api/categories", categories);
app.use("/api/customers", customers);
app.use("/api/items", items);
app.use("/api/rentals", rentals);

port = process.env.PORT || 3000;

app.listen(port, () => console.log(`Listening on port ${port}...`));
