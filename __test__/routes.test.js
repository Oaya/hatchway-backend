import request from 'supertest';
import app from '../server/index';
import express from 'express';

const router = express();
router.use('/', app);

describe("/api/ping route", () => {

  test('should response with a 200 status code', async () => {
    const res = await request(router).get('/api/ping');

    expect(res.statusCode).toBe(200);
    expect(res.text).toEqual("{\"success\":true}");

    expect(res.headers['content-type']).toContain('application/json');
  })

});

describe("/api/posts route", () => {

  describe('tags params is not passed', () => {
    test('should response with a 400 status code', async () => {
      const res = await request(router).get('/api/posts/');
      expect(res.statusCode).toBe(400);
      expect(res.text).toEqual("\"Tags parameter is required\"");

      expect(res.headers['content-type']).toContain('application/json');
    })
  });

  test('should get posts that filter with a tag order by id and asc by default', async () => {
    const res = await request(router).get('/api/posts/tech');
    expect(res.statusCode).toBe(200);
    expect(res.headers['content-type']).toContain('application/json');

    const posts = JSON.parse(res.text).posts
    expect(posts[0].id).toBeLessThanOrEqual(posts[1].id)
  });

  test('should not get posts that tag includes other tags', async () => {
    const res = await request(router).get('/api/posts/tech');
    expect(res.statusCode).toBe(200);
    expect(res.headers['content-type']).toContain('application/json');

    const posts = JSON.parse(res.text).posts;
    posts.map((post => {
      expect(post.tags.includes('tech')).toBeTruthy()
    }))
  });

  describe('single tag params is passed with sortBy and direction', () => {

    test('should order with given sortBy and direction param', async () => {
      const res = await request(router).get('/api/posts/tech/likes/DESC');
      expect(res.statusCode).toBe(200);
      expect(res.headers['content-type']).toContain('application/json');

      const posts = JSON.parse(res.text).posts;
      expect(posts[1].likes).toBeLessThanOrEqual(posts[0].likes);
      expect(posts[2].likes).toBeLessThanOrEqual(posts[1].likes);
    });

    test('should response with a 400 status code when sortBy param is not valid', async () => {
      const res = await request(router).get('/api/posts/tech/notvalid');
      expect(res.statusCode).toBe(400);
      expect(res.headers['content-type']).toContain('application/json');
      expect(res.text).toEqual("{\"error\":\"sortBy parameter is invalid\"}");
    });

    test('should response with a 400 status code when direction param is not valid', async () => {
      const res = await request(router).get('/api/posts/tech/id/notvalid');
      expect(res.statusCode).toBe(400);
      expect(res.headers['content-type']).toContain('application/json');
      expect(res.text).toEqual("{\"error\":\"sortBy parameter is invalid\"}");
    });

  });

  describe('multiple tag params is passed with sortBy and direction', () => {

    test('each post should includes at least one of the tag', async () => {
      const res = await request(router).get('/api/posts/tech,history');
      expect(res.statusCode).toBe(200);
      expect(res.headers['content-type']).toContain('application/json');

      const posts = JSON.parse(res.text).posts;
      posts.map(post => {
        expect(post.tags.join("").includes('tech') ||
          post.tags.join("").includes('history'))
          .toBeTruthy()
      });
    });

    test('should post be unique', async () => {
      const res = await request(router).get('/api/posts/tech,history/reads/desc');
      const posts = JSON.parse(res.text).posts;
      const id = posts.map(post => post.id)
      expect(new Set(id).size !== id.length).toBeFalsy()
    });

    test('should order by givin sortBy with default asc order', async () => {
      const res = await request(router).get('/api/posts/tech,history/reads');
      expect(res.statusCode).toBe(200);
      expect(res.headers['content-type']).toContain('application/json');

      const posts = JSON.parse(res.text).posts;
      expect(posts[1].reads).toBeGreaterThanOrEqual(posts[0].reads);
      expect(posts[2].reads).toBeGreaterThanOrEqual(posts[1].reads);
    });

    test('should order by givin sortBy and direction asc', async () => {
      const res = await request(router).get('/api/posts/tech,history/popularity/asc');
      expect(res.statusCode).toBe(200);
      expect(res.headers['content-type']).toContain('application/json');

      const posts = JSON.parse(res.text).posts;

      expect(posts[1].popularity).toBeGreaterThanOrEqual(posts[0].popularity);
      expect(posts[2].popularity).toBeGreaterThanOrEqual(posts[1].popularity);
    });

    test('should order by givin sortBy and direction desc', async () => {
      const res = await request(router).get('/api/posts/tech,history/popularity/DESC');
      expect(res.statusCode).toBe(200);
      expect(res.headers['content-type']).toContain('application/json');

      const posts = JSON.parse(res.text).posts;

      expect(posts[1].popularity).toBeLessThanOrEqual(posts[0].popularity);
      expect(posts[2].popularity).toBeLessThanOrEqual(posts[1].popularity);
    });
  })

  test('should response with a 400 status code when sortBy param is not valid', async () => {
    const res = await request(router).get('/api/posts/tech/notvalid');
    expect(res.statusCode).toBe(400);
    expect(res.headers['content-type']).toContain('application/json');
    expect(res.text).toEqual("{\"error\":\"sortBy parameter is invalid\"}");
  });

  test('should response with a 400 status code when direction param is not valid', async () => {
    const res = await request(router).get('/api/posts/tech/id/notvalid');
    expect(res.statusCode).toBe(400);
    expect(res.headers['content-type']).toContain('application/json');
    expect(res.text).toEqual("{\"error\":\"sortBy parameter is invalid\"}");
  });

})




