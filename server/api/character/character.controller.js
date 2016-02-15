/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/characters              ->  index
 * POST    /api/characters              ->  create
 * GET     /api/characters/:id          ->  show
 * PUT     /api/characters/:id          ->  update
 * DELETE  /api/characters/:id          ->  destroy
 */

'use strict';

import _ from 'lodash';
import Character from './character.model';

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

// Gets a list of Characters
export function index(req, res) {
  console.log(req.user._id);
  Character.findAsync({'userId':req.user._id})
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a single Character from the DB
export function show(req, res) {
  Character.findByIdAsync(req.params.id)
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Creates a new Character in the DB
export function create(req, res) {
  req.body['userId'] = req.user._id;
  Character.createAsync(req.body)
    .then(respondWithResult(res, 201))
    .catch(handleError(res));
}

// Updates an existing Character in the DB
export function update(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  Character.findByIdAsync(req.params.id)
    .then(handleEntityNotFound(res))
    .then(saveUpdates(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Deletes a Character from the DB
export function destroy(req, res) {
  Character.findByIdAsync(req.params.id)
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}
