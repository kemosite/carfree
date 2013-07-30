var geolocate_object = {
	properties: {
		latitude: "",
		longitude: "",
		city: "",
		province: "",
		accuracy: 40000,
		altitude: "",
		altitudeAccuracy: "",
		heading: "",
		speed: ""
	},
	error: {}
};

var nearbyplaces_object = {
	properties: {},
	error: {}
};

function geoip2_class() {

	var options = {
		enableHighAccuracy: true
		// timeout: 5000
	};

	var success = function(position) {
		geolocate_object.properties.latitude = position.location.latitude;
		geolocate_object.properties.longitude = position.location.longitude;
		geolocate_object.properties.city = position.city.names.en;
		geolocate_object.properties.province = position.subdivisions[0].iso_code;

		safe_exec(load_googlemap_features);

	};

	var failure = function(error) {
		geolocate_object.error = error;
	};

	geoip2.city(success, failure, options);

}

function geolocate_class() {
    
	this.success = function(position) {
		geolocate_object.properties.accuracy = position.coords.accuracy;
		geolocate_object.properties.altitude = position.coords.altitude;
		geolocate_object.properties.altitudeAccuracy = position.coords.altitudeAccuracy;
		geolocate_object.properties.heading = position.coords.heading;
		geolocate_object.properties.latitude = position.coords.latitude;
		geolocate_object.properties.longitude = position.coords.longitude;
		geolocate_object.properties.speed = position.coords.speed;

		safe_exec(google_geocoder);
		safe_exec(load_googlemap_features);
	
	}

	this.failure = function (error) {
		geolocate_object.error = error;
	}

	this.options = {
		enableHighAccuracy: true
		// timeout: "", //in milliseconds
		// maximumAge: "30000"
	};

	this.getLocation = navigator.geolocation.watchPosition(this.success, this.failure, this.options);
	// navigator.geolocation.clearWatch(this.getLocation);

}

function google_geocoder () {
	
	var map_default_options = {
		center: new google.maps.LatLng(geolocate_object.properties.latitude, geolocate_object.properties.longitude),
	}

	var geocoder = new google.maps.Geocoder();
	geocoder.geocode({'latLng': map_default_options.center}, function(geocoded, status) {
		geolocate_object.properties.city = geocoded[1].formatted_address;
		geolocate_object.properties.province = geocoded[5].formatted_address;
	});

}

