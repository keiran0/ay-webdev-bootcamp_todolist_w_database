const express = require("express");
const app = express();
const _ = require("lodash")

//database
const mongoose = require("mongoose");
db = mongoose.connect("mongodb://127.0.0.1:27017/todolistDB")

const itemsSchema = new mongoose.Schema({
    name: String
})
const Item = mongoose.model("Item", itemsSchema);

const ListSchema = {
    name: String,
    items: [itemsSchema]
}
const List = mongoose.model("List", ListSchema)

const item1 = new Item({name:"Welcome to your todolist!"})
const item2 = new Item({name:"Hit the + button to add a new item"})
const item3 = new Item({name:"< Hit this to delete an item"})
defaultItems = [item1, item2, item3]


// console.log(date) //[Function: getDate] -- so by calling date(); the getDate function in date.js is run.

app.set("view engine", "ejs");
app.use(express.urlencoded({extended:true}));
app.use(express.static("public"));

app.get("/", function(req, res){
    day = "Today"

    Item.find()
        .then(function(items){
            //if there are no items in the database, add in these 3 default items.
            //But if there are items in the database, render as is.
            console.log(items.length)
            if (items.length === 0) {

                Item.insertMany(defaultItems)
                console.log("Default items inserted. Redirecting.")
                res.redirect("/") //After inserting default items, redirect to root.
                //The if/else block will then be rerun but it will go to the else block after the redirect.
            } else {
                listItems = []
                items.forEach(function(item){
                    listItems.push(item)
                })
                console.log("Items detected in db.Rendering.")
                res.render("index", {listTitle: day, items: listItems})
            }
            
        })

        .catch(function(err){
            console.log(err)
        })

    
});

// app.get("/work", function(req, res){
//     res.render("index", {listTitle: "Work List", items: workItems});
// })

app.get("/about", function(req, res){
    res.render("about");
})

app.get("/:userParam", function(req, res){
    customListName = _.capitalize(req.params.userParam);
    existingLists = [];
    listContent = [];

    List.find()
        .then(function(list){

            list.forEach(function(listItem){
                existingLists.push(listItem.name)
            })

            if (existingLists.includes(customListName)){
                console.log("Custom list name detected");

                List.find({name:customListName})
                    .then(function(list){

                        list.forEach(function(list){
                            let listItems = list.items
                            listItems.forEach(function(item){
                                listContent.push(item)
                            })
                        })

                        res.render("index", {listTitle:customListName, items:listContent})
                    })
                    .catch(function(err){
                        console.log(err)
                    })

                

            } else {
                console.log("Custom list name not detected, creating new list.")
                const list = new List({
                    name: customListName,
                    items: defaultItems
                })
                list.save()
                res.redirect("/" + customListName)
            }
                
        })


        .catch(function(err){
            console.log(err)
        })

})


app.post("/", function(req, res){ // If there is a block of code with app.post("/work").., it will not work as the form action is "/". The if/else statement is needed to detect if the button being pressed is the button in the work list or the default list, and this is done by letting the value of the button equal the title of the list as defined dynamically in the HTML. If the list name is the same as the button value, and the button value = work, it means that the item is being added to the work list. Otherwise, it should be added to the default list.
    
    const itemName = req.body.newItem;
    const listName = req.body.list;
    
    const item = new Item({
        name: itemName
    })

    if (listName === "Today"){
        item.save()
        res.redirect("/")
    } else {
        List.findOne({name:listName}) //List = collection, foundList = document, foundList.items, one 'cell'
            .then(function(foundList){
                foundList.items.push(item);
                foundList.save();
                
            })
            .catch(function(err){
                console.log(err)
            })

            res.redirect("/" + listName)
    }


})


app.post("/delete", function(req, res){
    //in the ejs file, since every item is looped through and rendered, an attribute 'value' can be assigned to the checkbox with the value of the id of the item that is currently looped through.
    // req.body.checkbox == value, and value == the item id, as defined in index.ejs.
    const checkedItemId = req.body.checkbox;
    const listName = req.body.listName;
    console.log(checkedItemId)
    console.log(listName)
    if (listName === "Today"){
        Item.findByIdAndDelete(checkedItemId)
            .then(function(items){ //only when .then is there, it will delete.
                console.log("Successfully deleted checked item");
            })
    
            .catch(function(err){
                console.log(err);
            })
    
        res.redirect("/")

    } else { 

        List.findOneAndUpdate({name:listName},{$pull:{items:{_id:checkedItemId}}}) //from the list collection, look for a document with a name of listname (filter), from that document, ($pulll) remove the object in the array 'items' that has the _id of checked item id
            .then(function(items){
                console.log("deleted")
                res.redirect("/" + listName)
            })
            .catch(function(err){
                console.log(err)
            })

            


    }



})

app.listen(3000, function(){
    console.log("Running on localhost 3000");
});