const { boolean } = require('joi')
const mongoose = require('mongoose')

const MessageModel = new mongoose.Schema({
  userId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'Users'
  },
  message:{
    type:String,
    require:true
  },
  isRead:{
    type:Boolean,
    default:false
  }
})

module.exports = mongoose.model('Messages', MessageModel)