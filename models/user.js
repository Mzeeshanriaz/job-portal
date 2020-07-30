'use strict';
const mongoose = require('mongoose');

const Schema = mongoose.Schema;
var userSchema = new Schema({
  username: {
    type: String,
    unique: true,
  },
  posts: [
    {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post'
  }],
  offices: [
    {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Office'
  }]
});
module.exports = mongoose.model('User', userSchema);

