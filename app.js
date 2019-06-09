if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

const express = require('express')
const loraController = require('./controllers/loraController')

const app = express()

// Set up template engine
app.set('view engine', 'ejs')

// Static files
app.use(express.static('./public'))

// Fire Controllers
loraController(app)

// Listen to port
app.listen(process.env.PORT || 3000)
console.log('You are listening to port 3000')