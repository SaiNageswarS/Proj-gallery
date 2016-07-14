'use strict';

angular.module('bookme')

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/projects', {
    templateUrl: 'app/projects/projects.html',
    controller: 'projectsCtrl'
  });
}])

.controller('projectsCtrl', function($scope, $location, ProfileService, UserService) { 
    var currentUser = firebase.auth().currentUser;
    $scope.defaultProfile = '/img/blank-profile.jpg';
    
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
        
        $scope.setSelected = function(key) {
            $scope.profileInstance.selectedProject = key;    
        };

        $scope.logout = function() {
            ProfileService.destroyInstance();
            UserService.logout().then(function() {
                $location.path("/login");
            });
        };
    }
    
});