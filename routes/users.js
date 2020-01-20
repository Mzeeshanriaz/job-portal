var express = require('express');
var router = express.Router();
var User = require('../models/user');
var Post = require('../models/post');
var Tag = require('../models/tag');
var PostTagPivot = require('../models/post_tag_pivot');

/* GET users listing. */
router.get('/', function(req, res, next) {
  User.aggregate([
    {
    $lookup: {
      from : "posts",
      localField: "_id",
      foreignField: "user",
      as: "posts"

    }
  }]).then(re => {
    return res.status(200).json({data: re});
  })
  /*
  const all = User.find({}).populate('posts').exec().then(result => {
    return res.status(200).json({data: result});
  });
  */
});
// get posts
router.get('/posts', function(req, res, next) {
  const all = Post.find({}).populate('user').then(result => {
    return res.status(200).json({data: result});
  });
});
// store new user with new post 
router.get('/store', function(req, res, next) {
  const user = new User({
    username: 'zeeshan 99'
  }).save().then(result => {
    console.log(result);
    const post = new Post({
      title: 'p 1',
      user: result._id
    }).save().then(resu => {
      console.log(resu);
    })

  });
  res.send(user);
});
// new tag
router.get('/tags/store', function(req, res, next) {
  console.log('result');
  var arr = [];
  // arr.push('5e120cbc26825810d899df0f');
  const  tag = new Tag({
    title: 'my book'
  }).save().then(result => {
    return res.status(200).json(result)
  }); 
});
// all tags having posts 
router.get('/tags', function(req, res, next) {
  Tag.find({'posts.0': {"$exists": true}}).populate('posts').then(result => {
    return res.status(200).json(result);
  })
});
router.get('/post-tag-pivot', function(req, res, next) {
  const ptp = new PostTagPivot({
    post: '5e1de0890c0c1104b4c845ee',
    tag: '5e1ddff441b8040bb0bc1d0f'
  }).save().then(result => {
    return res.status(200).json(result)
  });
});
router.get('/get-post-tag-pivot', function(req, res, next) {
  PostTagPivot.find()
  .populate({
    path: 'post',
  })
  .populate({
    path: 'tag',
    match: { title: 'my book' },
    select: 'title',
  })
  .then(re => {
    return res.status(200).json({data: re});
  }).catch(err => {
    return res.status(200).json({error : err})
  })

});

module.exports = router;
