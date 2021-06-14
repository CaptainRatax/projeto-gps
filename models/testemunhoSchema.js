var mongoose = require('mongoose')

const testemunhoSchema = new mongoose.Schema({
    nomePessoa: 'string',
    descricao: 'string',
    data: 'date'
}, { timestamps: true })

const Testemunho = mongoose.model('Testemunho', testemunhoSchema)

module.exports = {
    Testemunho: Testemunho,
    testemunhoSchema: testemunhoSchema
}