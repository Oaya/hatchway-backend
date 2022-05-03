
const express = require('express')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const { step1 } = require('./routes/ping')


//env varivable//
const PORT = 8080;
const ENVIRONMENT = 'dev';

//middlewares//
const app = express();
app.use(morgan(ENVIRONMENT));
app.use(bodyParser.json());

//routes requires//
const pingRoutes = require('./routes/ping')

//routes//
app.use('/api/ping', pingRoutes())




app.listen(PORT, () => {
  console.log(`Server is listening PORT ${PORT}`)
})