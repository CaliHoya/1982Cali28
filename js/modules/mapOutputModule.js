'use strict';

//Google Maps initiatializing
var geocoder;
var map;
var tips = { };
var ib = { };
var geoDataSet = [ ];

function initialize() {
	geocoder = new google.maps.Geocoder();
	var latlng = new google.maps.LatLng(window.lat, window.lng);
	var mapOptions = {
	    center: latlng,
	    zoom: 14,
	    maxZoom: 16,
	    mapTypeId: google.maps.MapTypeId.ROADMAP
	};
	map = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);
	var circle = new google.maps.Circle({
		strokeColor: '#32ccb2',
	    strokeOpacity: 0.8,
	    strokeWeight: 2,
	    fillColor: '#32ccb2',
	    fillOpacity: 0.2,
	    map: map,
	    center: latlng,
	    radius: 1800
	});
};

function detailView(tipSelected) {
    var scope = angular.element($("#sidebar")).scope();
    scope.safeApply(function(){
        scope.listView = false;
        var currentTipRef = new Firebase('https://dev-cabletipster.firebaseio.com/tips/geoFire/dataById/'+tipSelected);
        currentTipRef.on('value', function(snap) {
			scope.safeApply(function(){
				scope.tipSelected = snap.val();
			});
		});

    });
};

//Mixpanel tracking

mixpanel.track_links("#negotiatorButton", "Negotiator Button Clicked", {
    referrer: document.referrer
});


mixpanel.track_links("#shareButton", "Share Button Clicked", {
    referrer: document.referrer
});

// Pricing comparison calculations

function median(values) {
    values.sort( function(a,b) {return a - b;} );
    var half = Math.floor(values.length/2);
    if(values.length % 2)
        return values[half];
    else
        return (values[half-1] + values[half]) / 2.0;
};

// add function to compare user's price to median

function average(values) {
	var sum = 0;
	for (var i = 0; i < values.length; i++) {
		sum += values[i];
	}
	return sum / values.length;
};

/* App Module */

