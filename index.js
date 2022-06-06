const express = require('express')
const app = express()
const port = 4000

const mongoose = require('mongoose')
mongoose.connect("mongodb+srv://dw:dong6938!@mydb.aqh7i8j.mongodb.net/?retryWrites=true&w=majority")
.then((res) => console.log("ok!"))
    .catch((error) => console.log(error))

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})