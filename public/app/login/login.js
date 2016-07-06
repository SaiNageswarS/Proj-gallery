'use strict';

angular.module('bookme')

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/login', {
    templateUrl: 'app/login/login.html',
    controller: 'loginCtrl'
  });
}])

.controller('loginCtrl', function($scope, UserService, $location) { 
    firebase.auth().onAuthStateChanged(function(currentUser) {
        if (currentUser) {
            $location.path("/projects");
            $scope.$apply();
        }
    });
    
    $scope.google_login = function() {
        UserService.login_google()
            .then(function (user) {
                $location.path("/projects")
            });
    };
});