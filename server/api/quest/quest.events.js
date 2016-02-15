/**
 * Quest model events
 */

'use strict';

import {EventEmitter} from 'events';
var Quest = require('./quest.model');
var QuestEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
QuestEvents.setMaxListeners(0);

// Model events
var events = {
  'save': 'save',
  'remove': 'remove'
};

// Register the event emitter to the model events
for (var e in events) {
  var event = events[e];
  Quest.schema.post(e, emitEvent(event));
}

function emitEvent(event) {
  return function(doc) {
    QuestEvents.emit(event + ':' + doc._id, doc);
    QuestEvents.emit(event, doc);
  }
}

export default QuestEvents;
