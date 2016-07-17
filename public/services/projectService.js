angular.module('bookme')
.factory('ProjectService', function($q) {
    function getFirstKey(obj) {
        for (var a in obj) return a;
        return null;
    }

    var projectService = function (userId) {
        var self = this;
        var rootRef = firebase.database();
        var storageRef = firebase.storage().ref(userId);
        var projectRef = rootRef.ref('project/' + userId);
        
        self.refreshUI = null;
        
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
            projectData.url = project.url;
            projectData.skills = project.skills;
            
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
            projectRef.child(key).remove(function(error) {
                if (error) {
                    alert('Error in network');
                } else {
                    alert('Deleted succesfully');
                }
            });
        };

        self.projects = {
            'first_project': {
                title: '',
                desc: '',
                url: '',
                img1: '',
                img2: '',
                img3: ''
            }
        };
        self.selectedProject = null;
        
        var getProjects = function () {
            projectRef.on("child_added", function (snapshot) {
               if (self.projects['first_project'] 
                    && self.projects['first_project'].title === '') {
                   delete self.projects['first_project'];
               }
               var project = snapshot.val();
               var key = snapshot.key;
               self.projects[key] = project;

               if (self.selectedProject === null) {
                   self.selectedProject = key;
               }
               if (self.refreshUI !== null) self.refreshUI();
            });
            projectRef.on("child_removed", function (oldSnapshot) {
                var key = oldSnapshot.key;
                delete self.projects[key];
                if(key === self.selectedProject) {
                    self.selectedProject = getFirstKey(self.projects);
                }
                if (self.refreshUI !== null) self.refreshUI();
            });
            projectRef.on("child_changed", function (childSnapshot, prevChildKey) {
                var key = childSnapshot.key;
                var project = childSnapshot.val();
                self.projects[key] = project;
                if (self.refreshUI !== null) self.refreshUI();
            });
        };
        getProjects();
    };
    
    var projectInstance = null;
    return {
        getInstance: function (refreshUICB) {
            if(projectInstance === null) {
                var currentUser = firebase.auth().currentUser;
                if (!currentUser) {
                    return null;
                }
                projectInstance = new projectService(currentUser.uid);
            }
            projectInstance.refreshUI = refreshUICB;
            return projectInstance;
        },
        destroyInstance: function () {
            projectInstance = null;
        }
    };
});