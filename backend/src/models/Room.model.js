const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Room name is required'],
    unique: true,
    trim: true,
    minlength: [3, 'Room name must be at least 3 characters long'],
    maxlength: [50, 'Room name must be less than 50 characters long']
  },
  description: {
    type: String,
    default: "",
    maxlength: [200, 'Description must be less than 200 characters long']
  },
  type: {
    type: String,
    enum: ["public", "private"],
    default: "public"
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  members: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: []
  }]
}, {
  timestamps: true
});

const Room = mongoose.model('Room', roomSchema);

module.exports = Room;
