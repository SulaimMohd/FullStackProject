const jwt = require('jsonwebtoken')


const adminAuth = async(req, res, next)=>{
  const reqHeaders = req.headers
  console.log(reqHeaders)
  if(!reqHeaders['authorization']) return res.send(`cant' access`)
  const token = reqHeaders['authorization'].split(' ')[1]
  console.log(token)
  if(!token) return res.send(`cant't access`)
  const adminKey = process.env.ADMIN_KEY
  console.log(token)
  jwt.verify(token, adminKey, (err, user)=>{
    if(err) return res.send(`Sorry can't access ${err} ${token}`)
    console.log(user)
    next()
  })
  
  
}
module.exports = adminAuth