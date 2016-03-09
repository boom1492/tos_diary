'use strict';

import _ from 'lodash';
import ExpCard from './exp-card.model';
import BaseExp from './base-exp.model';
import ClassExp from './class-exp.model';
import async from 'async';

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

export function cards(req, res){
  ExpCard.find().sort('level').exec((err, result)=>{
    if(err){
      res.status(500).end();
    }
    res.json(result);
  });
}
// Gets a list of Exps
export function index(req, res) {
  try{
    var baseLevel = parseInt(req.query.baseLevel) || 1;
    var baseExp = req.query.baseExp || 0;
    var classRank = parseInt(req.query.classRank) || 1;
    var classLevel = parseInt(req.query.classLevel) || 1;
    var classExp = req.query.classExp || 0;
    var cards = [0,0,0,0,0,0,0,0,0,0,0,0];
    if(req.query.cards !== undefined){
      cards = req.query.cards.split(',');
    }
    async.parallel([
      function(cb){
        BaseExp.find({level: baseLevel}).exec(cb);
      },
      function(cb){
        BaseExp.find({level: baseLevel + 1}).exec(cb);
      },
      function(cb){
        ClassExp.find({rank: classRank, level: classLevel}).exec(cb);
      },
      function(cb){
        var nextRank = classRank;
        var nextLevel = classLevel + 1;
        if(classLevel == 15){
          nextRank = nextRank + 1;
          nextLevel = 1;
        }
        ClassExp.find({rank: nextRank, level: nextLevel}).exec(cb);
      },
      function(cb){
        ExpCard.find().sort('level').exec(cb);
      },
      function(cb){
        ClassExp.find({level:15, rank:{$lt:classRank}}).exec(cb);
      },
      function(cb){
        ClassExp.find({level:15}).sort('rank').exec(cb);
      }
    ], function(err, result){
      if(err){
        res.status(500).end();
      }else{
        try{
          var currentBaseExp = result[0][0].totalRequired + (result[1][0].required * 0.01 * baseExp);

          var beforeClassExp = 0;
          for(var idx in result[5]){
            beforeClassExp = beforeClassExp + result[5][idx].totalRequired;
          }
          var currentClassExp = 0;
          if(result[3].length === 0){
            currentClassExp = result[2][0].totalRequired + beforeClassExp;  
          }else{
            currentClassExp = result[2][0].totalRequired + (result[3][0].required * 0.01 * classExp) + beforeClassExp;
          }

          for(var idx in cards){
            if(cards[idx] != 0){
              currentBaseExp = currentBaseExp + (result[4][idx].baseExp * cards[idx]);
              currentClassExp = currentClassExp + (result[4][idx].classExp * cards[idx]);
            }
          }
          var tempTotal = 0;
          var nextRank = 0;
          for(var idx in result[6]){
            tempTotal = tempTotal + result[6][idx].totalRequired;
            if(tempTotal > currentClassExp){
              nextRank = result[6][idx].rank;
              tempTotal = tempTotal - result[6][idx].totalRequired;
              break;
            }
          }
          async.parallel([
            function(cb){
              BaseExp.find({'totalRequired':{$lte:currentBaseExp}}).sort('-totalRequired').limit(1).exec(cb);
            },
            function(cb){
              BaseExp.find({'totalRequired':{$gte:currentBaseExp}}).sort('totalRequired').limit(1).exec(cb);
            },
            function(cb){
              ClassExp.find({'totalRequired':{$lte:currentClassExp - tempTotal}, 'rank':nextRank}).sort('-totalRequired').limit(1).exec(cb);
            },
            function(cb){
              ClassExp.find({'totalRequired':{$gte:currentClassExp - tempTotal}, 'rank':nextRank}).sort('totalRequired').limit(1).exec(cb);
            }
          ], function(err, result2){
            try{
              var curBase = result2[0][0];
              var nextBase = result2[1][0];

              var remainBase = currentBaseExp - curBase.totalRequired;
              var curBasePercent = remainBase / nextBase.required * 100;

              var curClass = result2[2][0];
              var nextClass = result2[3][0];

              var curClassPercent = 0;
              if(curClass === undefined){
                res.json({'baseLevel': curBase.level, 'baseExp': curBasePercent || 0, 'classRank': 7, 'classLevel': 15, 'classExp': 100});
              }else{
                var remainClass = currentClassExp - tempTotal - curClass.totalRequired;
                var curClassPercent = remainClass / nextClass.required * 100;
                
                res.json({'baseLevel': curBase.level, 'baseExp': curBasePercent || 0, 'classRank': curClass.rank, 'classLevel': curClass.level, 'classExp': curClassPercent || 0});
              }
            }catch(e){
              res.status(500).end();
              console.log(e);
            }
          }); 
        }catch(e){
          res.status(500).end();
        }
      }
    });
  }catch(e){
    res.status(500).end();
  }
  
}
