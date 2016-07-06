'use strict';

// Declare app level module which depends on views, and components
angular.module('bookme', [
  'ngRoute',
  'file-model'
]).
config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
  $locationProvider.hashPrefix('!');

  $routeProvider.otherwise({redirectTo: '/login'});
}]);
