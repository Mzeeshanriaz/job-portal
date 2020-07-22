var express = require('express');
var User = require('../models/user');
var PostModel = require('../models/post');
var Tag = require('../models/tag');
var router = express.Router();
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
router.post('/post/:post/tags',[
], function(req, res, next) {
  let post = PostModel.findOne({_id:req.params.post}).then(result=> {
    if(!result._id) {
      res.status(422).json({error: 'Given Post Not Exist'});
    } else {
      PostModel.findOneAndUpdate({ _id: result._id }, {$set: {tags: []}}, { new: true }).exec();
      req.body.tags.forEach(t => {
        PostModel.findOneAndUpdate({ _id: result._id }, {$push: {tags: t}}, { new: true }).exec();
        Tag.findOneAndUpdate({ _id: t }, {$pull: {posts: result._id}}, { new: true }).exec();  
        Tag.findOneAndUpdate({ _id: t }, {$push: {posts: result._id}}, { new: true }).exec();  
      });
      res.status(200).json({data: result});
    }
  }).catch(err => {
    res.status(500).json({error: err});
  })
});

router.get('/tags',[
], function(req, res, next) {
  Tag.find().then(results => {
    res.status(200).json({result: results});
  }).catch(err => {
    res.status(422).json({error: err});
  })
});
router.post('/tags',[
], function(req, res, next) {
  let checking = Tag.find({title: req.body.title}).then(resultFound => {
    if(resultFound.length == 0) {
      let newTag = Tag({title: req.body.title}).save().then(result => {
        res.status(200).json({result: result});
      }).catch(err => {
        res.status(401).json({error: err});
      })  
    } else {
      res.status(422).json({error: req.body.title + 'Tag already Exist'});
    }
  })
});

router.post('/users/create',[
], function(req, res, next) {
  var alreadyExistUserName = false;
  let checking = User.find({username: req.body.username}).then( result => {
    if(result && result.length > 0) {
      res.status(422).json({message : 'User Name Already Exist'});  
    } else {
      const newUser = User(req.body).save().then(result => {
        res.status(200).json({result: result});
      })
      .catch(err => {
        res.status(401).json({error: err});
      }); 

    }
  });
});
router.get('/posts',[
], function(req, res, next) {
  PostModel.find({}).populate('user', '-posts').then(result => {
      res.status(200).json({data: result});
  }).catch(err2 => {
      res.status(422).json({errors: 'User Not Found'});
  });
});

router.get('/users',[
], function(req, res, next) {
  User.find({}).populate('posts').then( result => {
    res.status(200).json({data:result});
  });
});
router.put('/users/:id',[
], function(req, res, next) {
  User.findOneAndUpdate(req.params.id, {username: req.body.username}, {new:true}).then(result => {
    res.status(200).json({data:result});
  }).catch(err => {
    res.status(422).json({error:err});

  });
});
router.post('/users/:id/post',[
], function(req, res, next) {
  User.findById(req.params.id).then(result => {
      req.body['user'] = result._id;
      const newPost = PostModel(req.body).save().then(resultPost => {
        User.findOneAndUpdate({ _id: req.params.id }, {$push: {posts: resultPost._id}}, { new: true }).exec();
        res.status(200).json({data: resultPost});
      }).catch(err => {
        res.status(500).json({data: err});
      });
  }).catch(err => {
    res.status(422).json({error: 'User not Found'});
  })
    });

module.exports = router;
