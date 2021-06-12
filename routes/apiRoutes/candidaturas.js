var express = require('express')
var router = express.Router()
var mongoose = require('mongoose')
var emailValidator = require("email-validator");
const { Candidatura } = require('../../models/candidaturaSchema')
const { Universidade } = require('../../models/universidadeSchema')


router.post('/nova', async(req, res) => {
    try {
        var candidatura = new Candidatura(req.body)
        if (!req.body.email) {
            return res.status(400).send("Body inválido!")
        }
        var ObjectId = mongoose.Types.ObjectId;
        if (!ObjectId.isValid(req.body.universidade._id)) {
            return res.status(400).send("Esse id não é válido!")
        }
        var verifyUniversidade = await Universidade.find({ _id: req.body.universidade._id })
        if (verifyUniversidade.length === 0) {
            return res.status(404).send("Não foi encontrada nenhuma universidade com esse id")
        }
        if (!verifyUniversidade[0].candidaturasAbertas) {
            return res.status(400).send("Essa universidade não tem as candidaturas abertas")
        }
        if (!emailValidator.validate(req.body.email)) {
            return res.status(400).send("Email inválido!")
        }
        var candidaturaPorEmail = await Candidatura.find({ email: req.body.email })
        if (candidaturaPorEmail.length !== 0) {
            return res.status(400).send("Já foi encontrada uma candidatura com esse email")
        }
        var candidaturaGuardada = await candidatura.save()
        res.status(200).send(candidaturaGuardada)
        console.log('Pedido POST de nova candidatura recebido e feito com sucesso')
    } catch (error) {
        res.status(500).send("Algo correu mal com o pedido")
        console.log('Pedido POST de nova candidatura falhou! Erros:')
        return console.error(error)
    }
})

router.get('/', async(req, res) => {
    try {
        var candidaturas = await Candidatura.find({})
        res.status(200).send(candidaturas)
        console.log('Pedido GET de todas as candidaturas recebido e feito com sucesso')
    } catch (error) {
        res.status(500).send("Algo correu mal com o pedido")
        console.log('Pedido GET de todas as candidaturas falhou! Erros:')
        return console.error(error)
    }
})

router.get('/aprovadas', async(req, res) => {
    try {
        var candidaturas = await Candidatura.find({ aprovacao: true })
        res.status(200).send(candidaturas)
        console.log('Pedido GET de todas as candidaturas aprovadas recebido e feito com sucesso')
    } catch (error) {
        res.status(500).send("Algo correu mal com o pedido")
        console.log('Pedido GET de todas as candidaturas aprovadas falhou! Erros:')
        return console.error(error)
    }
})

router.get('/rejeitadas', async(req, res) => {
    try {
        var candidaturas = await Candidatura.find({ aprovacao: false })
        res.status(200).send(candidaturas)
        console.log('Pedido GET de todas as candidaturas desaprovadas recebido e feito com sucesso')
    } catch (error) {
        res.status(500).send("Algo correu mal com o pedido")
        console.log('Pedido GET de todas as candidaturas desaprovadas falhou! Erros:')
        return console.error(error)
    }
})

router.get('/porAprovar', async(req, res) => {
    try {
        var candidaturas = await Candidatura.find({ aprovacao: null })
        res.status(200).send(candidaturas)
        console.log('Pedido GET de todas as candidaturas por aprovar recebido e feito com sucesso')
    } catch (error) {
        res.status(500).send("Algo correu mal com o pedido")
        console.log('Pedido GET de todas as candidaturas por aprovar falhou! Erros:')
        return console.error(error)
    }
})

router.get('/id/:id', async(req, res) => {
    try {
        var ObjectId = mongoose.Types.ObjectId;
        if (!ObjectId.isValid(req.params.id)) {
            return res.status(400).send("Esse id não é válido!")
        }
        var candidatura = await Candidatura.find({ _id: req.params.id })
        if (candidatura.length === 0) {
            return res.status(404).send("Não foi encontrada nenhuma candidatura com esse id")
        }
        res.status(200).send(candidatura[0])
        console.log('Pedido GET de candidatura por ID recebido e feito com sucesso')
    } catch (error) {
        res.status(500).send("Algo correu mal com o pedido")
        console.log('Pedido GET de candidatura por ID falhou! Erros:')
        return console.error(error)
    }
})

router.get('/email/:email', async(req, res) => {
    try {
        if (!req.params.email) {
            return res.status(400).send("É necessário especificar o email no url!")
        }
        if (!emailValidator.validate(req.params.email)) {
            return res.status(400).send("Email inválido!")
        }
        var candidatura = await Candidatura.find({ email: req.params.email })
        if (candidatura.length === 0) {
            return res.status(404).send("Não foi encontrada nenhuma candidatura com esse email")
        }
        res.status(200).send(candidatura[0])
        console.log('Pedido GET de candidatura por email recebido e feito com sucesso')
    } catch (error) {
        res.status(500).send("Algo correu mal com o pedido")
        console.log('Pedido GET de candidatura por email falhou! Erros:')
        return console.error(error)
    }
})

