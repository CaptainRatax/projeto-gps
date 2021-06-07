var express = require('express')
var router = express.Router()
var mongoose = require('mongoose')
const Candidatura = require('../../models/candidaturaSchema')


router.post('/nova', async(req, res) => {
    try {
        var candidatura = new Candidatura(req.body)
        var candidaturaGuardada = await candidatura.save()
        res.status(200).send(candidaturaGuardada)
        console.log('Pedido POST de nova candidatura recebido e feito com sucesso')
    } catch (error) {
        res.status(500).send("Algo correu mal com o pedido")
        console.log('Pedido POST de nova candidatura falhou! Erros:')
        return console.error(error)
    }
})

module.exports = router