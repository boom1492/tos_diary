'use strict';

angular.module('fullstackApp')
  .controller('WriteArticleCtrl', function ($scope, Auth, $http, $location) {
    $scope.title = "";
    $scope.markdown = "";
    $scope.getCurrentUser = Auth.getCurrentUser;
  
    $scope.write = function(){
      if($scope.title.length < 10){
        alert('제목이 너무 짧습니다.');
        return;
      }
      if($scope.markdown.length < 10){
        alert('내용이 너무 짧습니다.');
        return;
      }
     
      $http.post('/api/articles/', {author: $scope.getCurrentUser()._id, title: $scope.title, contents: $scope.markdown, category: 'notice'}).then(response=>{
        console.log(response);
        if(response.status == 201){
          $location.path('/article');
          $location.url('/article');
        }else{
          alert('작성에 실패하였습니다.');
        }
      });
    }
    
    
  });
