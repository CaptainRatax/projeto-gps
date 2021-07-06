var mongoose = require('mongoose')

const loginSchema = new mongoose.Schema({
    email: 'string',
    password: 'string'
}, { timestamps: true })

const Login = mongoose.model('Login', loginSchema)

module.exports = {
    Login: Login,
    loginSchema: loginSchema
}