const express = require('express');
const connectDB = require('./config/db');
const config = require('config');
const cloudinary = require('cloudinary');
const app = express();
var server = require('http').Server(app);
const io = require('socket.io')(server);
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');

// Connect Database
connectDB();

// Cloudinary Setup for image upload
cloudinary.config({
  cloud_name: config.get('CLOUD_NAME'),
  api_key: config.get('API_KEY'),
  api_secret: config.get('API_SECRET')
});

// Socket.IO for real time bidding
io.on('connection', function(socket) {
  var room = socket.handshake['query']['r_var'];

  socket.on('join', function() {
    socket.join(room);
    console.log('[socket]', 'join room :', room);
  });

  socket.on('unsubscribe', function(room) {
    try {
      console.log('[socket]', 'leaving room :', room);
      socket.leave(room);
      console.log('[socket]', 'left room :', room);
    } catch (e) {
      console.log('[error]', 'leave room :', e);
    }
  });

  socket.on('bid', function() {
    io.to(room).emit('bid');
    console.log('user made bid on' + room);
  });

  socket.on('chat message', function(msg) {
    io.to(room).emit('chat message', msg);
  });
});

//Data sanitization against NoSQL query injections
app.use(mongoSanitize());

//Data Sanitization against XSS
app.use(xss());

// Init Middleware
app.use(express.json({ extended: false })); //allows us to get the data on req.body

// Define Routes
app.use('/api/users', require('./routes/api/userRouter'));
app.use('/api/listings', require('./routes/api/listingRouter'));
app.use('/api/auth', require('./routes/api/authRouter'));
app.use('/api/review', require('./routes/api/reviewRouter'));
app.use('/api/report', require('./routes/api/reportRouter'));

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => console.log(`Server started on port ${PORT}`));
