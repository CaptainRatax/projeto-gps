var mongoose = require('mongoose')

const universidadeSchema = new mongoose.Schema({
    sigla: 'string',
    nome: 'string',
    candidaturasAbertas: 'boolean'
}, { timestamps: true })

const Universidade = mongoose.model('Universidade', universidadeSchema)

module.exports = Universidade