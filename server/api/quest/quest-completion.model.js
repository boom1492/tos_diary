'use strict';

var mongoose = require('bluebird').promisifyAll(require('mongoose'));
var ObjectId = mongoose.Schema.ObjectId;

var QuestCompletionSchema = new mongoose.Schema({
  questId: {type: ObjectId, ref: 'Quest'},
  userId: {type: ObjectId, ref: 'User'},
  mapId: {type: ObjectId, ref: 'Map'},
  timestamp: Date
});

export default mongoose.model('quest-completion', QuestCompletionSchema);
