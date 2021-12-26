const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    // * Receiver will be 2nd person of chat
    // receiver: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: 'User',
    // },
    text: String,
    isOffer: {
      type: Boolean,
      default: false,
    },
    offer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Offer',
    },
  },
  { timestamps: true }
);

messageSchema.pre(/^find/, function (next) {
  this.populate({ path: 'sender', select: 'fullName photo' }).populate({
    path: 'offer',
    select: 'description budget expectedDays status',
  });
  next();
});

const Message = mongoose.model('Message', messageSchema);
module.exports = Message;
