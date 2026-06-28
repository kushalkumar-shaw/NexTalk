const express = require('express');
const messageController = require('../controllers/message.controller');
const { verifyToken } = require('../middleware/auth.middleware');

const router = express.Router();

router.use(verifyToken);

router.get('/room/:roomId', messageController.getMessagesByRoom);

module.exports = router;
