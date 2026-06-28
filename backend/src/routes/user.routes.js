const express = require('express');
const userController = require('../controllers/user.controller');
const { verifyToken } = require('../middleware/auth.middleware');

const router = express.Router();

router.use(verifyToken);

router.get('/', userController.getUsers);
router.get('/:id', userController.getUserById);

module.exports = router;
