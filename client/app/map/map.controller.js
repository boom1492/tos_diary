'use strict';

(function() {

class MapController {

  constructor($http, $scope, socket) {
    this.$http = $http;
    $scope.block_maps = [];
    $scope.group_maps = [];
    $scope.group_names = [];

    $http.get('/api/maps').then(response => {
      //$scope.block_maps = response.data;
                   
      /*
      $scope.block_maps = response.data.filter(function(item){
        return item.group == undefined;
      }); 
      */
      $scope.group_maps = response.data.filter(function(item){
        return item.group != undefined;
      });
      
      
      var group = _.groupBy(response.data, function(item){
        return item.group;
      });
      
      $scope.block_maps = group["undefined"];
      
      //$scope.group_maps = group.delete("undefined");
      delete group["undefined"];
      
      $scope.group_names = _.map(group, function(item){ return {group: item[0].group, location: item[0].location}});
      
    });

  }

}

angular.module('fullstackApp')
  .controller('MapController', MapController);

})();
