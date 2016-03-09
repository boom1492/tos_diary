'use strict';

class NavbarController {
  //start-non-standard
  menu = [{
    'title': '홈',
    'state': 'main'
  },
  {
    'title': '경험치 계산기',
    'state': 'exp'
  },
  {
    'title': '공지사항',
    'state': 'article'
  }];

  isCollapsed = true;
  //end-non-standard

  constructor(Auth, $aside, $scope, $location) {
    this.isLoggedIn = Auth.isLoggedIn;
    this.isAdmin = Auth.isAdmin;
    this.getCurrentUser = Auth.getCurrentUser;

    $scope.asideState = {
      open: false
    };
    
    $scope.openAside = function(position, backdrop) {
      $scope.asideState = {
        open: true,
        position: position
      };
      
      function postClose() {
        $scope.asideState.open = false;
      }
      
      $scope.$parent.asideInstance = $aside.open({
        templateUrl: '/components/sidebar/sidebar.html',
        placement: position,
        size: 'sm',
        backdrop: backdrop,
        controller: 'SidebarCtrl'
      });
      
      $scope.$parent.asideInstance.result.then(postClose, postClose);
  
    }
    
    $scope.clickItem = function(mapId){
      if($scope.asideInstance !== undefined){
        $scope.asideInstance.close();  
      }
    }
  }
}

angular.module('fullstackApp')
  .controller('NavbarController', NavbarController);
