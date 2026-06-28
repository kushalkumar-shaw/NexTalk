const express = require('express');
const { body } = require('express-validator');
const roomController = require('../controllers/room.controller');
const validate = require('../middleware/validate.middleware');
const { verifyToken } = require('../middleware/auth.middleware');

const router = express.Router();

router.use(verifyToken);

router.post('/', [
  body('name')
    .trim()
    .notEmpty().withMessage('Room name is required')
    .isLength({ min: 3, max: 50 }).withMessage('Room name must be between 3 and 50 characters'),
  body('type')
    .optional()
    .isIn(['public', 'private']).withMessage('Type must be public or private'),
  validate
], roomController.createRoom);

router.get('/', roomController.getRooms);
router.get('/:id', roomController.getRoomById);
router.post('/:id/join', roomController.joinRoom);
router.post('/:id/leave', roomController.leaveRoom);
router.post('/:id/members', [
  body('userId').notEmpty().withMessage('User ID is required'),
  validate
], roomController.addMember);
router.delete('/:id', roomController.deleteRoom);

module.exports = router;
