angular.module('bookme')
.factory('ProfileService', function($q) {
    var profileService = function (userId) {
        var self = this;
        var rootRef = firebase.database();
        var storageRef = firebase.storage().ref(userId);
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
                desc: ''
            });
        };
        
        var uploadImage = function (path, img, cb) {
            if (img && img.name) {
                var imgUploadTask = storageRef.child(path).put(img, {});
                    
                imgUploadTask.on('state_changed', null, function(error) {
                    alert("Failed to save. Check network connection.");
                }, function() {
                    var url = imgUploadTask.snapshot.metadata.downloadURLs[0];
                    cb(url);
                });   
            }
            else {
                cb(null);
            }
        };
        
        self.saveProject = function (key, project, cb) {
            var projectData = {};
            projectData.title = project.title;
            projectData.desc = project.desc;
            
            projectRef.child(key).set(projectData, function (error) {
                if (error) {
                    alert("Failed to save. Check network connection.");
                } else {
                    alert("Saved succesfully");                    
                    // initiate image upload
                    uploadImage(key + "/img1", project.img1, function(url) {
                        if (url) {
                            projectData.img1 = url;
                            projectRef.child(key).set(projectData);
                            console.log('File available at', url);
                        }
                    });
                    uploadImage(key + "/img2", project.img2, function(url) {
                        if (url) {
                            projectData.img2 = url;
                            projectRef.child(key).set(projectData);
                            console.log('File available at', url);
                        }
                    });
                    uploadImage(key + "/img3", project.img3, function(url) {
                        if (url) {
                            projectData.img3 = url;
                            projectRef.child(key).set(projectData);
                            console.log('File available at', url);
                        }
                    });
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