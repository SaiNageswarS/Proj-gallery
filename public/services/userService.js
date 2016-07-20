angular.module('bookme')
.factory('UserService', function($q) {
    return {
        login_google: function () {
            var provider = new firebase.auth.GoogleAuthProvider();
            var deferred = $q.defer();  
            
            firebase.auth().getRedirectResult().then(function(result) {
                if (result.credential) {
                    var token = result.credential.accessToken;
                    // The signed-in user info.
                    var user = result.user;
                    deferred.resolve(user);
                } else {
                    firebase.auth().signInWithRedirect(provider);                  
                }
               
            }).catch(function(error) {
                deferred.reject(error);
            });          
            
            return deferred.promise;
        },

        login_email: function (email, password) {
            firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
                alert(error.message);
            });
        },

        register: function (email, password) {
            firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
                alert(error.message);
            });
        },

        logout: function () {
            return firebase.auth().signOut();
        }
    };
});