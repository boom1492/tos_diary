'use strict';

(function() {

class QuestCtrl {

  constructor($http, $scope, socket, $location, $cookies, Auth, Notification) {
    this.$http = $http;
    //this.quests = [];
    this.map = {};
    $scope.mapId = $location.search().mapId;
    $scope.getCurrentUser = Auth.getCurrentUser;
    
    $scope.$parent.resultExpCard = [];
    
    $http.get('/api/quests?mapId=' + $scope.mapId).then(response => {
    
      var tmpResultExpCard = [];
      
      $scope.$parent.quests = response.data;
      
      for(var i = 0; i < $scope.$parent.quests.length; i++){
        $scope.$parent.quests[i].done = $cookies.get('quest.' + $scope.$parent.quests[i]._id);
        $scope.$parent.quests[i].selectionCnt = $scope.$parent.quests[i].compensations.filter(o=>o.type =='선택').length;
        $scope.$parent.quests[i].collapsed = true;
        
        for(var j = 0; j < $scope.$parent.quests[i].compensations.length; j++){
          var repeatCnt = $scope.$parent.quests[i].repeatCnt;
          if(repeatCnt == undefined){
            repeatCnt = 1;
          }
          var c = $scope.$parent.quests[i].compensations[j];
          if(c.itemName.indexOf('경험치') > -1){
            if(tmpResultExpCard[c.itemName] == undefined){
              tmpResultExpCard[c.itemName] = parseInt(c.numOfItems) * repeatCnt;
            }else{
              tmpResultExpCard[c.itemName] = tmpResultExpCard[c.itemName] + (parseInt(c.numOfItems) * repeatCnt); 
            }
          }
        }
      }
      for(var name in tmpResultExpCard){
        $scope.$parent.resultExpCard.push({'name': name, 'num': tmpResultExpCard[name]});
        
      }
      
    }, response =>{
      
      $location.path('/');
      $location.url('/');
    });
    
    $http.get('/api/comments/' + $scope.mapId).then(response => {
      $scope.$parent.comments = response.data;

      socket.syncUpdates('comment', $scope.$parent.comments);

    }); 
    
    $scope.writeComment = function(){
      if($scope.commentMessage.length < 10){
        alert('메시지가 너무 짧습니다.');
        return;
      }
      $http.post('/api/comments', { message: $scope.commentMessage, mapId: $scope.mapId }).then(response=>{
        
        $scope.commentMessage = '';
      }, response=>{
        if(response.status == 400){
          alert('메시지는 200자를 초과할 수 없습니다.');
        }
      });
      
    }
    
    $scope.removeComment = function(comment){
      $http.delete('/api/comments/' + comment._id);
      
    }
    
    $scope.$on('$destroy', function() {
      socket.unsyncUpdates('comment');
    });
    
    
    $http.get('/api/maps/' + $scope.mapId).then(response =>{
      this.map = response.data;
    });
    
    $scope.check = function(questId){
      if($cookies.get('quest.' + questId) != undefined){
        $cookies.remove('quest.' + questId);
      }else{
        $cookies.put('quest.' + questId, true); 
      }
      
      for(var i = 0; i< $scope.quests.length; i++){
        $scope.quests[i].done = $cookies.get('quest.' + $scope.quests[i]._id);
      }
      
      Notification.primary('Primary notification');
    }
    
    $scope.priority = $cookies.get("questPriority");

    $scope.toggleOrder = function(){
      $scope.priority = $cookies.get("questPriority");
      if($scope.priority === undefined){
        $cookies.put('questPriority', 'map');
        $scope.priority = 'map';
      }else if($scope.priority === 'map'){
        $cookies.put('questPriority', 'quest');
        $scope.priority = 'quest';
      }else{
        $cookies.put('questPriority', 'map');
        $scope.priority = 'map';
      }
    }
    
    $scope.fixedMap = $cookies.get("fixedMap");
    $scope.toggleFixedMap = function(){
      $scope.fixedMap = $cookies.get("fixedMap");
      
      //console.log("before:"+$scope.fixedMap);
      if($scope.fixedMap === undefined || $scope.fixedMap === 'false'){
        $cookies.put('fixedMap', 'true');
        $scope.fixedMap = 'true';
      }    
      else{
        $cookies.put('fixedMap', 'false');
        $scope.fixedMap = 'false';
      }
    }
    
  }

}

angular.module('fullstackApp')
  .controller('QuestCtrl', QuestCtrl);

})();
