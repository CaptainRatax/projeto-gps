var mongoose = require('mongoose')
var { universidadeSchema } = require('./universidadeSchema')

const candidaturaSchema = new mongoose.Schema({
    nome: 'string',
    email: 'string',
    telemovel: 'string',
    escola: 'string',
    descricao: 'string',
    imagem: 'string',
    aprovacao: 'boolean',
    universidade: universidadeSchema
}, { timestamps: true })

const Candidatura = mongoose.model('Candidatura', candidaturaSchema)

module.exports = {
    Candidatura: Candidatura,
    candidaturaSchema: candidaturaSchema
}