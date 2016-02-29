'use strict';

angular.module('fullstackApp')
  .controller('SidebarCtrl', function ($scope, $uibModalInstance, $http, $filter, $cookies) {
    var orderBy = $filter('orderBy');
    $scope.text = $cookies.get('mapQuery') || '';
    $scope.predicate = $cookies.get('predicate') || 'mapName';

    $http.get('/api/maps').then(response => {
        $scope.maps = response.data;
        $scope.maps = orderBy($scope.maps, $scope.predicate, false);
      });
  
    $scope.order = function(predicate) {
      $cookies.put('predicate', predicate);
      $scope.predicate = predicate;
      $scope.maps = orderBy($scope.maps, predicate, false);
    };
  
    $scope.saveQuery = function(){
      $cookies.put('mapQuery', $scope.text);
    }
    
    $scope.reset = function(){
      $scope.text = '';
      $cookies.put('mapQuery', '');
    }
  });
