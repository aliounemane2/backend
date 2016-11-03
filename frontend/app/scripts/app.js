'use strict';
/* global app: true */


var app = angular.module('frontendApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngRoute',
  'ngMap',
  'ngQueue'
]).run(function($rootScope){

    /*

    $rootScope.directions = [
          {origin:"Pikine, Sénégal", destination:"Dakar, Sénégal", panelName:"p1"},
          // {origin:"Keur Massar, Sénégal", destination:"Parcelles Assainies, Sénégal", panelName:"p2"},

          // Guédiawaye, Dakar
          // Dakar, Sénégal
    ];

    */

    $rootScope.$on('mapInitialized', function(evt,map) {
      $rootScope.map = map;
      $rootScope.$apply();
    });

});


app.config(function ($routeProvider, $httpProvider) {
  $httpProvider.interceptors.push('AuthInterceptor');
  $routeProvider
    .when('/', {
      templateUrl: 'views/auth.html',
      controller: 'AuthCtrl'
    })
    .when('/dashboard', {
      templateUrl: 'views/dashboard.html',
      controller: 'DashboardCtrl'
    })
    .otherwise({
      redirectTo: '/'
    });
});


app.constant('API_SERVER', 'http://127.0.0.1:8000/api/');