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

		this.error = {}

		this.success = function(position) {
			
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

		};

		this.failure = function (error) {
			geolocate_obj.error = error;
		};

		this.options = {
			enableHighAccuracy: true
			// timeout: "2000", //in milliseconds
			// maximumAge: "2000"
		}

		this.location_id = navigator.geolocation.watchPosition(this.success, this.failure, this.options);
		
		this.clear_location = function() {
			navigator.geolocation.clearWatch(geolocate_obj.location_id);
		}

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