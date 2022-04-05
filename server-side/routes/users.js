const express = require("express");
const router = express.Router();
const { User } = require("../models/User");

const { auth } = require("../middleware/auth");
const otpGenerator = require('otp-generator');
const nodemailer = require('../config/nodemailer.config');

const bcrypt = require("bcrypt");
// The numebr of letters to encrypt
const saltRounds = 10;

router.get("/auth", auth, (req, res) => {
  res.status(200).json({
    _id: req.user._id,
    isAdmin: req.user.role === 0 ? false : true,
    isAuth: true,
    email: req.user.email,
    name: req.user.name,
    lastname: req.user.lastname,
    role: req.user.role,
    image: req.user.image,
  });
});

router.post("/register", (req, res) => {
  const user = new User(req.body);

  user.save((err, doc) => {
    if (err) return res.json({ success: false, err });
    return res.status(200).json({
      success: true,
      pass: user.password
    });
  });
});

router.post("/login", (req, res) => {
  User.findOne({ email: req.body.email }, (err, user) => {
    if (!user)
      return res.json({
        loginSuccess: false,
        message: "Auth failed, email not found",
      });

    user.comparePassword(req.body.password, (err, isMatch) => {
      if (!isMatch)
        return res.json({ loginSuccess: false, message: "Wrong password" });

      user.generateToken((err, user) => {
        if (err) return res.status(400).send(err);
        res.cookie("w_authExp", user.tokenExp);
        res.cookie("w_auth", user.token).status(200).json({
          loginSuccess: true,
          userId: user._id,
        });
      });
    });
  });
});

router.get("/logout", auth, (req, res) => {
  User.findOneAndUpdate(
    { _id: req.user._id },
    { token: "", tokenExp: "" },
    (err, doc) => {
      if (err) return res.json({ success: false, err });
      return res.status(200).send({
        success: true,
      });
    }
  );
});

// To getOTP to a valid user
router.post('/getOTP', async (req, res) => {
  try {
    // To check a this email is present in database or not
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      // If user Not exist send message Wrong Credential
      res.status(400).json({ success: false, message: 'Wrong credential' })
    }

    // To generate OTP 
    const OTP = otpGenerator.generate(6, {
      upperCaseAlphabets: true,
      specialChars: true,
    });

    // To Send a email to the user
    nodemailer.sendConfirmationEmail(req.body.email, req.body.email, OTP);

    // Get OTP to check with the user
    res.status(200).send({ success: true, OTP });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Some error' })
  }
})


router.put('/changePass', async (req, res) => {
  try {

    // To check a this email is present in database or not
    let user = await User.findOne({ email: req.body.email });
    if (!user) {
      res.status(400).json({ success: false, message: 'Wrong credential' })
    }
    user.password = req.body.password

    // To hash the user password or to secure the user password
    bcrypt.genSalt(saltRounds, function (err, salt) {
      bcrypt.hash(user.password, salt, async(err, hash) =>{
        if(err){
          res.status(400).json({ success: false, message: err })
        }
        user = await User.findOneAndUpdate({ email: req.body.email }, { $set: { password: hash } });
        return res.status(200).json({success:true, message: "Password has changed successfully"})
      });
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Some error' })
  }
})

module.exports = router;
