'use strict';

angular.module('bookme')

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/projects', {
    templateUrl: 'app/projects/projects.html',
    controller: 'projectsCtrl'
  });
}])

.controller('projectsCtrl', function($scope, $location, ProfileService) { 
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
        
        $scope.projects = {};
        
        profileInstance.getProjects(function (change, key, project) {
            switch(change) {
                case 'removed': delete $scope.projects[key];
                                break;
                                
                case 'added': $scope.projects[key] = project;
                            if ($scope.selected_project === '') {
                                $scope.selected_project = key;
                            }
                            break;
            }  
            try {$scope.$apply(); } catch(err) {}  
        });
        
        $scope.selected_project = '';
        $scope.setSelected = function(key) {
            $scope.selected_project = key;    
        };
    }
    
});