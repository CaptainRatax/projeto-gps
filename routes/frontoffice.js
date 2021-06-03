var express = require('express')
const path = require("path");
var router = express.Router()

var dirname = __dirname.substring(0, __dirname.indexOf('routes', 0))

router.get('/candidaturas', function(req, res) {
    res.sendFile(path.join(dirname + "/public/candidatura.html"))
});

router.get('/blog', function(req, res) {
    res.sendFile(path.join(dirname + "/public/blog.html"))
});

router.get('/contactos', function(req, res) {
    res.sendFile(path.join(dirname + "/public/contactos.html"))
});

module.exports = router