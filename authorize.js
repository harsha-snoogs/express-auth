function authorizeRole(allowedRoles) {
  return (req, res, next) => {

    if(!req.user){
      res.status(401).json({
        message: "Authetication required"
      })
    }
    const role = req.user.role;
    if (allowedRoles.includes(role)) {
      next();
    } else {
      res.status(403).json({
        message: "Forbidden access",
      });
    }
  };
}

module.exports = authorizeRole;
