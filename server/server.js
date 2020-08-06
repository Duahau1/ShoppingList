const express = require('express');
const bodyParser= require('body-parser');
const cors = require('cors');
const mongoose= require('mongoose');
const app = express();
const list = require('./schema/ShoppingList');
require('dotenv').config();

//Setting up middleware
app.use(cors());
app.use(bodyParser.json());

//Setting up mongodb database
const url=process.env.MONGO_URL;
mongoose.connect(url,{ useNewUrlParser: true,useUnifiedTopology: true });
mongoose.connection.on('connected',()=>{
    console.log("Database connected");
})
mongoose.connection.on('error',(err)=>{
    console.log('Error occured '+ err);
})
mongoose.set('useFindAndModify', false);

//Routes and database interaction
app.get("/", async (req,res)=>{
    let results = await list.find(); 
    res.json(results);
})
app.post("/", async (req,res)=>{
    let obj = new list({
        name:req.body.name,
        quantity: req.body.quantity
    });
    await obj.save().then((data)=>{
        res.json(data);
    }).catch(err=>res.json({Message: 'Error'}));
})

//Edit the Name and quantity
app.patch("/",(req,res)=>{
    list.findByIdAndUpdate(req.body.id,{name:req.body.name, quantity:req.body.quantity}, (err, doc) => {
    if (err) {
        console.log("Something wrong when updating data!");
        res.json({Message: "Error"});
    }
    else{
        res.json(doc);
    }
});
})

//Delete a product
app.delete("/:id", (req,res)=>{
    console.log(req.params);
    list.findByIdAndDelete(req.params.id,(err,doc)=>{
        if (err){ 
            console.log(err);
            res.json({Message: "Error"});
        } 
        else{ 
            res.json(doc);       
         } 
    });
    
})

//Toggle the state of a product
app.patch("/complete", (req,res)=>{
    console.log(req.body);
    list.findByIdAndUpdate(req.body.id,{completed:req.body.completed},(err,doc)=>{
        if (err) {
            console.log("Something wrong when updating data!");
            res.json({Message: "Error"});
        }
        else{
            res.json(doc);
        }
    });
 })

app.listen(3000,'localhost',()=>{
console.log("Connection is successful");
})
