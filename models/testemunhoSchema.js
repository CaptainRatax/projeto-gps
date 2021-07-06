var mongoose = require('mongoose')
var { universidadeSchema } = require('./universidadeSchema')

const testemunhoSchema = new mongoose.Schema({
    nomePessoa: 'string',
    descricao: 'string',
    data: 'date',
    linkYoutube: 'string',
    universidade: universidadeSchema
}, { timestamps: true })

const Testemunho = mongoose.model('Testemunho', testemunhoSchema)

module.exports = {
    Testemunho: Testemunho,
    testemunhoSchema: testemunhoSchema
}