import axios from "axios";
import express from 'express';
import NodeCache from "node-cache";

const myCache = new NodeCache();
const router = express.Router();



const postRoutes = () => {
  router.get('/:tags/:sortBy?/:direction?', (req, res) => {
    const { tags, sortBy, direction } = req.params;
    const acceptableSort = ['id', 'reads', 'likes', 'popularity'];
    const acceptableDirection = ['desc', 'asc'];

    const url = req.originalUrl;

    //error response when sortBy and direction are invalid//
    if ((sortBy && !acceptableSort.includes(sortBy)) ||
      (direction && !acceptableDirection.includes(direction.toLowerCase()))) {
      return res.status(400).json({
        error: "sortBy parameter is invalid"
      });
    };

    //fetch the post for every tag and create URL//
    const tagsArray = tags.split(',');
    const allTagsURLs = [];
    tagsArray.map(tag => {
      let url = axios.get(`http://hatchways.io/api/assessment/blog/posts?tag=${tag}&sortBy=${sortBy}&direction=${direction}`)
      allTagsURLs.push(url)
    });

    // //check if cache has key, retrieve value from cache//
    if (myCache.has(url)) {
      console.log("exists");
      const posts = myCache.get(url)
      return res.status(200).json({
        posts: posts
      });
    } else {


      //make the separate request for every tag specified//
      axios
        .all([...allTagsURLs])
        .then(axios.spread((...doc) => {
          let posts = [];
          doc.map(response => {
            posts.push(...response.data.posts);
          })

          //filter posts by id//
          let postsArrUnique = [...new Map(posts.map(post => [post.id, post])).values()];

          //sort array by direction//
          if (direction && direction.toLowerCase() === "desc") {
            postsArrUnique = postsArrUnique.sort((a, b) => parseFloat(b[sortBy]) - parseFloat(a[sortBy]))
          } else {
            postsArrUnique = postsArrUnique.sort((a, b) => parseFloat(a[sortBy]) - parseFloat(b[sortBy]))
          }





          myCache.set(url, postsArrUnique);
          console.log("value is not present in cache so create cache")
          return res.status(200).json({
            posts: postsArrUnique
          });
        }))

        .catch((err) => {
          console.log(err)
        });
    }
  });

  return router;
}

export default postRoutes