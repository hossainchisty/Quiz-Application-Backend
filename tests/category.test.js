// Basic Lib Imports

/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable consistent-return */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-undef */

const request = require('supertest');
const Category = require('../models/categoryModels');
const app = require('../app');

describe('GET  /api/v1/category', () => {
  it('Responds with a JSON array of category', (done) => {
    request(app)
      .get('/api/v1/category')
      .expect('Content-Type', 'application/json; charset=utf-8')
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).toBeInstanceOf(Array);
        done();
      });
  });
});

describe('POST /api/v1/category', () => {
  it('Creates a new category and responds with the new category object', (done) => {
    const newCategory = {
      name: 'Freelance',
    };

    request(app)
      .post('/api/v1/category')
      .set('Content-Type', 'application/json')
      .send(newCategory)
      .expect('Content-Type', 'application/json; charset=utf-8')
      .expect(201)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).toHaveProperty('_id');
        expect(res.body.name).toBe(newCategory.name);
        done();
      });
  });
});

describe('DELETE /api/v1/category/:id', () => {
  it('Responds with a success message on successful deletion', async () => {
    const category = await Category.findOne();
    request(app).delete(`/api/v1/category/${category._id}`).expect(401); // TODO: Change this behavior when user logs
  });
});
