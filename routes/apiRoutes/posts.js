var express = require('express')
var router = express.Router()
var mongoose = require('mongoose')
const { Post } = require('../../models/postSchema')

router.get('/', async(req, res) => {
    try {
        var posts = await Post.find({})
        res.status(200).send(posts)
        console.log('Pedido GET de todos os posts recebido e feito com sucesso')
    } catch (error) {
        res.status(500).send("Algo correu mal com o pedido")
        console.log('Pedido GET de todos os posts falhou! Erros:')
        return console.error(error)
    }
})

router.post('/novo', async(req, res) => {
    try {
        var post = new Post(req.body)
        var postGuardado = await post.save()
        res.status(200).send(postGuardado)
        console.log('Pedido POST de novo post recebido e feito com sucesso')
    } catch (error) {
        res.status(500).send("Algo correu mal com o pedido")
        console.log('Pedido POST de novo post falhou! Erros:')
        return console.error(error)
    }
})

router.get('/id/:id', async(req, res) => {
    try {
        var ObjectId = mongoose.Types.ObjectId;
        if (!ObjectId.isValid(req.params.id)) {
            return res.status(400).send("Esse id não é válido!")
        }
        var post = await Post.find({ _id: req.params.id })
        if (post.length === 0) {
            return res.status(404).send("Não foi encontrado nenhum post com esse id")
        }
        res.status(200).send(post[0])
        console.log('Pedido GET de post por ID recebido e feito com sucesso')
    } catch (error) {
        res.status(500).send("Algo correu mal com o pedido")
        console.log('Pedido GET de post por ID falhou! Erros:')
        return console.error(error)
    }
})

router.patch('/alterar', async(req, res) => {
    try {
        var post = new Post(req.body)
        var ObjectId = mongoose.Types.ObjectId;
        if (!ObjectId.isValid(req.body._id)) {
            return res.status(400).send("Esse id não é válido!")
        }
        var verifyPost = await Post.find({ _id: req.body._id })
        if (verifyPost.length === 0) {
            return res.status(404).send("Não foi encontrado nenhum post com esse id")
        }
        var postGuardado = await Post.findOneAndUpdate({ _id: req.body._id }, post, { new: true, useFindAndModify: false })
        res.status(200).send(postGuardado)
        console.log('Pedido Patch de alterar um post recebido e feito com sucesso')
    } catch (error) {
        res.status(500).send("Algo correu mal com o pedido")
        console.log('Pedido GET de alterar um post falhou! Erros:')
        return console.error(error)
    }
})

router.delete('/eliminar/:id', async(req, res) => {
    try {
        var ObjectId = mongoose.Types.ObjectId;
        if (!ObjectId.isValid(req.params.id)) {
            return res.status(400).send("Esse id não é válido!")
        }
        var post = await Post.find({ _id: req.params.id })
        if (post.length === 0) {
            return res.status(404).send("Não foi encontrado nenhum post com esse id")
        }
        await Post.deleteOne({ _id: req.params.id })
        res.status(200).send("O post foi eliminado com sucesso!")
        console.log('Pedido DELETE post recebido e feito com sucesso')
    } catch (error) {
        res.status(500).send("Algo correu mal com o pedido")
        console.log('Pedido DELETE post falhou! Erros:')
        return console.error(error)
    }
})

module.exports = router