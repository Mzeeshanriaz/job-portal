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
    }
});

module.exports = mongoose.model('Post', postSchema);