/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/maps              ->  index
 * POST    /api/maps              ->  create
 * GET     /api/maps/:id          ->  show
 * PUT     /api/maps/:id          ->  update
 * DELETE  /api/maps/:id          ->  destroy
 */

'use strict';

import _ from 'lodash';
import Map from './map.model';

function respondWithResult(res, statusCode) {
  statusCode = statusCode || 200;
  return function(entity) {
    if (entity) {
      res.status(statusCode).json(entity);
    }
  };
}

function saveUpdates(updates) {
  return function(entity) {
    var updated = _.merge(entity, updates);
    return updated.saveAsync()
      .spread(updated => {
        return updated;
      });
  };
}

function removeEntity(res) {
  return function(entity) {
    if (entity) {
      return entity.removeAsync()
        .then(() => {
          res.status(204).end();
        });
    }
  };
}

function handleEntityNotFound(res) {
  return function(entity) {
    if (!entity) {
      res.status(404).end();
      return null;
    }
    return entity;
  };
}

function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return function(err) {
    res.status(statusCode).send(err);
  };
}

// Gets a list of Maps
export function index(req, res) {
  if(req.query.text == undefined){
    req.query.text = '';
  }
  console.log(req.query.text);
  if(req.query.sort === undefined || req.query.sort === 'word'){
    Map.find({"mapName": { "$regex": req.query.text, "$options": "i" }}).sort('questName').execAsync()
      .then(respondWithResult(res))
      .catch(handleError(res));  
  }else{
    Map.find({"mapName": { "$regex": req.query.text, "$options": "i" }}).sort('level').execAsync()
      .then(respondWithResult(res))
      .catch(handleError(res));  
  }
  
}

// Gets a single Map from the DB
export function show(req, res) {
  Map.findByIdAsync(req.params.id)
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Creates a new Map in the DB
export function create(req, res) {
  Map.createAsync(req.body)
    .then(respondWithResult(res, 201))
    .catch(handleError(res));
}

// Updates an existing Map in the DB
export function update(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  Map.findByIdAsync(req.params.id)
    .then(handleEntityNotFound(res))
    .then(saveUpdates(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Deletes a Map from the DB
export function destroy(req, res) {
  Map.findByIdAsync(req.params.id)
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}
