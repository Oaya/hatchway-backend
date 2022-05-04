const axios = require("axios");
const router = require('express').Router();


const postRoutes = () => {
  router.get('/:tag', (req, res) => {
    const tag = req.params.tag;
    axios.get(`http://hatchways.io/api/assessment/blog/posts?tag=${tag}`).then((doc) => {
      res.status(200).send({
        posts: doc.data.posts
      })
    })

  })
  return router
}



module.exports = postRoutes