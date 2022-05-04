const axios = require("axios");
const router = require('express').Router();

const postRoutes = () => {
  router.get('/:tags/:sortBy?/:direction?', (req, res) => {
    const { tags, sortBy, direction } = req.params;
    const acceptableSort = ['id', 'reads', 'likes', 'popularity', undefined];
    const acceptableDirection = ['desc', 'asc', undefined];

    //error response when sortBy and direction are invalid//
    if ((sortBy && !acceptableSort.includes(sortBy)) ||
      (direction && !acceptableDirection.includes(direction))) {
      res.status(400).send({
        error: "sortBy parameter is invalid"
      });
    };

    //when tag is more than one string //
    if (tags.includes(',')) {
      //fetch the post for every tag and create URL//
      const tagsArray = tags.split(',');
      const allTagsURLs = []
      tagsArray.map(tag => {
        let url = axios.get(`http://hatchways.io/api/assessment/blog/posts?tag=${tag}&sortBy=${sortBy}&direction=${direction}`)
        allTagsURLs.push(url)
      });
      // tagsArray.map(tag => {
      //   allTagURLs.push(`http://hatchways.io/api/assessment/blog/posts?tag=${tag}&sortBy=${sortBy}&direction=${direction}`);

      // })


      // axios.all(allTagURLs.map((endpoint) => axios.get(endpoint))).then(
      //   (data) => console.log(data),
      // );
      //make the separate request for every tag specified//
      axios
        .all([...allTagsURLs])
        .then(axios.spread((...resp) => {
          let posts;
          resp.map(response => {
            console.log(response.data.posts)
            posts = response.data.posts;

          })
          res.status(200).send({
            posts: posts
          });
        }))




    } else {
      //when tag is one string//
      axios
        .get(`http://hatchways.io/api/assessment/blog/posts?tag=${tags}&sortBy=${sortBy}&direction=${direction}`)
        .then((doc) => {
          let posts = doc.data.posts;

          if (direction && direction.toLowerCase() === "desc") {
            posts = posts.sort((a, b) => parseFloat(b[sortBy]) - parseFloat(a[sortBy]))
          } else {
            posts = posts.sort((a, b) => parseFloat(a[sortBy]) - parseFloat(b[sortBy]))
          }
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