require('dotenv').config();
const express = require('express');
const session = require('express-session');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const path = require('path');
const connectDb = require('./src/config/connectDb');

// Import Routes
const authRoutes = require('./src/routes/auth');
const blogRoutes = require('./src/routes/blog');
const videoRoutes = require('./src/routes/video');
const articleRoutes = require('./src/routes/article');
const galleryRoutes = require('./src/routes/gallery');

const app = express();

// Connect to MongoDB
connectDb();

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src', 'views'));
app.use(express.static(path.join(__dirname, 'src', 'public')));

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { secure: process.env.NODE_ENV === 'production' }
}));

// Flash messages
app.use(flash());

// Pass flash messages and user data to all views
app.use((req, res, next) => {
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  res.locals.user = req.session.user || null;
  next();
});

// Routes
app.use('/auth', authRoutes);
app.use('/blogs', blogRoutes);
app.use('/videos', videoRoutes);
app.use('/articles', articleRoutes);
app.use('/galleries', galleryRoutes);

// Dashboard route
app.get('/dashboard', (req, res) => {
  if (!req.session.user) {
    req.flash('error', 'Please log in first');
    return res.redirect('/auth/login');
  }
  res.render('dashboard');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}`));
