/* [Adaptive Scripts */
var adaptive_scripts = {
	breakpoints: [1680, 1600, 1440, 1366, 1360, 1280, 1152, 1024, 800, 640],
	resolution: Math.max(screen.width,screen.height),
	sorted_breakpoints: function() { return this.breakpoints.sort(function(a,b){return a-b}); }	
};
	
if (adaptive_scripts.resolution > adaptive_scripts.sorted_breakpoints()[0]) {
	
	/* Sans Serif: Source Sans */
	adaptive_scripts.attach_sourcesans = document.createElement("link");
	adaptive_scripts.attach_sourcesans.setAttribute("rel", "stylesheet");
	adaptive_scripts.attach_sourcesans.setAttribute("href", "fonts/source-sans/stylesheet.css?ver=3.0");
	adaptive_scripts.attach_sourcesans.setAttribute("type", "text/css");
	adaptive_scripts.attach_sourcesans.setAttribute("media", "all");
	document.getElementsByTagName("head")[0].appendChild(adaptive_scripts.attach_sourcesans);
	
	/* [Attach MaxMind GeoIP] */
	/*
	var attach_geoip = document.createElement("script");
	attach_geoip.setAttribute("src", "//j.maxmind.com/app/geoip.js");
	document.getElementsByTagName("head")[0].appendChild(attach_geoip);
	*/

	/* 
	Usage:
	geoip_city()
	geoip_region()
	geoip_region_name()
	geoip_postal_code()
	geoip_country_code()
	geoip_country_name()
	geoip_latitude()
	geoip_longitude()
	*/

	/* [Attach MaxMind GeoIP 2.0 if navigator.geolocation is not supported] */
	if (!navigator.geolocation) {
		adaptive_scripts.attach_geoip2 = document.createElement("script");
		adaptive_scripts.attach_geoip2.setAttribute("src", "//j.maxmind.com/js/apis/geoip2/v2.0/geoip2.js");
		document.getElementsByTagName("head")[0].appendChild(adaptive_scripts.attach_geoip2);
	}
		
	/* [Attach Scroll To 1.4.3.1] */
	adaptive_scripts.attach_scrollto = document.createElement("script");
	adaptive_scripts.attach_scrollto.setAttribute("src", "js/vendor/jquery.scrollTo-1.4.3.1-min.js?ver=1.4.3.1");
	document.getElementsByTagName("body")[0].appendChild(adaptive_scripts.attach_scrollto);
	
}