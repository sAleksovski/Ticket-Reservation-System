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
    						map: map,
    						title: "Click to remove"
						});
						$("#from").val(results[1].address_components[results[1].address_components.length - 2].long_name);

						google.maps.event.addListener(markerFrom, 'click', function() {
							removeMarker(markerFrom);
						});

						if (markerTo != null) {
							drawPath();
						};
					}

					// Fill #to field and draw  path
					else if (markerTo == null) {
    					markerTo = new google.maps.Marker({
   						 	position: event.latLng, 
    						map: map,
    						title: "Click to remove"
						});
						$("#to").val(results[1].address_components[results[1].address_components.length - 2].long_name);

						google.maps.event.addListener(markerTo, 'click', function() {
							removeMarker(markerTo);
						});

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

$(function() {
	// firefox remember input on reload fix
	$(".input").val("");

	$("#date-return-div").hide();
	$("#results").hide();

	var viewMoreOpen = false;

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
				title: "Click to remove"
			});
			google.maps.event.addListener(markerFrom, 'click', function() {
				removeMarker(markerFrom);
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
				title: "Click to remove"
			});

			google.maps.event.addListener(markerTo, 'click', function() {
				removeMarker(markerTo);
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
			flip(true);
		};
	});

	$("#from").focusout(function() {
		if ($("#from").val().trim().length == 0 && $("#to").val().trim().length == 0 &&
			!$("#flip-card").is(":hover") && ! $("#to").is(":hover") ) {
			flip(false);
		};		
	});

	$("#to").focusin(function() {
		if (! $("#flip-card").hasClass("flipped")) {
			flip(true);
		};
	});

	$("#to").focusout(function() {
		if ($("#from").val().trim().length == 0 && $("#to").val().trim().length == 0 &&  ! $("#from").is(":hover")
			&& ! $("#flip-card").is(":hover") ) {
			flip(false);
		};
	});

	$("#date").datepicker({ minDate: 0, maxDate: "+1Y" });
	$("#date-return").datepicker({ minDate: 0, maxDate: "+1Y" });

	$( "#link-second-tab" ).click(function() {
		$("#date-return-div").show();
		$("#link-first-tab").removeClass("ui-state-active");
		$("#link-second-tab").addClass("ui-state-active");
	});

	$( "#link-first-tab" ).click(function() {
		$("#date-return-div").hide();
		$("#link-second-tab").removeClass("ui-state-active");
		$("#link-first-tab").addClass("ui-state-active");
	});

	$("#button-search").click(function() {
		search();
		if (! $("#results").is(":visible") ) {
			$("#results").slideToggle( "slow");
		};

		$("html,body").animate({
			    scrollTop: $("#results").offset().top - 10
		});
	});

	$(".city-block").click(function() {
		var string = $(this).find(".state-name").html();
		string = string.substring(0, string.length - 5);
		
		// trigger autocomplete event
		var keyEvent = $.Event("keydown");          
		keyEvent.keyCode = $.ui.keyCode.DOWN;  // event for pressing "down" key
		$("#to").val(string);
		$("#to").trigger(keyEvent);  // Press "down" key twice to select first Item
		$("#to").trigger(keyEvent);
		keyEvent.keyCode = $.ui.keyCode.ENTER; // event for pressing the "enter" key
		$("#to").trigger(keyEvent); 
	});

	$(".expand-city-guide").click(function() {
		if(viewMoreOpen) {
			$("#expand-city-div").find("div").addClass("hidden");
			$(".expand-city-guide").html("Show more destionations");
		}
		else {
			$("#expand-city-div").find("div").removeClass("hidden");
			$(".expand-city-guide").html("Show less destionations");
		}
		viewMoreOpen = !viewMoreOpen;
	});

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

