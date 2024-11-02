// Import required modules
const express = require('express'); // Express for handling HTTP requests
const http = require('http'); // Node.js HTTP module
const { Server } = require('socket.io'); // Socket.IO for real-time communication
const cors = require('cors'); // CORS for cross-origin requests

// Initialize Express app
const app = express();

// Create HTTP server with the Express app
const server = http.createServer(app);

// Initialize Socket.IO server with CORS options
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000', // Allow frontend connection
    methods: ['GET', 'POST']
  }
});

// Use CORS middleware
app.use(cors());

// Array to keep track of connected users
let users = [];

// Handle Socket.IO connections
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Event listener for when a user joins with a username
  socket.on('join', (username) => {
    const user = { id: socket.id, username };
    users.push(user); // Add user to the list
    io.emit('user-list', users); // Broadcast updated user list to all clients
  });

  // Event listener for when a message is sent
  socket.on('message', (msg) => {
    io.emit('message', msg); // Broadcast message to all connected users
  });

  // Event listener for when a user disconnects
  socket.on('disconnect', () => {
    users = users.filter((user) => user.id !== socket.id); // Remove user from list
    io.emit('user-list', users); // Broadcast updated user list to all clients
    console.log('User disconnected:', socket.id);
  });
});

// Start the server on port 5000
server.listen(5000, () => {
  console.log('Backend running on http://localhost:5000');
});
