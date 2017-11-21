const express = require('express');
const router = express.Router();
const User = require('../../models/models').User;
const Post = require('../../models/models').Post;
const Community = require('../../models/models').Community;

router.post('/location', (req, res) => {
  User.findById(req.user._id)
      .then((response) => {
        response.location.live = req.body.location;
        return response.save();
      })
      .then((resp) => {
        res.json({success: true});
      })
      .catch((err) => {
        res.json({success: false});
      });
});

router.post('/user', (req, res) => {
  User.findById(req.user._id)
      .then((user) => {
        user.preferences = req.body.data.preferences;
        return user.save();
      })
      .then((savedUser) => {
        const opts = [
          { path: 'communities'},
          { path: 'currentCommunity'},
          { path: 'currentCommunity.admins'},
          { path: 'currentCommunity.defaultTags'},
          { path: 'currentCommunity.users'}
        ];
        return User.populate(savedUser, opts);
      })
      .then((populatedUser) => {
        res.json({success: true, data: populatedUser});
      })
      .catch((err) => {
        res.json({success: false});
      });
});

router.post('/portfoliotabs', (req, res) => {
  User.findById(req.user._id)
      .then((user) => {
        const obj = {
          data: [],
          name: req.body.data
        };
        user.portfolio.push(obj);
        return user.save();
      })
      .then((user) => {
        res.json({success: true});
      })
      .catch((err) => {
        res.json({success: false});
      });
});

router.post('/changeportfoliotabs', (req, res) => {
  User.findById(req.user._id)
      .then((user) => {
        user.portfolio[req.body.index].name = req.body.name;
        user.markModified('portfolio');
        return user.save();
      })
      .then((user) => {
        res.json({success: true});
      })
      .catch((err) => {
        res.json({success: false});
      });
});

router.post('/removeportfoliotabs', (req, res) => {
  User.findById(req.user._id)
      .then((user) => {
        let index = - 1;
        for(let i = 0; i < user.portfolio.length; i += 1) {
          if(user.portfolio[i].name === req.body.tab) {
            index = i;
          }
        }
        if(index > - 1) {
          user.portfolio[index].data.splice(req.body.index, 1);
          user.markModified('portfolio');
          return user.save();
        }
        return null;
      })
      .then((user) => {
        res.json({success: true});
      })
      .catch((err) => {
        res.json({success: false});
      });
});

router.post('/community', (req, res) => {
  console.log('data', req.body.title);
  console.log('data', req.body.image);
  console.log('data', req.body.users);
  console.log('data', req.body.admins);
  Community.findById(req.user.currentCommunity)
    .then((community) => {
      community.title = req.body.title;
      community.image = req.body.image;
      community.users = req.body.users;
      community.admins = req.body.admins;
      return community.save();
    })
    .then(() => {
      User.findById(req.user._id)
        .then((user) => {
          const opts = [
            { path: 'communities' },
            { path: 'currentCommunity' },
            {
              path: 'currentCommunity',
              populate: { path: 'admins defaultags users' }
            }
          ];
          return User.populate(user, opts);
        })
        .then((userSave) => {
          res.json({ success: true, user: userSave });
        });
    })
    .catch((err) => {
      console.log('got error', err);
      res.json({error: err});
    });
});


module.exports = router;
