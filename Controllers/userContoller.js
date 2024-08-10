const mongoose = require('mongoose')
const userModel = require('../Models/userModel')
const Joi = require('joi');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')



const schema = Joi.object({
  name: Joi.string().alphanum().min(3).max(30).required(),
  password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
  email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required()
})

module.exports = {
  create: async(req, res)=>{
    try {
      const {name, email, password} = req.body
      console.log(req.body)
      const validation = await schema.validateAsync({name, password, email})
      console.log(`this is the result ${validation}`)
      const isExist = await userModel.findOne({email})
      console.log(isExist)
      if(!isExist){
        const hashedPassword = bcrypt.hashSync(password, 10)
        console.log(hashedPassword)
        const result = await userModel.create(
          {
              name,
              email,
              password:hashedPassword
          }
        )
        return res.status(201).json({message:"user Created"})
      }else{
        return res.status(400).json({message:"user not created"})
      }
    }catch (err) {
      console.log(`There is an error while creating the user ${err}`)
      res.status(500).json({message:`Server Error ${err}`})
    }
  },
  getAllUsers:async(req,res)=>{
      try {
        const allUsers = await userModel.find()
        res.json(allUsers)
      } catch (err) {
        console.log('There is an error while getting all users')
        res.send('There is not any user')
      }
  },
  getUserById:async(req, res)=>{
    try {
      const {id} = req.params
      const userById = await userModel.find({_id:id})
      if(userById) res.json(userById)
    } catch (err) {
      console.log('There is an error while getting an user')
      res.send('User not found')
    }
  },
  logIn:async(req, res)=>{
    try {
      const {email, password} = req.body
      console.log(req.body)
      const user = await userModel.findOne({email})
      console.log(user)
      if(!user)
      {
        throw new Error("user with this email is not found")
      }
      console.log(user.password)
      const match = bcrypt.compareSync (password, user.password)
      if(!match){
        throw new Error('Wrong password')
      }
      const userKey = process.env.USER_KEY
      const token = jwt.sign({name:user.name, email}, userKey, {expiresIn: '1d'})
      
      return res.status(200).json({id:user._id, token:token})
    } catch (err) {
      console.log(`There is an error while logIn ${err}`)

      return res.status(400).send({message:`not found ${err}`})
    }
  }
}