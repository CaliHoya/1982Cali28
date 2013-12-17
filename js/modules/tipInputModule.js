'use strict';

/* App Module */

angular.module('tipInput', ['firebase'])
	.controller('MainCtrl', ['$scope', '$rootScope', '$location', '$anchorScroll', 'angularFireCollection', function($scope, $rootScope, $location, $anchorScroll, angularFireCollection) {

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

	   	$scope.address2 = null;
		$scope.TVradio = null;
		$scope.totalTV = null;
		$scope.totalHDTV = null;
		$scope.totalDVRTV = null;
		$scope.internetRadio = null;
		$scope.internetSpeed = null;
		$scope.phoneRadio = null;
		$scope.AddOnHBO = null;
		$scope.AddOnShowtime = null;
		$scope.AddOnCinemax = null;
		$scope.AddOnStarz = null;
		$scope.AddOnSports = null;
		$scope.AddOnLatino = null;
		$scope.AddOnInt = null;
		$scope.AddOnOther = null;
		$scope.userComments = null;

		$scope.scrollTop = function () {
			$location.hash('top');
		    // call $anchorScroll()
		    $anchorScroll();
		}

		$scope.step2 = function () {
			$scope.step = 2;
			mixpanel.track('NU Step 1 Completed');
		};

		$scope.step3 = function () {
			$scope.step = 3;
			mixpanel.track('NU Step 2 Completed');
		};

		$scope.step4 = function () {
			$scope.step = 4;
			mixpanel.track('NU Step 3 Completed');
		};

		$scope.providerSelected = function () {
			$scope.providerComcast = false;
			$scope.providerATT = false;
			$scope.providerDirecTV = false;
			$scope.providerDishNetwork = false;
			$scope.providerAstound = false;
			$scope.providerWebpass = false;
			$scope.providerSonicNet = false;
			$scope.providerOther = false;
			$scope.providerBundle = false;
			$scope.servicesReceived = null;
			switch ($scope.providerName) {
				case "Comcast":
				$scope.providerComcast = true;
				$scope.providerBundle = true;
				console.log('Comcast:'+$scope.providerComcast);
				break;
				case "AT&T":
				$scope.providerATT = true;
				$scope.providerBundle = true;
				console.log('AT&T:'+$scope.providerATT);
				break;
				case "DirecTV":
				$scope.providerDirecTV = true;
				$scope.servicesTV = true;
				$scope.servicesReceived = "tv";
				console.log('DirecTV:'+$scope.providerDirecTV);
				break;
				case "Dish Network":
				$scope.providerDishNetwork = true;
				$scope.servicesTV = true;
				$scope.servicesReceived = "tv";
				console.log('Dish Network:'+$scope.providerDishNetwork);
				break;
				case "Astound":
				$scope.providerAstound = true;
				$scope.providerBundle = true;
				console.log('Astound:'+$scope.providerAstound);
				break;
				case "Webpass":
				$scope.providerWebpass = true;
				$scope.servicesInternet = true;
				$scope.servicesReceived = "internet";
				console.log('Webpass:'+$scope.providerWebpass);
				break;
				case "Sonic.net":
				$scope.providerSonicNet = true;
				$scope.providerBundle = true;
				console.log('Sonic.net:'+$scope.providerSonicNet);
				break;
				default:
				$scope.providerOther = true;
				$scope.providerBundle = true;
				console.log("Other:"+$scope.providerOther)
			}
		}

		$scope.serviceSelected = function () {
			$scope.servicesTV = false;
			$scope.servicesInternet = false;
			$scope.servicesPhone = false;
			switch ($scope.servicesReceived) {
				case "tv-internet":
				$scope.servicesTV = true;
				$scope.servicesInternet = true;
				console.log('TV: '+$scope.servicesTV+", Internet: "+$scope.servicesInternet);
				break;
				case "tv":
				$scope.servicesTV = true;
				console.log('TV: '+$scope.servicesTV);
				break;
				case "internet":
				$scope.servicesInternet = true;
				console.log("Internet: "+$scope.servicesInternet);
				break;
				case "tv-internet-phone":
				$scope.servicesTV = true;
				$scope.servicesInternet = true;
				$scope.servicesPhone = true;
				console.log('TV: '+$scope.servicesTV+", Internet: "+$scope.servicesInternet+", Phone: "+$scope.servicesPhone);
				break;
				case "internet-phone":
				$scope.servicesInternet = true;
				$scope.servicesPhone = true;
				console.log("Internet: "+$scope.servicesInternet+", Phone: "+$scope.servicesPhone);
				break;
				case "tv-phone":
				$scope.servicesTV = true;
				$scope.servicesPhone = true;
				console.log('TV: '+$scope.servicesTV+", Phone: "+$scope.servicesPhone);
				break;
				default:
				console.log("No correct service selected.")
			}
		}

		$scope.contractTypeSelected = function () {
			$scope.askContractType = false;
			$scope.contractType = null;
			if ($scope.lengthContract !== "No Contract") {
				$scope.askContractType = true;
			} else {
				$scope.contractType = "No Promotion";
			};
		};

		$scope.retryButton = function() {
			alert("Sorry, your tip did not go through. Please try again.");
			window.location.href = "http://dev33.cabletipster.com/add-provider-info.html";
		};

	    $scope.addTip = function() {
		    var TipRef= new Firebase('https://dev-cabletipster.firebaseio.com/tips');
		    //setting up TipRef for angularFire
		    $scope.tip = angularFireCollection(TipRef);
		    var servicesReceived = $scope.servicesReceived;
		    var lengthContract = $scope.lengthContract;
		    var contractType = $scope.contractType;
		    var TVradio = $scope.TVradio;
		    var internetRadio = $scope.internetRadio;
		    var phoneRadio = $scope.phoneRadio;
		    var addOns = [$scope.AddOnHBO,$scope.AddOnShowtime,$scope.AddOnCinemax,$scope.AddOnStarz,$scope.AddOnSports,$scope.AddOnLatino,$scope.AddOnInt,$scope.AddOnOther];
			var inputTime = Firebase.ServerValue.TIMESTAMP;
			var zipCode = parseInt(window.zipCode);			
			var priceMonthly = parseFloat($scope.priceMonthly.replace("$", ""));
			var userComments = $scope.userComments;
			// Translating internet packages to speed
			switch ($scope.internetRadio) {
				case "Economy Plus":
					$scope.internetSpeed = 3;	
					break;
				case "Performance":
					$scope.internetSpeed = 25;	
					break;
				case "Blast!":
					$scope.internetSpeed = 50;	
					break;
				case "Extreme 105":
					$scope.internetSpeed = 105;	
					break;
				case "Internet Pro":
					$scope.internetSpeed = 3;	
					break;
				case "Internet Elite":
					$scope.internetSpeed = 6;	
					break;
				case "Internet Max":
					$scope.internetSpeed = 12;	
					break;
				case "Internet Max Plus":
					$scope.internetSpeed = 18;	
					break;
				case "Internet Max Turbo":
					$scope.internetSpeed = 24;	
					break;
				default:
					console.log("Internet speed switch did not find match.")
			}
		    var internetSpeed = $scope.internetSpeed;
		    var geo = new geoFire(TipRef);
			var loc = [window.lat, window.lng];

			if($scope.providerName === "Other") {
				var providerName = $scope.providerNameOther;
			} else {
				var providerName = $scope.providerName;
			};
			if ($scope.totalTV === null) {
				var totalTV = null;
				var totalHDTV = null;
				var totalDVRTV = null;
			} else {
				var totalTV = parseInt($scope.totalTV);
				var totalHDTV = parseInt($scope.totalHDTV);
				var totalDVRTV = parseInt($scope.totalDVRTV);				
			};
			//registering mixpanel superproperties
		    mixpanel.register({
			    'provider name': providerName,
			    'services received': servicesReceived,
			    'city': window.city
		    });
		    //tracking new user completion
			mixpanel.track('NU Flow Completed');
			var AverageRef = new Firebase('https://dev-cabletipster.firebaseio.com/average_tip/'+$scope.zipCode+'/'+$scope.servicesReceived);
		    var AverageRefData = AverageRef.child('datapoints');
		    $scope.averageRefData = angularFireCollection(AverageRefData);
			// AverageRef.transaction(function(curr) {
		 //        if( !curr) { curr = { total_records: 0, average_amount: 0, total_amount: 0 }; }
		 //        // increment totals each time I save a tip
		 //        curr.total_records++;
		 //        curr.total_amount += priceMonthly;
		 //        curr.average_amount = curr.total_amount / curr.total_records;
		        
		 //        return curr;
		 //    }, function(error, committed) {
		 //        if( error ) {
		 //            console.log(error);
		 //        }
		 //        else if( committed ) {
        	var ref = $scope.averageRefData.add();
        	// var ref = $scope.averageRefData.add(priceMonthly, function(error) {
        		// if(!error) {
			geo.insertByLocWithId(loc, ref.name(), {providerName: providerName, servicesReceived: servicesReceived, lengthContract: lengthContract, contractType: contractType, priceMonthly: priceMonthly, TVPackage: TVradio, numberTotalTV: totalTV, numberHDTV: totalHDTV, numberDVRTV: totalDVRTV, addOns: addOns, internetPackage: internetRadio, internetSpeed: internetSpeed, phonePackage: phoneRadio, inputTime: inputTime, createdByUserID: window.userID, lat: window.lat, lng: window.lng, address: window.address, neightborhood: window.neighborhood, city: window.city, state: window.state, zipCode: window.zipCode, id: ref.name(), userComments: userComments
			}, function(error) {
			// TipRef.set({id: ref.name(), providerName: providerName, servicesReceived: $scope.servicesReceived, lengthContract: $scope.lengthContract, contractType: $scope.contractType, priceMonthly: priceMonthly, TVPackage: $scope.TVradio, numberTotalTV: totalTV, numberHDTV: totalHDTV, numberDVRTV: totalDVRTV, addOns: addOns, internetPackage: $scope.internetRadio, internetSpeed: $scope.internetSpeed, phonePackage: $scope.phoneRadio, inputTime: inputTime, createdByUserID: window.userID, lat: window.lat, lng: window.lng, address: window.address, neightborhood: window.neighborhood, city: window.city, state: window.state, zipCode: window.zipCode
	        // }, function(error) {
				if(!error) {			        	
					var UserRef = new Firebase('https://dev-cabletipster.firebaseio.com/users/'+window.providerID+"/"+window.userID);
					UserRef.update({
			        	lat: window.lat, lng: window.lng, address: window.address, neightborhood: window.neighborhood, city: window.city, state: window.state, zipCode: zipCode
			        }, function(error) {
	        			if(!error) {
	        				UserRef.child("tips").child(ref.name()).set(true, function(error) {
								if(!error) {
									// window.location.href="map-output.html";
								} else {
									console.log(error);
									alert("Sorry, your tip didn't go through. Please try again.");
									window.location.href = "http://dev33.cabletipster.com/add-provider-info.html";
								}
							})
	        			} else {
	        				alert("Sorry, your tip didn't go through. Please try again.");
	        				window.location.href = "http://dev33.cabletipster.com/add-provider-info.html";
	        			}					        	
	        		});
			    } else {
			    	alert("Sorry, your tip didn't go through. Please try again.");
			    	window.location.href = "http://dev33.cabletipster.com/add-provider-info.html";
			    }
			});
		        	// 	}
		        	// });
		    //     }
		    // })
	    }
	}]);