'use strict';

angular.module('fullstackApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('quest', {
        url: '/quest',
        templateUrl: 'app/quest/quest.html',
        controller: 'QuestCtrl',
        controllerAs: 'quest'
      });
  });
