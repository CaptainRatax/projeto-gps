var express = require('express')
var bodyParser = require('body-parser')
const path = require("path");
require('dotenv').config()
var app = express()
var http = require('http').Server(app)
var mongoose = require('mongoose')

app.use(express.static(__dirname))
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

var server = app.listen(process.env.PORT, () => {
    console.log('O server está à escuta na porta', server.address().port)
})



//FRONTEND (REDENDERIZAÇÃO DAS PÁGINAS)
//frontoffice

app.get('/candidaturas', function(req, res) {
    res.sendFile(path.join(__dirname + "/public/candidatura.html"))
});

app.get('/blog', function(req, res) {
    res.sendFile(path.join(__dirname + "/public/blog.html"))
});

app.get('/contactos', function(req, res) {
    res.sendFile(path.join(__dirname + "/public/contactos.html"))
});

//backoffice

app.get('/login', function(req, res) {
    res.sendFile(path.join(__dirname + "/public/login.html"))
});

app.get('/administracao/', function(req, res) {
    res.sendFile(path.join(__dirname + "/public/dashboard.html"))
});

app.get('/administracao/candidaturas', function(req, res) {
    res.sendFile(path.join(__dirname + "/public/gerirCandidaturas.html"))
});

app.get('/administracao/blog', function(req, res) {
    res.sendFile(path.join(__dirname + "/public/gerirBlog.html"))
});

app.get('/administracao/dadosDoSite', function(req, res) {
    res.sendFile(path.join(__dirname + "/public/dadosSite.html"))
});

app.get('/administracao/contactos', function(req, res) {
    res.sendFile(path.join(__dirname + "/public/gerirContactos.html"))
});

app.get('/administracao/blog/post', function(req, res) {
    res.sendFile(path.join(__dirname + "/public/gerirPost.html"))
});

app.get('/administracao/candidaturas/detalhes', function(req, res) {
    res.sendFile(path.join(__dirname + "/public/detalhesCandidatura.html"))
});



//API BACKEND

app.post('/api/candidatura', async(req, res) => {
    try {
        var candidatura = new Candidatura(req.body)
        var candidaturaGuardada = await candidatura.save()
        res.status(200).send(candidaturaGuardada)
    } catch (error) {
        res.sendStatus(500)
        return console.error(error)
    } finally {
        console.log('Pedido POST recebido')
    }
})

//Request Dummy que vai ser chamado de tanto em tanto tempo para não deixar o heroku e o mongodb entrarem em repouso
app.get('/api/dummy', async(req, res) => {
    const dummySchemma = new mongoose.Schema({
        dummy: 'string',
        dummy2: 'string'
    })
    const Dummy = mongoose.model('Dummy', dummySchemma)
    try {
        var dummy = new Dummy({ "dummy": "dummy", "dummy2": "dummy2" })
        var dummyGuardado = await dummy.save()
        await Dummy.deleteOne({ _id: dummyGuardado._id })
        res.status(200).send("Dummy called!")
    } catch (error) {
        res.status(500).send("Erro ao tentar chamar o dummy. Erro:" + error)
    }

})




//Dexar estes métodos sempre no fim do código!
app.get('/administracao/*', function(req, res) {
    res.sendFile(path.join(__dirname + "/public/404backoffice.html"))
});

app.get('*', function(req, res) {
    res.sendFile(path.join(__dirname + "/public/404frontoffice.html"))
});