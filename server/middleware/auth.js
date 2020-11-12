const jwt = require("jsonwebtoken");
const config = require("../config");
exports.authMiddleWare = function (req, res, next) {
  let token;
  if (req.headers && req.headers.authorization && req.headers.authorization.split(' ')[1]) {
    if (req.headers.authorization.split(' ')[1] === "undefined") token = ""
    else
      token = req.headers.authorization.split(' ')[1];
  } else {
    token = ""
  }
  if (token) {
    jwt.verify(token, config.privateKeyForAuth, (err) => {
      console.log("err", err)
      if (err) {
        res.status(401).json({ error: "Forbidden" })
      }
      next();
    })
  } else {
    res.status(401).json({ error: "Forbidden" })
  }
}