'use strict';

/* App Module */

angular.module('tipForm', ['firebase'])
	.controller('MainCtrl', ['$scope', 'angularFireCollection', function($scope, angularFireCollection) {

	    var url = new Firebase('https://cabletipster.firebaseio.com/tips');

	    $scope.tip = angularFireCollection(url);
	   	var addOns = '';
	    $scope.addTip = function() {
	    var addOnsArray = [$scope.AddOnHBO,$scope.AddOnShowtime,$scope.AddOnCinemax,$scope.AddOnStarz,$scope.AddOnSports,$scope.AddOnLatino,$scope.AddOnInt,$scope.AddOnOther];
	    for (var i=0;i<addOnsArray.length;i++) {
	    	if (typeof addOnsArray[i] !== "undefined") {
	    		addOns += addOnsArray[i] + ", ";		
	    	};
	    };
	    addOns = addOns.substring(0, addOns.length - 2);
	    console.log(addOns);
		var inputTime = Firebase.ServerValue.TIMESTAMP;
	        switch ($scope.servicesReceived) {
				case "tv":
			        $scope.tip.add({
			        	providerName: $scope.providerName, servicesReceived: $scope.servicesReceived, lengthContract: $scope.lengthContract, contractType: $scope.contractType, priceMonthly: $scope.priceMonthly, TVPackage: $scope.TVradio, numberTotalTV: $scope.totalTV, numberHDTV: $scope.totalHDTV, numberDVRTV: $scope.totalDVRTV, addOns: addOns, inputTime: inputTime, createdByUserID: window.userID
			        });
					break;
				case "tv-internet":
			        $scope.tip.add({
			        	providerName: $scope.providerName, servicesReceived: $scope.servicesReceived, lengthContract: $scope.lengthContract, contractType: $scope.contractType, priceMonthly: $scope.priceMonthly, TVPackage: $scope.TVradio, numberTotalTV: $scope.totalTV, numberHDTV: $scope.totalHDTV, numberDVRTV: $scope.totalDVRTV, AddOnHBO: $scope.AddOnHBO, AddOnShowtime: $scope.AddOnShowtime, AddOnStarz: $scope.AddOnStarz, AddOnCinemax: $scope.AddOnCinemax, AddOnSports: $scope.AddOnSports, AddOnLatino: $scope.AddOnLatino, AddOnInt: $scope.AddOnInt, AddOnOther: $scope.AddOnOther, internetPackage: $scope.internetRadio, inputTime: inputTime, createdByUserID: window.userID
			        });
					break;
				case "tv-internet-phone":
			        $scope.tip.add({
			        	providerName: $scope.providerName, servicesReceived: $scope.servicesReceived, lengthContract: $scope.lengthContract, contractType: $scope.contractType, priceMonthly: $scope.priceMonthly, TVPackage: $scope.TVradio, numberTotalTV: $scope.totalTV, numberHDTV: $scope.totalHDTV, numberDVRTV: $scope.totalDVRTV, AddOnHBO: $scope.AddOnHBO, AddOnShowtime: $scope.AddOnShowtime, AddOnStarz: $scope.AddOnStarz, AddOnCinemax: $scope.AddOnCinemax, AddOnSports: $scope.AddOnSports, AddOnLatino: $scope.AddOnLatino, AddOnInt: $scope.AddOnInt, AddOnOther: $scope.AddOnOther, internetPackage: $scope.internetRadio, phonePackage: $scope.phoneRadio, inputTime: inputTime, createdByUserID: window.userID
			        });
					break;
				case "internet-phone":
			        $scope.tip.add({
			        	providerName: $scope.providerName, servicesReceived: $scope.servicesReceived, lengthContract: $scope.lengthContract, contractType: $scope.contractType, priceMonthly: $scope.priceMonthly, internetPackage: $scope.internetRadio, phonePackage: $scope.phoneRadio, inputTime: inputTime, createdByUserID: window.userID
			        });
					break;
				case "tv-phone":
			        $scope.tip.add({
			        	providerName: $scope.providerName, servicesReceived: $scope.servicesReceived, lengthContract: $scope.lengthContract, contractType: $scope.contractType, priceMonthly: $scope.priceMonthly, TVPackage: $scope.TVradio, numberTotalTV: $scope.totalTV, numberHDTV: $scope.totalHDTV, numberDVRTV: $scope.totalDVRTV, AddOnHBO: $scope.AddOnHBO, AddOnShowtime: $scope.AddOnShowtime, AddOnStarz: $scope.AddOnStarz, AddOnCinemax: $scope.AddOnCinemax, AddOnSports: $scope.AddOnSports, AddOnLatino: $scope.AddOnLatino, AddOnInt: $scope.AddOnInt, AddOnOther: $scope.AddOnOther, phonePackage: $scope.phoneRadio, inputTime: inputTime, createdByUserID: window.userID
			        });
					break;
				default:
			        console.log("Not pushing the data")																							
		    }
	    }
	}]);



// //Need to iron out how to save tip under user object - do I need to change 'add' method to set?

