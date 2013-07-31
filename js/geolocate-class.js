var nearbyplaces_object = {
	properties: {},
	error: {}
};

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

		this.has_location = false;
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
				geocode_properties.city = geocoded[1].formatted_address;
				geocode_properties.province = geocoded[5].formatted_address;
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

var map, places, map_default_options;

function load_googlemap_canvas() {

	debug_report(geocode_properties);

	// Enable the visual refresh
	google.maps.visualRefresh = true;

	map_default_options = {
		center: new google.maps.LatLng(geocode_properties.latitude, geocode_properties.longitude),
		panControl: true,
	    zoomControl: true,
	    scaleControl: true,
		mapTypeId: google.maps.MapTypeId.ROADMAP
	}

	map = new google.maps.Map(document.getElementById("map_canvas"), map_default_options);
	places = new google.maps.places.PlacesService(map);
	
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

}

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

function places_broadsearch() {

	var place_broadsearch_properties = {
		location: map_default_options.center,
		keyword: geocode_properties.city,	
		rankBy: google.maps.places.RankBy.DISTANCE
	};

	var categories = [];

	places.nearbySearch(place_broadsearch_properties, function(destinations, status, pagination) {

		$(destinations).each(function() {
			var icon = this.icon;
			$.each(this.types, function(index, value) {
				categories[value] = icon;
			});
		});
		pagination.nextPage();

	});

	debug_report(categories);

	debug_report($(".destination_selections"));
}

function places_typesearch() {

	var place_typesearch_properties = {
		location: map_default_options.center,
		types: ["stadium"],	
		rankBy: google.maps.places.RankBy.PROMINENCE,
		radius: 8000
	};

	places.nearbySearch(place_typesearch_properties, function(locations, status, pagination) {

		$(locations).each(function() {
			debug_report(this);
		});
		pagination.nextPage();

	});

}

function places_textsearch() {

	var text_input = document.getElementById('location_search');

	var search_bounds = new google.maps.LatLngBounds(
		new google.maps.LatLng(geocode_properties.latitude, geocode_properties.longitude),
		new google.maps.LatLng(geocode_properties.latitude, geocode_properties.longitude)
	);

	var search_options = { bounds: search_bounds };

	var autocomplete = new google.maps.places.SearchBox(text_input, search_options);

	var place_textsearch_properties = {
		query: "CIBC",
		location: map_default_options.center,
		radius: 8000
	};

	places.textSearch(place_textsearch_properties, function(locations, status, pagination) {

		$(locations).each(function() {
			debug_report(this);
		});
		pagination.nextPage();

	});

}

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

			load_googlemap_canvas();

			places_broadsearch();
			places_typesearch();
			places_textsearch();

		}
	}
	this.stop_waiting = function() {
		clearInterval(this.interval);
	}
}