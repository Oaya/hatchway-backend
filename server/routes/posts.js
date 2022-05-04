const axios = require("axios");
const router = require('express').Router();


const postRoutes = () => {
  router.get('/:tags/:sortBy?/:direction?', (req, res) => {
    const { tags, sortBy, direction } = req.params;
    const sortByArr = ['id', 'reads', 'likes', 'popularity'];

    //when tag is one string//
    axios.get(`http://hatchways.io/api/assessment/blog/posts?tag=${tags}&sortBy=${sortBy}&direction=${direction}`).then((doc) => {

      let post = doc.data.posts;

      if (sortBy && sortByArr.includes(sortBy)) {
        if (direction && direction.toLowerCase() === "desc") {
          post = post.sort((a, b) => (b[sortBy] > a[sortBy] ? 1 : -1));
        } else {
          post = post.sort((a, b) => (b[sortBy] < a[sortBy] ? 1 : -1));
        }
      }
      res.status(200).send({
        posts: post
      })

    })

  })
  return router;
}



module.exports = postRoutes