var express = require('express');
var router = express.Router();
var User = require('../models/user');

/* GET users listing. */
router.get('/', function(req, res, next) {
  const all = User.find({}).then(result => {
    return res.status(200).json({data: result});
  });
});
router.get('/store', function(req, res, next) {
  const user = new User({
    username: 'zeeshan'
  }).save();
  res.send(user);
});

module.exports = router;
