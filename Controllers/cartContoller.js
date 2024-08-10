const express = require('express')
const cartModel = require('../Models/cartModel')
const { default: mongoose } = require('mongoose')
const { func } = require('joi')


module.exports = {
  findOrder:async function(userId){
    return await cartModel.findOne(
      {
          customerId:new mongoose.Types.ObjectId(userId),
          isPlaced:false
        }
    )
  },
  createOrder:async(userId)=>{
    return await cartModel.create({
      productList:[],
      customerId:userId,
      isPlaced:false
    })
  },
  placeOrder:async(orderId)=>{
    return await cartModel.updateOne({_id:orderId}, {$set:{isPlaced:true}})
  },
  completedOrders:async(req, res)=>{
    try {
      const completedOrderList = await cartModel.find({isPlaced:true})
      res.json(completedOrderList)
    } catch (err) {
      console.log('There is error while fetching orders')
      res.send('No completed orders')
    }
  },
  getCurrentOrder:async(req, res)=>{
    try {
      const {userId} = req.query
      
      const productDetails = await cartModel.aggregate([
        {$match:{customerId: new mongoose.Types.ObjectId(userId), isPlaced:false}},
        { $unwind: '$productList'},{
        $lookup:{
          from:"products",
          localField:'productList.productId',
          foreignField:'_id',
          as:"productDetails"
        }
      }])
      console.log(productDetails, 'This is it')
      res.json(productDetails)
    } catch (err) {
      console.log('there is an erro while fethcing the order')
      res.send('Order not found')      
    }
  },
  getCurrentCart:async function(userId){
    try {
      const currentCart = await cartModel.findOne({customerId:userId, isPlaced:false})
      return currentCart
    } catch (err) {
      console.log(err)
    }
  }
}
