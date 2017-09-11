import express from 'express';
import multer from 'multer';
import AWS from 'aws-sdk';
import multerS3 from 'multer-s3';
// TODO user models with new db layout
import {User, Post, Tag, Community} from '../models/models';
import Promise from 'promise';

AWS.config.update(
  {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  });

const router = express.Router();
// Amazon s3 config
const s3 = new AWS.S3();

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: 'walnut-test',
    contentType: multerS3.AUTO_CONTENT_TYPE,
    acl: 'public-read',
    // metadata: (req, file, cb) => {
    //   cb(null, { fieldName: file.fieldname });
    // },
    key: (req, file, cb) => {
      cb(null, req.user._id + Date.now().toString() + file.originalname);
    }
  })
});

router.post('/upload/profile', upload.single('profile'), (req, res) => {
  console.log('this is the profile pic from the upload', req.file);
  User.findById(req.user._id)
    .then((user) => {
      const url = req.file.location;
      user.pictureURL = url;
      return user.save();
    })
    .then((user) => {
      console.log('end of upload', user);
      res.json({url: user.pictureURL});
    })
    .catch((error) => console.log('error in aws db save', error));
});

router.post('/upload/community', upload.single('community'), (req, res) => {
  console.log('inside the aws backend', typeof(req.body.otherTags), req.file);
  let tags;
  if (!req.body.otherTags) {
    tags = [];
    console.log('no tags', tags);
  } else if (typeof(req.body.otherTags) === 'string') {
    tags = [req.body.otherTags];
    console.log('1 tag', tags);
  } else {
    tags = req.body.otherTags;
  }
  let userEnd;
  let commEnd;
  const tagModels = tags.map((filter) =>
    new Tag({
      name: filter
    })
  );
  Promise.all(tagModels.map((tag) => tag.save()))
    .then((values) => {
      const community = new Community({
        title: req.body.title,
        users: [req.user._id],
        admins: [req.user._id],
        icon: req.file.location,
        otherTags: values.map((val) => val._id),
        defaultTags: []
      });
      return community.save();
    })
    .then((community) => {
      commEnd = community;
      return User.findById(req.user._id);
    })
    .then((user) => {
      user.communities.push(commEnd._id);
      user.currentCommunity = commEnd._id;
      const pref = {
        community: `${commEnd._id}`,
        pref: []
      };
      user.preferences.push(pref);
      user.markModified('preferences');
      return user.save();
    })
    .then((savedUser) => {
      const opts = [
        { path: 'communities' },
        { path: 'currentCommunity' },
        {
          path: 'currentCommunity',
          populate: { path: 'admins defaultags users' }
        }
      ];
      return User.populate(savedUser, opts);
    })
    .then((userSave) => {
      userEnd = userSave;
      return Community.find();
    })
    .then((communities) => {
      console.log('made it to the end of the backend before response');
      res.json({ user: userEnd, communities: communities });
    })
    .catch((err) => {
      console.log('got error', err);
      res.json({ error: err });
    });
});

router.post('/upload/post', upload.single('attach'), (req, res) => {
  console.log('upload', req.file);
  console.log(req.body);
  // console.log(JSON.parse(req.body.tags));
  console.log('thththththththththt', req.body.lastRefresh);
  let newTags;
  let newt;
  let tags;
  let savedTags;
  if (req.body.newTags) {
    if (typeof req.body.newTags === 'object') {
      newTags = req.body.newTags;
    } else {
      newTags = [req.body.newTags];
    }
  } else {
    newTags = [];
  }
  const tagModels = newTags.map((filter) =>
    new Tag({
      name: filter
    })
  );
  if (req.body.tags) {
    if (typeof req.body.tags === 'object') {
      tags = req.body.tags;
    } else {
      tags = [req.body.tags];
    }
  } else {
    tags = [];
  }
  Promise.all(tagModels.map((tag) => tag.save()))
  .then((values) => {
    newt = values.map((v) => v._id);
    savedTags = newt.concat(tags);
    const newPost = new Post({
      content: req.body.body,
      createdAt: new Date(),
      createdBy: req.user._id,
      likes: [],
      tags: savedTags,
      comments: [],
      commentNumber: 0,
      community: req.user.currentCommunity,
      link: '',
      attachment: {
        name: req.body.name ? req.body.name : req.file.originalname,
        url: req.file.location,
        type: req.file.mimetype,
      }
    });
    return newPost.save();
  })
  .then((post) => {
    console.log(post);
    let posts = [];
    let filters;
    if (req.body.useFilters) {
      if (typeof req.body.useFilters === 'object') {
        filters = req.body.useFilters;
      } else {
        filters = [req.body.useFilters];
      }
    } else {
      filters = [];
    }
    let filter;
    if (filters.length > 0) {
      filter =  { tags: { $in: filters }, community: req.user.currentCommunity, createdAt: { $gte: new Date(req.body.lastRefresh) } };
    } else {
      filter = {community: req.user.currentCommunity, createdAt: { $gte: new Date(req.body.lastRefresh) }};
    }
    Post.find(filter)
    .sort({ createdAt: -1 })
    .populate('tags')
    .populate('comments')
    .populate('comments.createdBy')
    .populate('createdBy')
    .then((postArr) => {
      posts = postArr.map((postObj) => {
        return {
          postId: postObj._id,
          username: postObj.createdBy.fullName,
          pictureURL: postObj.createdBy.pictureURL,
          content: postObj.content,
          createdAt: postObj.createdAt,
          tags: postObj.tags,
          likes: postObj.likes,
          commentNumber: postObj.commentNumber,
          link: postObj.link,
          attachment: postObj.attachment,
          comments: postObj.comments.map((commentObj) => {
            return {
              commentId: commentObj._id,
              username: commentObj.createdBy.username,
              pictureURL: commentObj.createdBy.pictureURL,
              content: commentObj.content,
              createdAt: commentObj.createdAt,
              likes: commentObj.likes
            };
          })
        };
      });
      return Community.findById(req.user.currentCommunity);
    })
    .then((com) => {
      com.otherTags = com.otherTags.concat(newt);
      return com.save();
    })
    .then((result) => {
      console.log(posts);
      res.json({ posts: posts, lastRefresh: new Date(), otherTags: result.otherTags});
    })
    .catch((er) => {
      console.log('eror in aws save fetching recent posts', er);
      res.json(er);
    });
  })
  .catch((error) => console.log('error in aws db save', error));
});

router.post('/upload/comment', upload.single('attach'), (req, res) => {
  console.log('upload', req.file);
  const attachment = {
    name: req.file.originalname,
    url: req.file.location,
    type: req.file.mimetype,
  };
  res.json({attachment: attachment});
});


module.exports = router;
