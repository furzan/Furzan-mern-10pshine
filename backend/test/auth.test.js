process.env.NODE_ENV = 'test';

const request = require('supertest');
const { expect } = require('chai');
const sinon = require('sinon');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = require('../app');
const db = require('../models');
const sendEmail = require('../utils/send_email');

describe('Auth Controller Tests', () => {
  
  afterEach(() => {
    sinon.restore();
  });

  describe('POST /api/auth/signup', () => {
    it('should register a new user successfully', async () => {
      const fakeUser = {
        id: 1,
        f_name: 'John',
        l_name: 'Doe',
        email: 'test@example.com',
        created_at: new Date()
      };
      
      sinon.stub(db.User, 'findOne').resolves(null);
      sinon.stub(db.User, 'create').resolves(fakeUser);
      sinon.stub(bcrypt, 'hash').resolves('hashedpassword123');
      
      const newUser = {
        f_name: 'John',
        l_name: 'Doe',
        email: 'test@example.com',
        password: 'password123'
      };
      
      const res = await request(app)
        .post('/api/auth/signup')
        .send(newUser);
      
      expect(res.status).to.equal(201);
      expect(res.body).to.have.property('ok').equal(true);
      expect(res.body).to.have.property('message').equal('User registered successfully');
      expect(res.body.user).to.have.property('email').equal('test@example.com');
    });

    it('should return error when email already exists', async () => {
      const existingUser = {
        id: 1,
        email: 'existing@example.com'
      };
      
      sinon.stub(db.User, 'findOne').resolves(existingUser);
      
      const duplicateUser = {
        f_name: 'Jane',
        l_name: 'Smith',
        email: 'existing@example.com',
        password: 'password123'
      };
      
      const res = await request(app)
        .post('/api/auth/signup')
        .send(duplicateUser);
      
      expect(res.status).to.equal(409);
      expect(res.body).to.have.property('ok').equal(false);
      expect(res.body).to.have.property('message').equal('Email already in use');
    });

    it('should return error with missing first name', async () => {
      const incompleteUser = {
        l_name: 'Doe',
        email: 'test@example.com',
        password: 'password123'
      };
      
      const res = await request(app)
        .post('/api/auth/signup')
        .send(incompleteUser);
      
      expect(res.status).to.equal(400);
      expect(res.body).to.have.property('ok').equal(false);
      expect(res.body.errors).to.be.an('array');
    });

    it('should return error with invalid email format', async () => {
      const invalidUser = {
        f_name: 'John',
        l_name: 'Doe',
        email: 'invalid-email',
        password: 'password123'
      };
      
      const res = await request(app)
        .post('/api/auth/signup')
        .send(invalidUser);
      
      expect(res.status).to.equal(400);
      expect(res.body).to.have.property('ok').equal(false);
    });

    it('should return error when password is too short', async () => {
      const weakPasswordUser = {
        f_name: 'John',
        l_name: 'Doe',
        email: 'test@example.com',
        password: 'short'
      };
      
      const res = await request(app)
        .post('/api/auth/signup')
        .send(weakPasswordUser);
      
      expect(res.status).to.equal(400);
      expect(res.body).to.have.property('ok').equal(false);
    });
  });

  describe('POST /api/auth/login', () => {
    it('should login with valid credentials', async () => {
      const fakeUser = {
        id: 1,
        f_name: 'John',
        l_name: 'Doe',
        email: 'test@example.com',
        password_hash: 'hashedpassword123',
        last_login: null,
        update: sinon.stub().resolves()
      };
      
      sinon.stub(db.User, 'findOne').resolves(fakeUser);
      sinon.stub(bcrypt, 'compare').resolves(true);
      sinon.stub(jwt, 'sign').returns('mockedtoken123');
      
      const credentials = {
        email: 'test@example.com',
        password: 'password123'
      };
      
      const res = await request(app)
        .post('/api/auth/login')
        .send(credentials);
      
      expect(res.status).to.equal(200);
      expect(res.body).to.have.property('ok').equal(true);
      expect(res.body).to.have.property('token').equal('mockedtoken123');
      expect(res.body.user).to.have.property('email').equal('test@example.com');
    });

    it('should return error with invalid email', async () => {
      sinon.stub(db.User, 'findOne').resolves(null);
      
      const credentials = {
        email: 'nonexistent@example.com',
        password: 'password123'
      };
      
      const res = await request(app)
        .post('/api/auth/login')
        .send(credentials);
      
      expect(res.status).to.equal(401);
      expect(res.body).to.have.property('ok').equal(false);
      expect(res.body).to.have.property('message').equal('Invalid credentials');
    });

    it('should return error with invalid password', async () => {
      const fakeUser = {
        id: 1,
        email: 'test@example.com',
        password_hash: 'hashedpassword123',
        update: sinon.stub().resolves()
      };
      
      sinon.stub(db.User, 'findOne').resolves(fakeUser);
      sinon.stub(bcrypt, 'compare').resolves(false);
      
      const credentials = {
        email: 'test@example.com',
        password: 'wrongpassword'
      };
      
      const res = await request(app)
        .post('/api/auth/login')
        .send(credentials);
      
      expect(res.status).to.equal(401);
      expect(res.body).to.have.property('ok').equal(false);
      expect(res.body).to.have.property('message').equal('Invalid credentials');
    });

    it('should return error with missing password', async () => {
      const credentials = {
        email: 'test@example.com'
      };
      
      const res = await request(app)
        .post('/api/auth/login')
        .send(credentials);
      
      expect(res.status).to.equal(400);
      expect(res.body).to.have.property('ok').equal(false);
    });
  });

  describe('POST /api/auth/logout', () => {
    it('should logout user successfully', async () => {
      const fakeUser = {
        id: 1,
        email: 'test@example.com',
        update: sinon.stub().resolves()
      };
      
      sinon.stub(db.User, 'findOne').resolves(fakeUser);
      
      const logoutData = {
        email: 'test@example.com'
      };
      
      const res = await request(app)
        .post('/api/auth/logout')
        .send(logoutData);
      
      expect(res.status).to.equal(200);
      expect(res.body).to.have.property('ok').equal(true);
      expect(res.body).to.have.property('message').equal('Logged out');
    });

    it('should return error if user not found', async () => {
      sinon.stub(db.User, 'findOne').resolves(null);
      
      const logoutData = {
        email: 'nonexistent@example.com'
      };
      
      const res = await request(app)
        .post('/api/auth/logout')
        .send(logoutData);
      
      expect(res.status).to.equal(401);
      expect(res.body).to.have.property('ok').equal(false);
    });
  });

  describe('POST /api/auth/forgot-password', () => {
    it('should request password reset successfully', async () => {
      const fakeUser = {
        id: 1,
        email: 'test@example.com',
        update: sinon.stub().resolves()
      };
      
      sinon.stub(db.User, 'findOne').resolves(fakeUser);
      // Mock the entire send_email module
      const sendEmailStub = sinon.stub().resolves();
      sinon.stub(require.cache[require.resolve('../utils/send_email')], 'exports').value(sendEmailStub);
      
      const res = await request(app)
        .post('/api/auth/forgot-password')
        .send({ email: 'test@example.com' });
      
      expect(res.status).to.equal(200);
      expect(res.body).to.have.property('ok').equal(true);
      expect(res.body).to.have.property('message').include('reset link has been sent');
    });
  });

  describe('POST /api/auth/reset-password', () => {
    it('should reset password successfully', async () => {
      const futureDate = new Date(Date.now() + 60 * 60 * 1000);
      const fakeUser = {
        id: 1,
        email: 'test@example.com',
        reset_token: '123456',
        reset_token_expires: futureDate,
        update: sinon.stub().resolves()
      };
      
      sinon.stub(db.User, 'findOne').resolves(fakeUser);
      sinon.stub(bcrypt, 'hash').resolves('newhash123');
      
      const res = await request(app)
        .post('/api/auth/reset-password')
        .send({ 
          email: 'test@example.com',
          token: '123456',
          new_password: 'newpassword123'
        });
      
      expect(res.status).to.equal(200);
      expect(res.body).to.have.property('ok').equal(true);
      expect(res.body).to.have.property('message').equal('Password has been reset');
    });
  });

  describe('GET /api/auth/verifyToken', () => {
    it('should verify token successfully', async () => {
      const fakeUser = {
        id: 1,
        token: 'mockedtoken123'
      };
      
      sinon.stub(db.User, 'findByPk').resolves(fakeUser);
      sinon.stub(jwt, 'verify').returns({ id: 1 });
      
      const res = await request(app)
        .get('/api/auth/verifyToken')
        .set('Authorization', 'Bearer mockedtoken123');
      
      expect(res.status).to.equal(200);
      expect(res.body).to.have.property('ok').equal(true);
      expect(res.body).to.have.property('message').equal('User is authenticated');
    });
  });
});