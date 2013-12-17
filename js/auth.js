//Initiate auth for each page
var authRef = new Firebase('https://dev-cabletipster.firebaseio.com/');
var auth = new FirebaseSimpleLogin(authRef, function(error, user) {
  if (error) {
    // an error occurred while attempting login
	//trying to then take user back to signup page
	window.location = 'http://dev33.cabletipster.com/signup.html';
    console.log(error);
  } else if (user) {
    // user authenticated with Firebase
	//check to see if data already inputted
	switch (user.provider) {
		case "facebook":
//			window.userID = user.provider+":"+user.id;
			window.userID = user.id;
			window.providerID = user.provider;
			var myProviderRef = new Firebase('https://dev-cabletipster.firebaseio.com/users/'+user.provider+'/'+user.id+'/tips/');
			myProviderRef.on('value', function(snapshot) {
			  if(snapshot.val() === null) {
			    console.log('Tip does not exist');
			  } else {
				var currentTipRef = myProviderRef.endAt().limit(1);
				currentTipRef.once('value', function(snap) {
				    snap.forEach(function(child) {
				    	console.log("key name is: " + child.name());
				    	window.tipID = child.name();
				    	console.log(window.tipID);
				    });
				});
			  }
			});
			break;
		case "password":
//			window.userID = user.provider+":"+user.id;
			window.userID = user.id;
			window.providerID = user.provider;
			var myProviderRef = new Firebase('https://dev-cabletipster.firebaseio.com/users/'+user.provider+'/'+user.id+'/tips/');
			myProviderRef.on('value', function(snapshot) {
			  if(snapshot.val() === null) {
			    console.log('Tip does not exist');
			  } else {
				var currentTipRef = myProviderRef.endAt().limit(1);
				currentTipRef.once('value', function(snap) {
				    snap.forEach(function(child) {
				    	console.log("key name is: " + child.name());
				    	window.tipID = child.name();
				    	console.log(window.tipID);
				    });
				});
			  }
			});
			break;
		default:
			console.log("Login did not go through")
		};
	new Firebase("https://dev-cabletipster.firebaseio.com/").child("users/"+user.provider+'/'+user.id).once('value', function(snap) {
		if(snap.val() === null) { 
		// does not exist
		//write user data to Firebase
		var UserRef = new Firebase('https://dev-cabletipster.firebaseio.com/users/'+user.provider+'/'+user.id).update({	email: user.email, userProvider: user.provider});
   		//attempts to take user to next screen if Facebook signup is successful
 		}; 
 	});
    console.log('User ID: ' + window.userID + ", Provider: " + window.providerID);
    // if on sign-in page, send user to next page
	if(window.location.pathname === "/signup.html") {
		window.location.href = "http://dev33.cabletipster.com/provider-input-dynamic.html";
	};
  } else {
    // user is logged out
    console.log("User not signed in");
    // if (window.location.pathname !== "/signup.html") {
    // 	window.location.href = "http://dev33.cabletipster.com/signup.html";    	
    // }
  }
});


//Handle FB Login
function FBLoginButtonClicked() {
  auth.login("facebook", {
	  rememberMe: true,
	  scope: 'email,user_location'
	  });
}

//Handle Email Login
function EmailSignupButtonClicked() {
    var email = $('#email-input').val();
    var password = $('#pwd-input').val();
    auth.createUser(email, password, function(error, user) {
		if (!error) {
			auth.login('password', {
				email: user.email,
				password: password,
				rememberMe: true, 
			})
		} else {
			console.log(error);
		};
	});
}