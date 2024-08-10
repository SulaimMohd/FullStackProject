const mongoose = require("mongoose")

const wishListModel = new mongoose.Schema({
  userId:{
    type:mongoose.Types.ObjectId,
    ref:"Users"
  },
  productList:[
    {
      productId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Products"
      }
    }
  ]
})


module.exports = mongoose.model('WishList', wishListModel)