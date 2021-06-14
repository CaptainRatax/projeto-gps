var mongoose = require('mongoose')

const faqSchema = new mongoose.Schema({
    pergunta: 'string',
    resposta: 'string',
    ordem: 'number'
}, { timestamps: true })

const Faq = mongoose.model('Faq', faqSchema)

module.exports = {
    Faq: Faq,
    faqSchema: faqSchema
}