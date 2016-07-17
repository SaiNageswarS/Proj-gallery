'use strict';

angular.module('bookme')

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/projects', {
    templateUrl: 'app/projects/projects.html',
    controller: 'projectsCtrl'
  });
}])

.controller('projectsCtrl', function($scope, $location, ProfileService, 
                                UserService, ProjectService) { 
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
        
        $scope.setSelected = function(key) {
            $scope.projectInstance.selectedProject = key;    
        };

        $scope.project_img = {
            img_index: 0
        };

        $scope.nextImg = function() {
            $scope.project_img.img_index = ($scope.project_img.img_index + 1)%3;
        };

        $scope.prevImg = function() {
            $scope.project_img.img_index = ($scope.project_img.img_index - 1)%3;
        };

        $scope.logout = function() {
            ProfileService.destroyInstance();
            ProjectService.destroyInstance();
            UserService.logout().then(function() {
                $location.path("/login");
            });
        };
    }
    
});