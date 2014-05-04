// MAPA
var map;
var marker;
var myLatlng;
function initialize() {
	var myCenter = new google.maps.LatLng(39.828127,-98.579404);
	var mapOptions = {
		zoom: 4,
		center: myCenter
	}
	map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

	var marker = new google.maps.Marker({
		position: myLatlng,
		map: map,
		title: 'Hello World!'
	});
}

google.maps.event.addDomListener(window, 'load', initialize);
// MAPA KRAJ

$(function() {
	var projects = [
	{
		"label":"Alabama",
		"lat":32.806673,
		"lon":-86.791133
	},
	{
		"label":"Alaska",
		"lat":61.370717,
		"lon":-152.404420
	},
	{
		"label":"Arizona",
		"lat":33.729761,
		"lon":-111.431224
	},
	{
		"label":"Arkansas",
		"lat":34.969705,
		"lon":-92.373124
	},
	{
		"label":"California",
		"lat":36.116203,
		"lon":-119.681563
	},
	{
		"label":"Colorado",
		"lat":39.059810,
		"lon":-105.311105
	},
	{
		"label":"Connecticut",
		"lat":41.597781,
		"lon":-72.755369
	},
	{
		"label":"Delaware",
		"lat":39.318522,
		"lon":-75.507138
	},
	{
		"label":"District of Columbia",
		"lat":38.897439,
		"lon":-77.026816
	},
	{
		"label":"Florida",
		"lat":27.766279,
		"lon":-81.686782
	},
	{
		"label":"Georgia",
		"lat":33.040618,
		"lon":-83.643072
	},
	{
		"label":"Hawaii",
		"lat":21.094319,
		"lon":-157.498339
	},
	{
		"label":"Idaho",
		"lat":44.240460,
		"lon":-114.478825
	},
	{
		"label":"Illinois",
		"lat":40.349455,
		"lon":-88.986137
	},
	{
		"label":"Indiana",
		"lat":39.849425,
		"lon":-86.258278
	},
	{
		"label":"Iowa",
		"lat":42.011538,
		"lon":-93.210526
	},
	{
		"label":"Kansas",
		"lat":38.526599,
		"lon":-96.726489
	},
	{
		"label":"Kentucky",
		"lat":37.668141,
		"lon":-84.670064
	},
	{
		"label":"Louisiana",
		"lat":31.169546,
		"lon":-91.867805
	},
	{
		"label":"Maine",
		"lat":44.693948,
		"lon":-69.381924
	},
	{
		"label":"Maryland",
		"lat":39.063944,
		"lon":-76.802101
	},
	{
		"label":"Massachusetts",
		"lat":42.230173,
		"lon":-71.530104
	},
	{
		"label":"Michigan",
		"lat":43.326618,
		"lon":-84.536093
	},
	{
		"label":"Minnesota",
		"lat":45.694455,
		"lon":-93.900189
	},
	{
		"label":"Mississippi",
		"lat":32.741647,
		"lon":-89.678697
	},
	{
		"label":"Missouri",
		"lat":38.456087,
		"lon":-92.288368
	},
	{
		"label":"Montana",
		"lat":46.921924,
		"lon":-110.454351
	},
	{
		"label":"Nebraska",
		"lat":41.125370,
		"lon":-98.268081
	},
	{
		"label":"Nevada",
		"lat":38.313513,
		"lon":-117.055372
	},
	{
		"label":"New Hampshire",
		"lat":43.452491,
		"lon":-71.563899
	},
	{
		"label":"New Jersey",
		"lat":40.298904,
		"lon":-74.521013
	},
	{
		"label":"New Mexico",
		"lat":34.840514,
		"lon":-106.248483
	},
	{
		"label":"New York",
		"lat":42.165724,
		"lon":-74.948052
	},
	{
		"label":"North Carolina",
		"lat":35.630066,
		"lon":-79.806417
	},
	{
		"label":"North Dakota",
		"lat":47.528910,
		"lon":-99.784012
	},
	{
		"label":"Ohio",
		"lat":40.388781,
		"lon":-82.764916
	},
	{
		"label":"Oklahoma",
		"lat":35.565342,
		"lon":-96.928919
	},
	{
		"label":"Oregon",
		"lat":44.572020,
		"lon":-122.070939
	},
	{
		"label":"Pennsylvania",
		"lat":40.590752,
		"lon":-77.209755
	},
	{
		"label":"Rhode Island",
		"lat":41.680893,
		"lon":-71.511782
	},
	{
		"label":"South Carolina",
		"lat":33.856893,
		"lon":-80.945011
	},
	{
		"label":"South Dakota",
		"lat":44.299782,
		"lon":-99.438825
	},
	{
		"label":"Tennessee",
		"lat":35.747845,
		"lon":-86.692343
	},
	{
		"label":"Texas",
		"lat":31.054487,
		"lon":-97.563460
	},
	{
		"label":"Utah",
		"lat":40.150032,
		"lon":-111.862433
	},
	{
		"label":"Vermont",
		"lat":44.045877,
		"lon":-72.710689
	},
	{
		"label":"Virginia",
		"lat":37.769335,
		"lon":-78.169968
	},
	{
		"label":"Washington",
		"lat":47.400902,
		"lon":-121.490493
	},
	{
		"label":"West Virginia",
		"lat":38.491226,
		"lon":-80.954452
	},
	{
		"label":"Wisconsin",
		"lat":44.268544,
		"lon":-89.616509
	},
	{
		"label":"Wyoming",
		"lat":42.755965,
		"lon":-107.302488
	}
	];

	$( "#project" ).autocomplete({
		minLength: 0,
		source: projects,
		focus: function( event, ui ) {
			$( "#project" ).val( ui.item.label );
			return false;
		},
		select: function( event, ui ) {
			$( "#project" ).val( ui.item.label );
			myLatlng = new google.maps.LatLng(ui.item.lat,ui.item.lon);
			
			marker = new google.maps.Marker({
				position: myLatlng,
				map: map,
				title: 'Hello World!'
			});
			initialize();

			return false;
		}
	})
	.data( "ui-autocomplete" )._renderItem = function( ul, item ) {
		return $( "<li>" )
		.append( "<a>" + item.label + "</a>" )
		.appendTo( ul );
	};
});