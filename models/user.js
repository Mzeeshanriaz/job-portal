'use strict';
const mongoose = require('mongoose');

const Schema = mongoose.Schema;
var schema = new Schema({
  username: {
    type: String,
    unique: true,
  },
});
module.exports = mongoose.model('User', schema);

