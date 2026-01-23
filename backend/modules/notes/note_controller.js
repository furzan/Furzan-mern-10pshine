const db = require('../../models')
const logger = require('../../utils/logger');

async function createNote(req, res) {
	try {
		const { title, content } = req.body || {}
		const userId = req.user && req.user.id

		if (!userId) return res.status(401).json({ ok: false, message: 'Unauthorized' })

		const note = await db.Note.create({
			user_id: userId,
			title: title || null,
			content: content || null
		})

		logger.info({ userId, noteId: note.id }, 'Note created successfully');

		return res.status(201).json({ ok: true, note })
	} catch (err) {
		logger.error({ err, userId }, 'createNote error');
		return res.status(500).json({ ok: false, message: 'Internal server error' })
	}
}

async function getNotes(req, res) {
	try {
		const userId = req.user && req.user.id
		if (!userId) return res.status(401).json({ ok: false, message: 'Unauthorized' })

		const notes = await db.Note.findAll({
			where: { user_id: userId },
			order: [['created_at', 'DESC']]
		})

		logger.info({ userId, noteCount: notes.length }, 'Notes retrieved successfully');

		return res.status(200).json({ ok: true, notes })
	} catch (err) {
		logger.error({ err, userId }, 'getNotes error');
		return res.status(500).json({ ok: false, message: 'Internal server error' })
	}
}

async function updateNote(req, res) {
	try {
		const noteId = req.params.id
		const { title, content } = req.body || {}
		const userId = req.user && req.user.id

		if (!userId) return res.status(401).json({ ok: false, message: 'Unauthorized' })

		const note = await db.Note.findByPk(noteId)
		if (!note) return res.status(404).json({ ok: false, message: 'Note not found' })
		if (note.user_id !== userId) return res.status(403).json({ ok: false, message: 'Forbidden' })

		await note.update({
			title: typeof title === 'undefined' ? note.title : title,
			content: typeof content === 'undefined' ? note.content : content
		})

		logger.info({ userId, noteId }, 'Note updated successfully');

		return res.status(200).json({ ok: true, note })
	} catch (err) {
		logger.error({ err, userId, noteId: req.params.id }, 'updateNote error');
		return res.status(500).json({ ok: false, message: 'Internal server error' })
	}
}

async function deleteNote(req, res) {
	try {
		const noteId = req.params.id
		const userId = req.user && req.user.id

		if (!userId) return res.status(401).json({ ok: false, message: 'Unauthorized' })

		const note = await db.Note.findByPk(noteId)
		if (!note) return res.status(404).json({ ok: false, message: 'Note not found' })
		if (note.user_id !== userId) return res.status(403).json({ ok: false, message: 'Forbidden' })

		await note.destroy()

		logger.info({ userId, noteId }, 'Note deleted successfully');

		return res.status(200).json({ ok: true, message: 'Note deleted' })
	} catch (err) {
		logger.error({ err, userId, noteId: req.params.id }, 'deleteNote error');
		return res.status(500).json({ ok: false, message: 'Internal server error' })
	}
}

module.exports = {
	createNote,
	getNotes,
	updateNote,
	deleteNote
}

