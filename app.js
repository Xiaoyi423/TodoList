const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require('mongoose')
const _= require("lodash");
app.use(bodyParser.urlencoded({ extended: true }));

//setting view engine to ejs
app.set("view engine", "ejs");
app.use(express.static("public"))

mongoose.connect("mongodb+srv://admin-xiaoyi:Aa915423@cluster0.3ada4hy.mongodb.net/todolistDB");
const itemSchema = new mongoose.Schema({
  name: String
})
const Item = mongoose.model("item",itemSchema);
const item1 = new Item ({
  name: "Welcome to our to do list"
})
const item2 = new Item ({
  name: "Hit the add button to add a new item"
})
const item3 = new Item ({
  name: "<--Hit the check box to delete an item"
})

const defaultItems=[item1,item2,item3]

const listSchema={
  name:String,
  items:[itemSchema]
};

const List = mongoose.model("List",listSchema)

let today = new Date();

let options = {
  weekday: 'long',
  day: 'numeric',
  month: 'long'
};

let day = today.toLocaleDateString("en-US", options)

app.get("/", function (req, res) {

 
  Item.find({},function(err,results){
    if(err){
      console.log(err)
    }else if(results.length===0){
      Item.insertMany(defaultItems,function(err){
        if(err){
          console.log(err);
        }else{
          console.log("insert successful")
        }
      })
      res.redirect("/")
    }else{
      res.render("list", {listTitle: day, newListItems: results});
    }
  })
});

app.get("/:customListName",function(req,res){
  const listName = _.capitalize(req.params.customListName);
  List.findOne({name:listName},function(err,result){
    if(!result){
      const list = new List({
        name:listName,
        items: defaultItems
      })
      list.save();
      res.redirect("/" + listName);
    }
    else{
      res.render("list",{listTitle:result.name,newListItems: result.items})
    }
  })
})

let port = process.env.PORT;
if (port == null || port == "") {
  port = 8000;
}

app.listen(port, function () {
  console.log("server started on port 3000");
});

app.post("/delete",function(req,res){
  const checkItemId = req.body.checkbox;
  const listName = req.body.listName;
  if(listName === day){
    Item.findByIdAndRemove(checkItemId,function(err){
      if(err){
        console.log(err)
      }
      else{
        console.log("delete successful")
      }
    })
    res.redirect("/")
  }
  else{
    List.findOneAndUpdate({name : listName},{$pull:{items:{_id: checkItemId}}},function(err,result){
      if(err){
        console.log(err)
      }else{
        res.redirect("/"+listName)
      }
    })
  }
})

app.post("/", function (req, res) {
  let itemName = req.body.newItem;
  let listName = req.body.list;

  const item = new Item({
    name:itemName
  })
  if(listName === day){
    item.save();
    res.redirect("/");
  }else{
    List.findOne({name:listName},function(err,result){
      if(!err){
        result.items.push(item);
        result.save();
        res.redirect("/"+listName);
      }
    })
  }
  
});