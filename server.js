const mongoose = require('mongoose');
const dotenv = require('dotenv').config({ path: './config.env' });
const colors = require('colors');
const DBConnect = require('./utils/dbConnect');
const socketIo = require('socket.io');
const verifyUser = require('./utils/verifyUser');

process.on('uncaughtException', (error) => {
  // using uncaughtException event
  // console.log(' uncaught Exception => shutting down..... ');
  // console.log(error.name, error.message);
  process.exit(1); //  emidiatly exists all from all the requests
});

const app = require('./app');
const Chat = require('./models/Chat');
const Message = require('./models/Message');
const Offer = require('./models/Offer');
const Order = require('./models/Order');

// database connection
DBConnect();

// server
const port = process.env.PORT || 7000;
const server = app.listen(port, () => {
  // console.log(`App is running on port ${port}`.yellow.bold);
});

const io = socketIo(server);

io.on('connection', (socket) => {
  // console.log(`Connection created with socket ${socket.id}`.cyan);
  socket.emit('me', socket.id);

  socket.on('newMessage', async (data) => {
    // console.log('*****');
    // console.log('*****');
    // console.log('*****');
    // console.log(`data`, data);
    const { token, text, chatId } = data;
    try {
      // * Verify Token
      const loggedUser = await verifyUser(token);
      // console.log(`loggedUser`, loggedUser);

      // * Find Chat

      let chat = await Chat.findById(chatId);
      // console.log(`chatId`, chatId);
      // console.log(`chat`, chat);
      if (!chat) return;

      // * Create New Message
      const newMessage = await Message.create({
        text: text,
        sender: loggedUser._id,
      });

      // console.log(`newMessage`, newMessage);

      // * Push new Message to Chat Messages
      chat.messages = [...chat.messages, newMessage._id];
      await chat.save();

      // * Receiver will the 2nd participant of chat
      // console.log(` chat.participants[0]._id`, chat.participants[0]._id);
      const receiver =
        chat.participants[0]._id.toString() === loggedUser._id.toString()
          ? chat.participants[1]
          : chat.participants[0];

      // console.log(`receiver`, receiver);

      await Chat.populate(chat, {
        path: 'participants',
        select: 'name email',
      });
      await Chat.populate(chat, {
        path: 'messages',
        select: 'name email',
      });
      await Message.populate(newMessage, {
        path: 'sender',
      });

      // * Send new Message to all sockets
      io.sockets.emit('newMessage', {
        chatId: chat._id,
        message: newMessage,
        userId: loggedUser._id,
        receiver: receiver._id,
      });

      // console.log(`updatedChat`, chat);
    } catch (err) {
      // console.log(`err ${err}`.bgWhite.red.bold);
    }
  });
  socket.on('newOffer', async (data) => {
    // console.log('*****');
    // console.log('*****');
    // console.log('*****');
    // console.log(`data`, data);
    const { token, offer, chatId, userId } = data;
    // console.log(`userId`, userId);
    // console.log(`offer`, offer);
    try {
      // * Verify Token
      const loggedUser = await verifyUser(token);
      // console.log(`loggedUser`, loggedUser);

      // * Find Chat
      let chat = await Chat.findById(chatId);
      // console.log(`chatId`, chatId);
      // console.log(`chat`, chat);

      const newOffer = await Offer.create({
        description: offer.description,
        budget: offer.budget,
        expectedDays: offer.expectedDays,
        user: loggedUser._id,
      });

      // console.log(`newOffer`, newOffer);

      // * Create New Message

      const newMessage = await Message.create({
        sender: loggedUser._id,
        isOffer: true,
        offer: newOffer._id,
      });

      // console.log(`newMessage`, newMessage);

      // * Push new Message to Chat Messages
      chat.messages = [...chat.messages, newMessage._id];
      await chat.save();

      // * Receiver will the userId
      const receiver = userId;

      // console.log(`receiver`, receiver);

      await Chat.populate(chat, {
        path: 'participants',
        select: 'fullName email photo',
      });
      await Chat.populate(chat, {
        path: 'messages',
        select: 'fullName email photo',
      });
      await Message.populate(newMessage, {
        path: 'sender',
        select: 'fullName email photo',
      });
      await Message.populate(newMessage, {
        path: 'offer',
      });

      // * Send new Message to all sockets
      io.sockets.emit('newMessage', {
        chatId: chat._id,
        message: newMessage,
        userId: loggedUser._id,
        receiver: receiver,
      });

      // console.log(`updatedChat`, chat);
    } catch (err) {
      // console.log(`err ${err}`.bgWhite.red.bold);
    }
  });
  socket.on('handleOffer', async (data) => {
    const { token, offerId, messageId, chatId, status } = data;
    // console.log('*****');
    // console.log('*****');
    // console.log('*****');
    // console.log(`data`, data);
    // console.log(`userId`, userId);
    // console.log(`status`, status);
    // console.log(`offerId`, offerId);
    try {
      // * Verify Token
      const loggedUser = await verifyUser(token);
      // console.log(`loggedUser`, loggedUser);

      // * Find Chat

      let chat = await Chat.findById(chatId);
      // console.log(`chatId`, chatId);
      // console.log(`chat`, chat);

      const updatedOffer = await Offer.findByIdAndUpdate(
        offerId,
        {
          status: status,
        },
        {
          new: true,
          runValidators: true,
        }
      );

      let order;
      if (status === 'accepted') {
        const days = updatedOffer.expectedDays;
        let deadline = new Date();
        deadline.setHours(new Date().getHours() + 24 * days);

        // start the order after accepting the offer

        order = await Order.create({
          buyer: loggedUser._id,
          seller: updatedOffer.user,
          offer: updatedOffer._id,
          deadline: deadline,
        });
        // console.log(`order`, order);
      }

      // console.log(`updatedOffer`, updatedOffer);

      // * Updated Message
      const updatedMessage = await Message.findById(messageId);
      // console.log(`updatedMessage`, updatedMessage);

      // * Receiver will the userId
      const receiver = updatedOffer.user;

      // console.log(`receiver`, receiver);

      await Chat.populate(chat, {
        path: 'participants',
        select: 'fullName photo email',
      });
      await Chat.populate(chat, {
        path: 'messages',
        select: 'fullName email photo',
      });
      await Message.populate(updatedMessage, {
        path: 'sender',
        select: 'fullName email photo',
      });
      await Message.populate(updatedMessage, {
        path: 'offer',
      });

      // * Send new Message to all sockets
      io.sockets.emit('updatedMessage', {
        chatId: chat._id,
        message: updatedMessage,
        userId: loggedUser._id,
        receiver: receiver,
      });

      // console.log(`updatedChat`, chat);
    } catch (err) {
      // console.log(`err ${err}`.bgWhite.red.bold);
    }
  });
});

// handle Globaly  the unhandle Rejection Error which is  outside the express
// e.g database connection
process.on('unhandledRejection', (error) => {
  // it uses unhandledRejection event
  // using unhandledRejection event
  // console.log(' Unhandled Rejection => shutting down..... ');
  // console.log(error.name, error.message);
  server.close(() => {
    process.exit(1); //  emidiatly exists all from all the requests sending OR pending
  });
});
