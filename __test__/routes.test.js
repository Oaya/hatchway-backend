import request from 'supertest';
import app from '../server/index';
import express from 'express';


const router = express()
router.use('/', app);


describe("/ping routes", () => {
  //should return 200 status when get  request is success//
  test('should response with a 200 status code', async () => {
    const res = await request(router).get('/api/ping');
    // console.log(res)
    expect(res.statusCode).toBe(200);
    expect(res.text).toEqual("{\"success\":true}");
    //specified its JSON//
    expect(res.headers['content-type']).toContain('application/json');
  })

})