var mongoose = require('mongoose')

const postSchema = new mongoose.Schema({
    titulo: 'string',
    textoPreview: 'string',
    imagemPreview: 'string',
    textoPost: 'string'
}, { timestamps: true })

const Post = mongoose.model('Post', postSchema)

module.exports = {
    Post: Post,
    postSchema: postSchema
}