var geocoder;
var tips = { };
var map;

function initialize() {
	geocoder = new google.maps.Geocoder();
	var latlng = new google.maps.LatLng(37.7789, -122.3917);
	var mapOptions = {
	    center: latlng,
	    zoom: 14,
	    mapTypeId: google.maps.MapTypeId.ROADMAP
	};
	map = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);
}

function codeAddress() {
	initialize();
	var scope = angular.element($("#addressDiv")).scope();
	scope.safeApply(function(){
		scope.disableButton = true;
	});
  	var address = document.getElementById('streetAddress').value +", "+document.getElementById('zipCode').value;
  	geocoder.geocode( { 'address': address, 'region': 'US'}, function(results, status) {
	    if (status == google.maps.GeocoderStatus.OK) {
	    	window.lat = results[0].geometry.location.lat();
	    	console.log(window.lat);
	    	window.lng = results[0].geometry.location.lng();
	    	console.log(window.lng);
	    	window.neighborhood=null;
			if (results[0].address_components) {
			
			    for (var i in results[0].address_components) {
			        if (typeof(results[0].address_components[i]) === "object" && results[0].address_components[i].types[0] == "street_number") {
			            window.streetNumber= results[0].address_components[i].long_name;
			        } else if (typeof(results[0].address_components[i]) === "object" && results[0].address_components[i].types[0] == "route") {
			            window.streetName= results[0].address_components[i].short_name;
			        } else if (typeof(results[0].address_components[i]) === "object" && results[0].address_components[i].types[0] == "neighborhood") {
			            window.neighborhood= results[0].address_components[i].short_name;
			        } else if (typeof(results[0].address_components[i]) === "object" && results[0].address_components[i].types[0] == "locality") {
			            window.city= results[0].address_components[i].long_name;
			        } else if (typeof(results[0].address_components[i]) === "object" && results[0].address_components[i].types[0] == "administrative_area_level_1") {
			            window.state= results[0].address_components[i].short_name;
			        } else if (typeof(results[0].address_components[i]) === "object" && results[0].address_components[i].types[0] == "postal_code") {
			            window.zipCode= results[0].address_components[i].long_name;
			        }   
			    }
			}
			console.log(window.streetNumber+", "+window.streetName+", "+window.neighborhood+", "+window.state+", "+window.zipCode);    	
	    	map.setCenter(results[0].geometry.location);
			var circle = new google.maps.Circle({
				strokeColor: '#FF0000',
			    strokeOpacity: 0.8,
			    strokeWeight: 2,
			    fillColor: '#FF0000',
			    fillOpacity: 0.35,
			    map: map,
			    center: results[0].geometry.location,
			    radius: 1000
			})
	    	// var marker = new google.maps.Marker({
	     //    	map: map,
	     //    	position: results[0].geometry.location
	     //  	});
	      	window.address = window.streetNumber+" "+window.streetName;
			scope.safeApply(function(){
		        scope.addTip();
		    });
	  //       var TipRef= new Firebase('https://dev-cabletipster.firebaseio.com/tips');
			// TipRef.push({
	  //       	'address': address, 'neighborhood': neighborhood, 'city': city, 'state': state, 'zipCode': zipCode
	  //       }, function(error) {
			//     // window.location.href="provider-output.html";
			// })
	    } else {
	      	alert('We could not find that address. Please try again.');
	    }
	});
}	

// var f = new Firebase('https://dev-cabletipster.firebaseio.com/tips');

// function newTip(tip, firebaseId) {
//     var tipLatLng = new google.maps.LatLng(tip.lat, tip.lng);
//     var marker = new google.maps.Marker({position: tipLatLng, map: map });
//     tips[firebaseId] = marker;
// }

// f.once("value", function(s) {
//   s.forEach(function(b) {
//     newTip(b.val(), b.name());
//   });
// });

// // == a checkbox has been clicked ==
// function boxclick(box,category) {
// 	console.log()
// 	if (box.checked) {
// 		show(category);
// 	} else {
//     	hide(category);
// 	}
// }