// 'providerName': providerName, 'servicesReceived': servicesReceived, 'lengthContract': lengthContract, 'contractType': contractType, 'priceMonthly': priceMonthly, 'TVPackage': TVPackage, 'numberTotalTV': numberTotalTV, 'numberHDTV': numberHDTV, 'numberDVRTV': numberDVRTV, 'addOns': addOns, 'internetPackage': internetPackage, 'phonePackage': phonePackage, 'inputTime': inputTime}, function(error) {
// 					if(!error) {
// 						var name = id.name();
// 						myProviderRef.child("/users/"+window.userID+"/tips/"+name).set(true, function(error) {
// 							if(!error) {
// 								window.location.href="http://www.cabletipster.com/address-input.html";
// 							}
// 						});
// 						}
// 					});	



//  	switch (providerServices) {
// 			case "tv":
// 				 id.set({'id': id.name(), 'providerName': providerName, 'servicesReceived': servicesReceived, 'lengthContract': lengthContract, 'contractType': contractType, 'priceMonthly': priceMonthly, 'TVPackage': TVPackage, 'numberTotalTV': numberTotalTV, 'numberHDTV': numberHDTV, 'numberDVRTV': numberDVRTV, 'addOns': addOns, 'inputTime': inputTime}, function(error) {
// 					if(!error) {
// 						var name = id.name();
// 						myProviderRef.child("/users/"+window.userID+"/tips/"+name).set(true, function(error) {
// 							if(!error) {
// 								window.location.href="http://www.cabletipster.com/address-input.html";
// 							}
// 						});
// 						}
// 					});				
// 				break;
// 			case "tv-internet":
// 				 id.set({'providerName': providerName, 'servicesReceived': servicesReceived, 'lengthContract': lengthContract, 'contractType': contractType, 'priceMonthly': priceMonthly, 'TVPackage': TVPackage, 'numberTotalTV': numberTotalTV, 'numberHDTV': numberHDTV, 'numberDVRTV': numberDVRTV, 'addOns': addOns, 'internetPackage': internetPackage, 'inputTime': inputTime}, function(error) {
// 					if(!error) {
// 						var name = id.name();
// 						myProviderRef.child("/users/"+window.userID+"/tips/"+name).set(true, function(error) {
// 							if(!error) {
// 								window.location.href="http://www.cabletipster.com/address-input.html";
// 							}
// 						});
// 						}
// 					});				
// 				break;
// 			case "internet":
// 				 id.set({'providerName': providerName, 'servicesReceived': servicesReceived, 'lengthContract': lengthContract, 'contractType': contractType, 'priceMonthly': priceMonthly, 'internetPackage': internetPackage, 'inputTime': inputTime}, function(error) {
// 					if(!error) {
// 						var name = id.name();
// 						myProviderRef.child("/users/"+window.userID+"/tips/"+name).set(true, function(error) {
// 							if(!error) {
// 								window.location.href="http://www.cabletipster.com/address-input.html";
// 							}
// 						});
// 						}
// 					});				
// 				break;
// 			case "tv-internet-phone":
// 				 id.set({'providerName': providerName, 'servicesReceived': servicesReceived, 'lengthContract': lengthContract, 'contractType': contractType, 'priceMonthly': priceMonthly, 'TVPackage': TVPackage, 'numberTotalTV': numberTotalTV, 'numberHDTV': numberHDTV, 'numberDVRTV': numberDVRTV, 'addOns': addOns, 'internetPackage': internetPackage, 'phonePackage': phonePackage, 'inputTime': inputTime}, function(error) {
// 					if(!error) {
// 						var name = id.name();
// 						myProviderRef.child("/users/"+window.userID+"/tips/"+name).set(true, function(error) {
// 							if(!error) {
// 								window.location.href="http://www.cabletipster.com/address-input.html";
// 							}
// 						});
// 						}
// 					});	
// 				break;
// 			case "internet-phone":
// 				 id.set({'providerName': providerName, 'servicesReceived': servicesReceived, 'lengthContract': lengthContract, 'contractType': contractType, 'priceMonthly': priceMonthly, 'internetPackage': internetPackage, 'phonePackage': phonePackage, 'inputTime': inputTime}, function(error) {
// 					if(!error) {
// 						var name = id.name();
// 						myProviderRef.child("/users/"+window.userID+"/tips/"+name).set(true, function(error) {
// 							if(!error) {
// 								window.location.href="http://www.cabletipster.com/address-input.html";
// 							}
// 						});
// 						}
// 					});				
// 				break;	
// 			case "tv-phone":
// 				 id.set({'providerName': providerName, 'servicesReceived': servicesReceived, 'lengthContract': lengthContract, 'contractType': contractType, 'priceMonthly': priceMonthly, 'phonePackage': phonePackage, 'inputTime': inputTime}, function(error) {
// 					if(!error) {
// 						var name = id.name();
// 						myProviderRef.child("/users/"+window.userID+"/tips/"+name).set(true, function(error) {
// 							if(!error) {
// 								window.location.href="http://www.cabletipster.com/address-input.html";
// 							}
// 						});
// 						}
// 					});						
// 				break;
// 			default:
// 				console.log("Please select a service type to continue.")
// 		};
// 		currentTipRef.once('value', function(snap) {
// 			snap.forEach(function(child) {
// 				console.log("key name is: " + child.name());
// 				console.log(id.name());
// 			});
// 		});
//  };	