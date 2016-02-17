'use strict';

(function() {

class MapController {

  constructor($http, $scope, socket) {
    this.$http = $http;
    this.maps = [];
/*
    $http.get('/api/maps').then(response => {
      this.maps = response.data;
      socket.syncUpdates('map', this.maps);
    });

    $scope.$on('$destroy', function() {
      socket.unsyncUpdates('map');
    });*/
    
  }

}

angular.module('fullstackApp')
  .controller('MapController', MapController);

})();