/* [Attach Google Maps API] */
function load_googlemap_features() {

	// Enable the visual refresh
	google.maps.visualRefresh = true;

	var map_default_options = {
		center: new google.maps.LatLng(geolocate_object.properties.latitude, geolocate_object.properties.longitude),
		panControl: true,
	    zoomControl: true,
	    scaleControl: true,
		mapTypeId: google.maps.MapTypeId.ROADMAP
	}

	var map = new google.maps.Map(document.getElementById("map_canvas"), map_default_options);
	
	var bikeLayer = new google.maps.BicyclingLayer();
	bikeLayer.setMap(map);

	var trafficLayer = new google.maps.TrafficLayer();
	trafficLayer.setMap(map);
	
	var weatherLayer = new google.maps.weather.WeatherLayer({
		temperatureUnits: google.maps.weather.TemperatureUnit.CELSIUS
	});
	weatherLayer.setMap(map);

	var map_zoom_properties = {
		map: map,
		center: map_default_options.center,
		radius: 2000 // Math.min(geolocate_object.properties.accuracy, 2000)
	};

	var map_zoom_circle = new google.maps.Circle(map_zoom_properties);
	var map_bounds = new google.maps.LatLngBounds(map_zoom_circle.getBounds().getSouthWest(), map_zoom_circle.getBounds().getNorthEast()); 
	map.fitBounds(map_bounds);
	map_zoom_circle.setMap(null);

	var places = new google.maps.places.PlacesService(map);

	var place_types = {
		accounting: "Accounting Firms",
		airport: "Airports",
		amusement_park: "Amusement Parks",
		aquarium: "Aquariums",
		art_gallery: "Art Galleries",
		atm: "ATM Machines",
		bakery: "Bakeries",
		bank: "Banks",
		bar: "Bars",
		beauty_salon: "Beauty Salons",
		bicycle_store: "Bike Shops",
		book_store: "Book Stores",
		bowling_alley: "Bowling Allies",
		bus_station: "Bus Stations",
		cafe: "Cafes",
		campground: "Camp Grounds",
		car_dealer: "Car Dealerships",
		car_rental: "Car Rental Locations",
		car_repair: "Car Repair Locations",
		car_wash: "Car Washes",
		casino: "Casinos",
		cemetery: "Cemetaries",
		church: "Churches",
		city_hall: "City Hall",
		clothing_store: "Clothing Stores",
		convenience_store: "Convenience Stores",
		courthouse: "Courthouses",
		dentist: "Dentist Offices",
		department_store: "Department Stores",
		doctor: "Doctor's Offices",
		electrician: "Electricians",
		electronics_store: "Electronics Store",
		embassy: "Embassies",
		establishment: "Establishments",
		finance: "Finance Locations",
		fire_station: "Fire Halls",
		florist: "Florist Shop",
		food: "Food Locations",
		funeral_home: "Funeral Homes",
		furniture_store: "Furniture Stores",
		gas_station: "Gas Stations",
		general_contractor: "General Contractor Locations",
		grocery_or_supermarket: "Grocery Store",
		gym: "Gyms",
		hair_care: "Hair Care Locations",
		hardware_store: "Hardware Stores",
		health: "Health Locations",
		hindu_temple: "Hindu Temples",
		home_goods_store: "Home Goods Stores",
		hospital: "Hospitals",
		insurance_agency: "Insurance Agencies",
		jewelry_store: "Jewelry Stores",
		laundry: "Laundromats",
		lawyer: "Laywer's Offices",
		library: "Libraries",
		liquor_store: "Liquor Stores",
		local_government_office: "Local Government Offices",
		locksmith: "Locksmiths",
		lodging: "Lodging Locations",
		meal_delivery: "Meal Delivery Locations",
		meal_takeaway: "Meal Takeaway Locations",
		mosque: "Mosques",
		movie_rental: "Movie Rental Locations",
		movie_theater: "Movie Theatres",
		moving_company: "Moving Companies",
		museum: "Museums",
		night_club: "Night Clubs",
		painter: "Painter Locations",
		park: "Parks",
		parking: "Parking Locations",
		pet_store: "Pet Stores",
		pharmacy: "Pharmacies",
		physiotherapist: "Physiotherapists",
		place_of_worship: "Places of Worship",
		plumber: "Plumbers",
		police: "Police Stations",
		post_office: "Post Offices",
		real_estate_agency: "Real Estate Agencies",
		restaurant: "Restaurants",
		roofing_contractor: "Roofing Contractors",
		rv_park: "RV Parks",
		school: "Schools",
		shoe_store: "Shoe Stores",
		shopping_mall: "Shopping Malls",
		spa: "Spas",
		stadium: "Stadiums",
		storage: "Storage Locations",
		store: "Stores",
		subway_station: "Subway Stations",
		synagogue: "Synagogues",
		taxi_stand: "Taxi Stands",
		train_station: "Train Stations",
		travel_agency: "Travel Agencies",
		university: "Universities",
		veterinary_care: "Veterinary Clinics",
		zoo: "Zoos",
		administrative_area_level_1: "Administrative Areas - Level 1",
		administrative_area_level_2: "Administrative Areas - Level 2",
		administrative_area_level_3: "Administrative Areas - Level 3",
		colloquial_area: "Colloquial Areas",
		country: "Countries",
		floor: "Floors",
		geocode: "Geocodes",
		intersection: "Intersections",
		locality: "Localities",
		natural_feature: "Natural Features",
		neighborhood: "Neighbourhoods",
		political: "Political Locations",
		point_of_interest: "Points of Interest",
		post_box: "Post Boxes",
		postal_code: "Postal Codes",
		postal_code_prefix: "Postal Code Prefixes",
		postal_town: "Postal Towns",
		premise: "Premises",
		room: "Rooms",
		route: "Routes",
		street_address: "Street Addresses",
		street_number: "Street Numbers",
		sublocality: "Sublocalities",
		sublocality_level_4: "Sublocalities - Level 4",
		sublocality_level_5: "Sublocalities - Level 5",
		sublocality_level_3: "Sublocalities - Level 3",
		sublocality_level_2: "Sublocalities - Level 2",
		sublocality_level_1: "Sublocalities - Level 1",
		subpremise: "Subpremises",
		transit_station: "Transit Stations"
	}

	var excluded_place_types = [
		"locality",
		"sublocality"
	]

	/*
	 * Implement as a click feature. Prefill "Address" field, and have user click to search for nearby places with address field.
	var search_properties = {
		location: map_default_options.center,
		radius: 50000,
		// keyword: "",	
		rankBy: google.maps.places.RankBy.PROMINENCE
		// rankBy: google.maps.places.RankBy.DISTANCE
	};

	places.nearbySearch(search_properties, function(destinations, status, pagination) {
		$(destinations).each(function() {
			debug_report(this);
		});
		pagination.nextPage();
	});
	*/

}

$(window).load(function(){

	/* [Use GeoIP2 if loaded and browser doesn't support navigator.geolocation] */
	if (!navigator.geolocation && geoip2) {
		var geolocate_execute = new geoip2_class;
		$(".maxmind_statement").show();
	} else {
		var geolocate_execute = new geolocate_class;
	}

	/* */

	debug_report(geolocate_object);
	
});