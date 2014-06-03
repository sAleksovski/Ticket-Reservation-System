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
						$("#from").removeClass("error");

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
						$("#to").removeClass("error");

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

google.maps.event.addDomListener(window, 'load', initialize);
// MAPA KRAJ

// After loading
$(function() {
	initSearchForm();
	initCityGuide();
});

function initSearchForm() {
	$("input[type=text]").val("");

	$("#date-return-div").hide();
	//$("#results").hide();

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

	$("#date").datepicker({
		minDate: 0,
		maxDate: "+1Y",
		dateFormat: "dd/mm/yy",
		onClose: function () {
			var seldate = $(this).datepicker('getDate');
			if( !isEmpty(seldate)) {
				$("#date").removeClass("error");
			}
		}
	});
	$("#date-return").datepicker({
		minDate: 0,
		maxDate: "+1Y",
		dateFormat: "dd/mm/yy",
		onClose: function () {
			var seldate = $(this).datepicker('getDate');
			if( !isEmpty(seldate)) {
				$("#date-return").removeClass("error");
			}
		}
	});


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
		if (isInvalidForm()) {
			return;
		};
		search();
		if (! $("#results").is(":visible") ) {
			$("#results").slideToggle( "slow");
		};

		$("html,body").animate({
			scrollTop: $("#results").offset().top - 10
		});
	});
}

function initCityGuide() {
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
	var viewMoreOpen = false;
	$(".expand-city-guide").click(function() {
		if(viewMoreOpen) {
			$("#expand-city-div").find("div").addClass("hidden");
			$(".expand-city-guide").html("Show more destionations");
		}
		else {
			if($("#expand-city-div").html() === "") {
				$("#expand-city-div").load( "ajax/city-guide.html", function() {
					$("#expand-city-div").find("div").removeClass("hidden");
					$(".expand-city-guide").html("Show less destionations");
				});
			} else {
				$("#expand-city-div").find("div").removeClass("hidden");
				$(".expand-city-guide").html("Show less destionations");
			};
		};
		viewMoreOpen = !viewMoreOpen;
	});
}

