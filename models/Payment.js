const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema(
  {
    amount: {
      type: Number,
      required: [true, `Plz provide payment's amount`],
    },
    currency: String,
    // stripeTransactionId
  },
  {
    timestamps: true,
  }
);

paymentSchema.pre(/^find/, function (next) {
  this.sort('-createdAt');
  next();
});

const Payment = mongoose.model('Payment', paymentSchema);
module.exports = Payment;
