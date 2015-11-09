/*=============================================
[Standard JavaScript Behaviours, HTML Template]
Version: 3.0
Author: Kevin Montgomery
==============================================*/

/* [Debug Tool] */
function debug_report(item) {
	
	try {

		if (console && 
			(
				typeof item === "function" ||
				typeof item === "object"
			)
		) {
		 	console.log("Analyzing "+typeof item+" item.");
		 	console.log(item);
		} 

		else if (console && typeof item === "string") {
			console.log(item);
		}

		else { throw "Console not supported. Item is not an object, function, or string."}

	}

	catch (error) {
		if(console) {
		 	console.log("Error caught: "+error);
		 }
	}
	
	finally {
		window.onerror = function(message, url, linenumber) {
			if(console) {
			 	console.log("Error: " + message + " on line " + linenumber + " for " + url);
			 }
		}
	}

	
}

/* [Safe Execute] */
function safe_exec(input) {

	debug_report("Safely executing item");

	try {
		if (typeof input === "function") { input(); }
		else if (typeof input === "object") { debug_report(input); }
		else { throw "Not a function or an object." }
	}

	catch (error) {
		debug_report("Error caught:");
		debug_report(error); // statements to handle any unspecified exceptions
		debug_report(input);
	}
	
	finally {
		window.onerror = function(message, url, linenumber) {
			debug_report("Error: " + message + " on line " + linenumber + " for " + url);
		}
	}
}

$(document).ready(function(){
	
	/* [TypeSet Body Copy] */
	/* $("body, p, label, input, select").typeset(); */
	
	/*
	[If Retina Display, Load 2x Pixel Images]
	var retina = window.devicePixelRatio > 1;
	if (retina) {
		$('img[src!="svg"]').attr('src', function () {
			return $(this).attr('src').replace(/\.(png|jpg|gif)+$/i, '@2x.$1');
		});
	}
	*/
	
	/* [Default Link Behaviour] */
	if (adaptive_scripts.attach_scrollto) {
		$("a").click(function(event) {

			// Override default behaviour
			event.preventDefault();
			var url = $(this).attr("href");
			var rel = $(this).attr("rel");
			
			if (url && url !== "#" && !rel) {

				// If link is local, smooth-scroll to it
				if (url.substr(0,1) == "#" && adaptive_scripts.attach_scrollto) {
					$.scrollTo($(url), 1000);
				
				// Otherwise, fade the page out, then go to the link
				} else {
					$(".container").fadeOut("fast").css("display: none");
					document.location.href=url;
				}
			} 
		});

	}
	
});