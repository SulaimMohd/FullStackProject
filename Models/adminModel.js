const mongoose = require('mongoose')

const adminModel = new mongoose.Schema({
  name:{
    type:String,
    require:true
  },
  email:{
    type:String,
    require:true
  },
  password:{
    type:String,
    require:true
  }
})


module.exports = mongoose.model('admin', adminModel)