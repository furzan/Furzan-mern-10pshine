const express = require('express')
const noteController = require('./note_controller')
const { verifyToken } = require('../../middleware/auth_middleware')

const router = express.Router()

router.post('/create_note',verifyToken, noteController.createNote)

router.get('/get_notes', verifyToken, noteController.getNotes)

router.put('/update_note/:id', verifyToken, noteController.updateNote)

router.delete('/delete_note/:id', verifyToken, noteController.deleteNote)


module.exports = router;