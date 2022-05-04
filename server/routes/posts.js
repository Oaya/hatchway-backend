const axios = require("axios");
const router = require('express').Router();


const postRoutes = () => {
  router.get('/:tags/:sortBy?/:direction?', (req, res) => {
    const { tags, sortBy, direction } = req.params;
    const acceptableSort = ['id', 'reads', 'likes', 'popularity'];
    const acceptableDirection = ['desc', 'asc'];

    //error response when sortBy and direction are invalid//
    if ((sortBy && !acceptableSort.includes(sortBy)) ||
      (direction && !acceptableDirection.includes(direction))) {
      res.status(400).send({
        error: "sortBy parameter is invalid"
      })
    }

    //when tag is more than one string //


    console.log(tags.includes(','))

    //when tag is one string//
    axios.get(`http://hatchways.io/api/assessment/blog/posts?tag=${tags}&sortBy=${sortBy}&direction=${direction}`).then((doc) => {

      let posts = doc.data.posts;

      if (direction && direction.toLowerCase() === "desc") {
        // post = post.sort((a, b) => (a[sortBy] < b[sortBy] ? 1 : -1));
        posts = posts.sort((a, b) => parseFloat(b[sortBy]) - parseFloat(a[sortBy]))
      } else {
        // post = post.sort((a, b) => (a[sortBy] > b[sortBy] ? 1 : -1));
        posts = posts.sort((a, b) => parseFloat(a[sortBy]) - parseFloat(b[sortBy]))
      }

      res.status(200).send({
        posts: posts
      })

    })

  })
  return router;
}



module.exports = postRoutes