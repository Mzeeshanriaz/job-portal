
'use strict';

const mongoose = require('mongoose');

const schema = mongoose.Schema;

var tagSchema = new schema({
    tag : {
        type: mongoose.Schema.Types.ObjectId,
        ref : 'Tag'
    },
    post : {
        type: mongoose.Schema.Types.ObjectId,
        ref : 'Post'
    }
});

module.exports = mongoose.model('PostTag', tagSchema);