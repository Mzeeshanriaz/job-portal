
'use strict';

const mongoose = require('mongoose');

const schema = mongoose.Schema;

var tagSchema = new schema({
    title : {
        type: String,
    },
    posts: [
        {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post'
      }]  
});

module.exports = mongoose.model('Tag', tagSchema);