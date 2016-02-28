'use strict';

var mongoose = require('bluebird').promisifyAll(require('mongoose'));

var ClassExpSchema = new mongoose.Schema({
  level: Number,
  rank: Number,
  required: Number,
  totalRequired: Number
});

export default mongoose.model('class-exp', ClassExpSchema);
