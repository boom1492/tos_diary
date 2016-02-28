'use strict';

angular.module('fullstackApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('exp', {
        url: '/exp',
        templateUrl: 'app/exp/exp.html',
        controller: 'ExpCtrl'
      });
  });
