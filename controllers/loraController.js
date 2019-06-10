const bodyParser = require('body-parser')
const mongoose = require('mongoose')

// Connect to the database
//mongoose.connect('mongodb+srv://test:test@cluster0-8rgpi.mongodb.net/test?retryWrites=true&w=majority', { useNewUrlParser: true })
mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true})
const db = mongoose.connection
db.on('error', error => console.error(error))
db.once('open', () => console.log('Connected to Mongoose'))

// Create a schema - this is like a blueprint
const loraSchema = new mongoose.Schema({
    app_id: {
        type: String,
        required: true
    },
    dev_id: {
        type: String,
        required:true
    },
    hardware_serial: {
        type: String,
        required: true
    },
    port: {
        type: Number,
        required: true
    },
    counter: {
        type: Number,
        required: true
    },
    payload_raw: {
        type: String,
        required: true
    },
    payload_fields: {
        type: Object,
        required: true
    },
    metadata: {
        type: Object,
        required: true
    },
    downlink_url: {
        type: String,
        required: true
    }
})

// Create a model
const loraModel = mongoose.model('loraModel', loraSchema)

// let itemOne = Todo({item: 'cumpara apa'}).save( (err) => {
//     if (err) throw err
//     console.log('item saved')
// })

//let data = [{item: 'get milk'}, {item: 'walk dog'}, {item: 'kick some coding ass'}]
var urlencodedParser = bodyParser.urlencoded({ extended: false })
var jsonParser = bodyParser.json()

module.exports = function(app) {

app.get('/lora', (req, res) => {
    // Get data from mongdo db and pass it to view
    loraModel.find({}, (err, data) =>{
        if (err) throw err
        //console.log("My data " + JSON.stringify(data))
        console.log("My dev_id "+ data.dev_id)
        res.render('lora', {loramodels: Wdata})
    })
})

app.post('/lora', jsonParser, (req, res) => {
    // Get data from the view and add it to mongodb
    let newloraModel = loraModel(req.body).save( (err,data) =>{
        if (err) throw err
        res.json(data)
        console.log(req.body)
    })
    //data.push(req.body)
})

app.delete('/lora/:item', (req, res) => {
    // Delete the requested item from mongodb
    Todo.find({item: req.params.item.replace(/\-/g, " ")}).deleteOne( (err, data) => {
        if (err) throw err
        res.json(data)
    })
})

}