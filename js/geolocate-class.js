var geocode_properties = {
	latitude: "",
	longitude: "",
	city: "",
	province: "",
	accuracy: 40000,
	altitude: "",
	altitudeAccuracy: "",
	heading: "",
	speed: "",
	locked: false
}

if (navigator.geolocation) {

	var geolocate_obj = new function() {

		 $(".loading_message").queue(function() {
			$(this).text("Determining your location").dequeue();
	    });
		$(".loading_message").fadeIn("fast").css("display: block");

		this.error = function() {
			$(".loading_message").queue(function() {
				$(this).text("Error getting location. Please refresh your browser.").dequeue();
			});
		}

		this.success = function(position) {

			$(".loading_message").fadeOut("fast").css("display: none");
		    $(".loading_message").queue(function() {
				$(this).text("Location determined. Please wait").dequeue();
		    });
		    $(".loading_message").fadeIn("fast").css("display: block");
			
			geocode_properties.accuracy = position.coords.accuracy;
			geocode_properties.altitude = position.coords.altitude;
			geocode_properties.altitudeAccuracy = position.coords.altitudeAccuracy;
			geocode_properties.heading = position.coords.heading;
			geocode_properties.latitude = position.coords.latitude;
			geocode_properties.longitude = position.coords.longitude;
			geocode_properties.speed = position.coords.speed;

			this.geocode_options = {
				center: new google.maps.LatLng(position.coords.latitude, position.coords.longitude)
			}
			this.geocoder = new google.maps.Geocoder();
			this.geocoder.geocode({'latLng': this.geocode_options.center}, function(geocoded, status) {
				$(geocoded).each(function() {
					if (this.types[0] == "locality") {
						geocode_properties.city = this.formatted_address;
					}
					if (this.types[0] == "administrative_area_level_1") {
						geocode_properties.province = this.formatted_address;
					}
				});
			});

			geocode_properties.locked = true;

			$(".throbber").fadeOut("fast").css("display: none");
		    $(".container").delay("1000").fadeIn("fast").css("display: block");

		};

		this.failure = function (error) {
			geolocate_obj.error = error;
		};

		this.options = {
			enableHighAccuracy: true
		}

		this.location_id = navigator.geolocation.getCurrentPosition(this.success, this.failure, this.options);

	}

} else {

	var geoip2_obj = new function() {

		this.error = {}

		this.success = function(position) {
			geocode_properties.latitude = position.location.latitude;
			geocode_properties.longitude = position.location.longitude;
			geocode_properties.city = position.city.names.en;
			geocode_properties.province = position.subdivisions[0].iso_code;

			geocode_properties.locked = true;

		}

		this.failure = function (error) {
			geoip2_obj.error = error;
		};

		this.options = {
			enableHighAccuracy: true
		}

	}
	
	geoip2.city(geoip2_obj.success, geoip2_obj.failure, geoip2_obj.options);

}