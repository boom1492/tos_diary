'use strict';

var mongoose = require('bluebird').promisifyAll(require('mongoose'));
var ObjectId = mongoose.Schema.ObjectId;

var QuestSchema = new mongoose.Schema({
  questName: String,
  level: Number,
  mapId: ObjectId,
  npcName: String,
  type: Number,
  detailsUrl: String,
  compensations: [],
  repeatCnt: Number
});

export default mongoose.model('Quest', QuestSchema);
