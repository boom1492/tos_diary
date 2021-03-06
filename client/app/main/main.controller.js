'use strict';

(function() {

class MainController {

  constructor($http, $scope, socket) {
    this.$http = $http;
  
    $http.get('/api/articles/summary').then(response=>{
      $scope.$parent.articles = response.data;
    });
  
    $http.get('/api/comments').then(response => {
      $scope.$parent.comments = response.data;
      socket.syncUpdates('comment', $scope.$parent.comments);

    }); 
    
    $scope.$on('$destroy', function() {
      socket.unsyncUpdates('comment');
    });
    
    /*
    this.awesomeThings = [];

    $http.get('/api/things').then(response => {
      this.awesomeThings = response.data;
      socket.syncUpdates('thing', this.awesomeThings);
    });

    $scope.$on('$destroy', function() {
      socket.unsyncUpdates('thing');
    });
  */  
  }
/*
  addThing() {
    if (this.newThing) {
      this.$http.post('/api/things', { name: this.newThing });
      this.newThing = '';
    }
  }

  deleteThing(thing) {
    this.$http.delete('/api/things/' + thing._id);
  }
  */
}

angular.module('fullstackApp')
  .controller('MainController', MainController);

})();
