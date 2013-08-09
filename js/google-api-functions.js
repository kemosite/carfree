var google_api_obj = new function() {

	this.mode = "";
	this.map = "";
	this.geocoder = "";
	this.trip_mode = "";
	this.trip_mode_radius = {
		"cycling": 8000 / 4,
		"transit": 25000 / 4
	};
	this.start_location = "";
	this.places = {
		service: "",
		types: "",
		categories: {
			types: [],
			buttons: []
		},
		broad_search: "",
		category_search: "",
		search_box: "",
		text_search: ""
	};
	this.map_default_options = "";

	this.load_map_canvas = function() {

		// Enable the visual refresh
		google.maps.visualRefresh = true;

		google_api_obj.map_default_options = {
			center: new google.maps.LatLng(geocode_properties.latitude, geocode_properties.longitude),
			panControl: true,
		    zoomControl: true,
		    scaleControl: true,
			mapTypeId: google.maps.MapTypeId.ROADMAP
		};

		google_api_obj.map = new google.maps.Map(document.getElementById("map_canvas"), google_api_obj.map_default_options);
		google_api_obj.places.service = new google.maps.places.PlacesService(google_api_obj.map);

		this.bike_layer = new google.maps.BicyclingLayer();
		this.bike_layer.setMap(google_api_obj.map);

		this.bike_layer = new google.maps.TrafficLayer();
		this.bike_layer.setMap(google_api_obj.map);
		
		this.weather_layer = new google.maps.weather.WeatherLayer({ temperatureUnits: google.maps.weather.TemperatureUnit.CELSIUS });
		this.weather_layer.setMap(google_api_obj.map);

		google_api_obj.trip_mode = document.getElementById("trip_mode_select").value;

		this.map_zoom_properties = {
			map: google_api_obj.map,
			center: google_api_obj.map_default_options.center,
			radius: google_api_obj.trip_mode_radius[google_api_obj.trip_mode]
		};

		this.map_zoom_circle = new google.maps.Circle(this.map_zoom_properties);
		this.map_bounds = new google.maps.LatLngBounds(this.map_zoom_circle.getBounds().getSouthWest(), this.map_zoom_circle.getBounds().getNorthEast()); 
		google_api_obj.map.fitBounds(this.map_bounds);
		this.map_zoom_circle.setMap(null);
		google_api_obj.start_location = geocode_properties.city;

	}

	this.update_radius = function() {
		google_api_obj.trip_mode = document.getElementById("trip_mode_select").value;
		this.map_zoom_properties = {
			map: google_api_obj.map,
			center: google_api_obj.map_default_options.center,
			radius: google_api_obj.trip_mode_radius[google_api_obj.trip_mode]
		};
		this.map_zoom_circle = new google.maps.Circle(this.map_zoom_properties);
		this.map_bounds = new google.maps.LatLngBounds(this.map_zoom_circle.getBounds().getSouthWest(), this.map_zoom_circle.getBounds().getNorthEast()); 
		google_api_obj.map.fitBounds(this.map_bounds);
		this.map_zoom_circle.setMap(null);
	}

	this.geocode_start_address = function() {

	    var address = document.getElementById("start_location").value;

		google_api_obj.geocoder = new google.maps.Geocoder();
	    google_api_obj.geocoder.geocode({ 'address': address}, function(results, status) {
	      
	      if (status == google.maps.GeocoderStatus.OK) {

	      	google_api_obj.start_location = address;

	      	this.map_zoom_properties = {
				map: google_api_obj.map,
				center: results[0].geometry.location,
				radius: google_api_obj.trip_mode_radius[google_api_obj.trip_mode]
			};

			google_api_obj.map_default_options = this.map_zoom_properties;

			this.map_zoom_circle = new google.maps.Circle(this.map_zoom_properties);
			this.map_bounds = new google.maps.LatLngBounds(this.map_zoom_circle.getBounds().getSouthWest(), this.map_zoom_circle.getBounds().getNorthEast());
	        google_api_obj.map.fitBounds(this.map_bounds);
	        this.map_zoom_circle.setMap(null);
	        google_api_obj.places.broad_search();
	      }
	    });
	}

	this.reset_start_address = function() {

	    $("#start_location").val(geocode_properties.city);
	    var address = document.getElementById("start_location").value;

		google_api_obj.geocoder = new google.maps.Geocoder();
	    google_api_obj.geocoder.geocode({ 'address': address}, function(results, status) {
	      
	      if (status == google.maps.GeocoderStatus.OK) {

	      	google_api_obj.start_location = address;

	      	this.map_zoom_properties = {
				map: google_api_obj.map,
				center: results[0].geometry.location,
				radius: google_api_obj.trip_mode_radius[google_api_obj.trip_mode]
			};

			google_api_obj.map_default_options = this.map_zoom_properties;

			this.map_zoom_circle = new google.maps.Circle(this.map_zoom_properties);
			this.map_bounds = new google.maps.LatLngBounds(this.map_zoom_circle.getBounds().getSouthWest(), this.map_zoom_circle.getBounds().getNorthEast());
	        google_api_obj.map.fitBounds(this.map_bounds);
	        this.map_zoom_circle.setMap(null);
	        google_api_obj.places.broad_search();
	      }
	    });
	}

	this.places.types = {
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

	this.places.broad_search = function() {

		google_api_obj.map_default_options = { 
			center: new google.maps.LatLng(google_api_obj.map_default_options.center.lat(), google_api_obj.map_default_options.center.lng()) 
		};

		this.search_properties = {
			location: google_api_obj.map_default_options.center,
			keyword: google_api_obj.start_location,
			rankBy: google.maps.places.RankBy.DISTANCE
		};

		var destination_types = $(".nearby_destinations .destination_types");
		destination_types.empty();
		google_api_obj.places.categories.types = [];

		google_api_obj.places.service.nearbySearch(this.search_properties, function(destinations, status, pagination) {

			var i = 1;
			$.each(destinations, function(index, destination) {
				if (google_api_obj.places.categories.types.indexOf(destination.types[0]) < 1) {
					google_api_obj.places.categories.types.push(destination.types[0]);
					destination_types.append('<li><label for="checkbox'+i+'"><input type="checkbox" id="checkbox'+i+'" style="display: none;"><span class="custom checkbox"></span> '+google_api_obj.places.types[destination.types[0]]+'&ensp;<img src="'+destination.icon+'" class="icon"></label></li>');
					i++;
				}
			});

			pagination.nextPage();

		});

	}

	this.places.type_search = function() {

		this.typesearch_properties = {
			location: google_api_obj.map_default_options.center,
			types: ["stadium"],	
			rankBy: google.maps.places.RankBy.PROMINENCE,
			radius: 8000
		};

		google_api_obj.places.service.nearbySearch(this.typesearch_properties, function(locations, status, pagination) {

			$(locations).each(function() {
				// debug_report(this);
			});
			pagination.nextPage();

		});

	}

	this.places.search_box = function() {

		this.text_search_input = document.getElementById('location_search');

		this.text_search_bounds = new google.maps.LatLngBounds(
			new google.maps.LatLng(google_api_obj.map_default_options.center.lat() - 0.005, google_api_obj.map_default_options.center.lng() - 0.005),
			new google.maps.LatLng(google_api_obj.map_default_options.center.lat() + 0.005, google_api_obj.map_default_options.center.lng() + 0.005)
		);

		this.text_search_options = { bounds: this.text_search_bounds };

		this.autocomplete = new google.maps.places.SearchBox(this.text_search_input, this.text_search_options);

		this.autocomplete.bindTo('bounds', google_api_obj.map);

	}

	this.places.text_search = function(search_text) {

		this.text_search_properties = {
			query: search_text,
			location: google_api_obj.map_default_options.center,
			radius: 8000
		};

		google_api_obj.places.service.textSearch(this.text_search_properties, function(locations, status, pagination) {

			$(locations).each(function() {
				// debug_report(this);
			});
			pagination.nextPage();

		});

	}

}