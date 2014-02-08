var google_api_obj = new function() {

	this.mode = "";
	this.map = "";
	this.geocoder = "";
	this.trip_mode = "";
	this.trip_mode_radius = {
		"BICYCLING": 15000 / 4,
		"TRANSIT": 25000 / 2
	};
	this.directions_display = "";
	this.directions_service = "";
	this.directions_service_options = "";
	this.start_location = "";
	this.destination = "";
	this.waypoints = [];
	this.categories_keyword = "";
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
	this.styled_map = "";
	this.styles = "";
	this.layers = {
		bike_layer: "",
		transit_layer: "",
		weather_layer: "",
		traffic_layer: ""
	},
	this.bike_zone_circle = "";

	/* [Load the map] */
	this.load_map_canvas = function() {

		// Enable the visual refresh
		google.maps.visualRefresh = true;

		// Create an array of styles.
		google_api_obj.styles = [
		/*{
		  stylers: [
		    { hue: "#80dbff" },
		  ]
		},*//*{
		  featureType: "road.local",
		  elementType: "geometry.stroke",
		  stylers: [
		    { 
		    	color: "#404040",
		    	weight: 0.5
		    }
		  ]
		},*/{
		  featureType: "road.arterial",
		  elementType: "geometry.stroke",
		  stylers: [
		    { 
		    	color: "#99991c",
		    	weight: 8
		    }
		  ]
		},{
		  featureType: "road.highway",
		  elementType: "geometry.stroke",
		  stylers: [
		    { 
				color: "#991c1c",
				weight: 8
			}
		  ]
		},{
		    featureType: "road",
		    elementType: "labels.text.stroke",
		    stylers: [
		      { color: "#FFFFFF" },
		      { weight: 4 }
		    ]
		},{
		    featureType: "road",
		    elementType: "labels.text.fill",
		    stylers: [
		      { color: "#000000" }
		    ]
		  }
		];

		// Create a new StyledMapType object, passing it the array of styles,
		// as well as the name to be displayed on the map type control.
		// google_api_obj.styled_map = new google.maps.StyledMapType(styles, {name: "Styled Map"});

		google_api_obj.map_default_options = {
			center: new google.maps.LatLng(geocode_properties.latitude, geocode_properties.longitude),
			panControl: true,
		    zoomControl: true,
		    scaleControl: true,
		    zoom: 13,
			mapTypeControlOptions: {
		      mapTypeIds: [google.maps.MapTypeId.ROADMAP, 'map_style']
		    }
		};

		google_api_obj.map = new google.maps.Map(document.getElementById("map_canvas"), google_api_obj.map_default_options);
		google_api_obj.places.service = new google.maps.places.PlacesService(google_api_obj.map);

		google_api_obj.map.setOptions({styles: google_api_obj.styles});

		google_api_obj.layers.bike_layer = new google.maps.BicyclingLayer();
		google_api_obj.layers.bike_layer.setMap(google_api_obj.map);
		
		try {
			google_api_obj.layers.weather_layer = new google.maps.weather.WeatherLayer({ temperatureUnits: google.maps.weather.TemperatureUnit.CELSIUS });
			google_api_obj.layers.weather_layer.setMap(google_api_obj.map);
		} catch (error) {
			debug_report("Error caught:");
			debug_report(error); // statements to handle any unspecified exceptions
		} finally {
			window.onerror = function(message, url, linenumber) {
				debug_report("Error: " + message + " on line " + linenumber + " for " + url);
			}
		}

		google_api_obj.directions_service = new google.maps.DirectionsService();

		google_api_obj.directions_display_options = {
			draggable: true
		};
		google_api_obj.directions_display = new google.maps.DirectionsRenderer(google_api_obj.directions_display_options);
		google_api_obj.directions_display.setMap(google_api_obj.map);
		google_api_obj.directions_display.setPanel(document.getElementById("directions-panel"));
		google_api_obj.trip_mode = "BICYCLING";

		/*
		 * Separate the 'Zoom Circle' from the 'Bike Zone Circle'
		 */

		this.map_zoom_properties = {
			map: google_api_obj.map,
			center: google_api_obj.map_default_options.center,
			radius: google_api_obj.trip_mode_radius[google_api_obj.trip_mode]
		};

		this.bike_zone_properties = {
			strokeColor: '#0040ff',
			strokeOpacity: 0.5,
			strokeWeight: 1,
			fillColor: '#a6bcff',
			fillOpacity: 0.125,
			center: google_api_obj.map_default_options.center,
			map: google_api_obj.map,
			radius: google_api_obj.trip_mode_radius["BICYCLING"]
		};

		google_api_obj.bike_zone_circle = new google.maps.Circle(this.bike_zone_properties);
		
		this.map_zoom_circle = new google.maps.Circle(this.map_zoom_properties);
		this.map_bounds = new google.maps.LatLngBounds(this.map_zoom_circle.getBounds().getSouthWest(), this.map_zoom_circle.getBounds().getNorthEast()); 
		// google_api_obj.map.fitBounds(this.map_bounds);
		this.map_zoom_circle.setMap(null);
		
		if (geocode_properties.street) {
			google_api_obj.start_location = geocode_properties.street;
		} else {
			google_api_obj.start_location = geocode_properties.city;
		}
		
		google_api_obj.categories_keyword = geocode_properties.city;

	};

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

		if (google_api_obj.trip_mode == "TRANSIT") {

			google_api_obj.map.setOptions({styles: null});
			google_api_obj.layers.bike_layer.setMap(null);

			google_api_obj.layers.traffic_layer = new google.maps.TrafficLayer();
			google_api_obj.layers.traffic_layer.setMap(google_api_obj.map);

		} else {
						
			google_api_obj.layers.traffic_layer.setMap(null);

			google_api_obj.map.setOptions({styles: google_api_obj.styles});
			
			google_api_obj.layers.bike_layer = new google.maps.BicyclingLayer();
			google_api_obj.layers.bike_layer.setMap(google_api_obj.map);

			google_api_obj.map.setZoom(13);

		}

		google_api_obj.calculate_route();

	};

	this.geocode_start_address = function() {

	    var address = document.getElementById("start_location").value;

		google_api_obj.geocoder = new google.maps.Geocoder();
	    google_api_obj.geocoder.geocode({ 'address': address}, function(results, status) {

			if (status == google.maps.GeocoderStatus.OK) {

				google_api_obj.start_location = address;

				$(results[0].address_components).each(function() {
					if (this.types[0] == "locality") {
						google_api_obj.categories_keyword = this.long_name;
					}	
				});

				this.map_zoom_properties = {
					map: google_api_obj.map,
					center: google_api_obj.map_default_options.center,
					radius: google_api_obj.trip_mode_radius[google_api_obj.trip_mode]
				};

				this.bike_zone_properties = {
					strokeColor: '#0040ff',
					strokeOpacity: 0.5,
					strokeWeight: 1,
					fillColor: '#a6bcff',
					fillOpacity: 0.125,
					center: google_api_obj.map_default_options.center,
					map: google_api_obj.map,
					radius: google_api_obj.trip_mode_radius["BICYCLING"]
				};

				google_api_obj.bike_zone_circle.setMap(null);
				google_api_obj.bike_zone_circle = new google.maps.Circle(this.bike_zone_properties);

				google_api_obj.map_default_options = this.map_zoom_properties;

				this.map_zoom_circle = new google.maps.Circle(this.map_zoom_properties);
				this.map_bounds = new google.maps.LatLngBounds(this.map_zoom_circle.getBounds().getSouthWest(), this.map_zoom_circle.getBounds().getNorthEast());
				google_api_obj.map.fitBounds(this.map_bounds);
				this.map_zoom_circle.setMap(null);
				// google_api_obj.places.broad_search();
				google_api_obj.calculate_route();

			}

	    });
	};

	this.reset_start_address = function() {

	    $("#start_location").val(google_api_obj.start_location);
	    var address = document.getElementById("start_location").value;

		google_api_obj.geocoder = new google.maps.Geocoder();
	    google_api_obj.geocoder.geocode({ 'address': address}, function(results, status) {
	      
	      if (status == google.maps.GeocoderStatus.OK) {

	      	google_api_obj.start_location = address;
	      	google_api_obj.categories_keyword = address;

	      	this.map_zoom_properties = {
	      		strokeColor: '#004C00',
				strokeOpacity: 0.25,
				strokeWeight: 1,
				fillColor: '#004C00',
				fillOpacity: 0.125,
				map: google_api_obj.map,
				center: results[0].geometry.location,
				radius: google_api_obj.trip_mode_radius[google_api_obj.trip_mode]
			};

			google_api_obj.map_default_options = this.map_zoom_properties;

			this.map_zoom_circle = new google.maps.Circle(this.map_zoom_properties);
			this.map_bounds = new google.maps.LatLngBounds(this.map_zoom_circle.getBounds().getSouthWest(), this.map_zoom_circle.getBounds().getNorthEast());
	        google_api_obj.map.fitBounds(this.map_bounds);
	        this.map_zoom_circle.setMap(null);
	        // google_api_obj.places.broad_search();

	        if (google_api_obj.trip_mode == "BICYCLING") { google_api_obj.map.setZoom(13); }

			google_api_obj.calculate_route();

	      }
	      
	    });
	};

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
	};

	this.places.broad_search = function() {

		google_api_obj.map_default_options = { 
			center: new google.maps.LatLng(google_api_obj.map_default_options.center.lat(), google_api_obj.map_default_options.center.lng()) 
		};

		this.search_properties = {
			location: google_api_obj.map_default_options.center,
			keyword: google_api_obj.categories_keyword,
			rankBy: google.maps.places.RankBy.DISTANCE
		};

		var destination_types = $("#nearby_modal .destination_types");
		destination_types.empty();
		google_api_obj.places.categories.types = [];

		google_api_obj.places.service.nearbySearch(this.search_properties, function(destinations, status, pagination) {

			var i = 1;
			$.each(destinations, function(index, destination) {
				if (google_api_obj.places.categories.types.indexOf(destination.types[0]) == -1) {
					google_api_obj.places.categories.types.push(destination.types[0]);
					destination_types.append('<li><a class="destination button radius expand" onclick="google_api_obj.places.type_search(\''+destination.types[0]+'\');">'+google_api_obj.places.types[destination.types[0]]+'&ensp;<img src="'+destination.icon+'" class="icon"></a></li>');
					i++;'+google_api_obj.places.types[destination.types[0]]+'
				}
			});

			// pagination.nextPage();

		});

	};

	this.places.type_search = function(type) {

		this.typesearch_properties = {
			location: google_api_obj.map_default_options.center,
			types: [type],	
			rankBy: google.maps.places.RankBy.PROMINENCE,
			radius: google_api_obj.trip_mode_radius[google_api_obj.trip_mode]
		};

		google_api_obj.places.service.nearbySearch(this.typesearch_properties, function(locations, status, pagination) {

			if (status == "OK") {

				$(".search_findings").empty();

				$(".search_keyword").text(google_api_obj.places.types[type]);

				$(locations).each(function() {

					$(".search_findings").append(
						'<div class="row">'+
						'<div class="small-2 columns"><a class="tiny button radius glyph expand" onclick="google_api_obj.add_destination(\''+this.vicinity+'\', \''+escape(this.name)+'\')">%</a></div>'+
						'<div class="small-offset-1 small-9 columns">'+
						'<div><strong>'+this.name+'</strong></div>'+
						'<div>'+this.vicinity+'</div>'+
						'</div></div><br>');

				});

				$('#search_modal').foundation('reveal', 'open');

				/*
				$(locations).each(function() {
					debug_report(this);
				});
				pagination.nextPage();
				*/

			}

		});

	};

	/* [Establish bounds in which to favour search results from] */
	this.places.search_box = function() {

		this.text_search_input = document.getElementById('location_search');

		this.text_search_bounds = new google.maps.LatLngBounds(
			new google.maps.LatLng(google_api_obj.map_default_options.center.lat() - 0.005, google_api_obj.map_default_options.center.lng() - 0.005),
			new google.maps.LatLng(google_api_obj.map_default_options.center.lat() + 0.005, google_api_obj.map_default_options.center.lng() + 0.005)
		);

		this.text_search_options = { bounds: this.text_search_bounds };

		this.autocomplete = new google.maps.places.SearchBox(this.text_search_input, this.text_search_options);

		this.autocomplete.bindTo('bounds', google_api_obj.map);

	};

	this.places.text_search = function() {

		this.text_search_input = document.getElementById('location_search').value;

		$(".search_findings").empty();
		$(".search_keyword").text("'"+google_api_obj.places.text_search_input+"'");

		this.text_search_properties = {
			query: this.text_search_input,
			location: google_api_obj.map_default_options.center,
			radius: google_api_obj.trip_mode_radius[google_api_obj.trip_mode]
		};

		google_api_obj.places.service.textSearch(this.text_search_properties, function(locations, status, pagination) {

			if (status == "OK") {

				$(locations).each(function() {

					// debug_report(this);

					$(".search_findings").append(
						'<div class="row">'+
						'<div class="small-2 columns"><a class="tiny button radius glyph expand" title="Add '+this.name+' to destinations" onclick="google_api_obj.add_destination(\''+this.formatted_address+'\', \''+escape(this.name)+'\')">+</a></div>'+
						'<div class="small-offset-1 small-9 columns">'+
						'<div><strong>'+this.name+'</strong></div>'+
						'<div><em>'+google_api_obj.places.types[this.types[0]]+'</em> <img src="'+this.icon+'" style="height: 1em;"></div>'+
						'<div>'+this.formatted_address+'</div>'+
						'</div></div><br>');

				});

				// pagination.nextPage();

				// debug_report(locations);

				$('#search_modal').foundation('reveal', 'open');				

			}

		});

	};

	this.add_destination = function(destination, name) {
		
		if (google_api_obj.destination != "" && google_api_obj.destination != destination) {
			google_api_obj.waypoints.push({
	          location: google_api_obj.destination,
	          stopover: true
			});
		}

		google_api_obj.destination = destination;

		// debug_report(unescape(name));

		$('#search_modal').foundation('reveal', 'close');

		google_api_obj.calculate_route();

		$(".trip.title").click();

	};

	this.calculate_route = function() {

		var waypoints = google_api_obj.waypoints;
		if (google_api_obj.trip_mode == "TRANSIT") { waypoints = []; }

		var request = {
			origin: google_api_obj.start_location,
			destination: google_api_obj.destination,
			waypoints: waypoints,
			provideRouteAlternatives: true,
			optimizeWaypoints: true,
			durationInTraffic: true,
			avoidHighways: true,
			travelMode: google.maps.TravelMode[google_api_obj.trip_mode]
		};
		
		google_api_obj.directions_service.route(request, function(response, status) {
			
			// debug_report(response);

			if (status == google.maps.DirectionsStatus.OK) {
				google_api_obj.directions_display.setDirections(response);
			}

		});
		
		$(".no.destination.selected").hide();
		$(".updated.trip.details.button").removeClass("secondary").addClass("success");
		$('#map_modal').foundation('reveal', 'open');

	};

};