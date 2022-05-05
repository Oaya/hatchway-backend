import express from 'express';

const router = express.Router();

const pingRoutes = () => {
  router.get('/', (req, res) => {
    res.status(200).send({
      success: true
    })
  });

  return router;
}

export default pingRoutes


