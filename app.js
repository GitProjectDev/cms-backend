require('dotenv').config()
const express = require('express')
const session = require('express-session')
const MongoStore = require('connect-mongo')
const methodOverride = require('method-override')
const flash = require('connect-flash')
const helmet = require('helmet')
const path = require('path')
const connectDb = require('./src/config/connectDb')
const cors = require('cors')

// Import your other routes
const authRoutes = require('./src/routes/auth');
const blogRoutes = require('./src/routes/blog');
const videoRoutes = require('./src/routes/video');
const articleRoutes = require('./src/routes/article');
const galleryRoutes = require('./src/routes/gallery');
const dashboardRoutes = require('./src/routes/dashboard');
const apiRoutes = require('./src/routes/publicRoutes');
const contactRoutes = require('./src/routes/contact');

const app = express()
connectDb()

// Trust proxy for secure cookies behind reverse proxies (e.g., Nginx/Heroku)
app.set('trust proxy', 1);

// Middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", 'https://cdn.quilljs.com', "'unsafe-inline'"],
      styleSrc: ["'self'", 'https://cdn.quilljs.com', 'https://cdnjs.cloudflare.com', "'unsafe-inline'"]
    }
  }
}));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));

// Set the view engine to EJS and define the views directory
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src', 'views'));

// Serve static files (CSS, images, uploads)
app.use(express.static(path.join(__dirname, 'src', 'public')));
app.use(express.static(path.join(__dirname, 'src', 'uploads')));
app.use('/uploads', express.static(path.join(__dirname, 'src', 'uploads')));

// Secure Session Configuration
app.use(session({
  name: 'sid',
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',  // Only secure in production (HTTPS needed)
    httpOnly: true,  // JavaScript cannot access the cookie
    sameSite: 'strict',  // Prevent cross-site cookie sending
    maxAge: 60 * 60 * 1000  // Session expires in 1 hour
  },
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URI,
    ttl: 60 * 60  // Session expiration in seconds (1 hour)
  })
)

app.use(cors())

// For temporary messages (success/error)
app.use(flash());

// Middleware to map session user to req.user
app.use((req, res, next) => {
  if (req.session.user) {
    req.user = req.session.user;
  }
  next()
})

// Pass flash messages and user data to views (available as locals)
app.use((req, res, next) => {
  res.locals.success = req.flash('success')
  res.locals.error = req.flash('error')
  res.locals.user = req.session.user || null
  next()
})

// Routes – notice that contact route is added here without affecting your other services
app.use('/auth', authRoutes);
app.use('/blogs', blogRoutes);
app.use('/videos', videoRoutes);
app.use('/articles', articleRoutes);
app.use('/galleries', galleryRoutes);
app.use('/dashboard', dashboardRoutes);
app.use('/api', apiRoutes);
app.use('/contact', contactRoutes); //smtp

// Generic Error Handling for 404 Not Found
app.use((req, res, next) => {
  const error = new Error('Not Found');
  error.status = 404;
  next(error);
});

// Error handler
app.use((error, req, res, next) => {
  res.status(error.status || 500)
  res.json({
    message: error.message,
    error: process.env.NODE_ENV === 'development' ? error : {},
  })
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () =>
  console.log(`Server is running on http://localhost:${PORT}`)
)