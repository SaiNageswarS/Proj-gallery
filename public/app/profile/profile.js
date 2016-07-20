'use strict';

angular.module('bookme')

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/profile/:firstName/:lastName', {
    templateUrl: 'app/profile/profile.html',
    controller: 'profileCtrl'
  });
}])

.controller('profileCtrl', function($scope, $location, $routeParams,
         ProfileService, ProjectService) { 
    var currentUser = firebase.auth().currentUser;
    $scope.defaultProfile = '/img/blank-profile.jpg';
    
    if (!currentUser) {
        $location.path("/login");
    } else {
        var refreshUI = function() {
            try { $scope.$apply() } catch(err) {}
        };  

        $scope.profileInstance = ProfileService.getInstance(refreshUI);
        $scope.projectInstance = ProjectService.getInstance(refreshUI);

        if ($routeParams.firstName && $routeParams.firstName !== '-1') {
            $scope.profileInstance.user.firstName = $routeParams.firstName;            
        }
        if ($routeParams.lastName  && $routeParams.lastName !== '-1') {
            $scope.profileInstance.user.lastName = $routeParams.lastName;                    
        }
        
        $scope.saveProfile = function () {
            $scope.profileInstance.saveProfile();
        };
        
        $scope.addProject = function () {
            $scope.projectInstance.addProject();
        };
        
        $scope.saveProject = function(key) {
            $scope.projectInstance.saveProject(key, $scope.projectInstance.projects[key], 
                function() {
                    console.log("done");
                });
        }
        
        $scope.deleteProject = function(key) {
            $scope.projectInstance.deleteProject(key);
        }
    } 
});