function initBooking() {
	/* Booking */
	//jQuery time
	var current_fs, next_fs, previous_fs; //fieldsets
	var left, opacity, scale; //fieldset properties which we will animate
	var animating; //flag to prevent quick multi-click glitches

	$(".next").click(function(){
		if(animating) return false;
		if(! isBookingValidated()) return false;
		animating = true;
		
		current_fs = $(this).parent();
		next_fs = $(this).parent().next();
		
		//activate next step on progressbar using the index of next_fs
		$("#progressbar li").eq($("fieldset").index(next_fs)).addClass("active");
		
		//show the next fieldset
		next_fs.show(); 
		//hide the current fieldset with style
		current_fs.animate({opacity: 0}, {
			step: function(now, mx) {
				//as the opacity of current_fs reduces to 0 - stored in "now"
				//1. scale current_fs down to 80%
				scale = 1 - (1 - now) * 0.2;
				//2. bring next_fs from the right(50%)
				left = (now * 50)+"%";
				//3. increase opacity of next_fs to 1 as it moves in
				opacity = 1 - now;
				current_fs.css({'transform': 'scale('+scale+')'});
				next_fs.css({'left': left, 'opacity': opacity});
			}, 
			duration: 800, 
			complete: function(){
				current_fs.hide();
				animating = false;
			}, 
			//this comes from the custom easing plugin
			easing: 'easeInOutBack'
		});
	});

	$(".previous").click(function(){
		if(animating) return false;
		animating = true;
		
		current_fs = $(this).parent();
		previous_fs = $(this).parent().prev();
		
		//de-activate current step on progressbar
		$("#progressbar li").eq($("fieldset").index(current_fs)).removeClass("active");
		
		//show the previous fieldset
		previous_fs.show(); 
		//hide the current fieldset with style
		current_fs.animate({opacity: 0}, {
			step: function(now, mx) {
				//as the opacity of current_fs reduces to 0 - stored in "now"
				//1. scale previous_fs from 80% to 100%
				scale = 0.8 + (1 - now) * 0.2;
				//2. take current_fs to the right(50%) - from 0%
				left = ((1-now) * 50)+"%";
				//3. increase opacity of previous_fs to 1 as it moves in
				opacity = 1 - now;
				current_fs.css({'left': left});
				previous_fs.css({'transform': 'scale('+scale+')', 'opacity': opacity});
			}, 
			duration: 800, 
			complete: function(){
				current_fs.hide();
				animating = false;
			}, 
			//this comes from the custom easing plugin
			easing: 'easeInOutBack'
		});
	});

	$(".submit").click(function(){
		return false;
	});

	$("#msform-container").click(function(e){
		if (e.target !== this) return;
		$(this).addClass('hide');
	});

	$("#cc").on('input', function(){
		var text = $(this).val();
		var amex = "34, 37";
		var maestro = "5018, 5020, 5038, 5612, 5893, 6304, 6759, 6761, 6762, 6763, 0604, 6390";
		var mastercard = "51, 52, 53, 54, 55";
		var visa = "4";
		if ( text.length > 1 && amex.indexOf( text.substring(0, 2) ) > -1 ) {
			$('#cc-image').removeClass();
			$('#cc-image').addClass('cc-amex');
		} else if ( text.length > 3 && maestro.indexOf( text.substring(0, 4) ) > -1 ) {
			$('#cc-image').removeClass();
			$('#cc-image').addClass('cc-maestro');
		} else if ( text.length > 1 && mastercard.indexOf( text.substring(0, 2) ) > -1 ) {
			$('#cc-image').removeClass();
			$('#cc-image').addClass('cc-mastercard');
		} else if ( text.length > 0 && visa.indexOf( text.substring(0, 1) ) > -1 ) {
			$('#cc-image').removeClass();
			$('#cc-image').addClass('cc-visa');
		} else {
			$('#cc-image').removeClass();
			$('#cc-image').addClass('cc-generic');
		};
	});

	$('#fs-name1').on('input', function() {
		var text = $(this).val();
		$('#fs-passenger-1-name').html(text);
	});

	$('#fs-name2').on('input', function() {
		var text = $(this).val();
		$('#fs-passenger-2-name').html(text);
	});

	$('#msform input[type=text]').on('input', function(){
		$(this).removeClass('error');
	});

	$("#fs-birth1").datepicker({
		changeMonth: true,
		changeYear: true,
		yearRange:'-100:-6',
		defaultDate: "10/02/1994",
		dateFormat: "dd/mm/yy",
		onClose: function() {
			$('#fs-birth1').removeClass('error');
			var b = $(this).datepicker('getDate');
			if( !isEmpty(b)) {
				b = b.toDateString();
				b = b.split(' ');
				$('#fs-passenger-1-birth').html(b[2] + " " + b[1] + ", " + b[3]);
			}
		}
	});

	$("#fs-birth2").datepicker({
		changeMonth: true,
		changeYear: true,
		yearRange:'-100:-6',
		defaultDate: "10/01/1993",
		dateFormat: "dd/mm/yy",
		onClose: function() {
			$('#fs-birth2').removeClass('error');
			var b = $(this).datepicker('getDate');
			if( !isEmpty(b)) {
				b = b.toDateString();
				b = b.split(' ');
					$('#fs-passenger-2-birth').html(b[2] + " " + b[1] + ", " + b[3]);
			}
		}
	});
}

// Helper functions
function contains (target) {
	var res = false;
	$.each(stateCoor, function(i, item) {
		if (target.toString().trim() == item.label.toString().trim()) {
			res = true;
		};
	})
	return res;
}

function isEmpty(str) {
	return (!str || 0 === str.length);
}

