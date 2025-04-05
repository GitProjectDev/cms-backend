// src/middleware/authMiddleware.js
module.exports = (req, res, next) => {
  // Check if the user is logged in
  if (!req.session.user) {
    req.flash('error', 'Please log in to continue');
    return res.redirect('/auth/login');
  }

  // Session expiry: Check if session has expired
  const sessionExpires = req.session.cookie.expires;
  if (sessionExpires && sessionExpires < new Date()) {
    req.flash('error', 'Session expired. Please log in again.');
    req.session.destroy(() => {
      res.clearCookie('sid'); // Clear session cookie
      return res.redirect('/auth/login'); // Redirect to login page
    });
    return;
  }

  // Validate IP address and User-Agent for added security
  const sessionIp = req.session.ip;
  const sessionUa = req.session.userAgent;
  const currentIp = req.ip;
  const currentUa = req.headers['user-agent'];

  // If IP or User-Agent has changed, invalidate session
  if ((sessionIp && sessionIp !== currentIp) || (sessionUa && sessionUa !== currentUa)) {
    req.flash('error', 'Suspicious session detected. Please log in again.');
    req.session.destroy(() => {
      res.clearCookie('sid'); // Clear session cookie
      return res.redirect('/auth/login'); // Redirect to login page
    });
    return;
  }

  // Save the current session IP and User-Agent if not already saved
  if (!sessionIp) req.session.ip = currentIp;
  if (!sessionUa) req.session.userAgent = currentUa;

  next(); // Proceed to the next middleware or route handler
};
