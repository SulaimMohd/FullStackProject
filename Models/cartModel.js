const { string } = require('joi')
const mongoose = require('mongoose')


const cartModel = new mongoose.Schema({
  customerId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Users"
  },
  isPlaced:{
    type:Boolean,
    require:true
  },
  productList:[
    {
      productId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Products"
      },
      quantity:{
        type:Number
      }
    }
  ]
})


module.exports = mongoose.model('Cart', cartModel)