'use strict';

/* App Module */

angular.module('share', ['firebase'])
	.controller('ShareCtrl', ['$scope', 'angularFireCollection', function($scope, angularFireCollection) {
		console.log('share controller is running');
		$scope.shareClick = function() {
			console.log('share click registered');
			mixpanel.track("Share Conversion");
		};
	}]);