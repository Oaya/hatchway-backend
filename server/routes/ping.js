const router = require('express').Router();


const pingRoutes = () => {
  router.get('/', (req, res) => {
    res.status(200).send({
      success: true
    })
  });

  return router;
}



module.exports = pingRoutes;