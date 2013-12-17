// jQuery Script

$(document).ready(function() {
//Generation of user ID for email
/*	$('#register').click(function () {
       	  var dateTimeID = new Date().getTime();
		  var randomID = Math.floor(Math.random()*9000) + 1000;
		  var userID = dateTimeID.toString() + randomID.toString();
	});*/
//Initiate chosen and set width
	$(".chosen-select").chosen({width: "300px"});
//Dynamically add sections of provider form based on input
//	$("input[name='provider-radio']").change(function() {
	$('#providerName').change(function() {
		console.log("value has changed");
		$('#providerSecondaryForm, #providerTertiaryForm').find('input:text, input:password, input:file, textarea').val('');
		$('#providerSecondaryForm, #providerTertiaryForm').find(':checked, :selected').removeAttr('checked').removeAttr('selected');
		$('#servicesReceivedDropdown, #providerTertiaryForm').hide();
		$('.chosen-select').trigger("chosen:updated");
		$('#providerButton').hide();
		$('#servicesReceivedDropdown').show();
	});
	$('#servicesReceived').change(function() {
		var provider = $('#providerName').val();
		console.log(provider);
		var providerServices = $('#servicesReceived').val();
		$('#providerTertiaryForm > div').hide();
		$('#providerTertiaryForm' ).show();
		$('#providerSecondSection').show();
		switch (providerServices) {
			case "tv":
				$("#"+provider+"-TV").show();
				$('#providerButton').show();
				break;
			case "tv-internet":
				$("#"+provider+"-TV").show();
				$("#"+provider+"-internet").show();
				$('#providerButton').show();
				break;
			case "internet":
				$("#"+provider+"-internet").show();
				$('#providerButton').show();
				break;
			case "tv-internet-phone":
				$("#"+provider+"-TV").show();
				$("#"+provider+"-internet").show();
				$("#"+provider+"-phone").show();
				$('#providerButton').show();	
				break;
			case "internet-phone":
				$("#"+provider+"-internet").show();
				$("#"+provider+"-phone").show();
				$('#providerButton').show();	
				break;	
			case "tv-phone":
				$("#"+provider+"-TV").show();
				$("#"+provider+"-phone").show();
				$('#providerButton').show();	
				break;
			default:
				console.log("Please select a service type to continue.")
		};
	});
//Hide spans with no value
	$("span[value='']").hide();
//Initiate iCheck
	$('input').iCheck({
	    checkboxClass: 'icheckbox_square-orange',
    	radioClass: 'iradio_square-orange',
	});
 });

	
//Handle Logout
function userLogout() {
	auth.logout();
}

