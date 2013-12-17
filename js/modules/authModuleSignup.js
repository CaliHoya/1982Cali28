angular.module('auth', ['firebase'])
  .controller(
    "LoginCtrl", ["$scope", "$rootScope", "angularFireAuth", '$location',
    function($scope, $rootScope, angularFireAuth, $location) {

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
			console.log('creating user..');
			switch(window.providerID) {
				case "facebook":
					var gender = user.gender;
					break;
				case "password":
					var gender = null;
					break;
			};
			var inputTime = Firebase.ServerValue.TIMESTAMP;
			var UserRef = new Firebase('https://dev-cabletipster.firebaseio.com/users/'+user.provider+'/'+user.id).update({	email: user.email, userProvider: user.provider, inputTime: inputTime, gender: gender});
		    console.log('User ID: ' + window.userID + ", Provider: " + window.providerID);
		    // if on sign-in page, send user to next page
			if (window.location.pathname === "/signup.html") {
				window.location.href = "http://dev33.cabletipster.com/add-provider-info.html";
			} else if (window.location.pathname === "/login.html") {
				window.location.href = "http://dev33.cabletipster.com/map-output.html";
			}
		} else {
	    // user is logged out
		    console.log("User not signed in");
		};   


    }});

    $scope.email = null;
    $scope.pass = null;
    $scope.beta = false;
	$scope.submitCode = function(beta) {
		console.log($scope.betaInput);
		new Firebase("https://dev-cabletipster.firebaseio.com/").child("beta_codes/"+$scope.betaInput).once('value', function(snap) {
			console.log(snap);
			if(snap.val() === null) { 
			// code does not exist
			alert("Beta code not found. Please try again.")
	   		//attempts to take user to next screen if Facebook signup is successful
	 		} else {
	 			$scope.beta = true;
	 			$scope.$apply();
	 		}
	 	});
    };

	$scope.createUser = function(email, pass, callback) {
		angularFireAuth.createUser($scope.email, $scope.pass, function(error, user) {
			if (!error) {
			} else {
				console.log(error);
			};
    	});
    };

    $scope.FBlogin = function() {
        angularFireAuth.login("facebook", {
			rememberMe: true,
			scope: 'email'
		});
    }

    $scope.emailLogin = function() {
		angularFireAuth.login('password', {
			email: $scope.email,
			password: $scope.pass,
			rememberMe: true, 
		})
    }

    $scope.logout = function() {
        angularFireAuth.logout();
        window.location.href="http://www.cabletipster.com/";
      }
    }
  ])

  angular.module('signupApp', [])
  .directive('match', function($parse) {
    return {
      require: 'ngModel',
      link: function(scope, elem, attrs, ctrl) {
        scope.$watch(function() {        
          return $parse(attrs.match)(scope) === ctrl.$modelValue;
        }, function(currentValue) {
          ctrl.$setValidity('mismatch', currentValue);
        });
      }
    };
  })