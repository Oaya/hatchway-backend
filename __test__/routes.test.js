import request from 'supertest';
import app from '../server/index';
import express from 'express';

import { requireParams } from '../server/index';


const router = express()
router.use('/', app);

// describe("/api/ping route", () => {
//   //should return 200 status when get  request is success//
//   test('should response with a 200 status code', async () => {
//     const res = await request(router).get('/api/ping');

//     expect(res.statusCode).toBe(200);
//     expect(res.text).toEqual("{\"success\":true}");
//     //specified its JSON//
//     expect(res.headers['content-type']).toContain('application/json');
//   })

// });

describe("/api/posts route", () => {

  // describe('tags params is not passed', () => {
  //   test('should response with a 400 status code', async () => {
  //     const res = await request(router).get('/api/posts/');
  //     expect(res.statusCode).toBe(400);
  //     expect(res.text).toEqual("\"Tags parameter is required\"");
  //     //specified its JSON//
  //     expect(res.headers['content-type']).toContain('application/json');
  //   })
  // });

  // describe('single tag params is passed', () => {
  //   test('should response with a 200 status code', async () => {
  //     const res = await request(router).get('/api/posts/tech');
  //     expect(res.statusCode).toBe(200);
  //     expect(res.headers['content-type']).toContain('application/json');
  //   });

  //   test('should get posts that filter with a tag order by id and asc by default', async () => {
  //     const res = await request(router).get('/api/posts/tech');
  //     const posts = JSON.parse(res.text).posts
  //     expect(posts[0].id).toBeLessThan(posts[1].id)
  //   });

  //   test('should not get posts that tag includes other tags', async () => {
  //     const res = await request(router).get('/api/posts/tech');
  //     const posts = JSON.parse(res.text).posts;
  //     posts.map((post => {
  //       expect(post.tags.includes('tech')).toBeTruthy()
  //     }))
  //   });
  // })

  // describe('single tag params is passed with sortBy and direction', () => {
  //   test('should response with a 200 status code', async () => {
  //     const res = await request(router).get('/api/posts/tech/likes/DESC');
  //     expect(res.statusCode).toBe(200);
  //     expect(res.headers['content-type']).toContain('application/json');
  //   });

  //   test('should order with given sortBy and direction param', async () => {
  //     const res = await request(router).get('/api/posts/tech/likes/DESC');
  //     const posts = JSON.parse(res.text).posts;
  //     expect(posts[1].likes).toBeLessThan(posts[0].likes);
  //     expect(posts[2].likes).toBeLessThan(posts[1].likes);
  //   });

  //   test('should response with a 400 status code when sortBy param is not valid', async () => {
  //     const res = await request(router).get('/api/posts/tech/notvalid');
  //     expect(res.statusCode).toBe(400);
  //     expect(res.headers['content-type']).toContain('application/json');
  //     expect(res.text).toEqual("{\"error\":\"sortBy parameter is invalid\"}");
  //   });

  //   test('should response with a 400 status code when direction param is not valid', async () => {
  //     const res = await request(router).get('/api/posts/tech/id/notvalid');
  //     expect(res.statusCode).toBe(400);
  //     expect(res.headers['content-type']).toContain('application/json');
  //     expect(res.text).toEqual("{\"error\":\"sortBy parameter is invalid\"}");
  //   });

  // });

  describe('multiple tag params is passed with sortBy and direction', () => {
    test('should response with a 200 status code', async () => {
      const res = await request(router).get('/api/posts/tech,history/likes/desc');
      expect(res.statusCode).toBe(200);
      expect(res.headers['content-type']).toContain('application/json');
    });

    test('each post should includes at least one of the tag', async () => {
      const res = await request(router).get('/api/posts/tech,history/likes/desc');
      const posts = JSON.parse(res.text).posts;
      posts.map(post => {
        expect(post.tags.join("").includes('tech') ||
          post.tags.join("").includes('history'))
          .toBeTruthy()
      });
    })

    //   test('should not get posts that tag includes other tags', async () => {
    //     const res = await request(router).get('/api/posts/tech');
    //     const posts = JSON.parse(res.text).posts;
    //     posts.map((post => {
    //       expect(post.tags.includes('tech')).toBeTruthy()
    //     }))
    //   });
    // })



    // test('should response with a 400 status code when sortBy param is not valid', async () => {
    //   const res = await request(router).get('/api/posts/tech/notvalid');
    //   expect(res.statusCode).toBe(400);
    //   expect(res.headers['content-type']).toContain('application/json');
    //   expect(res.text).toEqual("{\"error\":\"sortBy parameter is invalid\"}");
    // });

    // test('should response with a 400 status code when direction param is not valid', async () => {
    //   const res = await request(router).get('/api/posts/tech/id/notvalid');
    //   expect(res.statusCode).toBe(400);
    //   expect(res.headers['content-type']).toContain('application/json');
    //   expect(res.text).toEqual("{\"error\":\"sortBy parameter is invalid\"}");
    // });

  })




})