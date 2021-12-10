const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    text: String,
  },
  { timestamps: true }
);

// this.pre(/^find/, function (next) {
//  this.populate({ path: '' });
//  next();
// });

const Message = mongoose.model('Message', messageSchema);
module.exports = Message;
