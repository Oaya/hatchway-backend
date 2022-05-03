const router = require('express').Router();


const pingRoutes = () => {
  router.get('/', (req, res) => {
    res.status(200).send({
      success: "true"
    })
  })
}



module.exports = pingRoutes