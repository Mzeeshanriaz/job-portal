
'use strict';

const mongoose = require('mongoose');

const schema = mongoose.Schema;

var tagSchema = new schema({
    title : {
        type: String,
    }
});

module.exports = mongoose.model('Tag', tagSchema);