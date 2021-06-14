var express = require('express')
var router = express.Router()
var mongoose = require('mongoose')
const { Utilizador } = require('../../models/utilizadorSchema')

router.post('/novo', async(req, res) => {
    try {
        var utilizador = new Utilizador(req.body)
        var utilizadorGuardado = await utilizador.save()
        res.status(200).send(utilizadorGuardado)
        console.log('Pedido POST de novo utilizador recebido e feito com sucesso')
    } catch (error) {
        res.status(500).send("Algo correu mal com o pedido")
        console.log('Pedido POST de novo utilizador falhou! Erros:')
        return console.error(error)
    }
})

router.get('/', async(req, res) => {
    try {
        var utilizadores = await Utilizador.find({})
        res.status(200).send(utilizadores)
        console.log('Pedido GET de todos os utilizadores recebido e feito com sucesso')
    } catch (error) {
        res.status(500).send("Algo correu mal com o pedido")
        console.log('Pedido GET de todos os utilizadores falhou! Erros:')
        return console.error(error)
    }
})

router.get('/ativos', async(req, res) => {
    try {
        var utilizadores = await Utilizador.find({ isActive: true })
        res.status(200).send(utilizadores)
        console.log('Pedido GET de utilizadores ativos recebido e feito com sucesso')
    } catch (error) {
        res.status(500).send("Algo correu mal com o pedido")
        console.log('Pedido GET de utilizadores ativos falhou! Erros:')
        return console.error(error)
    }
})

router.get('/inativos', async(req, res) => {
    try {
        var utilizadores = await Utilizador.find({ isActive: false })
        res.status(200).send(utilizadores)
        console.log('Pedido GET de utilizadores inativos recebido e feito com sucesso')
    } catch (error) {
        res.status(500).send("Algo correu mal com o pedido")
        console.log('Pedido GET de utilizadores inativos falhou! Erros:')
        return console.error(error)
    }
})

router.get('/id/:id', async(req, res) => {
    try {
        var ObjectId = mongoose.Types.ObjectId;
        if (!ObjectId.isValid(req.params.id)) {
            return res.status(400).send("Esse id não é válido!")
        }
        var utilizador = await Utilizador.find({ _id: req.params.id })
        if (utilizador.length === 0) {
            return res.status(404).send("Não foi encontrado nenhum utilizador com esse id")
        }
        res.status(200).send(utilizador[0])
        console.log('Pedido GET de utilizador por ID recebido e feito com sucesso')
    } catch (error) {
        res.status(500).send("Algo correu mal com o pedido")
        console.log('Pedido GET de utilizador por ID falhou! Erros:')
        return console.error(error)
    }
})

router.get('/email/:email', async(req, res) => {
    try {
        var utilizador = await Utilizador.find({ email: req.params.email })
        if (utilizador.length === 0) {
            return res.status(404).send("Não foi encontrado nenhum utilizador com esse email")
        }
        res.status(200).send(utilizador[0])
        console.log('Pedido GET de utilizador por email recebido e feito com sucesso')
    } catch (error) {
        res.status(500).send("Algo correu mal com o pedido")
        console.log('Pedido GET de utilizador por email falhou! Erros:')
        return console.error(error)
    }
})

router.patch('/alterar', async(req, res) => {
    try {
        var utilizador = new Utilizador(req.body)
        var ObjectId = mongoose.Types.ObjectId;
        if (!ObjectId.isValid(req.body._id)) {
            return res.status(400).send("Esse id não é válido!")
        }
        var verifyUtilizador = await Utilizador.find({ _id: req.body._id })
        if (verifyUtilizador.length === 0) {
            return res.status(404).send("Não foi encontrado nenhum utilizador com esse id")
        }
        var utilizadorGuardado = await Utilizador.findOneAndUpdate({ _id: req.body._id }, utilizador, { new: true, useFindAndModify: false })
        res.status(200).send(utilizadorGuardado)
        console.log('Pedido Patch de alterar um utilizador recebido e feito com sucesso')
    } catch (error) {
        res.status(500).send("Algo correu mal com o pedido")
        console.log('Pedido GET de alterar um utilizador falhou! Erros:')
        return console.error(error)
    }
})

router.put('/ativar/:id', async(req, res) => {
    try {
        var ObjectId = mongoose.Types.ObjectId;
        if (!ObjectId.isValid(req.params.id)) {
            return res.status(400).send("Esse id não é válido!")
        }
        var utilizador = await Utilizador.find({ _id: req.params.id })
        if (utilizador.length === 0) {
            return res.status(404).send("Não foi encontrado nenhum utilizador com esse id")
        }
        var utilizadorAlterado = await Utilizador.findOneAndUpdate({ _id: req.params.id }, { isActive: true }, { new: true, useFindAndModify: false })
        res.status(200).send(utilizadorAlterado)
        console.log('Pedido PUT utilizador ativado recebido e feito com sucesso')
    } catch (error) {
        res.status(500).send("Algo correu mal com o pedido")
        console.log('Pedido PUT utilizador ativado falhou! Erros:')
        return console.error(error)
    }
})

router.put('/desativar/:id', async(req, res) => {
    try {
        var ObjectId = mongoose.Types.ObjectId;
        if (!ObjectId.isValid(req.params.id)) {
            return res.status(400).send("Esse id não é válido!")
        }
        var utilizador = await Utilizador.find({ _id: req.params.id })
        if (utilizador.length === 0) {
            return res.status(404).send("Não foi encontrado nenhum utilizador com esse id")
        }
        var utilizadorAlterado = await Utilizador.findOneAndUpdate({ _id: req.params.id }, { isActive: false }, { new: true, useFindAndModify: false })
        res.status(200).send(utilizadorAlterado)
        console.log('Pedido PUT utilizador desativado recebido e feito com sucesso')
    } catch (error) {
        res.status(500).send("Algo correu mal com o pedido")
        console.log('Pedido PUT utilizador desativado falhou! Erros:')
        return console.error(error)
    }
})

router.delete('/eliminar/:id', async(req, res) => {
    try {
        var ObjectId = mongoose.Types.ObjectId;
        if (!ObjectId.isValid(req.params.id)) {
            return res.status(400).send("Esse id não é válido!")
        }
        var utilizador = await Utilizador.find({ _id: req.params.id })
        if (utilizador.length === 0) {
            return res.status(404).send("Não foi encontrado nenhum utilizador com esse id")
        }
        await Utilizador.deleteOne({ _id: req.params.id })
        res.status(200).send("O utilizador foi eliminado com sucesso!")
        console.log('Pedido DELETE utilizador recebido e feito com sucesso')
    } catch (error) {
        res.status(500).send("Algo correu mal com o pedido")
        console.log('Pedido DELETE utilizador falhou! Erros:')
        return console.error(error)
    }
})

module.exports = router