process.env.NODE_ENV = 'test';

const request = require('supertest');
const { expect } = require('chai');
const sinon = require('sinon');
const jwt = require('jsonwebtoken');

const app = require('../app');
const db = require('../models');

describe('Note Controller Tests', () => {
  let token;
  let userId = 1;

  beforeEach(() => {
    // Create a valid JWT token for testing
    token = jwt.sign({ id: userId, email: 'test@example.com' }, process.env.JWT_SECRET || 'testsecret', { expiresIn: '1h' });
  });

  afterEach(() => {
    sinon.restore();
  });

  describe('POST /api/notes/create_note', () => {
    it('should create a new note successfully', async () => {
      const fakeNote = {
        id: 1,
        user_id: userId,
        title: 'Test Note',
        content: 'This is a test note',
        created_at: new Date()
      };

      const mockUser = { id: userId, token };
      sinon.stub(db.User, 'findByPk').resolves(mockUser);
      sinon.stub(jwt, 'verify').returns({ id: userId, email: 'test@example.com' });
      sinon.stub(db.Note, 'create').resolves(fakeNote);

      const res = await request(app)
        .post('/api/notes/create_note')
        .set('Authorization', `Bearer ${token}`)
        .send({ title: 'Test Note', content: 'This is a test note' });

      expect(res.status).to.equal(201);
      expect(res.body).to.have.property('ok').equal(true);
      expect(res.body.note).to.have.property('id').equal(1);
      expect(res.body.note).to.have.property('title').equal('Test Note');
    });
  });

  describe('GET /api/notes/get_notes', () => {
    it('should retrieve all notes for authenticated user', async () => {
      const fakeNotes = [
        { id: 1, user_id: userId, title: 'Note 1', content: 'Content 1' },
        { id: 2, user_id: userId, title: 'Note 2', content: 'Content 2' }
      ];

      const mockUser = { id: userId, token };
      sinon.stub(db.User, 'findByPk').resolves(mockUser);
      sinon.stub(jwt, 'verify').returns({ id: userId });
      sinon.stub(db.Note, 'findAll').resolves(fakeNotes);

      const res = await request(app)
        .get('/api/notes/get_notes')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).to.equal(200);
      expect(res.body).to.have.property('ok').equal(true);
      expect(res.body.notes).to.be.an('array').with.lengthOf(2);
      expect(res.body.notes[0]).to.have.property('title').equal('Note 1');
    });
  });

  describe('PUT /api/notes/update_note/:id', () => {
    it('should update a note successfully', async () => {
      const noteId = 1;
      const updatedNote = {
        id: noteId,
        user_id: userId,
        title: 'Updated Note',
        content: 'Updated content',
        update: sinon.stub().resolves()
      };

      const mockUser = { id: userId, token };
      sinon.stub(db.User, 'findByPk').resolves(mockUser);
      sinon.stub(jwt, 'verify').returns({ id: userId });
      sinon.stub(db.Note, 'findByPk').resolves(updatedNote);

      const res = await request(app)
        .put(`/api/notes/update_note/${noteId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ title: 'Updated Note', content: 'Updated content' });

      expect(res.status).to.equal(200);
      expect(res.body).to.have.property('ok').equal(true);
      expect(res.body.note).to.have.property('title').equal('Updated Note');
    });
  });

  describe('DELETE /api/notes/delete_note/:id', () => {
    it('should delete a note successfully', async () => {
      const noteId = 1;
      const fakeNote = {
        id: noteId,
        user_id: userId,
        title: 'Note to Delete',
        content: 'Content',
        destroy: sinon.stub().resolves()
      };

      const mockUser = { id: userId, token };
      sinon.stub(db.User, 'findByPk').resolves(mockUser);
      sinon.stub(jwt, 'verify').returns({ id: userId });
      sinon.stub(db.Note, 'findByPk').resolves(fakeNote);

      const res = await request(app)
        .delete(`/api/notes/delete_note/${noteId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).to.equal(200);
      expect(res.body).to.have.property('ok').equal(true);
      expect(res.body).to.have.property('message').equal('Note deleted');
    });
  });
});
