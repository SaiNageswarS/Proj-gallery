angular.module('bookme')
.factory('UtilService', function() {
    var self = this;

    self.uploadImage = function (userId, path, img, cb) {
            var storageRef = firebase.storage().ref(userId);
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
    return self;
});