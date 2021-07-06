var express = require('express')
var router = express.Router()
var mongoose = require('mongoose')
const { Contacto } = require('../../models/contactoSchema')
const { Universidade } = require('../../models/universidadeSchema')

router.post('/novo', async(req, res) => {
    try {
        var contacto = new Contacto(req.body)
        var ObjectId = mongoose.Types.ObjectId;
        if (!ObjectId.isValid(req.body.universidade._id)) {
            return res.status(400).send("Esse id não é válido!")
        }
        var verifyUniversidade = await Universidade.find({ _id: req.body.universidade._id })
        if (verifyUniversidade.length === 0) {
            return res.status(404).send("Não foi encontrada nenhuma universidade com esse id")
        }
        var contactoGuardado = await contacto.save()
        res.status(200).send(contactoGuardado)
        console.log('Pedido POST de novo contacto recebido e feito com sucesso')
    } catch (error) {
        res.status(500).send("Algo correu mal com o pedido")
        console.log('Pedido POST de novo contacto falhou! Erros:')
        return console.error(error)
    }
})

router.get('/', async(req, res) => {
    try {
        var contactos = await Contacto.aggregate([
            { $unwind: "$ordem" },
            { $sort: { "ordem": 1, "sigla": 1 } },
            { $group: { _id: "$universidade.sigla", contactos: { $push: { _id: "$_id", chave: "$chave", valor: "$valor", ordem: "$ordem", universidade: "$universidade" } } } }
        ])
        res.status(200).send(contactos)
        console.log('Pedido GET de todos os contactos recebido e feito com sucesso')
    } catch (error) {
        res.status(500).send("Algo correu mal com o pedido")
        console.log('Pedido GET de todos os contactos falhou! Erros:')
        return console.error(error)
    }
})

router.get('/universidadeid/:id', async(req, res) => {
    try {
        var ObjectId = mongoose.Types.ObjectId;
        if (!ObjectId.isValid(req.params.id)) {
            return res.status(400).send("Esse id não é válido!")
        }
        var verifyUniversidade = await Universidade.find({ _id: req.params.id })
        if (verifyUniversidade.length === 0) {
            return res.status(404).send("Não foi encontrada nenhuma universidade com esse id")
        }
        var contactos = await Contacto.find({ "universidade._id": req.params.id }).sort({ ordem: 1 })
        res.status(200).send(contactos)
        console.log('Pedido GET de contactos por universidade ID recebido e feito com sucesso')
    } catch (error) {
        res.status(500).send("Algo correu mal com o pedido")
        console.log('Pedido GET de contactos por universidade ID falhou! Erros:')
        return console.error(error)
    }
})

router.get('/coordenadas/universidadeid/:id', async(req, res) => {
    try {
        var ObjectId = mongoose.Types.ObjectId;
        if (!ObjectId.isValid(req.params.id)) {
            return res.status(400).send("Esse id não é válido!")
        }
        var verifyUniversidade = await Universidade.find({ _id: req.params.id })
        if (verifyUniversidade.length === 0) {
            return res.status(404).send("Não foi encontrada nenhuma universidade com esse id")
        }
        var contactos = await Contacto.find({ "universidade._id": req.params.id, "chave": "Coordenadas" })
        res.status(200).send(contactos[0])
        console.log('Pedido GET de coordenadas por universidade ID recebido e feito com sucesso')
    } catch (error) {
        res.status(500).send("Algo correu mal com o pedido")
        console.log('Pedido GET de coordenadas por universidade ID falhou! Erros:')
        return console.error(error)
    }
})

router.get('/coordenadas/universidadesigla/:sigla', async(req, res) => {
    try {
        var universidade = await Universidade.find({ sigla: req.params.sigla })
        if (universidade.length === 0) {
            return res.status(404).send("Não foi encontrada nenhuma universidade com essa sigla")
        }
        var contactos = await Contacto.find({ "universidade.sigla": req.params.sigla, "chave": "Coordenadas" })
        res.status(200).send(contactos[0])
        console.log('Pedido GET de coordenadas por sigla universidade recebido e feito com sucesso')
    } catch (error) {
        res.status(500).send("Algo correu mal com o pedido")
        console.log('Pedido GET de coordenadas por sigla universidade falhou! Erros:')
        return console.error(error)
    }
})

router.get('/morada/universidadeid/:id', async(req, res) => {
    try {
        var ObjectId = mongoose.Types.ObjectId;
        if (!ObjectId.isValid(req.params.id)) {
            return res.status(400).send("Esse id não é válido!")
        }
        var verifyUniversidade = await Universidade.find({ _id: req.params.id })
        if (verifyUniversidade.length === 0) {
            return res.status(404).send("Não foi encontrada nenhuma universidade com esse id")
        }
        var contactos = await Contacto.find({ "universidade._id": req.params.id, "chave": "Morada" })
        res.status(200).send(contactos[0])
        console.log('Pedido GET de morada por universidade ID recebido e feito com sucesso')
    } catch (error) {
        res.status(500).send("Algo correu mal com o pedido")
        console.log('Pedido GET de morada por universidade ID falhou! Erros:')
        return console.error(error)
    }
})

