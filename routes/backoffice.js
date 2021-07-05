var express = require('express')
const path = require("path");
var router = express.Router()

var dirname = __dirname.substring(0, __dirname.indexOf('routes', 0))

router.get('/login', function(req, res) {
    res.sendFile(path.join(dirname + "/public/login.html"))
});

router.get('/', function(req, res) {
    res.redirect('/administracao/candidaturas');
});

router.get('/candidaturas', function(req, res) {
    res.sendFile(path.join(dirname + "/public/gerirCandidaturas.html"))
});

router.get('/testemunhos', function(req, res) {
    res.sendFile(path.join(dirname + "/public/gerirTestemunhos.html"))
});

router.get('/testemunho', function(req, res) {
    res.sendFile(path.join(dirname + "/public/novoTestemunho.html"))
});

router.get('/dadosDoSite', function(req, res) {
    res.sendFile(path.join(dirname + "/public/dadosSite.html"))
});

router.get('/contactos', function(req, res) {
    res.sendFile(path.join(dirname + "/public/gerirContactos.html"))
});

router.get('/faqs', function(req, res) {
    res.sendFile(path.join(dirname + "/public/gerirFaqs.html"))
});

module.exports = router;