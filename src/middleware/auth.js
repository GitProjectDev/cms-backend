const authMiddleware = (req, res, next) => {
    if (!req.session.user) {
        req.flash('error', 'You need to log in first');
        return res.redirect('/auth/login');
    }
    next();
};

module.exports = authMiddleware;