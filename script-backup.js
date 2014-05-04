// MAPA
var map;
var markerFrom;
var markerTo;
var myLatlng;
function initialize() {
	var myCenter = new google.maps.LatLng(39.828127,-98.579404);
	var mapOptions = {
		zoom: 3,
		disableDefaultUI: true,
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
			if (status == google.maps.GeocoderStatus.OK) {
				if (results[1]) {
					alert(results[1].formatted_address);
				} else {
					alert('No results found');
				}
			} else {
					alert('Geocoder failed due to: ' + status);
			}
		});
	});
}

google.maps.event.addDomListener(window, 'load', initialize);
// MAPA KRAJ

// FLIP
var init = function() {			  
  $('#flip').click(function(){
  		var a = $(".ad-card-text").css("opacity");
  		a = a.split('.');
  		if (a[0] == 0) {
			$(".ad-card-text").css("opacity", "1.0");
			$("#flip-card").toggleClass('flipped');
		} else {
			$("#flip-card").toggleClass('flipped');
			setTimeout(function(){$(".ad-card-text").css("opacity", "0.8")}, 1000);
		};
	});
};

window.addEventListener('DOMContentLoaded', init, false);
// FLIP KRAJ


$(function() {

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
				var flightPlanCoordinates = [
				    new google.maps.LatLng(markerFrom.getPosition().lat(), markerFrom.getPosition().lng()),
				    new google.maps.LatLng(markerTo.getPosition().lat(), markerTo.getPosition().lng())
			  	];

			  	var flightPath = new google.maps.Polyline({
					path: flightPlanCoordinates,
					geodesic: true,
					strokeColor: '#FF0000',
					strokeOpacity: 1.0,
					strokeWeight: 2
				});

				flightPath.setMap(map);
			};

			return false;
		}
	})
	.data( "ui-autocomplete" )._renderItem = function( ul, item ) {
		return $( "<li>" )
		.append( "<a>" + item.label + "</a>" )
		.appendTo( ul );
	};

	$("#date").datepicker();

});