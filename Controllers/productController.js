const mongoose = require('mongoose')
const productModel = require('../Models/productModel')

module.exports = {
  create:async(req, res)=>{
    try {
      const {productName, imageUrl, price, category, quantity, description, discount} = req.body
      console.log({productName, imageUrl, price, category,quantity, description, discount} )
      const result = await productModel.create({productName, imageUrl, price, category, quantity, description, discount})
      console.log(result)
      res.send('product created')
    } catch (err) {
        console.log(`Error while creating the product ${err}`)
    }
  },
  getAllProducts:async(req, res)=>{
    try {
      const allProducts = await productModel.find()
      res.json(allProducts)
    } catch (err) {
      console.log(`There is an error while fetching all products`)
      res.send('No products found in the database')
    }
  },
  getProductById:async(req, res)=>{
    try {
      const {id} = req.params
      const productById = await productModel.find({_id:id})
      res.json(productById)
    } catch (err) {
      console.log('There is an erro while getting the product By id')
      res.send('No product found')
    }
  },
  getProductsByCategory:async(req, res)=>{
    try {
        const {category}= req.query
        console.log(category)
        const productsByCategory = await productModel.aggregate([{$match:{category}}])
        res.json(productsByCategory)
    } catch (err) {
      console.log('There is an erro while fetching the product by category')
      res.send('Not found')
    }
  },
  updateProduct:async(req, res)=>{
    try {
      const {id, ...rest} = req.body
      console.log(id, rest)
      const updatedProduct = await productModel.updateOne({_id:id}, {$set:{...rest}})
      res.send('product updated')
    } catch (err) {
      console.log('there is an error while updating the product')
      res.send('Not updated the product')
    }
  },
  deleteProductById:async(req, res)=>{
    try {
      const {id} = req.params
      console.log(id)
      const result = await productModel.deleteOne({_id:id})
      res.send('product Deleted Succesfully')
    } catch (err) {
      console.log('Error while deleting the product')
      res.send("Product not found")
      
    }
  }
}
