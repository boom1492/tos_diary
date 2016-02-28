'use strict';

var mongoose = require('bluebird').promisifyAll(require('mongoose'));

var ExpCardSchema = new mongoose.Schema({
  level: Number,
  baseExp: Number,
  classExp: Number
});

export default mongoose.model('exp-card', ExpCardSchema);
