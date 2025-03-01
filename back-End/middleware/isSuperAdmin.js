const isSuperAdmin = (req, res, next) => {
  next();
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
  
    if (req.user.role === 'superadmin') {
      
    } else {
      res.status(403).json({ message: 'Access denied. Super admin only.' });
    }
  };
  
  module.exports = isSuperAdmin;