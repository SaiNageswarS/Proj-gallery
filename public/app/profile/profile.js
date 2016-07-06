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
        var profileInstance = new ProfileService(currentUser.uid);
        $scope.user = {
            photoURL: currentUser.photoURL,
            firstName: currentUser.displayName
        };
        
        profileInstance.getProfile(function (snapshot) {
            $scope.user = snapshot.val();
            try {$scope.$apply(); } catch(err) {}  
        }, function (err) {
            alert("Failed to retrieve data. Check your connectivity");
        });
        
        $scope.saveProfile = function () {
            profileInstance.saveProfile($scope.user);
        };
        
        $scope.projects = {};
        
        profileInstance.getProjects(function (change, key, project) {
            switch(change) {
                case 'removed': delete $scope.projects[key];
                                break;
                                
                case 'added': $scope.projects[key] = project;
                            break;
            }  
            try {$scope.$apply(); } catch(err) {}  
        });
        
        $scope.addProject = function () {
            profileInstance.addProject();
        };
        
        $scope.saveProject = function(key) {
            profileInstance.saveProject(key, $scope.projects[key], 
                function() {
                    console.log("done");
                });
        }
        
        $scope.deleteProject = function(key) {
            profileInstance.deleteProject(key);
        }
    } 
});