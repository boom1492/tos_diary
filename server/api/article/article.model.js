'use strict';

var mongoose = require('bluebird').promisifyAll(require('mongoose'));
var ObjectId = mongoose.Schema.ObjectId;

var ArticleSchema = new mongoose.Schema({
  author: {type: ObjectId, ref: 'User'},
  written: Date,
  title: String,
  contents: String,
  category: String
});

export default mongoose.model('Article', ArticleSchema);
