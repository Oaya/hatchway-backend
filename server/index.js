import express from 'express';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import apicache from 'apicache';


//routes requires//
import pingRoutes from './routes/ping';
import postRoutes from './routes/posts';


//env variable//
const PORT = 8080;
const ENVIRONMENT = 'dev';

//middleware//
const app = express();
// const cache = apicache.middleware
app.use(morgan(ENVIRONMENT));
app.use(bodyParser.json());
// app.use(cache('5 minutes'))

//create middleware for when tag is not present//
export const requireParams = (req, res, next) => {
  const reqParamList = Object.keys(req.params);
  if (!reqParamList.includes('tags')) {
    return res.status(400)
      .json("Tags parameter is required")
  }
  next();
};

//routes//
app.use('/api/ping', pingRoutes())
app.use('/api/posts', postRoutes(), requireParams)

app.listen(PORT, () => {
  console.log(`Server is listening PORT ${PORT}`)
});

export default app;