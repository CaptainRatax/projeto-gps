var express = require('express')
var bodyParser = require('body-parser')
const path = require("path");
require('dotenv').config()
var app = express()
var http = require('http').Server(app)
var mongoose = require('mongoose')
var fs = require('fs');

// writeFile function with filename, content and callback function
fs.writeFile('apiBaseUrl.txt', process.env.APIBASEURL, function(err) {
    if (err) throw err;
    console.log('API Base Url saved successfully.');
});

app.use(express.static(__dirname))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

var frontoffice = require('./routes/frontoffice')
var backoffice = require('./routes/backoffice')
var api = require('./routes/api')

const dbUrl = process.env.DBURL

mongoose.connect(dbUrl, { useUnifiedTopology: true, useNewUrlParser: true }, (err) => {
    console.log('Conectado ao MongoDB. Errors:', err)
})

var server = app.listen(process.env.PORT, () => {
    console.log('O server está à escuta na porta', server.address().port)
})



//FRONTEND (REDENDERIZAÇÃO DAS PÁGINAS)
//frontoffice
app.use('/', frontoffice)

//backoffice
app.use('/administracao', backoffice)


//API BACKEND
app.use('/api', api)




//Dexar estes métodos sempre no fim do código!
app.get('/administracao/*', function(req, res) {
    res.sendFile(path.join(__dirname + "/public/404backoffice.html"))
});

app.get('*', function(req, res) {
    res.sendFile(path.join(__dirname + "/public/404frontoffice.html"))
});