router.get('/morada/universidadesigla/:sigla', async(req, res) => {
    try {
        var universidade = await Universidade.find({ sigla: req.params.sigla })
        if (universidade.length === 0) {
            return res.status(404).send("Não foi encontrada nenhuma universidade com essa sigla")
        }
        var contactos = await Contacto.find({ "universidade.sigla": req.params.sigla, "chave": "Morada" })
        res.status(200).send(contactos[0])
        console.log('Pedido GET de morada por sigla universidade recebido e feito com sucesso')
    } catch (error) {
        res.status(500).send("Algo correu mal com o pedido")
        console.log('Pedido GET de morada por sigla universidade falhou! Erros:')
        return console.error(error)
    }
})

router.get('/universidadesigla/:sigla', async(req, res) => {
    try {
        var universidade = await Universidade.find({ sigla: req.params.sigla })
        if (universidade.length === 0) {
            return res.status(404).send("Não foi encontrada nenhuma universidade com essa sigla")
        }
        var contactos = await Contacto.find({ "universidade.sigla": req.params.sigla }).sort({ ordem: 1 })
        res.status(200).send(contactos)
        console.log('Pedido GET de contactos por sigla da universidade recebido e feito com sucesso')
    } catch (error) {
        res.status(500).send("Algo correu mal com o pedido")
        console.log('Pedido GET de contactos por sigla da universidade falhou! Erros:')
        return console.error(error)
    }
})

router.get('/id/:id', async(req, res) => {
    try {
        var ObjectId = mongoose.Types.ObjectId;
        if (!ObjectId.isValid(req.params.id)) {
            return res.status(400).send("Esse id não é válido!")
        }
        var contacto = await Contacto.find({ _id: req.params.id })
        if (contacto.length === 0) {
            return res.status(404).send("Não foi encontrado nenhum contacto com esse id")
        }
        res.status(200).send(contacto[0])
        console.log('Pedido GET de contacto por ID recebido e feito com sucesso')
    } catch (error) {
        res.status(500).send("Algo correu mal com o pedido")
        console.log('Pedido GET de contacto por ID falhou! Erros:')
        return console.error(error)
    }
})

router.get('/chavevalor', async(req, res) => {
    try {
        if (!req.query.chave) {
            return res.status(400).send("Tem que especificar uma chave nos query parameters")
        }
        if (!req.query.valor) {
            return res.status(400).send("Tem que especificar um valor nos query parameters")
        }
        const chave = req.query.chave;
        const valor = req.query.valor;

        var contacto = await Contacto.find({ "chave": chave, "valor": valor })
        if (contacto.length === 0) {
            return res.status(404).send("Não foi encontrado nenhum contacto com esses chave/valor")
        }
        res.status(200).send(contacto[0])
        console.log('Pedido GET de contacto por chave/valor recebido e feito com sucesso')
    } catch (error) {
        res.status(500).send("Algo correu mal com o pedido")
        console.log('Pedido GET de contacto por chave/valor falhou! Erros:')
        return console.error(error)
    }
})

router.patch('/alterar', async(req, res) => {
    try {
        var contacto = new Contacto(req.body)
        var ObjectId = mongoose.Types.ObjectId;
        if (!ObjectId.isValid(req.body._id)) {
            return res.status(400).send("Esse id não é válido!")
        }
        var verifyContacto = await Contacto.find({ _id: req.body._id })
        if (verifyContacto.length === 0) {
            return res.status(404).send("Não foi encontrado nenhum contacto com esse id")
        }
        var contactoGuardado = await Contacto.findOneAndUpdate({ _id: req.body._id }, contacto, { new: true, useFindAndModify: false })
        res.status(200).send(contactoGuardado)
        console.log('Pedido PATCH de alterar um contacto recebido e feito com sucesso')
    } catch (error) {
        res.status(500).send("Algo correu mal com o pedido")
        console.log('Pedido PATCH de alterar um contacto falhou! Erros:')
        return console.error(error)
    }
})

router.delete('/eliminar/:id', async(req, res) => {
    try {
        var ObjectId = mongoose.Types.ObjectId;
        if (!ObjectId.isValid(req.params.id)) {
            return res.status(400).send("Esse id não é válido!")
        }
        var contacto = await Contacto.find({ _id: req.params.id })
        if (contacto.length === 0) {
            return res.status(404).send("Não foi encontrada nenhum contacto com esse id")
        }
        await Contacto.deleteOne({ _id: req.params.id })
        res.status(200).send("O contacto foi eliminado com sucesso!")
        console.log('Pedido DELETE contacto recebido e feito com sucesso')
    } catch (error) {
        res.status(500).send("Algo correu mal com o pedido")
        console.log('Pedido DELETE contacto falhou! Erros:')
        return console.error(error)
    }
})

module.exports = router;