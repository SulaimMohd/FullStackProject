const express = require('express')
const route = express.Router()

route.get('/', (req, res)=>{
  res.send('This is an success request')
})
route.use('/user', require('./userRoutes'))
route.use('/admin', require('./adminRoutes'))

module.exports = route