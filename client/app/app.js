'use strict';

angular.module('fullstackApp', [
  'fullstackApp.auth',
  'fullstackApp.admin',
  'fullstackApp.constants',
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'btford.socket-io',
  'ui.router',
  'ui.bootstrap',
  'validation.match',
  'ngAside',
  'ui-notification',
  'hc.marked'
])
  .config(function($urlRouterProvider, $locationProvider, NotificationProvider, markedProvider) {
    $urlRouterProvider
      .otherwise('/');

    $locationProvider.html5Mode(true);
  
    NotificationProvider.setOptions({
              delay: 3000,
              startTop: 20,
              startRight: 10,
              verticalSpacing: 20,
              horizontalSpacing: 20,
              positionX: 'left',
              positionY: 'bottom'
          });
    markedProvider.setOptions({
      gfm: true,
      tables: true,
      highlight: function (code, lang) {
        if (lang) {
          return hljs.highlight(lang, code, true).value;
        } else {
          return hljs.highlightAuto(code).value;
        }
      }
    });
  });
