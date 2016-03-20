/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/quests              ->  index
 * POST    /api/quests              ->  create
 * GET     /api/quests/:id          ->  show
 * PUT     /api/quests/:id          ->  update
 * DELETE  /api/quests/:id          ->  destroy
 */

'use strict';

import _ from 'lodash';
import Quest from './quest.model';
import QuestCompletion from './quest-completion.model';
import User from './../user/user.model';

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


// Gets a list of Quests
export function index(req, res) {
  if(req.query.mapId == undefined || req.query.mapId.length === 0){
    return res.status(404).end();
  }else{
    Quest.find({mapId:req.query.mapId}).sort('questName').populate('connectedQuests', 'questName npcName type _id level mapId').populate('preQuests', 'questName npcName type _id level mapId').execAsync()
      .then(handleEntityNotFound(res))
      .then(respondWithResult(res))
      .catch(handleError(res));  
  }
  
}

// Gets a single Quest from the DB
export function show(req, res) {
  Quest.findByIdAsync(req.params.id)
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Creates a new Quest in the DB
export function create(req, res) {
  Quest.createAsync(req.body)
    .then(respondWithResult(res, 201))
    .catch(handleError(res));
}

// Updates an existing Quest in the DB
export function update(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  Quest.findByIdAsync(req.params.id)
    .then(handleEntityNotFound(res))
    .then(saveUpdates(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Deletes a Quest from the DB
export function destroy(req, res) {
  Quest.findByIdAsync(req.params.id)
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}

export function getCompletions(req, res){
  var userId = req.user._id;
  if(userId === undefined){
    res.status(401).end();
  }
  var mapId = req.params.id;
  if(mapId === undefined){
    QuestCompletion.findAsync({userId: userId}).then(result=>{
      res.status(200).json(result);
    })
    .catch(handleError(res));  
  }else{
    QuestCompletion.findAsync({mapId:mapId, userId: userId}).then(result=>{
      res.status(200).json(result);
    })
    .catch(handleError(res));
  }
  
}
  
export function complete(req, res){
  var userId = req.user._id;
  var questId = req.params.id;
  if(questId === undefined){
    return res.status(404).end();
  }
  
  User.findOneAsync({ _id: userId }, '-salt -password')
    .then(user => { // don't ever give out the password or salt
      
      if (!user) {
        return res.status(401).end();
      }

      QuestCompletion.findOne({userId:userId, questId:questId}).execAsync()
      .then(function(completion){
        if(completion == null){
          Quest.findByIdAsync(questId).then(quest=>{
            QuestCompletion.createAsync({userId:userId, questId:questId, timestamp: new Date(), mapId:quest.mapId})
            .then(function(result){
                return res.status(200).end();
            })
            .catch(handleError(res));
          })
          .catch(handleError(res));
        } else{
          return res.status(200).end();
        }
      });
    })
    .catch(err => next(err));
}
  
export function cancel(req, res){
  var userId = req.user._id;
  var questId = req.params.id;
  if(questId === undefined){
    return res.status(404).end();
  }
  
  User.findOneAsync({ _id: userId }, '-salt -password')
    .then(user => { // don't ever give out the password or salt
      if (!user) {
        return res.status(401).end();
      }
      QuestCompletion.findOne({userId:userId, questId:questId}).execAsync()
      .then(function(completion){
        if(completion){
          return completion.removeAsync()
          .then(() => {
            res.status(204).end();
          });
        } else{
         return res.status(200).end();
        }
      });
      
    })
    .catch(err => next(err));
}