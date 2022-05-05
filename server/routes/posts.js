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
      });
    };

    //sort array by direction//
    const sortArray = (postsArray) => {
      if (direction && direction.toLowerCase() === "desc") {
        postsArray = postsArray.sort((a, b) => parseFloat(b[sortBy]) - parseFloat(a[sortBy]))
      } else {
        postsArray = postsArray.sort((a, b) => parseFloat(a[sortBy]) - parseFloat(b[sortBy]))
      }
      return postsArray;
    }

    //when tag is more than one string //
    if (tags.includes(',')) {
      //fetch the post for every tag and create URL//
      const tagsArray = tags.split(',');
      const allTagsURLs = []
      tagsArray.map(tag => {
        let url = axios.get(`http://hatchways.io/api/assessment/blog/posts?tag=${tag}&sortBy=${sortBy}&direction=${direction}`)
        allTagsURLs.push(url)
      });

      //make the separate request for every tag specified//
      axios
        .all([...allTagsURLs])
        .then(axios.spread((...doc) => {
          let posts = [];
          doc.map(response => {
            posts.push(...response.data.posts);
          })
          //filter posts by id//
          let postsArrUnique = [...new Map(posts.map(post => [post.id, post])).values()]

          postsArrUnique = sortArray(postsArrUnique);

          res.status(200).send({
            posts: postsArrUnique
          });
        }))
        .catch((err) => {
          //error response when tags is not present//
          res.status(400).send({
            error: "Tags parameter is required"
          });
        });

    } else {
      //when tag is one string//
      axios
        .get(`http://hatchways.io/api/assessment/blog/posts?tag=${tags}&sortBy=${sortBy}&direction=${direction}`)
        .then((doc) => {
          let posts = doc.data.posts;
          posts = sortArray(posts)

          res.status(200).send({
            posts: posts
          });

        })
        .catch((err) => {
          //error response when tags is not present//
          res.status(400).send({
            error: "Tags parameter is required"
          });
        });
    }
  });
  return router;
}

module.exports = postRoutes