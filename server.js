var express = require('express')
var app = express()
 
app.get('/', function (req, res) {
  res.send('Servidor express funcionando')
})
 
app.listen(8080)