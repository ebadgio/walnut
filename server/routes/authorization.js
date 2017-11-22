// Add Passport-related auth routes here.
const express = require('express');
const models = require('../models/models');
const User = models.User;
// const Post = models.Post;
const router = express.Router();
const path = require('path');
const CryptoJS = require("crypto-js");

const adminApp = require('../firebaseAdmin').admin;

const defaultAvatars = [
    "https://s3-us-west-1.amazonaws.com/walnut-test/defaultAvatar1.png",
    "https://s3-us-west-1.amazonaws.com/walnut-test/defaultAvatar2.png",
    "https://s3-us-west-1.amazonaws.com/walnut-test/defaultAvatar3.png",
    "https://s3-us-west-1.amazonaws.com/walnut-test/defaultAvatar4.png",
    "https://s3-us-west-1.amazonaws.com/walnut-test/defaultAvatar5.png",
    "https://s3-us-west-1.amazonaws.com/walnut-test/defaultAvatar6.png"
];

router.post('/signup', function (req, res) {
  // console.log('req.body.token', req.body.token);
  // console.log('adminApp', adminApp);
  // req.session.userToken = req.body.token;
  //console.log('req.session.userToken', req.session.userToken);
  adminApp.auth().verifyIdToken(req.body.token)
    .then(function (decodedToken) {
      const uid = decodedToken.uid;
      const new_user = new User({
        firebaseId: uid,
        fullName: req.body.fname + ' ' + req.body.lname,
        username: req.body.username,
        portfolio: [
          { name: 'media', data: [] },
          { name: 'documents', data: [] },
          { name: 'code', data: [] },
          { name: 'design', data: [] }
        ],
        contact: {
          phones: [],
          email: [req.body.email]
        },
        communities: [],
        pictureURL: defaultAvatars[Math.floor(Math.random() * 6)],
        isEdited: true
      });
      return new_user.save()
        .then((doc) => {
          // const token = CryptoJS.AES.encrypt(doc._id.toString(), 'secret').toString();
            const opts = [
                { path: 'communities' },
                { path: 'currentCommunity' },
                { path: 'currentCommunity.admins' },
                { path: 'currentCommunity.defaultTags' },
                { path: 'currentCommunity.users' }
            ];
            return User.populate(doc, opts)
                .then((pop) => {
                    console.log('set session');
                    req.session.userMToken = pop._id;
                    req.user = pop;
                    res.send({ success: true, user: pop });
                })
        })
        .catch((err) => {
          console.log('reg err', err);
        })
    }).catch(function (error) {
      // Handle error
      console.log('error with admin auth', error);
    });
});

router.post('/login', function (req, res) {
  // req.session.userToken = req.body.token;
  adminApp.auth().verifyIdToken(req.body.token)
    .then(function (decodedToken) {
      const uid = decodedToken.uid;
      return User.findOne({ firebaseId: uid })
        .then((user) => {
          user.password = req.body.password;
          return user.save();
        })
        .then((doc) => {
          const opts = [
            { path: 'communities' },
            { path: 'currentCommunity' },
            { path: 'currentCommunity.admins' },
            { path: 'currentCommunity.defaultTags' },
            { path: 'currentCommunity.users' }
          ];
          return User.populate(doc, opts)
            .then((populated) => {
              // const token = CryptoJS.AES.encrypt(populated._id.toString(), 'secret').toString();
              req.session.userMToken = populated._id;
              req.session.save((err) => { console.log('session save error', err); });
              console.log('req.session token', req.session.userMToken);
              req.user = populated;
              res.send({ success: true, user: populated });
            })
        })
        .catch((err) => {
          console.log(err);
        })
    }).catch(function (error) {
      // Handle error
      console.log('error with admin auth', error);
    });
});

router.post('/facebook', function (req, res) {
  req.session.userToken = req.body.token;
  adminApp.auth().verifyIdToken(req.body.token)
    .then(function (decodedToken) {
      const uid = decodedToken.uid;
      res.status(200);
    }).catch((error) => {
      console.log('error', error);
    })
});

router.get('/userinreq', (req, res) => {
  console.log('req.user', req.user);
  res.json({ success: true })
});

module.exports = router;
