/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/comments              ->  index
 * POST    /api/comments              ->  create
 * GET     /api/comments/:id          ->  show
 * PUT     /api/comments/:id          ->  update
 * DELETE  /api/comments/:id          ->  destroy
 */

'use strict';

import _ from 'lodash';
import Comment from './comment.model';

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

function checkOwnerEntity(res){
  return function(entity){
    if(entity){
      console.log();
    }
  }
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

// Gets a list of Comments
export function index(req, res) {
  Comment.find().sort('-written').populate('author', 'name _id role').populate('mapId').limit(10).execAsync()
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
  
}

// Gets a single Comment from the DB
export function show(req, res) {
  Comment.find({mapId:req.params.id}).populate('author', 'name _id role').populate('mapId').execAsync()
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Creates a new Comment in the DB
export function create(req, res) {
  if(req.user._id == undefined){
    return res.status(403).end();
  }
  if(req.body.message.length > 200){
    return res.status(400).end();
  }
  req.body['author'] = req.user._id;
  req.body['written'] = new Date();
  
  Comment.createAsync(req.body)
    .then(respondWithResult(res, 201))
    .catch(handleError(res));
}

// Updates an existing Comment in the DB
export function update(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  Comment.findByIdAsync(req.params.id)
    .then(handleEntityNotFound(res))
    .then(saveUpdates(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Deletes a Comment from the DB
export function destroy(req, res) {
  
  Comment.findByIdAsync(req.params.id)
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}