router.get('/telemovel/:telemovel', async(req, res) => {
    try {
        var candidatura = await Candidatura.find({ telemovel: req.params.telemovel })
        if (candidatura.length === 0) {
            return res.status(404).send("Não foi encontrada nenhuma candidatura com esse nº de telemóvel")
        }
        res.status(200).send(candidatura[0])
        console.log('Pedido GET de candidatura por nº de telemóvel recebido e feito com sucesso')
    } catch (error) {
        res.status(500).send("Algo correu mal com o pedido")
        console.log('Pedido GET de candidatura por nº de telemóvel falhou! Erros:')
        return console.error(error)
    }
})

router.put('/aprovar/:id', async(req, res) => {
    try {
        var ObjectId = mongoose.Types.ObjectId;
        if (!ObjectId.isValid(req.params.id)) {
            return res.status(400).send("Esse id não é válido!")
        }
        var candidatura = await Candidatura.find({ _id: req.params.id })
        if (candidatura.length === 0) {
            return res.status(404).send("Não foi encontrada nenhuma candidatura com esse id")
        }
        var candidaturaAlterada = await Candidatura.findOneAndUpdate({ _id: req.params.id }, { aprovacao: true }, { new: true, useFindAndModify: false })
        res.status(200).send(candidaturaAlterada)
        console.log('Pedido PUT de aprovar uma candidatura recebido e feito com sucesso')
    } catch (error) {
        res.status(500).send("Algo correu mal com o pedido")
        console.log('Pedido PUT de aprovar uma candidatura falhou! Erros:')
        return console.error(error)
    }
})

router.put('/rejeitar/:id', async(req, res) => {
    try {
        var ObjectId = mongoose.Types.ObjectId;
        if (!ObjectId.isValid(req.params.id)) {
            return res.status(400).send("Esse id não é válido!")
        }
        var candidatura = await Candidatura.find({ _id: req.params.id })
        if (candidatura.length === 0) {
            return res.status(404).send("Não foi encontrada nenhuma candidatura com esse id")
        }
        var candidaturaAlterada = await Candidatura.findOneAndUpdate({ _id: req.params.id }, { aprovacao: false }, { new: true, useFindAndModify: false })
        res.status(200).send(candidaturaAlterada)
        console.log('Pedido PUT de rejeitar uma candidatura recebido e feito com sucesso')
    } catch (error) {
        res.status(500).send("Algo correu mal com o pedido")
        console.log('Pedido PUT de rejeitar uma candidatura falhou! Erros:')
        return console.error(error)
    }
})

router.patch('/alterar', async(req, res) => {
    try {
        var candidatura = new Candidatura(req.body)
        var ObjectId = mongoose.Types.ObjectId;
        if (!ObjectId.isValid(req.body._id)) {
            return res.status(400).send("Esse id não é válido!")
        }
        var verifyCandidatura = await Candidatura.find({ _id: req.body._id })
        if (verifyCandidatura.length === 0) {
            return res.status(404).send("Não foi encontrada nenhuma candidatura com esse id")
        }
        var candidaturaGuardada = await Candidatura.findOneAndUpdate({ _id: req.body._id }, candidatura, { new: true, useFindAndModify: false })
        res.status(200).send(candidaturaGuardada)
        console.log('Pedido PATCH de alterar uma candidatura recebido e feito com sucesso')
    } catch (error) {
        res.status(500).send("Algo correu mal com o pedido")
        console.log('Pedido GET de alterar uma candidatura falhou! Erros:')
        return console.error(error)
    }
})

router.delete('/eliminar/:id', async(req, res) => {
    try {
        var ObjectId = mongoose.Types.ObjectId;
        if (!ObjectId.isValid(req.params.id)) {
            return res.status(400).send("Esse id não é válido!")
        }
        var candidatura = await Candidatura.find({ _id: req.params.id })
        if (candidatura.length === 0) {
            return res.status(404).send("Não foi encontrada nenhuma candidatura com esse id")
        }
        await Candidatura.deleteOne({ _id: req.params.id })
        res.status(200).send("A candidatura foi eliminada com sucesso!")
        console.log('Pedido DELETE candidatura recebido e feito com sucesso')
    } catch (error) {
        res.status(500).send("Algo correu mal com o pedido")
        console.log('Pedido DELETE candidatura falhou! Erros:')
        return console.error(error)
    }
})

module.exports = router