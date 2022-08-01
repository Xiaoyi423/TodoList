const express = require("express");
const app = express();
const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({ extended: true }));

let items = [];
//setting view engine to ejs
app.set("view engine", "ejs");
app.use(express.static("public"))

app.get("/", function (req, res) {

  let today = new Date();

  let options = {
    weekday: 'long',
    day: 'numeric',
    month: 'long'
  };
  let day = today.toLocaleDateString("en-US", options)
  res.render("list", { kindOfDay: day, newListItems: items })
});

app.listen(3000, function () {
  console.log("server started on port 3000");
});

app.post("/", function (req, res) {
  let item = req.body.newItem;
  items.push(item);
  res.redirect("/");
});