const express = require('express')
const userControllers = require('../Controllers/userContoller')
const cartController  = require('../Controllers/cartContoller')
const productController = require('../Controllers/productController')
const wishListContoller = require('../Controllers/wishListContoller')
const userAuth = require('../Utils/userAuth')
const { default: mongoose } = require('mongoose')

const messageController = require('../Controllers/messageController')

const userRoutes = express.Router()

userRoutes.get("/",userAuth, (req, res)=>{
  res.send('succes req and this is the data from the uesrRoute')
})
userRoutes.post('/register', userControllers.create)
userRoutes.post('/logIn', userControllers.logIn)
userRoutes.use(userAuth)
userRoutes.post('/postMessage', messageController.postMessage)
userRoutes.post('/order', async(req, res)=>{
  console.log(req.query)
  let {userId, productId} = req.query
  console.log({userId, productId})
  let existingOrder = await cartController.findOrder(userId)
  if(!existingOrder){
    existingOrder =  await cartController.createOrder(userId)
  }
  let index = existingOrder.productList.findIndex(item=> item.productId.toString() === productId)
  console.log(index)
  if(index === -1){
    existingOrder.productList.push({productId, quantity:1})
  }else{
    existingOrder.productList[index].quantity += 1
  }
  console.log(existingOrder)
  existingOrder.save()
  res.send('okay')
})
userRoutes.post('/addToCart',async function(req, res){
    try {
      const {productId, userId }= req.body
      
      let currentOrder = await cartController.findOrder(userId)
      if(!currentOrder){
        currentOrder = await cartController.createOrder(userId)
        console.log("new orderCreated")
      }
      console.log(currentOrder.productList)
      let productIndex = -1;
      let flag = false;
      currentOrder.productList.forEach((item, index)=>{
        if(productId === item.productId.toHexString()){
          flag = true
          productIndex = index
        }
      })
      if(!flag){
        currentOrder.productList.push({
          productId: new mongoose.Types.ObjectId(productId),
          quantity:1
        })
        res.send('product added')
      }else{
        currentOrder.productList[productIndex].quantity = currentOrder.productList[productIndex].quantity +1
        res.send('quantity updated')
      }
      await currentOrder.save()

    } catch (err) {
      res.send(`there is an error while adding to the cart ${err}`)
    }

  })
userRoutes.put('/decQntFromCart', async function(req, res){
  try {
    const {productId, userId }= req.body                              
    let currentOrder = await cartController.findOrder(userId)
    let productIndex = -1;
    currentOrder.productList.forEach((item, index)=>{
      if(productId === item.productId.toHexString()){
        flag = true
        productIndex = index
      }
     })
    currentOrder.productList[productIndex].quantity = currentOrder.productList[productIndex].quantity -1
    res.send('quantity updated')
    await currentOrder.save()
  } catch (err) {
    res.status(500).json({message:'Internal server error'})
  }
})
userRoutes.put('/removeFromCart',async function(req, res){
  try {
    const {userId, productId} = req.body
    console.log(`removeFromCart ${userId}`)
    const currentCart = await cartController.getCurrentCart(userId)
    currentCart.productList = currentCart.productList.filter(item=> !(item.productId.toHexString() === productId))
    await currentCart.save()
    res.json(currentCart)

  } catch (err) {
    console.log(`there is an erro While removing the cart item ${err}`)
  
  }
})
userRoutes.get('/getCurrentCart', cartController.getCurrentOrder)
userRoutes.get('/api/products', productController.getAllProducts)
userRoutes.get('/api/products/:id', productController.getProductById)
userRoutes.put('/placeOrder', async function(req, res){
  try {
    const {orderId} = req.body
    console.log(orderId, 'This is the order')
    await cartController.placeOrder(orderId)
    res.send('success')
  } catch (err) {
    console.log(`there is an error while placing the order ${err}`)
  }
})
userRoutes.get('/api/product/by', productController.getProductsByCategory)
userRoutes.post('/api/:id/wishList', wishListContoller.addToWhishList)
userRoutes.get('/api/:id/wishList', wishListContoller.getWishList)
userRoutes.delete('/api/:id/wishList', wishListContoller.removeFromWishList )
module.exports = userRoutes