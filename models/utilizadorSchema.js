var mongoose = require('mongoose')

const utilizadorSchema = new mongoose.Schema({
    nome: 'string',
    email: 'string',
    password: 'string',
    isActive: 'boolean'
}, { timestamps: true })

const Utilizador = mongoose.model('Utilizador', utilizadorSchema)

module.exports = {
    Utilizador: Utilizador,
    utilizadorSchema: utilizadorSchema
}