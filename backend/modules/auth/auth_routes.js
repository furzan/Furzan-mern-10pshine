const express = require('express')
const router = express.Router()
const authController = require('./auth_controller')

router.post('/signup', authController.register)

router.post('/login', authController.login)

router.post('/logout', authController.logout)

router.post('/forgot-password', authController.requestPasswordReset)

router.post('/reset-password', authController.resetPassword)

module.exports = router;