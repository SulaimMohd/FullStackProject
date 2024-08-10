const express = require('express')
const productController = require('../Controllers/productController')
const userContoller = require('../Controllers/userContoller')
const cartContoller = require('../Controllers/cartContoller')
const adminController = require('../Controllers/adminController')
const adminAuth = require('../Utils/adminAuth')
const adminRoute = express.Router()
adminRoute.get('/',adminAuth,  (req, res)=> res.send("loged in to admin"))
adminRoute.post('/register', adminController.register)
adminRoute.post('/logIn', adminController.logIn)
// adminRoute.use(adminAuth)
adminRoute.post('/product/create', productController.create)
adminRoute.get('/api/users', userContoller.getAllUsers)
adminRoute.get('/api/users/:id', userContoller.getUserById)
adminRoute.get('/api/products', productController.getAllProducts )
adminRoute.get('/api/products/:id', productController.getProductById )
adminRoute.get('/api/product/by', productController.getProductsByCategory)
adminRoute.put('/api/product', productController.updateProduct)
adminRoute.delete('/api/product/:id', productController.deleteProductById)
adminRoute.get('/api/completedOrders', cartContoller.completedOrders)



module.exports = adminRoute