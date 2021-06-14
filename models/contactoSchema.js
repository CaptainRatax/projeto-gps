var mongoose = require('mongoose')
var { universidadeSchema } = require('./universidadeSchema')

const contactoSchema = new mongoose.Schema({
    chave: 'string',
    valor: 'string',
    ordem: 'number',
    universidade: universidadeSchema
}, { timestamps: true })

const Contacto = mongoose.model('Contacto', contactoSchema)

module.exports = {
    Contacto: Contacto,
    contactoSchema: contactoSchema
}