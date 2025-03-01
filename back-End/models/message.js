// models/message.js
const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: "senderModel",
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: "receiverModel",
    },
    senderModel: {
      type: String,
      required: true,
      enum: ["Client", "Nurse"],
    },
    receiverModel: {
      type: String,
      required: true,
      enum: ["Client", "Nurse"],
    },
    content: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  });
// Index for faster queries
MessageSchema.index({ sender: 1, receiver: 1, createdAt: 1 });

module.exports = mongoose.model('Message', MessageSchema);