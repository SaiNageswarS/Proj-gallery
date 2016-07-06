'use strict';

angular.module('bookme')

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/profile', {
    templateUrl: 'app/profile/profile.html',
    controller: 'profileCtrl'
  });
}])

.controller('profileCtrl', function($scope, $location, ProfileService) { 
    var currentUser = firebase.auth().currentUser;
    
    if (!currentUser) {
        $location.path("/login");
    } else {
        var refreshUI = function() {
            try { $scope.$apply() } catch(err) {}
        };  

        $scope.profileInstance = ProfileService.getInstance(refreshUI);
        $scope.user = {
            photoURL: currentUser.photoURL,
            firstName: currentUser.displayName
        };
        
        $scope.profileInstance.getProfile(function (snapshot) {
            $scope.user = snapshot.val();
            try {$scope.$apply(); } catch(err) {}  
        }, function (err) {
            alert("Failed to retrieve data. Check your connectivity");
        });
        
        $scope.saveProfile = function () {
            $scope.profileInstance.saveProfile($scope.user);
        };
        
        $scope.addProject = function () {
            $scope.profileInstance.addProject();
        };
        
        $scope.saveProject = function(key) {
            $scope.profileInstance.saveProject(key, $scope.profileInstance.projects[key], 
                function() {
                    console.log("done");
                });
        }
        
        $scope.deleteProject = function(key) {
            $scope.profileInstance.deleteProject(key);
        }
    } 
});