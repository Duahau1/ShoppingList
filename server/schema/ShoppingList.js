const mongoose= require('mongoose');
let shoppingList = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    completed:{
        type:Boolean,
        default:false
    },
    quantity:{
        type:Number,
        default:1
    }
})

module.exports = mongoose.model('shopppingList',shoppingList);