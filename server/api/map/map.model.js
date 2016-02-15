'use strict';

var mongoose = require('bluebird').promisifyAll(require('mongoose'));

var MapSchema = new mongoose.Schema({
  mapName: String,
  level: Number,
  imgUrl: String
});

export default mongoose.model('Map', MapSchema);
