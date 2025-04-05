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
const dashboardRoutes = require('./src/routes/dashboard'); // NEW

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
app.use(express.static(path.join(__dirname, 'src', 'uploads')));
app.use('/uploads', express.static(path.join(__dirname, 'src', 'uploads')));

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { secure: process.env.NODE_ENV === 'production' }
}));

// Flash messages
app.use(flash());

// Middleware to map session user to req.user (optional but useful)
app.use((req, res, next) => {
  if (req.session.user) {
    req.user = req.session.user;
  }
  next();
});

// Pass flash messages and user data to all views (available as locals)
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
app.use('/dashboard', dashboardRoutes); // NEW

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}`));
