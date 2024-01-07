const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();
var cors = require("cors");

const hostname = "127.0.0.1";
const port = process.env.PORT || 5001;

const orderRoutes = require("./routes/order");
const esewaRoutes = require("./routes/esewa");
const khaltiRoutes = require("./routes/khalti");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());
app.options("*", cors());

mongoose
  .connect(process.env.DB_URL)
  .then((res) => {
    console.log("Connected to DB Sucessfully");
  })
  .catch((err) => {
    console.log(err);
  });

app.use("/api/orders", orderRoutes);
app.use("/api/esewa", esewaRoutes);
app.use("/api/khalti", khaltiRoutes);

app.listen(port, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
