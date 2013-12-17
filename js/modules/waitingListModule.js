'use strict';

/* App Module */

angular.module('waitingList', ['firebase'])
	.controller('WaitingCtrl', ['$scope', 'angularFireCollection', function($scope, angularFireCollection) {
		$scope.addWaitlist = function () {
			//Firebase
			var WaitingListRef = new Firebase('https://dev-cabletipster.firebaseio.com/beta_list/'+$scope.zipCode);
			$scope.betaList = angularFireCollection(WaitingListRef);
			var inputTime = Firebase.ServerValue.TIMESTAMP;
			$scope.betaList.add({
	        	email: $scope.email, zipCode: $scope.zipCode, timeStamp: inputTime, approved: false
	        }, function(error) {
				if (!error) {
					window.location.href="thanks.html";
				} else {
					console.log(error);			
				}
	        });
		}
		$scope.negotiationConversion = function () {
			$scope.negotiationRequested = true;
			mixpanel.track('Negotiation Conversion');
			var NegotiatorRef = new Firebase('https://dev-cabletipster.firebaseio.com/negotiator_list');
			$scope.negotiatorList = angularFireCollection(NegotiatorRef);
			var inputTime = Firebase.ServerValue.TIMESTAMP;
			$scope.negotiatorList.add({
	        	createdByUserID: window.userID, providerName: window.providerID, email: $scope.email, timeStamp: inputTime, tipID: window.tipID, approved: false
	        }, function(error) {
				if (error) {
					console.log(error);			
				}
	        })
		};

		$scope.addFeedback = function () {
			$scope.feedbackSubmitted = true;
			var FeedbackRef = new Firebase('https://dev-cabletipster.firebaseio.com/feedback');
			$scope.getFeedback = angularFireCollection(FeedbackRef);
			var inputTime = Firebase.ServerValue.TIMESTAMP;
			$scope.getFeedback.add({
	        	createdByUserID: window.userID, providerName: window.providerID, feedback: $scope.feedback, timeStamp: inputTime, responded: false
	        }, function(error) {
				if (error) {
					console.log(error);			
				}
	        })
		}
	}]);