// MAPA
var map;
var markerFrom;
var markerTo;
var myLatlng;
var flightPath;

// handling user click on map and initializing map
function initialize() {
	var myCenter = new google.maps.LatLng(39.828127,-98.579404);
	var mapOptions = {
		zoom: 3,
		//disableDefaultUI: true,
		center: myCenter
	}
	map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

	google.maps.event.addListener(map, 'click', function(event) {
    	//alert(event.latLng);
		var input = String(event.latLng);
		input = input.replace("(","");
		input = input.replace(")","");
		var latlngStr = input.split(',', 2);
		var lat = parseFloat(latlngStr[0]);
		var lng = parseFloat(latlngStr[1]);
		var latlng = new google.maps.LatLng(lat, lng);
    	var geocoder = new google.maps.Geocoder();
    	geocoder.geocode({'latLng': latlng}, function(results, status) {
			if (status == google.maps.GeocoderStatus.OK && results[1]) {
					// user clicked on US and return result is in accepted format
    				if(results[1].address_components[results[1].address_components.length - 1].short_name == "US" &&
    					results[1].address_components[results[1].address_components.length - 2].short_name != "US") {

    					//Fill #from field
    					if (markerFrom == null) {
	    					markerFrom = new google.maps.Marker({
       						 	position: event.latLng, 
        						map: map
    						});
							$("#from").val(results[1].address_components[results[1].address_components.length - 2].long_name);
						}

						// Fill #to field and draw  path
						else if (markerTo == null) {
	    					markerTo = new google.maps.Marker({
       						 	position: event.latLng, 
        						map: map
    						});
							$("#to").val(results[1].address_components[results[1].address_components.length - 2].long_name);

							if (markerFrom != null) {
								drawPath();
							};
						}
					}
			}
		});
	});
}

// drawing a line between two markers on map
function drawPath () {
	var flightPlanCoordinates = [
				    new google.maps.LatLng(markerFrom.getPosition().lat(), markerFrom.getPosition().lng()),
				    new google.maps.LatLng(markerTo.getPosition().lat(), markerTo.getPosition().lng())
			  	];

			  	if (flightPath != null)
				  		flightPath.setMap(null);

			  	flightPath = new google.maps.Polyline({
					path: flightPlanCoordinates,
					geodesic: true,
					strokeColor: '#FF0000',
					strokeOpacity: 1.0,
					strokeWeight: 2
				});

				flightPath.setMap(map);
}

google.maps.event.addDomListener(window, 'load', initialize);
// MAPA KRAJ

// FLIP
var init = function() {			  
  $('#flip').click(function(){
  		/*var a = $(".ad-card-text").css("opacity");
  		a = a.split('.');
  		if (a[0] == 0) {
			$(".ad-card-text").css("opacity", "1.0");
			$("#flip-card").toggleClass('flipped');
		} else {
			$("#flip-card").toggleClass('flipped');
			setTimeout(function(){$(".ad-card-text").css("opacity", "0.8")}, 1000);
		};*/
		if ($("#flip-card").hasClass('flipped')) {
			flip(false);
		}
		else {
			flip(true); 
		};
	});
};

window.addEventListener('DOMContentLoaded', init, false);
// FLIP KRAJ


$(function() {
	$("#test").click(function() {
		alert(contains("Alaska"));
		alert(contains("dasdasds"));	
	}); 

	$( "#from" ).autocomplete({
		minLength: 0,
		source: stateCoor,
		focus: function( event, ui ) {
			$( "#from" ).val( ui.item.label );
			return false;
		},
		select: function( event, ui ) {
			$( "#from" ).val( ui.item.label );
			myLatlng = new google.maps.LatLng(ui.item.lat,ui.item.lon);
			
			if (markerFrom != null) {markerFrom.setMap(null);	};
			var image = "start.png";
			markerFrom = new google.maps.Marker({
				position: myLatlng,
				map: map,
				//icon: image,
				title: ui.item.label
			});
			google.maps.event.addListener(markerFrom, 'click', function() {
				$("#from_click").html(markerFrom.title);
			});

			if (markerTo != null) {
				drawPath();
			};
			//initialize();

			return false;
		}
	})
	.data( "ui-autocomplete" )._renderItem = function( ul, item ) {
		return $( "<li>" )
		.append( "<a>" + item.label + "</a>" )
		.appendTo( ul );
	};

	$( "#to" ).autocomplete({
		minLength: 0,
		source: stateCoor,
		focus: function( event, ui ) {
			$( "#to" ).val( ui.item.label );
			return false;
		},
		select: function( event, ui ) {
			$( "#to" ).val( ui.item.label );
			myLatlng = new google.maps.LatLng(ui.item.lat,ui.item.lon);
			
			if (markerTo != null) {markerTo.setMap(null);	};
			var image = "finish.png";
			markerTo = new google.maps.Marker({
				position: myLatlng,
				map: map,
				//icon: image,
				title: ui.item.label
			});

			google.maps.event.addListener(markerTo, 'click', function() {
				$("#to_click").html(markerTo.title);
			});
			//initialize();

			if (markerFrom != null) {
				drawPath();
			};

			return false;
		}
	})
	.data( "ui-autocomplete" )._renderItem = function( ul, item ) {
		return $( "<li>" )
		.append( "<a>" + item.label + "</a>" )
		.appendTo( ul );
	};

	$("#from").focusin(function() {
		if (! $("#flip-card").hasClass("flipped")) {
			//$("#flip-card").addClass('flipped');
			flip(true);
		};
		

	});

	$("#from").focusout(function() {
		if ($("#from").val().trim().length == 0 && $("#to").val().trim().length == 0 &&
			!$("#flip-card").is(":hover") && ! $("#to").is(":hover") ) {
			flip(false);
			//$("#flip-card").removeClass('flipped');

		};		
	});

	$("#to").focusin(function() {
		if (! $("#flip-card").hasClass("flipped")) {
			//$("#flip-card").addClass('flipped');
			flip(true);
		};
	});

	$("#to").focusout(function() {
		if ($("#from").val().trim().length == 0 && $("#to").val().trim().length == 0 &&  ! $("#from").is(":hover") ) {
			//$("#flip-card").removeClass('flipped');
			flip(false);
		};
	});
	$("#date").datepicker({ minDate: 0, maxDate: "+1Y" });
	$("#tabs").tabs();

});

function contains (target) {
	var res = false;
	$.each(stateCoor, function(i, item) {
    		if (target.toString().trim() == item.label.toString().trim()) {
    			res = true;
    		};
	})
	return res;
}

function flip (addClass) {
	if (addClass) {
		$(".ad-card-text").css("opacity", "1.0");
		$("#flip-card").addClass('flipped');
		//return;
	} else {
		$("#flip-card").removeClass('flipped');
		setTimeout(function(){$(".ad-card-text").css("opacity", "0.8")}, 1000);
	};
}