const express = require('express')
const morgan = require('morgan')
const bodyParser = require('body-parser')


//env varivable//
const PORT = 8080;
const ENVIRONMENT = 'dev';

//middlewares//
const app = express();
app.use(morgan(ENVIRONMENT));
app.use(bodyParser.json());

//api routes//



app.listen(PORT, () => {
  console.log(`Server is listening PORT ${PORT}`)
})