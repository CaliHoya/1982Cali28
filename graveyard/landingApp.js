'use strict';

/* App Module */

function waitingListButtonClicked() {
	var email = $('#mail').val();
	var zip = $('#zip').val();
	var WaitingListRef = new Firebase('https://cabletipster.firebaseio.com/beta_list');
	var id = WaitingListRef.push();
	id.set({'id': id.name(), 'email': email, 'zip': zip}, function(error) {
		if (!error) {
			window.location.href="thanks.html";
		} else {
			console.log(error);			
		}
	});
}

function negotiatorListButtonClicked() {
	var email = $('#mail').val();
	var WaitingListRef = new Firebase('https://cabletipster.firebaseio.com/negotiator_list');
	var id = WaitingListRef.push();
	id.set({'id': id.name(), 'email': email}, function(error) {
		if (!error) {
			window.location.href="thanks.html";
		} else {
			console.log(error);			
		}
	});
}

function feedbackButtonClicked() {
	var feedback = $('#feedback').val();
	var FeedbackRef = new Firebase('https://cabletipster.firebaseio.com/feedback');
	var id = FeedbackRef.push();
	id.set({'userID': window.userID, 'provider': window.providerID,'feedback': feedback}, function(error) {
		if (!error) {
			window.location.href="thanks.html";
		} else {
			console.log(error);			
		}
	});
}