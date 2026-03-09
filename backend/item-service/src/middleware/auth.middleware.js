const auth = (req, res, next) => {
    const userId = req.headers['x-user-id'];

  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  req.user = {
    id: userId,
    roles: JSON.parse(req.headers['x-user-roles'] || '[]')
  };

  next();
};

module.exports = auth;