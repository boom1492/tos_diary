'use strict';

var mongoose = require('bluebird').promisifyAll(require('mongoose'));

var ObjectId = mongoose.Schema.ObjectId;

var BaseExpSchema = new mongoose.Schema({
  level: Number,
  required: Number,
  totalRequired: Number
});

export default mongoose.model('base-exp', BaseExpSchema);
