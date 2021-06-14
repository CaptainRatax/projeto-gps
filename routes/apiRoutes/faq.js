var express = require('express')
var router = express.Router()
var mongoose = require('mongoose')
const { Faq } = require('../../models/faqSchema')

router.post('/novo', async(req, res) => {
    try {
        var faq = new Faq(req.body)
        var faqGuardado = await faq.save()
        res.status(200).send(faqGuardado)
        console.log('Pedido POST de novo faq recebido e feito com sucesso')
    } catch (error) {
        res.status(500).send("Algo correu mal com o pedido")
        console.log('Pedido POST de novo faq do site falhou! Erros:')
        return console.error(error)
    }
})

router.get('/', async(req, res) => {
    try {
        var faq = await Faq.find({}).sort({ ordem: 1 })
        res.status(200).send(faq)
        console.log('Pedido GET de todos os faq recebido e feito com sucesso')
    } catch (error) {
        res.status(500).send("Algo correu mal com o pedido")
        console.log('Pedido GET de todos os faq falhou! Erros:')
        return console.error(error)
    }
})

router.get('/id/:id', async(req, res) => {
    try {
        var ObjectId = mongoose.Types.ObjectId;
        if (!ObjectId.isValid(req.params.id)) {
            return res.status(400).send("Esse id não é válido!")
        }
        var faq = await Faq.find({ _id: req.params.id })
        if (faq.length === 0) {
            return res.status(404).send("Não foi encontrado nenhum faq com esse id")
        }
        res.status(200).send(faq[0])
        console.log('Pedido GET de faq por ID recebido e feito com sucesso')
    } catch (error) {
        res.status(500).send("Algo correu mal com o pedido")
        console.log('Pedido GET de faq por ID falhou! Erros:')
        return console.error(error)
    }
})

router.get('/perguntaresposta', async(req, res) => {
    try {
        if (!req.query.pergunta) {
            return res.status(400).send("Tem que especificar uma pergunta nos query parameters")
        }
        if (!req.query.resposta) {
            return res.status(400).send("Tem que especificar uma resposta nos query parameters")
        }
        const pergunta = req.query.pergunta;
        const resposta = req.query.resposta;

        var faq = await Faq.find({ "pergunta": pergunta, "resposta": resposta })
        if (faq.length === 0) {
            return res.status(404).send("Não foi encontrado nenhum faq com essas pergunta/resposta")
        }
        res.status(200).send(faq[0])
        console.log('Pedido GET de faq por pergunta/resposta recebido e feito com sucesso')
    } catch (error) {
        res.status(500).send("Algo correu mal com o pedido")
        console.log('Pedido GET de faq por pergunta/resposta falhou! Erros:')
        return console.error(error)
    }
})

router.patch('/alterar', async(req, res) => {
    try {
        var faq = new Faq(req.body)
        var ObjectId = mongoose.Types.ObjectId;
        if (!ObjectId.isValid(req.body._id)) {
            return res.status(400).send("Esse id não é válido!")
        }
        var verifyFaq = await Faq.find({ _id: req.body._id })
        if (verifyFaq.length === 0) {
            return res.status(404).send("Não foi encontrado nenhum faq com esse id")
        }
        var faqGuardado = await Faq.findOneAndUpdate({ _id: req.body._id }, faq, { new: true, useFindAndModify: false })
        res.status(200).send(faqGuardado)
        console.log('Pedido Patch de faq do site recebido e feito com sucesso')
    } catch (error) {
        res.status(500).send("Algo correu mal com o pedido")
        console.log('Pedido Patch de faq do site falhou! Erros:')
        return console.error(error)
    }
})

router.delete('/eliminar/:id', async(req, res) => {
    try {
        var ObjectId = mongoose.Types.ObjectId;
        if (!ObjectId.isValid(req.params.id)) {
            return res.status(400).send("Esse id não é válido!")
        }
        var faq = await Faq.find({ _id: req.params.id })
        if (faq.length === 0) {
            return res.status(404).send("Não foi encontrado nenhum faq com esse id")
        }
        await Faq.deleteOne({ _id: req.params.id })
        res.status(200).send("O faq foi eliminado com sucesso!")
        console.log('Pedido DELETE testemunho recebido e feito com sucesso')
    } catch (error) {
        res.status(500).send("Algo correu mal com o pedido")
        console.log('Pedido DELETE faq falhou! Erros:')
        return console.error(error)
    }
})

module.exports = router