(function() {
   'use strict';

   /* Services */

   angular.module('master.services', [])

      .factory('loginService', ['angularFireAuth', '$location', '$rootScope',
         function(angularFireAuth, $location, $rootScope) {
            return {
               /**
                * @param {string} email
                * @param {string} pass
                * @param {string} [redirect]
                * @param {Function} [callback]
                * @returns {*}
                */
               login: function(email, pass, redirect, callback) {
                  var p = angularFireAuth.login('password', {
                     email: email,
                     password: pass,
                     rememberMe: true
                  });

                  p.then(function(user) {
                     if( redirect ) {
                        $location.path(redirect);
                     }
                     callback && callback(null, user);
                  }, callback);
               },

               /**
                * @param {string} [redirectPath]
                */
               logout: function(redirectPath) {
                  angularFireAuth.logout();
                  if( redirectPath ) {
                     $location.path(redirectPath);
                  }
               },

               changePassword: function(opts) {
                  if( !opts.oldpass || !opts.newpass ) {
                     opts.callback('Please enter a password');
                  }
                  else if( opts.newpass !== opts.confirm ) {
                     opts.callback('Passwords do not match');
                  }
                  else {
                     angularFireAuth._authClient.changePassword(opts.email, opts.oldpass, opts.newpass, function(err) {
                        opts.callback(errMsg(err));
                        $rootScope.$apply();
                     })
                  }
               },

               createAccount: function(email, pass, callback) {
                  angularFireAuth._authClient.createUser(email, pass, function(err, user) {
                     if( callback ) {
                        callback(err, user);
                        $rootScope.$apply();
                     }
                  });
               },

              FBlogin: function () {
                angularFireAuth.login("facebook", {
                  rememberMe: true,
                  scope: 'email,user_location'
                  });
              },
            };
         }])
})();

