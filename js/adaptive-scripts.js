/* [Adaptive Scripts */
var adaptive_scripts = {
	breakpoints: [1680, 1600, 1440, 1366, 1360, 1280, 1152, 1024, 800, 640],
	resolution: Math.max(screen.width,screen.height),
	sorted_breakpoints: function() { return this.breakpoints.sort(function(a,b){return a-b}); }	
};
	
if (adaptive_scripts.resolution > adaptive_scripts.sorted_breakpoints()[0]) {
	
	/* Sans Serif: Source Sans */
	var attach_sourcesans = document.createElement("link");
	attach_sourcesans.setAttribute("rel", "stylesheet");
	attach_sourcesans.setAttribute("href", "fonts/source-sans/stylesheet.css?ver=3.0");
	attach_sourcesans.setAttribute("type", "text/css");
	attach_sourcesans.setAttribute("media", "all");
	document.getElementsByTagName("head")[0].appendChild(attach_sourcesans);
	
	/* [Attach MaxMind GeoIP] */
	var attach_geoip = document.createElement("script");
	attach_geoip.setAttribute("src", "http://j.maxmind.com/app/geoip.js");
	document.getElementsByTagName("head")[0].appendChild(attach_geoip);
		
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
		
	/* [Attach Scroll To 1.4.3.1] */
	var attach_scrollto = document.createElement("script");
	attach_scrollto.setAttribute("src", "js/vendor/jquery.scrollTo-1.4.3.1-min.js?ver=1.4.3.1");
	document.getElementsByTagName("body")[0].appendChild(attach_scrollto);
	
}