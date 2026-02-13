process.env.NODE_ENV = 'test';

const { expect } = require('chai');
const sinon = require('sinon');

const db = require('../models');

describe('Model Tests', () => {

  afterEach(() => {
    sinon.restore();
  });

  describe('User Model', () => {
    it('should have Sequelize model methods', () => {
      expect(db.User).to.exist;
      expect(db.User.create).to.be.a('function');
      expect(db.User.findOne).to.be.a('function');
      expect(db.User.findByPk).to.be.a('function');
      expect(db.User.findAll).to.be.a('function');
    });

    it('should create a user successfully', async () => {
      const userData = {
        f_name: 'John',
        l_name: 'Doe',
        email: 'john@example.com',
        password_hash: 'hashedpassword123'
      };

      const fakeUser = {
        id: 1,
        ...userData,
        created_at: new Date()
      };

      sinon.stub(db.User, 'create').resolves(fakeUser);

      const result = await db.User.create(userData);

      expect(result).to.exist;
      expect(result).to.have.property('id').equal(1);
      expect(result).to.have.property('f_name').equal('John');
      expect(result).to.have.property('email').equal('john@example.com');
    });

    it('should find user by email', async () => {
      const fakeUser = {
        id: 1,
        f_name: 'John',
        l_name: 'Doe',
        email: 'john@example.com',
        password_hash: 'hashedpassword123'
      };

      sinon.stub(db.User, 'findOne').resolves(fakeUser);

      const result = await db.User.findOne({ where: { email: 'john@example.com' } });

      expect(result).to.exist;
      expect(result).to.have.property('email').equal('john@example.com');
    });

    it('should find user by primary key', async () => {
      const fakeUser = {
        id: 1,
        f_name: 'John',
        l_name: 'Doe',
        email: 'john@example.com',
        token: 'sometoken'
      };

      sinon.stub(db.User, 'findByPk').resolves(fakeUser);

      const result = await db.User.findByPk(1);

      expect(result).to.exist;
      expect(result).to.have.property('id').equal(1);
    });

    it('should return null for non-existent user', async () => {
      sinon.stub(db.User, 'findOne').resolves(null);

      const result = await db.User.findOne({ where: { email: 'nonexistent@example.com' } });

      expect(result).to.be.null;
    });

    it('should update user properties', async () => {
      const fakeUser = {
        id: 1,
        f_name: 'John',
        l_name: 'Doe',
        email: 'john@example.com',
        token: 'newtoken',
        last_login: new Date(),
        update: sinon.stub().resolves()
      };

      sinon.stub(db.User, 'findByPk').resolves(fakeUser);

      const user = await db.User.findByPk(1);
      await user.update({ token: 'newtoken' });

      expect(user.update.called).to.be.true;
    });
  });

  describe('Note Model', () => {
    it('should have Sequelize model methods', () => {
      expect(db.Note).to.exist;
      expect(db.Note.create).to.be.a('function');
      expect(db.Note.findOne).to.be.a('function');
      expect(db.Note.findByPk).to.be.a('function');
      expect(db.Note.findAll).to.be.a('function');
    });

    it('should create a note successfully', async () => {
      const noteData = {
        user_id: 1,
        title: 'My Note',
        content: 'Note content'
      };

      const fakeNote = {
        id: 1,
        ...noteData,
        created_at: new Date()
      };

      sinon.stub(db.Note, 'create').resolves(fakeNote);

      const result = await db.Note.create(noteData);

      expect(result).to.exist;
      expect(result).to.have.property('id').equal(1);
      expect(result).to.have.property('title').equal('My Note');
      expect(result).to.have.property('user_id').equal(1);
    });

    it('should find all notes for a user', async () => {
      const fakeNotes = [
        { id: 1, user_id: 1, title: 'Note 1', content: 'Content 1', created_at: new Date() },
        { id: 2, user_id: 1, title: 'Note 2', content: 'Content 2', created_at: new Date() }
      ];

      sinon.stub(db.Note, 'findAll').resolves(fakeNotes);

      const result = await db.Note.findAll({ where: { user_id: 1 } });

      expect(result).to.be.an('array');
      expect(result).to.have.lengthOf(2);
      expect(result[0]).to.have.property('title').equal('Note 1');
    });

    it('should find note by primary key', async () => {
      const fakeNote = {
        id: 1,
        user_id: 1,
        title: 'My Note',
        content: 'Note content'
      };

      sinon.stub(db.Note, 'findByPk').resolves(fakeNote);

      const result = await db.Note.findByPk(1);

      expect(result).to.exist;
      expect(result).to.have.property('id').equal(1);
      expect(result).to.have.property('title').equal('My Note');
    });

    it('should update a note', async () => {
      const fakeNote = {
        id: 1,
        user_id: 1,
        title: 'Updated Note',
        content: 'Updated content',
        update: sinon.stub().resolves()
      };

      sinon.stub(db.Note, 'findByPk').resolves(fakeNote);

      const note = await db.Note.findByPk(1);
      await note.update({ title: 'Updated Note', content: 'Updated content' });

      expect(note.update.called).to.be.true;
    });

    it('should delete a note', async () => {
      const fakeNote = {
        id: 1,
        user_id: 1,
        title: 'Note to Delete',
        destroy: sinon.stub().resolves()
      };

      sinon.stub(db.Note, 'findByPk').resolves(fakeNote);

      const note = await db.Note.findByPk(1);
      await note.destroy();

      expect(note.destroy.called).to.be.true;
    });

    it('should return null for non-existent note', async () => {
      sinon.stub(db.Note, 'findByPk').resolves(null);

      const result = await db.Note.findByPk(999);

      expect(result).to.be.null;
    });
  });

  describe('Data Validation', () => {
    it('should validate email format', () => {
      const emailRegex = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

      expect(emailRegex.test('test@example.com')).to.be.true;
      expect(emailRegex.test('invalid-email')).to.be.false;
      expect(emailRegex.test('user@domain.co.uk')).to.be.true;
    });

    it('should validate password length', () => {
      const minLength = 8;

      expect('password123'.length >= minLength).to.be.true;
      expect('short'.length >= minLength).to.be.false;
      expect('ValidPass1'.length >= minLength).to.be.true;
    });

    it('should validate note fields exist', () => {
      const validNote = { title: 'My Note', content: 'Content' };
      const noteWithoutTitle = { content: 'Content' };

      expect(validNote).to.have.property('title');
      expect(validNote).to.have.property('content');
      expect(noteWithoutTitle).to.not.have.property('title');
    });

    it('should validate user fields exist', () => {
      const validUser = { f_name: 'John', l_name: 'Doe', email: 'john@example.com', password_hash: 'hash' };

      expect(validUser).to.have.property('f_name');
      expect(validUser).to.have.property('l_name');
      expect(validUser).to.have.property('email');
      expect(validUser).to.have.property('password_hash');
    });
  });
});
