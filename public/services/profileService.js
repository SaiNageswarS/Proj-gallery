angular.module('bookme')
.factory('ProfileService', function($q, UtilService) {
    function getFirstKey(obj) {
        for (var a in obj) return a;
        return null;
    }

    var profileService = function (userId) {
        var self = this;
        var rootRef = firebase.database();
        var storageRef = firebase.storage().ref(userId);
        var profileRef = rootRef.ref('profile/' + userId);
        
        self.refreshUI = null;
        var currentUser = firebase.auth().currentUser;
        self.user = {
            photoURL: currentUser.photoURL,
            firstName: currentUser.displayName
        };
        
        self.saveProfile = function () {
            profileRef.set(self.user, function (error) {
                if (error) {
                    alert("Failed to save. Check network connection.");
                } else {

                    if (self.user.photo && typeof self.user.photo === "object") {
                        UtilService.uploadImage(userId, "/profile", self.user.photo, function(url) {
                            if (url) {
                                self.user.photoURL = url;
                                profileRef.set(self.user);
                                console.log('File available at', url);
                                alert("Saved succesfully");
                                if (self.refreshUI) self.refreshUI();
                            }
                        });
                    }
                    else {
                        alert("Saved succesfully");
                    }
                }
            });
        };
        
        self.getProfile = function () {
            profileRef.once("value", function (snapshot) {
                self.user = snapshot.val();
                if (self.refreshUI) self.refreshUI();  
            }, function (err) {
                alert("Failed to retrieve data. Check your connectivity");
            });
        };

        self.getProfile();
    }
    
    var profileInstance = null;
    return {
        getInstance: function (refreshUICB) {
            if(profileInstance === null) {
                var currentUser = firebase.auth().currentUser;
                if (!currentUser) {
                    return null;
                }
                profileInstance = new profileService(currentUser.uid);
            }
            profileInstance.refreshUI = refreshUICB;
            return profileInstance;
        },
        destroyInstance: function () {
            profileInstance = null;
        }
    };
});