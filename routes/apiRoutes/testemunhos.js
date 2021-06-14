var express = require('express')
var router = express.Router()
var mongoose = require('mongoose')
const { Testemunho } = require('../../models/testemunhoSchema')

router.post('/novo', async(req, res) => {
    try {
        var testemunho = new Testemunho(req.body)
        var testemunhoGuardado = await testemunho.save()
        res.status(200).send(testemunhoGuardado)
        console.log('Pedido POST de novo testemunho recebido e feito com sucesso')
    } catch (error) {
        res.status(500).send("Algo correu mal com o pedido")
        console.log('Pedido POST de novo testemunho do site falhou! Erros:')
        return console.error(error)
    }
})

router.get('/', async(req, res) => {
    try {
        var testemunhos = await Testemunho.find({})
        res.status(200).send(testemunhos)
        console.log('Pedido GET de todos os dados do site recebido e feito com sucesso')
    } catch (error) {
        res.status(500).send("Algo correu mal com o pedido")
        console.log('Pedido GET de todos os dados do site falhou! Erros:')
        return console.error(error)
    }
})

router.get('/id/:id', async(req, res) => {
    try {
        var ObjectId = mongoose.Types.ObjectId;
        if (!ObjectId.isValid(req.params.id)) {
            return res.status(400).send("Esse id não é válido!")
        }
        var testemunho = await Testemunho.find({ _id: req.params.id })
        if (testemunho.length === 0) {
            return res.status(404).send("Não foi encontrado nenhum testemunho com esse id")
        }
        res.status(200).send(testemunho[0])
        console.log('Pedido GET de testemunho por ID recebido e feito com sucesso')
    } catch (error) {
        res.status(500).send("Algo correu mal com o pedido")
        console.log('Pedido GET de testemunho por ID falhou! Erros:')
        return console.error(error)
    }
})

router.patch('/alterar', async(req, res) => {
    try {
        var testemunho = new Testemunho(req.body)
        var ObjectId = mongoose.Types.ObjectId;
        if (!ObjectId.isValid(req.body._id)) {
            return res.status(400).send("Esse id não é válido!")
        }
        var verifyTestemunho = await Testemunho.find({ _id: req.body._id })
        if (verifyTestemunho.length === 0) {
            return res.status(404).send("Não foi encontrado nenhum testemunho com esse id")
        }
        var testemunhoGuardado = await Testemunho.findOneAndUpdate({ _id: req.body._id }, testemunho, { new: true, useFindAndModify: false })
        res.status(200).send(testemunhoGuardado)
        console.log('Pedido Patch de testemunho do site recebido e feito com sucesso')
    } catch (error) {
        res.status(500).send("Algo correu mal com o pedido")
        console.log('Pedido Patch de testemunho do site falhou! Erros:')
        return console.error(error)
    }
})

router.delete('/eliminar/:id', async(req, res) => {
    try {
        var ObjectId = mongoose.Types.ObjectId;
        if (!ObjectId.isValid(req.params.id)) {
            return res.status(400).send("Esse id não é válido!")
        }
        var testemunho = await Testemunho.find({ _id: req.params.id })
        if (testemunho.length === 0) {
            return res.status(404).send("Não foi encontrado nenhum testemunho com esse id")
        }
        await Testemunho.deleteOne({ _id: req.params.id })
        res.status(200).send("O testemunho foi eliminado com sucesso!")
        console.log('Pedido DELETE testemunho recebido e feito com sucesso')
    } catch (error) {
        res.status(500).send("Algo correu mal com o pedido")
        console.log('Pedido DELETE testemunho falhou! Erros:')
        return console.error(error)
    }
})

module.exports = router