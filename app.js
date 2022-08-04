const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require('mongoose')
app.use(bodyParser.urlencoded({ extended: true }));

//setting view engine to ejs
app.set("view engine", "ejs");
app.use(express.static("public"))

mongoose.connect("mongodb://localhost:27017/todolistDB");
const itemSchema = new mongoose.Schema({
  name: String
})
const Item = mongoose.model("item",itemSchema);
// const item1 = new Item ({
//   name: "Welcome to our to do list"
// })
// const item2 = new Item ({
//   name: "Hit the add button to add a new item"
// })
// const item3 = new Item ({
//   name: "<--Hit the check box to delete an item"
// })
// Item.insertMany([item1,item2,item3],function(err){
//   if(err){
//     console.log(err);
//   }else{
//     console.log("insert successful")
//   }
// })
app.get("/", function (req, res) {

  let today = new Date();

  let options = {
    weekday: 'long',
    day: 'numeric',
    month: 'long'
  };
  let day = today.toLocaleDateString("en-US", options)
  Item.find(function(err,results){
    if(err){
      console.log(err)
    }else{
      res.render("list", {kindOfDay: day, newListItems: results});
    }
  })
});

app.listen(3000, function () {
  console.log("server started on port 3000");
});

app.post("/", function (req, res) {
  let item = req.body.newItem;
  items.push(item);
  res.redirect("/");
});