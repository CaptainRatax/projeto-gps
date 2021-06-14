var mongoose = require('mongoose')

const dadosSiteSchema = new mongoose.Schema({
    chave: 'string',
    valor: 'string'
}, { timestamps: true })

const DadosSite = mongoose.model('DadosSite', dadosSiteSchema)

module.exports = {
    DadosSite: DadosSite,
    dadosSiteSchema: dadosSiteSchema
}