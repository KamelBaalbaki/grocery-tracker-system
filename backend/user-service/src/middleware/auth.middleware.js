const auth = (req, res, next) => {
  const userId = req.headers["x-user-id"];
  const userEmail = req.headers["x-user-email"];
  const rolesHeader = req.headers["x-user-roles"];

  if (!userId || !userEmail) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  let roles = [];

  try {
    roles = rolesHeader ? JSON.parse(rolesHeader) : [];
  } catch (err) {
    roles = [];
  }

  req.user = {
    id: userId,
    email: userEmail,
    roles,
  };

  next();
};

module.exports = auth;