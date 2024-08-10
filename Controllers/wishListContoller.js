const { default: mongoose } = require('mongoose')
const wishListModel = require('../Models/whishListModel')

module.exports = {
  addToWhishList:async(req, res)=>{
    try {
      const {id} = req.params
      const {productId} = req.query 
      console.log({productId, id})
      let userWishList = await wishListModel.findOne({userId:id})
      if(!userWishList) {
       userWishList =  await wishListModel.create({
          userId:new mongoose.Types.ObjectId(id)
        })
      }
      console.log(userWishList)
      const isExist = userWishList.productList.find(item => item.productId.toString() === productId) !== undefined
      console.log(userWishList)
      console.log(isExist)
      if(!isExist){
       userWishList.productList.push({productId:new mongoose.Types.ObjectId(productId)})
       res.send('product added to the wishlist')
      }else{
        userWishList.productList = userWishList.productList.filter(item=>{
          return productId !== item.productId.toHexString()
        })
        res.send('product removed from the wishlist')
      }
      await userWishList.save()
    } catch (err) {
      console.log(`There is an error while creating the wishlist ${err}`)
      res.send(`failed to create wishList`)
    }
  },
  getWishList:async(req, res)=>{
    try {
      const {id} = req.params
      const wishList = await wishListModel.find({userId:id})
      res.json(wishList)
    } catch (err) {
        console.log(`There is an error while fething all the wishList`)
        res.send('Not found')
    }
  },
  removeFromWishList:async(req, res)=>{
    try {
      const {id} = req.params
      const {productId} = req.query
      console.log({id, productId})
      const wishList = await wishListModel.findOne({userId:id})
      wishList.productList = wishList.productList.filter(item => item.productId.toString() !== productId)
      wishList.save()
      res.json(wishList)
    } catch (err) {
      console.log(`there is an error while removing item from wishlist`)
      res.send('Not removed')
    }
  }
}