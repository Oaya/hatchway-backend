const express = require('express')
const morgan = require('morgan')
const bodyParser = require('body-parser')

//env variable//
const PORT = 8080;
const ENVIRONMENT = 'dev';

//middleware//
const app = express();
app.use(morgan(ENVIRONMENT));
app.use(bodyParser.json());

//create middleware for when tag is not present//
const requireParams = (req, res, next) => {
  console.log(req.params)
  const reqParamList = Object.keys(req.params);
  if (!reqParamList.includes('tags')) {
    res.status(400)
      .send("Tags parameter is required")
  }
  next();
};

//routes requires//
const pingRoutes = require('./routes/ping')
const postRoutes = require('./routes/posts')

//routes//
app.use('/api/ping', pingRoutes())
app.use('/api/posts', postRoutes(), requireParams)

app.listen(PORT, () => {
  console.log(`Server is listening PORT ${PORT}`)
})