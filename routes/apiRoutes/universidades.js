var express = require('express')
var router = express.Router()
var mongoose = require('mongoose')
const { Universidade } = require('../../models/universidadeSchema')

router.get('/', async(req, res) => {
    try {
        var universidades = await Universidade.find({})
        res.status(200).send(universidades)
        console.log('Pedido GET de todas as universidades recebido e feito com sucesso')
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
        console.log('Pedido GET de todas as universidades com as candidaturas abertas recebido e feito com sucesso')
    } catch (error) {
        res.status(500).send("Algo correu mal com o pedido")
        console.log('Pedido GET de todas as universidades com as candidaturas abertas falhou! Erros:')
        return console.error(error)
    }
})

router.get('/candidaturasFechadas', async(req, res) => {
    try {
        var universidades = await Universidade.find({ candidaturasAbertas: false })
        res.status(200).send(universidades)
        console.log('Pedido GET de todas as universidades com as candidaturas fechadas recebido e feito com sucesso')
    } catch (error) {
        res.status(500).send("Algo correu mal com o pedido")
        console.log('Pedido GET de todas as universidades com as candidaturas fechadas falhou! Erros:')
        return console.error(error)
    }
})

router.get('/id/:id', async(req, res) => {
    try {
        var ObjectId = mongoose.Types.ObjectId;
        if (!ObjectId.isValid(req.params.id)) {
            return res.status(400).send("Esse id não é válido!")
        }
        var universidade = await Universidade.find({ _id: req.params.id })
        if (universidade.length === 0) {
            return res.status(404).send("Não foi encontrada nenhuma universidade com esse id")
        }
        res.status(200).send(universidade[0])
        console.log('Pedido GET de universidade por ID recebido e feito com sucesso')
    } catch (error) {
        res.status(500).send("Algo correu mal com o pedido")
        console.log('Pedido GET de universidade por ID falhou! Erros:')
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
        console.log('Pedido GET de universidade por sigla recebido e feito com sucesso')
    } catch (error) {
        res.status(500).send("Algo correu mal com o pedido")
        console.log('Pedido GET de universidade por sigla falhou! Erros:')
        return console.error(error)
    }
})

router.patch('/alterar', async(req, res) => {
    try {
        var universidade = new Universidade(req.body)
        var ObjectId = mongoose.Types.ObjectId;
        if (!ObjectId.isValid(req.body._id)) {
            return res.status(400).send("Esse id não é válido!")
        }
        var verifyUniversidade = await Universidade.find({ _id: req.body._id })
        if (verifyUniversidade.length === 0) {
            return res.status(404).send("Não foi encontrada nenhuma universidade com esse id")
        }
        var universidadeGuardada = await Universidade.findOneAndUpdate({ _id: req.body._id }, universidade, { new: true, useFindAndModify: false })
        res.status(200).send(universidadeGuardada)
        console.log('Pedido Patch de alterar uma universidade recebido e feito com sucesso')
    } catch (error) {
        res.status(500).send("Algo correu mal com o pedido")
        console.log('Pedido GET de alterar uma universidade falhou! Erros:')
        return console.error(error)
    }
})

router.delete('/eliminar/:id', async(req, res) => {
    try {
        var ObjectId = mongoose.Types.ObjectId;
        if (!ObjectId.isValid(req.params.id)) {
            return res.status(400).send("Esse id não é válido!")
        }
        var universidade = await Universidade.find({ _id: req.params.id })
        if (universidade.length === 0) {
            return res.status(404).send("Não foi encontrada nenhuma universidade com esse id")
        }
        await Universidade.deleteOne({ _id: req.params.id })
        res.status(200).send("A universidade foi eliminada com sucesso!")
        console.log('Pedido DELETE universidade recebido e feito com sucesso')
    } catch (error) {
        res.status(500).send("Algo correu mal com o pedido")
        console.log('Pedido DELETE universidade falhou! Erros:')
        return console.error(error)
    }
})

module.exports = router