//Handle Provider input submission
 function ProviderInputButtonClicked() {
	var myProviderRef = new Firebase('https://dev-cabletipster.firebaseio.com'); 
	var providerName = $('#providerName').val();
//	var providerNameRadio = $("input[type='radio'][name='provider-radio']:checked");
//	console.log(providerNameRadio);
//	if (providerNameRadio.length > 0) {
//		var providerName = providerNameRadio.val();
//	};
 	var servicesReceived = $('#servicesReceived').val();
	var lengthContract = $('#lengthContract').val();
	var contractType = $('#contractType').val(); 
	var priceMonthly = parseInt($('#priceMonthly').val());
	var inputTime = Firebase.ServerValue.TIMESTAMP;
	var TVPackageRadio = $("input[type='radio'][name='TV-radio']:checked");
		if (TVPackageRadio.length > 0) {
		    var TVPackage = TVPackageRadio.val();
		};
	var numberTotalTV = $('#total-tv-input').val();
	var numberHDTV = $('#hd-tv-input').val();
	var numberDVRTV = $('#dvr-tv-input').val();
	var addOns = $('input:checkbox:checked.TV-addon').map(function() {
		return this.value;
		}).get();
	var internetPackageRadio = $("input[type='radio'][name='internet-radio']:checked");
		if (internetPackageRadio.length > 0) {
			var internetPackage = internetPackageRadio.val();
		}	;
	var phonePackageRadio = $("input[type='radio'][name='phone-radio']:checked");
		if (phonePackageRadio.length > 0) {
			var phonePackage = phonePackageRadio.val();
		};
	var id = myProviderRef.child("/tips").push();
	var averageRef = myProviderRef.child("/average_tip");
	var currentTipRef = myProviderRef.child('/tips/').endAt().limit(1);
 	var providerServices = $('#servicesReceived').val();
 	switch (providerServices) {
			case "tv":
				 id.set({'id': id.name(), 'providerName': providerName, 'servicesReceived': servicesReceived, 'lengthContract': lengthContract, 'contractType': contractType, 'priceMonthly': priceMonthly, 'TVPackage': TVPackage, 'numberTotalTV': numberTotalTV, 'numberHDTV': numberHDTV, 'numberDVRTV': numberDVRTV, 'addOns': addOns, 'inputTime': inputTime, 'createdByUserID': window.userID}, function(error) {
					if(!error) {
						var name = id.name();
						myProviderRef.child("/users/"+window.providerID+"/"+window.userID+"/tips/"+name).set(true, function(error) {
							if(!error) {
								window.location.href="http://dev33.cabletipster.com/address-input.html";
							}
						});
						}
					});				
				break;
			case "tv-internet":
				 id.set({'providerName': providerName, 'servicesReceived': servicesReceived, 'lengthContract': lengthContract, 'contractType': contractType, 'priceMonthly': priceMonthly, 'TVPackage': TVPackage, 'numberTotalTV': numberTotalTV, 'numberHDTV': numberHDTV, 'numberDVRTV': numberDVRTV, 'addOns': addOns, 'internetPackage': internetPackage, 'inputTime': inputTime, 'createdByUserID': window.userID}, function(error) {
					if(!error) {
						var name = id.name();
						myProviderRef.child("/users/"+window.providerID+"/"+window.userID+"/tips/"+name).set(true, function(error) {
							if(!error) {
								window.location.href="http://dev33.cabletipster.com/address-input.html";
							}
						});
						}
					});				
				break;
			case "internet":
				 id.set({'providerName': providerName, 'servicesReceived': servicesReceived, 'lengthContract': lengthContract, 'contractType': contractType, 'priceMonthly': priceMonthly, 'internetPackage': internetPackage, 'inputTime': inputTime, 'createdByUserID': window.userID}, function(error) {
					if(!error) {
						var name = id.name();
						myProviderRef.child("/users/"+window.providerID+"/"+window.userID+"/tips/"+name).set(true, function(error) {
							if(!error) {
								window.location.href="http://dev33.cabletipster.com/address-input.html";
							}
						});
						}
					});				
				break;
			case "tv-internet-phone":
				 id.set({'providerName': providerName, 'servicesReceived': servicesReceived, 'lengthContract': lengthContract, 'contractType': contractType, 'priceMonthly': priceMonthly, 'TVPackage': TVPackage, 'numberTotalTV': numberTotalTV, 'numberHDTV': numberHDTV, 'numberDVRTV': numberDVRTV, 'addOns': addOns, 'internetPackage': internetPackage, 'phonePackage': phonePackage, 'inputTime': inputTime, 'createdByUserID': window.userID}, function(error) {
					if(!error) {
						var name = id.name();
						myProviderRef.child("/users/"+window.providerID+"/"+window.userID+"/tips/"+name).set(true, function(error) {
							if(!error) {
								window.location.href="http://dev33.cabletipster.com/address-input.html";
							}
						});
						}
					});	
				break;
			case "internet-phone":
				 id.set({'providerName': providerName, 'servicesReceived': servicesReceived, 'lengthContract': lengthContract, 'contractType': contractType, 'priceMonthly': priceMonthly, 'internetPackage': internetPackage, 'phonePackage': phonePackage, 'inputTime': inputTime, 'createdByUserID': window.userID}, function(error) {
					if(!error) {
						var name = id.name();
						myProviderRef.child("/users/"+window.providerID+"/"+window.userID+"/tips/"+name).set(true, function(error) {
							if(!error) {
								window.location.href="http://dev33.cabletipster.com/address-input.html";
							}
						});
						}
					});				
				break;	
			case "tv-phone":
				 id.set({'providerName': providerName, 'servicesReceived': servicesReceived, 'lengthContract': lengthContract, 'contractType': contractType, 'priceMonthly': priceMonthly, 'phonePackage': phonePackage, 'inputTime': inputTime, 'createdByUserID': window.userID}, function(error) {
					if(!error) {
						var name = id.name();
						myProviderRef.child("/users/"+window.providerID+"/"+window.userID+"/tips/"+name).set(true, function(error) {
							if(!error) {
								window.location.href="http://dev33.cabletipster.com/address-input.html";
							}
						});
						}
					});						
				break;
			default:
				console.log("Please select a service type to continue.")
		};
		currentTipRef.once('value', function(snap) {
			snap.forEach(function(child) {
				console.log("key name is: " + child.name());
				console.log(id.name());
			});
		});
 };	
 
 //Handle Address input submission
function AddressInputButtonClicked() {
	var myProviderRef = new Firebase('https://dev-cabletipster.firebaseio.com/users/'+window.userID);
	var address1 = $('#address1').val();
	var address2 = $('#address2').val();
	var city = $('#city').val();
	var state = $('#state').val();
	var zipCode = parseInt($('#zipCode').val());
	console.log("key name is: " + window.tipID);
// Save Tip info
	var AddressRef = new Firebase('https://dev-cabletipster.firebaseio.com/tips/'+window.tipID).update({'address1': address1, 'address2': address2, 'city': city, 'state': state, 'zipCode': zipCode, 'createdByUserID': window.userID}, function(error) {
		if(!error) {
			var UserRef = new Firebase('https://dev-cabletipster.firebaseio.com/users/'+window.providerID+"/"+window.userID).update({'address1': address1, 'address2': address2, 'city': city, 'state': state, 'zipCode': zipCode}, function(error) {
// Save Average Tip info
				if(!error) {
					var priceMonthlyRef = new Firebase('https://dev-cabletipster.firebaseio.com/tips/'+window.tipID+'/priceMonthly');
					var servicesReceivedRef = new Firebase('https://dev-cabletipster.firebaseio.com/tips/'+window.tipID+'/servicesReceived');
					priceMonthlyRef.once('value', function(snap) {
						var priceMonthly = snap.val();
						servicesReceivedRef.once('value', function(snap2) {
							var servicesReceived = snap2.val();
							console.log(priceMonthly+' '+servicesReceived);
							new Firebase('https://dev-cabletipster.firebaseio.com/average_tip/'+zipCode+'/'+servicesReceived).transaction(function(curr) {
						        if( !curr) { curr = { total_records: 0, average_amount: 0, total_amount: 0 }; }
						        
						        // increment totals each time I save a tip
						        curr.total_records++;
						        curr.total_amount += priceMonthly;
						        curr.average_amount = curr.total_amount / curr.total_records;
						        
						        return curr;
						    }, function(error, committed) {
						        if( error ) {
						            console.log(error);
						        // }
						        // else if( committed ) {
						            
						        //     // write the amount to the tips path if totals update successfully
						        //     new Firebase('URL/tips/').push(tip);
						            
						        }
						    }); 
						})
					});
					window.location.href="provider-output.html";
				}	
			});				
		}	
	});
};


