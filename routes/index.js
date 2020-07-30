var express = require('express');
var User = require('../models/user');
var Office = require('../models/office');
var PostModel = require('../models/post');
var Tag = require('../models/tag');
const { db } = require('../models/user');
const { ObjectId } = require('mongodb');
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

router.get('/offices', function(req, res, next) {
  Office.find().populate('users').then(results=>{
    res.status(200).json({result: results});
  })
});
router.post('/offices', function(req, res, next) {
  let office = Office(req.body).save().then(result => {
    res.status(200).json({result: result});
  }).catch(err => {
    res.status(422).json({error: err});
  });
});
const tokenCheck = function(req, res, next) {
  if(!req.headers.hasOwnProperty('authorization') ) {
    return res.status(402).json({error: 'Authorization not Exist on header'});
  }
  next();
};
router.get('/tags',[tokenCheck
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
    router.get('/get-users-using-tag/:tagId',[], function(req, res, next) {
      PostModel.aggregate([
      {
        $match: {tags: ObjectId(req.params.tagId)}
      },
      
      {
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "_id",
          as: "user"
        }
      },
      {
        $project:{
          "user": {
            "posts":0,
            __v: 0
          },
          _id:0
        }
      },  
    {$unwind: "$user"},
    ]).exec((err, results) => {
      if (err) throw err;
      let arr = [];
      Object.keys(results).forEach(k => {
        arr.push(results[k]['user']);
      })
      return res.status(200).json({data: arr});
      })
    });
    
    router.get('/get-tags-used-by-user/:userId',[], function(req, res, next) {
      PostModel.aggregate([
      {
        $match: {user: ObjectId(req.params.userId)}
      },
      
      {
        $lookup: {
          from: "tags",
          localField: "tags",
          foreignField: "_id",
          as: "tags"
        }
      },
      {
        $project:{
          "tags": {
            "posts":0,
            __v: 0
          },
          _id:0
        }
      },  
    {$unwind: "$tags"},
    ]).exec((err, results) => {
      if (err) throw err;
      let arr = [];
      Object.keys(results).forEach(k => {
        arr.push(results[k]['tags']);
      })
      return res.status(200).json({data: arr});
      })
    });
    router.get('/offices-users-having-posts', function(req, res, next) {
      PostModel.aggregate([
        {
          $lookup: {
            from: "users",
            localField: "user",
            foreignField: "_id",
            as: "user"
          }
        },
        {
          $lookup: {
            from: "offices",
            localField: "offices",
            foreignField: "_id",
            as: "offices"
          }
        },
  
      ]).exec((err,results) => {
        return res.status(200).json({data: results});

      })
    });
    
module.exports = router;
