var mongoose = require('mongoose')

const candidaturaSchema = new mongoose.Schema({
    nome: 'string',
    email: 'string',
    telemovel: 'string',
    escola: 'string',
    descricao: 'string',
    imagem: 'string'
}, { timestamps: true })

const Candidatura = mongoose.model('Candidatura', candidaturaSchema)

module.exports = Candidatura