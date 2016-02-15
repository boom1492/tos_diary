'use strict';

var mongoose = require('bluebird').promisifyAll(require('mongoose'));

var ObjectId = mongoose.Schema.ObjectId;

var CharacterSchema = new mongoose.Schema({
  name: String,
  userId: ObjectId
});

export default mongoose.model('Character', CharacterSchema);
