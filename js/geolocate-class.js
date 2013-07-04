function geolocate_class() {
	
	this.props = {
		latitude: geoip_latitude(),
		longitude: geoip_longitude(),
		accuracy: 40000,
		altitude: "",
		altitudeAccuracy: "",
		heading: "",
		speed: "",
		error: "",
		city: geoip_city()
	};
	
	this.opts = {
		enableHighAccuracy: true
		// timeout: 5000
	};
	
	this.success = function(position) {		
		this.props.latitude = position.coords.latitude;
		this.props.longitude = position.coords.longitude;
		this.props.accuracy = position.coords.accuracy;
	};
	
	this.failure = function(error) {		
		
		switch(error.code) {
			case error.PERMISSION_DENIED:
			this.error = "User denied the request for Geolocation.";
			break;
			case error.POSITION_UNAVAILABLE:
			this.error = "Location information is unavailable.";
			break;
			case error.TIMEOUT:
			this.error = "The request to get user location timed out.";
			break;
			case error.UNKNOWN_ERROR:
			this.error = "An unknown error occurred.";
			break;
		}
	
	};
	
	this.getlocation = function() {
		if (navigator.geolocation) {
			navigator.geolocation.watchPosition(this.success, this.failure, this.opts);
			// navigator.geolocation.getCurrentPosition(this.success, this.failure, this.opts);
		}
	};
	
}

$(document).ready(function(){
	var geolocate = new geolocate_class;
});