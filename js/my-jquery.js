/* [Fade The Page In] */

$( document ).ready(function() {


	
});

$(window).load( function() {
	
	$(".throbber").fadeIn("fast").css("display: block");

	/* [GeoLocate Class] */
	var attach_geolocate = document.createElement("script");
	attach_geolocate.setAttribute("src", "js/geolocate-class.js");
	document.getElementsByTagName("body")[0].appendChild(attach_geolocate);

	/* [Google API Functions] */
	var attach_google_api = document.createElement("script");
	attach_google_api.setAttribute("src", "js/google-api-functions.js");
	document.getElementsByTagName("body")[0].appendChild(attach_google_api);

	/* [Check that we have a position lock before initiating further functions] */
	var wait_for_location = new function() {

		this.interval = setInterval( function() { wait_for_location.still_waiting() },3000);

		this.still_waiting = function() {
			
			if (geocode_properties.locked == true) {
				
				this.stop_waiting(this.interval);
				
				/* [Pre-fill general starting address] */
				$("#start_location").val(geocode_properties.city);

				/* [Use GeoIP2 if loaded and browser doesn't support navigator.geolocation] */
				if (!geolocate_obj && geoip2) {
					$(".maxmind_statement").show();
				}

				google_api_obj.load_map_canvas();
				// google_api_obj.places.search_box();
				// google_api_obj.places.broad_search();
				// google_api_obj.places.type_search();
				// google_api_obj.places.text_search();

				$(".search_city_ex").text(geocode_properties.city);

			}
		}
		this.stop_waiting = function() {
			clearInterval(this.interval);
		}

		// debug_report(window.orientation);

	}

});