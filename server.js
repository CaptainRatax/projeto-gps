var express = require('express')
var bodyParser = require('body-parser')
var app = express()
var http = require('http').Server(app)
var mongoose = require('mongoose')
require('dotenv').config()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

const dbUrl = process.env.DBURL

const candidaturaSchema = new mongoose.Schema({
    nome: 'string',
    email: 'string',
    telemovel: 'string',
    escola: 'string',
    descricao: 'string',
    imagem: 'string'
})
const Candidatura = mongoose.model('Candidatura', candidaturaSchema)

mongoose.connect(dbUrl, { useUnifiedTopology: true, useNewUrlParser: true }, (err) => {
    console.log('Conectado ao MongoDB. Errors:', err)
})

var server = http.listen(3000, () => {
    console.log('O server está à escuta na porta', server.address().port)
})

app.post('/candidatura', async(req, res) => {
    try {
        var candidatura = new Candidatura(req.body)
        console.log(candidatura)
        var candidaturaGuardada = await candidatura.save()
        res.status(200).send(candidaturaGuardada)
    } catch (error) {
        res.sendStatus(500)
        return console.error(error)
    } finally {
        console.log('Pedido POST recebido')
    }
})