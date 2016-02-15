'use strict';

(function() {

class QuestCtrl {

  constructor($http, $scope, socket, $location, $cookies) {
    this.$http = $http;
    //this.quests = [];
    this.map = {};
    this.mapId = $location.search().mapId;
    $http.get('/api/quests?mapId=' + this.mapId).then(response => {
      $scope.$parent.quests = response.data;
      for(var i = 0; i< $scope.$parent.quests.length; i++){
        $scope.$parent.quests[i].done = $cookies.get('quest.' + $scope.$parent.quests[i]._id);
      }
    });

    $http.get('/api/maps/' + this.mapId).then(response =>{
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
    }
    
    $scope.test = function(){
      for(var i = 0; i< $scope.$parent.quests.length; i++){
        for(var j = 0; j < $scope.$parent.quests[i].compensations.length; j++){
          $scope.$parent.quests[i].compensations[j].itemImgUrl = 'http://static.inven.co.kr/image_2011/site_image/tos/item/icon_item_expcard.png';
          console.log($scope.$parent.quests[i].compensations[j].itemImgUrl);
        }
      }
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
  }

}

angular.module('fullstackApp')
  .controller('QuestCtrl', QuestCtrl);

})();
