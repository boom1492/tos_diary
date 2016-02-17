'use strict';

var mongoose = require('bluebird').promisifyAll(require('mongoose'));
var ObjectId = mongoose.Schema.ObjectId;

var CommentSchema = new mongoose.Schema({
  author: {type: ObjectId, ref: 'User'},
  message: String,
  written: Date,
  mapId: {type: ObjectId, ref: 'Map'}
});

export default mongoose.model('Comment', CommentSchema);
