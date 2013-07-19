function geoip2_class() {

	var properties = {
		latitude: "",
		longitude: "",
		city: "",
		province: "",
		accuracy: 40000,
		altitude: "",
		altitudeAccuracy: "",
		heading: "",
		speed: "",
		error: ""
	}

	var options = {
		enableHighAccuracy: true
		// timeout: 5000
	};

	var success = function(position) {
		properties.latitude = position.location.latitude;
		properties.longitude = position.location.longitude;
		properties.city = position.city.names.en;
		properties.province = position.subdivisions[0].iso_code;
	};

	var failure = function(error) {
		properties.error = error;
	};

	geoip2.city(success, failure, options);
	this.properties = properties;

}

function geolocate_class() {
    
	this.success = function(position) {
		this.position = position.coords;
	}

	this.failure = function (error) {
		switch(error.code) {
			case error.PERMISSION_DENIED:
				this.error="User denied the request for Geolocation."
				break;
		    case error.POSITION_UNAVAILABLE:
				this.error="Location information is unavailable."
				break;
			case error.TIMEOUT:
				this.error="The request to get user location timed out."
				break;
			case error.UNKNOWN_ERROR:
				this.error="An unknown error occurred."
				break;
		}
	}

	this.options = {
		enableHighAccuracy: true,
		timeout: "", //in milliseconds
		maximumAge: ""
	};

	this.getLocation = function() {
		navigator.geolocation.getCurrentPosition(this.success, this.failure, this.options);
	}

	this.getLocation();

}

$(window).load(function(){

	if (!navigator.geolocation){
		var geolocate_object = new geoip2_class;
	} else {
		var geolocate_object = new geolocate_class;
	}

	debug_report(geolocate_object);
	
});