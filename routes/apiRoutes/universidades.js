var express = require('express')
var router = express.Router()
var mongoose = require('mongoose')

const universidadeSchema = new mongoose.Schema({
    sigla: 'string',
    nome: 'string',
    candidaturasAbertas: 'boolean'
})
const Universidade = mongoose.model('Universidade', universidadeSchema)

router.post('/nova', async(req, res) => {
    try {
        var universidade = new Universidade(req.body)
        var universidadeGuardada = await universidade.save()
        res.status(200).send(universidadeGuardada)
        console.log('Pedido POST de nova universidade recebido e feito com sucesso')
    } catch (error) {
        res.sendStatus(500)
        console.log('Pedido POST de nova universidade falhou! Erros:')
        return console.error(error)
    }
})

module.exports = router