angular.module('mapOutput', ['firebase'])
	.controller('MainCtrl', ['$scope', '$rootScope', 'angularFire', 'angularFireCollection', 'angularFireAuth', '$routeParams', function($scope, $rootScope, angularFire, angularFireCollection, angularFireAuth, $routeParams) {

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
				var mixpanelRef = new Firebase('https://dev-cabletipster.firebaseio.com/users/'+user.provider+'/'+user.id);
				mixpanelRef.once('value', function(snap) {
					mixpanel.identify(snap.val().email);
					mixpanel.track('Map Viewed', {
					    'email': snap.val().email,
					    'type': snap.val().userProvider
					});
				});
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
									window.priceMonthly = snap.val().priceMonthly;
									window.lat = snap.val().lat;
									window.lng = snap.val().lng;
									$scope.loadMap();
								});
							});
						});
					};
				});
			    console.log('User ID: ' + window.userID + ", Provider: " + window.providerID);
			} else {
		    // user is logged out
		    console.log("User not signed in");
			    window.location.href = "http://dev33.cabletipster.com/signup.html";    	
			};   
	    }});
		// setting up sidepanel functionality
		$scope.listView = true;
		$rootScope.safeApply = function( fn ) {
	        var phase = this.$root.$$phase;
	        if(phase == '$apply' || phase == '$digest') {
	            if(fn) {
	                fn();
	            }
	        } else {
	            this.$apply(fn);
	        }
	    };

        $scope.backToList = function () {
        	$scope.listView = true;
        }

        // setting up GeoFire
		var TipRef= new Firebase('https://dev-cabletipster.firebaseio.com/tips');
		var geo = new geoFire(TipRef);
		var radiusInKm = 1.7;
		// var f = new Firebase('https://dev-cabletipster.firebaseio.com/tips/geoFire/dataById');

		//setting up routing to tip detail	    
	    // var promise = angularFire(f, $scope, "tips");
	    // promise.then(function() {
	    // // You can safely access $scope.tips[#];
	    // $scope.selectedItem = $routeParams.tipId;
	    // console.log($scope.selectedItem);
	    // console.log($scope.tips[$scope.selectedItem]);
	    // $scope.tip = $scope.tips[$scope.selectedItem];
	    // $scope.getTip = function() {
	    //  return $scope.tip;
	    // }
	    // });

	    //resetting filtering of tips by service type
		$scope.tvbox = false;
		$scope.internetbox = false;
		$scope.phonebox = false;

		// // to open marker from side
		// function myclick(firebaseId) {
		// google.maps.event.trigger(tips[firebaseId], "click");
		// }

		//setting up customFilter for side panel
		$scope.filterItem = 'all';
		 $scope.customFilter = function (tip) {
		    if (tip.servicesReceived === $scope.filterItem) {
		      return true;
		    } else if ($scope.filterItem === 'all') {
		      return true;
		    } else {
		      return false;
		    }
		};  

		// function userTip(tip) {
		//     var tipLatLng = new google.maps.LatLng(tip.lat, tip.lng);
		//     // create marker for user
		//     var marker = new google.maps.Marker({
		//     	position: tipLatLng,
		//     	icon: 'http://chart.googleapis.com/chart?chst=d_map_pin_icon&chld=home|32ccb2', 
		//     	map: map 
		//     });
		// };


		function newTip(tip, firebaseId) {
		    var tipLatLng = new google.maps.LatLng(tip.lat, tip.lng);
		    // create marker for tip
		    var marker = new google.maps.Marker({
		    	position: tipLatLng,
		    	icon: 'http://chart.googleapis.com/chart?chst=d_bubble_text_small&chld=bbT|$'+Math.floor(tip.priceMonthly)+'|3399CC|FFFFFF', 
		    	map: map 
		    });
		    tips[firebaseId] = marker;
		    //create infobox for tip
			var boxText = document.createElement("div");
            //define the text and style for all infoboxes
            // boxText.style.cssText = "border: 1px solid #3399CC; margin-top: 8px; background:#FFF; color:#00; font-family:Arial; font-size:12px; padding: 5px; border-radius:6px; -webkit-border-radius:6px; -moz-border-radius:6px;";
            boxText.innerHTML = '<img src="img/map-arrow.gif"/>';
            // boxText.innerHTML = '<strong>$'+tip.priceMonthly + '</strong><br>' + tip.providerName + '<br><a onclick="detailView(\'' + firebaseId +'\');"><p>Click Here</p></a>';
			//infobox options set up
			var infoBoxOptions = {
			    content: boxText,
			    disableAutoPan: false,
			    maxWidth: 0,
			    pixelOffset: new google.maps.Size(-10, 0),
			    zIndex: null,
			    // boxStyle: {
			    //     background: "url('img/map-arrow.gif') no-repeat",
			    //     // opacity: 1,
			    //     // width: "150px"
			    // },
			    // closeBoxMargin: "12px 4px 2px 2px",
			    closeBoxURL: "",
			    infoBoxClearance: new google.maps.Size(1, 1),
			    isHidden: false,
			    pane: "floatPane",
			    enableEventPropagation: false
			};
			//define infobox
			ib[firebaseId] = new InfoBox(infoBoxOptions);

			var zoomLevel = 15;

			$scope.zoomIn = function($event, index, priceMonthly, providerName) {
				boxText.innerHTML =  '<img src="img/map-arrow.gif"/>';
			    map.setCenter(tips[index].getPosition());
			    map.setZoom(zoomLevel);
			    detailView(index);
				// var infoBoxOptions = {
				//     content: boxText,
				//     disableAutoPan: false,
				//     maxWidth: 0,
				//     pixelOffset: new google.maps.Size(-140, 0),
				//     zIndex: null,
				//     boxStyle: {
				//         // background: "url('http://google-maps-utility-library-v3.googlecode.com/svn/trunk/infobox/examples/tipbox.gif') no-repeat",
				//         opacity: 1,
				//         width: "150px"
				//     },
				//     closeBoxMargin: "12px 4px 2px 2px",
				//     closeBoxURL: "http://www.google.com/intl/en_us/mapfiles/close.gif",
				//     infoBoxClearance: new google.maps.Size(1, 1),
				//     isHidden: false,
				//     pane: "floatPane",
				//     enableEventPropagation: false
				// };
			    // var ib = new InfoBox(infoBoxOptions);
            	//close active window if it exists
            	if(window.activeWindow != null) {
                	window.activeWindow.close();
                };
                //open new window
			    ib[index].open(map, tips[index]);
                window.activeWindow = ib[index];
			};

	        //makes infobox open when clicked on
            google.maps.event.addListener(marker, 'click', function() {
            	//close active window if it exists
            	if(window.activeWindow != null) {
                	window.activeWindow.close();
                };
            	detailView(firebaseId);
                //open new window
                ib[firebaseId].open(map, marker);
                window.activeWindow = ib[firebaseId];
            });
        };

		$scope.loadMap = function() {
			console.log('loading loadMap function');
			$scope.filterItem = window.planType;
			switch(window.planType) {
				case "tv":
					$scope.filterText = "TV Only";
					$scope.tvbox = true;
					break;
				case "tv-internet":
					$scope.filterText = "TV & Internet Bundles";			
					$scope.internetbox = true;
					$scope.tvbox = true;
					break;
				case "tv-internet-phone":
					$scope.filterText = "TV, Internet & Phone Bundles";				
					$scope.internetbox = true;
					$scope.tvbox = true;
					$scope.phonebox = true;
					break;
				case "tv-phone":	
					$scope.filterText = "TV & Phone Bundles";			
					$scope.tvbox = true;
					$scope.phonebox = true;
					break;	
				case "internet":
					$scope.filterText = "Internet Only";
					$scope.internetbox = true;
					break;	
				case "internet-phone":
					$scope.filterText = "Internet & Phone Bundles";
					$scope.internetbox = true;
					$scope.phonebox = true;
					break;		
				case "phone":
					$scope.filterText = "Phone Only";
					$scope.phonebox = true;
					break;
				default:
					console.log("Please select a service type to continue.")							
			};
			initialize();
			var src = [window.lat, window.lng]; 
			geo.onPointsNearLoc(src, radiusInKm, function(s) {
				$scope.tips = s;
				s.forEach(function(b) {			
					if (b.servicesReceived == window.planType) {
			    		newTip(b, b.id);
			    		geoDataSet.push(b.priceMonthly);
			  		};
			  	});
				$scope.priceMedian = median(geoDataSet);
				$scope.priceAverage = average(geoDataSet);
				$scope.$apply();
				// //setting up MarkerClusterer
				// var mcOptions = {gridSize: 50, maxZoom: 15};
				// var mc = new MarkerClusterer(map, tips, mcOptions);
			});	
		};

		$scope.logout = function() {
	        angularFireAuth.logout();
	        window.location.href="http://www.cabletipster.com/";
	    }

		$scope.checkboxChecked = function() {
			console.log('tvbox: '+$scope.tvbox);
			console.log('internetbox: '+$scope.internetbox);
			console.log('phonebox: '+$scope.phonebox);						
			if ($scope.tvbox && $scope.internetbox && $scope.phonebox) {
				$scope.filterText = "TV, Internet & Phone Bundles";
				$scope.filterItem = "tv-internet-phone";
		  	} else if ($scope.tvbox && $scope.internetbox ) {
				$scope.filterText = "TV & Internet Bundles";
				$scope.filterItem = "tv-internet";
		  	} else if ($scope.tvbox && $scope.phonebox ) {
				$scope.filterText = "TV & Phone Bundles";
				$scope.filterItem = "tv-phone";
		  	} else if ($scope.phonebox && $scope.internetbox ) {
				$scope.filterText = "Internet & Phone Bundles";
				$scope.filterItem = "internet-phone";
		  	} else if ($scope.tvbox) {
				$scope.filterText = "TV Only";		  		
				$scope.filterItem = "tv";
		  	} else if ($scope.internetbox) {
				$scope.filterText = "Internet Only";			  		
				$scope.filterItem = "internet";
		  	} else if ($scope.phonebox) {
				$scope.filterText = "Phone Only";			  		
				$scope.filterItem = "phone";
		  	};
		  	var src = [window.lat, window.lng]; 
			geo.onPointsNearLoc(src, radiusInKm, function(s) {
				for (var key in tips) {
					tips[key].setMap(null);
				};
				//clear geoDataSet			
				geoDataSet.splice(0, geoDataSet.length);
				s.forEach(function(b) {
					if ($scope.tvbox && $scope.internetbox && $scope.phonebox) {
				  		if (b.servicesReceived == "tv-internet-phone") {
				    		newTip(b, b.id);
				    		geoDataSet.push(b.priceMonthly);
				  		}
				  	} else if ($scope.tvbox && $scope.internetbox ) {
				  		if (b.servicesReceived == "tv-internet") {
				    		newTip(b, b.id);
				    		geoDataSet.push(b.priceMonthly);
				  		}
				  	} else if ($scope.tvbox && $scope.phonebox ) {
				  		if (b.servicesReceived == "tv-phone") {
				    		newTip(b, b.id);
				    		geoDataSet.push(b.priceMonthly);
				  		}
				  	} else if ($scope.phonebox && $scope.internetbox ) {
				  		if (b.servicesReceived == "internet-phone") {
				    		newTip(b, b.id);
				    		geoDataSet.push(b.priceMonthly);
				  		}
				  	} else if ($scope.tvbox) {
				  		if (b.servicesReceived == "tv") {
				    		newTip(b, b.id);
				    		geoDataSet.push(b.priceMonthly);
				  		}
				  	} else if ($scope.internetbox) {
				  		if (b.servicesReceived == "internet") {
				    		newTip(b, b.id);
				    		geoDataSet.push(b.priceMonthly);
				  		}
				  	} else if ($scope.phonebox) {
				  		if (b.servicesReceived == "phone") {
				    		newTip(b, b.id);
				    		geoDataSet.push(b.priceMonthly);
				  		}
				  	} else {
				  		if (b.servicesReceived == "tv") {
				    		newTip(b, b.id);
				    		geoDataSet.push(b.priceMonthly);
				  		}				  		
				  	}						
				});
				delete tips[window.tipID];
				$scope.priceMedian = median(geoDataSet);
				$scope.priceAverage = average(geoDataSet);			
				// //setting up MarkerClusterer
				// var mcOptions = {gridSize: 50, maxZoom: 15};
				// var mc = new MarkerClusterer(map, tips, mcOptions);
			});	
		}
	}])
	  .config(['$routeProvider', function($routeProvider) {
/*  $locationProvider.html5Mode(true);*/
  $routeProvider.
      when('/tips', {templateUrl: 'partials/tip-list.html'}).
      when('/tips/:tipId', {templateUrl: 'partials/tip-detail.html'}).
      otherwise({redirectTo: '/tips'});
  }])