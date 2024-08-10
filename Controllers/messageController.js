
const MessageModel = require('../Models/messageModel')
const mongoose = require('mongoose')


module.exports = {
  postMessage:async function(req, res){
    try {
      const {userId} = req.query
      const {message} = req.body
      const result = await MessageModel.create({isRead:false, userId, message})
      res.status(200).json({message:'Message posted succes fully'})
    } catch (err) {
      res.json('there is an error while posting the message')
    }
  }
}