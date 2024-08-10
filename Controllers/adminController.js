const adminModel = require('../Models/adminModel')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const Joi = require('joi');

const schema = Joi.object({
  name: Joi.string().alphanum().min(3).max(30).required(),
  password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
  email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required()
})

module.exports = {
  register:async(req, res)=>{
    try {
      const {name, password, email} = req.body
      console.log({name, password, email})
      const validation = await schema.validateAsync({name, password, email})
      console.log(`this is the result ${validation}`)
      const isExist = await adminModel.findOne({email})
      console.log(isExist)
      if(!isExist){
        const hashedPassword = bcrypt.hashSync(password, 10)
        console.log(hashedPassword)
        const result = await adminModel.create(
          {
              name,
              email,
              password:hashedPassword
          }
        )
      return res.send('admin register')}
      else{
        return res.status(400).send({message:"this email Already exists"})
      }
    } catch (err) {
      console.log(`There is an error while rgistering the admin`)
      return res.status(500).send('sever erorr')
    }
  },
  logIn:async(req, res)=>{
    try {
      const {email, password} = req.body
      const user = await adminModel.findOne({email})
      console.log(user)
      if(!user)
      {
        throw new Error("admin with this email is not found")
      }
      console.log(user.password)
      const match = bcrypt.compareSync (password, user.password)
      if(!match){
        throw new Error('Wrong password')
      }
      const adminKey = process.env.ADMIN_KEY
      const token = jwt.sign({name:user.name, email}, adminKey, {expiresIn: '1h'})
      
      res.send(token)
    } catch (err) {
      console.log(`Error while adminLogIn`)
      res.send(`Erro while admin logIn ${err}`)
    } 
  }
}