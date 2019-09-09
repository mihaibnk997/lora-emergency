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

var urlencodedParser = bodyParser.urlencoded({ extended: false })
var jsonParser = bodyParser.json()

module.exports = function(app) {

app.get('/main', (req, res) => {
    // Get data from mongdo db and pass it to view
    loraModel.find({}, (err, data) =>{
        if (err) throw err

        let temp= [];
        let dist= [];
        let waterAlert= [];
        let i = -1;
        let waSum = 0;
        data.forEach( (item) => {
            temp[i] = (item.payload_fields && item.payload_fields.temperature)
            dist[i] = (item.payload_fields && item.payload_fields.distance)
            waterAlert[i] = (item.payload_fields && item.payload_fields.water_alert)
            waSum = waSum + (item.payload_fields && item.payload_fields.water_alert)
            i++;
        })

        waMean = waSum / i;
        waLast = waterAlert[i-1];


        res.render('main', {
            loramodels: data,
            length: data.length,
            waMean: waMean,
            waLast: waLast,
            tables_1: "/tables_1",
            tables_2: "/tables_2",
            graphs: "/graphs",
            about: "/about"
        })

    })
})

app.post('/main', jsonParser, (req, res) => {
    // Get data from the view and add it to mongodb
    let newloraModel = loraModel(req.body).save( (err,data) =>{
        if (err) throw err
        res.json(data)
        console.log(req.body)
    })
    //data.push(req.body)
})


app.get('/about', (req, res) => {
    res.render('about' , {
        tables_1: "/tables_1",
        tables_2: "/tables_2",
        graphs: "/graphs",
        main: "/main"
    })
})

app.get('/shop', (req, res) => {
    res.render('shop')
})

app.get('/lora', (req, res) => {
    res.render('lora')
})

app.get('/graphs', (req, res) => {
    res.render('graphs', {
        generate: "/generate_graphs",
        tables_1: "/tables_1",
        tables_2: "/tables_2",
        main: "/main"
    })
})


app.get('/danger', (req, res) => {
    res.render('danger', {
        link: "https://www.google.com/"
    })
})

app.get('/tables_1', (req, res) => {
    loraModel.find({}, (err, data) =>{
        if (err) throw err
        //console.log("My data " + JSON.stringify(data))
        //console.log("My dev_id "+ data.dev_id)
        //let x = JSON.stringify(data[2])
        //console.log(x)

        let temp= [];
        let dist= [];
        let waterAlert= [];
        let hum= [];
        let i = -1;
        let tempSum= 0, distSum = 0, humSum = 0, waSum = 0;
        data.forEach( (item) => {
            if(item.dev_id === "lora_1") {
            temp[i] = (item.payload_fields && item.payload_fields.temperature)
            tempSum = tempSum + (item.payload_fields && item.payload_fields.temperature)
            dist[i] = (item.payload_fields && item.payload_fields.distance)
            distSum = distSum + (item.payload_fields && item.payload_fields.distance)
            waterAlert[i] = (item.payload_fields && item.payload_fields.water_alert)
            waSum = waSum + (item.payload_fields && item.payload_fields.water_alert)
            hum[i] = (item.payload_fields && item.payload_fields.humidity)
            humSum = humSum + (item.payload_fields && item.payload_fields.humidity)
            i++;
            }
        
        })

        tempMean = tempSum / i;
        humMean = humSum / i;
        distMean = distSum / i;
        waMean = waSum / i;

        if(waMean < 1) state = 'Stare ok'
        else state = "Stare de pericol"

        res.render('tables_1', {
            loramodels: data,
            length: data.length,
            tempMean: tempMean,
            humMean: humMean,
            distMean: distMean,
            state: state,
            tables_2: "/tables_2",
            graphs: "/graphs",
            main: "/main"
        })
    })
})

app.get('/tables_2', (req, res) => {
    loraModel.find({}, (err, data) =>{
        if (err) throw err
        //console.log("My data " + JSON.stringify(data))
        //console.log("My dev_id "+ data.dev_id)
        //let x = JSON.stringify(data[2])
        //console.log(x)

        let temp= [];
        let dist= [];
        let waterAlert= [];
        let hum= [];
        let i = -1;
        let tempSum= 0, distSum = 0, humSum = 0, waSum = 0;
        data.forEach( (item) => {
            if(item.dev_id == 'lora_2') {
            temp[i] = (item.payload_fields && item.payload_fields.temperature)
            tempSum = tempSum + (item.payload_fields && item.payload_fields.temperature)
            dist[i] = (item.payload_fields && item.payload_fields.distance)
            distSum = distSum + (item.payload_fields && item.payload_fields.distance)
            waterAlert[i] = (item.payload_fields && item.payload_fields.water_alert)
            waSum = waSum + (item.payload_fields && item.payload_fields.water_alert)
            hum[i] = (item.payload_fields && item.payload_fields.humidity)
            humSum = humSum + (item.payload_fields && item.payload_fields.humidity)
            i++;
            }
        
        })

        tempMean = tempSum / i;
        humMean = humSum / i;
        distMean = distSum / i;
        waMean = waSum / i;

        if(waMean < 1) state = 'Stare ok'
        else state = "Stare de pericol"

        res.render('tables_2', {
            loramodels: data,
            length: data.length,
            tempMean: tempMean,
            humMean: humMean,
            distMean: distMean,
            state: state,
            tables_1: "/tables_1",
            graphs: "/graphs",
            main: "/main"
        })
    })
})

app.get('/generate_graphs', (req, res) => {
    loraModel.find({}, (err, data) =>{
        if (err) throw err
        //console.log("My data " + JSON.stringify(data))
        //console.log("My dev_id "+ data.dev_id)
        //let x = JSON.stringify(data[2])
        //console.log(x)

        let temp1= [];
        let temp2= [];
        let dist1= [];
        let dist2= [];
        let hum1= [];
        let hum2= [];
        let waterAlert1= [];
        let waterAlert2= [];
        let time1X = [];
        let time2X = [];
        let i = -1;
        data.forEach( (item) => {
            if(item.dev_id === 'lora_1') {
            temp1[i] = (item.payload_fields && item.payload_fields.temperature)
            hum1[i] = (item.payload_fields && item.payload_fields.humidity)
            dist1[i] = (item.payload_fields && item.payload_fields.distance)
            waterAlert1[i] = (item.payload_fields && item.payload_fields.water_alert)
            time1X[i] = (item.metadata && item.metadata.time)
            //console.log(temp1[i])
            i++;
            }
        })
        console.log(i)

        i = -1;
        data.forEach( (item) => {
            if(item.dev_id === 'lora_2') {
                temp2[i] = (item.payload_fields && item.payload_fields.temperature)
                hum2[i] = (item.payload_fields && item.payload_fields.humidity)
                dist2[i] = (item.payload_fields && item.payload_fields.distance)
                waterAlert2[i] = (item.payload_fields && item.payload_fields.water_alert)
                time2X[i] = (item.metadata && item.metadata.time)
                //console.log(temp2[i])
                i++;
                }
        })

        plotly = require('plotly')("mihai.banica97", "NqIyhBnmXQ9PSj8dI9vc")

        // Grafice Temperaturi
        var trace1_temp1 = {
            x: time1X,
            y: temp1,
            type: "scatter",
            name: "Temp Nod 1"
        }

        var trace2_temp2 = {
            x: time2X,
            y: temp2,
            type: "scatter",
            name: "Temp Nod 2"
        }

        var dataGraph = [trace1_temp1, trace2_temp2]

        var graphOptions = {filename: "temperaturi", fileopt: "overwrite"};
        plotly.plot(dataGraph, graphOptions, function (err, msg) {
            console.log(msg);
        });

        // Grafice umiditate
        var trace1_hum1 = {
            x: time1X,
            y: hum1,
            type: "scatter",
            name: "Hum Nod 1"
        }

        var trace2_hum2 = {
            x: time2X,
            y: hum2,
            type: "scatter",
            name: "Hum Nod 2"
        }

        var dataGraph = [trace1_hum1, trace2_hum2]

        var graphOptions = {filename: "umiditate", fileopt: "overwrite"};
        plotly.plot(dataGraph, graphOptions, function (err, msg) {
            console.log(msg);
        });

        // Grafice distanta
        var trace1_dist1 = {
            x: time1X,
            y: dist1,
            type: "scatter",
            name: "Dist Nod 1"
        }

        var trace2_dist2 = {
            x: time2X,
            y: dist2,
            type: "scatter",
            name: "Dist Nod 2"
        }

        var dataGraph = [trace1_dist1, trace2_dist2]

        var graphOptions = {filename: "distanta", fileopt: "overwrite"};
        plotly.plot(dataGraph, graphOptions, function (err, msg) {
            console.log(msg);
        });

        // Grafice Water Alert
        var trace1_wa1 = {
            x: time1X,
            y: waterAlert1,
            type: "scatter",
            name: "WA Nod 1"
        }

        var trace2_wa2 = {
            x: time2X,
            y: waterAlert2,
            type: "scatter",
            name: "WA Nod 2"
        }

        var dataGraph = [trace1_wa1, trace2_wa2]

        var graphOptions = {filename: "alerta_apa", fileopt: "overwrite"};
        plotly.plot(dataGraph, graphOptions, function (err, msg) {
            console.log(msg);
        });

        

        
        res.render('graphs', {
            loramodels: data,
            length: data.length,
            generate: "/generate_graphs",
            tables_1: "/tables_1",
            tables_2: "/tables_2",
            main: "/main"
        })
    })
})

}
