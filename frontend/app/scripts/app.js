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
          {origin:"Pikine, S�n�gal", destination:"Dakar, S�n�gal", panelName:"p1"},
          // {origin:"Keur Massar, S�n�gal", destination:"Parcelles Assainies, S�n�gal", panelName:"p2"},

          // Gu�diawaye, Dakar
          // Dakar, S�n�gal
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