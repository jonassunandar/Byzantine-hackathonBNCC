const express = require('express')
const bodyParser = require('body-parser')
const app = express()
var cors = require('cors')
const port = 3000

global.JWT_SECRET = "hahaxsuperxsecret"

cors({credentials: true, origin: true});
app.use(cors())

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

app.listen(port, '0.0.0.0', () => {
  console.log(`App running on port ${port}.`)
})
