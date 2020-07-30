'use strict';
const mongoose = require('mongoose');

const Schema = mongoose.Schema;
var officeSchema = new Schema({
  name: {
    type: String,
    unique: true,
  },
  users: [
    {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }]
});
module.exports = mongoose.model('Office', officeSchema);

