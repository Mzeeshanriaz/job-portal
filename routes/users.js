var express = require('express');
var router = express.Router();
var User = require('../models/user');
var Post = require('../models/post');

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
router.get('/posts', function(req, res, next) {
  const all = Post.find({}).populate('user').then(result => {
    return res.status(200).json({data: result});
  });
});
router.get('/store', function(req, res, next) {
  const user = new User({
    username: 'zeeshan 97'
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

module.exports = router;
