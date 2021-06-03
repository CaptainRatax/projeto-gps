var express = require('express')
var router = express.Router()

var candidaturas = require('./apiRoutes/candidaturas')

router.use('/candidaturas', candidaturas)

//Request Dummy que vai ser chamado de tanto em tanto tempo para não deixar o heroku e o mongodb entrarem em repouso
router.get('/dummy', async(req, res) => {
    const dummySchemma = new mongoose.Schema({
        dummy: 'string',
        dummy2: 'string'
    })
    const Dummy = mongoose.model('Dummy', dummySchemma)
    try {
        var dummy = new Dummy({ "dummy": "dummy", "dummy2": "dummy2" })
        var dummyGuardado = await dummy.save()
        await Dummy.deleteOne({ _id: dummyGuardado._id })
        res.status(200).send("Dummy called!")
    } catch (error) {
        res.status(500).send("Erro ao tentar chamar o dummy. Erro:" + error)
    }

})

module.exports = router