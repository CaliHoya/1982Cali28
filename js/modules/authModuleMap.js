angular.module('authMap', ['firebase'])
  .controller(
    "LoginCtrl", ["$scope", "$rootScope", "angularFireAuth",
    function($scope, $rootScope, angularFireAuth) {

    var url = "https://dev-cabletipster.firebaseio.com";
    angularFireAuth.initialize(new Firebase(url), {scope: $rootScope, name: "user", path: "http://www.cabletipster.com/", callback: function(error,user) {
	   if (error) {
	    // an error occurred while attempting login
		//trying to then take user back to signup page
		window.location = 'http://dev33.cabletipster.com/signup.html';
	    console.log(error);
	   } else if (user) {
	    // user authenticated with Firebase
			window.userID = user.id;
			window.providerID = user.provider;
			var myProviderRef = new Firebase('https://dev-cabletipster.firebaseio.com/users/'+user.provider+'/'+user.id+'/tips/');
			myProviderRef.on('value', function(snapshot) {
				if(snapshot.val() === null && window.location.pathname !== "/add-provider-info.html") {
				    console.log('Tip does not exist');
				    window.location.href = "http://dev33.cabletipster.com/add-provider-info.html";
				} else {
					var currentTipRef = myProviderRef.endAt().limit(1);
					currentTipRef.once('value', function(snap) {
					    snap.forEach(function(child) {
					    	window.tipID = child.name();
					    	console.log("Tip ID is: " + window.tipID);
							var planTypeRef = new Firebase('https://dev-cabletipster.firebaseio.com/tips/geoFire/dataById/'+window.tipID); 
							planTypeRef.on('value', function(snap) {
								window.planType = snap.val().servicesReceived;
								window.lat = snap.val().lat;
								window.lng = snap.val().lng;
							});
						});
					});
				};
			});
		    console.log('User ID: ' + window.userID + ", Provider: " + window.providerID);
			$scope.loadMap();
		} else {
	    	// user is logged out
		    console.log("User not signed in");
		    window.location.href = "http://dev33.cabletipster.com/login.html"; 
		};   
    }});

	    $scope.logout = function() {
	        angularFireAuth.logout();
	        window.location.href="http://www.cabletipster.com/";
	    }
    }
  ])
