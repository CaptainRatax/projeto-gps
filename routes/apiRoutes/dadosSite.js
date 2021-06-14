var express = require('express')
var router = express.Router()
var mongoose = require('mongoose')
const { DadosSite } = require('../../models/dadosSiteSchema')

router.post('/novo', async(req, res) => {
    try {
        var dadosSite = new DadosSite(req.body)
        var dadosSiteGuardados = await dadosSite.save()
        res.status(200).send(dadosSiteGuardados)
        console.log('Pedido POST de novos dados do site recebido e feito com sucesso')
    } catch (error) {
        res.status(500).send("Algo correu mal com o pedido")
        console.log('Pedido POST de novos dados do site falhou! Erros:')
        return console.error(error)
    }
})

router.get('/', async(req, res) => {
    try {
        var dadosSite = await DadosSite.find({})
        res.status(200).send(dadosSite)
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
        var dadosSite = await DadosSite.find({ _id: req.params.id })
        if (dadosSite.length === 0) {
            return res.status(404).send("Não foram encontrados nenhuns dados do site com esse id")
        }
        res.status(200).send(dadosSite[0])
        console.log('Pedido GET de dados do site por ID recebido e feito com sucesso')
    } catch (error) {
        res.status(500).send("Algo correu mal com o pedido")
        console.log('Pedido GET de dados do site por ID falhou! Erros:')
        return console.error(error)
    }
})

router.patch('/alterar', async(req, res) => {
    try {
        var dadosDoSite = new DadosSite(req.body)
        var ObjectId = mongoose.Types.ObjectId;
        if (!ObjectId.isValid(req.body._id)) {
            return res.status(400).send("Esse id não é válido!")
        }
        var verifyDadosSite = await DadosSite.find({ _id: req.body._id })
        if (verifyDadosSite.length === 0) {
            return res.status(404).send("Não fotam encontrados nenhuns dados do site com esse id")
        }
        var dadosDoSiteGuardado = await DadosSite.findOneAndUpdate({ _id: req.body._id }, dadosDoSite, { new: true, useFindAndModify: false })
        res.status(200).send(dadosDoSiteGuardado)
        console.log('Pedido Patch de alterar dados do site recebido e feito com sucesso')
    } catch (error) {
        res.status(500).send("Algo correu mal com o pedido")
        console.log('Pedido GET de alterar dados do site falhou! Erros:')
        return console.error(error)
    }
})

router.delete('/eliminar/:id', async(req, res) => {
    try {
        var ObjectId = mongoose.Types.ObjectId;
        if (!ObjectId.isValid(req.params.id)) {
            return res.status(400).send("Esse id não é válido!")
        }
        var dadosDoSite = await DadosSite.find({ _id: req.params.id })
        if (dadosDoSite.length === 0) {
            return res.status(404).send("Não foram encontrados nenhuns dados do site com esse id")
        }
        await DadosSite.deleteOne({ _id: req.params.id })
        res.status(200).send("Os dados do site foram eliminados com sucesso!")
        console.log('Pedido DELETE dados do site recebido e feito com sucesso')
    } catch (error) {
        res.status(500).send("Algo correu mal com o pedido")
        console.log('Pedido DELETE dados do site falhou! Erros:')
        return console.error(error)
    }
})

module.exports = router