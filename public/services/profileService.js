angular.module('bookme')
.factory('ProfileService', function($q) {
    var profileService = function (userId) {
        var self = this;
        var rootRef = firebase.database();
        var profileRef = rootRef.ref('profile/' + userId);
        var projectRef = rootRef.ref('project/' + userId);
        
        self.saveProfile = function (profile) {
            profileRef.set(profile, function (error) {
                if (error) {
                    alert("Failed to save. Check network connection.");
                } else {
                    alert("Saved succesfully");
                }
            });
        };
        
        self.getProfile = function (cb, err_cb) {
            profileRef.once("value", cb, err_cb);
        };
        
        self.addProject = function () {
            var newProjectRef = projectRef.push();
            newProjectRef.set({
                title: '',
                desc: '',
                img1: '',
                img2: '',
                img3: ''
            });
        };
        
        self.saveProject = function (key, project) {
            projectRef.child(key).set(project, function (error) {
                if (error) {
                    alert("Failed to save. Check network connection.");
                } else {
                    alert("Saved succesfully");
                }
            });
        };
        
        self.deleteProject = function (key) {
            projectRef.child(key).remove();
        };
        
        self.getProjects = function (cb) {
            projectRef.on("child_added", function (snapshot) {
               var project = snapshot.val();
               var key = snapshot.key;
               cb('added', key, project); 
            });
            projectRef.on("child_removed", function (oldSnapshot) {
                var key = oldSnapshot.key;
                cb('removed', key, null);
            });
            projectRef.on("child_changed", function (childSnapshot, prevChildKey) {
                var key = childSnapshot.key;
                var project = childSnapshot.val();
                cb('added', key, project);
            });
        };
    };
    
    return profileService;
});