// remove marker from map and set null the marker
function removeMarker (marker) {
	marker.setMap(null);
	flightPath.setMap(null);
	if(marker == markerFrom) {
		$("#from").val("");
		markerFrom = null;
	}
	else if(marker == markerTo) {
		$("#to").val("");
		markerTo = null;
	}
}

function flip (addClass) {
	if (addClass) {
		$(".ad-card-text").css("opacity", "1.0");
		$("#flip-card").addClass('flipped');
	} else {
		$("#flip-card").removeClass('flipped');
		setTimeout(function(){$(".ad-card-text").css("opacity", "0.8")}, 1000);
	};
}

function search() {
	$("#results").html("<div id=\"container\"><div class=\"stick\"></div><div class=\"stick\"></div><div class=\"stick\"></div><div class=\"stick\"></div><div class=\"stick\"></div><div class=\"stick\"></div><h1>Loading...</h1></div>");
	var table;
	
	var noFlight = (27 * generateRandom(0, 10)) % 10;
	alert(noFlight);
	if(noFlight >= (9 - parseInt($("#class").prop("selectedIndex")))) {
		table = "<p>Sorry, no flights match your search terms.</p>"
	}
	else {
		table = "<table id=\"results-table\"><thead><tr><th>From</th><th>To</th><th>Date Depart</th>" + (isEmpty($("#date-return").val()) ? "" :  "<th>Date Return</th>") +"<th>Departure</th><th>Arrival</th><th>Class</th><th>Price</th><th>Book</th></tr></thead><tbody>";
		var n = generateRandom(3, 9);
		for (var i = 0; i < n; i++) {
			var hour = (generateRandom(0, 12) + 27 * i) % 12;
			var min = (generateRandom(0, 60) + 27 * i) % 60;
			min = Math.round(min / 5) * 5;
			var timeFrom = (hour < 10 ? "0" : "") + hour + ":" + (min < 10 ? "0" : "") + min + " AM";
			
			hour = (generateRandom(0, 12) + 27 * (n - i)) % 12;
			min = (generateRandom(0, 60) + 27 * (n - i)) % 60;
			min = Math.round(min / 5) * 5;
			var timeArr = (hour < 10 ? "0" : "") + hour + ":" + (min < 10 ? "0" : "") + min + " PM";

			var price = generateRandom(200, 900) * (parseInt($( "#seats option:selected" ).text())/2.0 + 0.5);
			price += price * ((generateRandom(0, 6) + 27 * i) % 5) / 10.0 
			price += price * parseInt($("#class").prop("selectedIndex")) * 0.2;
			price = Math.round(price);

			var row = "<tr><td>" + $("#from").val() + "</td><td>" + $("#to").val() + "</td><td>"
			+ $("#date").val() + "</td>" + (isEmpty($("#date-return").val()) ? "" : ("<td>" + $("#date-return").val() + "</td>")) + "<td>" + timeFrom + "</td><td>" + timeArr + "</td><td>" + "Economy"
			+ "</td><td>" + "$ " + price +"</td><td>" + "BOOK BUTTON" + "</td></tr>";
			table += row;
		};
		table += "</tbody></table>";
	}
	setTimeout(function(){$("#results").html(table)}, 2000);
	setTimeout(function(){$("#results-table").tablesorter({
		textExtraction: function(node){ 
            // for numbers formattted like $1,000.50 e.g. English
            return $(node).text().replace(/[,$£€]/g,'');
         }
	})}, 2100);
}

function isEmpty(str) {
    return (!str || 0 === str.length);
}

function generateRandom(from, to) {
	var sum = 0;
	for (var i = 0; i < $("#from").val().length; i++) {
		sum += $("#from").val().charCodeAt(i);
	};
	for (var i = 0; i < $("#to").val().length; i++) {
		sum += $("#to").val().charCodeAt(i);
	};
	var nums = $("#date").val().split('/');
	for (var i = 0; i < nums.length; i++) {
		sum += parseInt(nums[i]);
	};

	return sum % (to - from) + from;
}