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
  repeatCnt: Number,
  description: String,
  Object: String,
  connectedQuests: [{type: ObjectId, ref: 'Quest'}],
  preQuests: [{type: ObjectId, ref: 'Quest'}]
});

export default mongoose.model('Quest', QuestSchema);
