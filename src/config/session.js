const session = require('express-session');
const MongoStore = require('connect-mongo');
require('dotenv').config();

module.exports = session({
  name: 'sid',
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URI,
    ttl: 60 * 60, // 1 hour
  }),
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // Set to true in production
    sameSite: 'lax',
    maxAge: 60 * 60 * 1000 // 1 hour
  }
});
