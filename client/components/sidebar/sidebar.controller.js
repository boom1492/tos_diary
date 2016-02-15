'use strict';

angular.module('fullstackApp')
  .controller('SidebarCtrl', function ($scope, $uibModalInstance, $http, $filter) {
    var orderBy = $filter('orderBy');
    $scope.text = '';
    $scope.predicate = 'mapName';

    $http.get('/api/maps').then(response => {
        $scope.maps = response.data;
      });
  
    $scope.order = function(predicate) {
      $scope.predicate = predicate;
      $scope.maps = orderBy($scope.maps, predicate, false);
    };
  
  });
