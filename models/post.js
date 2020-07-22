'use strict';

const mongoose = require('mongoose');

const schema = mongoose.Schema;

var postSchema = new schema({
    title : {
        type: String,
    },
    user : {
        type: mongoose.Schema.Types.ObjectId,
        ref : 'User'
    },
    tags: [
      {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Tag'
    }]
});

module.exports = mongoose.model('Post', postSchema);