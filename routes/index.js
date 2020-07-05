var express = require('express');
var User = require('../models/user');
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

module.exports = router;
