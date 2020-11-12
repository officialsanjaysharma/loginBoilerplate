const express = require('express');
const nodemailer = require("nodemailer");
const router = express.Router();
const { authMiddleWare } = require("../middleware/auth");
const userSchema = require('../model/user');
const jwt = require('jsonwebtoken');
const config = require("../config");

const getUsers = (req, res, next) => {
  userSchema
    .find({})
    .then(data => {
      if (data) {
        res.status(200).send({ data });
        res.end();
      } else {
        res.status(401).json({ error: "Unauthorised" });
        res.end();
      }
    })
}

const verifyUser = (req, res, next) => {
  res.status(200).json({ data: "authorised" })
}

const Login = (req, res, next) => {
  userSchema
    .find({ email: req.body.email })
    .then(data => {
      if (data) {
        if (data.length) {
          if (data[0].password === req.body.password) {
            let token = jwt.sign({ status: "verified", email: data[0].email }, config.privateKeyForAuth);
            res.cookie('jwt', token, { maxAge: 3600000 })
            res.status(200).json({ data: "authorised" });
          }
          else
            res.status(401).json({ error: "Incorrect Password" });
        }
        else
          res.status(500).json({ error: 'User does not exist' })
        res.end();
      } else {
        res.status(500).json({ error: "Error in getting data" });
        res.end();
      }
    }).catch(e => res.status(500).json({ error: "Error in getting data" }))
}

const addUser = (req, res, next) => {
  userSchema
    .create(req.body)
    .then(response => {
      if (response) {
        let token = jwt.sign({ status: "verified", email: data[0].email }, config.privateKeyForAuth);
        res.cookie('jwt', token, { maxAge: 3600000 })
        res.status(200).json({ data: "Successfully Registered" });
      } else {
        res.status(500).status({ error: 'Failed to register user' })
      }
    }).catch(err => {
      console.log("Error", err.message)
      res.status(500).json({ error: 'User already exist' })
    })
}

const updateUser = (req, res, next) => {
  userSchema
    .findOneAndUpdate({ email: req.body.email }, { $set: req.body }, { new: true })
    .then(response => {
      if (response) {
        res.status(200).json({ data: 'Successfuly Updated' })
      } else {
        res.status(500).json({ error: 'Failed to update user' })
      }
    }).catch(e => res.status(500).json({ error: 'Failed to update user' }))
}
const deleteUser = (req, res, next) => {
  userSchema
    .deleteOne({ email: req.body.email })
    .then(response => {
      if (response) {
        if (response.deletedCount > 0)
          res.status(200).json({ data: 'Successfuly Deleted' })
        else
          res.status(500).json({ error: 'User does not exit' })
      } else {
        res.status(500).json({ error: 'Failed to Delete user' })
      }
    }).catch(e => res.status(500).json({ error: 'Failed to Delete user' }))
}
const forgotPassword = async (req, res, next) => {
  console.log(req.body)
  userSchema
    .find({ email: req.body.email })
    .then((data) => {
      console.log(data[0].email)
      if (data) {
        if (data[0] && data[0].email && data[0].email.length) {
          console.log(data)
          var token = jwt.sign({
            exp: Math.floor(Date.now() / 1000) + (60 * 60),
            status: 'valid',
            email: req.body.email
          }, config.privateKeyForForgotPassword);
          let transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
              user: config.gmailId, // generated ethereal user
              pass: config.gmailPassword, // generated ethereal password
            },
          });
          let info = transporter.sendMail({
            from: 'sanjaysharmarockstar@gmail.com', // sender address
            to: `${req.body.email}`, // list of receivers
            subject: "Reset Password", // Subject line
            text: "Reset Password", // plain text body
            html: `<b>Hello, Please click on the link to reset password http://localhost:3001/reset/password/${token} Link will be live only for 2 hours.</b>`, // html body
          });
          res.status(200).send({ data: "Success" });
        } else {
          res.status(500).send({ data: "User Not found" })
        }
      }
    })
}
const verifyResetToken = (req, res) => {
  if (req.body.token) {
    jwt.verify(req.body.token, config.privateKeyForForgotPassword, function (err, decoded) {
      if (err) {
        res.status(500).json({ error: "Link expired" });
      } else {
        res.status(200).json({ data: "verified" })
      }
    })
  } else {
    res.status(401).send({ "error": "Illegal access" })
  }
}
const resetToken = async (req, res) => {
  if (req.body.token) {
    await jwt.verify(req.body.token, config.privateKeyForForgotPassword, async function (err, decoded) {
      if (err) {
        res.status(500).json({ error: "Link expired" });
      } else {
        console.log(decoded)
        await userSchema
          .findOneAndUpdate({ email: decoded.email }, { $set: { password: req.body.password } }, { new: true, useFindAndModify: false })
          .then(response => {
            console.log(response)
            if (response) {
              res.status(200).json({ data: 'Password changed successfully' })
            } else {
              res.status(500).json({ error: 'Failed to change password' })
            }
          }).catch(e => {
            console.log(e)
            res.status(500).json({ error: 'Failed to change password' })
          })
      }
    })
  } else {
    res.status(401).send({ "error": "Illegal access" })
  }
}

router.get('/', authMiddleWare, getUsers);
router.get('/verify', authMiddleWare, verifyUser);
router.post('/login', Login);
router.post('/', addUser);
router.put('/', authMiddleWare, updateUser);
router.delete('/', authMiddleWare, deleteUser);
router.post('/verifyresettoken', verifyResetToken);
router.post('/forgotpassword', forgotPassword);
router.post('/resetpassword', resetToken);


module.exports = router;
