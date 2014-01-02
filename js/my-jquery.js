/* [Fade The Page In] */

$( document ).ready(function() {

	$('.set.trip.button').click(function() {
		$('#trip_modal').foundation('reveal', 'close');
	});

	$('.nearby.button').click(function() {
		if (typeof google_api_obj.start_location === "undefined") { google_api_obj.geocode_start_address(); }
		google_api_obj.places.broad_search();
	});

	$('#drop_menu .nearby').click(function() {
		if (typeof google_api_obj.start_location === "undefined") { google_api_obj.geocode_start_address(); }
		google_api_obj.places.broad_search();
	});

	$('.route.button').click(function() {
		$('#route_modal').foundation('reveal', 'close');
	});
	
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
		this.wait_count = 0;

		this.still_waiting = function() {
			
			if (geocode_properties.locked == true) {
				
				this.stop_waiting(this.interval);

				/* [Use GeoIP2 if loaded and browser doesn't support navigator.geolocation] */
				if (!geolocate_obj && geoip2) {
					$(".maxmind_statement").show();
				}

				/* [Load the map] */
				google_api_obj.load_map_canvas();

				/* [Pre-fill general starting address] */
				$("#start_location").val(google_api_obj.start_location);
				
				/* [Establish bounds in which to favour search results from] */
				google_api_obj.places.search_box();

				// google_api_obj.places.broad_search();
				// google_api_obj.places.type_search();
				// google_api_obj.places.text_search();

				// $(".search_city_example").text(geocode_properties.city);

			} else {
				$(".loading_message").queue(function() {
					$(this).text("Still determining your location. Please wait.").dequeue();
			    });
			    wait_for_location.wait_count++;
			}

			if (wait_for_location.wait_count > 2) {
				$(".refresh_warning").queue(function() {
					$(this).show().dequeue();
			    });
			}
		}
		this.stop_waiting = function() {
			clearInterval(this.interval);
		}

		// debug_report(window.orientation);

	}

});