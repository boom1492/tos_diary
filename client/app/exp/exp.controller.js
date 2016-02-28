'use strict';

angular.module('fullstackApp')
  .controller('ExpCtrl', function ($scope, $http, Notification) {
    $scope.expCards = [];
    $scope.result;
  
    $scope.baseLevel = 1;    
    $scope.baseExp = 0;
    $scope.classRank = 1;
    $scope.classLevel = 1;
    $scope.classExp = 0;
  
    for(var i = 1; i <= 12; i++){
      $scope.expCards.push({level: i, count: 0});
    }
  
    $scope.calc = function(){
      //http://localhost:9000/api/exps?baseLevel=203&baseExp=4.7&classRank=6&classLevel=10&classExp=49.5&cards=0,0,0,0,0,0,0,110,90,0,0,0
      
      var cards = '';
      for(var idx in $scope.expCards){
        cards = cards + ($scope.expCards[idx].count || 0) + ((idx != $scope.expCards.length - 1)?',':'');
      }
      
      $http.get('/api/exps/?baseLevel=' + $scope.baseLevel + '&baseExp=' + $scope.baseExp + '&classRank=' + $scope.classRank + '&classLevel=' + $scope.classLevel + '&classExp=' + $scope.classExp + '&cards=' + cards).then(response => {
        $scope.result = response.data;
        console.log($scope.result);
      },
      err=>{
        Notification.error('잘못된 데이터를 전송하였습니다.');
      });
    }
  });
