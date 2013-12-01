/* [Fade The Page In] */
$(window).load( function() {
	
	$(".throbber").fadeIn("fast").css("display: block");

	/* [GeoLocate Class] */
	adaptive_scripts.attach_scrollto = document.createElement("script");
	adaptive_scripts.attach_scrollto.setAttribute("src", "js/geolocate-class.js");
	document.getElementsByTagName("body")[0].appendChild(adaptive_scripts.attach_scrollto);

	/* [Google API Functions] */
	// adaptive_scripts.attach_scrollto = document.createElement("script");
	// adaptive_scripts.attach_scrollto.setAttribute("src", "js/google-api-functions.js");
	// document.getElementsByTagName("body")[0].appendChild(adaptive_scripts.attach_scrollto);

});

$( document ).ready(function() {

	$("a.trip").click(function() {

		$(".window").fadeOut("fast").css("display: none");
		$(".trip.window").delay("1000").fadeIn("fast").css("display: block");

	});

});