function search() {
	$("#results").html("<div id=\"container\"><div class=\"stick\"></div><div class=\"stick\"></div><div class=\"stick\"></div><div class=\"stick\"></div><div class=\"stick\"></div><div class=\"stick\"></div><h1>Loading...</h1></div>");
	var table;
	
	var noFlight = (27 * generateRandom(0, 10)) % 10;

	if(noFlight >= (9 - parseInt($("#class").prop("selectedIndex")))) {
		table = "<div id=\"no-results\">No flights found that meet your criteria.</div>"
	}
	else {
		table = "<div class=\"sort-by-container\"><span>Sort by:</span><ul class=\"sort-by-list\"><li class=\"selected\" id=\"sort-by-price\">Price</li><li id=\"sort-by-departure\">Departure</li><li id=\"sort-by-arrival\">Arrival</li><li id=\"sort-by-duration\">Duration</li></ul></div>";
		table += "<table id=\"results-table\"><thead><tr><th>From</th><th>To</th><th>Date Depart</th>" + (isEmpty($("#date-return").val()) ? "" :  "<th>Date Return</th>") +"<th>Departure</th><th>Arrival</th><th>Class</th><th>Price</th><th>Book</th></tr></thead><tbody>";
		var n = generateRandom(3, 9);
		for (var i = 0; i < n; i++) {
			var hour = (generateRandom(0, 12) + 27 * i) % 12;
			var min = (generateRandom(0, 60) + 27 * i) % 60;
			min = Math.round(min / 5) * 5;
			var timeFrom = (hour < 10 ? "0" : "") + hour + ":" + (min < 10 ? "0" : "") + min + " AM";
			
			hour = (generateRandom(0, 12) + 27 * (n - i)) % 12;
			min = (generateRandom(0, 60) + 27 * (n - i)) % 60;
			min = (Math.round(min / 5) * 5) % 60;
			var timeArr = (hour < 10 ? "0" : "") + hour + ":" + (min < 10 ? "0" : "") + min + " PM";

			var price = generateRandom(300, 1000);
			price *= (parseInt($( "#seats option:selected" ).text()) == 2) ? 1.8 : 1;
			price += price * ((generateRandom(0, 51) + 277 * i) % 50) / 100.0 
			price += price * parseInt($("#class").prop("selectedIndex")) * 0.3;
			price += price * (isEmpty($("#date-return").val()) ? 0 : 0.7);
			price = Math.round(price);

			var row = "<tr><td class=\"td-from\">" + $("#from").val() + "</td><td class=\"td-to\">" + $("#to").val() + "</td><td class=\"td-date-depart\">"
			+ $("#date").val() + "</td>" + (isEmpty($("#date-return").val()) ? "" : ("<td class=\"td-date-return\">" + $("#date-return").val() + "</td>")) + "<td class=\"td-time-start\">" + timeFrom + "</td><td class=\"td-time-end\">" + timeArr + "</td><td class=\"td-class\">" + $( "#class option:selected" ).text()
			+ "</td><td class=\"td-price\">" + "$" + price +"</td><td>" + "<button onclick=\"tdClick(this)\">Book</button>" + "</td><td>" + calculateDurationMinutes(timeFrom, timeArr) + "</td></tr>";
			table += row;
		};
		table += "</tbody></table>";
	}
	setTimeout(function(){$("#results").html(table)}, 2000);
	setTimeout(function(){$("#results-table").tablesorter({
		textExtraction: function(node){ 
		// for numbers formattted like $1,000.50 e.g. English
			return $(node).text().replace(/[,$£€]/g,'');
		},
		headers: {
			0: { sorter: false },
			1: { sorter: false },
			2: { sorter: false },
			3: { sorter: false },
			4: { sorter: false },
			5: { sorter: false },
			6: { sorter: false },
			7: { sorter: false },
			8: { sorter: false }
		},
		sortList: [[6,0]]
	});
		var sorting = [[6,0]];
		if ($("#date-return").is(":visible")){
			sorting = [[7,0]]; 
		};
		$("#results-table").trigger("sorton",[sorting]); 
	}, 2100);
	setTimeout(function(){
		$('#sort-by-price').click(function() {
			$('.sort-by-list li').removeClass('selected');
			$(this).addClass('selected');
			var sorting = [[6,0]]; 
			if ($("#date-return").is(":visible")){
				sorting = [[7,0]]; 
			};
			// sort on the first column 
			$("#results-table").trigger("sorton",[sorting]); 
			// return false to stop default link action 
			return false; 
		});
		$('#sort-by-departure').click(function() {
			$('.sort-by-list li').removeClass('selected');
			$(this).addClass('selected');
			var sorting = [[3,0]]; 
			// sort on the first column 
			$("#results-table").trigger("sorton",[sorting]); 
			// return false to stop default link action 
			return false; 
		});
		$('#sort-by-arrival').click(function() {
			$('.sort-by-list li').removeClass('selected');
			$(this).addClass('selected');
			var sorting = [[4,0]]; 
			// sort on the first column 
			$("#results-table").trigger("sorton",[sorting]); 
			// return false to stop default link action 
			return false; 
		});
		$('#sort-by-duration').click(function() {
			$('.sort-by-list li').removeClass('selected');
			$(this).addClass('selected');
			var sorting = [[8,0]];
			if ($("#date-return").is(":visible")){
				sorting = [[9,0]]; 
			};
			// sort on the first column 
			$("#results-table").trigger("sorton",[sorting]); 
			// return false to stop default link action 
			return false; 
		});
	}, 2050);
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

function calculateDuration(time1, time2) {
	var hFrom = parseInt(time1.substring(0,2));
	var mFrom = parseInt(time1.substring(3,5));
	var hTo = parseInt(time2.substring(0,2)) + 12;
	var mTo = parseInt(time2.substring(3,5));
	var mDurr = 0;
	var hDurr = 0;
	if (mFrom > mTo) {
		mDurr = mTo + 60 - mFrom;
		hDurr = hTo - hFrom - 1;
	}
	else {
		mDurr = mTo - mFrom;
		hDurr = hTo - hFrom;
	}
	return hDurr + "h " + (mDurr < 10 ? "0" : "") + mDurr + "m";
}

function calculateDurationMinutes(time1, time2) {
	var res = calculateDuration(time1, time2);
	var h = parseInt(res.split('h')[0]);
	var m = parseInt(res.split(' ')[1].split('m')[0]);
	alert(h);
	return 60*h + m;
}

function tdClick(element){
	$( '#msform-container' ).load( "ajax/booking-form.html", function() {

		initBooking();

		var seldate = $('#date').datepicker('getDate');
		seldate = seldate.toDateString();
		seldate = seldate.split(' ');
		d = seldate[0] + ", " + seldate[1] + " " + seldate[2];
		$("#fs-date").html(d);
		$("#fs-time-1").html(seldate[0] + ", ");
		$("#fs-time-2").html(seldate[0] + ", ");

		seldate = $('#date-return').datepicker('getDate');
		if( !isEmpty(seldate)) {
			seldate = seldate.toDateString();
			seldate = seldate.split(' ');
			d = seldate[0] + ", " + seldate[1] + " " + seldate[2];
			$("#fs-return-date").html(d);
			$("#fs-return-time-1").html(seldate[0] + ", ");
			$("#fs-return-time-2").html(seldate[0] + ", ");
		}

		e = $(element);
		c = e.parent().parent().find('.td-class').html();
		p = e.parent().parent().find('.td-price').html();
		f = e.parent().parent().find('.td-from').html();
		t = e.parent().parent().find('.td-to').html();
		time1 = e.parent().parent().find('.td-time-start').html();
		time2 = e.parent().parent().find('.td-time-end').html();
		$('.price').html(c + " class, " + p);
		$('.fs-from').html(f);
		$('.fs-to').html(t);
		p1 = $('#fs-time-1').html().split(',')[0];
		$('#fs-time-1').html(p1 + ", " + time1);
		p2 = $('#fs-time-2').html().split(',')[0];
		$('#fs-time-2').html(p2 + ", " + time2);
		
		p3 = $('#fs-return-time-1').html().split(',')[0];
		$('#fs-return-time-1').html(p3 + ", " + time1);
		p4 = $('#fs-return-time-2').html().split(',')[0];
		$('#fs-return-time-2').html(p4 + ", " + time2);
		
		$('.duration').html(calculateDuration(time1, time2));

		if($('#date-return').val() != ""){
			$('.routing-column-right').removeClass('hide');
			$('#fs-final-return').removeClass('hide');
		};
		if ($( "#seats option:selected" ).text() == 1) {
			$('#fs-second-passenger').addClass('hide');
			$('#fs-passenger-2').addClass('hide');
		} else {
			$('#fs-second-passenger').removeClass('hide');
			$('#fs-passenger-2').removeClass('hide');
		};
		ti = $('#fs-time-1').html().split(',');
		$('#fs-final-time-1').html($('#fs-date').html() + "," + ti[1]);
		$('#fs-final-time-2').html($('#fs-return-date').html() + ti[1]);

		$('#fs-final-price').html(p);

		$('fieldset input[type=text]').val("");
		$("#msform-container").removeClass('hide');
	});
}

// Validation
function isInvalidForm() {
	var isInvalid = false;
	var to = $("#to").val();
	var from = $("#from").val();

	if (isEmpty(from) || !contains(from) || to == from) {
		$("#from").addClass("error");
		isInvalid = true;
	};

	if (isEmpty(to) || !contains(to) || to == from) {
		$("#to").addClass("error");
		isInvalid = true;
	};
	if (isEmpty($("#date").val())) {
		$("#date").addClass("error");
		isInvalid = true;
	};

	if ($("#date-return").is(":visible") && isEmpty($("#date-return").val())) {
		$("#date-return").addClass("error");
		isInvalid = true;
	};

	return isInvalid;
}

function isBookingValidated() {
	if (! $('#progressbar li:nth-child(2)').hasClass('active')) {
		return true;
	};
	if (! $('#progressbar li:nth-child(3)').hasClass('active')) {
		ok = true;
		var patt = new RegExp("^[a-zA-Z ,.'-]+$");
		if(!patt.test($('#fs-name1').val())){
			$('#fs-name1').addClass('error');
			ok = false;
		}
		if($('#fs-birth1').val() === "") {
			$('#fs-birth1').addClass('error');
			ok = false;
		}

		if (! $('#fs-second-passenger').hasClass('hide')) {
			if(!patt.test($('#fs-name2').val())){
				$('#fs-name2').addClass('error');
				ok = false;
			}
			if($('#fs-birth2').val() === "") {
				$('#fs-birth2').addClass('error');
				ok = false;
			}		
		};

		return ok;
	};
	if (! $('#progressbar li:nth-child(4)').hasClass('active')) {
		ok = true;
		var patt = new RegExp("^[a-zA-Z ,.'-]+$");
		if(!patt.test($('#cc-name').val())) {
			$('#cc-name').addClass('error');
			ok = false;
		}
		patt = new RegExp("^(0?[1-9]|1[012])$");
		if(!patt.test($('#cc-month').val())) {
			$('#cc-month').addClass('error');
			ok = false;
		}
		patt = new RegExp("^[0-9]{2}$");
		if(!patt.test($('#cc-year').val())) {
			$('#cc-year').addClass('error');
			ok = false;
		}
		if($('#cc').css('color') != "rgb(0, 128, 0)"){
			$('#cc').addClass('error');
			ok = false;
		}
		patt = new RegExp("^[0-9]{3,4}$")
		if(!patt.test($('#cc-cvv').val())){
			$('#cc-cvv').addClass('error');
			ok = false;
		}

		return ok;
	};
	return true;
}