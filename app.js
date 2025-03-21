const express = require('express');
const session = require('express-session');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const connectDb = require('./src/config/connectDb');
const authRoutes = require('./src/routes/auth');
// const articleRoutes = require('./src/routes/articles');
// const publicArticleRoutes = require('./src/routes/publicArticleRoutes');
// const adminVideoRoutes = require('./src/routes/videos');
// const publicVideoRoutes = require('./src/routes/publicVideoRoutes');
// const adminBlogRoutes = require('./src/routes/blogs');
// const publicBlogRoutes = require('./src/routes/publicBlogRoutes');
require('dotenv').config();

const app = express();

// Connect to MongoDB
connectDb();

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));
app.set('view engine', 'ejs');
app.set('views', 'src/views');
app.use(express.static('src/public'));

const sessionSecret = process.env.SESSION_SECRET || 'your-secret-key';
app.use(session({
    secret: sessionSecret,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: process.env.NODE_ENV === 'production' }
}));

app.use(flash());
app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    res.locals.user = req.session.user || null;
    next();
});

// Routes
app.use('/auth', authRoutes);
// app.use('/articles', articleRoutes);
// app.use('/public/articles', publicArticleRoutes);
// app.use('/videos', adminVideoRoutes);
// app.use('/api/videos', publicVideoRoutes);
// app.use('/blogs', adminBlogRoutes);
// app.use('/api/blogs', publicBlogRoutes);

// Dashboard route 
app.get('/dashboard', (req, res) => {
    if (!req.session.user) {
        req.flash('error', 'Please log in first');
        return res.redirect('/auth/login');
    }
    res.render('dashboard');
});

// Start Server
const PORT = process.env.PORT ;
app.listen(PORT, () => console.log(`Server is listening on http://localhost:${PORT} ...`));