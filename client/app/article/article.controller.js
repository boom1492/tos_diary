'use strict';

angular.module('fullstackApp')
  .controller('ArticleCtrl', function ($scope, $http, $location) {
    $scope.articleId = $location.search().id;
    $scope.articles = [];
  
    $http.get('/api/articles' + (($scope.articleId !== undefined)? ('/' + $scope.articleId ) : '')).then(response=>{
      $scope.articles = response.data;
      if(response.data.length === undefined){
        $scope.articles = [ response.data ];
      }else{
        $scope.articles = response.data;
      }
        
    });

    
  });
