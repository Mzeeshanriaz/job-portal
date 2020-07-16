var express = require('express');
var User = require('../models/user');
const PostModel = require('../models/post');
var router = express.Router();
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
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
  PostModel.find({}).then(result => {
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
router.post('/users/:id/post',[
], function(req, res, next) {
  User.findById(req.params.id).then(result => {
      req.body['user'] = result._id;
      const newPost = PostModel(req.body).save().then(resultPost => {
        res.status(200).json({data: resultPost});
      }).catch(err => {
        res.status(500).json({data: err});
      });
  }).catch(err => {
    res.status(422).json({error: 'User not Found'});
  })
    });

module.exports = router;
