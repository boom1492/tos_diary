'use strict';

angular.module('fullstackApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('sidebar', {
        url: '/sidebar',
        templateUrl: 'components/sidebar/sidebar.html',
        controller: 'SidebarCtrl'
      });
  });
