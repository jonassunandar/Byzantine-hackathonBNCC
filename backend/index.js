const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const port = 3000

app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)

// Register all routing here
require('./modules/user')(app)

app.get('/ping', (request, response) => {
  response.json({ message: 'pong' })
})

app.listen(port, () => {
  console.log(`App running on port ${port}.`)
})
