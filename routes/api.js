var express = require('express')
var router = express.Router()
var mongoose = require('mongoose')
require('dotenv').config()
var emailValidator = require("email-validator");
var jwt = require('jsonwebtoken');

const { Utilizador } = require('../models/utilizadorSchema')
const { Login } = require('../models/loginSchema')

var candidaturas = require('./apiRoutes/candidaturas')
var universidades = require('./apiRoutes/universidades')
var posts = require('./apiRoutes/posts')
var contactos = require('./apiRoutes/contactos')
var utilizadores = require('./apiRoutes/utilizadores')
var dadosSite = require('./apiRoutes/dadosSite')
var testemunhos = require("./apiRoutes/testemunhos")
var faqs = require("./apiRoutes/faq")

router.use('/candidaturas', candidaturas)
router.use('/universidades', universidades)
router.use('/posts', posts)
router.use('/contactos', contactos)
router.use('/utilizadores', utilizadores)
router.use('/dadossite', dadosSite)
router.use('/testemunhos', testemunhos)
router.use('/faqs', faqs)

//Login

router.post('/login', async(req, res) => {
    try {
        var loginInfo = new Login(req.body);
        if (!loginInfo.email) {
            return res.status(400).send('Corpo do pedido inválido')
        }
        if (!loginInfo.password) {
            return res.status(400).send('Corpo do pedido inválido')
        }
        if (!emailValidator.validate(loginInfo.email)) {
            return res.status(400).send('Email inválido')
        }

        var confirmacaoUser = Utilizador.find({ email: loginInfo.email, password: loginInfo.password }, function(err, results) {
            if (err) {
                res.status(500).send("Algo correu mal com o pedido")
                console.log('Pedido POST de login falhou! Erros:')
                return console.error(err)
            }
            if (!results) {
                console.log('Pedido POST de login recebido e não autorizado com sucesso')
                return res.status(401).send('Email ou Password errados!');
            } else if (results.length == 1) {
                var token = jwt.sign({
                    exp: Math.floor(Date.now() / 1000) + (60 * 60),
                    data: loginInfo.email + ':' + loginInfo.password
                }, process.env.TOKEN_SECRET);
                var response = {
                    user: results[0],
                    token: token
                }
                res.status(200).send(response);
                console.log('Pedido POST de login recebido e autorizado com sucesso')
            } else {
                console.log('Pedido POST de login recebido e não autorizado com sucesso')
                return res.status(401).send('Email ou Password errados!');
            }
        })
    } catch (error) {
        res.status(500).send("Algo correu mal com o pedido")
        console.log('Pedido POST de login falhou! Erros:')
        return console.error(error)
    }
})

router.post('/verifyToken', async(req, res) => {
    try {
        if (!req.body.token) {
            return res.status(400).send('Corpo do pedido inválido')
        }
        jwt.verify(req.body.token, process.env.TOKEN_SECRET, function(err, decoded) {
            if (!decoded) {
                res.status(401).send("Token inválido! Não autorizado!")
                console.log('Pedido POST de verificar token recebido e não autorizado com sucesso')
            } else {
                var userInfo = decoded.data.split(":");
                var confirmacaoUser = Utilizador.find({ email: userInfo[0], password: userInfo[1] }, function(err, results) {
                    if (err) {
                        res.status(500).send("Algo correu mal com o pedido")
                        console.log('Pedido POST de verificar token falhou! Erros:')
                        return console.error(err)
                    }
                    if (!results) {
                        console.log('Pedido POST de verificar token recebido e não autorizado com sucesso')
                        return res.status(401).send('Email ou Password errados!');
                    } else {
                        res.status(200).send({ user: results[0], success: true });
                        console.log('Pedido POST de verificar token recebido e autorizado com sucesso')
                    }
                })
            }
        });
    } catch (error) {
        res.status(500).send("Algo correu mal com o pedido")
        console.log('Pedido POST de verificar token falhou! Erros:')
        return console.error(error)
    }
})

const dummySchemma = new mongoose.Schema({
    dummy: 'string',
    dummy2: 'string'
})
const Dummy = mongoose.model('Dummy', dummySchemma)

//Request Dummy que vai ser chamado de tanto em tanto tempo para não deixar o heroku e o mongodb entrarem em repouso
router.get('/dummy', async(req, res) => {
    try {
        var dummy = new Dummy({ "dummy": "dummy", "dummy2": "dummy2" })
        var dummyGuardado = await dummy.save()
        await Dummy.deleteOne({ _id: dummyGuardado._id })
        res.status(200).send("Dummy called!")
    } catch (error) {
        res.status(500).send("Erro ao tentar chamar o dummy. Erro:" + error)
    }

})

module.exports = router