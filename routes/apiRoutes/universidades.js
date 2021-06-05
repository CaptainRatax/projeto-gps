var express = require('express')
var router = express.Router()
var mongoose = require('mongoose')

const universidadeSchema = new mongoose.Schema({
    sigla: 'string',
    nome: 'string',
    candidaturasAbertas: 'boolean'
})
const Universidade = mongoose.model('Universidade', universidadeSchema)

router.get('/', async(req, res) => {
    try {
        var universidades = await Universidade.find({})
        res.status(200).send(universidades)
    } catch (error) {
        res.status(500).send("Algo correu mal com o pedido")
        console.log('Pedido GET de todas as universidades falhou! Erros:')
        return console.error(error)
    }
})

router.post('/nova', async(req, res) => {
    try {
        var universidade = new Universidade(req.body)
        var universidadeGuardada = await universidade.save()
        res.status(200).send(universidadeGuardada)
        console.log('Pedido POST de nova universidade recebido e feito com sucesso')
    } catch (error) {
        res.status(500).send("Algo correu mal com o pedido")
        console.log('Pedido POST de nova universidade falhou! Erros:')
        return console.error(error)
    }
})

router.get('/candidaturasAbertas', async(req, res) => {
    try {
        var universidades = await Universidade.find({ candidaturasAbertas: true })
        res.status(200).send(universidades)
    } catch (error) {
        res.status(500).send("Algo correu mal com o pedido")
        console.log('Pedido GET de todas as universidades falhou! Erros:')
        return console.error(error)
    }
})

router.get('/candidaturasFechadas', async(req, res) => {
    try {
        var universidades = await Universidade.find({ candidaturasAbertas: false })
        res.status(200).send(universidades)
    } catch (error) {
        res.status(500).send("Algo correu mal com o pedido")
        console.log('Pedido GET de todas as universidades falhou! Erros:')
        return console.error(error)
    }
})

router.get('/id/:id', async(req, res) => {
    try {
        var ObjectId = require('mongoose').Types.ObjectId;
        if (!ObjectId.isValid(req.params.id)) {
            return res.status(400).send("Esse id não é válido!")
        }
        var universidade = await Universidade.find({ _id: req.params.id })
        if (universidade.length === 0) {
            return res.status(404).send("Não foi encontrada nenhuma universidade com esse id")
        }
        res.status(200).send(universidade[0])
    } catch (error) {
        res.status(500).send("Algo correu mal com o pedido")
        console.log('Pedido GET de todas as universidades falhou! Erros:')
        return console.error(error)
    }
})

router.get('/sigla/:sigla', async(req, res) => {
    try {
        var universidade = await Universidade.find({ sigla: req.params.sigla })
        if (universidade.length === 0) {
            return res.status(404).send("Não foi encontrada nenhuma universidade com essa sigla")
        }
        res.status(200).send(universidade[0])
    } catch (error) {
        res.status(500).send("Algo correu mal com o pedido")
        console.log('Pedido GET de todas as universidades falhou! Erros:')
        return console.error(error)
    }
})

router.patch('/alterar', async(req, res) => {
    try {
        var universidade = new Universidade(req.body)
        var ObjectId = require('mongoose').Types.ObjectId;
        if (!ObjectId.isValid(req.body._id)) {
            return res.status(400).send("Esse id não é válido!")
        }
        var verifyUniversidade = await Universidade.find({ _id: req.body._id })
        if (verifyUniversidade.length === 0) {
            return res.status(404).send("Não foi encontrada nenhuma universidade com esse id")
        }
        var universidadeGuardada = await Universidade.findOneAndUpdate({ _id: req.body._id }, universidade, { new: true, overwrite: true })
        res.status(200).send(universidadeGuardada)
        console.log('Pedido Patch de alterar uma universidade recebido e feito com sucesso')
    } catch (error) {
        res.status(500).send("Algo correu mal com o pedido")
        console.log('Pedido GET de todas as universidades falhou! Erros:')
        return console.error(error)
    }
})

module.exports = router