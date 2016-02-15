/**
 * Map model events
 */

'use strict';

import {EventEmitter} from 'events';
var Map = require('./map.model');
var MapEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
MapEvents.setMaxListeners(0);

// Model events
var events = {
  'save': 'save',
  'remove': 'remove'
};

// Register the event emitter to the model events
for (var e in events) {
  var event = events[e];
  Map.schema.post(e, emitEvent(event));
}

function emitEvent(event) {
  return function(doc) {
    MapEvents.emit(event + ':' + doc._id, doc);
    MapEvents.emit(event, doc);
  }
}

export default MapEvents;
