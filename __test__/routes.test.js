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

  describe('tags params is not passed', () => {
    test('should response with a 400 status code', async () => {
      const res = await request(router).get('/api/posts/');
      expect(res.statusCode).toBe(400);
      expect(res.text).toEqual("\"Tags parameter is required\"");
      //specified its JSON//
      expect(res.headers['content-type']).toContain('application/json');
    })
  });

  describe('single tag params is passed', () => {
    test('should response with a 200 status code', async () => {
      const res = await request(router).get('/api/posts/tech');
      expect(res.statusCode).toBe(200);
      expect(res.headers['content-type']).toContain('application/json');
    });

    test('should get posts that filter with a tag order by id and asc by default', async () => {
      const res = await request(router).get('/api/posts/tech');
      const posts = JSON.parse(res.text).posts
      expect(posts[0].id).toBeLessThan(posts[1].id)
    });

    test('should not get posts that tag includes other tags', async () => {
      const res = await request(router).get('/api/posts/tech');
      const posts = JSON.parse(res.text).posts;
      posts.map((post => {
        expect(post.tags.includes('tech')).toBeTruthy()
      }))
    });
  })




})