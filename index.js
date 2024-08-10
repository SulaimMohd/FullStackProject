const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors') 
const morgan = require('morgan')

const dotenv = require('dotenv')
dotenv.config()

const PORT = process.env.PORT || 3000
const DB_URL = process.env.DB_URL
console.log(PORT)
const app = express()
app.use(morgan('combined'))
app.use(cors())
app.use(express.urlencoded({extended:false}))
app.use(express.json())
mongoose.connect(DB_URL).then(()=> console.log('db Connected'))
app.use('/',require('./Routes/Routes'))
app.use('/*', (req, res)=> res.send('Sorry not found'))

app.listen(PORT, ()=> console.log(`Server listening at port${PORT}`))