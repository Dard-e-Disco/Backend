const express = require('express')
const mongoose = require('mongoose');
const startdb = require('./db')
var cors = require('cors')
const app = express()
const port = 5000
//cors permission
app.use(cors())
//starting database
startdb()
//json 
app.use(express.json())
//routes
app.use('/api/auth',require('./routes/auth'))
app.use('/api/event',require('./routes/Events'))

app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})