'use strict';

/* Controllers */

angular.module('master.controllers', [])
   .controller('LoginCtrl', ['$scope', 'loginService', function($scope, loginService) {
      $scope.email = null;
      $scope.pass = null;
      $scope.confirm = null;
      $scope.createMode = false;

      $scope.login = function(callback) {
         $scope.err = null;
         loginService.login($scope.email, $scope.pass, '/account', function(err, user) {
            $scope.err = err||null;
            typeof(callback) === 'function' && callback(err, user);
         });
      };
      $scope.FBlogin = function() { 
      		loginService.FBlogin();
      };
      $scope.createAccount = function() {
         if( !$scope.email ) {
            $scope.err = 'Please enter an email address';
         }
         else if( !$scope.pass ) {
            $scope.err = 'Please enter a password';
         }
         else if( $scope.pass !== $scope.confirm ) {
            $scope.err = 'Passwords do not match';
         }
         else {
            loginService.createAccount($scope.email, $scope.pass, function(err, user) {
	 			if (!err) {
		 	  		window.userID = user.provider+":"+user.id;	 	  		
		 	  		var UserRef = new Firebase('https://cabletipster.firebaseio.com/users/'+window.userID).update({email: user.email, userProvider: user.provider}, function(err) {
						if(!err) {
					         loginService.login($scope.email, $scope.pass, '/account', function(err, user) {
					            $scope.err = err||null;
					            typeof(callback) === 'function' && callback(err, user);
					         });
						};	
		 	  		});
	 			} else {
	 				console.log(err);
	  			};
            });
         }
      };
   }])