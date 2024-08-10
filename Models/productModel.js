const mongoose = require('mongoose')

const productModel = new mongoose.Schema({
  productName:{
    type:String,
    require:true
  },
  imageUrl:{
    type:String,
    require:true
  }
  ,
  price:{
    type:Number,
    require:true
  },
  category:{
    type:String,
    require:true
  },
  quantity:{
    type:Number,
    require:true
  },
  description:{
    type:String
  },
  discount:{
    type:Number
  }
})


module.exports = mongoose.model("Products",productModel)

