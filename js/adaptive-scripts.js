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
		
	/* [Attach Scroll To 1.4.3.1] */
	adaptive_scripts.attach_scrollto = document.createElement("script");
	adaptive_scripts.attach_scrollto.setAttribute("src", "js/vendor/jquery.scrollTo-1.4.3.1-min.js?ver=1.4.3.1");
	document.getElementsByTagName("body")[0].appendChild(adaptive_scripts.attach_scrollto);
	
}