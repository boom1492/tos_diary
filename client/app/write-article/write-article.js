'use strict';

angular.module('fullstackApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('write-article', {
        url: '/write-article',
        templateUrl: 'app/write-article/write-article.html',
        controller: 'WriteArticleCtrl',
        authenticate: 'admin'
      });
  });
